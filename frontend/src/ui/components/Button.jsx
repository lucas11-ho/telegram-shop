// Backwards-compatible shim.
// Some pages import Button from "./Button" while others import from "./Buttons".
// Keep both working.

export { Button } from "./Buttons.jsx";
