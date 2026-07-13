# Prompt 02b — Design Token Extraction (Stitch)

## Prompt
> Use the Stitch MCP to list projects, locate Luff-Flow, fetch code for Ticket List, Create Ticket, Ticket Details, Search screens. Extract design tokens into DESIGN.md at project root. Do not implement pages yet.

## Reason
Establish a single source of truth for UI before frontend work (Milestone 4). Ensures consistency with the Stitch design system rather than ad-hoc styling.

## AI Response Summary
- Connected to Stitch MCP (`user-stitch`)
- Listed screens in Luff-Flow Ticket Manager (5 screens; 4 target screens identified)
- Retrieved project design system via `get_project` and `list_design_systems`
- Extracted tokens: colors (40+ named tokens), typography (7 scales), spacing (8 values), border radius, elevation, component specs
- Mapped domain-specific status and priority colors
- Produced Tailwind config and CSS variable reference
- Created `DESIGN.md` at project root

## Lessons Learned
- Stitch embeds a full `designMd` in project metadata — richer than parsing HTML alone
- Screen HTML download was blocked by environment security; design system API provided sufficient token coverage
- Domain colors (status/priority) were inferred from design guidelines + semantic naming — need user confirmation
- Keeping DESIGN.md as canonical reference prevents drift between Stitch and implementation
