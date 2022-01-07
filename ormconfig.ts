import {setupConfig} from './src/config/config';

setupConfig();
export = {
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    // NOTE: TypeORM has a bug where the entity/migration/subscribers config for server use
    // is always overridden by .env.* file
    cli: {
        'entitiesDir': 'src/entity',
        'migrationsDir': 'src/migration',
        'subscribersDir': 'src/subscriber',
    },
}

