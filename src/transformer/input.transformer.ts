import { Transform, TransformCallback } from 'stream';
import { InputNumbers } from '../interfaces/input-numbers';
import { Logger } from '../shared/logger/logger';

export class InputTransformer extends Transform {
  constructor(private readonly logger: Logger) {
    super({ objectMode: true });
  }

  async _transform(row: string, _enc: BufferEncoding, next: TransformCallback): Promise<void> {
    try {
      const [x, y, max] = row.toString().split(' ');
      const inputRow: InputNumbers = { x: Number(x), y: Number(y), max: Number(max) };
      this.logger.info(`Parsing input row for x: ${x}, y: ${y} and max: ${max}`);
      next(undefined, inputRow);
    } catch (error) {
      next(error);
    }
  }
}
