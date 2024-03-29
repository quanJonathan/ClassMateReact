import { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const filterData = (query) => {
    if (!query) {
      return;
    } else {
      const url = "https://classmatebe-final.onrender.com/user/all";

      axios
        .get(url)
        .then((response) => response.data)
        .then((json) => {
          const result = json.filter((d) => {
            return (
              query && d && d.email && d.email.toLowerCase().includes(query)
            );
          });
          setResults(result);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  const handleChange = (value) => {
    setInput(value);
    filterData(value);
  };

  return (
    <form
      style={{
        padding: "2px 20px",
        border: "1px solid black",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <TextField
        id="search-bar"
        className="text"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        variant="outlined"
        placeholder="Search..."
        size="small"
        sx={{
          border: "none",
          background: "transparent",
          margin: 0,
          padding: "7px 8px",
          "& fieldset": {
            border: "none",
          },
          "&:focus-within fieldset, &:focus-visible fieldset": {
            border: "none",
          },
          "&:hover fieldset": {
            border: "none",
          },
        }}
      />
      <IconButton
        type="submit"
        aria-label="search"
        sx={{
          padding: 0,
          border: "none",
          margin: 0,
        }}
      >
        <SearchIcon style={{ fill: "#7A5EF3" }} />
      </IconButton>
    </form>
  );
};
