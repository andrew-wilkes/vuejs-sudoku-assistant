<template>
    <div class="cell" :class="{ selected: isSelected, highlighted: isHighlighted }">
        <button v-if="numbers.showSolution" type="button" class="cell cell-top" :class="{ given: isGiven }">{{ numbers.solution[idx] }}</button>
        <button v-else-if="numbers.grid[idx] > 0" type="button" class="cell cell-top" :class="{ given: isGiven, red: isWrong, green: isSame }">{{ topValue }}</button>
        <button v-else-if="numbers.candidates[idx].length < 3" type="button" class="cell cell-str">
            <span v-for="n in numbers.candidates[idx]" :class="{ green: getSelectedNum == n && config.same }">{{ n }}</span>
        </button>
        <button v-else type="button" class="cell-grid">
            <div v-for="n in 9" class="num" :class="{ green: getSelectedNum == n }">{{ candidate(n) }}</div>
        </button>
    </div>
</template>

<script>
import { numbers, cells, config } from "../state";

export default {
  data() {
    return {
      numbers,
      config
    }
  },
  props: {
    idx: Number
  },
  computed: {
    topValue() {
        let n = this.numbers.grid[this.idx];
        if (n == 0) return "";
        if (n > 10) return n - 10;
        return n;
    },
    isGiven() {
      return this.numbers.grid[this.idx] > 10;
    },
    isHighlighted() {
      return cells.peers.indexOf('' + this.idx) > -1;
    },
    isSelected() {
      return cells.selected.idx == this.idx;
    },
    isWrong() {
      let n = this.numbers.grid[this.idx];
      return this.numbers.showWrong && n > 0 && n < 10 && n != this.numbers.solution[this.idx];
    },
    isSame() {
      let n = this.numbers.grid[this.idx];
      let selectedNum = this.numbers.grid[cells.selected.idx];
      if (n > 10) n -= 10;
      if (n == 0) n = -1;
      if (selectedNum > 10) selectedNum -= 10;
      return config.same && selectedNum == n && cells.selected.idx != this.idx;
    },
    getSelectedNum() {
      let n = this.numbers.grid[cells.selected.idx];
      if (n > 10) n -= 10;
      return config.same ? n : -1;
    }
  },
  methods: {
    candidate(n) {
      return this.numbers.candidates[this.idx].indexOf('' + n) > -1 ? n : '';
    }
  }
}
</script>