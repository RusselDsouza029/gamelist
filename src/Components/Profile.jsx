import React from "react";
import { Dialog, DialogContent, Box, Button, Grid } from "@mui/material";
import { paperClasses } from "@mui/material";
import { AuthUseContext } from "./context/AuthContext";
import "./styles/Profile.css";
import { AiOutlineClose, AiOutlineGoogle } from "react-icons/ai";
import LogoutIcon from "@mui/icons-material/Logout";

const Profile = ({ open, close, fullScreen }) => {
  const { user, handleGoogleSignIn, logOut } = AuthUseContext();

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={close}
        sx={{
          [`& .${paperClasses.root}`]: {
            color: "white",
            backgroundColor: "#151515",
            width: "100%",
            height: "100%",
          },
        }}
      >
        <DialogContent>
          <Box className="top-profile-title">
            Profile
            <Box className="div-close-btn" onClick={close}>
              <AiOutlineClose />
            </Box>
          </Box>
          <Box sx={{ mt: "20px" }}>
            {user ? (
              <Box className="div-pro-info">
                <Box className="div-img-profile">
                  <img className="img-container" alt="" src={user.photoURL} />
                </Box>
                <Grid container>
                  <Grid lg={6} md={6} sm={12} xs={12} item>
                    <Box className="div-profile-info">
                      <Box>
                        <Box className="div-profile-info-title">Name</Box>
                        <Box className="div-user-info">
                          {/* <AiOutlineUser /> */}
                          {user.displayName}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid lg={6} md={6} sm={12} xs={12} item>
                    <Box className="div-profile-info">
                      <Box>
                        <Box className="div-profile-info-title">Email</Box>
                        <Box className="div-user-info">
                          {user.email}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  {user.metadata ? (
                    <Grid lg={6} md={6} sm={12} xs={12} item>
                      <Box className="div-profile-info">
                        <Box>
                          <Box className="div-profile-info-title">
                            Account createed on Game List
                          </Box>
                          <Box className="div-user-info">
                            {user.metadata.creationTime}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ) : null}
                </Grid>
                <Box
                  className="google-auth-btn"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={logOut}
                    sx={{
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    className="logout-btn"
                  >
                    <LogoutIcon />
                    Signout
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box className="google-auth-btn">
                <Button
                  sx={{ color: "white" }}
                  className="sign-in-btn"
                  onClick={handleGoogleSignIn}
                >
                  <AiOutlineGoogle />
                  Sign In With Google
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
