/* eslint-env jest */

const path = require('path');
const rewire = require('rewire');
const anymatch = require('anymatch');

const withTmRewire = rewire('../index');

const generateIncludes = withTmRewire.__get__('generateIncludes');
const generateExcludes = withTmRewire.__get__('generateExcludes');
const regexEqual = withTmRewire.__get__('regexEqual');

const modules = ['shared', 'and-another'];

describe('generateIncludes', () => {
  const includes = generateIncludes(modules);

  test('should match transpiledModules direct paths', () => {
    expect(anymatch(includes, 'node_modules/shared')).toBe(true);
    expect(anymatch(includes, 'node_modules/shared')).toBe(true);
    expect(anymatch(includes, path.resolve('node_modules/and-another'))).toBe(true);
    expect(anymatch(includes, path.resolve('node_modules/and-another'))).toBe(true);
  });

  test('should match transpiledModules parent paths (e.g. with Yarn workspaces)', () => {
    expect(anymatch(includes, '../../node_modules/shared')).toBe(true);
    expect(anymatch(includes, '../../node_modules/and-another')).toBe(true);
  });

  test('should not match unreferenced modules', () => {
    expect(anymatch(includes, '../../node_modules/something-else')).toBe(false);
    expect(anymatch(includes, 'node_modules/and-yet-another')).toBe(false);
  });
});

describe('generateExcludes', () => {
  const excludes = generateExcludes(modules);

  test('should NOT match transpiledModules direct paths', () => {
    expect(anymatch(excludes, 'node_modules/shared')).toBe(false);
    expect(anymatch(excludes, 'node_modules/and-another')).toBe(false);
  });

  test('should NOT match transpiledModules parent paths (e.g. with Yarn workspaces)', () => {
    expect(anymatch(excludes, '../../node_modules/shared')).toBe(false);
    expect(anymatch(excludes, '../../node_modules/and-another')).toBe(false);
  });

  test('SHOULD match unreferenced modules', () => {
    expect(anymatch(excludes, '../../node_modules/something-else')).toBe(true);
    expect(anymatch(excludes, 'node_modules/and-yet-another')).toBe(true);
  });
});

describe('regexEqual', () => {
  // Cannot test because of Jest https://github.com/facebook/jest/issues/2549
  // test('should return true if two regexps are similar', () => {
  //   expect(regexEqual(/a/, /a/)).toBe(true);
  //   expect(regexEqual(/a/gi, /a/ig)).toBe(true);
  // });

  test('should return false if two regexps are different', () => {
    expect(regexEqual(/a/, /[\\/]a[\\/]/)).toBe(false);
  });
});
