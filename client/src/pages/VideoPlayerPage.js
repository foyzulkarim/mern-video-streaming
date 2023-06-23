import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import {
  Container,
  Stack,
  TextField,
  FormControl,
  Typography,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { LoadingButton } from '@mui/lab';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ReactPlayer from 'react-player';

import axios from 'axios';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'left',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function VideoUploadPage() {
  const [url, setUrl] = useState('');
  const { id } = useParams();

  useEffect(() => {
    console.log('id', id);

    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:4000/api/videos/detail/${id}`
      );
      console.log(response);
      const u = `http://localhost:4001/${response.data.fileName}.m3u8`;
      setUrl(u);
    };

    fetchData();
  }, [id]);

  return (
    <>
      <Helmet>
        <title> Video upload</title>
      </Helmet>

      <>
        <Container>
          <StyledContent>
            <Typography variant='h4' sx={{ mb: 5 }}>
              Upload video
            </Typography>
            <Stack>
              <ReactPlayer
                url={url}
                controls
                playing={false}
                width='100%'
                height='100%'
                config={{
                  file: { attributes: { controlsList: 'nodownload' } },
                }}
              />
            </Stack>
          </StyledContent>
        </Container>
      </>
    </>
  );
}
