# Phase 4 audit

## Scope and baseline

The Phase 3 implementation was audited before adding Phase 4 content. The existing
React/Vite interface, deterministic economic engine, Canvas renderer, local save
envelope, game-state save format, offline progression, and first prestige remain
the foundation; this phase does not replace them.

The approved research treats ISEPS-specific formulas and unlock conditions as
unknown. New progression content in this phase is an original proposal and is
not presented as verified ISEPS behavior.

## Baseline verification

The following commands passed before Phase 4 implementation:

| Command | Result |
| --- | --- |
| `npm run build` | Passed |
| `npm test` | 29 tests passed |
| `npm run test:e2e` | 9 Chromium tests passed |
| `npm run balance` | Passed |

The existing end-to-end coverage includes purchasing, unlocks, reload/offline
progression, prestige, invalid-save recovery, accessibility checks, and
multi-tab behavior. Prior Phase 3 evidence also recorded a 320–1280 px reflow
check and no axe violations in the inspected routes and dialogs. A real
screen-reader session was not verified.

## Architecture and save findings

- Production, purchases, automation, offline advancement, and prestige are
  implemented in `src/game`; React and the particle renderer consume the engine
  rather than determining economic values.
- Upgrade prices and effects are configured in `src/game/config.ts`. Unlock
  rules were still encoded in a switch in `src/game/unlocks.ts`, making the
  current catalog harder to extend consistently.
- The browser save envelope and the serialized game state have separate
  versions. The browser envelope remains version 1; the game-state payload
  starts this phase at version 1 and requires an explicit migration if new
  persistent fields are introduced.
- Offline and simulation advancement already have finite duration and event
  caps; no second-by-second offline loop was found in the reviewed code.
- The approved visual direction is the existing “Observatorio editorial”
  identity. Existing accessible dialogs, keyboard focus handling, and responsive
  game layout should be preserved.

## Findings and phase scope

No critical gameplay-blocking defect was identified in the pre-change build,
unit-test, browser-test, or balance baseline. This is a test-backed code audit,
not a claim of exhaustive manual playtesting or production readiness.

Phase 4 will add original, state-derived milestone/achievement records and
describe existing unlock prerequisites in the upgrade catalog. Records are
informational (no currency or production reward), persist through prestige,
and are evaluated by the game engine. The game-state save format will migrate
v1 saves to v2 without discarding existing fields. A second prestige layer,
skill tree, and new automation system are excluded because current simulation
evidence does not justify their balance or complexity.

## Remaining audit limitations

- Browser checks use automated Chromium runs; manual testing with assistive
  technology and physical mobile devices remains outstanding.
- Performance findings must be based on repeatable measurements in the
  accompanying Phase 4 performance report. No GPU/device-wide performance
  claim is inferred from a successful production build.
- Balance scenarios are deterministic model runs, not observed player
  telemetry. Conclusions must remain bounded to the tested scenarios.
