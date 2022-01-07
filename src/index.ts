import {setupConfig} from './config/config';
import 'reflect-metadata';
import {createConnection} from 'typeorm';
import express = require('express');
import cors = require('cors');
const morgan = require('morgan');
import V1Routes from './routes/v1/index';
import {CustomErrorHandler} from './middleware/errorHandler';

const corsOptions = {
    // TODO: Change to be more selective
    origin: (_origin: any, callback: any) => {
        return callback(null, true);
    },
    credentials: true,
};

process.env.TZ = 'UTC'; // Process all dates in terms of UTC

setupConfig();
createConnection().then(async (connection) => {
    const port = process.env.port || 5000;
    const app = express();
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(express.json());

    app.use('/api/v1', V1Routes);
    app.use(CustomErrorHandler);
    app.listen(port, () => {
        console.log( `server started at port ${port}` );
    });
}).catch((error) => console.log(error));
