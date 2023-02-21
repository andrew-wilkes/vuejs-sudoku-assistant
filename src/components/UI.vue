<template>
  <div class="ui">
    <div class="status"></div>
    <div class="timer">
        <span id="time">00:00:00</span>
        <button><span class="material-symbols-outlined" @click="play">play_pause</span></button>
        <button><span class="material-symbols-outlined" @click="reset">restart_alt</span></button>
    </div>
    <div class="numbers">
      <div v-for="n in 9"><button>{{ n }}</button><div class="count">{{ numberCounts[n - 1] }}</div></div>
    </div>
    <div class="controls">
        <button style="width: 24px; box-sizing: content-box;" @click="zero">&nbsp;</button>
        <button><span class="material-symbols-outlined" @click="notes">edit</span></button>
        <button><span class="material-symbols-outlined" @click="givens">edit_square</span></button>
        <button><span class="material-symbols-outlined" @click="add">add</span></button>
        <button><span class="material-symbols-outlined" @click="addAll">add_circle</span></button>
        <button><span class="material-symbols-outlined" @click="settings">settings</span></button>
       
        <button><span class="material-symbols-outlined" @click= "delete">delete</span></button>
        <button><span class="material-symbols-outlined" @click="check">check</span></button>
        <button><span class="material-symbols-outlined" @click="info">info</span></button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['foo'],
  data() {
    return {
      numberCounts: []
    }
  },
  mounted() {
    this.numberCounts = Array(10).fill(9);
  },
  methods: {
    play(event) {

    },
    reset(event) {

    },
    zero(event) {
      this.numberCounts[0]++;
    },
    notes(event) {

    },
    givens(event) {

    },
    add(event) {

    },addAll(event) {

    },
    settings(event) {

    },
    delete(event) {

    },
    check(event) {

    },
    info(event) {

    }
  }
}
</script>

