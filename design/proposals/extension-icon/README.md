# Extension icon proposals

Prepared 26 October 2026 for owner selection. **No proposal is installed.**

## Current review: nine designs

The owner requested all three layouts at all three stroke weights: original, halfway between, and slim. The [live comparison](compare.html) and [matrix image](comparison-matrix.png) show all nine with stable cell IDs. Final selection is by cell, such as C2; no layout or weight is selected yet.

| Layout | 1 · Original | 2 · Middle | 3 · Slim |
| --- | --- | --- | --- |
| A · SD | [A1](matrix/a-original.svg) | [A2](matrix/a-middle.svg) | [A3](matrix/a-slim.svg) |
| B · [SD] | [B1](matrix/b-original.svg) | [B2](matrix/b-middle.svg) | [B3](matrix/b-slim.svg) |
| C · Compact [SD] | [C1](matrix/c-original.svg) | [C2](matrix/c-middle.svg) | [C3](matrix/c-slim.svg) |

Within a row, layout, scale, spacing and colors are identical. Only stroke thickness changes: original uses the native outlines, middle applies a 1-glyph-unit background stroke, and slim applies a 2-unit stroke. This makes the main approximately 8.32-unit stem respectively 8.32, 7.32 and 6.32 units wide. These are geometric outline refinements, not three separate font files or CSS font weights. All nine have PNG exports at 16, 32, 128 and 1024 pixels under `matrix/`.

## Earlier comparisons

- [Revised A: slimmer SD](sd-slim.svg), using the larger central letters on a square header-lime background.
- [Revised B: slimmer bracketed SD](bracket-sd-slim.svg), with the logo’s bracket opacity.
- [C: compact bracketed SD](compact-bracket-sd-slim.svg), an intermediate layout requested by the owner: larger letters than B with narrower brackets. The comparison places C between A and B.
- [Side-by-side size comparison](compare.html).
- [Revised comparison image](comparison-slim.png), including previous/revised samples at the same size.
- [Three-option comparison image](comparison-three.png), showing A, C and B at toolbar and larger sizes.

All three start from the outlined VT323 glyphs in the existing [brand banner](../../assets/slotdesk-banner.svg), ink `#15160A`, background `#D8E84A`, bracket opacity 55%. On 26 October the owner requested slimmer lettering because the enlarged icon letters looked heavier than the extension wordmark. The revised vectors apply a 2-glyph-unit background stroke over each outline, reducing an approximately 8.32-unit main stem to 6.32 units without changing layout or substituting another font. These are deliberately thinned outlines, not a different VT323 font weight. Font license: [VT323](../../../extension/fonts/LICENSE-VT323.txt).

Original [SD](sd.svg), [bracketed SD](bracket-sd.svg) and [comparison](comparison.png) remain for reference. Revised PNG exports are provided at 16, 32, 48, 128 and 1024 pixels. Inspect both the browser-rendered native-size samples and raster exports before choosing an option; small-size legibility remains part of owner review.

**0.9.5 scope:** the owner requested shipping the selected icon in 0.9.5. Final selection remains pending from the nine-cell matrix. Prepare/inspect the needed PNG sizes and wire toolbar, extension-manager and extension-page/favicon references in that release; store publication is not a prerequisite. Keep listing artwork and store-specific requirements as a separate distribution task. No manifest or installed icon is changed by these proposals.

C retains the same slimmer glyph contours, colors and bracket opacity. Its letter scale lies between A and B; only its brackets have a narrower horizontal proportion. C has PNG exports at 16, 24, 32, 48, 128 and 1024 pixels.
