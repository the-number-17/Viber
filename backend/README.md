# Note Analysis Backend

This is the backend service for the Note Analysis application. It provides sentiment analysis functionality using NLTK's VADER sentiment analyzer.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download NLTK data:
```python
python -c "import nltk; nltk.download('vader_lexicon')"
```

## Running the Server

1. Make sure your virtual environment is activated
2. Run the Flask application:
```bash
python app.py
```

The server will start on port 5001. The API endpoint `/api/analyze` accepts POST requests with a JSON body containing a 'note' field.

Example request:
```json
{
    "note": "I am feeling happy today!"
}
```

Example response:
```json
{
    "analysis": "It is a sentence carrying a positive vibe.\nCompound Score (Overall sentiment, -1 to 1): 0.64\nPositive: 60.0%\nNegative: 0.0%\nNeutral: 40.0%",
    "sentiment_label": "pos"
}
``` 