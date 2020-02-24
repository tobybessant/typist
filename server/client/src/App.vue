<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=EB+Garamond&display=swap');

body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  font-family: serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  font-family: 'EB Garamond', serif;
}

h1 {
	font-size: 5.0em;
}
</style>
