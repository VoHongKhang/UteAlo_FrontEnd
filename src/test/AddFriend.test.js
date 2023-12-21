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

test('Remove Friend Success', async () => {
	jest.setTimeout(100000);
	// Navigate to the login page
	await driver.get('http://localhost:3000/login');

	// Find the email and password input fields, and the submit button
	const emailField = await driver.findElement(By.id('credentialId'));
	const passwordField = await driver.findElement(By.id('password'));
	const submitButton = await driver.findElement(By.id('btn--login'));

	// Enter the email and password, and click the submit button
	await emailField.sendKeys('20110281@student.hcmute.edu.vn');
	await passwordField.sendKeys('Khang2002##');
	await submitButton.click();

	await driver.sleep(2000);
	const strongElement = await driver.findElement(
		By.xpath("//span[@class='button-center-title' and contains(text(), 'Bạn bè')]")
	);
	await strongElement.click();
	await driver.sleep(2000);
	const strong = await driver.findElement(
		By.xpath("//span[@class='ant-menu-title-content' and contains(text(), 'Gợi ý kết bạn')]")
	);
	await strong.click();
    await driver.sleep(5000);
	try {
		const linkElement = await driver.findElement(
			By.xpath("//a[@href='/profile/178e2978-5bc8-410a-80bf-b79eb71ffd77']")
		);
		await linkElement.click();
	} catch (error) {
		if (error.name === 'NoSuchAlertError') {
			console.log('Không có cảnh báo xuất hiện.');
			// Thực hiện hành động backup hoặc log lỗi tùy theo trường hợp cụ thể.
		} else if (error.name === 'UnexpectedAlertOpenError') {
			// Xử lý cửa sổ cảnh báo nếu xuất hiện
			try {
				await driver.switchTo().alert().dismiss(); // Hoặc .accept() tùy theo hành động mong muốn.
			} catch (dismissError) {
				console.log('Không thể xử lý cửa sổ cảnh báo.');
				console.error(dismissError);
			}
		} else {
			console.error(error);
		}
	}

	await driver.sleep(5000);

	const buttonWithSpan = await driver.findElement(By.xpath("//button[span[text()='Kết bạn']]"));
	await buttonWithSpan.click();

	await driver.sleep(2000);

	const addButton = await driver.findElement(By.css('div.item--modal[value="Kết bạn"]'));
	await addButton.click();

	await driver.sleep(2000);

});
