<template>
    <div>
    <h3>Puzzle String</h3>
    <p>Use this to paste in a puzzle string or to copy given values as a string.</p>
    <div class="pin"><input type="text" placeholder="1..6.3..8..9" v-model="puzzle"/> <button type="button" @click="applyPuzzle">Apply</button></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            puzzle: ""
        }  
    },
    methods: {
        applyPuzzle() {

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
  }
   button {
    padding: 5px;
   }
</style>