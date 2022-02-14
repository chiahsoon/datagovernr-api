import {createHash} from 'crypto';
import {ProofApi, TimestampApi} from 'originstamp-client-fetch';
import {Timestamper} from '../timestamper';

// Refs:
// https://api.originstamp.com/swagger/swagger-ui.html#/timestamp/createTimestamp
// https://docs.originstamp.com/api/create-timestamp.html#submit-your-hash

const BTC_CURRENCY=1;
const PROOF_AS_PDF=1;

export class OriginStamp implements Timestamper {
    apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    };

    async addTimestamp(data: string): Promise<void> {
        const finalHash = createHash('sha256').update(data).digest('hex');
        const timestampApi = new TimestampApi();
        const resp = await timestampApi.createTimestamp(this.apiKey, {
            hash: finalHash,
            comment: new Date().toISOString(),
            notifications: null,
        });
        console.log('OriginStamp creation response: ', resp);
    };


    async getVerifications(hashes: string[]): Promise<string[]> {
        const proofApi = new ProofApi();
        const reqs = hashes.map((hash) => {
            return {
                proof_type: PROOF_AS_PDF,
                currency: BTC_CURRENCY,
                hash_string: hash,
            };
        });

        const timeStamps = await Promise.all(reqs.map((req) => proofApi.getProof(this.apiKey, req)));
        console.log('OriginStamp verification link retrieval responses: ', timeStamps);
        return timeStamps.map((ts) => ts.errorCode === 0 ? ts.data.download_url : undefined);
    };
}
