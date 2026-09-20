import { useState } from "react";
import "./App.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* Leaflet Marker Fix */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedAsset, setSelectedAsset] = useState(null);

  /* =========================
     ASSETS
  ========================= */

  const assets = [
    {
      id: "WP-07",
      name: "Water Pump WP-07",
      type: "Water Pump",
      location: "Zone 2",
      health: 38,
      risk: "High",
      impact: "High",
      priority: "Critical",
      status: "Needs Attention",
    },

    {
      id: "BR-12",
      name: "Bridge BR-12",
      type: "Bridge",
      location: "Zone 1",
      health: 52,
      risk: "High",
      impact: "High",
      priority: "High",
      status: "Inspection Required",
    },

    {
      id: "PL-04",
      name: "Pipeline PL-04",
      type: "Water Pipeline",
      location: "Zone 4",
      health: 67,
      risk: "Medium",
      impact: "Medium",
      priority: "Medium",
      status: "Monitoring",
    },

    {
      id: "SL-21",
      name: "Streetlight SL-21",
      type: "Streetlight",
      location: "Zone 3",
      health: 89,
      risk: "Low",
      impact: "Low",
      priority: "Low",
      status: "Healthy",
    },
  ];

  /* =========================
     RISK ANALYSIS
  ========================= */

  const [analysisAsset, setAnalysisAsset] =
    useState("Water Pump");

  const [formData, setFormData] = useState({
    value1: "",
    value2: "",
    maintenanceDays: "",
  });

  const [analysisResult, setAnalysisResult] =
    useState(null);

  const assetParameters = {
    "Water Pump": {
      value1: "Vibration Level (mm/s)",
      value2: "Operating Temperature (°C)",
      placeholder1: "Example: 5.5",
      placeholder2: "Example: 65",
    },

    Bridge: {
      value1: "Structural Condition Score (0-100)",
      value2: "Daily Traffic Level (0-100)",
      placeholder1: "Example: 55",
      placeholder2: "Example: 80",
    },

    "Water Pipeline": {
      value1: "Pressure Variation (%)",
      value2: "Leak Reports",
      placeholder1: "Example: 20",
      placeholder2: "Example: 4",
    },

    Streetlight: {
      value1: "Voltage Variation (%)",
      value2: "Fault Reports",
      placeholder1: "Example: 8",
      placeholder2: "Example: 2",
    },
  };

  const analyzeRisk = () => {
    const value1 = Number(formData.value1);
    const value2 = Number(formData.value2);
    const days = Number(formData.maintenanceDays);

    if (
      formData.value1 === "" ||
      formData.value2 === "" ||
      formData.maintenanceDays === ""
    ) {
      alert("Please enter all values.");
      return;
    }

    let riskPoints = 0;
    let reasons = [];

    /* WATER PUMP */

    if (analysisAsset === "Water Pump") {
      if (value1 > 7) {
        riskPoints += 35;
        reasons.push("High vibration detected");
      } else if (value1 > 4) {
        riskPoints += 20;
        reasons.push(
          "Vibration is above normal range"
        );
      }

      if (value2 > 80) {
        riskPoints += 35;
        reasons.push(
          "High operating temperature"
        );
      } else if (value2 > 60) {
        riskPoints += 20;
        reasons.push(
          "Temperature requires monitoring"
        );
      }
    }

    /* BRIDGE */

    if (analysisAsset === "Bridge") {
      if (value1 < 40) {
        riskPoints += 40;
        reasons.push(
          "Poor structural condition"
        );
      } else if (value1 < 65) {
        riskPoints += 20;
        reasons.push(
          "Structural condition requires inspection"
        );
      }

      if (value2 > 75) {
        riskPoints += 30;
        reasons.push(
          "High traffic exposure"
        );
      } else if (value2 > 50) {
        riskPoints += 15;
        reasons.push(
          "Moderate traffic exposure"
        );
      }
    }

    /* PIPELINE */

    if (analysisAsset === "Water Pipeline") {
      if (value1 > 25) {
        riskPoints += 40;
        reasons.push(
          "High pressure variation detected"
        );
      } else if (value1 > 12) {
        riskPoints += 20;
        reasons.push(
          "Pressure variation requires monitoring"
        );
      }

      if (value2 >= 5) {
        riskPoints += 30;
        reasons.push(
          "Multiple leak reports recorded"
        );
      } else if (value2 >= 2) {
        riskPoints += 15;
        reasons.push(
          "Recent leak reports detected"
        );
      }
    }

    /* STREETLIGHT */

    if (analysisAsset === "Streetlight") {
      if (value1 > 15) {
        riskPoints += 35;
        reasons.push(
          "High voltage variation detected"
        );
      } else if (value1 > 7) {
        riskPoints += 15;
        reasons.push(
          "Voltage variation requires monitoring"
        );
      }

      if (value2 >= 5) {
        riskPoints += 30;
        reasons.push(
          "Repeated fault reports recorded"
        );
      } else if (value2 >= 2) {
        riskPoints += 15;
        reasons.push(
          "Recent fault reports detected"
        );
      }
    }

    /* MAINTENANCE */

    if (days > 180) {
      riskPoints += 30;
      reasons.push("Maintenance is overdue");
    } else if (days > 90) {
      riskPoints += 15;
      reasons.push(
        "Maintenance inspection is due"
      );
    }

    const riskScore = Math.min(
      riskPoints,
      100
    );

    const healthScore = Math.max(
      100 - riskScore,
      0
    );

    let risk = "Low";
    let priority = "Low";

    if (riskScore >= 70) {
      risk = "High";
      priority = "Critical";
    } else if (riskScore >= 40) {
      risk = "Medium";
      priority = "Medium";
    }

    if (reasons.length === 0) {
      reasons.push(
        "No major abnormal pattern detected"
      );
    }

    setAnalysisResult({
      riskScore,
      healthScore,
      risk,
      priority,
      reasons,
    });
  };

  /* =========================
     MAINTENANCE
  ========================= */

  const maintenanceTasks = [
    {
      id: 1,
      asset: "Water Pump WP-07",
      priority: "Critical",
      status: "Scheduled",
      date: "22 Sep 2026",
      beforeHealth: 38,
      afterHealth: null,
    },

    {
      id: 2,
      asset: "Bridge BR-12",
      priority: "High",
      status: "In Progress",
      date: "21 Sep 2026",
      beforeHealth: 52,
      afterHealth: null,
    },

    {
      id: 3,
      asset: "Pipeline PL-04",
      priority: "Medium",
      status: "Completed",
      date: "18 Sep 2026",
      beforeHealth: 67,
      afterHealth: 84,
    },
  ];

  /* =========================
     MAP DATA
  ========================= */

  const mapAssets = [
    {
      id: 1,
      name: "Water Pump WP-07",
      type: "Water Pump",
      position: [23.2599, 77.4126],
      risk: "High",
      health: 38,
    },

    {
      id: 2,
      name: "Bridge BR-12",
      type: "Bridge",
      position: [23.2505, 77.4001],
      risk: "High",
      health: 52,
    },

    {
      id: 3,
      name: "Pipeline PL-04",
      type: "Water Pipeline",
      position: [23.2705, 77.425],
      risk: "Medium",
      health: 67,
    },

    {
      id: 4,
      name: "Streetlight SL-21",
      type: "Streetlight",
      position: [23.2425, 77.431],
      risk: "Low",
      health: 89,
    },
  ];

  const openPage = (page) => {
    setActivePage(page);
    setSelectedAsset(null);
  };

  return (
    <div className="dashboard">

      {/* ======================
          SIDEBAR
      ====================== */}

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">IG</div>

          <div>
            <h2>InfraGuard</h2>
            <span>Predict. Prioritize. Protect.</span>
          </div>
        </div>

        <nav>

          <button
            className={`nav-item ${
              activePage === "Dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              openPage("Dashboard")
            }
          >
            ◫ Dashboard
          </button>

          <button
            className={`nav-item ${
              activePage === "Assets" ||
              activePage === "Asset Details"
                ? "active"
                : ""
            }`}
            onClick={() =>
              openPage("Assets")
            }
          >
            ◈ Assets
          </button>

          <button
            className={`nav-item ${
              activePage === "Risk Analysis"
                ? "active"
                : ""
            }`}
            onClick={() =>
              openPage("Risk Analysis")
            }
          >
            ⚠ Risk Analysis
          </button>

          <button
            className={`nav-item ${
              activePage === "Maintenance"
                ? "active"
                : ""
            }`}
            onClick={() =>
              openPage("Maintenance")
            }
          >
            🔧 Maintenance
          </button>

          <button
            className={`nav-item ${
              activePage === "City Map"
                ? "active"
                : ""
            }`}
            onClick={() =>
              openPage("City Map")
            }
          >
            ◎ City Map
          </button>

          <button
            className={`nav-item ${
              activePage === "Reports"
                ? "active"
                : ""
            }`}
            onClick={() =>
              openPage("Reports")
            }
          >
            ▤ Reports
          </button>

        </nav>

        <div className="sidebar-bottom">
          <p>InfraGuard Prototype</p>
          <span>Demo Environment</span>
        </div>

      </aside>

      {/* ======================
          MAIN
      ====================== */}

      <main className="main-content">

        {/* ======================
            DASHBOARD
        ====================== */}

        {activePage === "Dashboard" && (
          <>
            <header className="topbar">

              <div>
                <p className="page-label">
                  CITY OPERATIONS
                </p>

                <h1>
                  Infrastructure Overview
                </h1>

                <p>
                  Monitor asset health,
                  identify risks and prioritize
                  maintenance.
                </p>
              </div>

              <div className="system-status">
                <span className="status-dot"></span>
                System Active
              </div>

            </header>

            <section className="cards">

              <div className="card">
                <span>Total Assets</span>
                <h2>128</h2>
                <p>
                  Monitored infrastructure
                </p>
              </div>

              <div className="card">
                <span>High Risk</span>
                <h2 className="red-text">
                  12
                </h2>
                <p>Require attention</p>
              </div>

              <div className="card">
                <span>Medium Risk</span>
                <h2 className="orange-text">
                  31
                </h2>
                <p>Under monitoring</p>
              </div>

              <div className="card">
                <span>Healthy</span>
                <h2 className="green-text">
                  85
                </h2>
                <p>Operating normally</p>
              </div>

            </section>

            <section className="info-grid">

              <div className="panel">

                <div className="panel-heading">
                  <div>
                    <h3>Risk Overview</h3>
                    <p>
                      Current infrastructure
                      risk distribution.
                    </p>
                  </div>
                </div>

                <div className="risk-row">
                  <div className="risk-title">
                    <span>High Risk</span>
                    <strong>12</strong>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-value high"
                      style={{
                        width: "14%",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="risk-row">
                  <div className="risk-title">
                    <span>Medium Risk</span>
                    <strong>31</strong>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-value medium"
                      style={{
                        width: "36%",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="risk-row">
                  <div className="risk-title">
                    <span>
                      Low Risk / Healthy
                    </span>
                    <strong>85</strong>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-value low"
                      style={{
                        width: "100%",
                      }}
                    ></div>
                  </div>
                </div>

              </div>

              <div className="panel city-status">

                <h3>
                  City Infrastructure Health
                </h3>

                <p>
                  Overall condition of
                  monitored assets.
                </p>

                <div className="health-circle">
                  <div>
                    <strong>76</strong>
                    <span>/100</span>
                  </div>
                </div>

                <div className="health-label">
                  Overall condition:
                  <strong> Stable</strong>
                </div>

              </div>

            </section>

            <section className="panel priority-panel">

              <div className="panel-heading">

                <div>
                  <h3>
                    Maintenance Priority
                  </h3>

                  <p>
                    Assets requiring
                    immediate attention.
                  </p>
                </div>

                <button
                  className="view-all-btn"
                  onClick={() =>
                    openPage("Assets")
                  }
                >
                  View All Assets
                </button>

              </div>

              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Location</th>
                      <th>Health</th>
                      <th>Risk</th>
                      <th>Impact</th>
                      <th>Priority</th>
                    </tr>
                  </thead>

                  <tbody>

                    {assets
                      .slice(0, 3)
                      .map((asset) => (
                        <tr key={asset.id}>

                          <td>
                            <strong>
                              {asset.name}
                            </strong>
                          </td>

                          <td>
                            {asset.location}
                          </td>

                          <td>
                            {asset.health}/100
                          </td>

                          <td>
                            <span
                              className={`badge ${asset.risk.toLowerCase()}`}
                            >
                              {asset.risk}
                            </span>
                          </td>

                          <td>
                            {asset.impact}
                          </td>

                          <td>
                            <strong
                              className={
                                asset.priority ===
                                  "Critical" ||
                                asset.priority ===
                                  "High"
                                  ? "critical-text"
                                  : ""
                              }
                            >
                              {asset.priority}
                            </strong>
                          </td>

                        </tr>
                      ))}

                  </tbody>

                </table>

              </div>

            </section>
          </>
        )}

        {/* ======================
            ASSETS
        ====================== */}

        {activePage === "Assets" && (
          <>
            <header className="topbar">

              <div>
                <h1>
                  Infrastructure Assets
                </h1>

                <p>
                  Monitor the condition and
                  risk level of city assets.
                </p>
              </div>

              <button className="add-asset">
                + Add Asset
              </button>

            </header>

            <div className="asset-grid">

              {assets.map((asset) => (
                <div
                  className="asset-card"
                  key={asset.id}
                >

                  <div className="asset-card-top">

                    <div className="asset-symbol">
                      {asset.type === "Bridge"
                        ? "🌉"
                        : asset.type ===
                          "Water Pump"
                        ? "💧"
                        : asset.type ===
                          "Water Pipeline"
                        ? "🔵"
                        : "💡"}
                    </div>

                    <span
                      className={`badge ${asset.risk.toLowerCase()}`}
                    >
                      {asset.risk} Risk
                    </span>

                  </div>

                  <h3>{asset.name}</h3>

                  <p className="asset-location">
                    📍 {asset.location}
                  </p>

                  <div className="asset-health-title">
                    <span>Asset Health</span>
                    <strong>
                      {asset.health}/100
                    </strong>
                  </div>

                  <div className="asset-health-bar">

                    <div
                      className={`asset-health-fill ${asset.risk.toLowerCase()}`}
                      style={{
                        width: `${asset.health}%`,
                      }}
                    ></div>

                  </div>

                  <div className="asset-info">

                    <div>
                      <span>
                        Public Impact
                      </span>

                      <strong>
                        {asset.impact}
                      </strong>
                    </div>

                    <div>
                      <span>Priority</span>

                      <strong>
                        {asset.priority}
                      </strong>
                    </div>

                  </div>

                  <button
                    className="asset-details-btn"
                    onClick={() => {
                      setSelectedAsset(
                        asset
                      );

                      setActivePage(
                        "Asset Details"
                      );
                    }}
                  >
                    View Asset Details →
                  </button>

                </div>
              ))}

            </div>
          </>
        )}

        {/* ======================
            ASSET DETAILS
        ====================== */}

        {activePage ===
          "Asset Details" &&
          selectedAsset && (
            <>

              <button
                className="back-btn"
                onClick={() =>
                  setActivePage("Assets")
                }
              >
                ← Back to Assets
              </button>

              <header className="asset-detail-header">

                <div>
                  <p className="small-label">
                    ASSET DETAILS
                  </p>

                  <h1>
                    {selectedAsset.name}
                  </h1>

                  <p>
                    📍{" "}
                    {selectedAsset.location}
                    {" • "}
                    {selectedAsset.type}
                  </p>
                </div>

                <span
                  className={`detail-risk ${selectedAsset.risk.toLowerCase()}`}
                >
                  {selectedAsset.risk} Risk
                </span>

              </header>

              <section className="detail-cards">

                <div className="detail-card">
                  <span>Asset Health</span>

                  <h2>
                    {selectedAsset.health}
                    <small>/100</small>
                  </h2>

                  <p>
                    Current condition score
                  </p>
                </div>

                <div className="detail-card">
                  <span>Failure Risk</span>

                  <h2>
                    {selectedAsset.risk}
                  </h2>

                  <p>
                    Estimated risk level
                  </p>
                </div>

                <div className="detail-card">
                  <span>Public Impact</span>

                  <h2>
                    {selectedAsset.impact}
                  </h2>

                  <p>
                    Impact if service fails
                  </p>
                </div>

                <div className="detail-card">
                  <span>
                    Maintenance Priority
                  </span>

                  <h2>
                    {selectedAsset.priority}
                  </h2>

                  <p>
                    Recommended attention
                    level
                  </p>
                </div>

              </section>

              <section className="detail-layout">

                <div className="detail-panel">

                  <div className="panel-title">

                    <div className="analysis-icon">
                      ⚠
                    </div>

                    <div>
                      <h3>
                        Why this risk?
                      </h3>

                      <p>
                        Factors contributing
                        to the current risk
                        level.
                      </p>
                    </div>

                  </div>

                  <div className="reason-list">

                    {selectedAsset.type ===
                      "Water Pump" && (
                      <>
                        <Reason
                          icon="⚡"
                          title="Abnormal vibration pattern"
                          text="Recent readings are above the normal operating range."
                        />

                        <Reason
                          icon="📉"
                          title="Performance decline"
                          text="Pump efficiency has decreased in recent observations."
                        />

                        <Reason
                          icon="🛠"
                          title="Maintenance overdue"
                          text="Scheduled inspection requires attention."
                        />
                      </>
                    )}

                    {selectedAsset.type ===
                      "Bridge" && (
                      <>
                        <Reason
                          icon="🔎"
                          title="Inspection warning"
                          text="Recent inspection records indicate condition concerns."
                        />

                        <Reason
                          icon="🚗"
                          title="High usage"
                          text="The asset serves a high level of daily public movement."
                        />

                        <Reason
                          icon="🕒"
                          title="Asset age"
                          text="Age increases the need for regular condition checks."
                        />
                      </>
                    )}

                    {selectedAsset.type ===
                      "Water Pipeline" && (
                      <>
                        <Reason
                          icon="💧"
                          title="Pressure variation"
                          text="Recent data shows unusual changes in pressure."
                        />

                        <Reason
                          icon="🛠"
                          title="Previous repairs"
                          text="Maintenance history shows repeated service activity."
                        />
                      </>
                    )}

                    {selectedAsset.type ===
                      "Streetlight" && (
                      <Reason
                        icon="✓"
                        title="Normal performance"
                        text="No major abnormal pattern is currently detected."
                      />
                    )}

                  </div>

                </div>

                <div className="detail-panel recommendation-panel">

                  <div className="panel-title">

                    <div className="recommend-icon">
                      ✓
                    </div>

                    <div>
                      <h3>
                        Recommended Action
                      </h3>

                      <p>
                        Decision support for
                        the maintenance team.
                      </p>
                    </div>

                  </div>

                  <div className="recommendation-box">

                    <span>PRIORITY</span>

                    <h2>
                      {
                        selectedAsset.priority
                      }
                    </h2>

                  </div>

                  <p className="recommendation-text">
                    Schedule inspection and
                    maintenance based on the
                    current risk level and
                    public-service impact.
                  </p>

                  <button
                    className="maintenance-btn"
                    onClick={() =>
                      openPage(
                        "Maintenance"
                      )
                    }
                  >
                    Schedule Maintenance
                  </button>

                </div>

              </section>
            </>
          )}

        {/* ======================
            RISK ANALYSIS
        ====================== */}

        {activePage ===
          "Risk Analysis" && (
            <>
              <header className="topbar">

                <div>
                  <h1>Risk Analysis</h1>

                  <p>
                    Analyze asset condition
                    and identify potential
                    maintenance risks.
                  </p>
                </div>

              </header>

              <section className="risk-analysis-layout">

                <div className="analysis-form-card">

                  <div className="analysis-heading">

                    <div className="analysis-large-icon">
                      ⚡
                    </div>

                    <div>
                      <h3>
                        Asset Condition Input
                      </h3>

                      <p>
                        Enter available asset
                        readings for analysis.
                      </p>
                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Asset Type
                    </label>

                    <select
                      value={
                        analysisAsset
                      }
                      onChange={(e) => {
                        setAnalysisAsset(
                          e.target.value
                        );

                        setFormData({
                          value1: "",
                          value2: "",
                          maintenanceDays:
                            "",
                        });

                        setAnalysisResult(
                          null
                        );
                      }}
                    >
                      <option>
                        Water Pump
                      </option>

                      <option>
                        Bridge
                      </option>

                      <option>
                        Water Pipeline
                      </option>

                      <option>
                        Streetlight
                      </option>

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      {
                        assetParameters[
                          analysisAsset
                        ].value1
                      }
                    </label>

                    <input
                      type="number"
                      placeholder={
                        assetParameters[
                          analysisAsset
                        ].placeholder1
                      }
                      value={
                        formData.value1
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value1:
                            e.target
                              .value,
                        })
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      {
                        assetParameters[
                          analysisAsset
                        ].value2
                      }
                    </label>

                    <input
                      type="number"
                      placeholder={
                        assetParameters[
                          analysisAsset
                        ].placeholder2
                      }
                      value={
                        formData.value2
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value2:
                            e.target
                              .value,
                        })
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Days Since Last
                      Maintenance
                    </label>

                    <input
                      type="number"
                      placeholder="Example: 120"
                      value={
                        formData.maintenanceDays
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maintenanceDays:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <button
                    className="analyze-btn"
                    onClick={analyzeRisk}
                  >
                    Analyze Risk →
                  </button>

                  <p className="prototype-note">
                    Prototype risk engine using
                    illustrative rules.
                  </p>

                </div>

                <div className="analysis-result-card">

                  {!analysisResult ? (
                    <div className="empty-analysis">

                      <div>📊</div>

                      <h3>
                        Ready for Analysis
                      </h3>

                      <p>
                        Enter asset condition
                        data and click Analyze
                        Risk to view the
                        assessment.
                      </p>

                    </div>
                  ) : (
                    <>
                      <div className="result-header">

                        <div>
                          <span>
                            ANALYSIS RESULT
                          </span>

                          <h3>
                            {analysisAsset}
                          </h3>
                        </div>

                        <span
                          className={`result-risk ${analysisResult.risk.toLowerCase()}`}
                        >
                          {
                            analysisResult.risk
                          }{" "}
                          Risk
                        </span>

                      </div>

                      <div className="score-grid">

                        <div className="score-box">

                          <span>
                            Health Score
                          </span>

                          <strong>
                            {
                              analysisResult.healthScore
                            }
                          </strong>

                          <small>
                            /100
                          </small>

                        </div>

                        <div className="score-box">

                          <span>
                            Risk Score
                          </span>

                          <strong>
                            {
                              analysisResult.riskScore
                            }
                          </strong>

                          <small>
                            /100
                          </small>

                        </div>

                      </div>

                      <div className="risk-meter">

                        <div className="risk-meter-title">

                          <span>
                            Failure Risk
                          </span>

                          <strong>
                            {
                              analysisResult.riskScore
                            }
                            %
                          </strong>

                        </div>

                        <div className="risk-meter-track">

                          <div
                            className={`risk-meter-fill ${analysisResult.risk.toLowerCase()}`}
                            style={{
                              width: `${analysisResult.riskScore}%`,
                            }}
                          ></div>

                        </div>

                      </div>

                      <div className="risk-reasons">

                        <h4>
                          Why this risk?
                        </h4>

                        {analysisResult.reasons.map(
                          (
                            reason,
                            index
                          ) => (
                            <div
                              className="risk-reason-item"
                              key={
                                index
                              }
                            >
                              <span>
                                ✓
                              </span>

                              <p>
                                {reason}
                              </p>
                            </div>
                          )
                        )}

                      </div>

                      <div className="priority-result">

                        <div>
                          <span>
                            Maintenance
                            Priority
                          </span>

                          <h3>
                            {
                              analysisResult.priority
                            }
                          </h3>
                        </div>

                        <div className="priority-icon">
                          🔧
                        </div>

                      </div>
                    </>
                  )}

                </div>

              </section>
            </>
          )}

        {/* ======================
            MAINTENANCE
        ====================== */}

        {activePage ===
          "Maintenance" && (
            <>
              <header className="topbar">

                <div>
                  <h1>
                    Maintenance Management
                  </h1>

                  <p>
                    Plan maintenance based on
                    asset risk and
                    public-service impact.
                  </p>
                </div>

                <button className="add-asset">
                  + Schedule Maintenance
                </button>

              </header>

              <section className="maintenance-summary">

                <MaintenanceStat
                  title="Critical Tasks"
                  value="1"
                  text="Immediate attention required"
                />

                <MaintenanceStat
                  title="Scheduled"
                  value="1"
                  text="Upcoming maintenance"
                />

                <MaintenanceStat
                  title="In Progress"
                  value="1"
                  text="Currently being handled"
                />

                <MaintenanceStat
                  title="Completed"
                  value="1"
                  text="Maintenance completed"
                />

              </section>

              <section className="maintenance-grid">

                <div className="maintenance-list">

                  <div className="maintenance-list-header">

                    <h3>
                      Maintenance Priority
                    </h3>

                    <p>
                      Tasks ordered by risk
                      and service impact.
                    </p>

                  </div>

                  {maintenanceTasks.map(
                    (task) => (
                      <div
                        className="maintenance-task"
                        key={task.id}
                      >

                        <div className="task-main">

                          <div className="maintenance-tool">
                            🔧
                          </div>

                          <div>
                            <h4>
                              {task.asset}
                            </h4>

                            <p>
                              Scheduled:{" "}
                              {task.date}
                            </p>
                          </div>

                        </div>

                        <div className="task-labels">

                          <span
                            className={`maintenance-priority ${task.priority.toLowerCase()}`}
                          >
                            {
                              task.priority
                            }
                          </span>

                          <span
                            className={`maintenance-status ${task.status
                              .toLowerCase()
                              .replace(
                                " ",
                                "-"
                              )}`}
                          >
                            {task.status}
                          </span>

                        </div>

                      </div>
                    )
                  )}

                </div>

                <div className="impact-tracker">

                  <div className="tracker-heading">

                    <div className="tracker-icon">
                      📈
                    </div>

                    <div>
                      <h3>
                        Maintenance Impact
                        Tracker
                      </h3>

                      <p>
                        Compare asset
                        condition after
                        maintenance.
                      </p>
                    </div>

                  </div>

                  <div className="tracker-asset">
                    Pipeline PL-04
                  </div>

                  <div className="before-after">

                    <div className="condition-box before">

                      <span>
                        BEFORE
                      </span>

                      <h2>67</h2>

                      <p>
                        Health Score
                      </p>

                    </div>

                    <div className="comparison-arrow">
                      →
                    </div>

                    <div className="condition-box after">

                      <span>
                        AFTER
                      </span>

                      <h2>84</h2>

                      <p>
                        Health Score
                      </p>

                    </div>

                  </div>

                  <div className="improvement-box">

                    <span>
                      Condition Change
                    </span>

                    <strong>
                      +17 points ↑
                    </strong>

                  </div>

                  <div className="tracker-message">
                    ✓ Asset condition
                    indicators improved after
                    maintenance.
                  </div>

                  <p className="prototype-note">
                    Demo maintenance record
                    for prototype
                    visualization.
                  </p>

                </div>

              </section>
            </>
          )}

        {/* ======================
            CITY MAP
        ====================== */}

        {activePage === "City Map" && (
          <>
            <header className="topbar">

              <div>
                <h1>
                  City Infrastructure Map
                </h1>

                <p>
                  View monitored assets and
                  their current risk status.
                </p>
              </div>

              <div className="map-legend">
                <span>🔴 High</span>
                <span>🟠 Medium</span>
                <span>🟢 Low</span>
              </div>

            </header>

            <section className="map-layout">

              <div className="map-panel">

                <MapContainer
                  center={[
                    23.2599,
                    77.4126,
                  ]}
                  zoom={13}
                  className="leaflet-map"
                >

                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {mapAssets.map(
                    (asset) => (
                      <Marker
                        key={asset.id}
                        position={
                          asset.position
                        }
                      >

                        <Popup>
                          <div className="map-popup">

                            <strong>
                              {asset.name}
                            </strong>

                            <p>
                              {asset.type}
                            </p>

                            <p>
                              Health Score:{" "}
                              <b>
                                {
                                  asset.health
                                }
                                /100
                              </b>
                            </p>

                            <p>
                              Risk:{" "}
                              <b>
                                {
                                  asset.risk
                                }
                              </b>
                            </p>

                          </div>
                        </Popup>

                      </Marker>
                    )
                  )}

                </MapContainer>

              </div>

              <div className="map-assets-panel">

                <div className="map-assets-heading">

                  <h3>
                    Asset Status
                  </h3>

                  <p>
                    Monitored infrastructure
                    in this demo area.
                  </p>

                </div>

                {mapAssets.map(
                  (asset) => (
                    <div
                      className="map-asset-item"
                      key={asset.id}
                    >

                      <div
                        className={`risk-dot ${asset.risk.toLowerCase()}`}
                      ></div>

                      <div className="map-asset-info">

                        <strong>
                          {asset.name}
                        </strong>

                        <span>
                          {asset.type}
                          {" • "}
                          Health{" "}
                          {asset.health}/100
                        </span>

                      </div>

                      <span
                        className={`map-risk-label ${asset.risk.toLowerCase()}`}
                      >
                        {asset.risk}
                      </span>

                    </div>
                  )
                )}

                <p className="prototype-note">
                  Map locations are simulated
                  for prototype
                  demonstration.
                </p>

              </div>

            </section>
          </>
        )}

        {/* ======================
            REPORTS
        ====================== */}

        {activePage === "Reports" && (
          <>
            <header className="topbar">

              <div>
                <h1>
                  Infrastructure Reports
                </h1>

                <p>
                  Overview of asset risk,
                  maintenance activity and
                  condition changes.
                </p>
              </div>

              <button
                className="report-btn"
                onClick={() =>
                  window.print()
                }
              >
                Print Report
              </button>

            </header>

            <section className="report-summary">

              <ReportStat
                title="Total Assets"
                value="128"
                text="Monitored infrastructure"
              />

              <ReportStat
                title="High Risk"
                value="12"
                text="Require attention"
                className="report-red"
              />

              <ReportStat
                title="Maintenance Completed"
                value="24"
                text="Recorded maintenance tasks"
                className="report-blue"
              />

              <ReportStat
                title="Average Health"
                value="76/100"
                text="Overall asset condition"
                className="report-green"
              />

            </section>

            <section className="report-grid">

              <div className="report-panel">

                <div className="report-panel-heading">
                  <h3>
                    Risk Distribution
                  </h3>

                  <p>
                    Current risk levels
                    across monitored assets.
                  </p>
                </div>

                <ReportRisk
                  title="High Risk"
                  value="12"
                  width="14%"
                  type="high"
                />

                <ReportRisk
                  title="Medium Risk"
                  value="31"
                  width="36%"
                  type="medium"
                />

                <ReportRisk
                  title="Low Risk / Healthy"
                  value="85"
                  width="100%"
                  type="low"
                />

              </div>

              <div className="report-panel">

                <div className="report-panel-heading">
                  <h3>
                    Maintenance Impact
                  </h3>

                  <p>
                    Example condition change
                    after maintenance.
                  </p>
                </div>

                <div className="report-impact-asset">

                  <strong>
                    Pipeline PL-04
                  </strong>

                  <span>
                    Completed
                  </span>

                </div>

                <div className="report-before-after">

                  <div>
                    <span>
                      Before
                    </span>

                    <h2>67</h2>

                    <small>
                      Health Score
                    </small>
                  </div>

                  <div className="report-arrow">
                    →
                  </div>

                  <div>
                    <span>After</span>

                    <h2>84</h2>

                    <small>
                      Health Score
                    </small>
                  </div>

                </div>

                <div className="report-improvement">
                  +17 point condition change
                </div>

              </div>

            </section>

            <section className="report-panel report-priority">

              <div className="report-panel-heading">

                <h3>
                  Priority Assets
                </h3>

                <p>
                  Assets requiring attention
                  based on risk and public
                  impact.
                </p>

              </div>

              <div className="table-wrapper">

                <table className="report-table">

                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Health</th>
                      <th>Risk</th>
                      <th>
                        Public Impact
                      </th>
                      <th>Priority</th>
                    </tr>
                  </thead>

                  <tbody>

                    {assets
                      .slice(0, 3)
                      .map((asset) => (
                        <tr key={asset.id}>

                          <td>
                            {asset.name}
                          </td>

                          <td>
                            {asset.health}/100
                          </td>

                          <td>
                            <span
                              className={`badge ${asset.risk.toLowerCase()}`}
                            >
                              {asset.risk}
                            </span>
                          </td>

                          <td>
                            {asset.impact}
                          </td>

                          <td>
                            <strong
                              className={
                                asset.priority ===
                                  "Critical" ||
                                asset.priority ===
                                  "High"
                                  ? "critical-text"
                                  : ""
                              }
                            >
                              {asset.priority}
                            </strong>
                          </td>

                        </tr>
                      ))}

                  </tbody>

                </table>

              </div>

              <p className="prototype-note">
                Dashboard values are
                simulated for prototype
                demonstration.
              </p>

            </section>
          </>
        )}

      </main>
    </div>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */

function Reason({
  icon,
  title,
  text,
}) {
  return (
    <div className="reason">

      <span>{icon}</span>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>

    </div>
  );
}

function MaintenanceStat({
  title,
  value,
  text,
}) {
  return (
    <div className="maintenance-stat">
      <span>{title}</span>
      <h2>{value}</h2>
      <p>{text}</p>
    </div>
  );
}

function ReportStat({
  title,
  value,
  text,
  className = "",
}) {
  return (
    <div className="report-stat">
      <span>{title}</span>
      <h2 className={className}>
        {value}
      </h2>
      <p>{text}</p>
    </div>
  );
}

function ReportRisk({
  title,
  value,
  width,
  type,
}) {
  return (
    <div className="report-risk-row">

      <div className="report-risk-title">
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <div className="report-bar">
        <div
          className={`report-bar-fill report-${type}`}
          style={{ width }}
        ></div>
      </div>

    </div>
  );
}

export default App;