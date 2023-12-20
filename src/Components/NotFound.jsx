import React from "react";

const NotFound = () => {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: 20,
    color: "rgb(58, 58, 58)",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <h1>Error 404 Page Not Found</h1>
    </div>
  );
};

export default NotFound;
