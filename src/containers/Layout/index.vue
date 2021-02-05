<template>
  <div :class="`
      app-wrapper 
      ${$route.name === 'home' ? 'home' : 'not-home' }
    `"
  >
    <transition name="fade-top">
        <button
            v-if="isScrollToTopBTNVisible"
            class="scroll-to-top"
            @click="scrollToTop"
        >
            <font-awesome-icon icon="chevron-up"></font-awesome-icon>
        </button>
    </transition>

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
    data () {
        return {
            isScrollToTopBTNVisible: false
        }
    },
    components: {
        Header, Footer
    },
    methods: {
        handlePageScroll: function () {
            const scrollPos = window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop
            // Display scroll-to-top btn when user scrolls down
            if (scrollPos > 300 && this.isScrollToTopBTNVisible === false) {
                this.isScrollToTopBTNVisible = true
            } else if (scrollPos <= 300 && this.isScrollToTopBTNVisible === true) {
                this.isScrollToTopBTNVisible = false
            }
        },
        scrollToTop: function () {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        }
    },
    mounted () {
        window.addEventListener('scroll', this.handlePageScroll, true)
    },
    unmounted () {
        window.removeEventListener('scroll', this.handlePageScroll, true)
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

.scroll-to-top {
    position: fixed; top: 1rem; right: 2rem;
    z-index: 9;
    color: var(--text-dark);
    background: var(--bg-light-broken);
    padding: 1rem;
    border: 1px solid var(--border-light-broken);
    box-shadow: 0 0.125rem 0.25rem 0 #2229;
    border-radius: 50%;
    height: 3rem;
    width: 3rem;
    opacity: .875;
    cursor: pointer;
    transition: .2s all ease;
}
.scroll-to-top:hover,
.scroll-to-top:focus {
    outline: none;
    opacity: 1;
}


/* Transitions */
.fade-top-enter-active,
.fade-top-leave-active {
    transition: .3s all ease;
}
.fade-top-enter-from,
.fade-top-leave-to {
    transform: translateY(-1rem);
    opacity: 0 !important;
}
</style>

<style>
.app-wrapper.not-home li,
.app-wrapper.not-home p {
  font-size: .95em;
}
</style>