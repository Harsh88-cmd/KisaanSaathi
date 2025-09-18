import React, { useState } from "react";
import { Card, Button, Badge, Form } from "react-bootstrap";
import { FaLeaf, FaCloudRain, FaExclamationTriangle } from "react-icons/fa";

// Sample data
const advisoryData = [
  {
    id: 1,
    type: "Crop",
    title: "Crop Selection",
    shortDesc:
      "Based on your soil type and season, we recommend Wheat and Mustard.",
    fullDesc:
      "Based on your soil type and season, we recommend Wheat and Mustard for this period. Ensure proper irrigation and spacing to maximize yield. Avoid planting in low-lying areas prone to waterlogging.",
  },
  {
    id: 2,
    type: "Pest",
    title: "Pest Alert",
    shortDesc:
      "Locust sightings reported nearby. Take preventive action for your crops.",
    fullDesc:
      "Locust sightings reported nearby. Inspect your crops daily for damage. Use recommended organic pesticides like Neem oil. Cover seeds and young plants to reduce losses. Early action prevents crop damage.",
  },
  {
    id: 3,
    type: "Fertilizer",
    title: "Fertilizer Tip",
    shortDesc:
      "Nitrogen-rich fertilizer can improve yield for leafy crops.",
    fullDesc:
      "Nitrogen-rich fertilizer can improve yield for leafy crops. Apply recommended dosage carefully. Avoid overuse as it may harm soil health. Combine with organic compost for best results.",
  },
  {
    id: 4,
    type: "Weather",
    title: "Weather Advisory",
    shortDesc:
      "Heavy rainfall expected in your region in the next 2 days.",
    fullDesc:
      "Heavy rainfall expected in your region in the next 2 days. Protect crops from waterlogging by ensuring proper drainage. Delay harvesting and avoid spraying chemicals before rainfall.",
  },
];

const typeIcon = {
  Crop: <FaLeaf className="me-2 text-success" />,
  Pest: <FaExclamationTriangle className="me-2 text-danger" />,
  Fertilizer: <FaLeaf className="me-2 text-warning" />,
  Weather: <FaCloudRain className="me-2 text-primary" />,
};

const Advisory = () => {
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState({}); // Track expanded cards

  const filteredData =
    filter === "All"
      ? advisoryData
      : advisoryData.filter((item) => item.type === filter);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-success mb-4">Farm Advisory</h2>

      {/* Filter */}
      <Form.Select
        aria-label="Filter by type"
        className="mb-4"
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="All">All Advisories</option>
        <option value="Crop">Crop</option>
        <option value="Pest">Pest</option>
        <option value="Fertilizer">Fertilizer</option>
        <option value="Weather">Weather</option>
      </Form.Select>

      {/* Advisory Cards */}
      <div className="row">
        {filteredData.map((item) => (
          <div key={item.id} className="col-md-6 mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="d-flex align-items-center">
                  {typeIcon[item.type]}
                  {item.title}{" "}
                  <Badge bg="secondary" className="ms-2">
                    {item.type}
                  </Badge>
                </Card.Title>
                <Card.Text>
                  {expanded[item.id] ? item.fullDesc : item.shortDesc}
                </Card.Text>
                <Button
                  variant="success"
                  onClick={() => toggleExpand(item.id)}
                >
                  {expanded[item.id] ? "Show Less" : "Read More"}
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Advisory;
