<template>
  <div :class="`
    footer-content 
    ${isHomePage ? 'home' : ''}
  `">
  <transition name="fade">
    <div class="homepage-footer" v-if="isHomePage">
      <small class="copyright">© {{ new Date().getFullYear() }}</small>
      <address class="developer-contact">
        {{ $t('app.developedBy') }}&nbsp;
        <a
          href="http://www.theobayenet.com"
          :title="$t('app.contactDev')"
          rel="noopener noreferrer"
          target="_blank"
        >Théo B.</a>
      </address>
    </div>
  </transition>
  </div>
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

.homepage-footer {
  position: fixed; bottom: 2rem;
  width: 100%; text-align: center;
  z-index: 11;
}

.copyright {
  animation: fade-in .5s ease both;
  animation-delay: .9s;
}

.developer-contact {
  animation: stretch-out 1s cubic-bezier(.56,.15,.45,1.8) both;
  animation-delay: 1s;
  font-family: 'Dosis', sans-serif;
}
.developer-contact a {
  font-weight: 700;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: .3s all ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}


@keyframes fade-in {
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
}
@keyframes stretch-out {
  from {
    opacity: 0;
    transform: scaleX(.75);
  } to {
    opacity: 1;
    transform: scaleX(1);
  }
}
</style>