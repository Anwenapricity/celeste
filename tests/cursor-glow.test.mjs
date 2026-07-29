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
