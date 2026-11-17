/* Local browser QA. No external contact requests or deployment commands. */
const { chromium } = require('playwright');
const fs = require('fs');
const assert = require('node:assert/strict');
const out = process.env.QA_OUTPUT || 'bilingual-visual-qa';
fs.mkdirSync(out, {recursive:true});
const pause = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
 const results=[];
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : chromium.executablePath()),args:['--no-sandbox','--enable-unsafe-swiftshader']});
 for(const width of (process.env.QA_WIDTHS || '320,390,768,1440').split(',').map(Number)){
  const context=await browser.newContext({viewport:{width,height:width===1440?1000:844},recordVideo:width===390?{dir:out+'/video',size:{width:390,height:844}}:undefined});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.QA_BASE_URL || 'http://localhost:3000',{waitUntil:'networkidle'});
  await page.waitForTimeout(1600);
  assert.equal(await page.locator('html').getAttribute('lang'),'he');
  for(const lang of ['he','en']){
   if(lang==='en')await page.getByRole('button',{name:'Switch to English'}).locator('visible=true').click();
   await page.waitForTimeout(600);
   assert.equal(await page.locator('html').getAttribute('dir'),lang==='he'?'rtl':'ltr');
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.waitForTimeout(400);
   await page.screenshot({path:`${out}/${width}-${lang}-hero.png`});
   await page.locator('nav').screenshot({path:`${out}/${width}-${lang}-nav.png`});
   // Confirm the entire original emblem fits its vector viewBox.
   const bounds=await page.locator('nav button').first().locator('svg').evaluate(s=>{const g=s.querySelector(':scope > g');const b=g.getBBox();return {x:b.x,y:b.y,w:b.width,h:b.height}});
   assert.ok(bounds.x>=744 && bounds.y>=41 && bounds.x+bounds.w<=1176 && bounds.y+bounds.h<=473,JSON.stringify(bounds));
   if(width<1024){
    await page.getByRole('button',{name:lang==='he'?'פתיחת תפריט ניווט':'Open navigation menu'}).click();
    await page.waitForTimeout(600);
    await page.screenshot({path:`${out}/${width}-${lang}-menu.png`});
    await page.locator('#mobile-navigation-menu').getByRole('button',{name:lang==='he'?'תיק עבודות':'Portfolio',exact:true}).click();
    await page.waitForTimeout(1000);
    assert.equal(await page.locator('#mobile-navigation-menu').count(),0);
   }
   for(const id of ['about','portfolio','skills','contact']){
    const section=page.locator('#'+id);
    const {top,height}=await section.evaluate(el=>({top:el.offsetTop,height:el.offsetHeight}));
    // Actual viewport captures after each entry animation; no hidden-content composites.
    let tile=0;
    for(let y=top;y<top+height;y+=700){
     await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);
     await page.waitForTimeout(900);
     await page.screenshot({path:`${out}/${width}-${lang}-${id}-${tile++}.png`});
    }
   }
   const footer=page.locator('#portfolio-site > section').last();
   await footer.scrollIntoViewIfNeeded();await page.waitForTimeout(800);await page.screenshot({path:`${out}/${width}-${lang}-footer.png`});
   const filter=page.getByRole('group',{name:lang==='he'?'סינון עבודות לפי תחום':'Filter projects by category'});
   await filter.getByRole('button',{name:lang==='he'?'AI ואינטראקטיב':'AI & Interactive',exact:true}).click();
   await page.waitForFunction(()=>document.querySelectorAll("#portfolio [role=button]").length===2);
   assert.equal(await page.locator('#portfolio [role=button]').count(),2);
   await page.locator('#portfolio').screenshot({path:`${out}/${width}-${lang}-interactive-cards.png`});
   for(const project of ['Safe Moments','FIRST SHIFT']){
    const card=page.getByRole('button',{name:new RegExp((lang==='he'?'פתיחת פרויקט':'Open')+'.*'+project)});
    await card.click();await page.waitForTimeout(750);
    const dialog=page.getByRole('dialog');
    await dialog.screenshot({path:`${out}/${width}-${lang}-${project.replace(' ','-')}-modal.png`});
    assert.ok((await dialog.innerText()).includes(lang==='he'?'עצמא':'independent'));
    await dialog.getByRole('link').click();await page.waitForLoadState('networkidle');
    assert.ok(page.url().endsWith(project==='Safe Moments'?'/learning-lab':'/first-shift'));
    await page.goBack({waitUntil:'networkidle'});await page.waitForTimeout(700);
    assert.equal(await page.locator('html').getAttribute('lang'),lang);
    // Full navigation remounts gallery. Restore its filter.
    await filter.getByRole('button',{name:lang==='he'?'AI ואינטראקטיב':'AI & Interactive',exact:true}).click();await page.waitForTimeout(500);
   }
   await filter.getByRole('button',{name:lang==='he'?'הכול':'All',exact:true}).click();await page.waitForTimeout(1000);
   const cards=page.locator('#portfolio [role=button]');assert.equal(await cards.count(),13);
   // Exercise every project's localized details, keyboard opening, trap and close.
   for(let i=0;i<13;i++){
    await cards.nth(i).focus();await page.keyboard.press('Enter');await page.waitForTimeout(600);
    const d=page.getByRole('dialog');assert.ok((await d.innerText()).length>100);
    await d.getByRole('button',{name:lang==='he'?'סגירת פרויקט':'Close project'}).focus();await page.keyboard.press('Shift+Tab');assert.ok(await d.evaluate(el=>el.contains(document.activeElement)));
    await page.keyboard.press('Escape');await page.waitForTimeout(350);
   }
   await page.locator('#name').fill(lang==='he'?'בדיקת ממשק':'Interface test');
   await page.locator('#email').fill('test@example.com');await page.locator('#subject').fill('Local UI test');await page.locator('#message').fill('Local test; no real message is sent.');
   // Mock both API outcomes so no email can leave the browser.
   for(const status of [200,500]){
    await page.route('**/api/contact',route=>route.fulfill({status,contentType:'application/json',body:'{}'}));
    await page.getByRole('button',{name:lang==='he'?'שליחת הודעה':'Send Message',exact:true}).click();await page.waitForTimeout(400);
    assert.ok(await page.locator('#contact').getByRole(status===200?'status':'alert').isVisible());
    if(status===200){await page.locator('#name').fill('Test');await page.locator('#email').fill('test@example.com');await page.locator('#subject').fill('Test');await page.locator('#message').fill('Test')}
   }
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   assert.equal(overflow,false,`${width} ${lang} horizontal overflow`);
   await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(1200);
   assert.equal(await page.locator('html').getAttribute('lang'),lang);
   results.push({width,lang,passed:true,checks:'sections, menus, 13 dialogs, filters, project round trips, keyboard, mocked form outcomes, persistence, emblem bounds, overflow'});
  }
  await page.getByRole('button',{name:'מעבר לעברית'}).locator('visible=true').click();
  assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
  assert.deepEqual(errors,[]);
  await context.close();fs.writeFileSync(out+'/results-'+(process.env.QA_WIDTHS||'all')+'.json',JSON.stringify(results,null,2));console.log('PASS',width);
 }
 // Capture real master at matching widths for the before comparison.
 if(process.env.BASELINE_URL) for(const width of [390,1440]){const page=await browser.newPage({viewport:{width,height:width===1440?1000:844}});await page.goto(process.env.BASELINE_URL,{waitUntil:'networkidle'});await page.waitForTimeout(3500);await page.screenshot({path:`${out}/${width}-before-hero.png`});await page.locator('nav').screenshot({path:`${out}/${width}-before-nav.png`});await page.close()}
 await browser.close();fs.writeFileSync(out+'/results-'+(process.env.QA_WIDTHS||'all')+'.json',JSON.stringify(results,null,2));console.log('ALL PASS');
})().catch(e=>{console.error(e);process.exit(1)});
