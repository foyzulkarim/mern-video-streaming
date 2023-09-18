// @mui
import { styled } from '@mui/material/styles';
import {
  Container,
  Stack,
  TextField,
  FormControl,
  Typography,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { LoadingButton } from '@mui/lab';

// @mui-x
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// react
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Context
import { SetAlertContext } from "../contexts/AlertContext";

// others
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

//constants
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
  language: yup.string(),
  recordingDate: yup.date().required('Recording date is required'),
  category: yup.string().required('Category is required'),
});

export default function VideoEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const setAlertContext = useContext(SetAlertContext);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    visibility: 'Public',
    thumbnailUrl: 'test',
    language: 'Bangla',
    recordingDate: new Date(),
    category: 'Education',

  });


  useEffect(() => {
    const fetchData = async () => {
      await axios.get(
        `${API_SERVER}/api/videos/detail/${id}`,
        {
          withCredentials: true,
        }
      )
      .then(function (response){
        setInitialValues(response.data)
      })
      .catch(function (error){
        setAlertContext({type:'error', message: error.response.data.message});
        if(error.response.status===401){
          setTimeout(() => navigate('/login'), 3000);
        }
      });
    };
    
    if(id){
      fetchData();
    }else{
      setAlertContext({type:'error', message: 'Undefined Id'});
    }
    
  }, [id]);

  // axios post the values to the backend
  const putToServer = async (videoInfo) => {

    const formData = new FormData();

    formData.append('title', videoInfo.title);
    formData.append('visibility', videoInfo.visibility);
    formData.append('category', videoInfo.category);
    formData.append('description', videoInfo.description);
    formData.append('recordingDate', videoInfo.recordingDate);
    // formData.append("language", videoInfo.language);

    await axios.put(
      `${API_SERVER}/api/videos/update/${id}`,
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
      setAlertContext({type:'success', message: 'Video edit successfull'});
      setTimeout(() => navigate('/videos'), 3000);
    })
    .catch(function (error){
      setAlertContext({type:'error', message: error.response.data.message});
      if(error.response.status===401){
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }

    });

  };

  const formik = useFormik({

    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (videoInfo) => {
      await putToServer(videoInfo);
    },
    validate: (videoInfo) => {
      const errors = {};
    //   if (!values.videoFile) {
    //     errors.videoFile = 'Video file is required';
    //   }
      return errors;
    },
  });

  return (
    <>
      <Helmet>
        <title>Update Video</title>
      </Helmet>

      <>
        <Container>
          <StyledContent>
            <Typography variant='h4' sx={{ mb: 5 }}>
                Update Video
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                
                {/* video file name display here */}

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
                  Update
                </LoadingButton>
              </Stack>
            </form>
          </StyledContent>
        </Container>
      </>
    </>
  );
}
