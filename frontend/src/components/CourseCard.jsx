import {Box, styled, Typography, Chip} from '@mui/material'
import { PlayCircle, Star } from '@mui/icons-material';
function CourseCard({ item }) {
    const CourseBox = styled(Box)(({ theme }) => ({
        maxWidth: 300,
        height: 400,
        backgroundColor: "#fff",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        margin: theme.spacing(5,2,4,2),
        [theme.breakpoints.down("md")]: {
          margin: theme.spacing(2, 0, 2, 0),
        },
      
      }));
    
  return (
    <CourseBox>
        <Box 
        sx={{
            height: "40%",
            position: "relative"
        }}
        >
            <img 
            style={{width: "100%",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            height: "100%"
        }}
            alt={item.id}
            src={item.img}
            />
             <Chip sx={{
                position: "absolute",
                top: "8px",
                left: "8px"
             }} 
             style={{backgroundColor:'#FFF'}}
             label={
                <Box sx={{ color: "#000", fontWeight: "medium", fontSize: "12px", }}>Creative
                </Box>}
             />
            </Box>

            <Box sx={{ padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
        <Typography variant="h5" sx={{ fontWeight: "700", color: "#0B036B" }}>
          {item.title}
        </Typography>
        <Typography variant="body2" sx={{ my: 2, textAlign: "center" }}>
          {item.description}
        </Typography>

        <Box sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: "40px",
        width: "100%"
        }}>
            <Box sx={{
                 display: "flex",
                 flexDirection: "row",
                 alignItems: "center",
            }}>
            <PlayCircle color="primary" sx={{margin: "10px"}}/>
            <Typography variant="body2" sx={{fontWeight: "bold"}}>
              12x Lessons
            </Typography>
            </Box>
            <Chip label={
            <Box sx={{ color: "#FFF", fontWeight: "medium", display:"flex", alignItems: "center", fontSize: "14px", justifyContent: "center"}}>4.9
            <Star sx={{color: "#FFD700", height: "20px" , width: "20px", margin: "5px" }} />
            </Box>} color='primary' 
            
            />
          </Box>

    </Box>
    </CourseBox>
  );
}

export default CourseCard;
