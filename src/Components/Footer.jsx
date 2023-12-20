import React from "react";
import "./styles/Footer.css";
import { Box, Grid } from "@mui/material";
import { FiGithub } from "react-icons/fi";
import { AiOutlineLinkedin, AiOutlineMail } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AuthUseContext } from "./context/AuthContext";
import { motion } from "framer-motion";

// Reusable SocialIcon component
const SocialIcon = ({ href, icon }) => (
  <a href={href} rel="noreferrer" target="_blank">
    <Box className="div-social-icon">{icon}</Box>
  </a>
);

const Footer = () => {
  const { user, handleGoogleSignIn, logOut } = AuthUseContext();

  const socialLinks = [
    { href: "https://github.com/RusselDsouza029", icon: <FiGithub /> },
    { href: "https://www.linkedin.com/in/russel-dsouza-7aa065231/", icon: <AiOutlineLinkedin /> },
    { href: "mailto:russeldsouza456@gmail.com", icon: <AiOutlineMail /> },
    { href: "https://wa.me/919284113175", icon: <BsWhatsapp /> },
  ];

  const appLinks = [
    { to: "/", label: "Home" },
    { to: "/platform/4", label: "Platform" },
    { to: "/list", label: "List" },
  ];

  const projectLinks = [
    { href: "https://russel-portfolio.web.app/", label: "Portfolio" },
    { href: "https://movie-data-info-647a7.web.app/", label: "Movie Data Info" },
    { href: "https://russeldsouza029.github.io/India-Covid-19-Dashboard-React/", label: "Indian Covid-19 Dashboard" },
    { href: "https://russeldsouza029.github.io/Stopwatch/", label: "Stopwatch" },
  ];

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
              {socialLinks.map((link, index) => (
                <SocialIcon key={index} {...link} />
              ))}
            </Box>
          </Grid>
          <Grid lg={3} md={3} sm={6} xs={12} item>
            <p>
              <b>Links</b>
            </p>
            {appLinks.map((link, index) => (
              <p key={index}>
                <Link className="link-a" to={link.to}>
                  {link.label}
                </Link>
              </p>
            ))}
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
            {projectLinks.map((link, index) => (
              <p key={index}>
                <a className="link-a" href={link.href} rel="noreferrer" target="_blank">
                  {link.label}
                </a>
              </p>
            ))}
          </Grid>
          <Grid lg={3} md={3} sm={6} xs={12} item>
            <p>
              <b>About this application</b>
            </p>
            <p className="about-app">
              This application is made with the help of JavaScript, React JS,
              Material UI, Framer Motion, and Firebase. To display games, I used
              the RAWG API.
            </p>
          </Grid>
        </Grid>
      </Box>
    </motion.footer>
  );
};

export default Footer;
