---
name: threejs-spectral-ocean
description: "Large spectral ocean systems in Three.js. Use for directional wave spectra, FFT or hybrid FFT and Gerstner displacement, multi-cascade wavelengths, choppiness, derivative normals, Jacobian whitecaps, temporal foam, sky reflection, underwater absorption, caustics, Snell windows, and above/below-water transitions."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Spectral Ocean

Build wave displacement, derivatives, foam, optics, and underwater medium from one spectrum and coordinate contract.

## Workflow

1. Define physical or artistic scale, wind and swell directions, spectrum, cascades, tile sizes, simulation resolution, choppiness, camera range, and backend.
2. Generate phase-stable displacement and derivatives; validate inverse transform, normalization, and sign conventions independently.
3. Reconstruct normals, Jacobian or compression cues, foam history, and surface velocity from the same simulation.
4. Add reflection, refraction, Fresnel, absorption, scatter, caustics, underwater transitions, and horizon treatment in measured stages.
5. Test calm and storm states, tile seams, long runtimes, camera translation, horizon views, surface crossing, and quality tiers.

## Rules

- Keep cascade wavelength bands distinct and blend them without double energy.
- Reset or reproject temporal foam after discontinuities.
- Avoid sampling the same high-cost spectrum redundantly across material stages.
- Bound simulation texture formats and memory by device tier.
- Provide an analytic or lower-resolution ocean fallback.

## Evidence

Return spectrum controls, cascade diagnostics, displacement and derivative views, above/below comparisons, GPU timings, memory cost, and fallback results.
