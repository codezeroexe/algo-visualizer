// ==========================================
// Searching Algorithms — Generator-based
// Each yields state after every step
// ==========================================

export const searchingAlgorithms = {
    'linear': { name: 'Linear Search', fn: linearSearch, time: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)' }, space: 'O(1)', description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.' },
    'binary': { name: 'Binary Search', fn: binarySearch, time: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' }, space: 'O(1)', description: 'Repeatedly divides the sorted search interval in half, comparing the target with the middle element.' },
};

function* linearSearch(arr, target) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0;
    const checked = new Set();

    for (let i = 0; i < n; i++) {
        comparisons++;
        yield {
            array: a,
            current: i,
            found: a[i] === target ? i : -1,
            checked: [...checked],
            searchSpace: [0, n - 1],
            target,
            stats: { comparisons }
        };
        if (a[i] === target) {
            yield {
                array: a,
                current: i,
                found: i,
                checked: [...checked],
                searchSpace: [0, n - 1],
                target,
                stats: { comparisons },
                done: true
            };
            return;
        }
        checked.add(i);
    }

    yield {
        array: a,
        current: -1,
        found: -1,
        checked: [...checked],
        searchSpace: [0, n - 1],
        target,
        stats: { comparisons },
        done: true,
        notFound: true
    };
}

function* binarySearch(arr, target) {
    const a = [...arr].sort((x, y) => x - y);
    let comparisons = 0;
    let lo = 0, hi = a.length - 1;
    const eliminated = new Set();

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        comparisons++;
        yield {
            array: a,
            current: mid,
            found: a[mid] === target ? mid : -1,
            eliminated: [...eliminated],
            searchSpace: [lo, hi],
            target,
            stats: { comparisons }
        };

        if (a[mid] === target) {
            yield {
                array: a,
                current: mid,
                found: mid,
                eliminated: [...eliminated],
                searchSpace: [lo, hi],
                target,
                stats: { comparisons },
                done: true
            };
            return;
        } else if (a[mid] < target) {
            for (let i = lo; i <= mid; i++) eliminated.add(i);
            lo = mid + 1;
        } else {
            for (let i = mid; i <= hi; i++) eliminated.add(i);
            hi = mid - 1;
        }
    }

    yield {
        array: a,
        current: -1,
        found: -1,
        eliminated: [...eliminated],
        searchSpace: [lo, hi],
        target,
        stats: { comparisons },
        done: true,
        notFound: true
    };
}
