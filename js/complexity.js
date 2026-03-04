// ==========================================
// Complexity — Info display & scaling chart
// ==========================================

export class ComplexityPanel {
    constructor() {
        this.canvas = document.getElementById('scaling-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.legendContainer = document.getElementById('chart-legend');

        // Complexity badge elements
        this.bestEl = document.getElementById('complexity-best');
        this.avgEl = document.getElementById('complexity-avg');
        this.worstEl = document.getElementById('complexity-worst');
        this.spaceEl = document.getElementById('complexity-space');
        this.descEl = document.getElementById('complexity-desc');
    }

    updateInfo(algoInfo) {
        if (!algoInfo) return;
        if (this.bestEl) this.bestEl.textContent = algoInfo.time.best;
        if (this.avgEl) this.avgEl.textContent = algoInfo.time.avg;
        if (this.worstEl) this.worstEl.textContent = algoInfo.time.worst;
        if (this.spaceEl) this.spaceEl.textContent = algoInfo.space;
        if (this.descEl) this.descEl.textContent = algoInfo.description;
    }

    // ── Scaling Chart ──────────────────────────
    drawScalingChart(algorithms, currentAlgoKey, mode) {
        if (!this.canvas || !this.ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);

        const W = rect.width;
        const H = rect.height;
        const ctx = this.ctx;

        const padding = { top: 20, right: 20, bottom: 35, left: 50 };
        const chartW = W - padding.left - padding.right;
        const chartH = H - padding.top - padding.bottom;

        // Clear
        ctx.clearRect(0, 0, W, H);

        // Background
        ctx.fillStyle = 'rgba(10, 10, 20, 0.4)';
        ctx.beginPath();
        ctx.roundRect(0, 0, W, H, 8);
        ctx.fill();

        const inputSizes = [10, 50, 100, 250, 500, 1000, 2500, 5000];

        // Complexity functions (approximate operation counts)
        const complexityFns = {
            'O(1)': () => 1,
            'O(log n)': (n) => Math.log2(n),
            'O(n)': (n) => n,
            'O(n log n)': (n) => n * Math.log2(n),
            'O(n²)': (n) => n * n,
        };

        const colors = {
            'bubble': '#ff006e',
            'selection': '#ff6b35',
            'insertion': '#ffd60a',
            'merge': '#00d4ff',
            'quick': '#b266ff',
            'heap': '#00e676',
            'linear': '#ff006e',
            'binary': '#00d4ff',
        };

        // Compute max Y for scaling
        let maxY = 0;
        for (const [key, algo] of Object.entries(algorithms)) {
            const worstStr = algo.time.worst;
            const fn = complexityFns[worstStr];
            if (fn) {
                const val = fn(inputSizes[inputSizes.length - 1]);
                if (val > maxY) maxY = val;
            }
        }

        // Use log scale for Y if max is very large
        const useLogY = maxY > 10000;
        const scaleY = (val) => {
            if (useLogY) {
                return Math.log10(val + 1) / Math.log10(maxY + 1);
            }
            return val / maxY;
        };

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (i / 4) * chartH;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartW, y);
            ctx.stroke();
        }

        // Axis labels
        ctx.fillStyle = 'rgba(136, 136, 170, 0.6)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';

        // X-axis labels
        inputSizes.forEach((n, i) => {
            const x = padding.left + (i / (inputSizes.length - 1)) * chartW;
            ctx.fillText(n >= 1000 ? `${n / 1000}k` : n, x, H - 8);
        });

        // Y-axis label
        ctx.save();
        ctx.translate(12, padding.top + chartH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Operations', 0, 0);
        ctx.restore();

        // X-axis title
        ctx.fillText('Input Size (n)', padding.left + chartW / 2, H - 0);

        // Draw lines
        this.legendContainer.innerHTML = '';

        for (const [key, algo] of Object.entries(algorithms)) {
            const worstStr = algo.time.worst;
            const fn = complexityFns[worstStr];
            if (!fn) continue;

            const color = colors[key] || '#888';
            const isCurrent = key === currentAlgoKey;

            ctx.beginPath();
            ctx.strokeStyle = isCurrent ? color : `${color}55`;
            ctx.lineWidth = isCurrent ? 3 : 1.5;

            if (isCurrent) {
                ctx.shadowColor = color;
                ctx.shadowBlur = 8;
            }

            inputSizes.forEach((n, i) => {
                const x = padding.left + (i / (inputSizes.length - 1)) * chartW;
                const val = fn(n);
                const normalY = scaleY(val);
                const y = padding.top + chartH - normalY * chartH;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });

            ctx.stroke();
            ctx.shadowBlur = 0;

            // Legend
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.style.opacity = isCurrent ? '1' : '0.5';
            item.innerHTML = `<span class="legend-dot" style="background:${color}"></span>${algo.name} <span style="color:${color};font-family:var(--font-mono);font-size:0.6rem;">${worstStr}</span>`;
            this.legendContainer.appendChild(item);
        }
    }
}
