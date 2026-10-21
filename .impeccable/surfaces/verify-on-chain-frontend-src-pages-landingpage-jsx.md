---
version: 1
slug: "verify-on-chain-frontend-src-pages-landingpage-jsx"
primary_target: "verify_on_chain_frontend/src/pages/LandingPage.jsx"
related_targets: ["verify_on_chain_frontend/src/index.css","verify_on_chain_frontend/src/App.jsx"]
---

# Landing page (and app-wide world)

Scope: `/` landing first (Persuade); the same world then carries Verify, Login, University and Admin dashboards (Operate, restrained). Audience: project examiners opening the hosted link on their own laptops in daylight. Action: verify a certificate. Proof: the live hash mechanism itself, no invented stats. Avoid: crypto/neon, generic SaaS, playful.

## Direction contract

THESIS: VerifyOnChain is security printing moved from ink to the hash. It refuses the dark-navy crypto hero with a centred headline over three icon cards.

OWN-WORLD: Mint security-paper ground (#e3ece6), intaglio green ink (#10362f) for text and rules, oxblood (#7a1f2b) only for serial numbers and revocation, umber for not-found. Double-rule frames, microtext borders, guilloché rosettes drawn from data. Bodoni Moda engraved display, Libre Franklin body, Courier Prime for hashes, IDs and addresses only. Square corners, one hairline weight.

STORY: An examiner sees that changing one field breaks the fingerprint, understands that only the hash is stored, then verifies a real certificate or logs in as a university.

FIRST VIEWPORT: The viewport is one framed sheet with a microtext border. Left: the headline at display scale, one line of subcopy, a primary "Verify a certificate" action and a secondary University login. Right: a SPECIMEN certificate whose fields can be edited. Its keccak-256 hash prints as an oxblood serial, and a guilloché rosette is generated from the hash bytes. Editing any field redraws the rosette and flips the state to "Does not match specimen".

FORM: Security printing, my own list position 1 (pick card). seed:4a5657c76c9c82bb

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: the hash-seeded guilloché rosette redraws as fields change. Motion grammar: line-drawing (stroke-dashoffset) on rosette redraw, nothing slides.
