import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/form");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
          color: "white",
          py: 8,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 700 }}
                >
                  Your Personalized Fitness Journey
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Get a customized workout and nutrition plan tailored to your
                  unique goals and lifestyle
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: "white",
                    color: "#3f51b5",
                    fontSize: "1.1rem",
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      transform: "scale(1.05)",
                    },
                    transition: "transform 0.3s, background-color 0.3s",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  Get Started Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://t4.ftcdn.net/jpg/03/31/65/75/360_F_331657557_pjwDMgBaWlOZqjx1BNE0egkkNZ1t0QQf.jpg"
                alt="Fitness Illustration"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 400,
                  objectFit: "cover",
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600, mb: 6 }}
        >
          How It Works
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "Fill Your Profile",
              description:
                "Answer a few questions about your body metrics, lifestyle, and goals.",
              image:
                "https://www.hubspot.com/hubfs/questionnaire-examples-questions-templates.png",
            },
            {
              title: "Get Your Plan",
              description:
                "Receive a custom workout and nutrition plan tailored specifically to you.",
              image:
                "https://media.istockphoto.com/id/626956870/photo/action-plan-concept-the-meeting-at-the-white-office-table.jpg?s=612x612&w=0&k=20&c=vWRfFguamyKJhMXa456HJOCoc1RlG3vB3cEjl-qCXJU=",
            },
            {
              title: "Track Your Progress",
              description:
                "Follow your plan and track improvements to stay motivated on your journey.",
              image:
                "https://t3.ftcdn.net/jpg/01/06/39/28/360_F_106392821_SgazuX0M46bCdRj3e8EaJwEIfBQdfhlx.jpg",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box
          sx={{
            mt: 8,
            p: 6,
            borderRadius: 4,
            textAlign: "center",
            bgcolor: "rgba(63, 81, 181, 0.05)",
            border: "1px solid rgba(63, 81, 181, 0.2)",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Ready to Transform Your Fitness?
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ maxWidth: 700, mx: "auto", mb: 4 }}
          >
            Join thousands of users who have achieved their fitness goals with
            our personalized plans. Get started today and see results in just
            weeks.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: "#3f51b5",
              fontSize: "1.1rem",
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#303f9f",
                transform: "scale(1.05)",
              },
              transition: "transform 0.3s, background-color 0.3s",
            }}
          >
            Create My Fitness Plan
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default LandingPage;
