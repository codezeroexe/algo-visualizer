// ==========================================
// Visualizer — Renders sorting bars & search cells
// ==========================================

export class Visualizer {
    constructor(containerEl) {
        this.container = containerEl;
        this.mode = 'sorting'; // 'sorting' | 'searching'
    }

    setMode(mode) {
        this.mode = mode;
        this.container.innerHTML = '';
    }

    // ── Sorting Visualization ──────────────────
    renderSortingBars(array, state = {}) {
        const { comparing = [], swapping = [], sorted = [], pivot, mergeRange } = state;
        const max = Math.max(...array);

        // Reuse or create container
        let wrap = this.container.querySelector('.viz-canvas-wrap');
        if (!wrap) {
            this.container.innerHTML = '';
            wrap = document.createElement('div');
            wrap.className = 'viz-canvas-wrap';
            this.container.appendChild(wrap);
        }

        const existingBars = wrap.querySelectorAll('.bar');
        const barCount = array.length;

        // If bar count changed, rebuild
        if (existingBars.length !== barCount) {
            wrap.innerHTML = '';
            for (let i = 0; i < barCount; i++) {
                const bar = document.createElement('div');
                bar.className = 'bar';
                wrap.appendChild(bar);
            }
        }

        const applyStyles = () => {
            const bars = wrap.querySelectorAll('.bar');
            const sortedSet = new Set(sorted);
            const comparingSet = new Set(comparing);
            const swappingSet = new Set(swapping);

            // Get container height in pixels for calculating bar heights
            // Use clientHeight minus vertical padding (20px top + 12px bottom)
            let containerHeight = wrap.clientHeight - 32;
            if (containerHeight <= 0) containerHeight = 300; // fallback

            bars.forEach((bar, i) => {
                const heightPx = Math.max(4, (array[i] / max) * containerHeight);
                bar.style.height = `${heightPx}px`;

                // Reset classes
                bar.className = 'bar';

                if (swappingSet.has(i)) {
                    bar.classList.add('swapping');
                } else if (comparingSet.has(i)) {
                    bar.classList.add('comparing');
                } else if (sortedSet.has(i)) {
                    bar.classList.add('sorted');
                }

                if (pivot !== undefined && i === pivot && !swappingSet.has(i)) {
                    bar.classList.add('pivot');
                }
            });
        };

        // If container hasn't been laid out yet, defer to next frame
        if (wrap.clientHeight <= 0) {
            requestAnimationFrame(applyStyles);
        } else {
            applyStyles();
        }
    }

    // ── Searching Visualization ────────────────
    renderSearchCells(array, state = {}) {
        const { current = -1, found = -1, eliminated = [], searchSpace = [0, array.length - 1], target, done, notFound } = state;

        let wrap = this.container.querySelector('.search-array');
        if (!wrap) {
            this.container.innerHTML = '';
            wrap = document.createElement('div');
            wrap.className = 'search-array';
            this.container.appendChild(wrap);
        }

        const existingCells = wrap.querySelectorAll('.cell');
        if (existingCells.length !== array.length) {
            wrap.innerHTML = '';
            for (let i = 0; i < array.length; i++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                wrap.appendChild(cell);
            }
        }

        const cells = wrap.querySelectorAll('.cell');
        const eliminatedSet = new Set(eliminated);
        const [lo, hi] = searchSpace;

        cells.forEach((cell, i) => {
            cell.textContent = array[i];
            cell.className = 'cell';

            if (done && found === i) {
                cell.classList.add('found');
            } else if (done && notFound && i === current) {
                cell.classList.add('not-found');
            } else if (i === current) {
                cell.classList.add('current');
            } else if (eliminatedSet.has(i)) {
                cell.classList.add('eliminated');
            } else if (i >= lo && i <= hi && !done) {
                cell.classList.add('in-range');
            }
        });
    }

    // ── Clear ──────────────────────────────────
    clear() {
        this.container.innerHTML = '';
    }
}
