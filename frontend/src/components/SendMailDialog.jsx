import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function SendMailDialog({ isOpen, title, handleClose }) {
  const [chips, setChips] = useState([]);

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Autocomplete
            clearIcon={false}
            options={[]}
            freeSolo
            multiple
            renderTags={(value, props) =>
              value.map((option, index) => (
                <Chip key={option} label={option} {...props({ index })} />
              ))
            }
            renderInput={(params) => <TextField label="Add Tags" {...params} />}
          />
          <ListItem></ListItem>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button onClick={() => handleClose()}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
