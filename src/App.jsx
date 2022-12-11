import React from "react";
import "./App.css";
import TopNav from "./Components/TopNav";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContextProvider } from "./Components/context/AuthContext";
import AnimatedRoutes from "./Components/AnimatedRoutes";
import Footer from "./Components/Footer";

const App = React.memo(function App() {
  return (
    <div>
      <AuthContextProvider>
        <Router>
          <TopNav />
          <div className="div--page">
            <AnimatedRoutes />
          </div>
          <Footer />
        </Router>
      </AuthContextProvider>
    </div>
  );
});

export default App;
