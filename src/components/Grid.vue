<template>
  <div class="sudoku-grid">
    <div class="box" v-for="n in 9">
      <Cell v-for="m in 9" :id="`${n}-${m}`" @click="cellClicked(n, m)" :highlighted="true" :idx="getIndex(n, m)"></Cell>
    </div>
  </div>
</template>

<script>
import Cell from "./Cell.vue";
import { selectedCell } from "../state";
import { numberIndex } from "../utils";

export default {
  components: {
   Cell
  },
  methods: {
    cellClicked(bid, cid) {
      if (selectedCell.bid == bid && selectedCell.cid == cid) {
        selectedCell.bid = -1; // Unselect the cell
      } else {
        selectedCell.bid = bid;
        selectedCell.cid = cid;
        selectedCell.idx = numberIndex(bid, cid);
      }
    },
    getIndex(bid, cid) {
      return numberIndex(bid, cid);
    }
  }
}

</script>