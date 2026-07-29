# Cursor glow design

## Goal

Add a subtle pointer-following glow that complements the site’s dark purple-blue visual language without changing the browser’s normal cursor or blocking page interactions.

## Approach

- Add one decorative `div` near the end of `body`, with `aria-hidden="true"` and a `cursor-glow` class.
- Style it as a fixed, circular, purple-blue radial gradient with `pointer-events: none`, placed above page content but below any browser UI.
- On fine-pointer devices without a reduced-motion preference, JavaScript will show the glow after the first mouse move and update CSS custom properties with the pointer coordinates through `requestAnimationFrame`.
- Hide the glow when the pointer leaves the document window.

## Accessibility and compatibility

- The native cursor remains visible.
- The glow is disabled by CSS for coarse pointers and for `prefers-reduced-motion: reduce`.
- It is decorative only and excluded from the accessibility tree.

## Verification

- Add an automated source-level test confirming the required markup, non-interactive styling, and reduced-motion/coarse-pointer safeguards.
- Run the project’s test suite and visually open the page to confirm that links, buttons, and form controls remain usable.
