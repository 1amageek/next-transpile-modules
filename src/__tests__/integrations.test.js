const fs = require('fs');

const matrix = [
  ['npm-basic', './src/__tests__/__apps__/npm-basic', 3500], // name of the test, port
  ['yarn-worspaces', './src/__tests__/__apps__/yarn-workspaces/app', 3501],
  ['webpack-5', './src/__tests__/__apps__/webpack-5', 3502]
];

describe.each(matrix)('%s integration', (name, path, port) => {
  const BASE_URL = `http://localhost:${port}`;

  describe('homepage access', () => {
    test('homepage should be correctly displayed', async () => {
      const page = await browser.newPage();
      const response = await page.goto(`${BASE_URL}/`);

      if (!response) throw new Error('Could not access the page');

      expect(response.status()).toBe(200);

      const content = await page.$eval('h1', (e) => e.textContent);
      expect(content).toBe('Hello World');
    });
  });

  describe('local-module transpilation', () => {
    test('pages using transpiled modules should be correctly displayed', async () => {
      const page = await browser.newPage();
      const response = await page.goto(`${BASE_URL}/test-local-module`);

      if (!response) throw new Error('Could not access the page');

      expect(response.status()).toBe(200);

      const content = await page.$eval('h1', (e) => e.textContent);
      expect(content).toBe('The answer is 42');

      const otherContent = await page.$eval('h2', (e) => e.textContent);
      expect(otherContent).toBe('The answer is not 80');

      const otherOtherContent = await page.$eval('h3', (e) => e.textContent);
      expect(otherOtherContent).toBe('The answer is even less 38');
    });
  });

  describe('local-typescript-module transpilation', () => {
    test('pages using transpiled modules should be correctly displayed', async () => {
      const page = await browser.newPage();
      const response = await page.goto(`${BASE_URL}/test-local-typescript-module`);

      if (!response) throw new Error('Could not access the page');

      expect(response.status()).toBe(200);

      const content = await page.$eval('h1', (e) => e.textContent);
      expect(content).toBe('The answer is 43');
    });
  });

  describe('npm-module transpilation', () => {
    test('pages using transpiled modules should be correctly displayed', async () => {
      const page = await browser.newPage();
      const response = await page.goto(`${BASE_URL}/test-npm-module`);

      if (!response) throw new Error('Could not access the page');

      expect(response.status()).toBe(200);

      const content = await page.$eval('h1', (e) => e.textContent);
      expect(content).toBe('The answer is 44');
    });
  });

  describe('css-module transpilation', () => {
    test('pages using transpiled modules should be correctly displayed', async () => {
      const page = await browser.newPage();
      const response = await page.goto(`${BASE_URL}/test-css-module`);

      if (!response) throw new Error('Could not access the page');

      expect(response.status()).toBe(200);

      const content = await page.$eval('button', (e) => e.textContent);
      expect(content).toBe('Styled button');

      const className = await page.$eval('button', (e) => e.classList[0]);
      expect(className.includes('Button_error__')).toBe(true);
    });
  });

  describe('scss-module transpilation', () => {
    test('pages using transpiled modules should be correctly displayed', async () => {
      const page = await browser.newPage();
      const response = await page.goto(`${BASE_URL}/test-scss-module`);

      if (!response) throw new Error('Could not access the page');

      expect(response.status()).toBe(200);

      const className = await page.$eval('input', (e) => e.classList[0]);
      expect(className.includes('Input_input__')).toBe(true);
    });
  });

  if (name === 'npm-basic') {
    describe('hot reloading', () => {
      test('changes should be applied when adding content to transpiled modules files', async () => {
        const page = await browser.newPage();
        await page.goto(`${BASE_URL}/test-local-typescript-module`);

        const content = await page.$eval('h1', (e) => e.textContent);
        expect(content).toBe('The answer is 43');

        await fs.promises.writeFile(
          `${path}/../_shared-ts/utils/calc.ts`,
          `export const add = (a: number, b: number) => a + b + a + b;\nexport const substract = (a: number, b: number) => a - b;`
        );

        await page.waitFor(4000);

        // await page.waitFor(5000);

        // FIXME: will not work because we run the app in production mode
        const content2 = await page.$eval('h1', (e) => e.textContent);
        expect(content2).toBe('The answer is 86');
      });

      afterAll(async () => {
        await fs.promises.writeFile(
          `${path}/../_shared-ts/utils/calc.ts`,
          `export const add = (a: number, b: number) => a + b;\nexport const substract = (a: number, b: number) => a - b;`
        );
      });
    });
  }
});
