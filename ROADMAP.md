# NextSet roadmap

## Shipped first slice
- Four tabs: Programs, Train, Analytics, Nexus.
- Programs offers At-Home PPL by Siah, r/Fitness Basic Beginner Routine, and Dumbbell Stopgap, with source links, equipment, schedules, and progression notes.
- Committing opens a personal intention screen and requires typing I agree. New commitments are also checked on the server.
- Multiple commitments have independent logs; switch with program buttons or swipe the active card. Analytics currently cover the active program.
- Train becomes the initial page for committed users, resumes drafts or previews the next incomplete workout, and shows a consecutive calendar-week streak.
- Rest timer and plate calculator live within Train. Existing workout history and progress live in Analytics.
- Analytics: this week's completed workouts, external-load volume, new PRs, latest PR, weekly comparison, and primary exercise muscle coverage.
- Nexus has a clearly marked development page; it does not simulate AI responses.

## Next slices
1. More real coach-created programs, each with its own saved workout namespace, author information, equipment, difficulty, and program details. Do not invent coach endorsements or publish programs without source permission.
2. Expand the coach library and improve multi-program navigation; keep the one-program recommendation.
3. Advanced weekly reports and a transparent strength score with a defined baseline and confidence limits; improve the muscle tracker with exercise-specific direct/indirect coverage.
4. Deferred for now: connect Nexus to an AI service with private, user-consented training context. Offer substitutions, explanations, and log reviews; recommendations must never silently change workout weights or plans.

## Validation
TypeScript/production build, iPhone-width browser checks, saved-program API authorization and origin checks, calendar-week streaks, PR baselines, load conversion, and draft exclusion.

