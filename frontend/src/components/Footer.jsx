import { Box, Container, styled, Typography } from '@mui/material';


export default function Footer() {
    const CustomContainer = styled(Container)(({ theme }) => ({
        display: "flex",
        justifyContent: "space-around",
        gap: theme.spacing(5),
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
          textAlign: "center",
        },
      }));
    
      const IconBox = styled(Box)(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginTop: "20px",
        [theme.breakpoints.down("md")]: {
          justifyContent: "center",
        },
      }));
    
      const FooterLink = styled("span")(({ theme }) => ({
        fontSize: "16px",
        color: "#FFF",
        fontWeight: "300",
      }));
      const CustomColumn = styled(Box)(({ theme }) => ({
        width: "20%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
        [theme.breakpoints.down("md")]: {
          width: "100%"
        },
      }));
    
      return (
        <Box sx={{ py: 10, backgroundColor: "#B6A5FF" }}>
          <CustomContainer>
            <CustomContainer>
                <CustomColumn>
              
            <Box component="img"
                sx={{width: 200}}
                alt='appname'
                src='../src/assets/logowb2.png'
                />  

                <Typography sx={{
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#FFF",
                    fontWeight: "300",
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor
                </Typography>
                </CustomColumn>
              <Box>
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "#FFF",
                    fontWeight: "700",
                    mb: 2,
                  }}
                >
                  Company
                </Typography>
    
                <FooterLink>About Us</FooterLink>
                <br />
                <FooterLink>Services</FooterLink>
                <br />
                <FooterLink>Community</FooterLink>
                <br />
                <FooterLink>Testimonial</FooterLink>
              </Box>
    
              <Box>
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "#FFF",
                    fontWeight: "700",
                    mb: 2,
                  }}
                >
                  Support
                </Typography>
    
                <FooterLink>Help Center</FooterLink>
                <br />
                <FooterLink>Feedback</FooterLink>
                <br />
                <FooterLink>Tweet @ Us</FooterLink>
                <br />
                <FooterLink>Webians</FooterLink>
              </Box>
    
              <Box>
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "#FFF",
                    fontWeight: "700",
                    mb: 2,
                  }}
                >
                  Links
                </Typography>
    
                <FooterLink>Courses</FooterLink>
                <br />
                <FooterLink>Terms of use</FooterLink>
                <br />
                <FooterLink>Services</FooterLink>
                <br />
                <FooterLink>Become Teacher</FooterLink>
              </Box>
    
              <Box>
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "#FFF",
                    fontWeight: "700",
                    mb: 2,
                  }}
                >
                  Contact Us
                </Typography>
    
                <FooterLink>(91) 98765  4321 54</FooterLink>
                <br />
                <FooterLink>support@mail.com</FooterLink>
                <br />
    
                <IconBox>
                  <img src="../src/assets/fbicon.png" alt="fbIcon" style={{ cursor: "pointer", borderRadius: "50px" }} />
                  <img
                    src="../src/assets/twittericon.png"
                    alt="twitterIcon"
                    style={{ cursor: "pointer", borderRadius: "50px" }}
                  />
                  <img
                    src="../src/assets/linkedinicon.png"
                    alt="linkedinIcon"
                    style={{ cursor: "pointer", borderRadius: "50px" }}
                  />
                </IconBox>
              </Box>
            </CustomContainer>
          </CustomContainer>
        </Box>
      );
}
