import puppeteer from 'puppeteer';

(async () => {
  console.log("Starting Puppeteer...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log("Loading page...");
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);

  // Click the broker portal button (Admin Desk / Broker Portal)
  console.log("Clicking broker portal...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const brokerBtn = buttons.find(b => b.textContent.includes('Broker') || b.textContent.includes('Admin'));
    if(brokerBtn) brokerBtn.click();
  });
  
  await page.waitForTimeout(1000);
  
  // Enter PIN 4040
  console.log("Entering PIN...");
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    if(inputs.length > 0) {
      inputs[0].value = '4040';
      const event = new Event('input', { bubbles: true });
      inputs[0].dispatchEvent(event);
      
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtn = buttons.find(b => b.textContent.includes('Verify'));
      if(verifyBtn) verifyBtn.click();
    }
  });

  await page.waitForTimeout(2000);

  // Click 'Properties' tab in Dashboard
  console.log("Clicking Properties tab...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const propBtn = buttons.find(b => b.textContent.trim() === 'Properties');
    if(propBtn) propBtn.click();
  });
  
  await page.waitForTimeout(1000);

  // Click 'Add Custom Brochure'
  console.log("Clicking Add Custom Brochure...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const addBtn = buttons.find(b => b.textContent.includes('Add Custom Brochure'));
    if(addBtn) addBtn.click();
  });

  await page.waitForTimeout(1000);

  // Fill out the form
  console.log("Filling form...");
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => {
      if(input.placeholder.includes('e.g. OBEROI')) input.value = 'Test Property';
      if(input.placeholder.includes('e.g. Bandra')) input.value = 'Test Area';
      if(input.type === 'url') input.value = 'https://example.com/test.pdf';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  await page.waitForTimeout(1000);

  // Click submit
  console.log("Submitting form...");
  await page.evaluate(() => {
    const form = document.querySelector('form');
    if(form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if(submitBtn) submitBtn.click();
    }
  });

  await page.waitForTimeout(3000);

  console.log("Closing browser.");
  await browser.close();
})();
