<template>
  <div class="sudoku-grid">
    <div class="box" v-for="n in 9">
      <Cell v-for="m in 9" @click="cellClicked" :id="`${n}-${m}`"></Cell>
    </div>
  </div>
</template>

<script>
import Cell from "./Cell.vue";

export default {
  components: {
   Cell
  },
  methods: {
    cellClicked(event) {
      console.log(event.target.id);
    }
  }
}

</script>