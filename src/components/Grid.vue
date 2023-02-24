<template>
  <div class="sudoku-grid">
    <div class="box" v-for="n in 9">
      <Cell v-for="m in 9" @click="cellClicked(n, m)" :idx="getIndex(n, m)"></Cell>
    </div>
  </div>
</template>

<script>
import Cell from "./Cell.vue";
import { cells } from "../state";
import { numberIndex } from "../utils";
import { getPeers } from "../utils";

export default {
  components: {
   Cell
  },
  methods: {
    cellClicked(bid, cid) {
      if (cells.selected.bid == bid && cells.selected.cid == cid) {
        cells.selected.idx = -1; // Unselect the cell
        cells.selected.bid = -1;
        cells.peers = [];
      } else {
        cells.selected.bid = bid;
        cells.selected.cid = cid;
        cells.selected.idx = numberIndex(bid - 1, cid - 1);
        cells.peers = getPeers(cells.selected.idx);
      }
    },
    getIndex(bid, cid) {
      return numberIndex(bid - 1, cid - 1);
    }
  }
}
</script>