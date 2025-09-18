import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Spinner, Button } from "react-bootstrap";
import axios from "axios";

function Market() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");

  const API_KEY = import.meta.env.VITE_MARKET_API_KEY;


  useEffect(() => {
    const fetchMarketPrices = async () => {
      try {
        const res = await axios.get(
          "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
          {
            params: {
              "api-key": API_KEY,
              format: "json",
              limit: 500,
            },
          }
        );
        setMarketData(res.data.records || []);
      } catch (err) {
        console.error("Error fetching market prices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketPrices();
  }, );

  // Extract unique dropdown options
  const states = [...new Set(marketData.map((item) => item.state))];
  const districts = [
    ...new Set(
      marketData
        .filter((item) => !selectedState || item.state === selectedState)
        .map((item) => item.district)
    ),
  ];
  const markets = [
    ...new Set(
      marketData
        .filter(
          (item) =>
            (!selectedState || item.state === selectedState) &&
            (!selectedDistrict || item.district === selectedDistrict)
        )
        .map((item) => item.market)
    ),
  ];

  // Apply filters (search + dropdowns)
  const filteredData = marketData.filter(
    (item) =>
      (!selectedState || item.state === selectedState) &&
      (!selectedDistrict || item.district === selectedDistrict) &&
      (!selectedMarket || item.market === selectedMarket) &&
      (item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ✅ Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedMarket("");
  };

  return (
    <div className="container mt-4 mb-4">
      {/* ✅ CSS inside component */}
      <style>{`
        .market-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .market-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      <h2 className="mb-4 text-center">🌾 Current Market Prices</h2>

      {/* Filters */}
      <Form className="d-flex flex-wrap gap-2 mb-4 align-items-center">
        {/* Search Box */}
        <Form.Control
          type="text"
          placeholder="🔍 Search by commodity, state or market..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow-1"
        />

        {/* State Dropdown */}
        <Form.Select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedDistrict("");
            setSelectedMarket("");
          }}
        >
          <option value="">Select State</option>
          {states.map((state, idx) => (
            <option key={idx} value={state}>
              {state}
            </option>
          ))}
        </Form.Select>

        {/* District Dropdown */}
        <Form.Select
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedMarket("");
          }}
          disabled={!selectedState}
        >
          <option value="">Select District</option>
          {districts.map((district, idx) => (
            <option key={idx} value={district}>
              {district}
            </option>
          ))}
        </Form.Select>

        {/* Market Dropdown */}
        <Form.Select
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
          disabled={!selectedDistrict}
        >
          <option value="">Select Market</option>
          {markets.map((market, idx) => (
            <option key={idx} value={market}>
              {market}
            </option>
          ))}
        </Form.Select>

        {/* ✅ Reset Button */}
        <Button variant="outline-danger" onClick={resetFilters}>
          Reset
        </Button>
      </Form>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p>Loading market data...</p>
        </div>
      ) : filteredData.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredData.map((item, idx) => (
            <Col key={idx}>
              <Card className="h-100 shadow-sm market-card">
                <Card.Body>
                  <Card.Title>{item.commodity}</Card.Title>
                  <Card.Text>
                    <strong>State:</strong> {item.state} <br />
                    <strong>District:</strong> {item.district} <br />
                    <strong>Market:</strong> {item.market} <br />
                    <strong>Variety:</strong> {item.variety} <br />
                    <strong>Price:</strong> {item.modal_price} ₹/quintal <br />
                    <small>
                      Min: {item.min_price} | Max: {item.max_price}
                    </small>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center mt-4">No data found.</p>
      )}
    </div>
  );
}

export default Market;
