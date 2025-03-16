import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Form from "./components/Form";
import DailyPlan from "./components/DailyPlan";
import LandingPage from "./components/LandingPage";
import MealLogging from "./components/MealLogging";
import ProgressDashboard from "./components/ProgressDashboard";
import RecipeGenerator from "./components/RecipeGenerator";
// import RiskAssessment from "./components/RiskAssessment";
import "./styles.css";

function App() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);

  const generatePlan = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await response.json();
      setPlan(data);
      setSelectedDay(0);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Route for LandingPage */}
            <Route path="/" element={<LandingPage />} />

            {/* Route for the form and plan generation */}
            <Route
              path="/form"
              element={
                !plan ? (
                  <div className="form-container">
                    <h2>Get Your Personalized Plan</h2>
                    <Form onSubmit={generatePlan} />
                  </div>
                ) : loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Generating your personalized plan...</p>
                  </div>
                ) : error ? (
                  <div className="error">
                    <p>Error: {error}</p>
                    <button onClick={() => setError(null)}>Try Again</button>
                  </div>
                ) : (
                  <div className="plan-container">
                    <div className="plan-navigation">
                      <h2>Your 7-Day Plan</h2>
                      <div className="day-selector">
                        {plan.days.map((day, index) => (
                          <button
                            key={day.day}
                            className={selectedDay === index ? "active" : ""}
                            onClick={() => setSelectedDay(index)}
                          >
                            {day.day}
                          </button>
                        ))}
                      </div>
                      <div className="plan-summary">
                        <div className="summary-item">
                          <span>Daily Calories:</span>
                          <strong>{plan.dailyCalories} kcal</strong>
                        </div>
                        <div className="summary-item">
                          <span>Protein:</span>
                          <strong>{plan.macros.protein}g</strong>
                        </div>
                        <div className="summary-item">
                          <span>Carbs:</span>
                          <strong>{plan.macros.carbs}g</strong>
                        </div>
                        <div className="summary-item">
                          <span>Fats:</span>
                          <strong>{plan.macros.fats}g</strong>
                        </div>
                      </div>
                    </div>

                    {plan.days[selectedDay] && (
                      <DailyPlan day={plan.days[selectedDay]} />
                    )}

                    <button
                      className="reset-button"
                      onClick={() => setPlan(null)}
                    >
                      Create New Plan
                    </button>
                  </div>
                )
              }
            />

            {/* Route for MealLogging */}
            <Route path="/meal-logging" element={<MealLogging />} />

            {/* Route for ProgressDashboard */}
            <Route path="/progress" element={<ProgressDashboard />} />

            {/* Route for RecipeGenerator */}
            <Route path="/recipes" element={<RecipeGenerator />} />

            {/* Route for RiskAssessment */}
            {/* <Route path="/risk-assessment" element={<RiskAssessment />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
