---
name: blog-cover-generator
description: Generate, refine, and prepare article cover images for the BUG1024 personal site and digital garden. Use when an AI agent is asked to create a blog cover, article hero image, social sharing image, visual concept, or cover variants for BUG1024 content about work, systems, AI, engineering, life, family, time, photography, or personal experience. Preserve the site's restrained ink, mist-white, and steel-blue identity; prefer editorial metaphor, quiet technical photography, or documentary still-life over title-card graphics, stock imagery, cyberpunk, or generic AI motifs.
---

# BUG1024 Blog Cover Generator

Create a visual interpretation of an article, not a second title block. Let the image establish tone and metaphor while the article title carries the argument.

## Required references

Read both files before choosing a visual direction:

- [brand-system.md](references/brand-system.md) for fixed brand and production rules.
- [visual-directions.md](references/visual-directions.md) for direction selection and prompt patterns.
- [runtime-adapters.md](references/runtime-adapters.md) for selecting the available image-generation runtime without changing the visual system.

For work inside the `jeet-blog` repository, also read `AGENTS.md`, `docs/content/article-authoring.md`, and `docs/brand/bug1024-identity.md` completely. Repository rules override this skill if they later change.

## Workflow

1. Read the full article or the user's complete outline. Do not infer a cover from the title alone.
2. Extract a visual brief containing:
   - the concrete subject;
   - the central tension or relationship;
   - one visual metaphor or real scene;
   - the intended emotional temperature;
   - objects and clichés to exclude.
3. Decide whether a generated cover is justified:
   - Prefer the author's own relevant photograph when one exists.
   - Use the site's default steel-blue coordinate panel when no honest visual concept exists.
   - Generate only when the image materially interprets the article rather than merely filling space.
4. Select exactly one direction from `references/visual-directions.md`. Default to restrained editorial illustration. Generate variants only when the user requests comparison.
5. Shape a production prompt using the brief and brand rules. Never place the article title, BUG1024 wordmark, pseudo-code, UI labels, or decorative typography inside the image.
6. Select the image-generation runtime described in `references/runtime-adapters.md`. Keep the visual brief and acceptance rules identical across platforms.
7. Inspect the result at full size and as a small thumbnail. Reject it if it contains illegible text, watermarks, generic robot imagery, neon technology effects, stock-photo mannerisms, excessive steel blue, or more than one dominant visual anomaly.
8. Iterate with one targeted change at a time. Preserve the approved subject, composition, palette, and mood between iterations.
9. Prepare the selected raster with `scripts/prepare_cover.py` at `2400 × 1800`, sRGB-compatible RGB, and WebP output. Use `cover` cropping unless the composition depends on its edges.
10. For `jeet-blog`, save the final asset as `static/images/article/<slug>-cover.webp` unless the user gives another path. Do not overwrite an existing cover without explicit permission.
11. Write objective alt text describing visible content. Write a caption only when it records a real place, date, source, or concrete observation; do not invent documentary metadata for generated art.
12. Before adding front matter, inspect the active article template. If it does not render the documented `cover` contract, say so and either implement support when authorized or leave the asset unreferenced. Never claim the cover is live when the template ignores it.
13. Report the selected direction, final prompt, saved path, dimensions, and whether the cover has been connected to the article.

## Prompt skeleton

Use only useful lines and keep the prompt compact:

```text
Use case: <stylized-concept or photorealistic-natural>
Asset type: BUG1024 article cover, 4:3 landscape
Article premise: <one factual sentence>
Primary request: <one scene or metaphor>
Style/medium: <selected direction>
Composition/framing: one clear focal relationship, generous breathing room, readable at thumbnail size, no text area required
Lighting/mood: restrained, observant, quiet confidence; not dramatic or sentimental
Color palette: ink #111A21, mist white #F8FAF9, muted neutrals; steel blue #365B6D only as one small structural accent when justified
Constraints: no words, letters, numbers, logo, title, watermark; one dominant visual anomaly at most
Avoid: cyberpunk, neon blue, holograms, humanoid robots, glowing brains, circuit-board clichés, server-rack literalism, glossy corporate stock photography, cinematic spectacle, motivational-poster mood
```

## Delivery rules

- Produce one finished cover by default, not a contact sheet.
- Keep source truth intact when editing an author photograph; do not create objects or alter documentary meaning.
- Do not add the BUG1024 logo to article covers. The website header already carries the identity.
- Do not force steel blue into a naturally warm or documentary image. Brand unity comes primarily from restraint, composition, and tone.
- Treat `4:3` as the canonical article-cover ratio. Create separate social crops only when requested, derived from the same visual concept.
- Do not commit, publish, or change article templates unless the user explicitly asks.
- Treat this repository folder as the canonical skill source. Platform-specific installations should link to or package this folder rather than maintain divergent copies.

## Cover preparation

Run:

```bash
python3 scripts/prepare_cover.py INPUT OUTPUT --fit cover --focus-x 50 --focus-y 50
```

Use `--fit contain` only when the whole composition must remain visible. Run `python3 scripts/prepare_cover.py --help` for all options.
