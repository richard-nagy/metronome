import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
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
    resolve: {
        alias: {
            react: "preact/compat",
            "react-dom": "preact/compat",
            "react/jsx-runtime": "preact/jsx-runtime",
            "@radix-ui/react-slot": "@bosh-code/preact-slot",
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
