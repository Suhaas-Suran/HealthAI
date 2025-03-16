import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";

function Form({ onSubmit }) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
    goals: "",
    dietaryRestrictions: [],
    healthConditions: [],
    workoutPreferences: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...formData[name], value],
      });
    } else {
      setFormData({
        ...formData,
        [name]: formData[name].filter((item) => item !== value),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(formData)
      .then(() => setLoading(false))
      .catch(() => setLoading(false)); // Handle errors as needed
  };

  // Get selected items count for each checkbox group
  const getSelectedCount = (fieldName) => formData[fieldName].length;

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper
        elevation={3}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#3f51b5",
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4" fontWeight="500">
            Personalized Fitness Plan
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Basic Info Section */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#3f51b5",
              fontWeight: "medium",
              mb: 3,
            }}
          >
            Basic Information
          </Typography>

          <Grid container spacing={3}>
            {/* Age */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ min: 18, max: 100 }}
                variant="outlined"
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Weight */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Weight (kg)"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                inputProps={{ min: 30, max: 300, step: "0.1" }}
              />
            </Grid>

            {/* Height */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Height (cm)"
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                inputProps={{ min: 100, max: 250 }}
              />
            </Grid>

            {/* Activity Level */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Activity Level</InputLabel>
                <Select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  required
                  label="Activity Level"
                >
                  <MenuItem value="sedentary">
                    Sedentary (little or no exercise)
                  </MenuItem>
                  <MenuItem value="light">
                    Light (light exercise 1-3 days/week)
                  </MenuItem>
                  <MenuItem value="moderate">
                    Moderate (moderate exercise 3-5 days/week)
                  </MenuItem>
                  <MenuItem value="active">
                    Active (hard exercise 6-7 days/week)
                  </MenuItem>
                  <MenuItem value="veryActive">
                    Very Active (very hard exercise, physical job or training
                    twice a day)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Fitness Goals */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Fitness Goals</InputLabel>
                <Select
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  required
                  label="Fitness Goals"
                >
                  <MenuItem value="weight_loss">Weight Loss</MenuItem>
                  <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="general_fitness">General Fitness</MenuItem>
                  <MenuItem value="athletic_performance">
                    Athletic Performance
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Dietary Restrictions */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#3f51b5",
                fontWeight: "medium",
                mb: 2,
              }}
            >
              Dietary Restrictions
              {getSelectedCount("dietaryRestrictions") > 0 && (
                <Chip
                  size="small"
                  label={`${getSelectedCount("dietaryRestrictions")} selected`}
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "rgba(63, 81, 181, 0.05)" }}
            >
              <Grid container spacing={2}>
                {[
                  "vegetarian",
                  "vegan",
                  "gluten-free",
                  "dairy-free",
                  "keto",
                ].map((diet) => (
                  <Grid item xs={12} sm={6} key={diet}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="dietaryRestrictions"
                          value={diet}
                          checked={formData.dietaryRestrictions.includes(diet)}
                          onChange={handleCheckboxChange}
                          color="primary"
                        />
                      }
                      label={diet.charAt(0).toUpperCase() + diet.slice(1)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>

          {/* Health Conditions */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#3f51b5",
                fontWeight: "medium",
                mb: 2,
              }}
            >
              Health Conditions
              {getSelectedCount("healthConditions") > 0 && (
                <Chip
                  size="small"
                  label={`${getSelectedCount("healthConditions")} selected`}
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "rgba(63, 81, 181, 0.05)" }}
            >
              <Grid container spacing={2}>
                {[
                  "diabetes",
                  "hypertension",
                  "heart-disease",
                  "joint-pain",
                ].map((condition) => (
                  <Grid item xs={12} sm={6} key={condition}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="healthConditions"
                          value={condition}
                          checked={formData.healthConditions.includes(
                            condition
                          )}
                          onChange={handleCheckboxChange}
                          color="primary"
                        />
                      }
                      label={condition
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>

          {/* Workout Preferences */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#3f51b5",
                fontWeight: "medium",
                mb: 2,
              }}
            >
              Workout Preferences
              {getSelectedCount("workoutPreferences") > 0 && (
                <Chip
                  size="small"
                  label={`${getSelectedCount("workoutPreferences")} selected`}
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "rgba(63, 81, 181, 0.05)" }}
            >
              <Grid container spacing={2}>
                {["home", "gym", "cardio", "strength", "yoga"].map(
                  (workout) => (
                    <Grid item xs={12} sm={4} key={workout}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="workoutPreferences"
                            value={workout}
                            checked={formData.workoutPreferences.includes(
                              workout
                            )}
                            onChange={handleCheckboxChange}
                            color="primary"
                          />
                        }
                        label={
                          workout.charAt(0).toUpperCase() + workout.slice(1)
                        }
                      />
                    </Grid>
                  )
                )}
              </Grid>
            </Paper>
          </Box>

          {/* Submit Button */}
          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, px: 3 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Form;
