declare module 'JSONStreamer' {
    interface JSONStreamerOptions {
        outputFilePath: string;
        beautify?: boolean;
    }

    class JSONStreamer {
        constructor(options: JSONStreamerOptions);

        write(data: object | object[]): void;

        close(): void;
    }

    export = JSONStreamer;
}