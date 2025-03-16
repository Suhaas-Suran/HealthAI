from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
import logging
import base64
from datetime import datetime
import uuid

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
    vision_model = genai.GenerativeModel('gemini-2.0-flash')
except Exception as e:
    logger.error(f"Failed to initialize Gemini API: {e}")
    raise RuntimeError(f"Failed to initialize Gemini API: {e}")

# In-memory storage (replace with database in production)
meals_db = []
user_progress = []

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

@app.route('/api/log-meal', methods=['POST'])
def log_meal():
    data = request.json
    
    meal_data = {
        'id': str(uuid.uuid4()),
        'userId': data.get('userId', 'default_user'),
        'name': data.get('name'),
        'description': data.get('description', ''),
        'mealType': data.get('mealType', 'other'),
        'calories': data.get('calories'),
        'protein': data.get('protein', 0),
        'carbs': data.get('carbs', 0),
        'fats': data.get('fats', 0),
        'date': data.get('date', datetime.now().isoformat())
    }
    
    meals_db.append(meal_data)
    
    return jsonify({
        'status': 'success',
        'message': 'Meal logged successfully',
        'data': meal_data
    })

@app.route('/api/analyze-food-image', methods=['POST'])
def analyze_food_image():
    data = request.json
    image_data = data.get('image')
    
    if not image_data:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Remove the base64 prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Create a content part with the image
        image_parts = [
            {
                "inlineData": {
                    "mimeType": "image/jpeg",
                    "data": image_data
                }
            }
        ]
        
        prompt = """
        Analyze this food image and provide the following information in JSON format:
        1. What food items are visible
        2. Estimated calories per serving
        3. Estimated macronutrients (protein, carbs, fats) in grams
        
        Format your response as a valid JSON object with these keys:
        {
          "foodItems": ["item1", "item2", ...],
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number,
          "mealType": "breakfast/lunch/dinner/snack"
        }
        
        Don't include any explanations or markdown - just the JSON object.
        """
        
        response = vision_model.generate_content([prompt, image_parts[0]])
        response_text = response.text.strip()
        
        # Extract JSON from response
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        food_data = json.loads(response_text)
        return jsonify(food_data)
    
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response: {e}")
        return jsonify({
            "error": "Failed to parse AI response",
            "message": "Invalid JSON structure received",
            "raw_response": response.text if 'response' in locals() else "No response generated"
        }), 500
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return jsonify({
            "error": "An error occurred while analyzing the image",
            "message": str(e)
        }), 500

@app.route('/api/meals', methods=['GET'])
def get_meals():
    user_id = request.args.get('userId', 'default_user')
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    
    # Filter by user ID
    user_meals = [meal for meal in meals_db if meal['userId'] == user_id]
    
    # Filter by date range if provided
    if start_date and end_date:
        user_meals = [meal for meal in user_meals if start_date <= meal['date'] <= end_date]
    
    return jsonify(user_meals)

@app.route('/api/progress', methods=['POST'])
def log_progress():
    data = request.json
    
    progress_entry = {
        'id': str(uuid.uuid4()),
        'userId': data.get('userId', 'default_user'),
        'date': data.get('date', datetime.now().isoformat()),
        'weight': data.get('weight'),
        'bodyFat': data.get('bodyFat'),
        'calories': data.get('calories'),
        'protein': data.get('protein'),
        'carbs': data.get('carbs'),
        'fats': data.get('fats'),
        'steps': data.get('steps'),
        'workoutMinutes': data.get('workoutMinutes')
    }
    
    user_progress.append(progress_entry)
    
    return jsonify({
        'status': 'success',
        'message': 'Progress logged successfully',
        'data': progress_entry
    })

@app.route('/api/progress', methods=['GET'])
def get_progress():
    user_id = request.args.get('userId', 'default_user')
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    
    # Filter by user ID
    user_data = [entry for entry in user_progress if entry['userId'] == user_id]
    
    # Filter by date range if provided
    if start_date and end_date:
        user_data = [entry for entry in user_data if start_date <= entry['date'] <= end_date]
    
    return jsonify(user_data)

@app.route('/api/generate-recipe', methods=['POST'])
def generate_recipe():
    data = request.json
    ingredients = data.get('ingredients', [])
    
    if not ingredients or len(ingredients) < 2:
        return jsonify({
            "error": "At least 2 ingredients are required"
        }), 400
    
    try:
        # Create prompt for Gemini
        prompt = f"""
        Generate a detailed recipe using ONLY the following ingredients (or a subset of them):
        {', '.join(ingredients)}
        
        Provide the response as a valid JSON object with this exact structure:
        {{
          "title": "Recipe Title",
          "description": "Brief description of the dish",
          "prepTime": "preparation time in minutes",
          "cookTime": "cooking time in minutes",
          "servings": number,
          "ingredients": [
            {{"name": "ingredient1", "amount": "quantity"}},
            {{"name": "ingredient2", "amount": "quantity"}}
          ],
          "instructions": [
            "Step 1 description",
            "Step 2 description"
          ],
          "nutritionEstimate": {{
            "calories": number,
            "protein": number,
            "carbs": number,
            "fats": number
          }}
        }}
        """
        
        # Generate response using Gemini
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Improved JSON parsing to handle unexpected text formats
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        recipe_data = json.loads(response_text)
        return jsonify(recipe_data)
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response: {e}")
        return jsonify({
            "error": "Failed to parse AI response",
            "message": "Invalid JSON structure received",
            "raw_response": response.text if 'response' in locals() else "No response generated"
        }), 500
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return jsonify({
            "error": "An error occurred while generating recipe",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)