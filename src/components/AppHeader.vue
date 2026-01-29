<template>
  <header class="appHeader">
    <div class="headerInner">
      <!-- Logo / Brand -->
      <RouterLink to="/" class="brand">
        <span class="brandPrimary">arabam</span>
        <span class="brandSoft">clone</span>
      </RouterLink>

      <!-- Nav -->
      <nav class="nav">
        <RouterLink to="/" class="navLink">İlanlar</RouterLink>
        <RouterLink to="/favorites" class="navLink">Favoriler</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
