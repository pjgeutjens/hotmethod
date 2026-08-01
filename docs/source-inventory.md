# Source inventory

| Material | Source | Used for |
|---|---|---|
| Definitive Batch 1 roster | User-provided list, 1 Aug 2026 | `src/_data/graduates.json` |
| Graduate portrait folder | User-provided Google Drive folder | Anonymous camera filenames; superseded for Batch 1 and not published |
| Eleven labelled graduate portraits | `https://nadpilatesbarre.my.canva.site/bentangbahagiaxashta-partnership` plus owner reuse direction, 1 Aug 2026 | Local WebP portraits for every Batch 1 graduate represented in the proposal; Noor remains pending |
| Batch 1 recap reel | `https://www.instagram.com/p/DZgQQQ0TQ_A/` | Training hero frame, campaign mark and tone |
| Reel ownership | Public Instagram profile data, read 1 Aug 2026 | Reel is owned by `@getfitwitheboonad` and co-authored by `@eboonad` |
| Batch 1 workshop facts | Nadya Rudianto's public LinkedIn post, read 1 Aug 2026 | Strong Hot Pilates ran 05–07 Jun 2026, 09:00–16:00, at Union Yoga, led by Nadya |
| Batch 1 hero image | User-supplied image, 1 Aug 2026 | Opening hero; bottom Instagram interface strip cropped without altering the retained image, then optimized locally as `batch-1-hero.webp` |
| Workshop promo artwork | `https://nadpilatesbarre.my.canva.site/thehotmethod` | Social image and campaign palette cross-check |
| Wordmark flame glyph | Published Hot Method mark plus Tabler Icons `flame` outline (MIT) | Inline SVG replacing both “O” characters in the compact header and footer mark |
| Nad profile mark | `https://www.instagram.com/getfitwitheboonad/` | Palette taupe; separately repurposed as the eboonad favicon |
| Current workshop details | `https://www.eboonad.com/#hot-method` | Sister-site handoff rather than duplicated date, price, or assessment copy |

## Copy provenance

The roster deliberately keeps copy minimal. `src/_data/copy.json` maps its
descriptive hero and batch labels to the owner's 1 Aug 2026 direction and maps
the handoff to eboonad's published Hot Method section. Names and the count of
twelve come from the user-confirmed definitive roster. Batch 1 is an opening
milestone; the `batches.json` plus `batchId` model gives future cohorts the same
presentation.

Functional labels such as “Explore the batches” and navigation names are
descriptive controls rather than promotional claims. The first draft's slogans,
method explanation, manifesto, and workshop pitch were removed on 1 Aug 2026 so
the main eboonad site can remain the single source of program copy.

## Campaign-derived palette

The swatches are sampled from the collaborative Batch 1 reel, the published Hot
Method promo artwork, and the current `@getfitwitheboonad` profile mark:

| Token | Hex | Source role |
|---|---:|---|
| Campaign ink | `#140E0A` | Near-black/brown field in the promo cover |
| Campaign espresso | `#4B3225` | Warm studio wood and promo photography |
| Campaign clay | `#855440` | Accessible bridge between the promo's espresso wood tones and studio taupes |
| Brand flame | `#A45F45` | Slightly brighter owner-directed clay for the small wordmark glyphs and favicon |
| Campaign taupe | `#93847A` | Nad profile-picture ground |
| Campaign parchment | `#ECEBEA` | Hot Method wordmark and warm light text |

The brighter campaign red remains visible inside source photography, but is not
used as a website interface color. The source colors are translated into
semantic CSS tokens and contrast-checked combinations; the website does not
treat sampled photograph colors as arbitrary decoration. Campaign clay has a
6.29:1 contrast ratio against white and 5.50:1 against the paper background.
