import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Divider,
  CircularProgress,
  Fab,
  Drawer,
  Avatar,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Send as SendIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  CalculateOutlined as CalculateIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your nutrition assistant. Ask me anything about food, diet, or exercise!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("chat"); // 'chat', 'calculator', 'help'
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://healthai-79x3.onrender.com/api/chatbot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: input }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const botMessage = { text: data.response, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        text: "Sorry, I couldn't process your request. Please try again later.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Suggested questions
  const suggestions = [
    "How many calories should I eat daily?",
    "What's a good protein source for vegetarians?",
    "How much water should I drink daily?",
    "What's the best time to eat before a workout?",
    "Can you suggest a healthy breakfast?",
    "How can I reduce sugar cravings?",
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  // Handler for quick actions
  const handleAction = (action) => {
    switch (action) {
      case "calculator":
        setView("calculator");
        break;
      case "help":
        setView("help");
        break;
      case "chat":
        setView("chat");
        break;
      default:
        break;
    }
  };

  // BMR Calculator component
  const CalorieCalculator = () => {
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("female");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [activity, setActivity] = useState("moderate");
    const [result, setResult] = useState(null);

    const calculateBMR = () => {
      if (!age || !weight || !height) return;

      let bmr;
      if (gender === "male") {
        bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
      } else {
        bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
      }

      let tdee;
      switch (activity) {
        case "sedentary":
          tdee = bmr * 1.2;
          break;
        case "light":
          tdee = bmr * 1.375;
          break;
        case "moderate":
          tdee = bmr * 1.55;
          break;
        case "active":
          tdee = bmr * 1.725;
          break;
        case "very":
          tdee = bmr * 1.9;
          break;
        default:
          tdee = bmr * 1.55;
      }

      setResult({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        loss: Math.round(tdee - 500),
        extreme: Math.round(tdee - 1000),
        gain: Math.round(tdee + 500),
      });
    };

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Daily Calorie Calculator
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            size="small"
          />

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Gender
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant={gender === "male" ? "contained" : "outlined"}
                onClick={() => setGender("male")}
                size="small"
              >
                Male
              </Button>
              <Button
                variant={gender === "female" ? "contained" : "outlined"}
                onClick={() => setGender("female")}
                size="small"
              >
                Female
              </Button>
            </Box>
          </Box>

          <TextField
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            size="small"
          />

          <TextField
            label="Height (cm)"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            size="small"
          />

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Activity Level
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                variant={activity === "sedentary" ? "contained" : "outlined"}
                onClick={() => setActivity("sedentary")}
                size="small"
                sx={{ fontSize: "0.7rem" }}
              >
                Sedentary
              </Button>
              <Button
                variant={activity === "light" ? "contained" : "outlined"}
                onClick={() => setActivity("light")}
                size="small"
                sx={{ fontSize: "0.7rem" }}
              >
                Light
              </Button>
              <Button
                variant={activity === "moderate" ? "contained" : "outlined"}
                onClick={() => setActivity("moderate")}
                size="small"
                sx={{ fontSize: "0.7rem" }}
              >
                Moderate
              </Button>
              <Button
                variant={activity === "active" ? "contained" : "outlined"}
                onClick={() => setActivity("active")}
                size="small"
                sx={{ fontSize: "0.7rem" }}
              >
                Active
              </Button>
              <Button
                variant={activity === "very" ? "contained" : "outlined"}
                onClick={() => setActivity("very")}
                size="small"
                sx={{ fontSize: "0.7rem" }}
              >
                Very Active
              </Button>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={calculateBMR}
            disabled={!age || !weight || !height}
            sx={{ mt: 1 }}
          >
            Calculate
          </Button>
        </Box>

        {result && (
          <Card sx={{ mt: 2, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Your Results
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>BMR (Basal Metabolic Rate):</strong> {result.bmr}{" "}
                calories/day
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Maintenance Calories:</strong> {result.tdee}{" "}
                calories/day
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" gutterBottom>
                <strong>Weight Loss:</strong> {result.loss} calories/day
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Extreme Weight Loss:</strong> {result.extreme}{" "}
                calories/day
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Weight Gain:</strong> {result.gain} calories/day
              </Typography>
            </CardContent>
          </Card>
        )}

        <Button
          startIcon={<ChatIcon />}
          onClick={() => handleAction("chat")}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          Back to Chat
        </Button>
      </Box>
    );
  };

  // Help section component
  const HelpSection = () => {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          How to Use the Nutrition Assistant
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <ChatIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Ask Questions"
              secondary="Type any nutrition, diet, or fitness question and get expert answers."
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CalculateIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Calculate Calories"
              secondary="Use the calculator to determine your daily calorie needs."
            />
          </ListItem>
        </List>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Example Questions:
        </Typography>

        <List dense>
          {suggestions.map((question, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleSuggestionClick(question)}
            >
              <ListItemIcon>
                <HelpIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary={question} />
            </ListItem>
          ))}
        </List>

        <Button
          startIcon={<ChatIcon />}
          onClick={() => handleAction("chat")}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          Back to Chat
        </Button>
      </Box>
    );
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#3f51b5",
          "&:hover": {
            backgroundColor: "#303f9f",
          },
          zIndex: 1000,
        }}
      >
        <ChatIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 400 },
            maxWidth: "100%",
            boxShadow: "-4px 0 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#3f51b5",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <RestaurantIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Nutrition Assistant</Typography>
            </Box>
            <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Quick Actions */}
          <Box
            sx={{
              display: "flex",
              p: 1,
              bgcolor: "#f5f5f5",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Button
              startIcon={<ChatIcon />}
              onClick={() => handleAction("chat")}
              color="primary"
              size="small"
              variant={view === "chat" ? "contained" : "text"}
              sx={{ flex: 1, mr: 0.5 }}
            >
              Chat
            </Button>
            <Button
              startIcon={<CalculateIcon />}
              onClick={() => handleAction("calculator")}
              color="primary"
              size="small"
              variant={view === "calculator" ? "contained" : "text"}
              sx={{ flex: 1, mx: 0.5 }}
            >
              Calculator
            </Button>
            <Button
              startIcon={<HelpIcon />}
              onClick={() => handleAction("help")}
              color="primary"
              size="small"
              variant={view === "help" ? "contained" : "text"}
              sx={{ flex: 1, ml: 0.5 }}
            >
              Help
            </Button>
          </Box>

          {/* Content Area */}
          {view === "chat" && (
            <>
              {/* Chat Messages */}
              <Box
                sx={{
                  flexGrow: 1,
                  p: 2,
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  bgcolor: "#f5f5f5",
                }}
              >
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent:
                        message.sender === "user" ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    {message.sender === "bot" && (
                      <Avatar
                        sx={{
                          bgcolor: "#3f51b5",
                          width: 32,
                          height: 32,
                          mr: 1,
                          mt: 0.5,
                        }}
                      >
                        <FitnessCenterIcon fontSize="small" />
                      </Avatar>
                    )}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: "70%",
                        backgroundColor:
                          message.sender === "user" ? "#3f51b5" : "white",
                        color: message.sender === "user" ? "white" : "inherit",
                        borderRadius:
                          message.sender === "user"
                            ? "20px 20px 0 20px"
                            : "20px 20px 20px 0",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-line" }}
                      >
                        {message.text}
                      </Typography>
                    </Paper>

                    {message.sender === "user" && (
                      <Avatar
                        sx={{
                          bgcolor: "#7986cb",
                          width: 32,
                          height: 32,
                          ml: 1,
                          mt: 0.5,
                        }}
                      >
                        U
                      </Avatar>
                    )}
                  </Box>
                ))}

                {isLoading && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: "20px 20px 20px 0",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress size={20} sx={{ color: "#3f51b5" }} />
                    </Paper>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Suggestions */}
              {messages.length < 3 && (
                <Box sx={{ p: 2, bgcolor: "#f0f0f0" }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ color: "#666" }}
                  >
                    Suggested questions:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {suggestions.slice(0, 4).map((suggestion, index) => (
                      <Box
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{
                          p: 1,
                          bgcolor: "#e0e0e0",
                          borderRadius: 2,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#d0d0d0" },
                        }}
                      >
                        {suggestion}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Input Field */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Ask about food, diet, or fitness..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "&.Mui-focused fieldset": {
                          borderColor: "#3f51b5",
                        },
                      },
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={input.trim() === "" || isLoading}
                    sx={{
                      ml: 1,
                      bgcolor: "#3f51b5",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#303f9f",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#c5cae9",
                        color: "white",
                      },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}

          {view === "calculator" && <CalorieCalculator />}
          {view === "help" && <HelpSection />}
        </Box>
      </Drawer>
    </>
  );
};

export default ChatBot;
