import { Box, styled, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ClassCard({ item, user }) {
  // console.log(item)
  const navigate = useNavigate();

  const goToClass = () => {
    navigate(`/c/${item?.classId?._id}`);
  };

  const ClassBox = styled(Box)(({ theme }) => ({
    width: "300px",
    border: "1px solid #dcdcdc",
    borderRadius: "5px",
    overflow: "hidden",
    cursor: "pointer",
    margin: 10
  }));

  const ClassBoxUpper = styled(Box)(({theme }) =>({
    backgroundColor: "#008d7d",
    height: "90px",
    position: "relative",
    color: "white",
    padding: "10px",
    borderBottom: "1px solid #dcdcdc"
  }));

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    name = name.toUpperCase()
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  return (
    <ClassBox  onClick={goToClass}>
      <ClassBoxUpper>
        <Typography style={{
              fontWeight: 600,
              fontSize: "25px",
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
        }}>{item?.classId?.className}</Typography>
        <Typography style={{
             position: "absolute",
             bottom: "12px",
             fontSize: "15px"
        }}>{item?.classId?.classId}</Typography>

                <Avatar
                    {...stringAvatar(
                      user
                        ? `${user.firstName} ${user.lastName}`
                        : "Default Name"
                    )}
                  
                    sx={{
                        position: "absolute",
                        right: "5px",
                        width: "75px",
                        height: "70px"
                    }}
                  >
                    {/* <AccountCircle sx={{ width: "40px", height: "40px" }} /> */}
                  </Avatar>
      </ClassBoxUpper>
      <div style={{
          height: "190px",
          borderBottom: "1px solid #dcdcdc"
      }}>
          <Typography style={{
             fontSize: "15px",
             padding: "20px",
             fontStyle: "italic"
        }}>{item?.classId?.description ?? ""}</Typography>
      </div>
    </ClassBox>
  );
}

export default ClassCard;