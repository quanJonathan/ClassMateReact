import { Box, styled, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ClassCard({ item, user }) {
  // console.log(item)

  async function getClass(classId) {
    try {
      const response = await axios.get(
        `https://classmatebe-final.onrender.com/class/getClass/${classId}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      return response.data;
    } catch (error) {
      // Handle errors here
      console.error("Error fetching class:", error);
      throw error; // Rethrow the error or handle it as needed
    }
  }

  const navigate = useNavigate();

  const goToClass = () => {
    navigate(`/c/${item?.classId?._id}`);
  };

  const [result, setResult] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await getClass(item?.classId?._id);
        console.log(classData);
        setResult(classData);
      } catch (error) {
        console.error("Error fetching class:", error);
        // Handle error as needed
      }
    };

    fetchData();
  }, [item?._classId]);

  const ClassBox = styled(Box)(({ theme }) => ({
    width: "300px",
    border: "1px solid #dcdcdc",
    borderRadius: "5px",
    overflow: "hidden",
    cursor: "pointer",
    margin: 10,
  }));

  const ClassBoxUpper = styled(Box)(({ theme }) => ({
    backgroundColor: "#008d7d",
    height: "90px",
    position: "relative",
    color: "white",
    padding: "10px",
    borderBottom: "1px solid #dcdcdc",
  }));

  return (
    <ClassBox onClick={goToClass}>
      <ClassBoxUpper>
        <Typography
          style={{
            fontWeight: 600,
            fontSize: "25px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
          }}
        >
          {item?.classId?.className}
        </Typography>
        <Typography
          style={{
            position: "absolute",
            bottom: "12px",
            fontSize: "15px",
          }}
        >
          {item?.classId?.classId}
        </Typography>

        {/* <Avatar
          {...stringAvatar(
            user
              ? `${result?.members[0]?.firstName} ${result?.members[0]?.lastName}`
              : "Default Name",
            {
              position: "absolute",
              right: "5px",
              width: "75px",
              height: "75px",
              backgroundColor: 'purple'
            }
          )}
        /> */}
      </ClassBoxUpper>
      <div
        style={{
          height: "190px",
          borderBottom: "1px solid #dcdcdc",
        }}
      >
        <Typography
          style={{
            fontSize: "15px",
            padding: "20px",
            fontStyle: "italic",
          }}
        >
          {item?.classId?.description ?? ""}
        </Typography>
      </div>
    </ClassBox>
  );
}

export default ClassCard;
