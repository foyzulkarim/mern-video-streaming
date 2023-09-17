// react
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// other
import axios from 'axios';

// components
import Iconify from '../../components/iconify';
// import  ShowAlert  from '../../components/alert';

// Context
import { SetAlertContext } from "../../contexts/AlertContext";

// constants
import { API_SERVER } from '../../constants';


// ----------------------------------------------------------------------


export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setloginData] = useState({
    email: '',
    password: ''
  });

  const setAlertContext = useContext(SetAlertContext);

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
      console.log(response.data.user.name)
      localStorage.setItem("name", response.data.user.name);
      localStorage.setItem("email", response.data.user.email);
      setAlertContext({type:'success', message: 'Login Successful'});

      setTimeout(() => navigate('/videos'), 1000);
    })
    .catch(function (error){
      setAlertContext({type:'error', message: error.response.data.message});
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

      {/* <ShowAlert data={{alertType, alertMessage, setAlertMessage}} /> */}
      
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
