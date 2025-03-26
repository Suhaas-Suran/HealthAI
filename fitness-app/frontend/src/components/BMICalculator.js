import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalculateIcon from "@mui/icons-material/Calculate";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const BMICalculator = () => {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://healthai-79x3.onrender.com/api/calculate-bmi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            weight: parseFloat(weight),
            height: parseFloat(height),
            age: parseInt(age),
            gender,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to calculate BMI");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return "#3498db"; // Underweight - blue
    if (bmi < 25) return "#2ecc71"; // Normal - green
    if (bmi < 30) return "#f39c12"; // Overweight - orange
    return "#e74c3c"; // Obese - red
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<CalculateIcon />}
        onClick={handleOpen}
        sx={{
          backgroundColor: "#3f51b5",
          "&:hover": {
            backgroundColor: "#303f9f",
          },
        }}
      >
        BMI Calculator
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#3f51b5",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FitnessCenterIcon sx={{ mr: 1 }} />
            <Typography variant="h6">BMI Calculator</Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              Enter your details to calculate your Body Mass Index (BMI)
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Age</Typography>
            <TextField
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 1, max: 120 } }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Gender</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio color="primary" />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio color="primary" />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Weight (kg)</Typography>
            <TextField
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 20, max: 200 } }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Height (cm)</Typography>
            <TextField
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 100, max: 250 } }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleCalculate}
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: "#3f51b5",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
              mt: 2,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Calculate BMI"
            )}
          </Button>

          {error && (
            <Box sx={{ mt: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {result && (
            <Paper elevation={3} sx={{ mt: 3, p: 2, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom textAlign="center">
                Your BMI: {result.bmi}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  my: 2,
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    border: `6px solid ${getBMIColor(result.bmi)}`,
                  }}
                >
                  <Typography variant="h4">{result.bmi}</Typography>
                </Box>
              </Box>

              <Typography
                variant="h6"
                gutterBottom
                textAlign="center"
                sx={{ color: getBMIColor(result.bmi) }}
              >
                {result.category}
              </Typography>

              <Typography variant="body2" gutterBottom textAlign="center">
                {result.risk}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Personalized Advice:
              </Typography>
              <Typography variant="body1" paragraph>
                {result.advice}
              </Typography>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BMICalculator;
