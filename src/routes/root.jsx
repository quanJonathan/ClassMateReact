import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import AppName from '../component/WebName';

export default function Root() {
   return (
    <React.Fragment>
    <AppBar position="fixed" style={{ background: 'transparent', boxShadow: 'none'}}>
      <Toolbar>
        <AppName/>
      </Toolbar>
    </AppBar>
    <Toolbar />
  </React.Fragment>
   );
}