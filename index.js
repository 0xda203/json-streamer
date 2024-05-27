const { createWriteStream } = require('fs');

/**
 * @typedef {Object} JSONStreamerOptions
 * @property {string} [outputFilePath] - Path to the output file. Optional if outputStream is provided.
 * @property {Writable} [outputStream] - Writable stream to write JSON data to. Optional if outputFilePath is provided.
 * @property {boolean} [beautify] - Whether to beautify the JSON output. Default is false.
 */

/**
 * JSONStreamer is a class for streaming JSON data to a file or writable stream.
 */
class JSONStreamer {
    /**
     * Constructs a JSONStreamer instance.
     * @param {JSONStreamerOptions} options - Configuration options for the JSONStreamer.
     */
    constructor({ outputFilePath, outputStream, beautify = false }) {
        if (outputStream) {
            // Use the provided writable stream if available.
            this._outputStream = outputStream;
        } else if (outputFilePath) {
            // Create a writable stream from the provided file path.
            this._outputFilePath = outputFilePath;
            this._outputStream = createWriteStream(this._outputFilePath);
        } else {
            // Throw an error if neither outputFilePath nor outputStream is provided.
            throw new Error('Either outputFilePath or outputStream must be provided');
        }
        this._first = true; // Flag to indicate the first write operation.
        this._beautify = beautify; // Flag to indicate whether to beautify JSON output.
    }

    /**
     * Writes JSON data to the output stream. Accepts either a single object or an array of objects.
     * @param {object | object[]} data - JSON data to write.
     */
    write(data) {
        if (Array.isArray(data)) {
            // Write each object in the array separately.
            for (let i = 0; i < data.length; i++) {
                this._writeObject(data[i]);
            }
        } else {
            // Write the single object.
            this._writeObject(data);
        }
    }

    /**
     * Writes a single JSON object to the output stream.
     * @param {object} object - The JSON object to write.
     * @private
     */
    _writeObject(object) {
        let jsonChunk;
        try {
            if (this._beautify) {
                // Beautify the JSON output with additional tab for attributes.
                const lines = JSON.stringify(object, null, "\t").split('\n');
                const beautifiedLines = lines.map((line, index) => {
                    if (index === 0) {
                        return line;
                    }
                    return '\t' + line;
                });
                jsonChunk = beautifiedLines.join('\n');
            } else {
                // Convert the object to a JSON string.
                jsonChunk = JSON.stringify(object);
            }

            // Determine the chunk to write, adding commas and newlines as necessary.
            const chunk = (this._first ? '[' + (this._beautify ? '\n\t' : '') : ',' + (this._beautify ? '\n\t' : '')) + jsonChunk;
            this._first = false; // Clear the first-write flag.

            // Write the chunk to the output stream, handling backpressure if necessary.
            if (!this._outputStream.write(chunk)) {
                this._outputStream.once('drain', () => this._writeObject(object));
            }
        } catch (err) {
            // Throw an error if JSON conversion or writing fails.
            throw new Error('Failed to write JSON object: ' + err.message);
        }
    }

    /**
     * Closes the output stream, ensuring the JSON array is properly closed.
     */
    close() {
        if (!this._first) {
            // Write the closing bracket for the JSON array.
            if (this._beautify) {
                this._outputStream.write('\n]');
            } else {
                this._outputStream.write(']');
            }
        } else {
            // Write an empty JSON array if no objects were written.
            this._outputStream.write('[]');
        }
        this._outputStream.end(); // End the writable stream.
    }
}

module.exports = JSONStreamer;
module.exports.default = JSONStreamer;
