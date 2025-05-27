// importing the components
import app from './app';
import logger from './config/logger';
import { Config } from './config';

// function to start the server
const startServer = () => {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () => {
            logger.error('testing the error');
            logger.info('Server listining on PORT', { port: PORT });
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
};

startServer();
