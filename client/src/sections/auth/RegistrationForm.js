// react
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// other
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';

// components
import Iconify from '../../components/iconify';

// constants
import { API_SERVER } from '../../constants';

// pages
import  ShowAlert  from '../../pages/alert'



// ----------------------------------------------------------------------

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string()
  .required('Password is required')
  .min(4, 'Password length must be at least 4 characters long'),
  // .matches(/[a-zA-Z0-9]/, 'Password can only contain Alphanumeric letters.'),
  confirmPassword: yup.string()
  .oneOf([yup.ref('password')], 'Passwords must match'),
});



export default function RegistrationForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');
  

  const registerUser = async (values, setFieldError) => {

    delete values.confirmPassword;

    await axios.post(`${API_SERVER}/api/registration`,
      values,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(function (response){
      setAlertType('success');
      setAlertMessage('Registration Successful');
      setTimeout(() => navigate('/login'), 2000);
    })
    .catch(function (errors){
      setAlertType('error');
      setAlertMessage('Something went wrong');
      errors.response.data.message.details.forEach((error) => {
        setFieldError(error.context.key, error.message)
      })
    });

  };


  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: ''
    },

    validationSchema: validationSchema,

    onSubmit: async (values, formikHelpers) => await registerUser(values, formikHelpers.setFieldError),

  });



  return (
    <>

      <ShowAlert data={{alertType, alertMessage, setAlertMessage}} />

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>

          <TextField 
            name="name"  
            label="Your name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField 
            name="email"  
            label="Email address" 
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
          </Stack>

        </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Registration
        </LoadingButton>

      </form>
    </>

  );
}
