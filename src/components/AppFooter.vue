<template>
  <footer class="appFooter">
    <div class="footerInner">
      <div class="footerLeft">
        © {{ year }} arabam-clone
      </div>

      <div class="footerRight">
        <a href="https://github.com/onursenturk" target="_blank">
          GitHub
        </a>
        <span class="dot">•</span>
        <span>Vue 3 + PrimeVue</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear();
</script>
