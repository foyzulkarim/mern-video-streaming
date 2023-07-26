import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import VideoCard from './VideoCard';

// ----------------------------------------------------------------------

VideoList.propTypes = {
  videos: PropTypes.array.isRequired,
};

export default function VideoList({ videos = [], ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {videos.map((video) => (
        <Grid key={video.id} item xs={12} sm={6} md={3}>
          <VideoCard video={video} />
        </Grid>
      ))}
    </Grid>
  );
}
