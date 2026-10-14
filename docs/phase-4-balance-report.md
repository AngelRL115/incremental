# Phase 4 balance report

## Scope and method

`npm run balance` runs the deterministic scenarios in
`src/game/simulation-harness.ts` against the current configuration. This report
records results from the local model, not player telemetry or observed ISEPS
behavior. Phase 4 adds no economic effects: chronicle entries are informational,
so the upgrade, production, and prestige formulas are unchanged.

## Results

| Strategy | Time to first prestige | Charge generated | Echo generated | Reward | Notes |
|---|---:|---:|---:|---:|---|
| Frequent manual | 27 s | 2,563.12 | 14.40 | 1 RP | Active pulsing and purchases |
| Occasional manual | 120 s | 3,515.40 | 0 | 1 RP | 60-second player action interval |
| Idle only | 600 s | 3,100.00 | 0 | 1 RP | No purchases or pulses |
| Autopilot unlock/active | 39 s to autopilot | 13,063.76 | 77.60 | 0 RP | Stops at automation goal before prestige |
| Delayed/reserve spending | 110 s | 11,755.86 | 120.00 | 4 RP | Defers prestige to reach deep resonance |

The harness also reports short offline gain of 240 Charge for 60 seconds and
5.44e+6 Charge for the seven-day cap. Every configured milestone was reached
in at least one scenario.

## Assessment

- The no-purchase theoretical first prestige target is approximately 500 seconds
  (8m20s); the sampled idle scenario reaches it at 600 seconds because its
  action interval is 300 seconds.
- Active progression is much faster: frequent manual actions reach first
  prestige in 27 seconds in this model. Manual pulses, purchasing order, and
  time-to-prestige therefore remain balance-sensitive.
- Delaying prestige from 2,500 to 10,000 generated Charge raises this linear
  reward from 1 to 4 RP in the tested scenario. This demonstrates the intended
  trade-off but does not establish that either strategy is optimal or fair.
- The short automation scenario reached the autopilot goal at 39 seconds. This
  is a bounded scenario result, not a claim about long-run strategic dominance.

## Decision

No economic parameters were changed in Phase 4: its additions do not alter
production or spending, and one simulation suite is insufficient evidence to
retune the original economy. The data supports continuity and reproducibility,
not a claim that the economy is fully balanced. Before adding a prestige layer
or expanding the tree, gather longer playtest evidence and tune the action
frequency/pulse contribution and prestige cadence against explicit target
bands.
