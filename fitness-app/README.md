# FitGen AI - Diet and Workout Recommendation System

FitGen AI is a web application that provides personalized diet and workout recommendations based on user inputs using Google's Gemini AI.

## Overview

This application allows users to input their personal details, fitness goals, dietary restrictions, health conditions, and workout preferences. Using this information, Google Gemini AI generates a personalized 7-day diet and workout plan.

## Features

- Personalized meal planning based on user details and preferences
- Custom workout routines that adapt to individual goals
- Responsive design for desktop and mobile use
- Detailed breakdown of daily macronutrients
- Accommodations for dietary restrictions and health conditions

## Tech Stack

- **Frontend**: React.js
- **Backend**: Flask (Python)
- **AI**: Google Gemini AI

## Project Structure

```
fitness-app/
├── backend/
│   ├── app.py                # Flask API server
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables (API keys)
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Form.js       # Form component
│   │   │   ├── DailyPlan.js  # Daily plan display
│   │   │   ├── Header.js     # App header
│   │   │   └── Footer.js     # App footer
|   |   |   └── LandingPage.js
│   │   ├── App.js            # Main app component
│   │   ├── index.js          # React entry point
│   │   └── styles.css        # Global styles
│   ├── package.json
│   └── README.md
└── README.md                 # Project documentation
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or newer)
- Python (v3.8 or newer)
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory

   ```
   cd fitness-app/backend
   ```

2. Create a virtual environment

   ```
   python -m venv venv
   ```

3. Activate the virtual environment

   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

4. Install dependencies

   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the backend directory and add your Google Gemini API key:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

6. Start the Flask server
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory

   ```
   cd fitness-app/frontend
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Start the development server

   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Fill out the form with your personal details, fitness goals, and preferences
2. Click "Generate My Plan" to receive your personalized 7-day diet and workout plan
3. Navigate between days using the day selector
4. Review your daily meal plan and workout routine

## API Documentation

### Endpoint: `/api/recommend`

- **Method**: POST
- **Description**: Generates a personalized diet and workout plan
- **Request Body**:
  ```json
  {
    "age": 30,
    "gender": "female",
    "weight": 70,
    "height": 165,
    "activityLevel": "moderate",
    "goals": "weight_loss",
    "dietaryRestrictions": ["vegetarian"],
    "healthConditions": ["joint-pain"],
    "workoutPreferences": ["home", "cardio"]
  }
  ```
- **Response**: JSON object containing the personalized plan

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Google Gemini AI for powering the recommendation engine
- React and Flask for providing the framework for this application
