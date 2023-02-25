
import { reactive } from 'vue'

export const numbers = reactive({
  grid: [],
  candidates: [],
  solution: [],
  showSolution: false,
  showWrong: false
})

export const cells = reactive({
  selected: {
    idx: -1,
    bid: -1,
    cid: -1
  },
  peers: []
})

export const config = reactive({
  remove: true,
  same: true,
  invalid: true,
  remaining: true
})

export const resetNumbers = () => {
  numbers.grid = Array(81).fill(0);
  numbers.candidates = Array(81).fill('');
  numbers.solution = [];
  numbers.showSolution = false;
  numbers.showWrong = false;
}

resetNumbers();
