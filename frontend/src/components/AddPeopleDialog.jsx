import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Avatar,
    ListItemButton,
  } from "@mui/material";
  import { useRef, useState } from "react";
import { SearchBar } from "./SearchBar";
import { useAuth } from "../hook/useAuth";
import { stringAvatar } from "../helpers/stringAvator";
import { useParams } from "react-router-dom";

  export default function AddPeopleDialog({ isOpen, handleClose, course, title }) {
    // const textareaRef = useRef(null)
    const {id} = useParams();
        // const [chips, setChips] = useState([]);
   
    const [results,setResults] = useState([]);
    const {user} = useAuth();
    const copyTextAction = (text) => {
        // if (textareaRef.current) {
        //   textareaRef.current.value = text;
          
       
    
          try {
            // Copy the text to the clipboard
            navigator.clipboard.writeText(text)
            console.log('Text copied to clipboard:', text);
          } catch (err) {
            console.error('Unable to copy to clipboard:', err);
          }
        // }
      };
    return (
      <div>
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>{`${title} to our classroom`}</DialogTitle>
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
      <div style={{ padding: 3}}>
        {/* {results.map((result, id) => (
    result.email !== "admin2@gmail.com" && result.email !== "classmate.admin@gmail.com" && result.email !== user.email && (
        <div
        className="text"
        style={{
            padding: 5,
            justifyContent: "normal",
            fontSize: 20,
            color: "blue",
            margin: 1,
            width: "250px",
            borderColor: "green",  // Fixed typo: BorderColor should be borderColor
            borderWidth: "10px"
        }}
        key={id}
        >
        {result.email}
        </div>
    )
    ))} */}

        <List sx={{overflowY: "scroll", height: "100px"}}>
        {results?.map((item) => (
        item.email !== "admin2@gmail.com" && item.email !== "classmate.admin@gmail.com" && item.email !== user.email &&
          <ListItem
            disablePadding
            key={item._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              '&:hover': {
                backgroundColor: 'lightgray', // Add a background color for better visibility
              },
            }}
          >
            <ListItemButton dense>
              <Avatar
                {...stringAvatar(
                  item ? `${item.firstName} ${item.lastName}` : "Default Name"
                )}
                size="medium"
                edge="end"
                aria-label="account of current user"
                color="inherit"
                sx={{ mr: 2 }}
              />

              <ListItemText
                primary={item.email}
                sx={{ flexGrow: 1, fontWeight: "bold" }}
              />
            </ListItemButton>

            <Button variant="contained" color="primary" elevation={0} sx={{
                "textTransform": "none"
            }} disabled={item.classes.some(classObj => classObj.classId === id)}>
           Invite
          </Button>
          </ListItem>
        ))}
      </List>
      </div>
          </DialogContent>
          <DialogTitle>or send a invitation link to your friend</DialogTitle>
          <DialogContent>
          <form style={{
            padding: 0,
            border: "1px solid black",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "space-between",
            width: "100%"
        }}>
          <TextField
            // ref={textareaRef}
            id="invitation-link"
            className="text"
            value={`http://localhost:5173/c/join/${course?._id}`}
            variant="outlined"
            size="small"
            InputProps={{
                readOnly: true,
              }}
            sx={{
                border: "none",
                background: "transparent",
                margin: 0,
                width: "100%",
                '& fieldset': {
                    border: "none"
                },
                '&:focus-within fieldset, &:focus-visible fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
            
            }}
          />
        
        <Button variant="contained" color="primary" elevation={0} sx={{
                "textTransform": "none"
            }}
            onClick={()=>copyTextAction(`http://localhost:5173/c/join/${course?._id}`)}
            >
           Copy
          </Button>
        </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  