# Phase 4 performance and reliability report

## Measurements

Measurements were collected locally with Node.js `performance.now()` using the
current deterministic engine. Each engine timing was repeated 30 times; results
are specific to this development machine and are not device-wide guarantees.

| Scenario | Median | P95 | Resulting state |
|---|---:|---:|---|
| Fresh state, seven-day offline advance | 0.043 ms | 0.396 ms | 5,437,475 Charge; 536-byte game payload |
| Fresh state with Seed Array Autopilot, seven-day advance | 53.406 ms | 57.812 ms | Seed Array level 96; 487,529,997.95 Charge generated; 616-byte payload |

The automated progression case resolves affordability and milestone events
without a per-second catch-up loop. Both cases completed below the engine's
50,000-event guard. The test includes the configured maximum offline interval;
time beyond seven days remains capped by the existing offline rule.

The final production build emitted a 299.38 kB JavaScript bundle (95.50 kB
gzip) and 11.88 kB CSS (3.20 kB gzip). The running browser was also inspected: Canvas
rendering was present at 1160 × 428 CSS/backing pixels in the inspected desktop
tab and all six chronicle records were exposed in the UI. Playwright checks
cover responsive behavior. The renderer's effect cancels its animation frame
on teardown, but there is no dedicated automated unmount/cleanup assertion.
No cross-device frame-rate, GPU, heap-growth, or extended multi-hour browser
profile was run.

## Reliability notes

- Offline simulation uses the normal event-based engine, is capped to seven
  days, and rejects implausible timestamps; the simulator has an explicit event
  limit.
- The game-state JSON stayed under 1 kB in both measured cases. The local
  browser envelope still stores the same compact state in `localStorage`.
- Browser saves use a lease to stop a second cooperative tab from advancing the
  same local save. It is not cloud synchronization or a transactional
  cross-device lock.
- `decimal.js` uses 40 significant digits. Operations reject non-finite values
  and completely lost positive increments; this is bounded precision, not
  arbitrary precision.
- Canvas 2D remains sufficient for the inspected scene; no WebGL migration is
  justified by these measurements.

## Limitations

The local Node benchmark is a repeatable engine check, not a browser frame
benchmark. A production release should add representative low-end mobile
profiling and a long-running browser memory/frame trace if the audience or
particle complexity grows.
