import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
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

import { API_SERVER } from '../constants';



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
  const [videoFileName, setVideoFileName] = useState('');
  const navigate = useNavigate();
  const navigateToVideos = () => {
    // 👇️ navigate to /contacts
    navigate('/videos');
  };

  // axios post the values to the backend
  const postToServer = async (values, _) => {
    console.log(values);
    const {
      title,
      category,
      description,
      language,
      recordingDate,
      visibility,
      videoFile
    } = values; 
    const formData = new FormData();
    formData.append('title', title);
    formData.append('visibility', visibility);
    formData.append('category', category);
    formData.append('description', description);
    formData.append("language", language);
    formData.append('recordingDate', recordingDate);
    formData.append('video', videoFile);
    try {
      const response = await axios.post(`${API_SERVER}/api/videos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '*/*',
        },
      });
      toast.success(response.data.message) 
      console.log(response);
      setTimeout(() => navigateToVideos(), 3000);
    } catch (error) {
      toast.error(error.response.data.error.message)
      console.log(error); 
    }
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
      language: 'bn',
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
                      const file = e.target.files[0];       
                      if(file){
                        setVideoFileName(file.name)        
                        formik.setFieldValue('videoFile', file);
                      }  
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
                {
                  videoFileName && <TextField                 
                  value={ videoFileName } 
                  error={Boolean(formik.errors?.videoFile)} 
                  helperText={formik.errors?.videoFile}
                />
                }
                <TextField
                  id='title'
                  name='title'
                  label='Video title'
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)} 
                />
                <TextField
                multiline
                rows={5}
                  id='description'
                  name='description'
                  label='Video description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
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
                  >
                    <MenuItem value={'Public'}>Public</MenuItem>
                    <MenuItem value={'Private'}>Private</MenuItem>
                    <MenuItem value={'Unlisted'}>Unlisted</MenuItem>
                  </Select>
                </FormControl>
                {/* <TextField
                                    id="thumbnailUrl"
                                    name="thumbnailUrl"
                                    label="Thumbnail URL"
                                    value={formik.values.thumbnailUrl}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.thumbnailUrl &&
                                        Boolean(formik.errors.thumbnailUrl)
                                    }
                                    helperText={
                                        formik.touched.thumbnailUrl &&
                                        formik.errors.thumbnailUrl
                                    }
                                /> */}
                <FormControl fullWidth>
                  <InputLabel id='language-select-label'>Language</InputLabel>
                  <Select
                    labelId='language-select-label'
                    id='language-simple-select'
                    name='language'
                    label='Language'
                    value={formik.values.language}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.language)} 
                  >
                    <MenuItem value={'en'}>English</MenuItem>
                    <MenuItem value={'bn'}>Bangla</MenuItem>
                    <MenuItem value={'es'}>Spanish</MenuItem>
                    <MenuItem value={'hi'}>Hindi</MenuItem>
                    <MenuItem value={'ur'}>Urdu</MenuItem>
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
                    name='category'
                    value={formik.values.category}
                    label='Category'
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.category)} 
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
