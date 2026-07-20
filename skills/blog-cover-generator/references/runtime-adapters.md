# Runtime adapters

The brand system, visual brief, prompt, rejection test, and output preparation are platform-independent. Only the image-generation call changes.

## Runtime selection

Use the first available option that the user has authorized:

1. A platform-native image-generation tool.
2. An installed image-generation skill, plugin, MCP tool, or connector.
3. An API-backed image generator already configured in the environment.
4. Prompt-only delivery when no generation runtime is available.

Never silently install a paid service, expose credentials, or switch to a lower-quality model. Explain the missing runtime and ask before expanding scope.

## Codex adapter

- Use the built-in `image_gen` tool by default.
- Follow the installed `$imagegen` skill for input-image handling, generation versus editing, project-bound save paths, inspection, and iteration.
- Generate first, then copy the selected output into the repository and run `scripts/prepare_cover.py`.
- Do not assume a filesystem destination parameter exists on the built-in tool.

## OpenAI API adapter

- Use only when the environment already has an authorized API key or the user explicitly requests an API implementation.
- Keep model selection and request parameters outside the core brand files so they can evolve independently.
- Save the raw generated image to a temporary or versioned project path, inspect it, and then run `scripts/prepare_cover.py`.
- Do not hard-code credentials into the repository.

## Other agent or image-service adapter

- Convert the shared prompt skeleton into the service's supported prompt format without weakening the constraints.
- Preserve the exact 4:3 composition request, no-text rule, brand palette behavior, and rejection test.
- If the service cannot accept negative constraints, incorporate the most important prohibitions into the primary scene description and validate more strictly afterward.
- If the service cannot generate images directly, return the visual brief and final production prompt as the deliverable; do not pretend an image was created.

## Platform installation

The canonical files live at `skills/blog-cover-generator/` in the blog repository.

- Codex may link this folder into `~/.codex/skills/blog-cover-generator`.
- Other agents may link or package the same folder in their own discovery location.
- Do not copy and edit separate platform versions. Put shared changes here; keep truly platform-specific metadata or wrappers isolated from the core instructions.
