# DataGovernR API

## Dependencies 
* Database - [PostgreSQL](https://www.postgresql.org/)
    * Currently restricted to PostgreSQL due to use of postgres-specific column type
* [OriginStamp API](https://originstamp.com/)

## Development
1. Create a `.env.development` file with the following variables:

| Key      | Value |
| ----------- | ----------- |
| PORT      | [Port to listen to]       |
| TYPEORM_CONNECTION      | postgres       |
| TYPEORM_HOST      | [DB Host URL]       |
| TYPEORM_USERNAME      | [DB username]       |
| TYPEORM_PASSWORD      | [DB password]       |
| TYPEORM_DATABASE      | [DB's database name]       |
| TYPEORM_PORT      | [DB's port]       |
| TYPEORM_ENTITIES      | src/entity/**/*.ts       |
| TYPEORM_MIGRATIONS      | src/migration/**/*.ts       |
| TYPEORM_SUBSCRIBERS      | src/subscriber/**/*.ts       |
| ORIGINSTAMP_API_KEY      | [OriginStamp API key]       |

* Note that `TYPEORM_ENTITIES`, `TYPEORM_MIGRATIONS`, `TYPEORM_SUBSCRIBERS` have fixed values; they are included due to weird issues with the *dotenv* package.
* You can find more information on values for typeorm [here](https://github.com/typeorm/typeorm).

## Overview
### ER Diagram
### Endpoints
* The API endpoints are documented via Swagger at `/api/v1/docs`.
### Cron Jobs

