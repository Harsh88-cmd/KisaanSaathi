import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Helper: Analyze soil data & suggest crops
const analyzeSoil = (data) => {
  let advice = [];
  let crops = [];

  data.forEach((sample) => {
    if (sample.Nitrogen < 40) {
      advice.push("Add nitrogen fertilizer (e.g., Urea).");
      crops.push("Pulses, Legumes");
    }
    if (sample.Phosphorus < 20) {
      advice.push("Apply phosphorus fertilizer (e.g., DAP).");
      crops.push("Wheat, Maize");
    }
    if (sample.Potassium < 30) {
      advice.push("Increase potassium with MOP fertilizer.");
      crops.push("Sugarcane, Potato");
    }
    if (sample.pH < 6) {
      advice.push("Soil is acidic: Add lime.");
      crops.push("Barley, Mustard");
    }
    if (sample.pH > 8) {
      advice.push("Soil is alkaline: Add gypsum.");
      crops.push("Cotton, Sunflower");
    }
    if (sample.OrganicCarbon < 0.75) {
      advice.push("Add organic manure or compost.");
      crops.push("Vegetables, Fruits");
    }
  });

  return { advice: [...new Set(advice)], crops: [...new Set(crops)] };
};

const SoilReport = () => {
  const [soilData, setSoilData] = useState([]);
  const [manualInput, setManualInput] = useState({
    Sample: "Manual Entry",
    Nitrogen: "",
    Phosphorus: "",
    Potassium: "",
    pH: "",
    OrganicCarbon: "",
  });

  // Handle file upload (CSV / Excel)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          setSoilData(result.data.filter((row) => row.Sample));
        },
      });
    } else if (file.name.endsWith(".xlsx")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const workbook = XLSX.read(evt.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        setSoilData(sheet);
      };
      reader.readAsBinaryString(file);
    }
  };

  // Download CSV Template
  const downloadTemplate = () => {
    const csvContent =
      "Sample,Nitrogen,Phosphorus,Potassium,pH,OrganicCarbon\n" +
      "Sample 1,50,20,40,6.5,0.8\n" +
      "Sample 2,60,25,35,7.0,1.0";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "soil_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add manual entry
  const addManualEntry = () => {
    if (
      !manualInput.Nitrogen ||
      !manualInput.Phosphorus ||
      !manualInput.Potassium ||
      !manualInput.pH ||
      !manualInput.OrganicCarbon
    ) {
      alert("Please fill all fields.");
      return;
    }
    setSoilData([...soilData, { ...manualInput }]);
    setManualInput({
      Sample: "Manual Entry",
      Nitrogen: "",
      Phosphorus: "",
      Potassium: "",
      pH: "",
      OrganicCarbon: "",
    });
  };

  // Export PDF
  const exportPDF = async () => {
    const input = document.getElementById("report-section");
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Soil_Health_Report.pdf");
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4 text-success">🌱 Soil Health Report</h2>

      {/* Upload Section */}
      <div className="card shadow-sm p-4 mb-4">
        <h5 className="mb-3">📤 Upload Soil Report (CSV/Excel)</h5>
        <input
          type="file"
          className="form-control mb-3"
          accept=".csv, .xlsx"
          onChange={handleFileUpload}
        />
        <button className="btn btn-outline-primary" onClick={downloadTemplate}>
          📥 Download Sample Template
        </button>
      </div>

      {/* Manual Data Entry */}
      <div className="card shadow-sm p-4 mb-4">
        <h5 className="mb-3">✍️ Enter Soil Data Manually</h5>
        <div className="row g-2">
          {["Nitrogen", "Phosphorus", "Potassium", "pH", "OrganicCarbon"].map(
            (field) => (
              <div className="col-md-2" key={field}>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  placeholder={field}
                  value={manualInput[field]}
                  onChange={(e) =>
                    setManualInput({ ...manualInput, [field]: e.target.value })
                  }
                />
              </div>
            )
          )}
          <div className="col-md-2">
            <button className="btn btn-success w-100" onClick={addManualEntry}>
              ➕ Add
            </button>
          </div>
        </div>
      </div>

      {/* Data Preview Section */}
      {soilData.length > 0 && (
        <div className="card shadow-sm p-4 mb-4">
          <h5 className="mb-3">📋 Entered / Uploaded Soil Data</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="table-light">
                <tr>
                  <th>Sample</th>
                  <th>Nitrogen</th>
                  <th>Phosphorus</th>
                  <th>Potassium</th>
                  <th>pH</th>
                  <th>Organic Carbon</th>
                </tr>
              </thead>
              <tbody>
                {soilData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.Sample || `Sample ${idx + 1}`}</td>
                    <td>{row.Nitrogen}</td>
                    <td>{row.Phosphorus}</td>
                    <td>{row.Potassium}</td>
                    <td>{row.pH}</td>
                    <td>{row.OrganicCarbon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Report Section */}
      <div id="report-section">
        {soilData.length > 0 && (
          <>

            {/* Graph */}
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="mb-3">📊 Soil Nutrient Levels (Farmer View)</h5>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={soilData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Sample" tick={{ fontSize: 14 }} />
                  <YAxis tick={{ fontSize: 14 }} />
                  <Tooltip
                    formatter={(value, name) => {
                      const icons = {
                        Nitrogen: "🌱",
                        Phosphorus: "🟡",
                        Potassium: "🔵",
                        pH: "⚖️",
                        OrganicCarbon: "🌿",
                      };
                      return [`${value}`, `${icons[name] || ""} ${name}`];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "14px" }} />

                  {/* Reference healthy ranges */}
                  <ReferenceLine y={40} label="Ideal N" stroke="green" strokeDasharray="4 4" />
                  <ReferenceLine y={20} label="Ideal P" stroke="orange" strokeDasharray="4 4" />
                  <ReferenceLine y={30} label="Ideal K" stroke="blue" strokeDasharray="4 4" />
                  <ReferenceLine y={6.5} label="Ideal pH" stroke="purple" strokeDasharray="4 4" />
                  <ReferenceLine y={0.75} label="Ideal OC" stroke="brown" strokeDasharray="4 4" />

                  {/* Bars for nutrients */}
                  <Bar dataKey="Nitrogen" fill="#2ecc71" />
                  <Bar dataKey="Phosphorus" fill="#f39c12" />
                  <Bar dataKey="Potassium" fill="#3498db" />
                  <Bar dataKey="pH" fill="#9b59b6" />
                  <Bar dataKey="OrganicCarbon" fill="#27ae60" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Analysis */}
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="text-success mb-3">💡 Soil Health Advice</h5>
              {analyzeSoil(soilData).advice.map((tip, index) => (
                <p key={index}>✅ {tip}</p>
              ))}

              <h6 className="mt-3 text-primary">🌾 Recommended Crops:</h6>
              <ul>
                {analyzeSoil(soilData).crops.map((crop, idx) => (
                  <li key={idx}>{crop}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Export PDF */}
      {soilData.length > 0 && (
        <button className="btn btn-success" onClick={exportPDF}>
          📄 Download Full Soil Report
        </button>
      )}
    </div>
  );
};

export default SoilReport;
