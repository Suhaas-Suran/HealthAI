import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      className="footer"
      sx={{
        backgroundColor: "#282c34",
        color: "#fff",
        textAlign: "center",
        py: 2,
        mt: 4,
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} HealthAI
      </Typography>
      <Typography variant="body2">Powered by Google Gemini</Typography>
    </Box>
  );
}

export default Footer;
