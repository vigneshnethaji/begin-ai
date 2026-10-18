# Beginner journey and accessibility review

Earlier review snapshot. See [learning upgrade](LEARNING_UPGRADE.md) for the subsequent resource/navigation changes and current verification. Current developer dependencies are pinned at the repository root; the temporary-tool installation below records the earlier method.

Reviewed 18 October 2026. This record covers the existing offline learning website, not a new unified SupportDesk application. See [current scope](CURRENT_SCOPE.md).

## Work completed

- Replaced outdated course-preview wording in Home, progress, import/reset confirmations and feedback. The original academy still has separate progress.
- Replaced the stale Unit9 lab dead end with a working link into Unit10. Updated the runnable workflow project's footer and its packaged source.
- Made the Home and map descriptions explicit: one fictional scenario, separate coding projects, not one integrated deployed application.
- Changed the no-JavaScript fallback from the original roadmap to the current 68-lesson learning guide.
- Removed the logo's overriding accessible name, allowing its visible label to supply its name.
- Added mobile-drawer expanded/control relationships, including correct closed state after Escape, close and route changes.
- Made horizontally scrollable prompt examples and results keyboard-focusable, with supported named-group semantics and visible focus. Code download/connection blocks use the same supported group semantics.
- Added supported grouping semantics to the example-message choices.
- Fixed the non-wrapping lesson-duration label, which caused horizontal overflow at 320px with doubled text. Dark Material Blue tokens and normal layout were preserved.
- Added measured header and bottom-navigation offsets for scrolling, sticky content and focus. Content-fit branding and navigation labels remain readable with doubled text instead of overlapping fixed-size boxes.
- Added current-scope documentation and marked earlier delivery records as historical without rewriting their evidence.

## Reproducible developer checks

The website has no new runtime dependency. axe is developer tooling under ignored `.artifacts/` only. Its JavaScript runs in isolated local Chromium profiles, not in a learner's browser or at a third-party service. Browser checks also require installed Playwright and Chromium, or this machine's bundled Codex Playwright runtime, as described in the main README.

```shell
npm install --prefix .artifacts/a11y-tools --no-save --no-package-lock --ignore-scripts axe-core@4.14.0
node scripts/serve.cjs
```

With the preview host running, use another terminal:

```shell
node tests/accessibility-browser.cjs --sample
node tests/accessibility-browser.cjs
node tests/accessibility-manual.cjs
node tests/beginner-journey.cjs
node tests/mobile-focus.cjs
node tests/course-completion.cjs
node tests/browser.cjs
node tests/reliable-browser.cjs
node tests/advanced-browser.cjs
node --test tests/*.test.cjs
```

After editing canonical sources, regenerate `standalone.html`, readable guides and source ZIPs with `node scripts/build-standalone.cjs`. The workflow source footer changed, so verify its fresh archive with `node scripts/verify-advanced-packages.cjs workflow`.

## Review method and limits

The automated audit uses axe-core 4.14.0, WCAG 2 A/AA, 2.1 A/AA, 2.2 AA and best-practice tags. It includes every lesson section at desktop width, every interactive lesson and all lab instruction pages at 320px, plus modal navigation, empty search and quiz feedback states. Full raw/disposition evidence and source SHA256 fingerprints are retained in `.artifacts/accessibility-full.json`. The test fails if canonical sources change during its run.

No rules are globally disabled. Axe's native skip-link heuristic can mistake off-screen `#map/...`, `#learn` and `#lab` route anchors inside the modal for native DOM-fragment skip links. Only recognized modal routes receive an explicit recorded disposition; the real Skip to content link is never exempted. The beginner test activates all eleven modal map links and verifies the destination heading receives focus. Raw counts, targets, reasons and incomplete checks are retained rather than hidden.

Incomplete checks are not passes. Code-block naming, closed native-dialog control references, numbered-tab/label contrast and drawer-footnote contrast receive engineering review alongside keyboard tests. A closed dialog is intentionally absent from the accessibility tree; its DOM ID remains present and its button accurately reports expanded state. The engineering script checks 51 actual computed foreground/background combinations, including active tab numbers that axe cannot resolve around pseudo-elements, at a minimum 4.5:1 requirement. Mobile keyboard tests separately check that focused controls are not covered by fixed navigation, at both normal and doubled text sizes. The text-resize check doubles computed font sizes at 320px; it is not a live assistive-technology test.

The beginner walkthrough covers finding a starting point, moving into Unit10, reading versus passing a check, keyboard-only quizzes, the modal's Escape/focus behavior, all map destinations plus Continue learning and the rules-lab shortcut, scrollable examples, cancelled reset preserving evidence, text enlargement and the readable fallback. Existing tests cover the complete check→unfinished labs→progress-summary flow and backup restore.

This is an engineering and automated review, not a study with human beginners, a live screen-reader listening session, an audit of every separately running C# application, or an accessibility certification. No human participant results or production readiness are claimed. Real learner feedback can validate comprehension beyond these checks.

## Final results

- `node tests/accessibility-browser.cjs`: **444 rendered states**, **0 actionable configured violations**. The source fingerprints remained unchanged during the successful run. One raw skip-link rule finding covered three known modal SPA route anchors; its disposition and raw details remain in the report. The remaining incomplete nodes are contrast/pseudo-element/overlap checks and closed-dialog reference checks, reviewed as described above rather than reported as automatic passes.
- `node tests/accessibility-manual.cjs`: **51 computed contrast checks**, minimum **4.60:1**; named code groups, native dialog relationships, modal focus containment, reduced motion, blocked-storage warning/continued learning, and an isolated standalone Unit9-to10 handoff passed. Evidence: `.artifacts/accessibility-engineering.json`.
- `node tests/mobile-focus.cjs`: **206 visible, unobscured keyboard-focus stops** at 320px across Home, map, an exercise, progress and the workflow lab, including doubled-text Home. Header and bottom-bar offsets match their actual rendered heights.
- `node tests/beginner-journey.cjs`: passed the complete scripted walkthrough, including selected-unit headings being visible as well as focused, ordinary and doubled-text branding, current readable fallback and cancelled-reset evidence preservation.
- `node --test tests/*.test.cjs`: **74 passed, 0 failed**. Site regressions passed all **340 lesson sections**, 48 general responsive routes, 168 advanced responsive routes, prompt/output activities, source downloads, portable ZIP equality and course-completion routing.
- `node scripts/verify-advanced-packages.cjs workflow`: fresh archive with **13 source files**, matching hashes, build with **0 warnings / 0 errors**, **20 C# checks** and real Blazor browser flows passed. Evidence: `.artifacts/advanced-packages-gSAEjY/verification.json`. Final source hashes still match this verified project.
- Both website editions were regenerated. Final changed modules and the stylesheet match their embedded standalone versions. Original handoff files remain unchanged. No Git commit, publishing, cloud provisioning, paid inference or learner-profile changes were performed.
- Inspected normal and doubled-text mobile screenshots. Evidence: `.artifacts/mobile-polished-home.png` and `.artifacts/mobile-doubled-text.png`.
- Independent read-only review cleared the changes. It found one map-scroll arithmetic regression during the adaptive-header change; the numeric height subtraction was corrected and a real heading-visibility regression was added before rerunning the site checks. No unresolved important findings remain.

## References

- [axe-core API and audit limitations](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md)
- [WCAG2.2](https://www.w3.org/TR/WCAG22/)
- [Understanding reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Understanding contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
