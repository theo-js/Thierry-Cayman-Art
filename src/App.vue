<template>
  <Layout>
      <router-view></router-view>
  </Layout>
</template>

<script>
import { setLangAttribute } from './i18n/format'
import Layout from './containers/Layout'

export default {
  name: 'App',
  components: {
    Layout
  },
  mounted () {
    // Change html lang attribute
    setLangAttribute(this.$i18n.locale)
  }
}
</script>

<style>
/* CSS reset */
body {
  margin: 0;
  padding: 0;
}
body::before {
  content: '';
  height: 2px;
  width: 100%;
  background: linear-gradient(to right, rgb(153, 0, 255), rgb(0, 4, 255), rgb(0, 255, 85), rgb(157, 255, 0));
  display: block;
  opacity: .4;
}
/* Variables */
:root {
  --text-dark: #6c6d6e;
  --titles-dark: #333335;
  --titles-purple: #7c7582; /* #948c9a*/
  --bg-light: #FAFAFF;
  --bg-light-broken: #f7f7ff;
  --border-light-broken: #e4e4ef;
  --link: #177679B0;
  --link-active: #1d4575;
  --text-red: #9e2828;
  --bg-red: #fdf4f4;
}
/* Global */
html {
  box-sizing: border-box;
}
* {
  box-sizing: inherit;
}
::selection {
  background: var(--link);
  color: #FFF;
}
/* Scroll bars */
::-webkit-scrollbar {
    width: 1rem;
    height: 1rem;
    background: var(--bg-light-broken);
}
::-webkit-scrollbar-thumb {
    background-color: var(--border-light-broken);
    border: 3px solid transparent;
    border-radius: 9px;
    background-clip: content-box;
}
::-webkit-scrollbar-thumb:active {
    background-color: var(--text-dark);
}
::-webkit-scrollbar-corner {
    background: transparent;
}

#app {
  font-family: 'Noto Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-dark);
}
h1, h2, h3, h4, h5, h6 {
  font-family: 'Nanum Gothic', sans-serif;
  color: var(--titles-dark);
}
a {
  color: var(--link);
}
p {
  font-family: 'Dosis', sans-serif;
  letter-spacing: .625px;
}
em, strong {
  color: var(--titles-purple);
}
</style>
