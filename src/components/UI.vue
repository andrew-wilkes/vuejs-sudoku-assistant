<template>
  <div class="ui">
    <div class="status"></div>
    <div class="timer">
        <span>{{ theTime }}</span>
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
        <button><span class="material-symbols-outlined" @click="wipe">delete</span></button>
        <button><span class="material-symbols-outlined" @click="check">check</span></button>
        <button><span class="material-symbols-outlined" @click="info">info</span></button>
    </div>
  </div>
</template>

<script>
const STATUS = {
  text: "ENTER STRING",
  givens: "ENTERING GIVENS",
  notes: "ENTERING NOTES",
  solving: "SOLVING"
}

const TIMER = {
  stopped: 0,
  running: 1,
  paused: 2
}

const CHECK = {
  no: 0,
  yes: 1,
  solution: 2
}

import { resetNumbers } from "../state";
import { numbers } from "../state";
import { secondsToHHMMSS } from "../utils";

export default {
  data() {
    return {
      numberCounts: [],
      numbers,
      timerState: TIMER.stopped,
      timeCountSeconds: 0,
      theTime: ""
    }
  },
  mounted() {
    this.numberCounts = Array(10).fill(9);
    setInterval(this.theTimer, 1000);
    this.updateTimeDisplay();
  },
  methods: {
    play(event) {
      switch(this.timerState) {
        case TIMER.stopped:
        case TIMER.paused:
          this.timerState = TIMER.running;
            break;
        case TIMER.running:
          this.timerState = TIMER.paused;
        break;
      }
    },
    reset(event) {
      switch(this.timerState) {
        case TIMER.paused:
        case TIMER.running:
          this.timerState = TIMER.stopped;
          this.timeCountSeconds = 0;
          this.updateTimeDisplay();
      }
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
    wipe(event) {
      resetNumbers();
    },
    check(event) {

    },
    info(event) {

    },
    theTimer() {
      if (this.timerState == TIMER.running) {
        this.timeCountSeconds += 1;
        this.updateTimeDisplay();
      }
    },
    updateTimeDisplay() {
      this.theTime = secondsToHHMMSS(this.timeCountSeconds);
    }
  }
}
</script>

