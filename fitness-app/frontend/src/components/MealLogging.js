import React, { useState, useRef, useEffect } from "react";
import "./MealLogging.css";

function MealLogging() {
  const [loading, setLoading] = useState(false);
  const [mealData, setMealData] = useState({
    name: "",
    description: "",
    mealType: "lunch",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logStatus, setLogStatus] = useState("");
  const fileInputRef = useRef(null);

  const fetchMealLogs = async () => {
    try {
      const response = await fetch(
        `https://healthai-79x3.onrender.com/api/meals?userId=default_user`
      );
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Error fetching meal logs:", error);
    }
  };

  useEffect(() => {
    fetchMealLogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMealData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!imagePreview) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://healthai-79x3.onrender.com/api/analyze-food-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imagePreview,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      setAiAnalysisResult(data);

      // Update meal data with AI analysis
      setMealData((prev) => ({
        ...prev,
        name: data.foodItems?.join(", ") || prev.name,
        calories: data.calories || prev.calories,
        protein: data.protein || prev.protein,
        carbs: data.carbs || prev.carbs,
        fats: data.fats || prev.fats,
        mealType: data.mealType || prev.mealType,
      }));
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://healthai-79x3.onrender.com/api/log-meal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...mealData,
            userId: "default_user",
            calories: Number(mealData.calories),
            protein: Number(mealData.protein),
            carbs: Number(mealData.carbs),
            fats: Number(mealData.fats),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to log meal");
      }

      // Changed: Removed the unused 'result' variable
      await response.json();
      setLogStatus("Meal logged successfully!");

      // Reset form
      setMealData({
        name: "",
        description: "",
        mealType: "lunch",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        date: new Date().toISOString().split("T")[0],
      });
      setImagePreview(null);
      setAiAnalysisResult(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh logs
      fetchMealLogs();

      // Clear status after 3 seconds
      setTimeout(() => {
        setLogStatus("");
      }, 3000);
    } catch (error) {
      console.error("Error logging meal:", error);
      setLogStatus("Error logging meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString();
  };

  return (
    <div className="meal-logging-container">
      <h2>Meal Logging</h2>

      <div className="meal-form-wrapper">
        <div className="image-upload-section">
          <h3>Upload Food Image</h3>
          <div className="image-preview-container">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Food preview"
                className="image-preview"
              />
            ) : (
              <div className="image-placeholder">
                <span>Upload an image</span>
              </div>
            )}
          </div>
          <div className="upload-controls">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="file-input"
            />
            <button
              onClick={handleAnalyzeImage}
              disabled={!imagePreview || loading}
              className="button analyze-button"
            >
              {loading ? "Analyzing..." : "Analyze with AI"}
            </button>
          </div>

          {aiAnalysisResult && (
            <div className="ai-result">
              <h4>AI Analysis Result</h4>
              <p>
                <strong>Detected Food:</strong>{" "}
                {aiAnalysisResult.foodItems?.join(", ")}
              </p>
              <div className="nutrition-info">
                <div className="nutrition-item">
                  <span>Calories</span>
                  <strong>{aiAnalysisResult.calories}</strong>
                </div>
                <div className="nutrition-item">
                  <span>Protein</span>
                  <strong>{aiAnalysisResult.protein}g</strong>
                </div>
                <div className="nutrition-item">
                  <span>Carbs</span>
                  <strong>{aiAnalysisResult.carbs}g</strong>
                </div>
                <div className="nutrition-item">
                  <span>Fats</span>
                  <strong>{aiAnalysisResult.fats}g</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="meal-form-section">
          <h3>Meal Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={mealData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mealType">Meal Type</label>
              <select
                id="mealType"
                name="mealType"
                value={mealData.mealType}
                onChange={handleChange}
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Meal Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={mealData.name}
                onChange={handleChange}
                placeholder="E.g., Grilled Chicken Salad"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={mealData.description}
                onChange={handleChange}
                placeholder="Add meal details"
                rows="2"
              />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="calories">Calories</label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  value={mealData.calories}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="protein">Protein (g)</label>
                <input
                  type="number"
                  id="protein"
                  name="protein"
                  value={mealData.protein}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="carbs">Carbs (g)</label>
                <input
                  type="number"
                  id="carbs"
                  name="carbs"
                  value={mealData.carbs}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fats">Fats (g)</label>
                <input
                  type="number"
                  id="fats"
                  name="fats"
                  value={mealData.fats}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <button
              type="submit"
              className="button submit-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Log Meal"}
            </button>

            {logStatus && <p className="log-status">{logStatus}</p>}
          </form>
        </div>
      </div>

      <div className="meal-logs">
        <h3>Recent Meal Logs</h3>
        {logs.length === 0 ? (
          <p>No meals logged yet.</p>
        ) : (
          <div className="logs-list">
            {logs.map((log) => (
              <div key={log.id} className="log-card">
                <div className="log-header">
                  <h4>{log.name}</h4>
                  <span className={`meal-type ${log.mealType}`}>
                    {log.mealType}
                  </span>
                </div>
                <div className="log-date">{formatDate(log.date)}</div>
                {log.description && (
                  <p className="log-description">{log.description}</p>
                )}
                <div className="log-nutrition">
                  <div className="nutrition-pill">
                    <span>{log.calories} cal</span>
                  </div>
                  <div className="nutrition-pill">
                    <span>{log.protein}g protein</span>
                  </div>
                  <div className="nutrition-pill">
                    <span>{log.carbs}g carbs</span>
                  </div>
                  <div className="nutrition-pill">
                    <span>{log.fats}g fats</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MealLogging;
