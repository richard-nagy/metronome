import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        tailwindcss(),
        preact(),
        checker({
            typescript: true,
        }),
    ],
    server: {
        hmr: true,
    },
    test: {
        globals: true,
        environment: "jsdom",
    },
});
