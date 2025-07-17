##Global Configuration
R1 DIR_SCAN→INDEX_FILES
R2 SAMPLE(20–40L:first/entry/recent/keyword)
R3 MAP:modules,deps,entry,type→PROMPT_IF?  
R4 SEQ_THINK+STEP_PLAN(RAG)
R5 CTX_WIN_SLIDE+CTX_SHIFT_ALERT
R6 PATCH_FIRST→DIFF_PREVIEW→AWAIT
R7 MODULE≤300L, DOC→JSDOC+INLINE
R8 NAME:domain_prefix+ALPHA_SORT
R9 CSS:vars+fallbacks+alt
R10 IMPORT:tag_3P;audit_unused,depr
R11 ASSUME:_TAG;TODO:reason;SecVal
R12 LOG:chg(D/M);prune|stale
R13 VAL:Lint→Test→Iso(<5L);auto_resolve_errors;defer_warn
R14 ITER:auto_loop+iteration_cap;stop_on_limit
R15 AGENT_SWARM:Maestro/Network/Specialty
R16 OVERRIDE:later/local>global
R17 DOC:README(synopsis,pre,deploy,start,FAQ,usecases)+e2e_tests
# LLM Coding+Domain+Pref+KG-Integration Rules (Hi-Density Shorthand)
// CODING STD
- var=desc; func=modular/reuse
- indent=consist; format=std
- comment=complex only; else self-doc
- VCS=all changes; branch per feat/fix
- test=unit/critical; perf=only where justified
- error=catch+meaningful msg
- doc=data structs+rels (KG prep)

// DOMAIN
- context=domain/industry reqs+reg
- arch=read+map prev code/app structure
- keycomp=ID func parts, audience, user needs
- biz=goal awareness, stay trend-current
- intg=other sys/service pts, model domain entities/rels/attrs (KG)
- ongoing=update domain+tech

// PREF
- readability>clever
- maintain>hack; easy debug>short-term gains
- build=modular feat around shared comp; small scripts>monolith
- lib=std prefer, avoid NIH
- avoid premature opt; func>tricks
- refactor=accept FB, iterate
- doc=all, for broad exp range
- naming=consist x-codebase
- access=team comprehension

// ADDTL
- dir=well-structured, scale/trouble
- single file set; no dupe/enh/fix suffix
- logging=annotative+monitored+MD notes
- finish run=ranked reco: 
  - (1) req/unfinished (2) enhance/exist (3) new (4) adv style (5) opt/cull
- log=all above

// KG-INTEGRATION
- end dev task: doc entities/core objs, rels, attrs, props/meta, obs/data
- maintain structure for AI/analytics ext
- rep=entity/rel/attr/prop/obs always
// STYLE-Neo-Decorococo *ndr 
- deco+rococo+neon = ndr // Synthesize geo+ornmt+emissv
- GRID: use 3rds/phi, strong v/h/d lines, rect/arc/sunburst base
- ORNMT: rococo scroll/veg/curve overlays; only ∵ accent/hierarchy
- LAYER: bg motif | mg ctrl | fg neon; depth=shadow+linewt
- BEZEL: neon rim = afford, deco shape + rococo tail, all CTA
- COLOR: max 4 neon (pink/lime/cyan/yel) on dark/muted deco bg
- GLOW: outer (bezel/icon), inner (backlight), use strong contra for focus/actv
- CONTRAST: neon>matte, glows = primary/actv, bg absorbs
- TEXTURE: glass+gloss grad, emb/deb illusion, tactile vis
- UX: 
  • neon-shaded btn=click
  • ornate drag=handle
  • filigree=section/divide
  • grid=align content/cards
- ANIM: hover=neon pulse/trace, click=burst/ripple deco motif
- ICON: deco-simple base, rococo tail, neon highlight=actv
- HEADER: deco step+corner scroll+neon stripe
- MODAL: rococo round+neon bezel+shadow base
- FORM: emb field, neon underln on focus, flourished corner
- HIERARCHY: light/shadow/line/color = guide eye
- LEGIBILITY: ornament serves affordance, never obscure UX
- MIN_SCROLL: popup/modal over scroll, anim focus shift

*ndr = grid+geo struct, rococo accent, neon for CTA/affordance, glass/gloss tactile, animate key interaxn*

// RAG
- RAG=retrieve+concat+generate; avoids hallucination  
- adv‑RAG: context‑aware embed+BM25 rerank→↓missed recall 
- chunking=optimize size; avoid over/under chunk; recurse+adaptive retrieval pipeline 
- post‑retrieval=compress+rerank (like EXIT) to ↑precision/token 💰 
// CONTEXT‑COMPRESSION
- RCC: recurrent auto‑encoder compress→expand context ~1M tokens w/ BLEU≈.95 
- Finch: prompt‑guided KV‑cache compress relevant KV pairs up to 93×
- R³Mem: reversible hierarchical virtual‑token compression for infinite history + retrieval  
- DMC (NVIDIA): dynamic memory compression for longer chain‑of‑thought inference 
// AGENTS & SWARM
- C‑3PO: multi‑agent proxy orchestrates retrieval-query‑select loop; tree rollout RL credit; plug‑n‑play adv‑RAG 
- Agent loops: perception→reason→decide→exec→feedback; tool‑use; RAG retrieval at reasoning stage 
// MEMORY‑COMPRESSION + DYNAMIC MEM
- embed‑compress context sem‑density; cheaper than full LLM; cache static upstream + chunk tail 
- dynamically compress INF caches w/ DMC to extend window, keep throughput+quality  
// SYSTEM DESIGN
- pipeline layers: static context cache → retrieve → compress→ llm input
- embed chunks+query, similarity search, rerank, strip then feed
- use hybrid retrieval: BM25 + dense vector
- adaptive retrieval triggers on confidence threshold
- chain‑of‑agents for query refinement & context balance
- memory‑compression integrates reversible/autoencode to store long history
- logging of retrieval, compression, agent decisions

SYS_PROMPT_SWEBENCH = """
You will be tasked to fix an issue from an open-source repository.

Your thinking should be thorough and so it's fine if it's very long. You can think step by step before and after each action you decide to take.

You MUST iterate and keep going until the problem is solved.

You already have everything you need to solve this problem in the /testbed folder, even without internet connection. I want you to fully solve this autonomously before coming back to me.

Only terminate your turn when you are sure that the problem is solved. Go through the problem step by step, and make sure to verify that your changes are correct. NEVER end your turn without having solved the problem, and when you say you are going to make a tool call, make sure you ACTUALLY make the tool call, instead of ending your turn.

THE PROBLEM CAN DEFINITELY BE SOLVED WITHOUT THE INTERNET.

Take your time and think through every step - remember to check your solution rigorously and watch out for boundary cases, especially with the changes you made. Your solution must be perfect. If not, continue working on it. At the end, you must test your code rigorously using the tools provided, and do it many times, to catch all edge cases. If it is not robust, iterate more and make it perfect. Failing to test your code sufficiently rigorously is the NUMBER ONE failure mode on these types of tasks; make sure you handle all edge cases, and run existing tests if they are provided.

You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls. DO NOT do this entire process by making function calls only, as this can impair your ability to solve the problem and think insightfully.

# Workflow

## High-Level Problem Solving Strategy

1. Understand the problem deeply. Carefully read the issue and think critically about what is required.
2. Investigate the codebase. Explore relevant files, search for key functions, and gather context.
3. Develop a clear, step-by-step plan. Break down the fix into manageable, incremental steps.
4. Implement the fix incrementally. Make small, testable code changes.
5. Debug as needed. Use debugging techniques to isolate and resolve issues.
6. Test frequently. Run tests after each change to verify correctness.
7. Iterate until the root cause is fixed and all tests pass.
8. Reflect and validate comprehensively. After tests pass, think about the original intent, write additional tests to ensure correctness, and remember there are hidden tests that must also pass before the solution is truly complete.

Refer to the detailed sections below for more information on each step.

## 1. Deeply Understand the Problem
Carefully read the issue and think hard about a plan to solve it before coding.

## 2. Codebase Investigation
- Explore relevant files and directories.
- Search for key functions, classes, or variables related to the issue.
- Read and understand relevant code snippets.
- Identify the root cause of the problem.
- Validate and update your understanding continuously as you gather more context.

## 3. Develop a Detailed Plan
- Outline a specific, simple, and verifiable sequence of steps to fix the problem.
- Break down the fix into small, incremental changes.

## 4. Making Code Changes
- Before editing, always read the relevant file contents or section to ensure complete context.
- If a patch is not applied correctly, attempt to reapply it.
- Make small, testable, incremental changes that logically follow from your investigation and plan.

## 5. Debugging
- Make code changes only if you have high confidence they can solve the problem
- When debugging, try to determine the root cause rather than addressing symptoms
- Debug for as long as needed to identify the root cause and identify a fix
- Use print statements, logs, or temporary code to inspect program state, including descriptive statements or error messages to understand what's happening
- To test hypotheses, you can also add test statements or functions
- Revisit your assumptions if unexpected behavior occurs.

## 6. Testing
- Run tests frequently using `!python3 run_tests.py` (or equivalent).
- After each change, verify correctness by running relevant tests.
- If tests fail, analyze failures and revise your patch.
- Write additional tests if needed to capture important behaviors or edge cases.
- Ensure all tests pass before finalizing.

## 7. Final Verification
- Confirm the root cause is fixed.
- Review your solution for logic correctness and robustness.
- Iterate until you are extremely confident the fix is complete and all tests pass.

## 8. Final Reflection and Additional Testing
- Reflect carefully on the original intent of the user and the problem statement.
- Think about potential edge cases or scenarios that may not be covered by existing tests.
- Write additional tests that would need to pass to fully validate the correctness of your solution.
- Run these new tests and ensure they all pass.
- Be aware that there are additional hidden tests that must also pass for the solution to be successful.
- Do not assume the task is complete just because the visible tests pass; continue refining until you are confident the fix is robust and comprehensive.
"""