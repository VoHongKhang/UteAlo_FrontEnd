const { Builder, By, until } = require('selenium-webdriver');
const { beforeAll, afterAll, test } = require('@jest/globals');
jest.setTimeout(100000); // timeout toàn cục

let driver;

beforeAll(async () => {
	driver = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
	await driver.quit();
});

test('UnLikePost', async () => {
	jest.setTimeout(100000);
	// Navigate to the login page
	await driver.get('http://localhost:3000/login');

	// Find the email and password input fields, and the submit button
	const emailField = await driver.findElement(By.id('credentialId'));
	const passwordField = await driver.findElement(By.id('password'));
	const submitButton = await driver.findElement(By.id('btn--login'));

	// Enter the email and password, and click the submit button
	await emailField.sendKeys('20110609@student.hcmute.edu.vn');
	await passwordField.sendKeys('&Anh181102');
	await submitButton.click();

	await driver.sleep(2000);
  // tìm và click vào trang cá nhân
	const strongElement = await driver.findElement(
		By.xpath("//a[@href='/profile/178e2978-5bc8-410a-80bf-b79eb71ffd77']")
	);
	await strongElement.click();

	await driver.sleep(2000);

  // nhập bài viết vào ô input và nhấn share
  const element = await driver.findElement(By.css('.react-emoji:nth-child(2) .react-input-emoji--input'));
  await driver.executeScript("if(arguments[0].contentEditable === 'true') {arguments[0].innerText = 'ducanh'}", element);
  await driver.findElement(By.css('.shareButton')).click();
  await driver.sleep(2000);

  // tìm và click vào nút like

  const likeButton = await driver.findElement(By.css('.post:nth-child(1) .likeIcon'));
  await likeButton.click();

  await driver.sleep(2000);

  // hủy like bài viết
  const unlikeButton = await driver.findElement(By.css('.post:nth-child(1) .likeIcon'));
  await unlikeButton.click();

  await driver.sleep(2000);

});