import { CssBaseline, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px;
  list-style: none;
  height: 50px;
  text-decoration: none;
  font-size: 18px;

`;

const DropdownLink = styled(Link)`
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 18px;
`;

const SubMenu = ({ item, open }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
    <CssBaseline/>
      <SidebarLink
      sx={{
        justifyContent: open ? 'initial' : 'center',
      }}
      to={item.path} onClick={item.subNav && showSubnav}>
        <IconButton
        sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          {item.icon}
          </IconButton>
          <Typography sx={{
            opacity: open ? 1 : 0,
            
          }} >{item.title}</Typography>
          
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {open && subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink
      to={item.path} onClick={item.subNav && showSubnav}>
        <IconButton
        sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          {item.icon}
          </IconButton>
          <Typography sx={{
            opacity: open ? 1 : 0
          }} >{item.title}</Typography>
              
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;