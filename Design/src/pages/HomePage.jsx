import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomePage = () => {
  const scrollRef = useRef(null);

  // Scroll function
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth - 100; // scroll by visible width
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <main style={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <div
        className="container-fluid py-5"
        style={{
          background: "linear-gradient(135deg, #d4edda, #f1f8e9)",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            {/* Left Side Image */}
            <div className="col-md-6 mb-4">
              <motion.img
                src="/images/kisan-image2.jpg"
                alt="A farmer holding crops"
                className="img-fluid w-100 shadow-lg rounded-4 border border-success"
                style={{
                  height: "70vh",
                  objectFit: "cover",
                }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            </div>

            {/* Right Side Text */}
            <div className="col-md-6 text-start">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="fw-bold display-4 text-success mb-3">
                  🌾 KisaanSaathi
                </h1>
                <h3 className="fw-semibold mb-4" style={{ color: "#6c757d" }}>
                  🚜 Har Kadam Aapke Saath
                </h3>
                <p className="lead" style={{ color: "#4e5d4e" }}>
                  Empowering farmers with smart technology and actionable
                  insights for a better future. Get real-time weather updates,
                  market prices, and expert advisory to make informed decisions
                  and improve your yield.
                </p>

                {/* CTA Buttons */}
                <div className="mt-4">
                  <Link
                    to="/advisory"
                    className="btn btn-success btn-lg me-3 shadow rounded-pill"
                  >
                    🌱 Explore Advisory
                  </Link>
                  <Link
                    to="/weather"
                    className="btn btn-outline-success btn-lg shadow rounded-pill"
                  >
                    ☀ Check Weather
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="container mt-5">
        <h2 className="text-center fw-bold text-success mb-4">
          🌟 What We Offer
        </h2>

        {/* Arrows + Scroll Container */}
        <div className="position-relative">
          {/* Left Arrow */}
          <button
            className="btn btn-light shadow rounded-circle position-absolute top-50 start-0 translate-middle-y"
            style={{ zIndex: 10 }}
            onClick={() => scroll("left")}
          >
            ◀
          </button>

          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            className="d-flex overflow-auto pb-3"
            style={{ gap: "1rem", scrollBehavior: "smooth" }}
          >
            {[
              {
                title: "🌱 Advisory",
                color: "success",
                text: "Get expert tips for crop selection, fertilizer use, and pest control.",
              },
              {
                title: "☀ Weather",
                color: "primary",
                text: "Real-time weather updates to plan your farming activities.",
              },
              {
                title: "📈 Market",
                color: "warning",
                text: "Stay informed about market prices and sell crops at the best rates.",
              },
              {
                title: "🤝 Community",
                color: "danger",
                text: "Connect with other farmers and share experiences & solutions.",
              },
              {
                title: "🐛 Pest & Disease",
                color: "success",
                text: "Upload a pest/disease image and get solutions instantly.",
              },
              {
                title: "🌍 Soil Health Report",
                color: "primary",
                text: "Upload soil report or enter details manually to get insights.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className={`card border-${feature.color} border-2 shadow-sm p-3`}
                whileHover={{ scale: 1.07 }}
                style={{
                  minWidth: "250px",
                  maxWidth: "250px",
                  borderRadius: "1rem",
                  background:
                    feature.color === "warning"
                      ? "#fff8e1"
                      : feature.color === "danger"
                      ? "#fdecea"
                      : feature.color === "primary"
                      ? "#e3f2fd"
                      : "#eafbea",
                }}
              >
                <h5 className={`fw-bold text-${feature.color}`}>{feature.title}</h5>
                <p className="text-muted">{feature.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className="btn btn-light shadow rounded-circle position-absolute top-50 end-0 translate-middle-y"
            style={{ zIndex: 10 }}
            onClick={() => scroll("right")}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Final Call to Action */}
      <div
        className="container text-center mt-5 mb-5 p-5 rounded-4"
        style={{
          background:
            "linear-gradient(to right, #a5d6a7, #c8e6c9, #e6ee9c)",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h3 className="fw-bold mb-3 text-dark">
            🌾 Join thousands of farmers improving their yield with KisaanSaathi!
          </h3>
          <Link
            to="/FirstPage"
            className="btn btn-lg shadow rounded-pill"
            style={{
              backgroundColor: "#388e3c",
              color: "#fff",
              fontWeight: "bold",
              padding: "0.75rem 2rem",
            }}
          >
            🚀 Get Started Now
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default HomePage;
