import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from './config/logger';

const app = express();

// in the above code if we use async before the call of the req and res then it won't be catch by the global error handler it will creash the whole development.

app.get('/', async (req, res) => {
    // created for testing the http requests
    // res.status(201).send('welcome to the auth service');
    res.send('welcome to the auth service');
});

// global error handler
// we use for consistent error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
            },
        ],
    });
});

export default app;
