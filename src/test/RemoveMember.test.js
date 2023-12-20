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

	const GroupTitle = await driver.findElement(By.xpath("//span[@class='button-center-title' and text()='Nhóm']"));
	await GroupTitle.click();

	await driver.sleep(2000);

	const parentOfH4 = await driver.findElement(
		By.xpath("//h4[text()='Nhóm do bạn quản lý']/ancestor::div[contains(@class, 'ant-space-item')]")
	);
	// Lấy ra phần tử con đầu tiên của phần tử cha có class là 'ant-list-item'
	const firstAntListItem = await parentOfH4.findElement(By.css('.ant-list-item:first-child'));

	// Thực hiện thao tác nào đó trên phần tử firstAntListItem, ví dụ: click
	await firstAntListItem.click();
	await driver.sleep(3000);
	const buttonQuanLyNhom = await driver.findElement(By.xpath("//p[text()='Quản lý nhóm']"));

	// Thực hiện thao tác nào đó trên buttonQuanLyNhom, ví dụ: click
	await buttonQuanLyNhom.click();
	await driver.sleep(3000);

	// Lấy ra nút (button) có văn bản là "Xem thành viên nhóm"
	const buttonXemThanhVienNhom = await driver.findElement(By.xpath("//div[text()='Xem thành viên nhóm']"));

	// Thực hiện thao tác nào đó trên buttonXemThanhVienNhom, ví dụ: click
	await buttonXemThanhVienNhom.click();
	await driver.sleep(3000);

	const parentLiOfFirstPTag = await driver.findElement(By.xpath("(//p[text()='Thành viên'])[1]/ancestor::li"));

	const buttonWithAriaDescribedBy = await parentLiOfFirstPTag.findElement(
		By.css('button[aria-describedby="simple-popover"]')
	);

	// Thực hiện thao tác nào đó trên buttonWithAriaDescribedBy, ví dụ: click
	await buttonWithAriaDescribedBy.click();
	await driver.sleep(2000);

	const articleXoaKhoiNhom = await driver.findElement(By.xpath("//article[contains(text(), 'Xóa khỏi nhóm')]"));
	const actions = driver.actions();
	await actions.move({ origin: articleXoaKhoiNhom }).click().perform();
	// Thực hiện thao tác nào đó trên articleXoaKhoiNhom, ví dụ: click

	const spanXacNhan = await driver.findElement(By.xpath("//span[text()='Xác nhận']"));

	// Thực hiện thao tác nào đó trên spanXacNhan, ví dụ: click
	await spanXacNhan.click();

	await driver.sleep(3000);
	// chụp màn hình
	await driver.takeScreenshot().then(function (image, err) {
		require('fs').writeFile('RemoveMember.png', image, 'base64', function (err) {
			console.log(err);
		});
	});
});
