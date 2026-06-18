import { chromium } from 'playwright'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } })
const p = await ctx.newPage()
await p.goto('http://localhost:5174/', { waitUntil: 'networkidle' })
await p.waitForTimeout(2400)
await p.mouse.wheel(0, 120)
await p.waitForTimeout(1500)

// confirm native cursor restored
const cursorState = await p.evaluate(() => ({
  hasCustomCursorClass: document.body.classList.contains('has-custom-cursor'),
  bodyCursor: getComputedStyle(document.body).cursor,
  cursorDotExists: !!document.querySelector('.cursor-dot'),
}))
console.log('CURSOR:', JSON.stringify(cursorState))

// open Brain, catch mid-cascade
await p.locator('.light-point').first().click()
await p.waitForTimeout(360)
await p.screenshot({ path: '/tmp/30-brain-cascade-mid.png' })
await p.waitForTimeout(1400)
await p.screenshot({ path: '/tmp/31-brain-settled.png' })
await p.keyboard.press('Escape')
await p.waitForTimeout(700)

// open Playground, catch mid-cascade of the masonry
await p.locator('.light-point').nth(1).click()
await p.waitForTimeout(420)
await p.screenshot({ path: '/tmp/32-play-cascade-mid.png' })

await b.close()
console.log('done')
