<template>
    <div class="cell" :class="{ highlighted: highlighted }">
        <button v-if="candidates.length < 2" type="button" class="cell cell-top" :class="{ given: isGiven }">{{ topValue }}</button>
        <button v-else-if="candidates.length < 3" type="button" class="cell cell-str">
            <span v-for="n in candidates" :class="'n' + n">{{ n }}</span>
        </button>
        <button v-else type="button" class="cell cell-grid">
            <div v-for="n in 9" class="num" :class="'n' + n">{{ candidate(n) }}</div>
        </button>
    </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: {
    highlighted: Boolean,
    number: Number,
    candidates: String
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
        return this.candidates.indexOf('' + n) > -1 ? n : '';
    }
  }
}
</script>