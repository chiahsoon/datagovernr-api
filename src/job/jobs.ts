import {CronJob} from 'cron';
import {OriginStamp} from '../services/timestamper/originstamp';
import {getTimestampAllFn, getUpdateVerificationLinkFn} from './timestamp';

const API_KEY = process.env.ORIGINSTAMP_API_KEY || '';

export const scheduleJobs = () => {
    const timestampService = new OriginStamp(API_KEY, 2);
    const jobs = [
        new CronJob('0 0 0 * * *',
            getUpdateVerificationLinkFn(timestampService),
            null, false),
        new CronJob('0 0 10 * * *',
            getTimestampAllFn(timestampService),
            null, false),
    ];

    jobs.forEach((job) => job.start());
};
