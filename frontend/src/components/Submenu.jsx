/* eslint-disable react/prop-types */
import {
  CssBaseline,
  Icon,
  IconButton,
  Typography,
  Box,
  ListItemButton,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px;
  list-style: none;
  height: 50px;
  text-decoration: none;
  font-size: 18px;
  color: ${(props) => (props.selected ? "blue" : "black")};
`;

const DropdownLink = styled(Link)`
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 18px;
  color: ${(props) => (props.selected ? "blue" : "black")};
`;

const SubMenu = ({ item, open }) => {
  const [subnav, setSubnav] = useState(true); // Dropdown is always open by default
  const location = useLocation();
  const {id} = useParams()

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <CssBaseline />
      <ListItemButton
        key={item?._path}
        sx={{
          borderTopRightRadius: "32px",
          borderBottomRightRadius: "32px",
          minHeight: "60px",
        }}
        onClick={showSubnav}
      >
        <SidebarLink
          key={item?.path}
          to={item?.path}
          sx={{
            justifyContent: open ? "initial" : "center",
            alignItems: "center",
            minHeight: "inherit",
          }}
        >
          <Icon
            sx={{
              minWidth: 0,
              mr: open ? 2 : "auto",
              justifyContent: "center",
            }}
          >
            {item.icon}
          </Icon>
          <Typography
            sx={{
              opacity: open ? 1 : 0,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {item.title}
          </Typography>
          {item.subNav && (
            <Icon onClick={showSubnav}>
              {subnav ? item.iconOpened : item.iconClosed}
            </Icon>
          )}
        </SidebarLink>
      </ListItemButton>
      
      {subnav &&
        item.subNav?.map((item, index) => {
          return (
            <DropdownLink
              to={item.path}
              onClick={item.subNav && showSubnav}
              selected={location.pathname === item.path}
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: subnav ? "initial" : "center",
              }}
              key={`${item.subNav}${index}`}
            >
              <IconButton
                sx={{
                  minWidth: 0,
                  mr: open ? 0 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.subNav?.icon}
              </IconButton>
              <Typography
                variant="header1"
                sx={{
                  opacity: open ? 1 : 0,
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {item.title}
              </Typography>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;
