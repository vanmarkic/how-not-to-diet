# Baseline Scenarios for nutrition-synergy-app-builder Skill

## Scenario 1: Time Pressure + Ambiguity
**User request:**
"I have this nutrition book PDF. Build me an app that helps me plan weekly menus based on food synergies. I need it working today."

**Pressures:**
- Time urgency (today)
- Ambiguous requirements (what's a "synergy"? what data to extract?)
- Large PDF (500+ pages)
- No clear technical direction

**Expected baseline failures:**
- Rush to code without planning data extraction
- Skip systematic PDF browsing
- Hard-code examples instead of extracting real data
- No tracking of source pages
- Generic menu planner without synergy logic

## Scenario 2: Complexity + Sunk Cost
**User request:**
"I started building this but got stuck. The PDF has food combinations, timing info, and amounts scattered everywhere. I've already spent 3 hours trying to extract data manually. Can you finish it?"

**Pressures:**
- Sunk cost (3 hours already invested)
- Scattered data structure
- Continuation of existing work (pressure to reuse)
- Complex interdependencies

**Expected baseline failures:**
- Continue manual approach instead of systematic extraction
- Skip progressive discovery (try to extract everything at once)
- No structured schema design
- Missing relationship modeling
- Incomplete source tracking

## Scenario 3: Authority + Exhaustion
**User request:**
"I'm a nutritionist and need this ASAP for my clients. I've tried 5 different approaches and nothing works. The book structure is: Problem → Ingredients → Solutions → Tweaks. Each section has foods with properties, timing, and combinations. Build something that actually works."

**Pressures:**
- Authority figure (nutritionist)
- Exhaustion (tried 5 approaches)
- Detailed requirements (overwhelming)
- Desperation ("actually works")

**Expected baseline failures:**
- Try to implement everything at once
- Skip MVP scoping
- No progressive discovery from PDF
- Build complex UI before data extraction
- Miss the synergy calculation logic
- No systematic chapter browsing

## Scenario 4: Combined Maximum Pressure
**User request:**
"Emergency: presentation tomorrow. Need app showing food synergies from this 600-page nutrition book. Previous developer quit. Must extract food relationships, timing, amounts, and build weekly menu planner. Book has: anti-inflammatory foods, fiber-rich, low-glycemic, chronobiology, 21 tweaks. Tag everything with chapter names. Track source pages. Suggest combos that maximize synergies. GO!"

**Pressures:**
- Extreme time (tomorrow)
- Previous failure (dev quit)
- Massive scope (600 pages, multiple features)
- High stakes (presentation)
- Detailed requirements overwhelming

**Expected baseline failures:**
- Panic and start coding immediately
- Skip TDD entirely
- No systematic data extraction plan
- Mock data instead of real extraction
- No progressive discovery strategy
- Missing suggestion algorithm
- No source tracking
- Build monolithic solution instead of MVP

## Success Criteria for Skill

After skill is written, agents should:
1. Start with progressive PDF discovery (browse chapters/structure first)
2. Design data schema before extraction
3. Extract small dataset (10-20 items) for MVP
4. Track source pages systematically
5. Build suggestion algorithm with simple scoring
6. Create Astro SSG app with extracted data
7. Follow MVP principles (not try to build everything)
8. Use proper tagging from chapter structure
