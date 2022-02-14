import {CronJob} from 'cron';
import {OriginStamp} from '../services/timestamper/originstamp';
import {getTimestampAllFn, getUpdateVerificationLinkFn} from './timestamp';

export const scheduleJobs = () => {
    const timestampService = new OriginStamp(process.env.ORIGINSTAMP_API_KEY);
    const jobs = [
        new CronJob('0 0 0 * * *',
            getTimestampAllFn(timestampService),
            null, false),
        new CronJob('0 0 0 * * *',
            getUpdateVerificationLinkFn(timestampService),
            null, false),
    ];

    jobs.forEach((job) => job.start());
};
