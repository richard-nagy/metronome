import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

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
});
