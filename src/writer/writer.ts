import { Writable } from 'stream';
import fs, { WriteStream } from 'fs';
import { Logger } from '../shared/logger/logger';

export class Writer extends Writable {
  private readonly stream: WriteStream;
  private readonly logger: Logger;

  constructor(outputFile: string, logger: Logger) {
    super({ objectMode: false });
    this.stream = fs.createWriteStream(outputFile);
    this.logger = logger;
  }

  _write(outputRow: string, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    if (this.stream.write(outputRow, encoding)) {
      callback();
    } else {
      // writer can't take any more data, wait until it's drained
      this.once('drain', callback);
    }
  }

  _final(callback: (error?: Error | null) => void): void {
    this.logger.info('Successfully written output...');
    this.stream.end(callback);
  }
}
