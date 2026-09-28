# Output Plan: playminicrossword.com

## Target Mapping
- **URL:** `https://www.playminicrossword.com/`
- **App Root:** `.`
- **Site Key:** `playminicrossword-e18f0d8c`
- **Page Key:** `root-0000002f`
- **Destination Route:** `src/app/page.tsx` (Replacing scaffold)

## Artifact & Asset Roots
- **Artifact Root:** `docs/research/playminicrossword-e18f0d8c/root-a9b2c3d4/`
- **Screenshot Root:** `docs/design-references/playminicrossword-e18f0d8c/root-a9b2c3d4/`
- **Component Root:** `src/components/sites/playminicrossword-e18f0d8c/root-a9b2c3d4/`
- **Shared Component Root:** `src/components/sites/playminicrossword-e18f0d8c/shared/`
- **Asset Root:** `public/sites/playminicrossword-e18f0d8c/root-a9b2c3d4/`
- **Shared Asset Root:** `public/sites/playminicrossword-e18f0d8c/shared/`

## Shared Foundation Changes
- **Fonts:** Add 'Outfit' (Sans) and 'Fraunces' (Serif) to `src/app/layout.tsx`.
- **Colors:** Update `src/app/globals.css` with oklch tokens extracted from the site.
- **Global Styles:** Implement site-wide spacing and typography tokens.

## Route Preservation
- Only `src/app/page.tsx` (scaffold) is being replaced. All other potential routes are preserved.
