const { Builder, By, Key } = require('selenium-webdriver');
const { beforeAll, afterAll, test, afterEach } = require('@jest/globals');
const { randomUUID } = require('crypto');
jest.setTimeout(100000); // timeout toàn cục

let driver;

beforeAll(async () => {
	driver = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
	await driver.quit();
});

test('spam post', async () => {
	jest.setTimeout(100000);
	// Navigate to the login page
	await driver.get('http://localhost:3000/login');

	// Find the email and password input fields, and the submit button
	const emailField = await driver.findElement(By.id('credentialId'));
	const passwordField = await driver.findElement(By.id('password'));
	const submitButton = await driver.findElement(By.id('btn--login'));

	// Enter the email and password, and click the submit button
	await emailField.sendKeys('20110614@student.hcmute.edu.vn');
	await passwordField.sendKeys('19052002Chi03!');
	await submitButton.click();
	//dừng 5s để load dữ liệu
	await driver.sleep(5000);

	/// click vào nút đăng bài
	const performAction = async () => {
		const dangbai = await driver.findElement(By.css('.react-input-emoji--input'));
		dangbai.click();
		dangbai.sendKeys('hello');

		const dang = await driver.findElement(By.css('.shareButton'));
		dang.click();

		await driver.sleep(2000);
	};

	const runEvery2Minutes = async () => {
		while (true) {
			await performAction(); // Thực hiện các hành động

			// Chờ 2 phút trước khi lặp lại
			await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));
		}
	};

	runEvery2Minutes();

	// Lặp lại mỗi 1 phút (60000 miligiây)

	/// chờ load xong

	await driver.sleep(5000);
	// chụp màn hình
	await driver.takeScreenshot().then(function (image, err) {
		require('fs').writeFile('spampost.png', image, 'base64', function (err) {
			console.log(err);
		});
	});
});
