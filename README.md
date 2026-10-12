# Metronome

A customizable web metronome for practicing in time. Set the tempo, choose the bar length and subdivisions, and configure the click pattern.

**Live demo:** https://richard-nagy.github.io/metronome/

## Features

- Set the tempo from 40 to 300 BPM and adjust it with the slider or step buttons.
- Choose 2 to 8 beats per bar and optionally show subdivisions and beat numbers.
- Play clicks on every tick, on full beats, or only on the first beat of each bar.
- Configure output volume and an optional count-in.
- Gradually ramp the tempo by a chosen amount after a set number of bars.
- Save settings in the browser and switch between light and dark themes.
- Use the responsive interface on desktop or mobile.

## Run locally

```sh
pnpm install
pnpm start
```

Use `pnpm run dev` to start the Vite development server with the same app.

## Built with

- [React](https://react.dev/) and TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vitest](https://vitest.dev/) for testing
- Hosted on [GitHub Pages](https://pages.github.com/)

