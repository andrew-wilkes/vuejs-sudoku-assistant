export const numberIndex = (bid, cid) => {
    return cid % 3 + Math.floor(cid / 3) * 9 + (bid % 3) * 3 + Math.floor(bid / 3) * 27;
}

export const stringToNumArray = (s) => {
    let numbers = Array(81).fill(0);
    for (let i = 0; i < s.length; i++) {
        if (i == numbers.length) break;
        let n = s[i] == '.' ? 0 : parseInt(s[i]) + 10;
        numbers[i] = n;
    }
    return numbers;
}

export const numsToString = (numArray) => {
    // Convert given numbers to base number and others to zero
    let nums = numArray.map(x => x > 10 ? x - 10 : 0);
    let sum = nums.reduce((a, s) => a + s);
    if (sum == 0) return "";
    return nums.toString().replaceAll(',', '').replaceAll('0', '.');
}

export const secondsToHHMMSS = (n) => {
    let seconds = n % 60;
    let minutes = Math.floor(n / 60) % 60;
    let hours = Math.floor(n / 3600);
    if (hours   < 10) {hours   = "0" + hours;}
    if (minutes < 10) {minutes = "0" + minutes;}
    if (seconds < 10) {seconds = "0" + seconds;}
    return hours + ':' + minutes + ':' + seconds;
}

// Return a list of indexes of peer cells
export const getPeers = (idx) => {
    let peers = [];
    let grid = Array(81).fill(false);
    let x = idx % 9;
    let y = Math.floor(idx / 9) * 9;
    let bx = Math.floor(x / 3) * 3;
    let by = Math.floor(idx / 27) * 27;
    for (let j = 0; j < 9; j++) {
        if (x != idx) grid[x] = true;
        if (y != idx) grid[y] = true;
        y += 1;
        x += 9;
    }
    for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
            if (bx + by + k != idx) grid[bx + by + k] = true;
        }
        by += 9;
    }
    for (let i in grid) {
        if (grid[i]) peers.push(i);
    }
    return peers;
}
