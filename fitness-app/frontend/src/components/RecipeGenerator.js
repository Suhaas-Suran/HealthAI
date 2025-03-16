import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TimerIcon from "@mui/icons-material/Timer";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

function RecipeGenerator() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    setIngredients(
      ingredients.filter((ingredient) => ingredient !== ingredientToRemove)
    );
  };

  const generateRecipe = async () => {
    if (ingredients.length < 2) {
      setError("Please add at least 2 ingredients to generate a recipe.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the prompt for Gemini
      const prompt = `
        Generate a detailed recipe using ONLY the following ingredients (or a subset of them):
        ${ingredients.join(", ")}
        
        Provide the response as a valid JSON object with this exact structure:
        {
          "title": "Recipe Title",
          "description": "Brief description of the dish",
          "prepTime": "preparation time in minutes",
          "cookTime": "cooking time in minutes",
          "servings": number,
          "ingredients": [
            {"name": "ingredient1", "amount": "quantity"},
            {"name": "ingredient2", "amount": "quantity"}
          ],
          "instructions": [
            "Step 1 description",
            "Step 2 description"
          ],
          "nutritionEstimate": {
            "calories": number,
            "protein": number,
            "carbs": number,
            "fats": number
          }
        }
      `;

      // Simulate API call (replace with your actual Gemini API endpoint)
      const response = await fetch(
        "http://localhost:5000/api/generate-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, ingredients }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const data = await response.json();

      // For development/demo purposes, creating a mock response
      // In production, you'd use the actual API response
      if (!data.title) {
        // Mock data for development/demo
        const mockRecipe = {
          title: `${
            ingredients[0].charAt(0).toUpperCase() + ingredients[0].slice(1)
          } ${ingredients.length > 1 ? "& " + ingredients[1] : ""} Delight`,
          description: `A delicious recipe made primarily with ${ingredients.join(
            ", "
          )}.`,
          prepTime: "15",
          cookTime: "25",
          servings: 4,
          ingredients: ingredients.map((ing) => ({
            name: ing,
            amount:
              ing.includes("salt") || ing.includes("spice")
                ? "to taste"
                : "1 cup",
          })),
          instructions: [
            `Prepare the ${ingredients[0]} by washing and cutting into bite-sized pieces.`,
            `Heat a pan over medium heat and add ${
              ingredients.includes("oil") ? "oil" : "butter"
            }.`,
            `Cook the ingredients together, starting with the ones that take longer to cook.`,
            `Season to taste and serve hot.`,
          ],
          nutritionEstimate: {
            calories: 320,
            protein: 12,
            carbs: 40,
            fats: 15,
          },
        };
        setRecipe(mockRecipe);
      } else {
        setRecipe(data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: "0 auto", padding: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: "#3f51b5",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Recipe Generator
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
        Enter ingredients you have at home, and we'll suggest a delicious
        recipe!
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", mb: 2 }}>
          <TextField
            fullWidth
            label="Add ingredient"
            variant="outlined"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleAddIngredient}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#3f51b5",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            Add
          </Button>
        </Box>

        <Box sx={{ mb: 3, minHeight: "50px" }}>
          {ingredients.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {ingredients.map((ingredient, index) => (
                <Chip
                  key={index}
                  label={ingredient}
                  onDelete={() => handleRemoveIngredient(ingredient)}
                  deleteIcon={<DeleteIcon />}
                  sx={{
                    backgroundColor: "#e8eaf6",
                    "& .MuiChip-deleteIcon": {
                      color: "#f44336",
                      "&:hover": {
                        color: "#d32f2f",
                      },
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontStyle: "italic" }}
            >
              Add ingredients to get started
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={generateRecipe}
          disabled={ingredients.length < 2 || loading}
          startIcon={<RestaurantIcon />}
          sx={{
            backgroundColor: "#3f51b5",
            "&:hover": {
              backgroundColor: "#303f9f",
            },
            "&.Mui-disabled": {
              backgroundColor: "#c5cae9",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Generate Recipe"
          )}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}
      </Paper>

      {recipe && (
        <Card elevation={4} sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{ mb: 1, color: "#3f51b5", fontWeight: 600 }}
            >
              {recipe.title}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2, fontStyle: "italic" }}>
              {recipe.description}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TimerIcon sx={{ mr: 1, color: "#3f51b5" }} />
                <Typography variant="body2">
                  Prep: {recipe.prepTime} min | Cook: {recipe.cookTime} min
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocalDiningIcon sx={{ mr: 1, color: "#3f51b5" }} />
                <Typography variant="body2">
                  Serves: {recipe.servings}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ mb: 1, color: "#3f51b5" }}>
                  Ingredients
                </Typography>
                <List dense>
                  {recipe.ingredients.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <strong>{item.amount}</strong> {item.name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                <Box
                  sx={{
                    mt: 3,
                    p: 1.5,
                    backgroundColor: "#e8eaf6",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, color: "#3f51b5" }}
                  >
                    Nutrition (est. per serving)
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Calories: {recipe.nutritionEstimate.calories}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Protein: {recipe.nutritionEstimate.protein}g
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Carbs: {recipe.nutritionEstimate.carbs}g
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Fats: {recipe.nutritionEstimate.fats}g
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h6" sx={{ mb: 1, color: "#3f51b5" }}>
                  Instructions
                </Typography>
                <List>
                  {recipe.instructions.map((step, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{ py: 1 }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            component="span"
                            variant="body1"
                            sx={{ fontWeight: 500 }}
                          >
                            Step {index + 1}:
                          </Typography>
                        }
                        secondary={
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                            sx={{ display: "inline", mt: 1 }}
                          >
                            {step}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default RecipeGenerator;