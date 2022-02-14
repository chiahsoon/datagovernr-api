import {Timestamper} from '../timestamper';

export class MockStamp implements Timestamper {
    apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    };

    async addTimestamp(data: string): Promise<void> {
        console.log('MockStamp has added timestamp for: ', data);
    };


    async getVerifications(hashes: string[]): Promise<string[]> {
        console.log('MockStamp has updated verification links for: ', hashes);
        const link = 'https://datagovernr.com';
        return hashes.map((h) => link);
    };
}
