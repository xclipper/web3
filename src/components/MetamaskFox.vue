<template>
  <div id="logo-container"></div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    const script = document.createElement('script')
    script.src = '/src/assets/MetaMaskFox.js' // Public klasöründeki dosyayı yükle
    script.async = true
    document.body.appendChild(script)
  },
}
</script>

<style scoped>
#logo-container svg {
  width: 50px;
  height: auto;
}

@media only screen and (max-width: 768px) {
  #logo-container svg {
    width: 50px;
    height: auto;
  }
}
</style>
