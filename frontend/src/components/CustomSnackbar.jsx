import { Snackbar } from "@mui/material";

import MuiAlert from "@mui/material/Alert";
import React from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = (content, vertical, horizontal, action, severity) => {
  
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      handleClose={handleClose}
      message={content}
      key={vertical + horizontal}
      autoHideDuration={4000}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }} />
    </Snackbar>
  );
};

CustomSnackbar.defaultProps = {
  vertical: "bottom",
  horizontal: "left",
  severity: "error",
};
