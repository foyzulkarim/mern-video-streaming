// @mui
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Card,
  Stack,
  Button,
  Popover,
  MenuItem,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';

// @mui-x
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

// react
import { useState, useEffect, useCallback, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// Context
import { SetAlertContext } from "../contexts/AlertContext";

// other
import moment from 'moment';
import axios from 'axios';
import { API_SERVER } from '../constants';


// ----------------------------------------------------------------------


export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [rows, setRows] = useState([]);
  const setAlertContext = useContext(SetAlertContext);

  const deleteVideo = useCallback(
    (id) => () => {
      setTimeout(() => {
        console.log('delete', id);
      });
    },
    []
  );

  const navigate = useNavigate();

  const columns = [
    { field: '_id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'duration', headerName: 'Duration', type: 'number', width: 90 },
    { field: 'viewCount', headerName: 'Views', type: 'number', width: 90 },
    { field: 'status', headerName: 'Status', width: 90 },
    { 
      field: 'recordingDate', 
      headerName: 'Date', 
      width: 200,
      valueFormatter: params => moment(params?.value).format("DD/MM/YYYY hh:mm A")
     },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Action',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Update'
          onClick={ () =>  navigate(`/video/update/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Delete'
          onClick={deleteVideo(params.id)}
        />,
      ],
    },
  ];

  const [searchPayload, setSearchPayload] = useState({
    keyword: '',
    sortKey: '',
    sortValue: 1,
    isDecending: true,
    pageNumber: 1,
    limit: 2,
    filterKey: '',
    filterValue: '',
  });

  useEffect(() => {
    const getData = async () => {

      await axios.post(
        `${API_SERVER}/api/videos/search`,
        searchPayload,
        {
          withCredentials: true,
        }
      )
      .then(function (response){
        const videos = response.data.map((video) => {
          video.id = video._id;
          return video;
        });
  
        setRows(videos);
      })
      .catch(function (error){
        setAlertContext({type:'error', message: error.response.data.message});
        if(error.response.status===401){
          setTimeout(() => navigate('/login'), 3000);
        }
      });

    };

    getData();
  }, [searchPayload]);

  useEffect(() => {
    const getCount = async () => {
      let countFilter = {};
      if (searchPayload.filterKey) {
        countFilter = {
          filterKey: searchPayload.filterKey,
          filterValue: searchPayload.filterValue,
        };
      }

      await axios.post(
        `${API_SERVER}/api/videos/count`,
        countFilter,
        {
          withCredentials: true,
        }
      )
      .then(function (response){
        setRowCountState(response.data.count);
      })
      .catch(function (error){
        if(error.response.status===401){
          setTimeout(() => navigate('/login'), 3000);
        }
      });

    };

    getCount();
  }, [searchPayload.filterKey, searchPayload.filterValue]);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [rowCountState, setRowCountState] = useState(0);

  useEffect(() => {
    setSearchPayload((prevSearchPayload) => {
      return {
        ...prevSearchPayload,
        pageNumber: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      };
    });
  }, [paginationModel]);

  const handleSortModelChange = useCallback((sortModel) => {
    if (sortModel.length) {
      setSearchPayload((prevSearchPayload) => {
        return {
          ...prevSearchPayload,
          sortKey: sortModel[0].field,
          sortValue: sortModel[0].sort === 'desc' ? -1 : 1,
          isDecending: sortModel[0].sort === 'desc',
        };
      });
    }
  }, []);

  const onFilterChange = useCallback((filterModel) => {
    if (filterModel.items.length) {
      setSearchPayload((prevSearchPayload) => {
        return {
          ...prevSearchPayload,
          keyword: filterModel.items[0].value,
          filterKey: filterModel.items[0].field,
          filterValue: filterModel.items[0].value,
        };
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title> Video List </title>
      </Helmet>

      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Videos
          </Typography>
          <Button
            variant='contained'
            startIcon={<Iconify icon='eva:plus-fill' />}
            onClick={() => {
              navigate('/video-upload')
            }}
          >
            New Video
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <DataGrid
                initialState={{
                  pagination: { paginationModel: { pageSize: 2 } },
                  sorting: {
                    sortModel: [
                      {
                        field: 'id',
                        sort: 'desc',
                      },
                    ],
                  },
                }}
                columnVisibilityModel={{
                  id: false,
                  _id: false,
                }}
                rows={rows}
                columns={columns}
                pageSizeOptions={[1, 2, 3, 5, 10, 25]}
                paginationMode='server'
                paginationModel={paginationModel}
                rowCount={rowCountState}
                onPaginationModelChange={setPaginationModel}
                sortingMode='server'
                onSortModelChange={handleSortModelChange}
                filterMode='server'
                onFilterModelChange={onFilterChange}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
              />
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
