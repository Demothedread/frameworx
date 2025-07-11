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

// *ndr = grid+geo struct, rococo accent, neon for CTA/affordance, glass/gloss tactile, animate key interaxn*

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