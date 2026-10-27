# Assets, licenses, and provenance

No Vox footage, thumbnails, logo, original music, charts, or third-party demo images are incorporated into the film. No stock footage or generated photographic imagery is used. All diagrams are explicitly schematic. The original FIELDNOTES identity is unrelated to Vox branding.

| Asset | Origin / use | License / action |
|---|---|---|
| Vector diagrams, icon paths, paper layouts, animation | Original project source `src/video.tsx` | Created for this project; editable source supplied. |
| Print texture and stipple | Original seeded NumPy / Skia assets from `scripts/assets.py` | Created for this project. Deterministic seed; no downloaded image. |
| Music | Original NumPy/SciPy synthesis, 120 BPM A-minor-family pulse | Created for this project; no sampled commercial recording or downloaded track. No stock-music attribution obligation. |
| Effects | Original synthesized low impacts, filtered-noise sweeps, and tonal clicks | Created for this project; event list in `audio/beat_map.json`. |
| Narration | Local Kokoro `am_michael` synthetic voice | Runtime [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx) MIT; model identified as Apache-2.0 by its official README. No impersonation of a named public figure; no human performance claimed. |
| Neural model / voice pack | [Official runtime release model-files-v1.1](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.1), `kokoro-v1.0.onnx`, `voices-v1.0.bin` | Downloaded through verified HTTPS; local SHA256 record in `assets/SHA256SUMS`. These local hashes record what was used, not independent proof of an upstream signature. Kept outside Git because large; download script supplied. |
| DejaVu Sans Regular/Bold and Sans Mono | Debian system font packages, copied to `public/fonts` | Bitstream Vera / DejaVu terms; bundled notices in `LICENSE-DejaVu.txt` and `LICENSE-DejaVu-Mono.txt`. Internal filenames changed for clarity, font names not modified. |
| DejaVu Serif | Bundled alternative, not used in final motion system | Same DejaVu license notice. |

Tool dependencies retain their own licenses; see `docs/toolchain.md` and lockfiles. Remotion's free license covers an individual and organizations up to three employees under its current LICENSE.md; larger organizations must check its terms. This project did not buy or use a paid cloud-rendering service.

Research references are citations, not visual assets. Two third-party example repositories were inspected as references; no code, instructions, or artwork from them was installed or copied into the film. Direct Vox playback was unavailable; no claim is made that its soundtracks were auditioned.
