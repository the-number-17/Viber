Sentence Vibe Check Application

## 1. Application Overview

The "Sentence Vibe Check" is a full-stack web application designed to analyze the sentiment or "vibe" of any given text input. Users can type a sentence into the frontend interface, and the backend, powered by a natural language processing library, will determine if the sentence carries a positive, negative, or neutral sentiment. The application then provides dynamic visual feedback (emojis, background effects, and a custom message) based on the detected vibe.

## 2. Technologies Used

This project utilizes a combination of modern web technologies for both its frontend and backend components:

### Backend (Python - Flask)
- **Flask**: A lightweight Python web framework used for building the API.
- **Flask-CORS**: A Flask extension for handling Cross-Origin Resource Sharing (CORS), allowing the frontend to make requests to the backend.
- **python-dotenv**: Used to load environment variables (like API keys) from a `.env` file.
- **NLTK (Natural Language Toolkit)**: A leading platform for building Python programs to work with human language data.
  - **VaderSentiment**: A lexicon and rule-based sentiment analysis tool specifically tuned to sentiments expressed in social media. It provides accurate sentiment scores for various types of text.

### Frontend (React.js)
- **React**: A JavaScript library for building user interfaces, providing a component-based structure.
- **Material-UI (MUI)**: A popular React UI framework that implements Google's Material Design, providing pre-built and customizable components for a modern look and feel.
- **Axios**: A promise-based HTTP client for the browser and Node.js, used for making API requests from the frontend to the backend.
- **@emotion/react & @emotion/styled**: Libraries for writing CSS-in-JS, enabling dynamic styling and keyframe animations within React components.

## 3. Codebase Structure

The project is organized into two main directories: `backend` and `frontend`.

```
note-analysis-app/
├── backend/
│   ├── venv/                   # Python Virtual Environment
│   ├── .env                    # Environment variables (e.g., OPENAI_API_KEY)
│   ├── app.py                  # Flask backend application with sentiment analysis logic
│   └── requirements.txt        # Python dependencies for the backend
├── frontend/
│   ├── public/
│   │   ├── mountain-bg.jpg     # Background image for the application
│   │   └── index.html          # Main HTML file for the React app
│   ├── src/
│   │   ├── App.js              # Main React component, handles UI, state, and API calls
│   │   └── index.js            # Entry point for the React application
│   ├── package.json            # Frontend project metadata and dependencies
│   └── node_modules/           # Frontend (npm) dependencies
└── README.txt                  # This explanation file
```

### Key Files Explained:

-   **`backend/app.py`**: This is the heart of the backend. It's a Flask application that:
    -   Initializes the VADER sentiment analyzer.
    -   Exposes an `/api/analyze` POST endpoint.
    -   Receives text input (`note`) from the frontend.
    -   Uses `VaderSentiment` to determine the compound sentiment score.
    -   Classifies the sentiment as "pos", "neg", or "neutral" based on compound score thresholds.
    -   Returns a custom sentiment message and the sentiment label to the frontend.
-   **`frontend/src/App.js`**: This is the main React component that renders the user interface. It handles:
    -   User input for the sentence.
    -   Making API calls to the Flask backend using Axios.
    -   Managing application state (note, analysis results, loading, errors, sentiment label).
    -   Dynamically updating the UI based on sentiment:
        -   Changes the main heading text and color.
        -   Animates large emojis (smiling for positive, sad for negative) sliding into view.
        -   Applies a grayscale filter to the background image for negative sentiment.
        -   Desaturates the background image for neutral sentiment and as the default initial state.
        -   Displays a customized "vibe message" instead of raw statistics.
-   **`frontend/public/mountain-bg.jpg`**: The static background image used throughout the application. Its filters (grayscale, saturation) are dynamically controlled by the `App.js` component.

## 4. How to Run the Application

Follow these steps to set up and run the "Sentence Vibe Check" application locally.

### Prerequisites:
- Python 3.8+
- Node.js and npm (or yarn)

### Step 1: Clone the Repository (if applicable)
If you haven't already, clone the project repository:
```bash
git clone <repository_url>
cd note-analysis-app
```

### Step 2: Backend Setup and Run

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Create and activate a Python virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
    *On Mac, if `python3` doesn't work, try `python`.*

3.  **Install Python dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
    *If you encounter `ModuleNotFoundError: No module named 'flask'` or similar, ensure your virtual environment is activated.*

4.  **Download NLTK's Vader Lexicon**:
    If you encounter errors related to `vader_lexicon` not found, you might need to manually download it. Also, if you're on macOS and experience SSL errors during download, run the `Install Certificates.command` located in your Python installation directory (e.g., `/Applications/Python 3.X/Install Certificates.command`).
    ```bash
    python -c "import nltk; nltk.download('vader_lexicon')"
    ```

5.  **Create a `.env` file (Optional, for OpenAI key if you ever switch back)**:
    Create a file named `.env` in the `backend` directory.
    ```bash
    touch .env
    ```
    Add your OpenAI API key to it (though currently not used for sentiment analysis, it's good practice for potential future features):
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```
    Replace `your_openai_api_key_here` with your actual key.

6.  **Run the Flask backend server**:
    ```bash
    python app.py
    ```
    The backend should start and be accessible at `http://127.0.0.1:5001`. Keep this terminal window open.

### Step 3: Frontend Setup and Run

1.  **Open a new terminal window** and **navigate to the frontend directory**:
    ```bash
    cd ../frontend
    ```

2.  **Install Node.js dependencies**:
    ```bash
    npm install
    ```

3.  **Place the background image**:
    Ensure `mountain-bg.jpg` is located in the `frontend/public/` directory.

4.  **Run the React development server**:
    ```bash
    npm start
    ```
    This will open the application in your web browser, typically at `http://localhost:3000`. Keep this terminal window open.

## 5. Key Features and Logic

-   **Dynamic Sentiment Analysis**: The backend uses `NLTK` with `VaderSentiment` to accurately classify text as positive, negative, or neutral.
-   **Interactive UI**: The frontend provides an intuitive interface for inputting text and receiving instant visual feedback.
-   **Visual Vibe Indicators**:
    -   **Positive**: A large smiling emoji `😊` animates from the left, and the main heading changes to "Positive" with a green color.
    -   **Negative**: A large sad emoji `😞` animates from the right, the main heading changes to "Negative" with a red color, and the background image turns black and white.
    -   **Neutral**: The main heading changes to "Neutral" with a blue color, and the background image's colorfulness is slightly desaturated.
    -   **Initial State**: The app starts with a desaturated background and the title "Sentence Vibe Check".
-   **Engaging Messages**: Instead of raw sentiment scores, the analysis section displays a friendly, descriptive message based on the detected vibe.
-   **Smooth Transitions**: CSS transitions ensure smooth visual changes between different sentiment states.

Enjoy checking the vibe of your sentences! 