# Beginner content depth: Units 1–3

First-pass record. The subsequent [complete content pass](CONTENT_COMPLETE.md) extends this pattern to all 68 lessons. Counts and verification below describe the initial Units 1–3 delivery.

Delivery record: 19 October 2026. This implements the approved recommendation to improve the first three units before applying the teaching pattern across the remaining units. All 11 units and 68 lessons remain available. The integrated SupportDesk application remains a separate later project.

## Learner-visible changes

All 20 lessons in Foundations, Data and your first ML.NET model, and Language models in C# now include:

- A short bridging explanation on **Understand**.
- A three-step trace with concrete values and an expected outcome on **Example**.
- Optional guided practice with a hint, starter where useful, expected approach and result on **Try it**.
- A transfer question using a different fictional .NET feature, such as catalog search, invoice handling or bookings.
- A recall question on **Check**, intended for another attempt from memory tomorrow. It does not schedule a reminder.

Hints and solutions use progressive disclosure so learners can think before reading an answer. They do not award understanding checks or coding milestones. The original quizzes, grading indices, read markers and lab evidence remain unchanged.

The companion content adds 31 glossary entries, taking the glossary from 67 to 98 terms. There are now 26 optional microtopics across the course, including pretraining, instruction tuning, attention, model parameters and training loss. The dark Material Blue theme, mobile navigation and complete-project milestone links remain unchanged.

## Concepts made concrete

**Foundations:** AI/ML/deep-learning relationships, categories versus numeric prediction versus generation, parameter learning versus inference, explicit rules, model boundaries and uncertainty. The training exercise can change one numeric weight and compare squared error before and after. A larger learning rate can make that one example worse. This is an illustrative regression calculation, not ML.NET's text trainer, a useful trained model or a benchmark.

**ML.NET:** actual file columns and dataset counts, available inputs versus leaked answers, label policy, structural and meaning review, training-only learned preparation, proposed training/validation/test separation, overfitting/underfitting clues and complete fitted-pipeline saving. The real lab still has only training and test files; the additional validation exercise is explicitly conceptual.

The evaluation exercise compares an always-General classifier with another authored binary tally. It displays a labelled confusion matrix, accuracy, Billing precision/recall and F1 with denominators. The first case gets 90% accuracy while missing every Billing ticket. No predicted Billing cases means precision is undefined, not perfect. These are illustrative counts, not added outputs from the C# lab or multiclass averages.

**Language models:** pretrained parameters versus request context, instruction tuning, attention, tokens versus delivery chunks, async sequences, registration, provider requests, cancellation and review-state transitions. Traces follow the actual InteractiveServer path: `Home.razor` → injected `IDraftReplyService` → Sample or optional provider adapter. No controller endpoint, Microsoft.Extensions.AI installation or live provider call is invented. Sample remains fixed text; only the optional adapter makes external HTTP when deliberately configured.

## Delivery and verification

Canonical authored companions are `assets/teaching-foundations.js`, `assets/teaching-mlnet.js` and `assets/teaching-language.js`. The support registry combines them with existing content. Rendering uses the existing lesson sections; arithmetic lives in `assets/teaching-math.js`. No dependency or learner runtime installation was added.

Run the existing local host, then use:

```shell
npm test
npm run test:teaching
npm run test:journey
node tests/browser.cjs
node tests/milestone-browser.cjs
node tests/cross-tab-browser.cjs
node tests/beginner-journey.cjs
node tests/mobile-focus.cjs
node tests/accessibility-browser.cjs --sample
node tests/accessibility-manual.cjs
npm run build
npm run check:distributions
```

Measured results:

- 137 pure Node tests passed, including six arithmetic checks covering distinct denominators, undefined values, invalid inputs and an update that worsens loss.
- All 20 worked/guided/transfer/recall journeys passed in an isolated browser. Practice preserves seeded read/check/lab records; search discovers new concepts. Numeric controls work in the isolated standalone edition and at mobile widths.
- The existing 340-section/48-responsive-route suite, all-11 milestone/ZIP suite, resource/resume/bookmark suite and cross-tab regression suite passed.
- Beginner keyboard/drawer/enlarged-text/no-JavaScript checks and 206 visible, unobscured mobile focus stops passed. An independent reviewer also checked expanded companion content at 320px, keyboard controls and exact code copying.
- The expanded axe sample passed 132 rendered states, including updated math results and open teaching/microtopic disclosures. Targeted engineering checks passed 51 computed contrasts with a minimum of 4.60:1, plus modal, reduced-motion, blocked-storage and standalone cases.
- All 11 ZIPs, 143 source files and embedded source/archive copies match. No lab source was changed in this content pass; no C# build or provider call was needed to verify these authored additions.
- Independent read-only content and implementation reviews found no outstanding important issues.

The full stable-source accessibility sweep passed **474 rendered states**, with zero actionable violations under its configured A/AA and best-practice rules. Automated raw findings and incomplete checks remain available in `.artifacts/`; known enumerated modal SPA-route heuristics are retained with their existing dispositions. This is engineering evidence, not an accessibility certification.

`standalone.html`, `FOUNDATION_LESSONS.md` and `LEARNING_GUIDE.md` were regenerated. New human prose mentioning HTML or generic syntax is escaped for Markdown display; fenced code remains verbatim. Evidence includes `.artifacts/teaching-metrics-mobile.png`, `accessibility-sample.json`, `accessibility-full.json` and `accessibility-engineering.json`.

## Content review sources

The teaching design uses worked examples, independent problems and later recall, consistent with the [IES practice guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/1). Its effectiveness for this website has not been established by a learner study.

Technical review used the actual distributed C# source and the official [ML.NET classification tutorial](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/github-issue-classification), [ML pitfalls guidance](https://learn.microsoft.com/en-us/azure/machine-learning/concept-manage-ml-pitfalls?view=azureml-api-2) and [LLM fundamentals](https://learn.microsoft.com/en-us/agent-framework/journey/llm-fundamentals). External articles are optional references, not additional runtime dependencies or instructions to enable paid services.

## Beginner feedback before the next content pass

No human beginner study has been performed. A suggested small pilot is to ask three .NET developers new to AI to explain one training update, diagnose the 90%-accuracy example, and trace a partial draft after cancellation. Record where they hesitate, whether they need hints and whether they can solve the transfer question without copying. Do not interpret three successful participants as general proof of learning effectiveness.

Use that feedback to adjust explanation length and difficulty before extending these companions to Units 4–11. This is a future content-quality step, not a missing unit or a claim that tests measure understanding. No Git commit or publication is included in this delivery.
