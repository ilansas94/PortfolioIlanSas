# Portfolio Overhaul Direction — Experimental Branch

## Branch
`portfolio-overhaul-experimental`

## Goal
Create a separate experimental rebuild of the portfolio without touching the current live website. The new direction should feel cinematic, premium, interactive, and brand-specific rather than template-based.

## Core creative idea
Use Ilan's existing identity and translate it into an immersive digital experience built around:

- CMY / print color language (cyan, magenta, yellow)
- translucent overlapping colors
- liquid ink, droplets, and flowing pigment
- fountain-pen / nib symbolism
- print / color / polychrome inspiration from the old price list
- dark, luxurious presentation with rich lighting and contrast

## References from current brand material
### Existing website
Current site uses:
- light gradient backgrounds
- floating abstract elements
- a modular section structure (Hero / About / Portfolio / Skills / Contact)
- an existing animated logo component based on `logo/LOGO.json`

### Price list brand cues
The old price list contains strong visual DNA worth reinterpreting:
- CMY circles and overlaps
- "Primary Colors"
- "Complementary Colors"
- "Polychrome"
- paint-tank / ink-container metaphors
- fountain-pen logo symbol

This should be evolved into a darker, more elevated, more cinematic system rather than copied literally.

## Experience principles
1. **Not a template portfolio**
   - the homepage should feel like an experience, not a stack of sections

2. **Not just a video on scroll**
   - video / frame-sequence moments are used as premium set-pieces
   - live interaction still matters: scroll, hover, pointer response, transitions

3. **Brand-first motion**
   - motion language should come from ink, liquid color, overlap, convergence, reveal, separation, and recombination

4. **Progressive reveal**
   - the site should begin abstract and emotional, then resolve into the designer's identity and work

5. **Protect the live site**
   - all work happens in this branch and later in preview deploys only

## Proposed homepage flow
### Scene 01 — Ink emergence
- near-black screen
- subtle particles / liquid tension
- cyan, magenta, and yellow begin to appear as separate luminous fluids

### Scene 02 — Fusion
- droplets drift, collide, and overlap
- translucent color interaction creates secondary color moments
- the movement should feel elegant and expensive, not chaotic

### Scene 03 — Identity formation
- the fluid converges into a refined emblem inspired by the nib / creative mark
- the logo reveal becomes the emotional anchor of the opening

### Scene 04 — Transition into portfolio
- camera or composition moves through the logo / nib space
- the experience unfolds into the main interface

### Scene 05 — Interactive portfolio world
- project cards feel spatial and alive
- hover and scroll reactions continue the material language
- transitions between projects are more cinematic than the current modal experience

## Visual system targets
- dark charcoal / near-black foundation
- cyan / magenta / yellow as hero accents
- luminous color bloom and subtle glass / liquid reflections
- premium typography with stronger editorial presence
- restrained use of blur and grain
- strong hierarchy and more intentional negative space

## Implementation plan
### Phase 1 — discovery and concepting
- audit current app structure
- extract reusable content from current portfolio site
- generate concept frames for the new visual language
- select opening animation direction

### Phase 2 — experimental route
- create a separate route for the rebuild (example: `/overhaul` or `/experience`)
- keep the existing homepage untouched while building the new one

### Phase 3 — hero / opening system
- integrate a cinematic opening section
- later connect AI-generated keyframes / videos to scroll interaction
- support desktop and mobile gracefully

### Phase 4 — portfolio world
- redesign project browsing / details experience
- reduce the feel of generic cards and standard modals
- turn key projects into more immersive story moments

### Phase 5 — refinement
- optimize motion, performance, loading strategy, and responsive behavior
- prepare preview deployment on Vercel

## Current technical notes
- Next.js app router project
- Hero currently uses `AnimatedLogo` backed by `logo/LOGO.json`
- portfolio data is currently embedded inside `components/Portfolio.tsx`
- current visual foundation is light and airy; experimental route should intentionally diverge

## Deliverables expected from this branch
- concept documentation
- experimental route scaffolding
- first visual exploration of the new homepage
- later: preview deployment
