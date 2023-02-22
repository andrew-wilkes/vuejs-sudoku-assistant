<template>
  <div class="sudoku-grid">
    <div class="box" v-for="n in 9">
      <Cell v-for="m in 9" :id="`${n}-${m}`" @click="cellClicked(n, m)" highlighted="true" :number="getNum(m)" candidates="2"></Cell>
    </div>
  </div>
</template>

<script>
import Cell from "./Cell.vue";
import {numbers} from "../state";

export default {
  components: {
   Cell
  },
  methods: {
    cellClicked(x, y) {
      console.log(x, y);
    },
    getNum(n) {
      return n * 2;
    }
  },
  mounted() {
    console.log(numbers.grid);
  }
}

</script>