// react
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import {
  Container,
  Stack,
  TextField,
  FormControl,
  Typography,
  Button,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { LoadingButton } from '@mui/lab';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// other 
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

// components
import  ShowAlert  from '../components/alert';

// constants
import { API_SERVER } from '../constants';


// ----------------------------------------------------------------------


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

/**
 *  Create a MUI form to save below video properties: 
    title, description, visibility, 
    thumbnailUrl, language, recordingDate, 
    category,
 */

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  visibility: yup.string().required('Visibility is required'),
  thumbnailUrl: yup.string().required('Thumbnail URL is required'),
  language: yup.string().required('Language is required'),
  recordingDate: yup.date().required('Recording date is required'),
  category: yup.string().required('Category is required'),
});

export default function VideoUploadPage() {

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');

  const navigate = useNavigate();

  // axios post the values to the backend
  const postToServer = async (values) => {
    
    const {
      title,
      category,
      description,
      recordingDate,
      visibility,
    } = values;
    const videoFile = values.videoFile;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('visibility', visibility);
    formData.append('category', category);
    formData.append('description', description);
    // formData.append("language", language);
    formData.append('recordingDate', recordingDate);
    formData.append('video', videoFile);

    await axios.post(
      `${API_SERVER}/api/videos/upload`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '*/*',
        }
      }
    )
    .then(function (response){
      setAlertType('success');
      setAlertMessage('Video upload successfull');
      setTimeout(() => navigate('/videos'), 3000)
    })
    .catch(function (error){
      setAlertType('error');
      setAlertMessage(error.response.data.message);
      if(error.response.status===401){
        setTimeout(() => navigate('/login'), 3000);
      }
      
    });

  };

  const formik = useFormik({
    initialErrors: {
      videoFile: 'Video file is required',
    },
    initialValues: {
      title: '',
      description: '',
      visibility: 'Public',
      thumbnailUrl: 'test',
      language: 'Bangla',
      recordingDate: new Date(),
      category: 'Education',
      videoFile: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await postToServer(values);
    },
    validate: (values) => {
      const errors = {};
      if (!values.videoFile) {
        errors.videoFile = 'Video file is required';
      }
      // check videoFile size
      if (values.videoFile?.size > 52428000) {
        errors.videoFile = 'Video file size should be less than 50MB';
      }
      // check videoFile type, must be video/mp4 or video/x-matroska
      if (
        values.videoFile?.type !== 'video/mp4' &&
        values.videoFile?.type !== 'video/webm'
      ) {
        errors.videoFile = 'Video file type should be .mp4 or .webm';
      }

      return errors;
    },
  });

  return (
    <>
      <Helmet>
        <title> Video upload</title>
      </Helmet>
      <ShowAlert data={{alertType, alertMessage, setAlertMessage}} />
      <>
        <Container>
          <StyledContent>
            <Typography variant='h4' sx={{ mb: 5 }}>
              Upload video
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <label htmlFor='video'>
                  <input
                    style={{ display: 'none' }}
                    name='video'
                    accept='video/*'
                    id='video'
                    type='file'
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      formik.setFieldValue('videoFile', file);
                    }}
                  />
                  <Button
                    color='secondary'
                    variant='contained'
                    component='span'
                  >
                    Upload video
                  </Button>
                </label>
                {/* video file name display here */}
                <TextField
                  value={formik.values.videoFile?.name}
                  error={Boolean(formik.errors?.videoFile)}
                  helperText={formik.errors?.videoFile}
                />
                <TextField
                  id='title'
                  name='title'
                  label='Video title'
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                  id='description'
                  name='description'
                  label='Video description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
                <FormControl fullWidth>
                  <InputLabel id='visibility-select-label'>
                    Visibility
                  </InputLabel>
                  <Select
                    labelId='visibility-select-label'
                    id='visibility-simple-select'
                    name='visibility'
                    label='Visibility'
                    value={formik.values.visibility}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.visibility)}
                    helperText={formik.errors.visibility}
                  >
                    <MenuItem value={'Public'}>Public</MenuItem>
                    <MenuItem value={'Private'}>Private</MenuItem>
                    <MenuItem value={'Unlisted'}>Unlisted</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id='language-select-label'>Language</InputLabel>
                  <Select
                    labelId='language-select-label'
                    id='language-simple-select'
                    label='Language'
                    value={formik.values.language}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.language)}
                    helperText={formik.errors.language}
                  >
                    <MenuItem value={'English'}>English</MenuItem>
                    <MenuItem value={'Bangla'}>Bangla</MenuItem>
                    <MenuItem value={'Spanish'}>Spanish</MenuItem>
                    <MenuItem value={'Hindi'}>Hindi</MenuItem>
                    <MenuItem value={'Urdu'}>Urdu</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Publish Date'
                    value={formik.values.recordingDate}
                    inputFormat='DD/MM/YYYY'
                    onChange={(newValue) => {
                      formik.setFieldValue('recordingDate', newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <FormControl fullWidth>
                  <InputLabel id='category-select-label'>Category</InputLabel>
                  <Select
                    labelId='category-select-label'
                    id='category-simple-select'
                    value={formik.values.category}
                    label='Category'
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.category)}
                    helperText={formik.errors.category}
                  >
                    <MenuItem value={'Education'}>Education</MenuItem>
                    <MenuItem value={'Technology'}>Technology</MenuItem>
                    <MenuItem value={'Travel'}>Travel</MenuItem>
                    <MenuItem value={'Others'}>Others</MenuItem>
                  </Select>
                </FormControl>
                <LoadingButton
                  //fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  Upload
                </LoadingButton>
              </Stack>
            </form>
          </StyledContent>
        </Container>
      </>
    </>
  );
}
