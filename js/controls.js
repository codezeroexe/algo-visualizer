// ==========================================
// Controls — Data generation, playback, UI bindings
// ==========================================

// Seeded PRNG (mulberry32)
function mulberry32(seed) {
    return function () {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export class Controls {
    constructor(app) {
        this.app = app;
        this.inputMode = 'random'; // 'random' | 'custom'
        this.isPlaying = false;
        this.animTimer = null;
        this.steps = [];
        this.currentStep = 0;
        this.bindElements();
        this.bindEvents();
    }

    bindElements() {
        // Algorithm selector
        this.algoSelect = document.getElementById('algo-select');

        // Sliders
        this.sizeSlider = document.getElementById('size-slider');
        this.sizeValue = document.getElementById('size-value');
        this.seedSlider = document.getElementById('seed-slider');
        this.seedValue = document.getElementById('seed-value');
        this.speedSlider = document.getElementById('speed-slider');
        this.speedValue = document.getElementById('speed-value');

        // Input mode toggles
        this.randomBtn = document.getElementById('toggle-random');
        this.customBtn = document.getElementById('toggle-custom');
        this.customInputWrap = document.getElementById('custom-input-wrap');
        this.customInput = document.getElementById('custom-input');
        this.sliderControls = document.getElementById('slider-controls');

        // Playback
        this.playBtn = document.getElementById('btn-play');
        this.stepBtn = document.getElementById('btn-step');
        this.resetBtn = document.getElementById('btn-reset');

        // Stats
        this.statComparisons = document.getElementById('stat-comparisons');
        this.statSwaps = document.getElementById('stat-swaps');
        this.progressFill = document.getElementById('progress-fill');

        // Search target
        this.searchTargetWrap = document.getElementById('search-target-wrap');
        this.searchTargetInput = document.getElementById('search-target');
    }

    bindEvents() {
        // Algorithm change
        this.algoSelect.addEventListener('change', () => {
            this.reset();
            this.app.onAlgorithmChange();
        });

        // Slider updates
        this.sizeSlider.addEventListener('input', () => {
            this.sizeValue.textContent = this.sizeSlider.value;
            if (this.inputMode === 'random') {
                this.reset();
                this.app.generateAndReset();
            }
        });

        this.seedSlider.addEventListener('input', () => {
            this.seedValue.textContent = this.seedSlider.value;
            if (this.inputMode === 'random') {
                this.reset();
                this.app.generateAndReset();
            }
        });

        this.speedSlider.addEventListener('input', () => {
            this.speedValue.textContent = `${this.speedSlider.value}x`;
        });

        // Input mode toggle
        this.randomBtn.addEventListener('click', () => this.setInputMode('random'));
        this.customBtn.addEventListener('click', () => this.setInputMode('custom'));

        // Custom input change 
        this.customInput.addEventListener('input', () => {
            if (this.inputMode === 'custom') {
                this.reset();
                this.app.generateAndReset();
            }
        });

        // Playback buttons
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.stepBtn.addEventListener('click', () => this.stepForward());
        this.resetBtn.addEventListener('click', () => {
            this.reset();
            this.app.generateAndReset();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                this.stepForward();
            } else if (e.code === 'KeyR') {
                e.preventDefault();
                this.reset();
                this.app.generateAndReset();
            }
        });
    }

    setInputMode(mode) {
        this.inputMode = mode;
        this.randomBtn.classList.toggle('active', mode === 'random');
        this.customBtn.classList.toggle('active', mode === 'custom');
        this.sliderControls.style.display = mode === 'random' ? 'flex' : 'none';
        this.customInputWrap.style.display = mode === 'custom' ? 'block' : 'none';
        this.reset();
        this.app.generateAndReset();
    }

    generateArray() {
        if (this.inputMode === 'custom') {
            const vals = this.customInput.value
                .split(/[,\s]+/)
                .map(v => parseInt(v.trim(), 10))
                .filter(v => !isNaN(v));
            return vals.length > 0 ? vals : [5, 3, 8, 1, 9, 2, 7, 4, 6];
        }

        const size = parseInt(this.sizeSlider.value, 10);
        const seed = parseInt(this.seedSlider.value, 10);
        const rng = mulberry32(seed);
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Math.floor(rng() * 200) + 5);
        }
        return arr;
    }

    getSelectedAlgorithm() {
        return this.algoSelect.value;
    }

    getSpeed() {
        const speed = parseInt(this.speedSlider.value, 10);
        // Map 1-100 to 500ms-5ms delay
        return Math.max(5, 500 / speed);
    }

    getSearchTarget() {
        const val = parseInt(this.searchTargetInput.value, 10);
        return isNaN(val) ? null : val;
    }

    setSteps(steps) {
        this.steps = steps;
        this.currentStep = 0;
        this.updateProgress();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (this.currentStep >= this.steps.length) return;
        this.isPlaying = true;
        this.playBtn.innerHTML = '<span class="btn-icon">⏸</span> Pause';
        this.animate();
    }

    pause() {
        this.isPlaying = false;
        this.playBtn.innerHTML = '<span class="btn-icon">▶</span> Play';
        if (this.animTimer) {
            clearTimeout(this.animTimer);
            this.animTimer = null;
        }
    }

    animate() {
        if (!this.isPlaying || this.currentStep >= this.steps.length) {
            this.pause();
            return;
        }
        this.app.renderStep(this.steps[this.currentStep]);
        this.currentStep++;
        this.updateProgress();
        this.animTimer = setTimeout(() => this.animate(), this.getSpeed());
    }

    stepForward() {
        if (this.currentStep >= this.steps.length) return;
        this.pause();
        this.app.renderStep(this.steps[this.currentStep]);
        this.currentStep++;
        this.updateProgress();
    }

    reset() {
        this.pause();
        this.steps = [];
        this.currentStep = 0;
        this.updateStats({ comparisons: 0, swaps: 0 });
        this.updateProgress();
    }

    updateStats(stats) {
        if (this.statComparisons) this.statComparisons.textContent = stats.comparisons || 0;
        if (this.statSwaps) this.statSwaps.textContent = stats.swaps || 0;
    }

    updateProgress() {
        const pct = this.steps.length > 0 ? (this.currentStep / this.steps.length) * 100 : 0;
        if (this.progressFill) this.progressFill.style.width = `${pct}%`;
    }

    showSearchTarget(show) {
        if (this.searchTargetWrap) {
            this.searchTargetWrap.classList.toggle('visible', show);
        }
    }

    populateAlgorithms(algorithms, mode) {
        this.algoSelect.innerHTML = '';
        for (const [key, algo] of Object.entries(algorithms)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = algo.name;
            this.algoSelect.appendChild(opt);
        }
    }
}
