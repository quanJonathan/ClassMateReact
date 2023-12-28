import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from "@mui/material";
  import { useState } from "react";
import { SearchBar } from "./SearchBar";


  export default function AddPeopleDialog({ isOpen, handleClose }) {
 
    // const [chips, setChips] = useState([]);
   
    const [results,setResults] = useState([]);
   
   
    return (
      <div>
        <Dialog open onClose={handleClose}>
          <DialogTitle>Invite people to our classroom</DialogTitle>
          <DialogContent>
            {/* <Autocomplete
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
            <ListItem></ListItem> */}

   <SearchBar setResults={setResults} />
      <div style={{ padding: 3 }}>
        {results.map((result,id) => (
          <div
            className="text"
            style={{
              padding: 5,
              justifyContent: "normal",
              fontSize: 20,
              color: "blue",
              margin: 1,
              width: "250px",
              BorderColor: "green",
              borderWidth: "10px"
            }}
            key={id}
          >
            {result.email}
          </div>
        ))}
      </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  