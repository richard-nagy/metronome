import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import checker from "vite-plugin-checker";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
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
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
