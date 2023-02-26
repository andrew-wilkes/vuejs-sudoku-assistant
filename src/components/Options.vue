<template>
    <div class="options">
        <h3>Options</h3>
        <div>
            <input type="checkbox" name="remove" v-model="config.remove"/>
            <label for="remove">Remove matched note numbers</label>
        </div>
        <div>
            <input type="checkbox" name="same" v-model="config.same"/>
            <label for="same">Highlight same numbers</label>
        </div>
        <div>
            <input type="checkbox" name="invalid" v-model="config.invalid"/>
            <label for="invalid">Prevent invalid number entries</label>
        </div>
        <div>
            <input type="checkbox" name="remaining" v-model="config.remaining"/>
            <label for="remaining">Show remaining numbers</label>
        </div>
    </div>
</template>

<script>
import { config } from "../state";

export default {
    data() {
        return {
            config
        }
    }
}
</script>

<style scoped>
  label {
    white-space: nowrap;
  }
</style>
