import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Writable, Readable, Transform } from 'stream';
import { InvalidArgumentsException } from './shared/exceptions/invalid-arguments.exception';
import split2 = require('split2');
import { InputTransformer, MultipleCalculatorTransformer, SorterTransformer } from './transformer';
import { Writer } from './writer/writer';
import { Logger } from './shared/logger/logger';

export class Parser {
  // This could be injected through DI in all the classes
  private readonly logger: Logger;
  private inputFile: string;
  private outputFile: string;

  constructor() {
    this.logger = new Logger();
    this.parseArguments();
  }

  private parseArguments(): void {
    const args = process.argv.slice(2);
    if (args.length === 2) {
      try {
        this.inputFile = path.resolve(args[0]);
        this.outputFile = path.resolve(args[1]);
      } catch (error) {
        throw new InvalidArgumentsException();
      }
    } else {
      throw new InvalidArgumentsException('Expected 2 arguments, received ' + args.length);
    }
  }

  public async parse(): Promise<void> {
    const readStream = this.getReadStream();
    const inputTransformer = this.getInputTransformer();
    const multiplesCalculator = this.getMultiplesCalculator();
    const sorter = this.getSorter();
    const writeStream = this.getWriteStream();

    await pipeline(readStream, split2(), inputTransformer, multiplesCalculator, sorter, writeStream);
  }

  private getReadStream(): Readable {
    return fs.createReadStream(this.inputFile);
  }

  private getInputTransformer(): Transform {
    return new InputTransformer(this.logger);
  }

  private getMultiplesCalculator(): Transform {
    return new MultipleCalculatorTransformer(this.logger);
  }

  private getSorter(): Transform {
    return new SorterTransformer(this.getWriteStream(), this.logger);
  }

  private getWriteStream(): Writable {
    return new Writer(this.outputFile, this.logger);
  }

  async run(): Promise<void> {
    try {
      await new Parser().parse();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
