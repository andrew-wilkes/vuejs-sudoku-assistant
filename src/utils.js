export const numberIndex = (bid, cid) => {
    return cid % 3 + Math.floor(cid / 3) * 9 + (bid % 3) * 3 + Math.floor(bid / 3) * 27;
}