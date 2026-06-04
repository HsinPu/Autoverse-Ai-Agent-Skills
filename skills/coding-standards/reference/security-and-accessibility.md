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
- Keep authorization checks close to the operation they protect.
- Avoid logging tokens, credentials, personal data, or full request payloads by default.
- Use allowlists for URLs, file paths, commands, and redirect targets when possible.
- Review dependency additions for maintenance, license, and supply-chain risk.

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

## Security and accessibility in code standards

- Treat auth, permission, data access, file access, network access, and shell execution as boundary code.
- Require explicit tests or review notes for security-sensitive boundary code.
- Require keyboard and screen-reader-friendly states for reusable UI components.
- Prefer platform semantics before custom ARIA or custom interaction logic.

## Review questions

- Is untrusted input validated where it enters the system?
- Are errors handled without hiding failures?
- Can a keyboard-only user complete the flow?
- Does the UI remain understandable without color or motion?
- Can the code fail closed when authorization, validation, or external services fail?
