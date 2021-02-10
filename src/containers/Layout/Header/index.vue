<template>
  <div :class="`
    header-content 
    ${isHomePage ? 'home' : 'not-home'}
  `">
    <nav :class="`main-sections-nav ${isNavOpen ? 'open' : 'closed'}`">
      <h1 class="app-title">
        <router-link to="/">
          Thierry Cayman <span class="art">Art</span>
        </router-link>
      </h1>
      <img
        class="app-logo light"
        loading="lazy"
        alt="Signature de Thierry Cayman"
        src="/static/images/misc/logo-site-clair.svg"
      />
      <img
        class="app-logo dark"
        loading="lazy"
        alt="Signature de Thierry Cayman"
        src="/static/images/misc/logo-site.svg"
      />

      <ul class="links-list">
        <li>
          <router-link
            @click="moveBorder"
            :to="{ name: 'portfolio'}"
            :class="$route.path.match('portfolio') ? 'router-link-active' : ''"
          >{{ $t('app.sections.portfolio') }}</router-link>
        </li>
        <li class="bar">|</li>
        <li>
          <router-link
            @click="moveBorder"
            :to="{ name: 'bibliographie' }"
          >
            {{ $t('app.sections.bibliography') }}
          </router-link>
        </li>
        <li class="bar">|</li>
        <li>
          <router-link
            @click="moveBorder"
            :to="{ name: 'contacts' }"
          >
            {{ $t('app.sections.contacts') }}
          </router-link>
        </li>
        <li class="bar">|</li>
        <li>
          <router-link
            @click="moveBorder"
            :to="actualiteLink"
            :class="$route.path.match('actualites') ? 'router-link-active' : ''"
          >
            {{ $t('app.sections.news') }}
          </router-link>
        </li>
        <li class="bar">|</li>
        <li>
          <router-link
            @click="moveBorder"
            :to="{ name: 'liens' }"
          >
            {{ $t('app.sections.links') }}
          </router-link>
        </li>
        <br />
        <li style="margin-left: .25rem" class="lang">
          <LanguageSelect></LanguageSelect>
        </li>
        <span
          class="moving-border"
          :style="{
            width: `${borderPos.width}px`,
            left: `${borderPos.left}px`,
            transition: borderPos.transition
          }"
        ></span>
      </ul>
      <button
        @click="isNavOpen = !isNavOpen"
        :class="`
          nav-toggler 
          ${isNavOpen ? 'active' : 'inactive'}
        `"
      >
        {{ isNavOpen ? '×' : '⋮' }}
      </button>
    </nav>
  </div>
</template>

<script>
import LanguageSelect from '../../../components/language-select'
export default {
  name: 'Header',
  props: {
    isHomePage: {
      type: Boolean,
      default: false
    }
  },
  components: {
    LanguageSelect
  },
  data () {
    return {
      isNavOpen: false,
      borderPos: {
        left: 0,
        width: 0,
        transition: ''
      }
    }
  },
  methods: {
    moveBorder: function (clickEvent) {
      if (!this.isHomePage && window.innerWidth > 920) {
        const { target } = clickEvent
        const { width, left } = target.getBoundingClientRect()
        const offsetLeft = target.parentElement.parentElement.getBoundingClientRect().left
        this.borderPos = {
          width,
          left: left - offsetLeft,
          transition: 'width .2s ease-in .2s, left .4s cubic-bezier(.62,-0.53,.1,.94) 0s'
        }
      }
    }
  },
  computed: {
    actualiteLink () {
      const now = new Date()
      const month = now.getMonth()
      const year = now.getFullYear()
      return `/actualites/${month}-${year}`
    }
  }
}
</script>

<style scoped>
.header-content {
  position: relative;
  transition: ease all .5s;
  padding: 0 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.main-sections-nav {
  text-align: right;
}

.app-title {
  position: relative;
  width: 0;
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
  margin-top: -.25rem;
  margin-left: 3.5rem;
  padding: 1.5rem 0;
  color: var(--titles-dark);
  transition: ease all .5s;
  text-align: center;
  white-space: nowrap;
  float: left;
  z-index: 2;
  animation: shrink .5s cubic-bezier(.56,0,.68,1.47);
}
.app-title a {
  text-decoration: none;
  color: inherit;
}

.app-logo {
    position: absolute;
    margin: auto;
    left: 1rem;
    top: 0;
    bottom: 0;
    z-index: 1;
    user-select: none;
    width: auto;
    max-width: calc(100% - 2rem);
    max-height: 100%;
    transform: translateY(2px);
    transition: .5s all ease;
}
.app-logo.light {
  opacity: 0 !important;
  animation: grow .5s cubic-bezier(.56,0,.68,1.47);
}
.app-logo.dark {
  pointer-events: none;
  opacity: 1;
  cursor: pointer;
}

.links-list {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-flow: row wrap;
  gap: .25rem;
  margin: 0 auto;
  padding: 0 2rem;
  width: auto;
  min-width: 0;
  font-size: 1rem;
  transition: ease all .5s;
  z-index: 2;
}
.links-list > li {
  list-style: none;
  animation: fade-in-right 1s ease both;
  padding: 1.25rem 0;
}
.links-list > li:nth-child(1) { animation-delay: .3s;}
.links-list > li:nth-child(2) { animation-delay: .35s;}
.links-list > li:nth-child(3) { animation-delay: .4s;}
.links-list > li:nth-child(4) { animation-delay: .45s;}
.links-list > li:nth-child(5) { animation-delay: .5s;}
.links-list > li:nth-child(6) { animation-delay: .55s;}
.links-list > li:nth-child(7) { animation-delay: .6s;}
.links-list > li:nth-child(8) { animation-delay: .65s;}
.links-list > li:nth-child(9) { animation-delay: .7s;}
.links-list > li:nth-child(10) { animation-delay: .75s;}
.links-list > li:nth-child(11) { animation-delay: .8s;}
.links-list > li:nth-child(12) { animation-delay: .85s;}
.links-list > li > a {
  display: inline-block;
  text-decoration: none;
  padding: 0 .25rem;
  border: 1px solid transparent;
  transition: .3s all ease;
}
.links-list > li > a.router-link-active,
.links-list > li > a:active {
  text-decoration: none;
  color: var(--link-active);
}
.links-list > li > a:hover,
.links-list > li > a:focus {
  color: var(--link-active);
  outline: none;
}
.links-list > li > a.router-link-active {
  background: var(--border-light-broken);
  border-radius: 999px;
}
.links-list > li > a.router-link-active:hover {
  filter: unset;
}
.links-list > li.bar {
  user-select: none;
  color: var(--border-light-broken);
  transition: .5s all ease;
}

.moving-border { /* Moving border */
  position: absolute;
  background: var(--link-active);
  top: calc(100% - 1px);
  height: 2px;
  display: block;
  transition: .3s all ease;
}
.home .moving-border {
  visibility: hidden;
}

.nav-toggler {
  display: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.25rem;
  position: absolute;
  top: 1.375rem;
  right: 1.5rem;
  border: 1px solid var(--border-light-broken);
  border-radius: 3px;
  box-shadow: 0 0 1px 0 #4444;
  width: 3rem;
  padding-bottom: 0;
  text-align: center;
  background: var(--bg-light-broken);
  color: var(--text);
  transition: .3s all ease;
  animation: fade-in .3s ease;
}
.nav-toggler:hover { filter: brightness(.975) }
.nav-toggler:focus {
  outline: none;
  box-shadow: 0 0 1px 1px #2224;
}

/* Home page */
.home .header-content {
  padding: calc(50vh - 61px) 0;
}
.home .app-title {
  width: 100%;
  font-size: 3.5rem;
  transform: translateY(50% - 1.75rem);
  margin-top: 0;
  margin-left: 0;
  margin-bottom: 1rem;
  padding: 0;
  /*white-space: normal;*/
}
.home .app-title > a {
  cursor: default;
}

.home .app-logo {
  pointer-events: none;
  right: 0;
  left: 0;
  width: 500px;
  opacity: .5 !important;
  transform: translateY(0);
}
.home .app-logo.dark {
  pointer-events: initial;
  opacity: 0 !important;
  cursor: default;
}

.home .links-list {
  min-width: 100% !important;
  font-size: 1.25rem;
  gap: 0 1rem;
}
.home .links-list > li > a { padding: 0; }


@media screen and (max-width: 1050px) {
  .links-list {
    gap: 0 .25rem;
  }
  .home .links-list {
    gap: .25rem .5rem;
  }
}

@media screen and (max-width: 920px) {
  .moving-border {
    visibility: hidden;
  }
  /* Closed nav */
  .main-sections-nav.closed {
    height: 4.25rem;
  }
  .main-sections-nav.closed .links-list {
    display: none;
  }
  .home .main-sections-nav .links-list {
    display: inline-flex;
  }

  .main-sections-nav .nav-toggler {
    display: inline-block;
  }
  .main-sections-nav .nav-toggler.active {
    background: var(--border-light-broken);
    box-shadow: 0 0 2px 0 var(--text-dark);
  }
  .home .nav-toggler {
    display: none;
  }

  .app-logo {
    display: block;
  }

  .links-list > li {
    padding: 0;
  }
  .links-list > li > a.router-link-active {
    padding: 0;
    background: unset;
  }

  /* Open nav */
  .not-home .main-sections-nav.open .links-list {
    display: flex;
    flex-flow: column wrap;
    clear: left;
    padding: 1rem 0;
    border-top: 1px solid var(--border-light-broken);
  }
  .not-home .main-sections-nav.open .links-list .bar { display: none; }

  .not-home .main-sections-nav.open .links-list > li {
    width: 100%;
    display: block;
  }
  .not-home .main-sections-nav.open .links-list > li > a {
    padding: .5rem 1rem;
    letter-spacing: 1px;
    opacity: .9;
    border-radius: 3px;
    width: 100%;
  }
  .not-home .main-sections-nav.open .links-list > li > a:hover,
  .not-home .main-sections-nav.open .links-list > li > a:focus {
    border-top-color: var(--border-light-broken);
    border-bottom-color: var(--border-light-broken);
    padding-right: 1.5rem;
  }
  .not-home .main-sections-nav.open .links-list > li > a:focus {
    background: transparent;
  }
  .not-home .main-sections-nav.open .links-list > li > a:active,
  .not-home .main-sections-nav.open .links-list > li > a.router-link-active {
    opacity: 1;
    padding-right: 1.5rem;
  }

  .not-home .main-sections-nav.open .app-logo {
    bottom: unset;
    height: 4.5rem;
  }

  .not-home .lang {
    border-top: 1px solid var(--border-light-broken);
  }
}

@media  screen and (max-width: 575px) {
  .home .app-title {
    font-size: 9.5vw;
  }  
}

@media  screen and (max-width: 385px) {
  .art {
    display: none;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
}
@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateY(-.5rem);
  } to {
    opacity: 1;
    transform: translate(0);
  }
}

@keyframes grow {
  from {
    opacity: 0;
    transform: scale(.875);
  } to {
    opacity: .5;
    transform: scale(1);
  }
}
@keyframes shrink {
  from {
    opacity: 0;
    transform: scaleX(1.125);
  } to {
    opacity: 1;
    transform: scaleX(1);
  }
}
</style>