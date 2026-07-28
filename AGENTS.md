<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:spacecraft-3d-custom-rules -->
# Spacecraft 3D - Custom Project Rules & Guardrails

When working on this codebase (`spacecraft-3d`), all AI assistants and developers MUST follow these invariant rules:

## 1. Error Boundary Auto-Recovery Rule (CRITICAL)
- **Rule:** Never automatically reset domain state modes (e.g. `useStore.setState({ appMode: "3d-room" })`) inside error boundary handlers (`error.tsx`, `SceneErrorBoundary`, etc.).
- **Rationale:** Transient WebGL/React Three Fiber suspense warnings or unmount races during mode transitions (such as switching to `360-photo` mode) will trigger the error boundary. Forcing state back to default ejects the user from their selected mode and creates a visual loop ("page refreshing"). Error boundaries should only perform safe UI recovery or retry rendering (`reset()`) while preserving the active domain mode.

## 2. R3F `<Environment>` & Lighting Mounting Consistency Rule
- **Rule:** Never place Drei's `<Environment>` or core lighting components (`<DynamicLighting />`) inside mode-conditional JSX blocks (e.g. `{appMode === '3d-room' && <Environment />}`).
- **Rationale:** Unmounting and immediately remounting `<Environment>` across scene transitions triggers texture disposal and suspense promise reloading in the exact same render frame. This causes WebGL texture binding races and crashes. Keep `<Environment>` and lighting mounted continuously at the `<RoomScene>` root level.

## 3. Dynamic Tour Nodes Null-Safety Invariant
- **Rule:** Always use optional chaining (`.?`) when accessing properties of dynamic 3D scene objects, tour nodes, or camera lookups from Zustand stores (e.g. `currentNode?.id`, `currentNode?.position?.x`).
- **Rationale:** During floor switching, defurnished mode toggling, or async texture loading, node objects can be transiently `undefined` for a render frame. Missing optional chaining throws uncaught TypeErrors in React.

## 4. Git Checkpoint & Recovery Cheatsheet
- **Rule:** The known stable working checkpoint of this application is tagged as `v2.0-STABLE` and backed up on branch `backup-v2.0-stable`.
- **Command to revert:** If regressions occur, revert to the stable checkpoint using:
  ```bash
  git reset --hard v2.0-STABLE
  # OR
  git checkout backup-v2.0-stable
  ```
<!-- END:spacecraft-3d-custom-rules -->
