from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
import logging

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Google Gemini API
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is missing in the environment variables.")
    
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
except Exception as e:
    logger.error(f"Failed to initialize Gemini API: {e}")
    raise RuntimeError(f"Failed to initialize Gemini API: {e}")

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json

    # Extract user inputs
    age = data.get('age')
    gender = data.get('gender')
    weight = data.get('weight')
    height = data.get('height')
    activity_level = data.get('activityLevel')
    goals = data.get('goals')
    dietary_restrictions = data.get('dietaryRestrictions', [])
    health_conditions = data.get('healthConditions', [])
    workout_preferences = data.get('workoutPreferences', [])

    # Create JSON template for Gemini response
    response_template = """
    {
      "dailyCalories": number,
      "macros": {
        "protein": number,
        "carbs": number,
        "fats": number
      },
      "days": [
        {
          "day": "Monday",
          "meals": {
            "breakfast": "Description",
            "lunch": "Description",
            "dinner": "Description",
            "snacks": ["Snack 1", "Snack 2"]
          },
          "workout": {
            "type": "Cardio/Strength/Rest",
            "exercises": [
              {
                "name": "Exercise name",
                "sets": number,
                "reps": number,
                "duration": "time in minutes (if applicable)"
              }
            ]
          }
        }
      ]
    }
    """

    # Create prompt for Gemini
    prompt = f"""
    Create a personalized diet and workout plan based on the following information:

    Personal Details:
    - Age: {age}
    - Gender: {gender}
    - Weight: {weight} kg
    - Height: {height} cm
    - Activity Level: {activity_level}

    Goals: {goals}

    Dietary Restrictions: {', '.join(dietary_restrictions) if dietary_restrictions else 'None'}

    Health Conditions: {', '.join(health_conditions) if health_conditions else 'None'}

    Workout Preferences: {', '.join(workout_preferences) if workout_preferences else 'None'}

    Please provide a 7-day plan that follows this format:
    {response_template}
    """

    # Generate response using Gemini
    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Improved JSON parsing to handle unexpected text formats
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        plan_data = json.loads(response_text)
        return jsonify(plan_data)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response: {e}")
        return jsonify({
            "error": "Failed to parse AI response",
            "message": "Invalid JSON structure received",
            "raw_response": response.text
        }), 500
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return jsonify({
            "error": "An error occurred while generating recommendations",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
