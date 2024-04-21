import React from "react";
import "./styles/Footer.css";
import { Box, Grid } from "@mui/material";
import { FiGithub } from "react-icons/fi";
import { AiOutlineLinkedin, AiOutlineMail } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AuthUseContext } from "./context/AuthContext";
import { motion } from "framer-motion";

const Footer = () => {
  const { user, handleGoogleSignIn, logOut } = AuthUseContext();
  return (
    <motion.footer
      className="footer"
      initial="hide"
      transition={{ duration: 0.5, delay: 1 }}
      viewport={{ once: true }}
      whileInView="view"
      variants={{
        view: { opacity: 1, y: 0 },
        hide: { opacity: 0, y: 50 },
      }}
    >
      <Box className="div-inside-footer">
        <Grid container>
          <Grid lg={3} md={3} sm={6} xs={12} item>
            <Box className="div-logo-container">
              <p>
                <span className="game-logo-span">Game</span>
                <span className="list-logo-span">List</span>
              </p>
            </Box>
            <Box className="div-socialmedia-links">
              <a
                href="https://github.com/RusselDsouza029"
                rel="noreferrer"
                target="_blank"
              >
                <Box className="div-social-icon">
                  <FiGithub />
                </Box>
              </a>
              <a
                href="https://www.linkedin.com/in/russel-dsouza-7aa065231/"
                rel="noreferrer"
                target="_blank"
              >
                <Box className="div-social-icon">
                  <AiOutlineLinkedin />
                </Box>
              </a>
              <a href="mailto:russeldsouza456@gmail.com" rel="noreferrer">
                <Box className="div-social-icon">
                  <AiOutlineMail />
                </Box>
              </a>
              <a
                href="https://wa.me/919284113175"
                rel="noreferrer"
                target="_blank"
              >
                <Box className="div-social-icon">
                  <BsWhatsapp />
                </Box>
              </a>
            </Box>
          </Grid>
          <Grid lg={3} md={3} sm={6} xs={12} item>
            <p>
              <b>Links</b>
            </p>
            <p>
              <Link className="link-a" to="/">
                Home
              </Link>
            </p>
            <p>
              <Link className="link-a" to="/platform/4">
                Platform
              </Link>
            </p>
            <p>
              <Link className="link-a" to="/list">
                List
              </Link>
            </p>
            <p className="link-a p-login-logout">
              {user ? (
                <span onClick={logOut}>Logout</span>
              ) : (
                <span onClick={handleGoogleSignIn}>Signin</span>
              )}
            </p>
          </Grid>
          <Grid lg={3} md={3} sm={6} xs={12} item>
            <p>Projects</p>
            <p>
              <a
                className="link-a"
                href="https://russel-portfolio.web.app/"
                rel="noreferrer"
                target="_blank"
              >
                Portfolio
              </a>
            </p>
            <p>
              <a
                className="link-a"
                href="https://movie-data-info-647a7.web.app/"
                rel="noreferrer"
                target="_blank"
              >
                Movie Data Info
              </a>
            </p>
            <p>
              <a
                className="link-a"
                href="https://russeldsouza029.github.io/India-Covid-19-Dashboard-React/"
                rel="noreferrer"
                target="_blank"
              >
                Indian Covid-19 Dashboard
              </a>
            </p>
            <p>
              <a
                className="link-a"
                href="https://russeldsouza029.github.io/Stopwatch/"
                rel="noreferrer"
                target="_blank"
              >
                Stopwatch
              </a>
            </p>
          </Grid>
          <Grid lg={3} md={3} sm={6} xs={12} item>
            <p>
              <b>About this application</b>
            </p>
            <p className="about-app">
              This application is made with the help of JavaScript, React JS,
              Material UI, Framer Motion, and Firebase. To display games I used
              RAWG API.
            </p>
          </Grid>
        </Grid>
      </Box>
    </motion.footer>
  );
};

export default Footer;
