<template>
  <div class="links">
      <header class="section-header">
          <h2 class=section-title>{{ $t('app.links.title') }}</h2>
          <p class=section-description>
              {{ $t('app.links.description') }}
          </p>
      </header>
      <ul class="links-list">
          <li class="msg loading" v-if="$store.state.links.length <= 0">
            {{ $t('links.loadingLinks') }}&nbsp;
            <font-awesome-icon icon="cog" class="cog"></font-awesome-icon>
          </li>
          <template v-else>
              <li
                v-for="(link, index) in links"
                :key="link.adresse_de_redirection"
                :style="{animationDuration: index/10 + 's'}"
              >
                  <strong v-if="link.description">{{ link.description + ': ' }}</strong>
                  <a
                    class="link"
                    :href="link.adresse_de_redirection"
                    :title="link.adresse_visible"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                      {{ link.adresse_visible || link.adresse_de_redirection }}
                  </a>
              </li>
          </template>
      </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'links',
    computed: {
        links () {
            return this.$store.state.links
        }
    },
    methods: {
        async fetchOnceLinks () {
            if (this.$store.state.links.length <= 0) {
                // Fetch links
                try {
                    const res = await axios.get('/api/liens/')
                    this.$store.dispatch('setLinks', res.data)
                } catch (err) {
                    console.log({ err })
                    this.$store.dispatch('setLinks', false)
                }
            }
        }
    },
    mounted () {
        this.fetchOnceLinks()
    }
}
</script>

<style scoped>
.section-title {
    margin-top: 0;
    font-weight: 400;
}

.section-header {
    background: var(--bg-light-broken);
    padding: 1rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-light-broken);
    border-radius: .25rem;
}
.section-description {
    margin-bottom: 0;
    font-size: 1.125em !important;
}

.links-list {
    font-size: 1.125em !important;
}
.links-list > li {
    margin-bottom: 1rem;
}
.link {
    animation: fade-in-up .3s ease;
    transition: .2s all ease;
}
.link:hover,
.link:focus,
.link:active {
    outline: none;
    color: var(--link-active);
}

.msg {
    margin-top: 1.25rem;
    padding: .5rem 1rem;
    border-radius: 0 3px 3px 0;
    list-style: none;
}
.msg.loading {
    background: var(--bg-light-broken);
    border-left: 3px solid var(--link-active);
    font-size: 1.125rem !important;
}
.cog {
    width: 1em;
    animation: spin 1s linear infinite;
    color: var(--link);
    vertical-align: middle;
}


@keyframes spin {
    from {
        transform: rotate(0);
    } to {
        transform: rotate(359deg);
    }
}
@keyframes fade-in-up {
    from {
        transform: translateY(1rem);
        opacity: 0;
    } to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>