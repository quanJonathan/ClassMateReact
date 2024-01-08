import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const YesNoDialog = ({ open, onClose, onYes, onNo, title }) => {
  return (
    <Dialog open={open} onClose={onClose} keepMounted>
      <DialogTitle>Do you want to delete &quot;{title}&quot; ?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action will remove grade compositions out of all related
          assignment
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onNo} color="primary">
          No
        </Button>
        <Button onClick={onYes} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YesNoDialog;
