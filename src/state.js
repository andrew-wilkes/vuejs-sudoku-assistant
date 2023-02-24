
import { reactive } from 'vue'

export const numbers = reactive({
  grid: [],
  candidates: [],
  solution: []
})

export const selectedCell = {
  idx: -1,
  bid: -1,
  cid: -1
}

export const config = {
  remove: true,
  same: true,
  invalid: true,
  remaining: true
}

export const resetNumbers = () => {
  numbers.grid = Array(81).fill(0);
  numbers.candidates = Array(81).fill("123456789");
  numbers.solution = [];
}

resetNumbers();
