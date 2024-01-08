import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRef, useState } from "react";

const ITEM_HEIGHT = 60;
function OptionMenu({ options, actionIcon, onClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if(typeof onClick === 'function') onClick();
    event.stopPropagation();
  };
  const handleClose = (option) => {
    setAnchorEl(null);

    if(typeof option?.action === 'function')
      option?.action();
    };

  const maxMenuWidth = Math.max(...options?.map((label) => label.length));

  return (
    <Box>
      <IconButton
        edge="end"
        aria-label="more"
        id="long-button"
        aria-controls={open ? "option-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disableFocusRipple
        sx={{p: '5px'}}
      >
        {actionIcon}
      </IconButton>
      <Menu
        id="option-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            minWidth: `${maxMenuWidth}ch`,
          },
        }}
      >
        {options?.map((option) => (
          <MenuItem key={option?.label} onClick={() => handleClose(option)}>
            {option?.icon && <ListItemIcon>{option?.icon}</ListItemIcon>}
            <ListItemText>{option?.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

OptionMenu.defaultProps = {
  onClick: () => {
    // Default action when onClick is not provided 
    // console.log("Default clicked")
  },
  options: []
};

export default OptionMenu
