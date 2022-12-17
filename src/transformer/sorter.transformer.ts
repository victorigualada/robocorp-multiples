import { Transform, TransformCallback, Writable } from 'stream';
import { binaryInsert } from 'binary-insert';
import { OutputRow } from '../interfaces/output-row';
import { Logger } from '../shared/logger/logger';

export class SorterTransformer extends Transform {
  private data: string[] = [];
  private readonly writeStream: Writable;
  private readonly logger: Logger;

  constructor(writeStream: Writable, logger: Logger) {
    super({ objectMode: true });
    this.writeStream = writeStream;
    this.logger = logger;
  }

  compareMultiples(a: string, b: string): number {
    return a.split(' ').length - b.split(' ').length;
  }

  _transform(outputRow: OutputRow, _encoding: BufferEncoding, callback: TransformCallback): void {
    const { max, multiples } = outputRow;
    const row = `${max}: ${multiples.join(' ')}`;

    this.data = binaryInsert(this.data, row, this.compareMultiples);

    callback();
  }

  _final(callback: (error?: Error | null) => void): void {
    this.logger.info(`Successfully sorted ${this.data.length} rows. Writing to file...`);
    this.data.forEach((row) => {
      this.writeStream.write(row + '\n');
    });
    callback();
  }
}
