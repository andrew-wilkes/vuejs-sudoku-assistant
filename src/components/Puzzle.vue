<template>
    <div>
    <h3>Puzzle String</h3>
    <p>Use this to enter a puzzle string or to copy given values as a string to save.</p>
    <div class="pin"><input @keydown.stop @keyup="filterChars" type="text" placeholder="1..6.3..8..9" v-model="puzzle"/> <button type="button" @click="applyPuzzle" title="Initialize the grid with these numbers">Apply</button></div>
    </div>
</template>

<script>

import { stringToNumArray, numsToString } from "../utils";
import { numbers, resetNumbers } from "../state";

export default {
    data() {
        return {
            puzzle: "",
            numbers
        }  
    },
    methods: {
        applyPuzzle() {
            resetNumbers();
            numbers.grid = stringToNumArray(this.puzzle);
            numbers.newPuzzle = true;
        },
        filterChars() {
            this.puzzle = this.puzzle.replaceAll(/[^1-9]/g, '.').slice(0, 82);
        }
    },
  watch: {
    'numbers.newGivens'(update) {
      if (update) {
        numbers.newGivens = false;
        this.puzzle = numsToString(numbers.grid);
      }
    }
  }
}
</script>

<style scoped>
  input {
    width: 82ch;
    border: 2px solid #2c8aaf;
    border-radius: 5px;
    padding: 5px;
    color: #333333;
    font-family: "Courier New", monospace;
  }
   button {
    padding: 5px;
   }
</style>