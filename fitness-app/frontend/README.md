# FitGen AI Frontend

This is the frontend portion of the FitGen AI application, built with React.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Components

### App.js

The main component that orchestrates the entire application. It manages the state for the fitness plan and handles the API request to the backend.

### Form.js

Collects user input for generating personalized fitness plans, including personal details, fitness goals, dietary restrictions, and workout preferences.

### DailyPlan.js

Displays the daily meal and workout plan for a selected day.

### Header.js

Displays the application header and branding.

### Footer.js

Displays the application footer with copyright information.

## API Integration

The frontend communicates with the Flask backend using the fetch API. When a user submits the form, the data is sent to the `/api/recommend` endpoint, which uses Google Gemini AI to generate a personalized plan.

## Styling

The application uses a custom CSS stylesheet with a responsive design that works on both desktop and mobile devices.

## Deployment

Build the application using `npm run build` and deploy the contents of the `build` directory to your web server.
