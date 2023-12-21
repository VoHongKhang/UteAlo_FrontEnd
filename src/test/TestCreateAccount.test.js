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

test('Create password', async () => {
	jest.setTimeout(10000);
	// Navigate to the login page
	await driver.get('http://localhost:3000/login');

	
    const dangkyngay=await driver.findElement(By.css('.ant-form-item:nth-child(6) span'));
	

	// click vào nút đăng ký ngay   
    await dangkyngay.click();
    // click vào nút tiếp tục
	const cotini= await driver.findElement(By.css('.ant-btn-primary > span'));
    await cotini.click();

    //// nhập email
    const email = await driver.findElement(By.id('account_email'));
    email.click();
    await email.sendKeys('20110610@student.hcmute.edu.vn')
    // nhập password
    const password = await driver.findElement(By.id('account_password'));
    password.click();
    await password.sendKeys("19052002Chi03!")   

    //// confirm password
    const confirmPassword = await driver.findElement(By.id('account_confirmPassword'));
    confirmPassword.click();
    await confirmPassword.sendKeys("19052002Chi03!")

    //// tiếp tục
    const next = await driver.findElement(By.css('.ant-btn-primary > span'));
    await next.click();
    await driver.sleep(5000);

    /// nhập tên
    const name = await driver.findElement(By.id('info_fullName'));
    name.click();
    name.sendKeys('Nguyen Thi Chi')
    /// chọn giới tính

    const gender= await driver.findElement(By.css('.ant-radio-wrapper:nth-child(1)'));
    gender.click();

    // const gendermouse= await driver.findElement(By.css('.ant-radio-wrapper:nth-child(1) .ant-radio-input'));
    // gendermouse.
    //

    //sdt
    const phone = await driver.findElement(By.id('info_phone'));
    phone.click();
    phone.sendKeys('0909090909')

    // tên lớp 

    const classs = await driver.findElement(By.id('info_groupName'));
    classs.click();
   await classs.sendKeys('201101C')

    // const classchonse= await driver.findElement(By.css('.ant-form-item-control-input-content > .ant-btn-primary > span'));
    // classchonse.click();


    ///Xác nhận

    /// 
    const confirm = await driver.findElement(By.css('.ant-btn-primary > span'));
    confirm.click();

    await driver.sleep(5000);
	// chụp màn hình
	await driver.takeScreenshot().then(function (image, err) {
		require('fs').writeFile('createPass.png', image, 'base64', function (err) {
			console.log(err);
		});
	});

});
