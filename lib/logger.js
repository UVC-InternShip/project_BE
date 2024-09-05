import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const projectRoot = process.cwd();
const logDirectory = path.join(projectRoot, 'logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// 콘솔용 포맷: 색상 적용
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  logFormat
);

// 파일용 포맷: 색상 제거
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  logFormat
);

// DailyRotateFile Transport 설정 (파일용 포맷 사용)
const dailyRotateFileTransport = new DailyRotateFile({
  filename: `%DATE%.log`,
  dirname: logDirectory,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: fileFormat, // 파일용 포맷 사용
});

// Logger 설정
const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL || 'debug',
  transports: [
    dailyRotateFileTransport,
    new winston.transports.Console({
      format: consoleFormat, // 콘솔용 포맷 사용
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error',
      format: fileFormat, // 파일용 포맷 사용
    }),
  ],
});

// logger.info('Logger initialized successfully');
// logger.warn('This is a warning');
// logger.debug('This is a debug message');
// logger.http('This is an HTTP log');
// logger.error('This is an error');

export default logger;
