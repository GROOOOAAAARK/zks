// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
            "@typescript-eslint/no-explicit-any": "off"
		},
		extends: ["next/core-web-vitals"],
		parser: "@typescript-eslint/parser",
		plugins: ["@typescript-eslint"],
        ignores: ["test_noir_circuit.ts"]
	},
]);
