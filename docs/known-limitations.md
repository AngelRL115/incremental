# Known limitations after Phase 4

- The original economy remains provisional. Active manual play reaches first
  prestige much faster than idle progression in the current simulator; see the
  measured scenarios and recommendation in
  [phase-4-balance-report.md](./phase-4-balance-report.md).
- Phase 4 adds six informational chronicle entries and configurable unlock
  prerequisites only. There is no branching skill tree, second prestige layer,
  additional automation, achievements with rewards, or resource conversion.
- Save data is local to one browser profile/device. There is no account,
  cloud synchronization, or server-side recovery. The multi-tab lease protects
  cooperative tabs but is not a distributed lock.
- The seven-day offline cap remains. Larger timestamp gaps are rejected.
- `decimal.js` calculations are limited to 40 significant digits; the system
  detects overflow and fully lost positive increments but does not provide
  unlimited precision.
- Canvas 2D has only local inspection and engine-side performance evidence;
  low-end mobile GPU/frame-time and long-session heap profiling remain open.
- Automated Chromium/axe coverage does not prove Safari/WebKit behavior or
  screen-reader usability. A physical-device and VoiceOver pass is still due.
- No hosted production deployment has been configured or tested. `dist/` is
  build output for a static host, which must be selected and configured.
- The phase has no live telemetry, so balance observations describe the
  deterministic scenarios only, not real player behavior.
