// ==========================================
// Sorting Algorithms — Generator-based
// Each yields state after every comparison/swap
// ==========================================

export const sortingAlgorithms = {
    'bubble': { name: 'Bubble Sort', fn: bubbleSort, time: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.' },
    'selection': { name: 'Selection Sort', fn: selectionSort, time: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', description: 'Finds the minimum element from the unsorted part and puts it at the beginning.' },
    'insertion': { name: 'Insertion Sort', fn: insertionSort, time: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', description: 'Builds the sorted array one item at a time by inserting each element into its correct position.' },
    'merge': { name: 'Merge Sort', fn: mergeSort, time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(n)', description: 'Divides the array in half, recursively sorts each half, then merges the sorted halves.' },
    'quick': { name: 'Quick Sort', fn: quickSort, time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' }, space: 'O(log n)', description: 'Picks a pivot element, partitions the array around the pivot, and recursively sorts the partitions.' },
    'heap': { name: 'Heap Sort', fn: heapSort, time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(1)', description: 'Builds a max heap, then repeatedly extracts the maximum element to build the sorted array.' },
};

function* bubbleSort(arr) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0, swaps = 0;
    const sorted = new Set();

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            yield { array: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted], stats: { comparisons, swaps } };

            if (a[j] > a[j + 1]) {
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
                swaps++;
                swapped = true;
                yield { array: [...a], comparing: [], swapping: [j, j + 1], sorted: [...sorted], stats: { comparisons, swaps } };
            }
        }
        sorted.add(n - 1 - i);
        if (!swapped) break;
    }
    // Mark all as sorted
    for (let i = 0; i < n; i++) sorted.add(i);
    yield { array: [...a], comparing: [], swapping: [], sorted: [...sorted], stats: { comparisons, swaps }, done: true };
}

function* selectionSort(arr) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0, swaps = 0;
    const sorted = new Set();

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            comparisons++;
            yield { array: [...a], comparing: [minIdx, j], swapping: [], sorted: [...sorted], stats: { comparisons, swaps }, minIdx };
            if (a[j] < a[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [a[i], a[minIdx]] = [a[minIdx], a[i]];
            swaps++;
            yield { array: [...a], comparing: [], swapping: [i, minIdx], sorted: [...sorted], stats: { comparisons, swaps } };
        }
        sorted.add(i);
    }
    for (let i = 0; i < n; i++) sorted.add(i);
    yield { array: [...a], comparing: [], swapping: [], sorted: [...sorted], stats: { comparisons, swaps }, done: true };
}

function* insertionSort(arr) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0, swaps = 0;
    const sorted = new Set([0]);

    for (let i = 1; i < n; i++) {
        let j = i;
        while (j > 0) {
            comparisons++;
            yield { array: [...a], comparing: [j - 1, j], swapping: [], sorted: [...sorted], stats: { comparisons, swaps } };
            if (a[j - 1] > a[j]) {
                [a[j - 1], a[j]] = [a[j], a[j - 1]];
                swaps++;
                yield { array: [...a], comparing: [], swapping: [j - 1, j], sorted: [...sorted], stats: { comparisons, swaps } };
                j--;
            } else {
                break;
            }
        }
        sorted.add(i);
    }
    for (let i = 0; i < n; i++) sorted.add(i);
    yield { array: [...a], comparing: [], swapping: [], sorted: [...sorted], stats: { comparisons, swaps }, done: true };
}

function* mergeSort(arr) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0, swaps = 0;
    const sorted = new Set();

    function* mergeSortHelper(lo, hi) {
        if (lo >= hi) return;
        const mid = Math.floor((lo + hi) / 2);
        yield* mergeSortHelper(lo, mid);
        yield* mergeSortHelper(mid + 1, hi);
        yield* merge(lo, mid, hi);
    }

    function* merge(lo, mid, hi) {
        const left = a.slice(lo, mid + 1);
        const right = a.slice(mid + 1, hi + 1);
        let i = 0, j = 0, k = lo;

        while (i < left.length && j < right.length) {
            comparisons++;
            yield { array: [...a], comparing: [lo + i, mid + 1 + j], swapping: [], sorted: [...sorted], stats: { comparisons, swaps }, mergeRange: [lo, hi] };
            if (left[i] <= right[j]) {
                a[k] = left[i];
                i++;
            } else {
                a[k] = right[j];
                j++;
            }
            swaps++;
            yield { array: [...a], comparing: [], swapping: [k], sorted: [...sorted], stats: { comparisons, swaps }, mergeRange: [lo, hi] };
            k++;
        }
        while (i < left.length) {
            a[k] = left[i];
            swaps++;
            yield { array: [...a], comparing: [], swapping: [k], sorted: [...sorted], stats: { comparisons, swaps }, mergeRange: [lo, hi] };
            i++; k++;
        }
        while (j < right.length) {
            a[k] = right[j];
            swaps++;
            yield { array: [...a], comparing: [], swapping: [k], sorted: [...sorted], stats: { comparisons, swaps }, mergeRange: [lo, hi] };
            j++; k++;
        }
        if (lo === 0 && hi === n - 1) {
            for (let x = lo; x <= hi; x++) sorted.add(x);
        }
    }

    yield* mergeSortHelper(0, n - 1);
    for (let i = 0; i < n; i++) sorted.add(i);
    yield { array: [...a], comparing: [], swapping: [], sorted: [...sorted], stats: { comparisons, swaps }, done: true };
}

function* quickSort(arr) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0, swaps = 0;
    const sorted = new Set();

    function* quickSortHelper(lo, hi) {
        if (lo >= hi) {
            if (lo === hi) sorted.add(lo);
            return;
        }
        const pivotIdx = yield* partition(lo, hi);
        sorted.add(pivotIdx);
        yield* quickSortHelper(lo, pivotIdx - 1);
        yield* quickSortHelper(pivotIdx + 1, hi);
    }

    function* partition(lo, hi) {
        const pivot = a[hi];
        let i = lo - 1;
        for (let j = lo; j < hi; j++) {
            comparisons++;
            yield { array: [...a], comparing: [j, hi], swapping: [], sorted: [...sorted], stats: { comparisons, swaps }, pivot: hi };
            if (a[j] < pivot) {
                i++;
                [a[i], a[j]] = [a[j], a[i]];
                swaps++;
                yield { array: [...a], comparing: [], swapping: [i, j], sorted: [...sorted], stats: { comparisons, swaps }, pivot: hi };
            }
        }
        [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
        swaps++;
        yield { array: [...a], comparing: [], swapping: [i + 1, hi], sorted: [...sorted], stats: { comparisons, swaps } };
        return i + 1;
    }

    yield* quickSortHelper(0, n - 1);
    for (let i = 0; i < n; i++) sorted.add(i);
    yield { array: [...a], comparing: [], swapping: [], sorted: [...sorted], stats: { comparisons, swaps }, done: true };
}

function* heapSort(arr) {
    const a = [...arr];
    const n = a.length;
    let comparisons = 0, swaps = 0;
    const sorted = new Set();

    function* heapify(size, root) {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        if (left < size) {
            comparisons++;
            yield { array: [...a], comparing: [largest, left], swapping: [], sorted: [...sorted], stats: { comparisons, swaps } };
            if (a[left] > a[largest]) largest = left;
        }
        if (right < size) {
            comparisons++;
            yield { array: [...a], comparing: [largest, right], swapping: [], sorted: [...sorted], stats: { comparisons, swaps } };
            if (a[right] > a[largest]) largest = right;
        }
        if (largest !== root) {
            [a[root], a[largest]] = [a[largest], a[root]];
            swaps++;
            yield { array: [...a], comparing: [], swapping: [root, largest], sorted: [...sorted], stats: { comparisons, swaps } };
            yield* heapify(size, largest);
        }
    }

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(n, i);
    }

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
        [a[0], a[i]] = [a[i], a[0]];
        swaps++;
        sorted.add(i);
        yield { array: [...a], comparing: [], swapping: [0, i], sorted: [...sorted], stats: { comparisons, swaps } };
        yield* heapify(i, 0);
    }
    sorted.add(0);
    yield { array: [...a], comparing: [], swapping: [], sorted: [...sorted], stats: { comparisons, swaps }, done: true };
}
