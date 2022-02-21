import * as dotenv from 'dotenv';

export const setupConfig = () => {
    const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

    try {
        dotenv.config({path: envFile});
        console.log(`Using env file: ${envFile}`);
    } catch (e) {
        console.log(e.message);
    }
};

