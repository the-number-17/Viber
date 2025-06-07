import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  Box,
  Alert,
  Grid
} from '@mui/material';
import axios from 'axios';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

// Keyframes for emoji animations: Controls how the emojis slide in from left/right and rotate.
const emojiSlideInLeft = keyframes`
  0% {
    transform: translateX(-100%) translateY(-50%) rotate(0deg); /* Start completely off-screen to the left */
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) translateY(-50%) rotate(360deg); /* End half-visible on-screen, rotated */
    opacity: 1;
  }
`;

const emojiSlideInRight = keyframes`
  0% {
    transform: translateX(100%) translateY(-50%) rotate(0deg); /* Start completely off-screen to the right */
    opacity: 0;
  }
  100% {
    transform: translateX(50%) translateY(-50%) rotate(-360deg); /* End half-visible on-screen, rotated */
    opacity: 1;
  }
`;

// Keyframes for sun animation
const sunRise = keyframes`
  0% {
    bottom: -100px;
    opacity: 0;
  }
  100% {
    bottom: 50px;
    opacity: 1;
  }
`;

// Keyframes for moon animation
const moonAppear = keyframes`
  0% {
    top: -100px;
    opacity: 0;
  }
  100% {
    top: 50px;
    opacity: 1;
  }
`;

// Keyframes for wind animation
const windBlow = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    transform: translateX(0%);
    opacity: 0.5;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Styled component for the main application container. It centers content and manages overflow.
const AppContainer = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* Essential for positioning child elements like emojis and background */
  overflow: hidden; /* Ensures animations don't create scrollbars */
`;

// Styled component for the dynamic background image and its filters.
const BackgroundOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/mountain-bg.jpg'); /* The main background image */
  background-size: cover; /* Ensures the image covers the entire background */
  background-position: center; /* Centers the background image */
  background-repeat: no-repeat;
  transition: filter 0.8s ease-in-out; /* Smooth transition for filter changes */
  z-index: 0; /* Keeps the background behind other content */
  ${props => props.isNegative && `
    filter: grayscale(100%); /* Apply black and white filter for negative sentiment */
  `}
  ${props => props.isNeutral && !props.isNegative && `
    filter: saturate(50%); /* Reduce colorfulness for neutral and initial states */
  `}
`;

// Styled component for the large, animated positive emoji.
const PositiveEmoji = styled(Box)`
  position: absolute;
  top: 50%; /* Center vertically */
  left: 0; /* Align to the left edge */
  width: 60vh; /* Set width to 60% of viewport height for large size */
  height: 60vh; /* Set height to 60% of viewport height */
  animation: ${emojiSlideInLeft} 1s ease-out forwards; /* Apply slide-in animation */
  z-index: 1; /* Above background, below main content */
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Styled component for the large, animated negative emoji.
const NegativeEmoji = styled(Box)`
  position: absolute;
  top: 50%; /* Center vertically */
  right: 0; /* Align to the right edge */
  width: 60vh; /* Set width to 60% of viewport height for large size */
  height: 60vh; /* Set height to 60% of viewport height */
  animation: ${emojiSlideInRight} 1s ease-out forwards; /* Apply slide-in animation */
  z-index: 1; /* Above background, below main content */
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Styled component for 3D main heading.
const Title3D = styled(Typography)`
  font-size: 3.5rem;
  font-weight: 800;
  text-transform: uppercase;
  color: ${props => props.color}; /* Dynamic color based on sentiment */
  text-shadow: 
    2px 2px 0 #000,
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000,
    4px 4px 0 rgba(0,0,0,0.2); /* Creates the 3D effect with black edges */
  transform: perspective(500px) rotateX(10deg); /* Initial 3D rotation */
  transition: all 0.5s ease; /* Smooth transition for transform and color changes */
  margin-bottom: 2rem;
  z-index: 2; /* Ensures title is above background and emojis */
  
  &:hover {
    transform: perspective(500px) rotateX(0deg) scale(1.05); /* Hover effect: flattens and slightly scales */
  }
`;

// Main App component responsible for UI rendering and logic.
function App() {
  // State variables for managing input, analysis results, loading status, errors, and UI themes.
  const [note, setNote] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentimentLabel, setSentimentLabel] = useState('initial'); // 'initial', 'pos', 'neg', 'neutral'
  const [titleColor, setTitleColor] = useState('#2193b0'); // Default title color (blue)
  const [appTitle, setAppTitle] = useState('Sentence Vibe Check'); // Default app title

  // useEffect hook to reset UI state when the note input is cleared.
  useEffect(() => {
    if (!note) {
      setSentimentLabel('initial');
      setTitleColor('#2193b0');
      setAppTitle('Sentence Vibe Check');
      setAnalysis(null); // Clear analysis data
    }
  }, [note]);

  // Parses the raw analysis text from the backend to extract the main message.
  const parseAnalysis = (analysisText) => {
    const lines = analysisText.split('\n');
    const parsed = {};
    // The first line from the backend response is treated as the primary sentiment message.
    parsed.message = lines[0] || 'No analysis message.';
    return parsed;
  };

  // Handles the form submission when the user clicks 'Check Vibe'.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Indicate loading state
    setError(''); // Clear previous errors
    setAnalysis(null); // Clear previous analysis results
    setSentimentLabel('initial'); // Reset sentiment label

    try {
      // Make a POST request to the backend API for sentiment analysis.
      const response = await axios.post('http://localhost:5001/api/analyze', {
        note: note
      });
      
      const fullAnalysisText = response.data.analysis;
      const parsedAnalysis = parseAnalysis(fullAnalysisText);
      setAnalysis(parsedAnalysis);

      const detectedSentiment = response.data.sentiment_label; // Get the sentiment label from backend
      setSentimentLabel(detectedSentiment);

      // Update the title text and color based on the detected sentiment.
      switch (detectedSentiment) {
        case 'pos':
          setTitleColor('#56ab2f'); // Green for positive
          setAppTitle('Positive');
          break;
        case 'neg':
          setTitleColor('#ff416c'); // Red for negative
          setAppTitle('Negative');
          break;
        case 'neutral':
          setTitleColor('#2193b0'); // Blue for neutral
          setAppTitle('Neutral');
          break;
        default:
          setTitleColor('#2193b0');
          setAppTitle('Sentence Vibe Check');
      }

    } catch (error) {
      console.error('Error:', error); // Log error for debugging
      // Display user-friendly error message
      setError(error.response?.data?.error || 'Error analyzing note. Please try again.');
      // Reset UI on error
      setTitleColor('#2193b0');
      setAppTitle('Sentence Vibe Check');
      setSentimentLabel('initial');
      setAnalysis(null);
    }

    setLoading(false); // End loading state
  };

  // Renders a descriptive message based on the current sentiment.
  const renderVibeMessage = () => {
    switch (sentimentLabel) {
      case 'pos':
        return "Keep spreading those good vibes! Your words are radiating joy. 😊";
      case 'neg':
        return "It sounds like you're going through something tough. Remember, it's okay to seek support. You're not alone. 😞";
      case 'neutral':
        return "Your message is balanced and composed. Sometimes neutrality speaks volumes. 🤔";
      default:
        return "Enter a sentence to check its vibe! ✨";
    }
  };

  return (
    <AppContainer>
      <BackgroundOverlay 
        isNegative={sentimentLabel === 'neg'} 
        isNeutral={sentimentLabel === 'neutral' || sentimentLabel === 'initial'} 
      />
      
      {sentimentLabel === 'pos' && (
        <PositiveEmoji>
          <span style={{ fontSize: '20rem' }}>😊</span>
        </PositiveEmoji>
      )}
      
      {sentimentLabel === 'neg' && (
        <NegativeEmoji>
          <span style={{ fontSize: '20rem' }}>😞</span>
        </NegativeEmoji>
      )}

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Title3D color={titleColor}>
            {appTitle}
          </Title3D>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Write your sentence here"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: titleColor,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading || !note.trim()}
                  sx={{
                    backgroundColor: titleColor,
                    '&:hover': {
                      backgroundColor: titleColor,
                      opacity: 0.9,
                    },
                    height: '48px',
                    fontSize: '1.1rem',
                    mt: 2 // Add top margin to separate from TextField, consistent with spacing
                  }}
                >
                  {loading ? 'Analyzing...' : 'Check Vibe'}
                </Button>
              </Grid>
            </Grid>

            {/* Conditionally render the initial descriptive message or the analysis result */}
            {!analysis && (
              <Typography variant="h6" sx={{ mt: 2, textAlign: 'center', color: '#555' }}>
                {renderVibeMessage()}
              </Typography>
            )}

            {analysis && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', textAlign: 'center' }}>
                  {analysis.message}
                </Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </form>
        </Paper>
      </Container>
    </AppContainer>
  );
}

export default App; 
 