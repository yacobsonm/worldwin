<template>
  <v-app id="app">
      <world-window style="overflow-x: auto"/>
  </v-app>
</template>

<script>
import WorldWindow from './components/WorldWindow'

export default {
  name: 'App',
  components: {
    WorldWindow
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
