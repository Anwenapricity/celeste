# Cursor Glow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible, non-interactive purple-blue glow that follows a mouse pointer on the portfolio page.

**Architecture:** `code.html` owns the decorative glow node, `css/style.css` owns its display and accessibility media-query safeguards, and `js/main.js` updates the node’s CSS custom properties only on fine-pointer devices. A Node built-in test will assert the required source contracts so the feature’s markup and safeguards cannot be accidentally removed.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Keep the browser’s native cursor visible and unchanged.
- The glow must never intercept pointer input.
- Disable the glow for `prefers-reduced-motion: reduce` and `(pointer: coarse)`.
- Do not add third-party dependencies.

---

### Task 1: Define and verify the cursor-glow source contract

**Files:**
- Create: `tests/cursor-glow.test.mjs`
- Modify: `code.html`
- Modify: `css/style.css`
- Modify: `js/main.js`

**Interfaces:**
- Consumes: `code.html`, `css/style.css`, and `js/main.js` as UTF-8 source files.
- Produces: `node --test tests/cursor-glow.test.mjs` validates that all required cursor-glow contracts exist.

- [ ] **Step 1: Write the failing test**

Create `tests/cursor-glow.test.mjs` with assertions for the decorative node, CSS safety rules, CSS accessibility safeguards, and JavaScript’s frame-batched pointer updates:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../code.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');

test('defines an accessible, non-interactive cursor glow', () => {
    assert.match(html, /class="cursor-glow" aria-hidden="true"/);
    assert.match(css, /\.cursor-glow\s*\{[\s\S]*?pointer-events:\s*none;/);
    assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.cursor-glow/);
    assert.match(css, /@media\s*\(pointer:\s*coarse\)[\s\S]*?\.cursor-glow/);
});

test('updates the glow through requestAnimationFrame on fine pointers', () => {
    assert.match(js, /matchMedia\('\(pointer: fine\)'\)/);
    assert.match(js, /requestAnimationFrame/);
    assert.match(js, /--cursor-x/);
    assert.match(js, /--cursor-y/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/cursor-glow.test.mjs`

Expected: FAIL because `cursor-glow` markup, styles, and pointer-update logic do not yet exist.

- [ ] **Step 3: Implement the minimal cursor glow**

Add this node immediately before the script tag in `code.html`:

```html
<div class="cursor-glow" aria-hidden="true"></div>
```

Add these rules near the existing animation styles in `css/style.css`:

```css
.cursor-glow {
    --cursor-x: -100px;
    --cursor-y: -100px;
    position: fixed;
    top: 0;
    left: 0;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transform: translate(calc(var(--cursor-x) - 50%), calc(var(--cursor-y) - 50%));
    background: radial-gradient(circle, rgba(108, 99, 255, 0.26) 0%, rgba(108, 99, 255, 0.1) 38%, transparent 70%);
    filter: blur(4px);
    transition: opacity 180ms ease;
    z-index: 999;
}

.cursor-glow.is-visible {
    opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
    .cursor-glow { display: none; }
}

@media (pointer: coarse) {
    .cursor-glow { display: none; }
}
```

Append this script to `js/main.js`:

```js
const cursorGlow = document.querySelector('.cursor-glow');
const supportsCursorGlow = window.matchMedia('(pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (cursorGlow && supportsCursorGlow) {
    let pointerX = -100;
    let pointerY = -100;
    let frameId;

    window.addEventListener('pointermove', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        cursorGlow.classList.add('is-visible');

        if (!frameId) {
            frameId = window.requestAnimationFrame(() => {
                cursorGlow.style.setProperty('--cursor-x', `${pointerX}px`);
                cursorGlow.style.setProperty('--cursor-y', `${pointerY}px`);
                frameId = undefined;
            });
        }
    });

    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('is-visible'));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/cursor-glow.test.mjs`

Expected: PASS with two passing tests and zero failures.

- [ ] **Step 5: Perform a browser smoke test**

Open `code.html` in a desktop browser, move the mouse over the page, then click a navigation link, a button, and an input. Confirm the glow follows the pointer without blocking interaction; emulate a coarse pointer and reduced-motion preference to confirm it is hidden.

- [ ] **Step 6: Commit**

```bash
git add code.html css/style.css js/main.js tests/cursor-glow.test.mjs
git commit -m "feat: add cursor glow effect"
```
