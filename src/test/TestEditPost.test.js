const { Builder, By, Key } = require('selenium-webdriver');
const { beforeAll, afterAll, test, afterEach } = require('@jest/globals');
jest.setTimeout(100000); // timeout toàn cục

let driver;

beforeAll(async () => {
	driver = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
	await driver.quit();
});


test('Edit post', async () => {
	jest.setTimeout(100000);
	// Navigate to the login page
	await driver.get('http://localhost:3000/login');

	// Find the email and password input fields, and the submit button
	const emailField = await driver.findElement(By.id('credentialId'));
	const passwordField = await driver.findElement(By.id('password'));
	const submitButton = await driver.findElement(By.id('btn--login'));

	// Enter the email and password, and click the submit button
	await emailField.sendKeys('20110614@student.hcmute.edu.vn');
	await passwordField.sendKeys('19052002Chi03!')
	await submitButton.click();
	//dừng 5s để load dữ liệu
	await driver.sleep(5000);

	/// click vào nút đăng bài
	const dangbai = await driver.findElement(By.css('.react-input-emoji--input'));
	dangbai.click();
	dangbai.sendKeys('hello');

	/// click vào nút đăng
	const dang = await driver.findElement(By.css('.shareButton'));
	dang.click();

    /// chờ load xong
    await driver.sleep(2000);

    const edit = await driver.findElement(By.css('.post:nth-child(1) #postTopRight .MuiSvgIcon-root'));

    await edit.click();

    /// chờ load xong
    await driver.sleep(2000);

    const editpost = await driver.findElement(By.css('.ant-typography:nth-child(2)'));
    await editpost.click();
    

    ///// xóa dữ liệu cũ

    const deletepost = await driver.findElement(By.css('.ant-input'));
    await deletepost.click();
    /// xóa dữ liệu
    deletepost.sendKeys(Key.CONTROL, 'a');
    await deletepost.clear();

    /// nhập dữ liệu mới lưu
const newpost = await driver.findElement(By.css('.ant-btn-primary > span'));
await newpost.click();
    
   

    /// nhập dữ liệu không có gì

	/// chờ load xong


	await driver.sleep(5000);
	// chụp màn hình
	await driver.takeScreenshot().then(function (image, err) {
		require('fs').writeFile('EditPost.png', image, 'base64', function (err) {
			console.log(err);
		});
	});
});
