# Release checklist

## Automated gates

- [x] `npm run build` — TypeScript check and Vite production build pass.
- [x] `npm test` — all 34 unit tests pass, including content validation and v1
  save migration.
- [x] `npm run test:e2e` — all 9 Chromium end-to-end tests pass, including
  purchase, unlock, offline, prestige, import/recovery, and two-tab behavior.
- [x] `npm run balance` — deterministic scenarios complete; results and limits
  are recorded in [phase-4-balance-report.md](./phase-4-balance-report.md).
- [x] Seven-day offline and automation timing and payload size measured in
  [phase-4-performance-report.md](./phase-4-performance-report.md).
- [x] Existing v1/v2 game payload migration tested; malformed and unknown
  achievement IDs and specialization states are rejected without a
  success-shaped fallback.
- [x] `.gitignore` rules checked by the Git specialist; no files were staged or
  committed.

## Manual and deployment gates

- [ ] Test with a physical mobile device and Safari/WebKit.
- [ ] Perform a real screen-reader pass (VoiceOver or equivalent); automated
  axe results do not substitute for this.
- [ ] Profile a representative low-powered phone and a longer browser session
  for frame time and heap growth.
- [ ] Deploy to the intended static host and verify its production URL,
  refresh behavior, and HTTPS configuration.
- [ ] Product owner signs off on the aggressive active-play prestige pace in
  the balance report.

## Assessment

**NO-GO for claiming public production readiness.** The local playable build
and automated checks pass, and no critical gameplay blocker was found in those
checks. The manual accessibility/device/performance and hosted-production
gates above remain unverified. The implementation is suitable for local play
and continued review, not an unqualified production launch.
