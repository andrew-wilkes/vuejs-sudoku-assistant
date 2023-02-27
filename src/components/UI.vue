<template>
  <div class="ui">
    <div class="status">{{ gameState }}</div>
    <div class="timer">
        <span>{{ theTime }}</span>
    </div>
    <div class="numbers">
      <div v-for="n in 9"><button @click="this.handleNumberInput(n)">{{ n }}</button><div v-if="config.remaining" class="count">{{ numberCounts[n] }}</div></div>
    </div>
    <div class="controls">
        <button style="width: 24px; box-sizing: content-box;" @click="zero">&nbsp;</button>
        <button><span class="material-symbols-outlined" @click="notes">edit</span></button>
        <button><span class="material-symbols-outlined" @click="givens">edit_square</span></button>
        <button><span class="material-symbols-outlined" @click="add">add</span></button>
        <button><span class="material-symbols-outlined" @click="addAll">add_circle</span></button> 
        <button><span class="material-symbols-outlined" @click="check">check</span></button>
        <button><span class="material-symbols-outlined" @click="play">play_pause</span></button>
        <button><span class="material-symbols-outlined" @click="reset">restart_alt</span></button>
        <button><span class="material-symbols-outlined" @click="wipe">delete</span></button>
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

import { resetNumbers, numbers, cells, config } from "../state";
import { secondsToHHMMSS, getPeers } from "../utils";
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
      lastCellToAddCandidatesTo: -1,
      checkState: CHECK.no
    }
  },
  watch: {
    'numbers.newPuzzle'(update) {
      if (update) {
        numbers.newPuzzle = false;
        this.startSolving();
      }
    }
  },
  mounted() {
    this.numberCounts = Array(10).fill(9);
    setInterval(this.theTimer, 1000);
    this.updateTimeDisplay();
    document.addEventListener('keydown', (event) => this.handleNumberInput(event.key));
  },
  methods: {
    play() {
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
    reset() {
      switch(this.timerState) {
        case TIMER.paused:
        case TIMER.running:
          this.timerState = TIMER.stopped;
          this.timeCountSeconds = 0;
          this.updateTimeDisplay();
      }
    },
    zero() {
      this.handleNumberInput(0);
    },
    notes() {
      if (this.gameState == STATUS.solving) {
        this.gameState = STATUS.notes;
      } else {
          if (this.gameState == STATUS.givens) {
            numbers.newGivens = true;
            this.startSolving();
          } else {
            this.gameState = STATUS.solving;
          }
      }
    },
    givens() {
      if (this.gameState == STATUS.givens) {
        numbers.newGivens = true;
        this.startSolving();
      } else {
        this.gameState = STATUS.givens;
      }
    },
    startSolving() {
      this.gameState = STATUS.solving;
      this.unselect();
      this.numbers.solution = getSolution(this.numbers.grid);
    },
    add() {
      let idx = cells.selected.idx;
      if (this.lastCellToAddCandidatesTo == idx) {
        this.numbers.candidates[idx] = "";
        this.lastCellToAddCandidatesTo = -1;
      } else if (idx > -1 && this.numbers.grid[idx] == 0) {
        this.numbers.candidates[idx] = "123456789";
        this.reduceCandidateNumbersOfCell(idx);
        this.lastCellToAddCandidatesTo = idx;
      }
    },addAll() {
      this.unselect();
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
    wipe() {
      resetNumbers();
      this.unselect();
      this.gameState = STATUS.givens;
    },
    unselect() {
      cells.peers = []; // Unhighlight cells
      cells.selected.idx = -1;
      cells.selected.bid = -1;
    },
    check() {
      if (this.gameState != STATUS.solving) return;
      switch(this.checkState) {
        case CHECK.no:
          let numGuesses = 0;
          this.numbers.grid.forEach(n => { if (n > 0 && n < 10) numGuesses++ })
          if (numGuesses > 0) {
            this.checkState = CHECK.yes;
            this.numbers.showWrong = true;
          } else {
            this.checkState = CHECK.solution;
            this.numbers.showSolution = true;
            this.unselect();
          }
          break;
        case CHECK.yes:
          this.checkState = CHECK.solution;
          this.numbers.showSolution = true;
          this.numbers.showWrong = false;
          this.unselect();
          break;
        case CHECK.solution:
          this.checkState = CHECK.no;
          this.numbers.showSolution = false;
          break;
      }
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
        if (config.invalid && this.doPeersContainNumber(idx, n, false)) return;
        // Add or remove note number from candidates string
        let cidx = this.numbers.candidates[idx].indexOf('' + n);
        if (cidx < 0) {
          this.numbers.candidates[idx] = this.numbers.candidates[idx] + n;
        } else {
          this.numbers.candidates[idx] = this.numbers.candidates[idx].replace('' + n, '');
        }
      } else {
        // Check if the number may be applied
        if (this.numbers.grid[idx] > 10 && n < 10 && this.gameState != STATUS.givens) return;
        if (n > 0) {
          if (this.doPeersContainNumber(idx, n, this.gameState == STATUS.givens)) return;
          // Cell does not contain a given number or we are adding a given number
          if (this.config.remove) this.removeRelatedCandidateNumbers(idx, n);
          if (this.gameState == STATUS.givens) n += 10;
        }
        this.numbers.grid[idx] = n;
        this.numbers.candidates[idx] = "";
        this.updateNumberCounts();
        this.numbers.showWrong = false;
        this.checkState = CHECK.no;
        this.numbers.showSolution = false;
      }
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
    },
    doPeersContainNumber(idx, n, placingGiven) {
      if (placingGiven) n += 10;
      for (let pidx of getPeers(idx)) {
        let x = this.numbers.grid[pidx];
        if (x > 10 && !placingGiven) x -= 10;
        if (x == n) return true;
      }
      return false;
    },
    updateNumberCounts() {
      this.numberCounts.fill(9);
      for (let n of this.numbers.grid) {
        if (n > 10) n -= 10;
        this.numberCounts[n]--;
      }
    }
  }
}
</script>

