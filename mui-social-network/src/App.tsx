import { ClearOutlined, DeleteOutline } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React from 'react';

const App = () => {
  return (
    <div>
      <Button variant='contained' color='error' size='small' startIcon={<DeleteOutline />}>
        Delete
      </Button>
      <IconButton>
        <DeleteOutline />
      </IconButton>
    </div>
  );
};

export default App;