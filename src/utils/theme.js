// Theme utility for FluentQuest
// Provides styling and color utilities based on country of origin

// Default theme colors
export const defaultTheme = {
  primary: '#4A6FA5',
  secondary: '#FFB347',
  background: '#F5F5F5',
  text: '#333333',
  card: '#FFFFFF',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
};

/**
 * Get a theme based on country colors
 * @param {Array} countryColors - Array of colors representing a country
 * @returns {Object} Theme object with primary and secondary colors
 */
export const getCountryTheme = (countryColors = []) => {
  if (!countryColors || countryColors.length === 0) {
    return defaultTheme;
  }

  // Use the first color as primary and second as secondary if available
  const theme = {
    ...defaultTheme,
    primary: countryColors[0] || defaultTheme.primary,
    secondary: countryColors[1] || defaultTheme.secondary,
  };

  // Create a gradient string for backgrounds
  theme.gradient = countryColors.length > 1 
    ? `linear-gradient(135deg, ${countryColors.join(', ')})`
    : `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;

  return theme;
};

/**
 * Get text color that ensures readability on a given background color
 * @param {string} backgroundColor - Hex color code
 * @returns {Object} Text color and text shadow style for optimal visibility
 */
export const getReadableTextColor = (backgroundColor) => {
  // Remove the hash if it exists
  const hex = backgroundColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Calculate contrast ratio (WCAG formula)
  // For better accessibility, we use a more strict threshold
  const contrastThreshold = 150;
  
  // Determine text color based on background brightness
  const textColor = brightness > contrastThreshold ? '#000000' : '#FFFFFF';
  
  // Add text shadow for better visibility in all cases
  // This ensures text is visible even on problematic backgrounds like white on light blue
  const textShadowColor = textColor === '#FFFFFF' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)';
  const textShadowStyle = {
    textShadowColor: textShadowColor,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  };
  
  return { color: textColor, style: textShadowStyle };
};


// Common styles used throughout the app
export const commonStyles = {
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginVertical: 10,
  },
};