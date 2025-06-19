import { writeFileSync, appendFileSync, existsSync } from 'fs';
import { join } from 'path';

class Logger {
  constructor() {
    this.logDir = './logs';
    this.errorLogFile = join(this.logDir, 'errors.log');
    this.infoLogFile = join(this.logDir, 'info.log');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!existsSync(this.logDir)) {
      try {
        writeFileSync(this.logDir, '');
      } catch (error) {
        console.error('Failed to create log directory:', error);
      }
    }
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      logMessage += ` | Data: ${JSON.stringify(data)}`;
    }
    
    return logMessage;
  }

  writeToFile(filePath, message) {
    try {
      appendFileSync(filePath, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message, data = null) {
    const logMessage = this.formatMessage('INFO', message, data);
    console.log(logMessage);
    this.writeToFile(this.infoLogFile, logMessage);
  }

  error(message, error = null, data = null) {
    const logMessage = this.formatMessage('ERROR', message, data);
    console.error(logMessage);
    
    if (error) {
      console.error('Stack trace:', error.stack);
      this.writeToFile(this.errorLogFile, `${logMessage}\nStack: ${error.stack}`);
    } else {
      this.writeToFile(this.errorLogFile, logMessage);
    }
  }

  warn(message, data = null) {
    const logMessage = this.formatMessage('WARN', message, data);
    console.warn(logMessage);
    this.writeToFile(this.infoLogFile, logMessage);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = this.formatMessage('DEBUG', message, data);
      console.debug(logMessage);
      this.writeToFile(this.infoLogFile, logMessage);
    }
  }
}

export const logger = new Logger(); 