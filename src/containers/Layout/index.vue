<template>
  <div :class="`
      app-wrapper 
      ${$route.name === 'home' ? 'home' : 'not-home' }
    `"
  >
    <header class="app-header">
        <Header :isHomePage="$route.name === 'home'" />
    </header>
    <main class="app-content">
        <slot></slot>
    </main>
    <footer class="app-footer">
        <Footer :isHomePage="$route.name === 'home'" />
    </footer>
  </div>
</template>

<script>
import Header from './Header'
import Footer from './Footer'

export default {
    name: 'Layout',
    components: {
        Header, Footer
    }
}
</script>

<style>
body {
    background: var(--bg-light);
}
</style>
<style scoped>
.app-wrapper {
    display: block;
    overflow: hidden;
}
.app-header {
    min-height: 55px;
    background: var(--bg-light-broken);
    border-bottom: 1px solid var(--border-light-broken);
    transition: ease all 1s;
    transition-delay: .5s;
}
.app-content {
    max-width: 1400px;
    min-height: 66vh;
    margin: 0 auto;
    padding: 2rem 1rem;
    transition: .5s all ease;
}
.app-footer {
    display: block;
}

/* Home page layout */
.app-wrapper.home .app-header {
    background: var(--bg-light);
    border-bottom-color: transparent;
}

.app-wrapper.home .app-content {
    min-height: 0;
    padding: 0;
}
</style>

<style>
.app-wrapper.not-home li,
.app-wrapper.not-home p {
  font-size: .95em;
}
</style>