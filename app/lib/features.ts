/**
 * Feature flags.
 *
 * Central, reversible on/off switches for product surfaces. Flip a value and the
 * matching entry points (nav items, deep links) hide and the route guards itself.
 *
 * The type is annotated as plain `boolean` (not a literal) so consuming
 * conditionals are never treated as constant / dead code.
 */
export const FEATURES: { floorplan: boolean } = {
  /**
   * Spatial Digital Twin floorplan (`/twin/floorplan`).
   * Disabled for now by request — re-enable by setting this to `true`.
   * The Energy module (`/twin/energy`) is intentionally unaffected.
   */
  floorplan: false,
};
