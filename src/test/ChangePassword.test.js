const { Builder, By } = require('selenium-webdriver');
const { beforeAll, afterAll, test } = require('@jest/globals');
jest.setTimeout(100000); // timeout toàn cục

let driver;

beforeAll(async () => {
	driver = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
	await driver.quit();
});

test('Change Avatar Profile Success', async () => {
	jest.setTimeout(100000);
	// Navigate to the login page
	await driver.get('http://localhost:3000/login');

	// Find the email and password input fields, and the submit button
	const emailField = await driver.findElement(By.id('credentialId'));
	const passwordField = await driver.findElement(By.id('password'));
	const submitButton = await driver.findElement(By.id('btn--login'));

	// Enter the email and password, and click the submit button
	await emailField.sendKeys('20110650@student.hcmute.edu.vn');
	await passwordField.sendKeys('roleName@1');
	await submitButton.click();
	//dừng 2s để load dữ liệu
	await driver.sleep(3000);
	const profileImage = await driver.findElement(By.className('topbarImg'));
	await profileImage.click();

	await driver.sleep(3000);
	const changProfileButton = await driver.findElement(By.className('textChinhSua'));
	await changProfileButton.click();
	await driver.sleep(3000);

	//lấy icon--setting thứ 2
	const changePassButton = await driver.findElement(By.id('icon--setting--pwd'));

	await changePassButton.click();
	await driver.sleep(3000);
	const password = await driver.findElement(By.id('info_password'));
	const newPassword = await driver.findElement(By.id('info_newPassword'));
	const confirmPassword = await driver.findElement(By.id('info_confirmPassword'));
	const buttonSubmit = await driver.findElement(By.css('button[type="submit"]'));
	await password.sendKeys('roleName@1');
	await newPassword.sendKeys('Khang2002##');
	await confirmPassword.sendKeys('Khang2002##');
	await buttonSubmit.click();
	// chụp màn hình
	await driver.takeScreenshot().then(function (image, err) {
		require('fs').writeFile('out.png', image, 'base64', function (err) {
			console.log(err);
		});
	});
});
