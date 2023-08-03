import PropTypes from 'prop-types';
// @mui
import { Box, Card, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Link } from "react-router-dom";
import Moment from 'react-moment';

// utils
// components
import Label from '../../../components/label';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

VideoCard.propTypes = {
  video: PropTypes.object,
};

export default function VideoCard({ video }) {
  const {
    title: name,
    thumbnailUrl: cover,
    viewCount,
    duration,
    status,
    recordingDate,
    _id: id,
  } = video;

  const onClickHandler = () => {
    console.log('clicked', video);
  };

  let videoDuration = 0
  if(duration) videoDuration = duration

  return (
    <Card onClick={onClickHandler}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {status && (
          <Label
            variant='filled'
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <StyledProductImg alt={name} src={cover} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Link to={id} color='inherit' underline='hover'>
              <Typography variant='subtitle2' noWrap>
                {name}
              </Typography>
            </Link>
            <Typography variant='subtitle1'>
                <Moment format='DD/MM/yyyy'>{recordingDate}</Moment>
            </Typography>
          </Stack>
          
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='subtitle1'>{viewCount} views</Typography>
            <Typography variant='subtitle1'>
              <Moment utc format='HH:mm:ss'>{videoDuration*1000}</Moment>
            </Typography>
          </Stack>
      </Stack>
    </Card>
  );
}
