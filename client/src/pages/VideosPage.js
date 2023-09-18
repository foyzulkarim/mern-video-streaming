// react
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Container, Stack, Typography } from '@mui/material';

// components
import {
  VideoSort,
  VideoList,
  ProductCartWidget,
  ProductFilterSidebar,
} from '../sections/@dashboard/products';

// other
import axios from 'axios';

// Context
import { SetAlertContext } from "../contexts/AlertContext";

// constants
import { API_SERVER } from '../constants';


// ----------------------------------------------------------------------


export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [videos, setVideos] = useState([]);
  const setAlertContext = useContext(SetAlertContext);

  const navigate = useNavigate();


  useEffect(() => {
    const getData = async () => {
      await axios.post(
        `${API_SERVER}/api/videos/search`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(function (response){
        response.data.sort((a, b) => b.viewCount - a.viewCount===0 ? new Date(b.recordingDate) - new Date(a.recordingDate) : b.viewCount - a.viewCount);
        setVideos(response.data);
      })
      .catch(function (error){
        setAlertContext({type:'error', message: error.response.data.message});
        if(error.response.status===401){
          setTimeout(() => navigate('/login'), 3000);
        }
      });

    };

    getData();
  }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Videos </title>
      </Helmet>

      <Container>
        <Typography variant='h4' sx={{ mb: 5 }}>
          Videos
        </Typography>

        <Stack
          direction='row'
          flexWrap='wrap-reverse'
          alignItems='center'
          justifyContent='flex-end'
          sx={{ mb: 5 }}
        >
          <Stack direction='row' spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <VideoSort setVideos={setVideos}/>
          </Stack>
        </Stack>

        <VideoList videos={videos} />
        <ProductCartWidget />
      </Container>
    </>
  );
}
