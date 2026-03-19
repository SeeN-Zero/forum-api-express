import { afterEach, describe, expect, it, vi } from 'vitest';

describe('config module', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should load dotenv with override in non-test environment', async () => {
    const dotenvConfigMock = vi.fn();
    process.env.NODE_ENV = 'development';

    vi.doMock('dotenv', () => ({
      default: {
        config: dotenvConfigMock,
      },
    }));

    await import('../config.js');

    expect(dotenvConfigMock).toBeCalledWith({ override: true });
  });

  it('should load .env.test when NODE_ENV is test and file exists', async () => {
    const dotenvConfigMock = vi.fn();
    process.env.NODE_ENV = 'test';

    vi.doMock('dotenv', () => ({
      default: {
        config: dotenvConfigMock,
      },
    }));

    await import('../config.js');

    expect(dotenvConfigMock).toBeCalledWith(
      expect.objectContaining({
        path: expect.stringContaining('.env.test'),
        override: true,
      }),
    );
  });

  it('should set app host to 0.0.0.0 in production environment', async () => {
    const dotenvConfigMock = vi.fn();
    process.env.NODE_ENV = 'production';
    process.env.PORT = '5000';

    vi.doMock('dotenv', () => ({
      default: {
        config: dotenvConfigMock,
      },
    }));

    const configModule = await import('../config.js');

    expect(configModule.default.app.host).toEqual('0.0.0.0');
  });
});
