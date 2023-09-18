// react
import ReactPlayer from 'react-player';
import React, { useState, useEffect, useContext } from 'react';
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

// Context
import { SetAlertContext } from "../contexts/AlertContext";

//constants
import { API_SERVER, VIDEO_SERVER } from '../constants';

//other
import axios from 'axios';


// ----------------------------------------------------------------------


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

export default function VideoPlayerPage() {
  const [url, setUrl] = useState('');
  const setAlertContext = useContext(SetAlertContext);
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
      </CardContent>
      <CardActions>
        <Button 
          size='small'
          onClick={() => {
            navigate(`/video/update/${id}`)
          }}
        >
          Update Video
        </Button>
      </CardActions>

      <CardActions>
        <Button
          size='small'
          onClick={() => {
            navigate('/videos');
          }}
        >
          Back to Video list page
        </Button>
      </CardActions>
    </React.Fragment>
  );

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(
        `${API_SERVER}/api/videos/detail/${id}`,
        {
          withCredentials: true,
        }
      )
      .then(function (response){
        setData(response.data);
        const u = `${VIDEO_SERVER}/${response.data.fileName}.m3u8`;
        setUrl(u);
      })
      .catch(function (error){
        setAlertContext({type:'error', message: error.response.data.message});
        if(error.response.status===401){
          setTimeout(() => navigate('/login'), 3000);
        }
      });
    };
    fetchData();
  }, [id]);


  return (
    <>
      <Helmet>
        <title> Video</title>
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
