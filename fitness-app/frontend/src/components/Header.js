import React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Toolbar>
        <Typography
          variant="h4"
          component="div"
          onClick={() => navigate("/")}
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: 1.5,
            cursor: "pointer",
            fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          }}
        >
          HealthAI
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Typography
            variant="body1"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "1.1rem",
              fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif'",
              "&:hover": { color: "#fff", textDecoration: "underline" },
            }}
          >
            Home
          </Typography>
          <Typography
            variant="body1"
            onClick={() => navigate("/form")}
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "1.1rem",
              fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
              "&:hover": { color: "#fff", textDecoration: "underline" },
            }}
          >
            Generate Plan
          </Typography>
          <Typography
            variant="body1"
            onClick={() => navigate("/meal-logging")}
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "1.1rem",
              fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
              "&:hover": { color: "#fff", textDecoration: "underline" },
            }}
          >
            Meal Logging
          </Typography>
          <Typography
            variant="body1"
            onClick={() => navigate("/progress")}
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "1.1rem",
              fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
              "&:hover": { color: "#fff", textDecoration: "underline" },
            }}
          >
            Progress
          </Typography>
          <Typography
            variant="body1"
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "1.1rem",
              fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
              "&:hover": { color: "#fff", textDecoration: "underline" },
            }}
          >
            Contact
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
