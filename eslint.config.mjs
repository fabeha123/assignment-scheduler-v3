import pkg from "eslint-config-next";
const { createConfig } = pkg;

export default createConfig({
  // Place any custom rules or overrides here:
  rules: {
    "no-console": "warn",
    // "react/jsx-key": "warn",
    // etc.
  },
});
