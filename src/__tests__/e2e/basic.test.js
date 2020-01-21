const BASE_URL = 'http://localhost:3000';

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
