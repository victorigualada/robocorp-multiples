import { Exception } from './exception';

export class InvalidArgumentsException extends Exception {
  constructor(message?: string) {
    super('Invalid arguments. Please provide a valid input file and an output file. ' + message);
  }
}
