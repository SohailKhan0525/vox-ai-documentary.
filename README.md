# AI can draft. Who checks?

An original, 35-second vertical editorial mini-documentary about the future of AI at work. Seven coordinated scenes explain the distinction between generating an answer and verifying it. Original typography, vector illustrations, print textures, music, and effects. Local neural narration. No paid APIs or Vox assets.

## Deliverables

- `output/ai_future_documentary_35s.mp4` — final 1080×1920 H.264/yuv420p, 30 fps / 1,050 frames, AAC 48 kHz.
- `previews/prototype_5s.mp4` — full-resolution five-second prototype.
- `previews/draft_35s.mp4` — half-resolution full-length draft.
- `previews/contact_sheet.png` — frames extracted from final MP4.
- `output/ai_future_project_bundle.zip` — downloadable source, audio stems, reports, previews, and final video; excludes the 338 MB neural weights and installed dependencies.
- `docs/quality_report.md` and `docs/qc_results.json` — verification and limits.
- `docs/script.md`, `docs/storyboard.md`, `docs/VOX_STYLE_RESEARCH.md`, `docs/creative_direction.md`, `docs/assets_and_licenses.md`, `docs/toolchain.md`.

Large binary outputs, virtual environment, node_modules, and voice model weights are intentionally ignored by Git. They exist in this prepared workspace; publishing the cloud environment snapshots prepared files, while Git alone does not contain them. Download the MP4 using the workspace file link/browser. No public hosting or upload is performed.

## Reproduce

Tested on Debian 13, Node 24.19.0, Python 3.12.14, Chromium 154, FFmpeg 7.1.5. CPU only; no CUDA required. System `ffmpeg`, `ffprobe`, Chromium and DejaVu fonts must be present. Use the existing isolated checkout; do not create an extra worktree.

```bash
cd /workspace/vox-ai-documentary.
npm --cache /tmp/documentary-npm ci --no-audit --no-fund
python3 -m venv .venv
.venv/bin/pip install -r requirements.lock.txt
.venv/bin/python scripts/download_models.py
.venv/bin/python scripts/assets.py
npm run audio
npx --cache /tmp/documentary-npm tsc --noEmit
npm run prototype
npm run draft
npm run render
npm run qc
```

Model downloads use official GitHub release URLs and fail on mismatch against the production hashes. The hashes record the downloaded artifacts; they are not upstream signatures. Installation preserves TLS and package-integrity verification. Re-running the audio pipeline uses text/voice/speed fingerprints to invalidate changed narration caches. Word times are estimated, sentence-level captions use measured speech durations.

For editing, change SVG scenes in `src/video.tsx`. Scene frames, narration strings, and sound events originate in `scripts/audio.py`; regenerate audio and timing after edits. `src/timing.json` is generated, not an independent place to edit the script. `audio/beat_map.json` stores the composition grid and exact effects list; `audio/audio_analysis.json` stores real onset detections. If scene boundaries change, update corresponding visual event timings. Render uses frame-driven deterministic motion, a bundled local font set, two concurrent Chromium workers, CRF 18 final encoding, and no runtime remote assets.

Optional editing UI: `npm run studio`. Rendering does not require Studio to remain running. Onboarding does not provide a supported localhost preview link.

## Research and quality limits

Direct Vox playback and thumbnails were proxy-blocked. Eight real titles/descriptions were studied through a mirrored metadata dataset and motion-design breakdowns; third-party demo visuals were inspected. No claim is made to have watched those Vox videos. Sources and interpretation are separated in the report. The final does not contain invented statistics or archival evidence.

Narration is synthetic Kokoro `am_michael`; the available model input cannot audition audio, so a subjective listening review is not claimed. Measured timing, speech energy, soundtrack/onset cues, decoding and loudness are verified. A human listening check remains advisable before public posting. Font/source and Remotion eligibility details are in the licensing report.
