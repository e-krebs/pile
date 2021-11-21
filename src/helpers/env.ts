import * as rawEnv from 'env.json';
const env = rawEnv as unknown as Env;

interface Env {
  pocketKey: string;
}

export const getEnvVar = (key: keyof Env): string => env[key];
