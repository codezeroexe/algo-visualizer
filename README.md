# ⚡ Algorithm Visualizer

An interactive web-based tool for visualizing sorting and searching algorithms step-by-step, with real-time complexity analysis and scaling comparisons.

## Features

- **6 Sorting Algorithms** — Bubble, Selection, Insertion, Merge, Quick, Heap Sort
- **2 Searching Algorithms** — Linear & Binary Search
- **Step-by-step animation** with play, pause, step-forward, and reset controls
- **Speed control** slider (1x–100x)
- **Data input** — random generation with configurable seed & size, or custom comma-separated values
- **Complexity cards** — Best, Average, Worst time & space complexity for each algorithm
- **Scaling chart** — visual comparison of how algorithms perform as input size grows
- **Material 3 Expressive UI** — dark theme with collapsible sidebar sections and flat tonal colors

## Getting Started

```bash
git clone https://github.com/codezeroexe/algo-visualizer.git
cd algo-visualizer
python3 -m http.server 3000
```

Open **http://localhost:3000** in your browser.

> Any static file server works — `npx serve`, VS Code Live Server, etc.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Step forward |
| `R` | Reset |

## Project Structure

```
algo-visualizer/
├── index.html
├── css/style.css
└── js/
    ├── app.js              # Main controller
    ├── visualizer.js       # Bar & cell rendering
    ├── controls.js         # UI event handling
    ├── complexity.js       # Complexity data & scaling chart
    └── algorithms/
        ├── sorting.js      # 6 sorting algorithm generators
        └── searching.js    # Linear & binary search generators
```

## Tech Stack

- Vanilla HTML, CSS, JavaScript (ES Modules)
- No frameworks or build tools required
- Material 3 Expressive dark theme with `#256330` primary

## License

MIT
