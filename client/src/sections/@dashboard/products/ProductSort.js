import { useState } from 'react';
// @mui
import { Menu, Button, MenuItem, Typography } from '@mui/material';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

export default function ShopProductSort({setVideos }) {
  const [open, setOpen] = useState(null);
  const [label, setLabel] = useState("Popular");

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (event,val) => {
    setOpen(null);
    if(val === 'backdropClick') return 
    switch(val) {
      case 'oldest':
        setVideos(prev=>[...prev.sort((a, b) => new Date(a.recordingDate) - new Date(b.recordingDate))])
        break;
      case 'latest':
        setVideos(prev=>[...prev.sort((a, b) => new Date(b.recordingDate) - new Date(a.recordingDate))])
        break;
      default:
        setVideos(prev=>[...prev.sort((a, b) => b.viewCount - a.viewCount===0 ? new Date(b.recordingDate) - new Date(a.recordingDate) : b.viewCount - a.viewCount)])
    }
    setLabel(val)
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === 'popular'}
            onClick={(event)=>handleClose(event,option.value)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
