const { Builder, By } = require('selenium-webdriver');
const { beforeAll, afterAll, test } = require('@jest/globals');
const { until } = require('selenium-webdriver');
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
	await driver.sleep(5000);
	const moreComment = await driver.findElement(By.className('handleToggleCommentOptions'));
	await moreComment.click();

	await driver.sleep(3000);
	const buttonDeleleCmt = await driver.findElement(By.className('postCommentTextDelete'));
	await buttonDeleleCmt.click();
	await driver.sleep(3000);

	//lấy icon--setting thứ 2
	const configButton = await driver.findElement(By.xpath('//button[span[text()="Đồng ý"]]'));

	await configButton.click();
	await driver.sleep(5000);
	// chụp màn hình
	await driver.takeScreenshot().then(function (image, err) {
		require('fs').writeFile('RemoveCmt.png', image, 'base64', function (err) {
			console.log(err);
		});
	});
});
