import React from "react";
import { Dialog, DialogContent, Box, Button, Grid, Avatar } from "@mui/material";
import { paperClasses } from "@mui/material";
import { AuthUseContext } from "./context/AuthContext";
import "./styles/Profile.css";
import { AiOutlineClose, AiOutlineGoogle } from "react-icons/ai";
import LogoutIcon from "@mui/icons-material/Logout";

const Profile = ({ open, close, fullScreen }) => {
  const { user, handleGoogleSignIn, logOut } = AuthUseContext();

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      aria-labelledby="responsive-dialog-title"
      onClose={close}
      sx={{
        [`& .${paperClasses.root}`]: {
          color: "white",
          backgroundColor: "#202020", // Updated background color
          borderRadius: "10px",
        },
      }}
    >
      <DialogContent>
        <Box className="top-profile-title">
          <h2 style={{ margin: 0 }}>User Profile</h2>
          <Box className="div-close-btn" onClick={close}>
            <AiOutlineClose />
          </Box>
        </Box>
        <Box sx={{ mt: "20px" }}>
          {user ? (
            <Box className="div-pro-info">
              <Box className="div-img-profile">
                <Avatar alt="User Avatar" src={user.photoURL} sx={{ width: 100, height: 100 }} />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box className="div-profile-info">
                    <Box className="div-profile-info-title">Name</Box>
                    <Box className="div-user-info">{user.displayName}</Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className="div-profile-info">
                    <Box className="div-profile-info-title">Email</Box>
                    <Box className="div-user-info">{user.email}</Box>
                  </Box>
                </Grid>
                {user.metadata ? (
                  <Grid item xs={12} md={6}>
                    <Box className="div-profile-info">
                      <Box className="div-profile-info-title">Account Created</Box>
                      <Box className="div-user-info">
                        {new Date(user.metadata.creationTime).toLocaleDateString()}
                      </Box>
                    </Box>
                  </Grid>
                ) : null}
              </Grid>
              <Box className="google-auth-btn" sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  onClick={logOut}
                  sx={{ color: "white", backgroundColor: "#1a1a1a", mt: 2 }} // Updated button styling
                  className="logout-btn"
                  startIcon={<LogoutIcon />} // Added Logout icon
                >
                  Logout
                </Button>
              </Box>
            </Box>
          ) : (
            <Box className="google-auth-btn">
              <Button
                sx={{ color: "white", backgroundColor: "#1a1a1a", mt: 2 }} // Updated button styling
                className="sign-in-btn"
                onClick={handleGoogleSignIn}
                startIcon={<AiOutlineGoogle />} // Added Google icon
              >
                Sign In With Google
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Profile;
