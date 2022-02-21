import {createHash} from 'crypto';
import {ProofApi, TimestampApi} from 'originstamp-client-fetch';
import {Timestamper} from '../timestamper';
import fetch from 'node-fetch';

// Refs:
// https://api.originstamp.com/swagger/swagger-ui.html#/timestamp/createTimestamp
// https://docs.originstamp.com/api/create-timestamp.html#submit-your-hash

export enum BlockchainCurrency {
    BTC, ETH, AION
}
const PROOF_AS_PDF=1;

export class OriginStamp implements Timestamper {
    apiKey: string;
    currency: BlockchainCurrency;

    constructor(apiKey: string, currency: BlockchainCurrency) {
        this.apiKey = apiKey;
        this.currency = currency;
    };

    async addTimestamp(data: string): Promise<void> {
        const finalHash = createHash('sha256').update(data).digest('hex');
        const timestampApi = new TimestampApi();
        const resp = await timestampApi.createTimestamp(this.apiKey, {
            hash: finalHash,
            comment: new Date().toISOString(),
            notifications: undefined,
        });
        console.log('OriginStamp creation response: ', resp);
        console.log('OriginStamp creation response timestamps: ', resp.data != null ? resp.data.timestamps : []);
    };


    async getVerificationAsLinks(data: string[]): Promise<(string | undefined)[]> {
        throw Error('OriginStamp is unable to retrieve verification as links');
    };

    async getVerificationAsData(data: string[]): Promise<(Buffer | undefined)[]> {
        const hashes = data.map((d) => createHash('sha256').update(d).digest('hex'));
        const proofApi = new ProofApi();
        const reqs = hashes.map((hash) => {
            return {
                proof_type: PROOF_AS_PDF,
                currency: this.currency,
                hash_string: hash,
            };
        });

        // Get download links from OriginStamp
        const getLinks = reqs.map((req) => proofApi.getProof(this.apiKey, req));
        const getLinksResps = await Promise.allSettled(getLinks);
        const getLinksRespsSettled = getLinksResps.map((r) => r.status === 'rejected' ? undefined : r.value);
        const urls = getLinksRespsSettled.map((ts) => {
            return (ts == null || ts.data == null) ? undefined : ts.data.download_url;
        });
        console.log('OriginStamp verification data retrieval responses: ', getLinksRespsSettled);

        // Download data from download links
        const downloadedData = urls.map((url) => {
            return url == null ? undefined : fetch(url, {
                headers: {'Accept': 'image/apng,*/*;'},
            });
        });
        const downloadedDataResps = await Promise.allSettled(downloadedData);
        const downloadedDataRespsSettled = downloadedDataResps.map((r) => {
            return (r == null || r.status === 'rejected') ? undefined : r.value;
        });

        // Convert data to ArrayBuffer -> Buffer
        const toArrBufs = downloadedDataRespsSettled.map((r) => {
            return r == null ? undefined : r.arrayBuffer();
        });
        const arrBufs = await Promise.allSettled(toArrBufs);
        const arrBufsSettled = arrBufs.map((r) => {
            return (r == null || r.status === 'rejected') ? undefined : r.value;
        });
        return arrBufsSettled.map((ab) => ab == null ? undefined : Buffer.from(ab));
    };
}
