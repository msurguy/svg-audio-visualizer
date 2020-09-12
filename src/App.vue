<template>
  <div id="app">
    <Recorder />
    <!-- <Waveform/> -->
  </div>
</template>

<script>
// import Waveform from './components/Waveform.vue'
import Recorder from './components/Recorder.vue'

export default {
  name: 'app',
  components: {
    Recorder
    // Waveform
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
