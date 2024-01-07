import { AccountCircle } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


const NotificationItem = (props) => {
  const {content} = props
  const navigate = useNavigate();
  return (
    <>
      <div style={{ width: '100%', height: '70px', borderBottom: '1.5px solid lightgray' }}>
        <div onClick={()=> navigate(`${content?.url}`)} style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
            <Typography sx={{marginTop: 0, marginBottom: 0, flex: 7,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical"}}>
            <span style={{ fontWeight: 'bold' }}>{`[${content?.createdDate}]`} {content?.name}: </span>
            {content?.content}
            </Typography>
        </div>
      </div>
    </>
  )
}

export default NotificationItem;