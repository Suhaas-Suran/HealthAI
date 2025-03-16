import React, { useState } from "react";
import "./RiskAssessment.css";

const RiskAssessment = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    medicalConditions: [],
    activityLevel: "",
    familyHistory: [],
    previousInjuries: "",
    fitnessGoals: "",
    sleepHours: "",
    stressLevel: "",
    nutritionHabits: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const medicalConditionOptions = [
    "Heart Disease",
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Arthritis",
    "None",
  ];

  const familyHistoryOptions = [
    "Heart Disease",
    "Diabetes",
    "Cancer",
    "Obesity",
    "None",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData({
        ...formData,
        [category]: [...formData[category], value],
      });
    } else {
      setFormData({
        ...formData,
        [category]: formData[category].filter((item) => item !== value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending data:", formData);
      const response = await fetch(
        "http://localhost:5000/api/risk-assessment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success data:", data);
      setResult(data);
    } catch (error) {
      console.error("Error details:", error);
      alert(`Failed to submit risk assessment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="risk-assessment-container">
      <h2>Fitness Risk Assessment</h2>
      <p>
        Complete this questionnaire to receive a personalized risk assessment
        before starting your fitness journey.
      </p>

      {!result ? (
        <form onSubmit={handleSubmit} className="risk-assessment-form">
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Medical Conditions (select all that apply)</label>
            <div className="checkbox-group">
              {medicalConditionOptions.map((condition) => (
                <div key={condition} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`medical-${condition}`}
                    value={condition}
                    checked={formData.medicalConditions.includes(condition)}
                    onChange={(e) =>
                      handleCheckboxChange(e, "medicalConditions")
                    }
                  />
                  <label htmlFor={`medical-${condition}`}>{condition}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Activity Level</option>
              <option value="sedentary">
                Sedentary (little to no exercise)
              </option>
              <option value="light">Light (exercise 1-3 days/week)</option>
              <option value="moderate">
                Moderate (exercise 3-5 days/week)
              </option>
              <option value="active">Active (exercise 6-7 days/week)</option>
              <option value="veryActive">
                Very Active (professional athlete/physical job)
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Family History (select all that apply)</label>
            <div className="checkbox-group">
              {familyHistoryOptions.map((condition) => (
                <div key={condition} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`family-${condition}`}
                    value={condition}
                    checked={formData.familyHistory.includes(condition)}
                    onChange={(e) => handleCheckboxChange(e, "familyHistory")}
                  />
                  <label htmlFor={`family-${condition}`}>{condition}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Previous Injuries or Surgeries</label>
            <textarea
              name="previousInjuries"
              value={formData.previousInjuries}
              onChange={handleInputChange}
              placeholder="Describe any previous injuries or surgeries that might affect your fitness routine"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Fitness Goals</label>
            <select
              name="fitnessGoals"
              value={formData.fitnessGoals}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Primary Goal</option>
              <option value="weightLoss">Weight Loss</option>
              <option value="muscleGain">Muscle Gain</option>
              <option value="endurance">Improve Endurance</option>
              <option value="flexibility">Improve Flexibility</option>
              <option value="generalHealth">General Health</option>
              <option value="rehabilitation">Rehabilitation</option>
            </select>
          </div>

          <div className="form-group">
            <label>Average Sleep Hours per Night</label>
            <select
              name="sleepHours"
              value={formData.sleepHours}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Sleep Hours</option>
              <option value="less5">Less than 5 hours</option>
              <option value="5to6">5-6 hours</option>
              <option value="7to8">7-8 hours</option>
              <option value="more8">More than 8 hours</option>
            </select>
          </div>

          <div className="form-group">
            <label>Stress Level</label>
            <select
              name="stressLevel"
              value={formData.stressLevel}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Stress Level</option>
              <option value="low">Low (rarely feel stressed)</option>
              <option value="moderate">Moderate (occasional stress)</option>
              <option value="high">High (frequently stressed)</option>
              <option value="veryHigh">Very High (constant stress)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nutrition Habits</label>
            <select
              name="nutritionHabits"
              value={formData.nutritionHabits}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Nutrition Habits</option>
              <option value="poor">
                Poor (mostly processed foods, irregular meals)
              </option>
              <option value="fair">
                Fair (mix of healthy and processed foods)
              </option>
              <option value="good">Good (mostly balanced diet)</option>
              <option value="excellent">
                Excellent (well-balanced, portion-controlled diet)
              </option>
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Processing..." : "Submit Assessment"}
          </button>
        </form>
      ) : (
        <div className="assessment-results">
          <h3>Your Risk Assessment Results</h3>
          <div className="score-display">
            <div className="score-circle">
              <span>{result.riskScore}</span>
              <span className="score-label">/10</span>
            </div>
            <div
              className="risk-level"
              style={{ color: getRiskColor(result.riskScore) }}
            >
              {getRiskLevel(result.riskScore)}
            </div>
          </div>

          <div className="recommendations">
            <h4>Recommendations</h4>
            <div className="recommendation-content">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="precautions">
            <h4>Precautions</h4>
            <div className="precaution-content">
              {result.precautions.map((prec, index) => (
                <div key={index} className="precaution-item">
                  <p>{prec}</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setResult(null)} className="reset-button">
            Take Assessment Again
          </button>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getRiskLevel = (score) => {
  if (score >= 0 && score <= 3) return "Low Risk";
  if (score >= 4 && score <= 6) return "Moderate Risk";
  if (score >= 7 && score <= 8) return "High Risk";
  return "Very High Risk";
};

const getRiskColor = (score) => {
  if (score >= 0 && score <= 3) return "#4CAF50"; // Green
  if (score >= 4 && score <= 6) return "#FFC107"; // Yellow
  if (score >= 7 && score <= 8) return "#FF9800"; // Orange
  return "#F44336"; // Red
};

export default RiskAssessment;
