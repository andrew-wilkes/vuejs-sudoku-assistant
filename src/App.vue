<script setup>
import Grid from './components/Grid.vue'
import UI from './components/UI.vue'
import Puzzle from './components/Puzzle.vue'
import Options from './components/Options.vue'
</script>

<template>
  <div class="frame">
    <Grid />
    <UI />
    <Puzzle />
    <Options />
  </div>
</template>

<style scoped>
  .frame {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
</style>
