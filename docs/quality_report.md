# Final quality report

Delivered film: **AI can draft. Who checks?**

File: `output/ai_future_documentary_35s.mp4`. Verified actual encoded file, not a proposed render command. Full machine-readable evidence is in `qc_results.json` and `ffprobe_final.json`.

## Executed checks

| Requirement | Observed result |
|---|---|
| Duration | Video **35.000000 s**, container **35.000000 s** |
| Frames / frame rate | **1,050 decoded video frames**, **30/1 fps** |
| Size / aspect | **1080 × 1920**, 9:16 |
| Encoding | **H.264 High**, **yuv420p**, limited-range BT.709 |
| Audio | **AAC**, stereo, **48,000 Hz** |
| File size | **10,033,494 bytes** |
| Full decode | Passed FFmpeg `-xerror` decoding of audio and video |
| Black frames | None found by blackdetect at the documented thresholds |
| Solid blank frames | All 1,050 downscaled frames tested for spatial variance; none below threshold |
| Audio synchronization | Zero-sample measured offset at 4.8 kHz; correlation **0.999903** against master after AAC decoding |
| Loudness | **−16.5 LUFS integrated**, **5.0 LU LRA**, **−1.5 dBFS true peak**; no measured clipping |
| Narration coverage | Seven measured, non-silent utterances; all fit their scene slots; sentence captions use actual start/end times |
| Source type check | TypeScript passed |
| Reusable setup | `bash scripts/setup.sh` executed successfully after production; master audio SHA256 unchanged |
| Prototype | Actual 150-frame, 1080×1920, H.264/yuv420p BT.709 MP4 with narration, music, effects and a scene handoff |

Final SHA256: `a362f9189758ab9235b26b1a12aa2ccf9ae1190c67f8bf675b2ab5c3e3c14c97`.

## Visual review and revisions

Actual image inspection was available and used. Inspected the initial prototype contact sheet, a nine-frame full-draft contact sheet, the final contact sheet, the exact first frame, and eight transition-boundary frames. Twenty-two actual final frames are extracted under `previews/final_frames`. Main titles, captions, diagrams, and the held ending are legible in the inspected frames. An independent bundled-font measurement audit found one critical headline overflow; it was fixed. This is representative raster review and automated full-frame scanning, not a claim of watching every frame in motion.

Completed revisions:

1. The first prototype started with an overly empty hook plate. The opening question now appears in the exact first encoded frame, while paper and annotation details animate in.
2. `WE HAND OFF?` initially extended beyond the canvas at font size 123. Reduced to 100; the measured endpoint remains inside the right safe margin, including the camera push.
3. The prototype's full-screen lime wipe was too blunt and briefly obscured the story. Replaced it with an incoming illustrated-page handoff, revealing the next heading before the scene boundary.
4. Shifted whooshes to the actual transition movement, aligned task/network ticks to their reveal events, and aligned the verification stamp with its 16-second impact.
5. Added text/voice/speed fingerprints so changed narration cannot silently reuse stale audio.
6. Initial final-format QC **failed** because the Remotion default color space produced `yuvj420p`/full range despite the pixel-format option. Corrected the delivered file through a real FFmpeg full-to-limited-range BT.709 conversion, CRF 16, preserving all 1,050 frames and copying the AAC stream. Added explicit `colorSpace: 'bt709'` to the renderer. Re-rendered the prototype with this setting and confirmed `yuv420p`, TV range, BT.709. Then reran the complete final QC successfully.

The initial full-range file is retained only as a diagnostic intermediate in `previews/render_fullrange_before_correction.mp4`; it is not the delivered final. The delivered file name is the required `output/ai_future_documentary_35s.mp4`.

## Prototype / reference comparison

The actual prototype has a strong reading hierarchy, tilted document layers, a focal magnifier, animated line/highlighter reveals, a continuous camera move, narration, original music and motivated effects. The revised version improves immediate hook clarity and continuity. It follows the reference study's general principles of concrete objects, progressive explanation and evidence hierarchy, while using an original cream/ink/lime/coral identity. It is intentionally vector-led rather than a photographic collage. Direct frame-for-frame or soundtrack comparison to Vox was impossible under the proxy restriction; secondary demo images and mirrored descriptions are the evidence available. See `VOX_STYLE_RESEARCH.md` for the full distinction.

## Factual and licensing review

No fabricated statistics, factual-looking invented chart, copied archive, stock music, Vox branding, or footage is used. Read/write/decide is a labeled illustrative task bundle. The network is labeled conceptual with no measured rate. “In seconds” is conversational, not a benchmark. The conclusion is an editorial choice, not a universal employment forecast. Primary-source limitations and citations are in the research report. The asset report records the local voice, model and font licenses.

## Remaining limitations

- **Listening:** this interface cannot supply playable audio as model input. Two real voice samples were generated and measured, but no subjective audition or human listening review is claimed. Intelligibility, naturalness, perceived music balance, and exact spoken pronunciation remain unverified by listening. A human listening check is advisable before public posting. No claim is made that this synthetic voice equals a professional human narrator.
- **Reference access:** official Vox videos, thumbnails, and some direct documentation domains returned proxy 403. Eight real videos were researched via mirrored metadata plus accessible breakdowns; they were not watched. Full requested primary visual study was therefore only partially achievable.
- **Motion review:** representative frames and actual encoded transitions were inspected as images. No claim is made that a real-time playback review occurred.
- **Reuse/publication:** dependency installation and regeneration were tested in the current machine. `install_script` and `start_skill`, plus research-domain requirements, were saved in the environment draft. Saving does not publish or prove restoration in a new cloud task. Review/save and publish through environment settings to retain the prepared environment. No new-task restoration is claimed. The source and approved final/prototype videos are committed for GitHub delivery at the user’s request. Larger intermediate media and the project ZIP remain workspace-only; setup scripts can regenerate production assets. Cloud snapshot publication and fresh-task restoration remain separate from Git delivery.

The required finished video exists and passes technical QC. The remaining limits concern reference access and subjective review, not an absent render.
