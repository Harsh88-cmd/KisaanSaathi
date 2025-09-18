import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";

const SearchPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";
  const lang = params.get("lang") || "hi-IN";

  // Example data (replace with API or database)
  const data = [
    { id: 1, title: "आज का मौसम", description: "मौसम की जानकारी हिंदी में", language: "hi-IN" },
    { id: 2, title: "Market Prices Today", description: "Latest market prices in English", language: "en-IN" },
    { id: 3, title: "कीटक नियंत्रण", description: "मराठी मधील कीटक व रोग माहिती", language: "mr-IN" },
    { id: 4, title: "Soil Health Tips", description: "English soil management tips", language: "en-IN" },
    { id: 5, title: "पिकांचे रोग", description: "हिंदी में फसल रोग सलाह", language: "hi-IN" },
    { id: 6, title: "शेतकरी सल्ला", description: "मराठी मध्ये शेतकरी सल्ला", language: "mr-IN" },
  ];

  // Example popular queries (can come from API)
  const popularQueries = [
    { query: "मौसम", lang: "hi-IN" },
    { query: "Market Prices", lang: "en-IN" },
    { query: "कीटक", lang: "mr-IN" },
  ];

  // Filter based on search query and selected language
  const results = data.filter(
    item =>
      item.language === lang &&
      item.title.toLowerCase().includes(query.toLowerCase())
  );

  // Filter suggestions for the current language
  const suggestions = popularQueries
    .filter(s => s.lang === lang && !s.query.toLowerCase().includes(query.toLowerCase()));

  return (
    <Container style={{ paddingTop: "20px", minHeight: "70vh" }}>
      <h2>Search Results</h2>

      {query && (
        <p>
          Showing results for: <strong>{query}</strong>{" "}
          <em>({lang === "hi-IN" ? "हिंदी" : lang === "en-IN" ? "English" : "मराठी"})</em>
        </p>
      )}

      {results.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4 mt-3">
          {results.map(item => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <>
          <p>No results found for "{query}"</p>
          {suggestions.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h5>Try these suggestions:</h5>
              {suggestions.map((s, idx) => (
                <Badge
                  key={idx}
                  bg="success"
                  style={{ cursor: "pointer", marginRight: "5px", padding: "10px", fontSize: "0.9rem" }}
                  onClick={() => window.location.href = `/search?query=${encodeURIComponent(s.query)}&lang=${lang}`}
                >
                  {s.query}
                </Badge>
              ))}
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchPage;
