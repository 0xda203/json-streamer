# JSONStreamer

JSONStreamer is a Node.js library for streaming JSON data to a file or writable stream. It supports both beautified and compact JSON formats and can be used with both CommonJS (`require`) and ES6 modules (`import`). Additionally, it includes TypeScript type definitions for improved developer experience.

## Installation

You can install the library using npm:

```bash
npm install @0xda203/json-streamer
```

# Usage

## CommonJS
```javascript
const JSONStreamer = require('json-streamer');

// Using an output file path
const jsonStreamer = new JSONStreamer({ outputFilePath: 'output.json', beautify: true });

// Using a writable stream
const { createWriteStream } = require('fs');
const outputStream = createWriteStream('output.json');
const jsonStreamerStream = new JSONStreamer({ outputStream, beautify: true });

jsonStreamer.write({ key: 'value' });
jsonStreamer.write([{ key: 'value1' }, { key: 'value2' }]);
jsonStreamer.close();
```

## ES6
```javascript
import JSONStreamer from 'json-streamer';

// Using an output file path
const jsonStreamer = new JSONStreamer({ outputFilePath: 'output.json', beautify: true });

// Using a writable stream
import { createWriteStream } from 'fs';
const outputStream = createWriteStream('output.json');
const jsonStreamerStream = new JSONStreamer({ outputStream, beautify: true });

jsonStreamer.write({ key: 'value' });
jsonStreamer.write([{ key: 'value1' }, { key: 'value2' }]);
jsonStreamer.close();
```

## TypeScript
```typescript
import JSONStreamer from 'json-streamer';
import { createWriteStream } from 'fs';

// Using an output file path
const jsonStreamer = new JSONStreamer({ outputFilePath: 'output.json', beautify: true });

// Using a writable stream
const outputStream = createWriteStream('output.json');
const jsonStreamerStream = new JSONStreamer({ outputStream, beautify: true });

jsonStreamer.write({ key: 'value' });
jsonStreamer.write([{ key: 'value1' }, { key: 'value2' }]);
jsonStreamer.close();
```

## API
JSONStreamer has the following constructor options:
- constructor(options: JSONStreamerOptions)
    - options.outputFilePath (string, optional): Path to the output file. Optional if outputStream is provided.
    - options.outputStream (Writable, optional): Writable stream to write JSON data to. Optional if outputFilePath is provided.
    - options.beautify (boolean, optional): Whether to beautify the JSON output. Default is false.
- write(data: object | object[])
Writes JSON data to the output stream. Accepts either a single object or an array of objects.
- close()
Closes the output stream. Must be called to ensure the JSON array is properly closed.