import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Добавляем эту строку для эмуляции браузерной среды
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!nanoid)/', // Игнорируем все node_modules, кроме nanoid
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  modulePaths: [compilerOptions.baseUrl || '<rootDir>'],
  
};

export default config;
