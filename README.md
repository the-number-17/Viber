# Note Analysis Application

A full-stack web application that analyzes the sentiment of text input using natural language processing. The application provides a beautiful and interactive user interface with real-time sentiment analysis.

## Project Structure

```
.
├── backend/           # Flask backend server
│   ├── app.py        # Main Flask application
│   ├── requirements.txt
│   └── README.md
├── frontend/         # React frontend application
│   ├── src/         # Source files
│   ├── public/      # Static files
│   ├── package.json
│   └── README.md
└── README.md        # This file
```

## Features

- Real-time sentiment analysis using NLTK's VADER
- Beautiful and responsive UI with animations
- Dynamic background effects based on sentiment
- Emoji reactions
- RESTful API

## Setup

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download NLTK data:
```python
python -c "import nltk; nltk.download('vader_lexicon')"
```

5. Start the backend server:
```bash
python app.py
```

The backend server will run on http://localhost:5001

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will be available at http://localhost:3000

## API Endpoints

### POST /api/analyze
Analyzes the sentiment of a given text.

Request body:
```json
{
    "note": "Your text here"
}
```

Response:
```json
{
    "analysis": "Sentiment analysis results...",
    "sentiment_label": "pos|neg|neutral"
}
```

## Technologies Used

### Backend
- Python
- Flask
- NLTK (VADER)
- Flask-CORS

### Frontend
- React
- Material-UI
- Axios
- Emotion (styled components) 