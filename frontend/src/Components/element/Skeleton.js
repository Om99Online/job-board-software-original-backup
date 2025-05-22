import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const Skeleton = () => {

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Skeleton
        sx={{ width: 200, height: 300 }}
        animation="wave"
      />
      <Skeleton
        sx={{ width: 200, height: 300 }}
        animation="wave"
      />
      <Skeleton
        sx={{ width: 200, height: 300 }}
        animation="wave"
      />
    </Box>
  );
};

export default Skeleton;
