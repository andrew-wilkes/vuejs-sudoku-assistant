export const numberIndex = (bid, cid) => {
    return cid % 3 + Math.floor(cid / 3) * 9 + (bid % 3) * 3 + Math.floor(bid / 3) * 27;
}

export const numsToString = (numArray) => {
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
