import { Navigate, useLocation, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import VideoUploadPage from './pages/VideoUploadPage';
import VideoEditPage from './pages/VideoEditPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import VideoListPage from './pages/VideoListPage';
import VideosPage from './pages/VideosPage'
import DashboardAppPage from './pages/DashboardAppPage';


// ----------------------------------------------------------------------


export default function Router() {
  const isLoggedIn = localStorage.getItem("email") ? true : false;
  const location = useLocation();
  const routes = useRoutes([
    {
      path: '/',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" state={{ from: location, reason: 'You must log in first' }}/>,
      children: [
        { element: <Navigate to='/videos' />, index: true },
        { path: 'dashboard', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'video-upload', element: <VideoUploadPage /> },
        { path: 'videos/:id', element: <VideoPlayerPage /> },
        { path: 'video/update/:id', element: <VideoEditPage /> },
        { path: 'video-list', element: <VideoListPage /> },
        { path: 'videos', element: <VideosPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'registration',
      element: <RegistrationPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to='/dashboard/app' />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to='/404' /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to='/404' replace />,
    },
  ]);

  return routes;
}
