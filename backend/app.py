# Import necessary Flask modules for building the web application.
from flask import Flask, request, jsonify, send_from_directory
# Import CORS to handle cross-origin requests, allowing the frontend to communicate with the backend.
# from flask_cors import CORS
# Import load_dotenv to load environment variables from a .env file.
from dotenv import load_dotenv
# Import os to interact with the operating system, e.g., for environment variables.
import os
# Import SentimentIntensityAnalyzer from NLTK's VADER module for sentiment analysis.
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Load environment variables from the .env file.
load_dotenv()

# Initialize the Flask application.
app = Flask(__name__, static_folder=os.path.abspath('../frontend/build'), template_folder=os.path.abspath('../frontend/build'))
# Enable CORS for all routes, which is crucial for frontend-backend communication.
# CORS(app)

# Initialize VADER sentiment analyzer. This object will be used to calculate sentiment scores.
analyzer = SentimentIntensityAnalyzer()

# Configure OpenAI (no longer needed, but keeping for reference if you switch back)
# openai.api_key = os.getenv('OPENAI_API_KEY')
# client = OpenAI(
#     api_key=os.getenv('OPENAI_API_KEY'),
# )

# This line checks if an OpenAI API key is loaded. It's primarily for debugging and legacy reference.
print("API Key loaded:", "Yes" if os.getenv('OPENAI_API_KEY') else "No")

# Define the API endpoint for analyzing notes.
# This route accepts POST requests.
@app.route('/api/analyze', methods=['POST'])
def analyze_note():
    # Get the JSON data from the request body.
    data = request.json
    # Extract the 'note' field from the received JSON data.
    note = data.get('note')
    
    # If no note is provided, return an error response.
    if not note:
        return jsonify({"error": "No note provided"}), 400
    
    try:
        # Perform sentiment analysis using VADER's polarity_scores method.
        # This returns a dictionary with positive, negative, neutral, and compound scores.
        scores = analyzer.polarity_scores(note)
        # The compound score is a normalized, weighted composite score ranging from -1 (most extreme negative) to +1 (most extreme positive).
        compound_score = scores['compound']

        # Determine the sentiment label based on the compound score.
        sentiment_label = "neutral"
        # If compound score is 0.05 or higher, classify as positive.
        if compound_score >= 0.05: 
            sentiment_label = "pos"
        # If compound score is -0.05 or lower, classify as negative.
        elif compound_score <= -0.05: 
            sentiment_label = "neg"

        # Prepare a descriptive message based on the sentiment label.
        sentiment_message = ""
        if sentiment_label == 'pos':
            sentiment_message = "It is a sentence carrying a positive vibe."
        elif sentiment_label == 'neg':
            sentiment_message = "It is a sentence carrying a negative vibe."
        elif sentiment_label == 'neutral':
            sentiment_message = "It is a sentence carrying a neutral vibe."
        
        # Construct the analysis text to be sent back to the frontend.
        # Includes the sentiment message and detailed VADER scores.
        analysis_text = (
            f"{sentiment_message}\n"
            f"Compound Score (Overall sentiment, -1 to 1): {compound_score:.2f}\n"
            f"Positive: {scores['pos']:.2%}\n"
            f"Negative: {scores['neg']:.2%}\n"
            f"Neutral: {scores['neu']:.2%}"
        )
        
        # Return the analysis text and the sentiment label as a JSON response.
        return jsonify({"analysis": analysis_text, "sentiment_label": sentiment_label})
    
    except Exception as e:
        # Log any unexpected errors that occur during analysis.
        print(f"General Error: {str(e)}")
        # Return an error message to the frontend.
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Serve React App
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# This block ensures the Flask app runs only when the script is executed directly.
if __name__ == '__main__':
    # Run the Flask development server.
    # debug=True enables debugging features (e.g., auto-reloading, debugger).
    # port=5001 sets the server to listen on port 5001.
    app.run(debug=True, port=5001) 