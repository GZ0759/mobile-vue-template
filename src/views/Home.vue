<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
<style lang="scss" scoped>
.home {
  width: 200px;
  margin-left: 75px;
  font-size: 18px;
  img {
    width: 160px;
    height: 100px;
    margin: 0 auto;
  }
}
</style>
