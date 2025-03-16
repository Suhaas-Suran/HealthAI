import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./ProgressDashboard.css";

function ProgressDashboard() {
  const [progressData, setProgressData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  // Generate sample data for demonstration
  const generateSampleData = () => {
    const now = new Date();
    const data = [];
    const meals = [];

    // Generate 30 days of data
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Progressive weight loss trend
      const baseWeight = 75 - i * 0.05;
      const weight = baseWeight + (Math.random() * 0.5 - 0.25);

      // Fluctuating calorie intake
      const baseCalories = 2000;
      const calories = baseCalories + (Math.random() * 300 - 150);

      data.push({
        id: `progress-${i}`,
        userId: "default_user",
        date: dateStr,
        weight: weight.toFixed(1),
        bodyFat: (20 - i * 0.05).toFixed(1),
        calories: Math.round(calories),
        protein: Math.round((calories * 0.2) / 4),
        carbs: Math.round((calories * 0.5) / 4),
        fats: Math.round((calories * 0.3) / 9),
        steps: Math.round(7000 + Math.random() * 4000),
        workoutMinutes: Math.round(30 + Math.random() * 30),
      });

      // Generate some meal entries
      if (i % 3 === 0) {
        meals.push({
          id: `meal-breakfast-${i}`,
          userId: "default_user",
          name: "Breakfast Bowl",
          description: "Oatmeal with fruit and nuts",
          mealType: "breakfast",
          calories: 350,
          protein: 15,
          carbs: 45,
          fats: 12,
          date: dateStr,
        });
      }

      if (i % 2 === 0) {
        meals.push({
          id: `meal-lunch-${i}`,
          userId: "default_user",
          name: "Chicken Salad",
          description: "Grilled chicken with mixed greens",
          mealType: "lunch",
          calories: 450,
          protein: 35,
          carbs: 25,
          fats: 15,
          date: dateStr,
        });
      }

      if (i % 2 === 1) {
        meals.push({
          id: `meal-dinner-${i}`,
          userId: "default_user",
          name: "Salmon with Vegetables",
          description: "Baked salmon with roasted vegetables",
          mealType: "dinner",
          calories: 550,
          protein: 40,
          carbs: 30,
          fats: 25,
          date: dateStr,
        });
      }
    }

    return { progressData: data, mealData: meals };
  };

  // Fetch progress data from API
  const fetchProgressData = useCallback(async () => {
    setLoading(true);
    try {
      const { progressData, mealData } = generateSampleData();
      setProgressData(progressData);
      setMealData(mealData);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format date for display on charts
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Calculate moving average for weight data (7-day window)
  const calculateMovingAverage = (data, key, window = 7) => {
    return data.map((item, index) => {
      const start = Math.max(0, index - window + 1);
      const values = data
        .slice(start, index + 1)
        .map((d) => parseFloat(d[key]));
      const sum = values.reduce((a, b) => a + b, 0);
      return {
        ...item,
        [`${key}MA`]: (sum / values.length).toFixed(1),
      };
    });
  };

  // Process data for charts
  const processedData = calculateMovingAverage(progressData, "weight");

  // Get weekly averages for bar chart
  const getWeeklyAverages = () => {
    const weeks = {};
    progressData.forEach((item) => {
      const date = new Date(item.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          week: formatDate(weekKey),
          calories: 0,
          count: 0,
          workoutMinutes: 0,
          steps: 0,
        };
      }

      weeks[weekKey].calories += Number(item.calories);
      weeks[weekKey].workoutMinutes += Number(item.workoutMinutes);
      weeks[weekKey].steps += Number(item.steps);
      weeks[weekKey].count++;
    });

    return Object.values(weeks).map((week) => ({
      ...week,
      calories: Math.round(week.calories / week.count),
      workoutMinutes: Math.round(week.workoutMinutes / week.count),
      steps: Math.round(week.steps / week.count),
    }));
  };

  // Aggregate macros for pie chart
  const aggregateMacros = () => {
    const totals = mealData.reduce(
      (acc, meal) => {
        acc.protein += Number(meal.protein) || 0;
        acc.carbs += Number(meal.carbs) || 0;
        acc.fats += Number(meal.fats) || 0;
        return acc;
      },
      { protein: 0, carbs: 0, fats: 0 }
    );

    return [
      { name: "Protein", value: totals.protein, color: "#8884d8" },
      { name: "Carbs", value: totals.carbs, color: "#82ca9d" },
      { name: "Fats", value: totals.fats, color: "#ffc658" },
    ];
  };

  const macroData = aggregateMacros();
  const weeklyData = getWeeklyAverages();

  // Colors for charts
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  const renderActiveShape = (props) => {
    const { cx, cy, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill="#999">
          {`${value}g (${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div className="progress-dashboard">
      <h2>Progress Dashboard</h2>

      <div className="dashboard-controls">
        <div className="date-range-selector">
          <div className="form-group">
            <label htmlFor="startDate">From</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">To</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <button className="refresh-button" onClick={fetchProgressData}>
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard data...</div>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-card weight-chart">
            <h3>Weight Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={processedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip
                  labelFormatter={(value) =>
                    `Date: ${new Date(value).toLocaleDateString()}`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8884d8"
                  dot={{ r: 2 }}
                  name="Daily Weight"
                />
                <Line
                  type="monotone"
                  dataKey="weightMA"
                  stroke="#ff7300"
                  dot={false}
                  strokeWidth={2}
                  name="7-Day Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-card calorie-chart">
            <h3>Weekly Calorie Intake</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={weeklyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="calories"
                  fill="#82ca9d"
                  name="Avg. Daily Calories"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-card activity-chart">
            <h3>Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={weeklyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="workoutMinutes"
                  stroke="#8884d8"
                  name="Workout Minutes"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="steps"
                  stroke="#82ca9d"
                  name="Daily Steps"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-card macro-chart">
            <h3>Macro Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  activeShape={renderActiveShape}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-card stats-summary">
            <h3>Summary Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Starting Weight</div>
                <div className="stat-value">
                  {progressData.length > 0
                    ? `${progressData[0].weight} kg`
                    : "N/A"}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Current Weight</div>
                <div className="stat-value">
                  {progressData.length > 0
                    ? `${progressData[progressData.length - 1].weight} kg`
                    : "N/A"}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Weight Change</div>
                <div className="stat-value">
                  {progressData.length > 0
                    ? `${(
                        progressData[progressData.length - 1].weight -
                        progressData[0].weight
                      ).toFixed(1)} kg`
                    : "N/A"}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Avg. Daily Calories</div>
                <div className="stat-value">
                  {progressData.length > 0
                    ? `${Math.round(
                        progressData.reduce(
                          (sum, item) => sum + Number(item.calories),
                          0
                        ) / progressData.length
                      )} kcal`
                    : "N/A"}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Avg. Daily Steps</div>
                <div className="stat-value">
                  {progressData.length > 0
                    ? `${Math.round(
                        progressData.reduce(
                          (sum, item) => sum + Number(item.steps),
                          0
                        ) / progressData.length
                      )}`
                    : "N/A"}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Avg. Workout Time</div>
                <div className="stat-value">
                  {progressData.length > 0
                    ? `${Math.round(
                        progressData.reduce(
                          (sum, item) => sum + Number(item.workoutMinutes),
                          0
                        ) / progressData.length
                      )} min`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressDashboard;
