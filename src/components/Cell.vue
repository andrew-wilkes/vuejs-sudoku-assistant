<template>
    <div class="cell" :class="{ highlighted: highlighted }">
        <button v-if="numbers.candidates.length < 2" type="button" class="cell cell-top" :class="{ given: isGiven }">{{ topValue }}</button>
        <button v-else-if="numbers.candidates.length < 3" type="button" class="cell cell-str">
            <span v-for="n in numbers.candidates" :class="'n' + n">{{ n }}</span>
        </button>
        <button v-else type="button" class="cell cell-grid">
            <div v-for="n in 9" class="num" :class="'n' + n">{{ candidate(n) }}</div>
        </button>
    </div>
</template>

<script>
import { numbers } from "../state";

export default {
  data() {
    return {
      numbers,
      number: 5
    }
  },
  props: {
    highlighted: Boolean,
    idx: Number
  },
  computed: {
    topValue() {
        if (this.number == 0) return "";
        if (this.number > 10) return this.number - 10;
        return this.number;
    },
    isGiven() {
        return this.number > 10;
    }
  },
  methods: {
    candidate(n) {
        return this.numbers.candidates[0].indexOf('' + n) > -1 ? n : '';
    }
  }
}
</script>