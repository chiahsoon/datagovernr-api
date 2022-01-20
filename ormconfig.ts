import {setupConfig} from './src/config/config';

setupConfig();
export = {
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    // NOTE: Bug: have to include cli.(entity/migration/subscribers) and entity/migration/subscribers
    entities: [
        'src/entity/**/*.ts',
    ],
    migrations: [
        'src/migration/**/*.ts',
    ],
    subscribers: [
        'src/subscriber/**/*.ts',
    ],
    cli: {
        'entitiesDir': 'src/entity',
        'migrationsDir': 'src/migration',
        'subscribersDir': 'src/subscriber',
    },
}

