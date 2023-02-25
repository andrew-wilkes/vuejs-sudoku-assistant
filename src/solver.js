export const getSolution = (numbers) => {
    let digits = "123456789";
    let cand = Array(81).fill(digits);
    let grid = Array(81).fill(0);
    // Set the given values
    for (let i = 0; i < 81; i++) {
        if (numbers[i] > 10) { // Only consider given numbers
            let n = numbers[i] - 10;
            grid[i] = n;
            removeNumberFromPeers(i, n, cand);
        }
    }
    solve(-1, cand, grid);
    return grid;
}

function solve(idx, cand, grid) {
    // Check for completion
	if (grid.indexOf(0) < 0) return true;
    // Find the next cell with the least number of possible values
    let cellIdx = -1;
    let cellSize = 10;
    while(true) {
        idx = getNextEmptyCell(idx, grid);
        if (cellIdx == idx) break;
        if (cand[idx].length < cellSize) {
            cellIdx = idx;
            cellSize = cand[idx].length;
        };
    }
    // Apply number candidates to the grid cell
    for (let i = 0; i < cellSize; i++) {
        let n = cand[idx][i];
        grid[idx] = parseInt(n);
        let reducedCand = cand.concat([]); // Make copy of candidates
        removeNumberFromPeers(idx, n, reducedCand);
        // Recursive call. Unwinds with true if a solution is reached.
        if (solve(idx, reducedCand, grid)) return true;
    }
    grid[idx] = 0;
    return false;
}

function getNextEmptyCell(idx, grid) {
    while(true) {
        idx = (idx + 1) % 81;
        if (grid[idx] == 0) return idx;
    }
}

function removeNumberFromPeers(i, n, cand) {
    let x = i % 9;
    let y = Math.floor(i / 9) * 9;
    let bx = Math.floor(x / 3) * 3;
    let by = Math.floor(i / 27) * 27;
    for (let p = 0; p < 9; p++) {
        // Column
        cand[x + p * 9] = cand[x + p * 9].replace('' + n, '');
        // Row
        cand[y + p] = cand[y + p].replace('' + n, '');
    }
    // Box
    for (let p = 0; p < 3; p++) {
        for (let k = 0; k < 3; k++) {
            cand[bx + k + by] = cand[bx + k + by].replace('' + n, '');
        }
        by += 9;
    }
}
