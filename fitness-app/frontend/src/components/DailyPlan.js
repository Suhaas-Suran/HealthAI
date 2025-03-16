import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Box,
} from "@mui/material";

function DailyPlan({ day }) {
  return (
    <Card className="daily-plan" sx={{ mb: 2, p: 2 }}>
      {/* Meal Plan Section */}
      <CardContent className="plan-section meal-plan">
        <Typography variant="h5" gutterBottom>
          Meal Plan for {day?.day}
        </Typography>

        {["breakfast", "lunch", "dinner"].map((mealType) => (
          <Box key={mealType} className="meal" sx={{ my: 1 }}>
            <Typography variant="h6">
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Typography>
            <Typography>
              {day?.meals?.[mealType] || "No details available"}
            </Typography>
          </Box>
        ))}

        <Box className="meal" sx={{ my: 1 }}>
          <Typography variant="h6">Snacks</Typography>
          <List>
            {day?.meals?.snacks?.length ? (
              day.meals.snacks.map((snack, index) => (
                <ListItem key={index}>{snack}</ListItem>
              ))
            ) : (
              <Typography>No snack details available</Typography>
            )}
          </List>
        </Box>
      </CardContent>

      {/* Workout Plan Section */}
      <CardContent className="plan-section workout-plan">
        <Typography variant="h5" gutterBottom>
          Workout Plan for {day?.day}
        </Typography>

        <Typography className="workout-type">
          {day?.workout?.type || "Unknown"}
        </Typography>

        {day?.workout?.type !== "Rest" ? (
          <Box className="exercises">
            {day?.workout?.exercises?.map((exercise, index) => (
              <Box key={index} className="exercise" sx={{ my: 1 }}>
                <Typography variant="h6">{exercise.name}</Typography>
                <Box className="exercise-details">
                  {exercise.sets && (
                    <Typography>{exercise.sets} sets</Typography>
                  )}
                  {exercise.reps && (
                    <Typography>{exercise.reps} reps</Typography>
                  )}
                  {exercise.duration && (
                    <Typography>{exercise.duration}</Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>
            Today is your rest day. Focus on recovery, hydration, and getting
            enough sleep.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// PropType Validation for Better Stability
DailyPlan.propTypes = {
  day: PropTypes.shape({
    day: PropTypes.string.isRequired,
    meals: PropTypes.shape({
      breakfast: PropTypes.string,
      lunch: PropTypes.string,
      dinner: PropTypes.string,
      snacks: PropTypes.arrayOf(PropTypes.string),
    }),
    workout: PropTypes.shape({
      type: PropTypes.string.isRequired,
      exercises: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          sets: PropTypes.number,
          reps: PropTypes.number,
          duration: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
};

export default DailyPlan;
