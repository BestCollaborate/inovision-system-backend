import app from './app';
import socket_server from './socket';
import logger from './config/logger';

let server = app;
server.listen(process.env.PORT, () => {
  logger.info(`Listening to port ${process.env.PORT}`);
});

socket_server.listen(parseInt(process.env.PORT) + 1, () => {
  logger.info(`Socket listening to port ${process.env.PORT + 1}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
