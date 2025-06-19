// Simple console logger for Railway deployment
const formatMessage = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (data) {
    logMessage += ` | Data: ${JSON.stringify(data)}`;
  }
  
  return logMessage;
};

export const logger = {
  info(message, data = null) {
    console.log(formatMessage('INFO', message, data));
  },

  error(message, error = null, data = null) {
    console.error(formatMessage('ERROR', message, data));
    
    if (error) {
      console.error('Stack trace:', error.stack);
    }
  },

  warn(message, data = null) {
    console.warn(formatMessage('WARN', message, data));
  },

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('DEBUG', message, data));
    }
  }
}; 