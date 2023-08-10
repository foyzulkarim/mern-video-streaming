import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import {
  Typography,
  Card,
  Box,
  CardActions,
  CardContent,
  Button,
} from '@mui/material';

import { API_SERVER, VIDEO_SERVER } from '../constants';

import ReactPlayer from 'react-player';

import axios from 'axios';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'top',
  alignContent: 'center',
  alignItems: 'left',
  flexDirection: 'column',
  padding: theme.spacing(0, 0),
}));

export default function VideoUploadPage() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState({
    title: '',
    description: '',
    visibility: 'Public',
    thumbnailUrl: '',
    language: 'Bangla',
    recordingDate: '',
    category: 'Education',
    videoFile: null,
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const navigateToContacts = () => {
    // 👇️ navigate to /contacts
    navigate('/videos');
  };

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant='h6' component='div'>
          Category: {data?.category}
        </Typography>
        <Typography sx={{ fontSize: 16 }} color='text.secondary'>
          Description: {data?.description}
        </Typography>

        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          Visibility: {data?.visibility}
        </Typography>
        {/* <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                </Typography> */}
      </CardContent>
      <CardActions>
        <Button
          size='small'
          onClick={() => {
            navigateToContacts();
          }}
        >
          Back to Video list page
        </Button>
      </CardActions>
    </React.Fragment>
  );

  useEffect(() => {
    console.log('id', id);

    const fetchData = async () => {
      const response = await axios.get(`${API_SERVER}/api/videos/detail/${id}`);
      // console.log(response);
      setData(response.data);
      // const videoDetails = await axios.get(

      // )
      const u = `${VIDEO_SERVER}/${response.data.fileName}.m3u8`;
      setUrl(u);
    };

    fetchData();
  }, [id]);
  console.log(data);

  return (
    <>
      <Helmet>
        <title> Video upload</title>
      </Helmet>
      <Box
        sx={{
          bgcolor: '#eceff1',
          boxShadow: 1,
          borderRadius: 2,
          p: 2,
          minWidth: 300,
        }}
      >
        <StyledContent>
          <Typography variant='h4' sx={{ mb: 5 }}>
            {data?.title || 'Upload video'}
          </Typography>

          <ReactPlayer
            url={url}
            controls
            playing={false}
            width='100%'
            height='100%'
            config={{
              file: {
                attributes: { controlsList: 'nodownload' },
              },
            }}
          />
          {/* <Box
                    sx={{
                        bgcolor: "#fff7d6",
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 2,
                        minWidth: 300,
                    }}
                > */}
          <Card variant='outlined'>{card}</Card>
          {/* </Box> */}
        </StyledContent>
      </Box>
    </>
  );
}
