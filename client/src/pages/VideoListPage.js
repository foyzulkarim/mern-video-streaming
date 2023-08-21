import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import axios from 'axios';

// @mui
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
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { API_SERVER } from '../constants';

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [rows, setRows] = useState([]);

  const deleteUser = useCallback(
    (id) => () => {
      setTimeout(() => {
        console.log('delete', id);
      });
    },
    []
  );

  const toggleAdmin = useCallback(
    (id) => () => {
      console.log('toggleAdmin', id);
    },
    []
  );

  const duplicateUser = useCallback(
    (id) => () => {
      console.log('duplicate', id);
    },
    []
  );

  const columns = [
    { field: '_id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'duration', headerName: 'Duration', type: 'number', width: 90 },
    { field: 'viewCount', headerName: 'Views', type: 'number', width: 90 },
    { field: 'status', headerName: 'Status', width: 90 },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Delete'
          onClick={deleteUser(params.id)}
        />,
        <GridActionsCellItem
          icon={<SecurityIcon />}
          label='Toggle Admin'
          onClick={toggleAdmin(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<FileCopyIcon />}
          label='Duplicate User'
          onClick={duplicateUser(params.id)}
          showInMenu
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
      const response = await axios.post(
        `${API_SERVER}/api/videos/search`,
        searchPayload
      );

      const videos = response.data.map((video) => {
        video.id = video._id;
        return video;
      });

      console.log(
        'getData: payload ',
        searchPayload,
        'result:',
        response.data,
        'videos',
        videos
      );
      setRows(videos);
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
      const countResponse = await axios.post(
        `${API_SERVER}/api/videos/count`,
        countFilter
      );
      setRowCountState(countResponse.data.count);
    };

    getCount();
  }, [searchPayload.filterKey, searchPayload.filterValue]);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 1,
  });

  const [rowCountState, setRowCountState] = useState(0);

  useEffect(() => {
    console.log('paginationModel', paginationModel);
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
        <title> User | Minimal UI </title>
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
