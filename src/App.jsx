import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

/* =========================
   LEAFLET ICON FIX
========================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* =========================
   DEMO DATA
========================= */

const assets = [
  {
    id: "WP-07",
    name: "Water Pump WP-07",
    type: "Water Pump",
    icon: "💧",
    location: "Zone 2",
    health: 38,
    risk: "High",
    impact: "High",
    priority: "Critical",
    status: "Needs Attention",
    position: [23.2599, 77.4126],
  },
  {
    id: "BR-12",
    name: "Bridge BR-12",
    type: "Bridge",
    icon: "🌉",
    location: "Zone 1",
    health: 52,
    risk: "High",
    impact: "High",
    priority: "High",
    status: "Inspection Required",
    position: [23.2505, 77.4001],
  },
  {
    id: "PL-04",
    name: "Pipeline PL-04",
    type: "Water Pipeline",
    icon: "🔗",
    location: "Zone 4",
    health: 67,
    risk: "Medium",
    impact: "Medium",
    priority: "Medium",
    status: "Monitoring",
    position: [23.2705, 77.425],
  },
  {
    id: "SL-21",
    name: "Streetlight SL-21",
    type: "Streetlight",
    icon: "💡",
    location: "Zone 3",
    health: 89,
    risk: "Low",
    impact: "Low",
    priority: "Low",
    status: "Healthy",
    position: [23.2425, 77.431],
  },
];

const maintenanceTasks = [
  {
    asset: "Water Pump WP-07",
    priority: "Critical",
    status: "Scheduled",
    date: "22 Sep 2026",
  },
  {
    asset: "Bridge BR-12",
    priority: "High",
    status: "In Progress",
    date: "21 Sep 2026",
  },
  {
    asset: "Pipeline PL-04",
    priority: "Medium",
    status: "Completed",
    date: "18 Sep 2026",
  },
];

const navigation = [
  ["Dashboard", "◈"],
  ["Assets", "⌘"],
  ["Risk Analysis", "✦"],
  ["Maintenance", "⚙"],
  ["City Map", "◎"],
  ["Reports", "▥"],
];

/* =========================
   HELPERS
========================= */

function riskClass(risk) {
  return risk.toLowerCase();
}

function getReasons(asset) {
  if (asset.type === "Water Pump") {
    return [
      {
        title: "Vibration Pattern",
        text: "Higher-than-normal vibration can indicate mechanical wear.",
      },
      {
        title: "Operating Condition",
        text: "Recent readings indicate increased operating stress.",
      },
      {
        title: "Maintenance History",
        text: "The asset is approaching its maintenance window.",
      },
    ];
  }

  if (asset.type === "Bridge") {
    return [
      {
        title: "Structural Condition",
        text: "Inspection indicators suggest additional review is required.",
      },
      {
        title: "Traffic Exposure",
        text: "High daily usage increases public-service impact.",
      },
      {
        title: "Inspection Cycle",
        text: "Recent condition history increases inspection priority.",
      },
    ];
  }

  if (asset.type === "Water Pipeline") {
    return [
      {
        title: "Pressure Variation",
        text: "Pressure changes can indicate developing pipeline issues.",
      },
      {
        title: "Leak Reports",
        text: "Recent reports increase the monitoring requirement.",
      },
      {
        title: "Maintenance Cycle",
        text: "Preventive inspection can reduce unexpected disruption.",
      },
    ];
  }

  return [
    {
      title: "Voltage Variation",
      text: "Electrical readings remain within the prototype monitoring range.",
    },
    {
      title: "Fault Reports",
      text: "Few recent fault reports have been recorded.",
    },
    {
      title: "Condition Status",
      text: "The asset currently shows a healthy operating condition.",
    },
  ];
}

/* =========================
   APP
========================= */

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [analysisAsset, setAnalysisAsset] = useState("Water Pump");

  const [formData, setFormData] = useState({
    value1: "",
    value2: "",
    days: "",
  });

  const [analysisResult, setAnalysisResult] = useState(null);

  const openAsset = (asset) => {
    setSelectedAsset(asset);
    setActivePage("Asset Details");
  };

  const analyzeRisk = () => {
    const v1 = Number(formData.value1) || 0;
    const v2 = Number(formData.value2) || 0;
    const days = Number(formData.days) || 0;

    let score = 18;
    const reasons = [];

    if (analysisAsset === "Water Pump") {
      if (v1 > 7) {
        score += 30;
        reasons.push("Elevated vibration reading");
      }

      if (v2 > 75) {
        score += 25;
        reasons.push("High operating temperature");
      }

      if (days > 120) {
        score += 20;
        reasons.push("Long maintenance interval");
      }
    }

    if (analysisAsset === "Bridge") {
      if (v1 < 60) {
        score += 35;
        reasons.push("Low structural condition score");
      }

      if (v2 > 30000) {
        score += 20;
        reasons.push("High daily traffic exposure");
      }

      if (days > 180) {
        score += 20;
        reasons.push("Inspection interval requires attention");
      }
    }

    if (analysisAsset === "Water Pipeline") {
      if (v1 > 25) {
        score += 30;
        reasons.push("High pressure variation");
      }

      if (v2 > 4) {
        score += 25;
        reasons.push("Multiple recent leak reports");
      }

      if (days > 150) {
        score += 20;
        reasons.push("Long maintenance interval");
      }
    }

    if (analysisAsset === "Streetlight") {
      if (v1 > 15) {
        score += 25;
        reasons.push("High voltage variation");
      }

      if (v2 > 3) {
        score += 25;
        reasons.push("Repeated fault reports");
      }

      if (days > 180) {
        score += 15;
        reasons.push("Maintenance review recommended");
      }
    }

    score = Math.min(score, 95);

    let risk = "Low";

    if (score >= 70) risk = "High";
    else if (score >= 40) risk = "Medium";

    const health = Math.max(100 - score, 5);

    const priority =
      risk === "High"
        ? "Critical"
        : risk === "Medium"
        ? "Medium"
        : "Low";

    if (reasons.length === 0) {
      reasons.push(
        "No major prototype threshold was exceeded."
      );
    }

    setAnalysisResult({
      score,
      health,
      risk,
      priority,
      reasons,
    });
  };

  const labels = {
    "Water Pump": [
      "Vibration Level",
      "Operating Temperature",
    ],
    Bridge: [
      "Structural Condition Score",
      "Daily Traffic Level",
    ],
    "Water Pipeline": [
      "Pressure Variation",
      "Leak Reports",
    ],
    Streetlight: [
      "Voltage Variation",
      "Fault Reports",
    ],
  };

  return (
    <div className="app-shell">
      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <span></span>
            IG
          </div>

          <div>
            <h2>InfraGuard</h2>
            <p>Predict • Prioritize • Protect</p>
          </div>
        </div>

        <div className="nav-label">COMMAND CENTER</div>

        <nav>
          {navigation.map(([name, icon]) => (
            <button
              key={name}
              className={
                activePage === name
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setActivePage(name)}
            >
              <span className="nav-icon">{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <div className="pulse"></div>

          <div>
            <strong>System Online</strong>
            <span>Prototype Environment</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="avatar">IG</div>

          <div>
            <strong>City Operations</strong>
            <span>Urban Intelligence</span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">
              INFRAGUARD / CITY INTELLIGENCE
            </div>

            <h1>
              {activePage === "Asset Details"
                ? selectedAsset?.name
                : activePage}
            </h1>
          </div>

          <div className="top-actions">
            <div className="live-status">
              <span></span>
              LIVE SYSTEM
            </div>

            <div className="top-avatar">IG</div>
          </div>
        </header>

        {/* ================= DASHBOARD ================= */}

        {activePage === "Dashboard" && (
          <div className="page">
            <section className="hero">
              <div className="hero-copy">
                <div className="hero-tag">
                  <span></span>
                  URBAN INFRASTRUCTURE INTELLIGENCE
                </div>

                <h2>
                  See the risk
                  <br />
                  <span>before the breakdown.</span>
                </h2>

                <p>
                  One intelligent workspace to monitor city
                  assets, identify emerging risks, prioritize
                  maintenance and track what changed after
                  action.
                </p>

                <div className="hero-buttons">
                  <button
                    className="primary-button"
                    onClick={() =>
                      setActivePage("Risk Analysis")
                    }
                  >
                    Run Risk Analysis
                    <span>↗</span>
                  </button>

                  <button
                    className="ghost-button"
                    onClick={() =>
                      setActivePage("City Map")
                    }
                  >
                    Explore City
                    <span>◎</span>
                  </button>
                </div>

                <div className="hero-mini-stats">
                  <div>
                    <strong>128</strong>
                    <span>Assets</span>
                  </div>

                  <div>
                    <strong>04</strong>
                    <span>Asset Types</span>
                  </div>

                  <div>
                    <strong>24/7</strong>
                    <span>Monitoring View</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual">
                <div className="orb orb-one"></div>
                <div className="orb orb-two"></div>
                <div className="orb orb-three"></div>

                <div className="health-widget">
                  <div className="health-ring">
                    <div className="health-center">
                      <span>CITY HEALTH</span>
                      <strong>76</strong>
                      <small>/ 100</small>
                    </div>
                  </div>

                  <div className="health-caption">
                    <span className="healthy-dot"></span>
                    Infrastructure condition stable
                  </div>
                </div>

                <div className="float-card float-red">
                  <div className="float-icon">!</div>

                  <div>
                    <span>Critical Assets</span>
                    <strong>12</strong>
                  </div>
                </div>

                <div className="float-card float-green">
                  <div className="float-icon">✓</div>

                  <div>
                    <span>Healthy Assets</span>
                    <strong>85</strong>
                  </div>
                </div>

                <div className="float-card float-yellow">
                  <div className="float-icon">⌁</div>

                  <div>
                    <span>Monitoring</span>
                    <strong>31</strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="metric-grid">
              <MetricCard
                icon="◈"
                number="128"
                label="Total Assets"
                caption="Across monitored zones"
                theme="violet"
              />

              <MetricCard
                icon="!"
                number="12"
                label="High Risk"
                caption="Require priority attention"
                theme="pink"
              />

              <MetricCard
                icon="⌁"
                number="31"
                label="Medium Risk"
                caption="Under active monitoring"
                theme="yellow"
              />

              <MetricCard
                icon="✓"
                number="85"
                label="Healthy"
                caption="Operating normally"
                theme="green"
              />
            </section>

            <section className="dashboard-grid">
              <div className="glass-panel risk-panel">
                <PanelTitle
                  kicker="RISK PULSE"
                  title="Infrastructure Risk"
                  text="Current risk distribution across monitored assets."
                />

                <div className="risk-bars">
                  <RiskBar
                    label="High Risk"
                    number="12"
                    width="14%"
                    type="high"
                  />

                  <RiskBar
                    label="Medium Risk"
                    number="31"
                    width="36%"
                    type="medium"
                  />

                  <RiskBar
                    label="Healthy / Low"
                    number="85"
                    width="100%"
                    type="low"
                  />
                </div>

                <div className="risk-footer">
                  <span>
                    ✦ Risk values are prototype demo data
                  </span>

                  <button
                    onClick={() =>
                      setActivePage("Risk Analysis")
                    }
                  >
                    Analyze →
                  </button>
                </div>
              </div>

              <div className="glass-panel alert-panel">
                <div className="panel-heading-row">
                  <PanelTitle
                    kicker="NEEDS ATTENTION"
                    title="Priority Alerts"
                    text="Assets requiring faster review."
                  />

                  <div className="notification">2</div>
                </div>

                <AlertItem
                  icon="💧"
                  name="Water Pump WP-07"
                  text="Health 38/100 • High public impact"
                  type="critical"
                />

                <AlertItem
                  icon="🌉"
                  name="Bridge BR-12"
                  text="Health 52/100 • Inspection required"
                  type="high"
                />

                <button
                  className="full-ghost"
                  onClick={() =>
                    setActivePage("Assets")
                  }
                >
                  View all infrastructure
                  <span>→</span>
                </button>
              </div>
            </section>

            <section className="priority-section">
              <div className="section-heading">
                <div>
                  <span>DECISION INTELLIGENCE</span>

                  <h3>
                    What needs attention first?
                  </h3>

                  <p>
                    Maintenance priority based on condition
                    risk and public-service impact.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setActivePage("Maintenance")
                  }
                >
                  Maintenance Center ↗
                </button>
              </div>

              <div className="priority-grid">
                {assets.slice(0, 3).map((asset, index) => (
                  <div
                    className="priority-card"
                    key={asset.id}
                  >
                    <div className="rank">
                      0{index + 1}
                    </div>

                    <div className="priority-icon">
                      {asset.icon}
                    </div>

                    <div className="priority-top">
                      <div>
                        <span>{asset.type}</span>
                        <h4>{asset.name}</h4>
                        <p>
                          {asset.location} • Impact{" "}
                          {asset.impact}
                        </p>
                      </div>

                      <RiskBadge risk={asset.risk} />
                    </div>

                    <div className="health-row">
                      <span>Asset Health</span>
                      <strong>
                        {asset.health}/100
                      </strong>
                    </div>

                    <div className="health-track">
                      <div
                        className={`health-fill ${riskClass(
                          asset.risk
                        )}`}
                        style={{
                          width: `${asset.health}%`,
                        }}
                      ></div>
                    </div>

                    <button
                      className="card-action"
                      onClick={() => openAsset(asset)}
                    >
                      View intelligence
                      <span>↗</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <DemoNote />
          </div>
        )}

        {/* ================= ASSETS ================= */}

        {activePage === "Assets" && (
          <div className="page">
            <PageIntro
              tag="INFRASTRUCTURE NETWORK"
              title="Every asset. One intelligent view."
              text="Explore infrastructure condition, risk, public impact and maintenance priority."
            />

            <div className="asset-grid">
              {assets.map((asset) => (
                <div
                  className="asset-card"
                  key={asset.id}
                >
                  <div className="asset-card-header">
                    <div
                      className={`asset-icon ${riskClass(
                        asset.risk
                      )}`}
                    >
                      {asset.icon}
                    </div>

                    <RiskBadge risk={asset.risk} />
                  </div>

                  <div className="asset-type">
                    {asset.type}
                  </div>

                  <h3>{asset.name}</h3>

                  <p className="asset-location">
                    ◎ {asset.location} • {asset.status}
                  </p>

                  <div className="asset-score">
                    <div>
                      <span>HEALTH SCORE</span>
                      <strong>{asset.health}</strong>
                      <small>/100</small>
                    </div>

                    <div className="asset-meta">
                      <span>
                        Impact
                        <strong>{asset.impact}</strong>
                      </span>

                      <span>
                        Priority
                        <strong>
                          {asset.priority}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="health-track">
                    <div
                      className={`health-fill ${riskClass(
                        asset.risk
                      )}`}
                      style={{
                        width: `${asset.health}%`,
                      }}
                    ></div>
                  </div>

                  <button
                    className="card-action"
                    onClick={() => openAsset(asset)}
                  >
                    Open asset intelligence
                    <span>↗</span>
                  </button>
                </div>
              ))}
            </div>

            <DemoNote />
          </div>
        )}

        {/* ================= ASSET DETAILS ================= */}

        {activePage === "Asset Details" &&
          selectedAsset && (
            <div className="page">
              <button
                className="back-button"
                onClick={() =>
                  setActivePage("Assets")
                }
              >
                ← Back to Assets
              </button>

              <section className="asset-detail-hero">
                <div className="detail-main">
                  <div
                    className={`large-asset-icon ${riskClass(
                      selectedAsset.risk
                    )}`}
                  >
                    {selectedAsset.icon}
                  </div>

                  <div>
                    <span>
                      {selectedAsset.type} /{" "}
                      {selectedAsset.id}
                    </span>

                    <h2>
                      {selectedAsset.name}
                    </h2>

                    <p>
                      ◎ {selectedAsset.location} •{" "}
                      {selectedAsset.status}
                    </p>
                  </div>
                </div>

                <RiskBadge
                  risk={selectedAsset.risk}
                />
              </section>

              <div className="detail-metrics">
                <SmallMetric
                  label="Health Score"
                  value={`${selectedAsset.health}/100`}
                  theme="violet"
                />

                <SmallMetric
                  label="Failure Risk"
                  value={selectedAsset.risk}
                  theme="pink"
                />

                <SmallMetric
                  label="Public Impact"
                  value={selectedAsset.impact}
                  theme="yellow"
                />

                <SmallMetric
                  label="Priority"
                  value={selectedAsset.priority}
                  theme="green"
                />
              </div>

              <div className="details-grid">
                <div className="glass-panel">
                  <PanelTitle
                    kicker="EXPLAINABLE INSIGHTS"
                    title="Why this risk?"
                    text="Key prototype indicators behind the current assessment."
                  />

                  <div className="reason-list">
                    {getReasons(selectedAsset).map(
                      (reason, index) => (
                        <div
                          className="reason-item"
                          key={reason.title}
                        >
                          <div className="reason-number">
                            0{index + 1}
                          </div>

                          <div>
                            <strong>
                              {reason.title}
                            </strong>

                            <p>{reason.text}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="glass-panel recommendation">
                  <div className="recommend-icon">
                    ✦
                  </div>

                  <span className="recommend-label">
                    RECOMMENDED ACTION
                  </span>

                  <h3>
                    {selectedAsset.risk === "High"
                      ? "Priority inspection recommended"
                      : selectedAsset.risk ===
                        "Medium"
                      ? "Continue monitoring"
                      : "Routine maintenance"}
                  </h3>

                  <p>
                    Review the available condition data
                    before taking maintenance action.
                    InfraGuard provides decision support;
                    final action remains with the
                    responsible engineer.
                  </p>

                  <button
                    className="primary-button wide"
                    onClick={() =>
                      setActivePage("Maintenance")
                    }
                  >
                    Schedule Maintenance
                    <span>→</span>
                  </button>
                </div>
              </div>

              <DemoNote />
            </div>
          )}

        {/* ================= RISK ANALYSIS ================= */}

        {activePage === "Risk Analysis" && (
          <div className="page">
            <PageIntro
              tag="PROTOTYPE RISK ENGINE"
              title="Turn asset signals into risk insight."
              text="Enter sample asset readings to demonstrate how InfraGuard converts condition indicators into a simple risk assessment."
            />

            <div className="analysis-layout">
              <div className="analysis-form">
                <div className="analysis-form-top">
                  <div className="analysis-symbol">
                    ✦
                  </div>

                  <div>
                    <span>INPUT ENGINE</span>
                    <h3>Analyze an asset</h3>
                  </div>
                </div>

                <label>Asset Type</label>

                <select
                  value={analysisAsset}
                  onChange={(e) => {
                    setAnalysisAsset(
                      e.target.value
                    );

                    setAnalysisResult(null);

                    setFormData({
                      value1: "",
                      value2: "",
                      days: "",
                    });
                  }}
                >
                  <option>Water Pump</option>
                  <option>Bridge</option>
                  <option>Water Pipeline</option>
                  <option>Streetlight</option>
                </select>

                <label>
                  {labels[analysisAsset][0]}
                </label>

                <input
                  type="number"
                  placeholder="Enter value"
                  value={formData.value1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      value1: e.target.value,
                    })
                  }
                />

                <label>
                  {labels[analysisAsset][1]}
                </label>

                <input
                  type="number"
                  placeholder="Enter value"
                  value={formData.value2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      value2: e.target.value,
                    })
                  }
                />

                <label>
                  Days Since Maintenance
                </label>

                <input
                  type="number"
                  placeholder="Example: 150"
                  value={formData.days}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      days: e.target.value,
                    })
                  }
                />

                <button
                  className="primary-button wide analyze"
                  onClick={analyzeRisk}
                >
                  Analyze Risk
                  <span>✦</span>
                </button>

                <p className="prototype-text">
                  Prototype only — illustrative rules
                  are used for demonstration and are
                  not validated engineering thresholds.
                </p>
              </div>

              <div className="analysis-output">
                {!analysisResult ? (
                  <div className="empty-state">
                    <div className="empty-orbit">
                      <span>✦</span>
                    </div>

                    <h3>
                      Ready to analyze
                    </h3>

                    <p>
                      Enter sample readings and run the
                      prototype risk engine to see the
                      generated health and priority
                      assessment.
                    </p>
                  </div>
                ) : (
                  <div className="result-content">
                    <div className="result-top">
                      <div>
                        <span>
                          ANALYSIS COMPLETE
                        </span>

                        <h3>
                          {analysisAsset}
                        </h3>
                      </div>

                      <RiskBadge
                        risk={
                          analysisResult.risk
                        }
                      />
                    </div>

                    <div className="result-score-grid">
                      <ResultScore
                        label="Risk Score"
                        value={analysisResult.score}
                        suffix="/100"
                        theme="pink"
                      />

                      <ResultScore
                        label="Health Score"
                        value={analysisResult.health}
                        suffix="/100"
                        theme="green"
                      />
                    </div>

                    <div className="result-meter">
                      <div>
                        <span>
                          Estimated Risk
                        </span>

                        <strong>
                          {analysisResult.score}%
                        </strong>
                      </div>

                      <div className="health-track">
                        <div
                          className={`health-fill ${riskClass(
                            analysisResult.risk
                          )}`}
                          style={{
                            width: `${analysisResult.score}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="reason-output">
                      <span>WHY THIS RESULT?</span>

                      {analysisResult.reasons.map(
                        (reason) => (
                          <div
                            key={reason}
                            className="output-reason"
                          >
                            <b>✦</b>
                            {reason}
                          </div>
                        )
                      )}
                    </div>

                    <div className="priority-output">
                      <div>
                        <span>
                          MAINTENANCE PRIORITY
                        </span>

                        <h3>
                          {
                            analysisResult.priority
                          }
                        </h3>
                      </div>

                      <div>→</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= MAINTENANCE ================= */}

        {activePage === "Maintenance" && (
          <div className="page">
            <PageIntro
              tag="MAINTENANCE WORKSPACE"
              title="From risk signal to real action."
              text="Track maintenance priorities, task status and before-versus-after asset condition."
            />

            <div className="maintenance-stats">
              <SmallMetric
                label="Scheduled"
                value="01"
                theme="violet"
              />

              <SmallMetric
                label="In Progress"
                value="01"
                theme="yellow"
              />

              <SmallMetric
                label="Completed"
                value="01"
                theme="green"
              />

              <SmallMetric
                label="Critical"
                value="01"
                theme="pink"
              />
            </div>

            <div className="maintenance-layout">
              <div className="glass-panel">
                <PanelTitle
                  kicker="WORK QUEUE"
                  title="Maintenance Tasks"
                  text="Current prototype maintenance activity."
                />

                <div className="task-list">
                  {maintenanceTasks.map(
                    (task, index) => (
                      <div
                        className="task"
                        key={task.asset}
                      >
                        <div className="task-index">
                          0{index + 1}
                        </div>

                        <div className="task-info">
                          <strong>
                            {task.asset}
                          </strong>

                          <span>
                            {task.date}
                          </span>
                        </div>

                        <div className="task-tags">
                          <span
                            className={`task-priority ${task.priority
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {task.priority}
                          </span>

                          <span className="task-status">
                            {task.status}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="impact-card">
                <div className="impact-top">
                  <span>✦</span>

                  <div>
                    <small>
                      MAINTENANCE IMPACT
                    </small>

                    <h3>
                      Did maintenance help?
                    </h3>
                  </div>
                </div>

                <div className="impact-asset">
                  Pipeline PL-04
                </div>

                <div className="before-after">
                  <div>
                    <span>BEFORE</span>
                    <strong>67</strong>
                    <small>/100</small>
                  </div>

                  <b>→</b>

                  <div className="after-box">
                    <span>AFTER</span>
                    <strong>84</strong>
                    <small>/100</small>
                  </div>
                </div>

                <div className="improvement">
                  <span>
                    Condition change
                  </span>

                  <strong>+17 points</strong>
                </div>

                <p>
                  ✓ Asset condition indicators improved
                  after maintenance.
                </p>
              </div>
            </div>

            <DemoNote />
          </div>
        )}

        {/* ================= CITY MAP ================= */}

        {activePage === "City Map" && (
          <div className="page">
            <PageIntro
              tag="SPATIAL INTELLIGENCE"
              title="See infrastructure across the city."
              text="Explore prototype asset locations and their current risk status on one interactive map."
            />

            <div className="map-layout">
              <div className="map-wrapper">
                <MapContainer
                  center={[23.2599, 77.4126]}
                  zoom={13}
                  className="city-map"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {assets.map((asset) => (
                    <Marker
                      key={asset.id}
                      position={asset.position}
                    >
                      <Popup>
                        <div className="popup-content">
                          <strong>
                            {asset.name}
                          </strong>

                          <span>
                            Health: {asset.health}/100
                          </span>

                          <span>
                            Risk: {asset.risk}
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <div className="map-side">
                <PanelTitle
                  kicker="CITY ASSETS"
                  title="Live Risk View"
                  text="Prototype asset locations."
                />

                {assets.map((asset) => (
                  <button
                    className="map-asset"
                    key={asset.id}
                    onClick={() =>
                      openAsset(asset)
                    }
                  >
                    <div
                      className={`map-dot ${riskClass(
                        asset.risk
                      )}`}
                    ></div>

                    <div>
                      <strong>
                        {asset.name}
                      </strong>

                      <span>
                        {asset.location} • Health{" "}
                        {asset.health}
                      </span>
                    </div>

                    <RiskBadge
                      risk={asset.risk}
                    />
                  </button>
                ))}
              </div>
            </div>

            <DemoNote text="Map locations are simulated for prototype demonstration." />
          </div>
        )}

        {/* ================= REPORTS ================= */}

        {activePage === "Reports" && (
          <div className="page reports-page">
            <div className="reports-heading">
              <PageIntro
                tag="CITY INTELLIGENCE REPORT"
                title="Infrastructure at a glance."
                text="A prototype summary of asset condition, maintenance priorities and maintenance impact."
              />

              <button
                className="primary-button print-button"
                onClick={() => window.print()}
              >
                Print Report
                <span>↗</span>
              </button>
            </div>

            <div className="report-cards">
              <MetricCard
                icon="◈"
                number="128"
                label="Total Assets"
                caption="Monitored infrastructure"
                theme="violet"
              />

              <MetricCard
                icon="!"
                number="12"
                label="High Risk"
                caption="Priority review"
                theme="pink"
              />

              <MetricCard
                icon="⚙"
                number="03"
                label="Maintenance"
                caption="Current tasks"
                theme="yellow"
              />

              <MetricCard
                icon="✓"
                number="76"
                label="City Health"
                caption="Prototype score /100"
                theme="green"
              />
            </div>

            <div className="report-layout">
              <div className="glass-panel">
                <PanelTitle
                  kicker="RISK DISTRIBUTION"
                  title="Current Asset Condition"
                  text="Prototype risk summary."
                />

                <div className="risk-bars">
                  <RiskBar
                    label="High Risk"
                    number="12"
                    width="14%"
                    type="high"
                  />

                  <RiskBar
                    label="Medium Risk"
                    number="31"
                    width="36%"
                    type="medium"
                  />

                  <RiskBar
                    label="Healthy / Low"
                    number="85"
                    width="100%"
                    type="low"
                  />
                </div>
              </div>

              <div className="impact-card">
                <div className="impact-top">
                  <span>↗</span>

                  <div>
                    <small>
                      IMPACT TRACKER
                    </small>

                    <h3>
                      Maintenance Result
                    </h3>
                  </div>
                </div>

                <div className="impact-asset">
                  Pipeline PL-04
                </div>

                <div className="before-after">
                  <div>
                    <span>BEFORE</span>
                    <strong>67</strong>
                  </div>

                  <b>→</b>

                  <div className="after-box">
                    <span>AFTER</span>
                    <strong>84</strong>
                  </div>
                </div>

                <p>
                  ✓ Condition indicators improved in
                  this demo record.
                </p>
              </div>
            </div>

            <div className="glass-panel report-table">
              <PanelTitle
                kicker="PRIORITY ASSETS"
                title="Maintenance Decision View"
                text="Assets ordered for prototype decision support."
              />

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Health</th>
                      <th>Risk</th>
                      <th>Impact</th>
                      <th>Priority</th>
                    </tr>
                  </thead>

                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset.id}>
                        <td>
                          <strong>
                            {asset.name}
                          </strong>
                        </td>

                        <td>
                          {asset.health}/100
                        </td>

                        <td>
                          <RiskBadge
                            risk={asset.risk}
                          />
                        </td>

                        <td>{asset.impact}</td>
                        <td>{asset.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <DemoNote />
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */

function MetricCard({
  icon,
  number,
  label,
  caption,
  theme,
}) {
  return (
    <div className={`metric-card ${theme}`}>
      <div className="metric-icon">
        {icon}
      </div>

      <div>
        <strong>{number}</strong>
        <h4>{label}</h4>
        <p>{caption}</p>
      </div>
    </div>
  );
}

function SmallMetric({
  label,
  value,
  theme,
}) {
  return (
    <div className={`small-metric ${theme}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PanelTitle({
  kicker,
  title,
  text,
}) {
  return (
    <div className="panel-title">
      <span>{kicker}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function RiskBadge({ risk }) {
  return (
    <span
      className={`risk-badge ${riskClass(
        risk
      )}`}
    >
      <i></i>
      {risk}
    </span>
  );
}

function RiskBar({
  label,
  number,
  width,
  type,
}) {
  return (
    <div className="risk-bar">
      <div className="risk-bar-heading">
        <span>{label}</span>
        <strong>{number}</strong>
      </div>

      <div className="bar-track">
        <div
          className={`bar-fill ${type}`}
          style={{ width }}
        ></div>
      </div>
    </div>
  );
}

function AlertItem({
  icon,
  name,
  text,
  type,
}) {
  return (
    <div className={`alert-item ${type}`}>
      <div className="alert-icon">
        {icon}
      </div>

      <div>
        <strong>{name}</strong>
        <p>{text}</p>
      </div>

      <span className="alert-arrow">
        ↗
      </span>
    </div>
  );
}

function ResultScore({
  label,
  value,
  suffix,
  theme,
}) {
  return (
    <div className={`result-score ${theme}`}>
      <span>{label}</span>

      <strong>{value}</strong>

      <small>{suffix}</small>
    </div>
  );
}

function PageIntro({
  tag,
  title,
  text,
}) {
  return (
    <div className="page-intro">
      <span>{tag}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function DemoNote({
  text = "Prototype environment — dashboard values are simulated for demonstration.",
}) {
  return (
    <div className="demo-note">
      <span>●</span>
      {text}
    </div>
  );
}

export default App;