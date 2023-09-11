import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox,  Alert,
  Snackbar, } from '@mui/material';

import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../../../components/iconify';

import axios from 'axios';
import { API_SERVER } from '../../../constants';

import { setWsResponse } from '../../../App'

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [alertType, setAlertType] = useState('success');
  const [loginData, setloginData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async () => {


    await axios.post(`${API_SERVER}/api/login`,
      loginData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(function (response){
      setAlertType('success');
      setUploadResponse('Login Successful');
      setTimeout(() => navigate('/videos'), 2000);
    })
    .catch(function (error){
      setAlertType('error');
      setUploadResponse(error.response.data.message);
    });

  };

  const handleInput =  (event) => {

    setloginData({
      ...loginData,
      [event.target.name]: event.target.value
    })

  };



  return (
    <>
      <Stack>
        <Snackbar
          open={uploadResponse}
          autoHideDuration={5000}
          onClose={() => {
            setUploadResponse(null);
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => {
              setUploadResponse(null);
            }}
            severity={alertType}
          >
            {uploadResponse}
          </Alert>
        </Snackbar>
      </Stack>

      <Stack spacing={3}>
        <TextField name="email" onChange={handleInput} label="Email address" />

        <TextField
          name="password"
          onChange={handleInput}
          label="Password"
          type={showPassword ? 'text' : 'password'}
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
        Login
      </LoadingButton>
    </>
  );
}
