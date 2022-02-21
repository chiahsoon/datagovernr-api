export interface Timestamper {
    addTimestamp: (data: string) => Promise<void>;

    // For verificators that provide a direct link
    getVerificationAsLinks: (data: string[]) => Promise<(string | undefined)[]>

    // For verificators that provide files that we cache;
    getVerificationAsData: (data: string[]) => Promise<(Buffer | undefined)[]>
}
