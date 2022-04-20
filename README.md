# DataGovernR API

## Dependencies 
* Database - [PostgreSQL](https://www.postgresql.org/)
    * Currently restricted to PostgreSQL due to use of postgres-specific column type
* [OriginStamp API](https://originstamp.com/)

## Development
1. Create a `.env.development` file with the following variables (`TYPEORM_ENTITIES`, `TYPEORM_MIGRATIONS`, `TYPEORM_SUBSCRIBERS` are fixed values included due to weird issues that [typeorm]((https://github.com/typeorm/typeorm)) has with the *dotenv* package):

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
2. Ensure that the database (with the correct details) is running.
3. Run `yarn install` to install dependencies.
4. Run `yarn migrate` to update database structure.
5. Run `yarn start` to run the developmental server.

## Overview
>[Overall Architecture](https://entuedu-my.sharepoint.com/:i:/g/personal/chua0886_e_ntu_edu_sg/EWrtSfNBFGpCm3ezxFG_GGkBsrWB8OTHU11X7u3v9Yc6hA?e=PYDuYD)
### Database
* [ER Diagram](https://entuedu-my.sharepoint.com/:i:/g/personal/chua0886_e_ntu_edu_sg/EVjwVbRM_Q5AsSeK02DWMbcB4-tT4_0wS8qF_7REthJYug?e=dEsJ8C)
### Endpoints
* The API endpoints are documented via Swagger at `/api/v1/docs`.
### Cron Jobs
* To save costs, file hashes will be aggregated and sent to OriginStamp only at the end of each day (customizable in future) via Cron jobs.
    * This 'internal aggregation' is a simple string concatenation of the plaintext and encrypted hash for each file.
    * (Not to be confused with the internal aggregation) OriginStamp does an aggregation too, but using a Merkle Tree instead.
        * OS provides a proof file detailing the Merkle branch and Merkle Root that is actually timestamped onto the blockchains.
* [Aggregation Sequence Diagram](https://entuedu-my.sharepoint.com/:i:/g/personal/chua0886_e_ntu_edu_sg/EZNJ6Ygga65Mn0lvVm5mSA8Bf96VyMpwrM-447gj_zkrZg?e=B7idlZ)
* [Cron Jobs Sequence Diagram](https://entuedu-my.sharepoint.com/:i:/g/personal/chua0886_e_ntu_edu_sg/EdTypC8QV3ZFuHRg1zdDkBgBQBTbHxNIvSeNzx8QdJDVaA?e=k6S3FZ)

