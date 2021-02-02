<template>
  <div :class="`
    footer-content 
    ${isHomePage ? 'home' : ''}
  `"></div>
</template>

<script>
export default {
    name: 'Footer',
    props: {
      isHomePage: {
        type: Boolean,
        default: false
      }
    }
}
</script>

<style scoped>
.footer-content {
  display: block;
}
</style>