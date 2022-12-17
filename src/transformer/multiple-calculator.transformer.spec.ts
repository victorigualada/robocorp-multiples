import { Logger } from '../shared/logger/logger';
import { MultipleCalculatorTransformer } from './multiple-calculator.transformer';

describe('MultipleCalculator test', () => {
  let calculator: MultipleCalculatorTransformer;
  const logger = new Logger();
  let loggerSpy: jest.SpyInstance;

  beforeAll(() => {
    calculator = new MultipleCalculatorTransformer(logger);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    loggerSpy = jest.spyOn(logger, 'info').mockImplementation(() => {});
  });

  afterAll(() => {
    loggerSpy.mockRestore();
  });

  it('should return expected multiples for x=2, y=7 and max=26', () => {
    const expectedMultiples = [2, 4, 6, 7, 8, 10, 12, 14, 16, 18, 20, 21, 22, 24];
    const actualMultiples = calculator.findMultiples(2, 7, 26);
    expect(actualMultiples).toEqual(expectedMultiples);
  });

  it('should return expected multiples for x=5, y=8 and max=31', () => {
    const expectedMultiples = [5, 8, 10, 15, 16, 20, 24, 25, 30];
    const actualMultiples = calculator.findMultiples(5, 8, 31);
    expect(actualMultiples).toEqual(expectedMultiples);
  });
});
