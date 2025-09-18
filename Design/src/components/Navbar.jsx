import React, { useState } from "react";
import { Navbar as RBNavbar, Nav, Form, FormControl, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useVoiceInput from "./Voice";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("hi-IN"); // Default Hindi
  const navigate = useNavigate();

  // Use voice input hook
  const { startListening, stopListening } = useVoiceInput((text) => setSearchText(text));

  const handleVoiceToggle = () => {
    if (!listening) {
      startListening();
      setListening(true);
    } else {
      stopListening();
      setListening(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchText) return alert("Please enter search text");
    navigate(`/search?query=${encodeURIComponent(searchText)}&lang=${language}`);
    setSearchText("");
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    stopListening(); // stop previous recognition
  };

  return (
    <RBNavbar
      expand="md"
      className="shadow-sm py-2"
      style={{
        background: "linear-gradient(90deg, #a5d6a7, #c8e6c9, #dcedc8)",
        borderBottom: "3px solid #81c784",
      }}
    >
      <div className="container-fluid mx-auto px-4">
        {/* Logo */}
        <RBNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <div
            style={{
              width: "70px",
              height: "70px",
              backgroundColor: "#fff",
              border: "3px solid #4caf50",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
              marginRight: "10px",
            }}
          >
            <img
              src="/images/logo.png"
              alt="SmartKisaan logo"
              style={{ width: "60%", height: "60%", objectFit: "contain" }}
            />
          </div>
          <span className="h5 fw-bold mb-0" style={{ color: "#2e7d32" }}>
            🌾 KisaanSaathi
          </span>
        </RBNavbar.Brand>

        <RBNavbar.Toggle aria-controls="basic-navbar-nav" />
        <RBNavbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className="me-auto">
            {[
              { name: "Weather", link: "/weather" },
              { name: "Advisory", link: "/advisory" },
              { name: "Market", link: "/market" },
              { name: "Pest & Disease", link: "/disease" },
              { name: "Soil Health Report", link: "/soilReport" },
              { name: "Community", link: "/community" },
            ].map((item, idx) => (
              <Nav.Link
                as={Link}
                to={item.link}
                key={idx}
                className="fw-semibold mx-2"
                style={{ color: "#2e7d32" }}
              >
                {item.name}
              </Nav.Link>
            ))}
          </Nav>

          {/* Search bar + voice + language */}
          <Form className="d-flex align-items-center" onSubmit={handleSearch}>
            <FormControl
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-start border-success"
              style={{ width: "220px", backgroundColor: "#f1f8e9" }}
            />

            {/* Language selector */}
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-language"
                style={{ borderRadius: 0, marginLeft: 2 }}
              >
                {language === "hi-IN" ? "हिंदी" : language === "en-IN" ? "English" : "मराठी"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleLanguageChange("hi-IN")}>हिंदी</Dropdown.Item>
                <Dropdown.Item onClick={() => handleLanguageChange("en-IN")}>English</Dropdown.Item>
                <Dropdown.Item onClick={() => handleLanguageChange("mr-IN")}>मराठी</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Voice button */}
            <Button
              type="button"
              onClick={handleVoiceToggle}
              style={{
                backgroundColor: listening ? "#4caf50" : "#2196f3",
                borderColor: listening ? "#388e3c" : "#1976d2",
                color: "#fff",
                marginLeft: 2,
              }}
            >
              {listening ? "🎙️ Listening..." : "🎤"}
            </Button>

            <Button
              type="submit"
              style={{ backgroundColor: "#388e3c", borderColor: "#2e7d32", color: "#fff", marginLeft: 2 }}
            >
              🔍
            </Button>
          </Form>
        </RBNavbar.Collapse>
      </div>
    </RBNavbar>
  );
};

export default Navbar;
