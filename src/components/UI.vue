<template>
  <div class="ui">
    <div class="status">{{ gameState }}</div>
    <div class="timer">
        <span>{{ theTime }}</span>
        <button><span class="material-symbols-outlined" @click="play">play_pause</span></button>
        <button><span class="material-symbols-outlined" @click="reset">restart_alt</span></button>
    </div>
    <div class="numbers">
      <div v-for="n in 9"><button @click="this.handleNumberInput(n)">{{ n }}</button><div class="count">{{ numberCounts[n - 1] }}</div></div>
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
import { cells } from "../state";
import { config } from "../state";
import { getPeers } from "../utils";
import { getSolution } from "../solver";

export default {
  data() {
    return {
      numberCounts: [],
      numbers,
      timerState: TIMER.stopped,
      timeCountSeconds: 0,
      theTime: "",
      gameState: STATUS.givens,
      config,
      addedAllCandidates: false,
      lastCellToAddCandidatesTo: -1
    }
  },
  mounted() {
    this.numberCounts = Array(10).fill(9);
    setInterval(this.theTimer, 1000);
    this.updateTimeDisplay();
    document.addEventListener('keydown', (event) => this.handleNumberInput(event.key));
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
      this.handleNumberInput(0);
    },
    notes(event) {
      if (this.gameState == STATUS.solving) {
        this.gameState = STATUS.notes;
      } else {
          if (this.gameState == STATUS.givens) this.numbers.solution = getSolution(this.numbers.grid);
          this.gameState = STATUS.solving;
      }
    },
    givens(event) {
      if (this.gameState == STATUS.givens) {
        this.gameState = STATUS.text;
      } else {
        this.gameState = STATUS.givens;
      }
    },
    add(event) {
      let idx = cells.selected.idx;
      if (this.lastCellToAddCandidatesTo == idx) {
        this.numbers.candidates[idx] = "";
        this.lastCellToAddCandidatesTo = -1;
      } else if (idx > -1 && this.numbers.grid[idx] == 0) {
        this.numbers.candidates[idx] = "123456789";
        this.reduceCandidateNumbersOfCell(idx);
        this.lastCellToAddCandidatesTo = idx;
      }
    },addAll(event) {
      cells.selected.idx = -1;
      this.lastCellToAddCandidatesTo = -1;
      if (this.addedAllCandidates) {
        this.addedAllCandidates = false;
        this.numbers.candidates.fill("");
      } else {
        cells.peers = []; // Remove highlights
        this.numbers.candidates.fill("123456789");
        for (let idx in this.numbers.grid) {
          if (this.numbers.grid[idx] > 0) {
            this.numbers.candidates[idx] = "";
            this.removeRelatedCandidateNumbers(idx, this.numbers.grid[idx]);
          }
        }
        this.addedAllCandidates = true;
      }
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
    },
    handleNumberInput(key) {
      let n = parseInt(key); // This allows the space bar to produce 0 for isNaN
      n = isNaN(n) ? 0 : n;
      let idx = cells.selected.idx;
      if (idx < 0) return; // No selected cell
      if (this.gameState == STATUS.notes) {
        if (this.numbers.grid[idx] > 0) return; // Can't add notes to completed cell
        if (n == 0) return; // Note entry not 1 - 9
        if (config.invalid && !this.isPlacementValid(n, idx, false)) return;
        // Add or remove note number from candidates string
        let cidx = this.numbers.candidates[idx].indexOf('' + n);
        if (cidx < 0) {
          this.numbers.candidates[idx] = this.numbers.candidates[idx] + n;
        } else {
          this.numbers.candidates[idx] = this.numbers.candidates[idx].replace('' + n, '');
        }
      } else if (this.numbers.grid[idx] < 10 || this.gameState == STATUS.givens) {
        if (!this.isPlacementValid(n, idx, this.gameState == STATUS.givens)) return;
        // Cell does not contain a given number or we are adding a given number
        if (n > 0) {
          if (this.config.remove) this.removeRelatedCandidateNumbers(idx, n);
          if (this.gameState == STATUS.givens) n += 10;
        }
        this.numbers.grid[idx] = n;
        this.numbers.candidates[idx] = "";
      }
    },
    isPlacementValid(n, idx, placingGiven) {
      if (n == 0) return true;
      if (placingGiven) n += 10;
      // Scan row and column
      let x = Math.floor(idx / 9) * 9;
      let y = idx % 9;
      for (let i = 0; i < 9; i++) {
          if (this.getGridNumber(x, placingGiven) == n) return false;
          x += 1;
          if (this.getGridNumber(y, placingGiven) == n) return false;
          y += 9;
      }
      // Scan box
      let b = Math.floor(idx / 27) * 27 + Math.floor((idx % 9) / 3) * 3;
      for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
              if (this.getGridNumber(b + j, placingGiven) == n) return false;
          }
          b += 9;
      }
      return true;
    },
    getGridNumber(idx, placingGiven) {
      let n = this.numbers[idx];
      if (n > 9 && !placingGiven) n -= 10;
      return n;
    },
    removeRelatedCandidateNumbers(idx, n) {
      if (n > 10) n -= 10;
      for (let pidx of getPeers(idx)) {
        this.numbers.candidates[pidx] = this.numbers.candidates[pidx].replace('' + n, '');
      }
    },
    reduceCandidateNumbersOfCell(idx) {
      for (let pidx of getPeers(idx)) {
        let n = this.numbers.grid[pidx];
        if (n > 10) n -= 10;
        if (n > 0) {
          this.numbers.candidates[idx] = this.numbers.candidates[idx].replace('' + n, '');
        }
      }
    }
  }
}
</script>

