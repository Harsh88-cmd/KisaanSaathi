import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import WeatherPage from "./pages/Weather";
import Advisory from "./pages/Advisory";
import Market from "./pages/Market";
import Community from "./pages/Community";
import Disease from "./pages/Disease";
import GetStarted from "./pages/GetStarted";
import SoilData from "./pages/soilReport";
import SearchPage from "./pages/SearchPage";

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, textAlign: "center", color: "red" }}>
          Error loading page
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />

        <main style={{ flexGrow: 1, padding: 20 }}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/advisory" element={<Advisory />} />
              <Route path="/market" element={<Market />} />
              <Route path="/community" element={<Community />} />
              <Route path="/disease" element={<Disease />} />
              <Route path="/FirstPage" element={<GetStarted />} />
              <Route path="/soilReport" element={<SoilData />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </ErrorBoundary>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
