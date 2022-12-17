import { Transform, TransformCallback } from 'stream';
import { InputNumbers } from '../interfaces/input-numbers';
import { OutputRow } from '../interfaces/output-row';
import { Logger } from '../shared/logger/logger';

export class MultipleCalculatorTransformer extends Transform {
  constructor(private readonly logger: Logger) {
    super({ objectMode: true, writableObjectMode: true });
  }

  // Find the multiples of x or y below max
  findMultiples(x: number, y: number, max: number): number[] {
    const multiples = [];

    for (let i = 1; i < max; i++) {
      if (i % x === 0 || i % y === 0) {
        multiples.push(i);
      }
    }

    return multiples;
  }

  async _transform(row: InputNumbers, _enc: BufferEncoding, next: TransformCallback): Promise<void> {
    const { x, y, max } = row;
    const outputRow: Partial<OutputRow> = { max };
    try {
      outputRow.multiples = this.findMultiples(x, y, max);
      this.logger.info(`Found ${outputRow.multiples.length} multiples: ${outputRow.multiples}`);
      next(undefined, outputRow);
    } catch (error) {
      next(error);
    }
  }
}
