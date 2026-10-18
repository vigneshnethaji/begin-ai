# SupportDesk attachment review — Unit 10

A standalone .NET 10 Blazor Interactive Server lab. Real C# validates typed intake, normalizes authored observations, preserves evidence/conflicts, enforces exact-input review and applies a fictional model-choice policy. All data is synthetic and held in session memory. It performs no OCR, ASR, vision, inference, ONNX execution, fine-tuning or file upload. It needs no provider, database, keys, cloud account, external fonts or NuGet package downloads.

## Start and stop

Install the .NET 10 SDK. Extract the complete ZIP preserving folders, open a terminal beside `SupportDesk.AttachmentReview.csproj`, then run:

```text
dotnet --version
dotnet run
```

The SDK version starts with `10.`. The host listens on `http://127.0.0.1:5117`. Open that URL and wait for **Interactive ready** before using the controls. Stop the host with Ctrl+C before building again on Windows. State disappears when its Blazor session or process ends; transient reconnection is not durable recovery.

An optional alternate port is validated before host creation. Only decimal digits, 1024–65535, are accepted. No wildcard or non-loopback binding is supported.

PowerShell:

```powershell
$env:INPUTS_LAB_PORT = '5118'
dotnet run
Remove-Item Env:INPUTS_LAB_PORT
```

The removal command is run after stopping the host. POSIX shell:

```sh
INPUTS_LAB_PORT=5118 dotnet run
```

Open `http://127.0.0.1:5118` for that run. NuGet.Config clears all package sources; the project uses only the installed ASP.NET Core shared framework. An initial restore still creates normal local build outputs in `obj/`.

## Verify without opening a listener

```text
dotnet run -- --verify
```

Expected final line and process exit:

```text
Inputs verification: 13 passed, 0 failed. No listener opened.
```

Exit code is 0. This branch executes before reading the optional port or creating any host. Thirteen production-service checks cover conflicting sources and transcript metadata; unreviewed denial; separate review/preview transitions; denied review; notes edits; repeated normalization; fixture/type edits; each allowed modality; unknown/mismatched/empty/control-character/oversized inputs; the exact 2,000-character boundary; review before normalization; model constraints; and port validation. Assertions use literal expected values and real C# services, no mocks.

## Reproduce the attachment path

1. Keep Bundle, media type `application/x-supportdesk-fixture`, and `Fictional billing review`. Choose **Normalize observations**. Expect `AwaitingReview`, three observations and **Unresolved conflict**.
2. Inspect `image-1: amount=120`, confidence 0.92; `audio-1: amount=170`, confidence 0.61, Speaker 1, 12–16 seconds; and `text-1: amount=120`, confidence 1.00. The text confidence is an authored fixture value, not truth. No original media is processed or available in this lab.
3. **Create local preview** is disabled. Choose **Review exact input**. This acknowledges the exact current fixture, media type and notes; the result remains `No preview.` It is a learning gate without authenticated staff identity.
4. Choose **Create local preview**. Expect `AcceptedLocalPreview`. The result preserves all sources and says `Unresolved conflict`; it does not choose a correct amount. Nothing is sent, persisted, refunded or applied to a ticket.
5. Edit the notes. Expect `Idle`, empty evidence, cleared review and `No preview.` Normalize again and choose **Deny review**: expect `Denied` and no preview. Changing any input, including model requirements, invalidates workspace review and results. Returning to old values does not restore approval.
6. Select Image with `image/png`, Audio with `audio/wav`, or Text with `text/plain`. Each successful normalization contains one authored record with the corresponding source ID. Fixture selection deliberately does not auto-correct the media type so mismatches can be tested.

Allowed pairs are exact: `image`/`image/png`, `audio`/`audio/wav`, `text`/`text/plain`, `bundle`/`application/x-supportdesk-fixture`. Fixture IDs have a 32-character bound, media types 64, notes 2,000. Notes must contain non-whitespace content and no control characters except newline, carriage return and tab. Unknown fixtures, mismatched media types, unsupported types and invalid notes are denied before observations are created. The normal controls bound text; the verifier also exercises the service directly with 2,001 characters and malformed inputs. Transport messages are limited separately to 128 KiB.

## Compare fictional model profiles

**Compare fictional profiles** runs C# `ModelPolicy.Choose`, not an AI model:

| Requirement | Expected outcome |
| --- | --- |
| Text; cloud forbidden; 8 GiB | `local-text`, illustrative score 80 |
| Vision; cloud forbidden; 8 GiB | `No eligible profile` |
| Vision; cloud permitted; 8 GiB | `cloud-general`, illustrative score 70 |
| Text; cloud forbidden; 2 GiB | `No eligible profile` |
| Invalid memory such as -1 | `Denied` |

`local-text` supports only text and needs four GiB. `cloud-general` advertises text/vision/speech and is removed when cloud is forbidden. Scores are authored, never benchmarks or verified provider capabilities. Eligibility is checked before ranking. An unknown capability is denied. Memory must be a whole number from 1 through 128 GiB. Editing a requirement clears the previous recommendation immediately. No recommendation authorizes a real cloud call.

## Six lesson exercises

The academy supplies six separate input-driven exercises, not model demos:

1. OCR versus vision: change candidate text and the question. Empty text is denied; a damage question requires visual assessment.
2. Speech segments: edit speaker, start/end and confidence. End before start is denied; confidence never proves identity.
3. Multimodal provenance: change image/audio amounts. 120 versus 170 retains both sources and flags conflict; agreement still needs review.
4. Local/cloud choice: change capability, no-cloud rule and available memory. Hard constraints cannot be offset by score.
5. Quantization: enter fictional sizes, latencies and accuracy. 100/40 gives size ratio 2.5; 20/25 gives speed ratio 0.8, hence slower. Accuracy below the chosen minimum rejects the candidate; zero size is invalid. File size is not peak memory. ONNX is a model format, ONNX Runtime an executor; neither is installed here.
6. Fine-tuning decision: current facts suggest investigating RAG; repeated format gaps first need a measured prompt baseline and independent held-out data. A candidate recommendation does not perform training or approve deployment.

## Developer browser checks

From the academy repository root, with this lab already running:

```text
node --test tests/inputs.test.cjs
node tests/inputs-exercises.cjs
node tests/inputs-app-browser.cjs http://127.0.0.1:5117
```

The app script accepts an alternate local URL, including `http://127.0.0.1:5118` for a separately extracted source ZIP. It spawns no server and opens only an isolated headless developer browser. It checks actual Blazor event flows after readiness, review/deny/edit, type and server bounds, model eligibility, stale output, source/conflict preservation, focus visibility, 44px controls and layout at 320/390/768/1440px. The exercise script checks all six calculators, negatives, safe text, disposal and the academy download/completion contract. These scripts live in the parent course, not inside the lab source ZIP. The independent `--verify` ships in the ZIP.

## Troubleshooting and limitations

- SDK/project missing: run `dotnet --version` and move to the extracted project directory. No package source is needed; confirm the installed .NET 10 targeting packs.
- Port occupied: stop your own previous host or choose a free `INPUTS_LAB_PORT`. Empty, signed, whitespace-padded and out-of-range values exit with code 1 and a clear error.
- Controls disabled: wait for **Interactive ready**. The local `_framework/blazor.web.js` and Blazor server connection must load; the app uses no CDN.
- Denied normalization: match the exact allowed fixture/media pair and supply bounded, nonblank notes. Invalid input clears evidence, review and result.
- Preview disabled: normalize and review after the latest edit. Reviewing before normalization cannot grant approval. Review is an acknowledgement, not resolution of conflicting amounts.
- No eligible model: the fictional capabilities, privacy requirement or memory do not fit. A score cannot override those constraints.
- Data protection is explicitly ephemeral and has a separate memory-only XML key repository, avoiding a disk key fallback. It is suitable for this temporary learning host; it is not a production key-management design.
- This lab demonstrates neither real Azure authentication, deployment nor certification. ONNX optimization and fine-tuning are conceptual decisions with entered or authored examples. Local inference would require actual model/hardware, quality, telemetry and privacy testing.

The reviewed attachment milestone is self-reported through the academy checkbox; the lab never marks it automatically. Continue with `identity-secrets` in the next unit.

## Primary references

- [Microsoft Learn OCR overview](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-ocr): text extraction tasks.
- [Speech recognition results](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/get-speech-recognition-results): offsets, durations and intermediate/final results.
- [Multimodal search concepts](https://learn.microsoft.com/en-us/azure/search/multimodal-search-overview): image/text inputs; this lab's provenance policy is application design.
- [Cloud-based and local AI models](https://learn.microsoft.com/en-us/windows/ai/cloud-ai): model, hardware and data-boundary considerations.
- [ONNX Runtime quantization](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html): calibration, accuracy and hardware-dependent performance.
- [Fine-tuning overview](https://learn.microsoft.com/en-us/azure/foundry-classic/concepts/fine-tuning-overview): training/data/evaluation considerations.

References checked 2026-10-18. No referenced cloud service or runtime is installed by this project.

## Source manifest

`SupportDesk.AttachmentReview.csproj`, `NuGet.Config`, `Program.cs`, `Components/App.razor`, `Components/Routes.razor`, `Components/_Imports.razor`, `Components/Pages/Home.razor`, `Services/Intake.cs`, `Services/ModelPolicy.cs`, `Services/LabPort.cs`, `Services/SessionDataProtection.cs`, `Verification/Verify.cs`, `wwwroot/app.css`, and this README. Build products `bin/` and `obj/` are excluded from the downloadable source manifest.
