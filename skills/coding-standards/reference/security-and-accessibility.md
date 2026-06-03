# Security and Accessibility Reference

## 觸發時機

- 建立團隊 standards
- 審查 UI / Node / API code
- 需要把安全與 a11y 寫進 coding conventions

## Security hygiene

- Validate input at the boundary.
- Treat user input as untrusted.
- Keep secrets out of source code.
- Prefer parameterized queries / safe APIs.
- Make async failures explicit.
- Do not hide errors unless there is a clear recovery path.

## Accessibility hygiene

- Use semantic HTML.
- Use the correct interactive elements.
- Keep labels connected to controls.
- Keep focus visible.
- Respect reduced motion.
- Keep touch targets usable.

## Frontend-specific expectations

- Do not ship components with missing hover / focus / disabled / loading / empty / error states.
- Do not use visual effects as a replacement for hierarchy.
- Do not rely on color alone for meaning.

## Review questions

- Is untrusted input validated where it enters the system?
- Are errors handled without hiding failures?
- Can a keyboard-only user complete the flow?
- Does the UI remain understandable without color or motion?
