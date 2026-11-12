# Power Tracker

Power Tracker is a simple workout timer for tracking how long each set takes, how long you rest between sets, and how many repetitions you complete.

## Features

- Start and time each workout set.
- Record repetitions for every set (optional).
- Automatically switch between work and rest timers with one click.
- View the work time, rest time, and repetitions for each completed set.
- See live averages for work time and rest time, plus total repetitions.
- Delete an individual set or reset the entire session.
- Finish a workout to view a summary of the session.
- Restore the current session after refreshing the page.
- Use keyboard shortcuts:
  - `Space` - start, finish, or begin the next set
  - `F` - finish the workout
  - `R` - open the reset confirmation

## How to use

1. Select **Start Set 1** to begin the work timer.
2. Enter the number of repetitions completed, if desired.
3. Select **Finish & Rest** when the set is complete.
4. Select **Start Set** when you are ready to begin the next set.
5. Repeat until the workout is complete.
6. Select **Finish Workout** to view the workout summary.

The timer starts at zero for every work and rest phase. Your session data is saved in the browser's local storage, so it can be restored after a page refresh on the same device and browser.

## Running locally

### Prerequisites

- Node.js
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open the local URL shown in the terminal.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run check` | Run Svelte and TypeScript checks |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |

## Tech stack

- [SvelteKit](https://kit.svelte.dev/)
- [Svelte](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/) icons