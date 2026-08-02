# Hot Method design decisions

## Sister-site boundary

The Hot Method is an independently buildable Eleventy graduation roster.
`eboonad.com` remains the canonical source for the program explanation, Nadya
Rudianto, current workshop details, booking, and contact. The sister site does
not duplicate that material.

The production hostname is `https://hotmethod.eboonad.com/`. A
project-path-aware, `noindex` review build is published separately at
`https://pjgeutjens.github.io/hotmethod/`; environment-backed build settings
keep that temporary URL out of the eventual production configuration.

The permanent subject is The Hot Method, not Batch 1. Cohorts live in
`src/_data/batches.json`, and every graduate links to a batch through `batchId`.
Batch 1 is the opening milestone, while future batches receive equal structural
and visual prominence.

Graduate cards are intentionally unnumbered. The roster source establishes
membership but no public rank, certification order, or ordinal meaning; array
order is only a content-management detail.

Within each batch, graduates render alphabetically by public `displayName`.
Preferred names control presentation, so Kay Putri is listed under K. The
Eleventy filter sorts at build time and a generated-site test locks the rule.

Workshop date, venue, location, and graduate count belong to the batch record,
not surrounding prose. This gives every future cohort the same factual metadata
and keeps dates independently sourceable.

## Meridian adaptation

The site follows Meridian's editorial hierarchy, semantic token discipline,
hairline separation, restrained use of cards, accessible focus treatment, 44px
touch targets, and reduced-motion behavior. It deliberately diverges in tone:

- near-black is the primary field rather than a secondary palette;
- roasted clay is the singular heat accent, keeping the identity warm without
  letting the campaign's brighter red dominate the interface;
- espresso and taupe provide warm supporting surfaces;
- graduate cards are justified because they are one repeated record type;
- no decorative rings or invented progress indicators are used.

Hairlines are reserved for major page and section boundaries. The published
batch count, workshop metadata, and graduate names use spacing rather than
additional horizontal rules so these adjacent elements do not create a stacked
grid of competing lines.

The compact header and footer mark place the Tabler outline flame in both “O”
positions, matching the published Hot Method wordmark. The MIT-licensed SVG path
is embedded directly so the site does not load an icon font for one glyph. The
same outline is the site favicon, set on campaign ink for reliable browser-tab
contrast. A dedicated brighter-clay token keeps the small flame legible without
changing the broader brown-led interface palette.

## Graduate portraits

The twelve names are authoritative user-provided data. The anonymous Drive
folder remains unassigned. On 1 Aug 2026, the owner instead directed the site to
reuse portraits from the labelled certified-team grid in the Bentang Bahagia x
Ashta partnership proposal. Eleven proposal labels correspond to the confirmed
Batch 1 roster; their source labels remain in `graduates.json` while the
definitive roster names control public presentation. On 2 Aug 2026, the owner
identified the Google Photos file `IMG_4650.jpg` as Noor Anugrahandina; that
explicit mapping supplies the twelfth portrait. Its studio background is
adapted to the same campaign-brown field as the proposal portraits so the card
belongs to the set. The site must never infer an identity from facial
similarity.

At the owner's direction on 2 Aug 2026, the pale garment fabric in Aisha
Kirana's, Angie Ayu Natasha's and Jane Haryono's portraits is adapted to the
campaign's dark ink. Each original garment silhouette remains intact; no logo
is added, keeping Noor from becoming the only graduate without branded apparel.

## Content boundary

The public site contains only factual roster language, source-backed batch and
media details, and a quiet handoff to eboonad. `src/_data/copy.json` holds the
small amount of interface copy and records a source for every block. The removed
method, manifesto, and workshop sections belong on eboonad.

The public workshop source describes The Hot Method as professional development,
not foundational teacher training. The roster therefore uses “graduates” from
the user-confirmed list without claiming that the program confers a new
foundational teaching qualification.
