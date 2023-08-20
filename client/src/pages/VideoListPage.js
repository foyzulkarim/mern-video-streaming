import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useCallback } from 'react';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import axios from 'axios';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { API_SERVER } from '../constants';

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(1);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rows, setRows] = useState([]);

  const deleteUser = useCallback(
    (id) => () => {
      setTimeout(() => {
        // setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        console.log('delete', id);
      });
    },
    []
  );

  const toggleAdmin = useCallback(
    (id) => () => {
      // setRows((prevRows) =>
      //   prevRows.map((row) =>
      //     row.id === id ? { ...row, isAdmin: !row.isAdmin } : row
      //   )
      // );
      console.log('toggleAdmin', id);
    },
    []
  );

  const duplicateUser = useCallback(
    (id) => () => {
      // setRows((prevRows) => {
      //   const rowToDuplicate = prevRows.find((row) => row.id === id);
      //   return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      // });
      console.log('duplicate', id);
    },
    []
  );

  const handleRowClick = (params) => {
    console.log(`clicked`, params.row);
  };

  // const rows = [
  //   { id: 1, col1: 'Hello', col2: 'World' },
  //   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  //   { id: 3, col1: 'MUI', col2: 'is Amazing' },
  // ];

  const columns = [
    { field: '_id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 130 },
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
    isDecending: true,
    pageNumber: 1,
    limit: 1,
  });

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(
        `${API_SERVER}/api/videos/search`,
        searchPayload
      );
      // setVideos(response.data);
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
      setRowCountState(4);
    };

    getData();
  }, [searchPayload]);

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
                  pagination: { paginationModel: { pageSize: 1 } },
                }}
                columnVisibilityModel={{
                  // Hide columns status and traderName, the other columns will remain visible
                  id: false,
                  _id: false,
                }}
                rows={rows}
                columns={columns}
                pageSizeOptions={[1, 5, 10, 25]}
                paginationMode='server'
                paginationModel={paginationModel}
                rowCount={rowCountState}
                onPaginationModelChange={setPaginationModel}
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
