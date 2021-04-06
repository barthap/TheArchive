import env from '../env';

describe('env util module', () => {
  const originalEnv = process.env;
  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return environment variable', () => {
    process.env.TEST1 = 'test1';
    expect(env('TEST1')).toBe('test1');
  });

  it('should return default if env is undefined', () => {
    expect(env('TEST2', { defaultValue: 'test2' })).toBe('test2');
  });

  it('should throw if env and default are undefined', () => {
    expect(() => env('TEST3')).toThrowError('$TEST3 env var must be defined!');
  });

  it('should do the transform if provided', () => {
    const transform = jest.fn().mockReturnValue(3);
    process.env.TEST4 = 'abc';

    const result = env('TEST4', { transform });

    expect(transform).toHaveBeenCalledWith('abc');
    expect(result).toBe(3);
  });

  it('works with transform being a type constructor', () => {
    process.env.TEST5 = '1245';
    expect(env('TEST5', { transform: Number })).toStrictEqual(1245);
  });
});
