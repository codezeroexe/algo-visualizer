// ==========================================
// App — Main orchestrator
// ==========================================

import { sortingAlgorithms } from './algorithms/sorting.js';
import { searchingAlgorithms } from './algorithms/searching.js';
import { Visualizer } from './visualizer.js';
import { Controls } from './controls.js';
import { ComplexityPanel } from './complexity.js';

class App {
    constructor() {
        this.mode = 'sorting'; // 'sorting' | 'searching'
        this.currentArray = [];
        this.allSteps = [];

        // Initialize components
        this.visualizer = new Visualizer(document.getElementById('viz-container'));
        this.controls = new Controls(this);
        this.complexity = new ComplexityPanel();

        // Tab elements
        this.sortingTab = document.getElementById('tab-sorting');
        this.searchingTab = document.getElementById('tab-searching');

        this.bindTabs();
        this.init();
    }

    init() {
        this.setMode('sorting');
    }

    bindTabs() {
        this.sortingTab.addEventListener('click', () => this.setMode('sorting'));
        this.searchingTab.addEventListener('click', () => this.setMode('searching'));
    }

    setMode(mode) {
        this.mode = mode;

        // Update tab UI
        this.sortingTab.classList.toggle('active', mode === 'sorting');
        this.searchingTab.classList.toggle('active', mode === 'searching');

        // Update algorithm dropdown
        const algos = mode === 'sorting' ? sortingAlgorithms : searchingAlgorithms;
        this.controls.populateAlgorithms(algos, mode);
        this.controls.showSearchTarget(mode === 'searching');

        // Update labels
        const swapLabel = document.getElementById('stat-swaps-label');
        if (swapLabel) {
            swapLabel.style.display = mode === 'sorting' ? 'flex' : 'none';
        }

        this.visualizer.setMode(mode);
        this.generateAndReset();
    }

    onAlgorithmChange() {
        this.generateAndReset();
    }

    generateAndReset() {
        this.currentArray = this.controls.generateArray();
        this.precomputeSteps();

        // Initial render
        if (this.mode === 'sorting') {
            this.visualizer.renderSortingBars(this.currentArray);
        } else {
            this.visualizer.renderSearchCells(this.currentArray, {
                searchSpace: [0, this.currentArray.length - 1],
                target: this.controls.getSearchTarget()
            });
        }

        // Update complexity panel
        const algos = this.mode === 'sorting' ? sortingAlgorithms : searchingAlgorithms;
        const currentKey = this.controls.getSelectedAlgorithm();
        const algoInfo = algos[currentKey];
        this.complexity.updateInfo(algoInfo);
        this.complexity.drawScalingChart(algos, currentKey, this.mode);

        this.controls.updateStats({ comparisons: 0, swaps: 0 });
    }

    precomputeSteps() {
        const algos = this.mode === 'sorting' ? sortingAlgorithms : searchingAlgorithms;
        const currentKey = this.controls.getSelectedAlgorithm();
        const algo = algos[currentKey];

        if (!algo) return;

        const steps = [];
        let gen;

        if (this.mode === 'searching') {
            let target = this.controls.getSearchTarget();
            if (target === null) {
                // Auto-pick a target from the array
                const sorted = [...this.currentArray].sort((a, b) => a - b);
                target = sorted[Math.floor(sorted.length / 2)];
                this.controls.searchTargetInput.value = target;
            }
            gen = algo.fn([...this.currentArray], target);
        } else {
            gen = algo.fn([...this.currentArray]);
        }

        for (const step of gen) {
            steps.push(step);
        }

        this.allSteps = steps;
        this.controls.setSteps(steps);
    }

    renderStep(step) {
        if (!step) return;

        if (this.mode === 'sorting') {
            this.visualizer.renderSortingBars(step.array, step);
        } else {
            this.visualizer.renderSearchCells(step.array, step);
        }

        if (step.stats) {
            this.controls.updateStats(step.stats);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();

    // Redraw scaling chart on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const algos = window.app.mode === 'sorting' ? sortingAlgorithms : searchingAlgorithms;
            const currentKey = window.app.controls.getSelectedAlgorithm();
            window.app.complexity.drawScalingChart(algos, currentKey, window.app.mode);
        }, 200);
    });
});
