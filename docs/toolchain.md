# Toolchain research and decisions

Research date: 2026-10-27. This document records official documentation inspected through accessible GitHub/raw GitHub URLs. A documentation fetch does not establish that a tool or voice passed a production test; see `quality_report.md` for executed validation.

## Selected pipeline

| Component | Selection | Reason |
|---|---|---|
| Composition | Remotion 4.0.539, React 19.2.4, TypeScript 5.9.3 | One deterministic frame clock; original reusable React/SVG scenes; exact 1,050-frame duration. Pin all Remotion packages to the same release. |
| Browser | System Chromium 154.0.8037.57 | Already installed; use explicit `/usr/bin/chromium` instead of downloading a second browser. |
| Encoding / inspection | System FFmpeg / FFprobe 7.1.5 | H.264, yuv420p, AAC, loudness measurement, decode verification, contact-sheet extraction. |
| Voice | Local `kokoro-onnx` and Kokoro v1.0 model | CPU-supported neural TTS with accessible official release assets; no cloud voice account or per-character charges. Voice choice must follow a real test and be identified as synthetic. |
| Audio construction | NumPy, SciPy, SoundFile | Original deterministic music, impacts and whooshes; floating-point mixing before mastering. Avoid downloaded music with unclear rights. |
| Audio analysis | Librosa | Beat/onset analysis. For an original tempo-controlled score, retain the exact composed beat grid as ground truth; distinguish detected onsets from intentional cue positions. |
| Asset graphics | Skia Python, Pillow, SVG | CPU raster textures and vector illustrations, masks and paths. SVG animates cleanly in Chromium; Pillow is useful for contact sheets and pixel checks. |

The machine reports five available processors, but its cgroup CPU quota is four cores and memory limit is 32 GiB. Use conservative render concurrency (two or three workers), no GPU assumption, and a low-resolution draft before final 1080 × 1920 output. About 30 GiB was free at the initial audit. Avoid storing 1,050 raw full-resolution PNGs when Remotion can encode frames directly.

## Official sources actually inspected

1. Remotion `renderMedia()` documentation source: https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/renderer/render-media.mdx . Read through raw GitHub. Documents `renderMedia`, composition selection, codec/output options, concurrency and frame-range controls. Main-branch documentation can evolve; the installed pinned 4.0.539 package API remains authoritative for implementation.
2. Remotion 4.0.539 license: https://github.com/remotion-dev/remotion/blob/v4.0.539/LICENSE.md . Read successfully. Individuals, for-profit organizations with up to three employees, nonprofits, and noncommercial evaluators meet its free-license eligibility. Other for-profit organizations require a Company License. This personal first documentary is being produced without buying a license or external service. Reassess eligibility if a larger organization adopts the project. Remotion is source-available under its own license, not simply MIT.
3. Kokoro ONNX project README: https://github.com/thewh1teagle/kokoro-onnx . Explicitly supports Python 3.12 and CPU inference; identifies runtime MIT and model Apache-2.0 licenses. The README recommends Misaki G2P for v1.0, while its simple official example uses the package default path. Use the verified working path rather than adding unnecessary language models.
4. Kokoro working API example: https://github.com/thewh1teagle/kokoro-onnx/blob/main/examples/save.py . Instantiates `Kokoro(model_path, voices_path)`, calls `create(text, voice=..., speed=..., lang="en-us")`, and saves the returned waveform/sample rate using SoundFile. Used as API research, not copied as documentary creative content.
5. Kokoro ONNX license: https://github.com/thewh1teagle/kokoro-onnx/blob/main/LICENSE . MIT license, copyright 2025 github.com/thewh1teagle.
6. Maintained Piper project: https://github.com/OHF-Voice/piper1-gpl . Read successfully; describes a local neural TTS engine with embedded eSpeak NG phonemization and `pip install piper-tts`. The current README also seeks maintainers. It links voice distribution to Hugging Face. Initial voice-download access was blocked; Piper was evaluated as an alternative, not assumed installed or auditioned. Its GPL engine and voice-specific model licenses need separate review if distributing it.
7. Skia Python README and license: https://github.com/kyamagu/skia-python and https://github.com/kyamagu/skia-python/blob/main/LICENSE . Binary wheel installation is documented; binding is BSD-3-Clause. The project redirects to the current `skia-python/skia-python` repository. Skia's own notices and bundled dependencies remain separate.
8. Librosa beat/onset implementations and documentation: https://github.com/librosa/librosa/blob/main/librosa/beat.py and https://github.com/librosa/librosa/blob/main/librosa/onset.py . Supports estimated beat timing and onset-strength/detection. License inspected at https://github.com/librosa/librosa/blob/main/LICENSE.md : ISC.
9. FFmpeg 7.1.5 filter documentation: https://github.com/FFmpeg/FFmpeg/blob/n7.1.5/doc/filters.texi . Read the official version-matched documentation source for audio filtering/mastering. This installed FFmpeg build enables GPL components, libx264, libass, FreeType, fontconfig and libflite. Generated original audiovisual output is distinct from redistribution of the FFmpeg executable.

Initial direct documentation requests to `www.remotion.dev`, `skia.org`, `ffmpeg.org`, and `librosa.org` received proxy tunnel HTTP 403. Official source-documentation mirrors above were used rather than bypassing the network policy. The environment draft includes the requested direct domains; saving a draft alone does not apply the network change.

## Reproducible installation pattern

Run inside `/workspace/vox-ai-documentary.`. Preserve package signatures, TLS and downloaded-model checksums. Never use `--trusted-host`, `strict-ssl=false`, or insecure curl flags.

```sh
npm --cache /tmp/documentary-npm ci --no-audit --no-fund
python3 -m venv .venv
.venv/bin/pip install -r requirements.lock.txt
```

`requirements.lock.txt` should record the versions actually used in the successful render. The initial research/install selection was `kokoro-onnx soundfile numpy scipy pillow skia-python librosa`; the production lock/snapshot, not this unpinned exploratory list, is the reproduction reference. npm's normal cache location is not writable in this sandbox, so `/tmp/documentary-npm` is used explicitly. Keep Python dependencies isolated in the checkout's ignored `.venv`.

Official model/voice asset URLs documented by the Kokoro project:

- https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.onnx
- https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin

Use the repository's download helper and recorded SHA-256 manifest where provided; after downloading, verify the recorded checksums before production reuse. A checksum computed only after the first download records reproducibility, but is not independent upstream authenticity evidence. HTTPS downloads from the project's official release preserve transport verification. Do not commit large voice models or Python environments to Git.

## Design implementation choices

- Use Remotion `useCurrentFrame()` / frame-based interpolation and springs. No wall-clock animation, random per-frame noise, CSS transitions or network-loaded fonts during rendering.
- Deterministically seed paper texture and sound generation. Treat graphic geometry as original editorial illustrations, not measured datasets.
- Use local fonts with their bundled licenses. A system font's presence alone does not identify its redistribution license. Include only font assets whose license has been reviewed, or reference the system installation and record the dependency.
- Mix narration, music and effects on a common 48 kHz timeline. Keep separately editable stems. Measure actual voice durations before finalizing visual cue boundaries.
- Use gentle narration compression/EQ only if needed, duck music around measured speech, then master for intelligibility and a conservative true peak. Do not describe loudness or clipping as passing until measured.
- Keep captions and primary visual text within phone safe zones and inspect representative raster frames; source bounding boxes alone cannot prove readability.

## Evaluated but deliberately omitted

- Manim: no mathematical proof or geometry that benefits from its separate scene system; adds render/environment complexity without improving this short's explanatory task.
- Paid/cloud TTS and stock subscription libraries: unnecessary and not authorized. Local Kokoro and original synthesized score avoid credentials, cost and uncertain stock rights.
- Generic motion templates, downloaded “Vox style” packs and third-party Codex skills: no creative package was adopted. Official Remotion API docs and Kokoro's small example provide a coherent, reviewable foundation without inheriting external instructions or unreviewed install scripts.
- GPU libraries and Docker: neither is needed for this CPU/Chromium workflow.

## Remaining quality obligations

Software capability is not a claim about the finished film. Narration must be auditioned where audio playback is supported; waveform duration and successful synthesis alone do not establish naturalness. Confirm actual rendering, decoding, visual review, mastering, exact frame count and the saved reusable setup instructions separately. If this interface cannot play audio to the agent, report that limitation plainly.
