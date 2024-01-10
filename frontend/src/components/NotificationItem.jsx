import { AccountCircle } from "@mui/icons-material";
import { Link, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationItem = (props) => {
  const { content } = props;
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <div
      style={{
        width: "100%",
        height: "70px",
        borderBottom: "1.5px solid lightgray",
      }}
    >
      <Link
        underline="hover"
        color="black"
        onClick={() => navigate(`${content?.url}`)}
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          "&:hover": {
            color: theme.palette.primary,
          },
        }}
      >
        <Typography
          sx={{
            marginTop: 0,
            marginBottom: 0,
            flex: 7,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "3",
            WebkitBoxOrient: "vertical",
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            {`[${format(content?.createdDate, "HH:MM:ss yyyy:mm:dd")}]`}{" "}
            {content?.name}:{" "}
          </span> {"\n"}
          {content?.content}
        </Typography>
      </Link>
    </div>
  );
};

export default NotificationItem;
