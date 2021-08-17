<template>
  <div class="bibliography">
    <nav class="category-section">
      <div class="sticky">
        <h2>{{ $t('app.sections.bibliography.full') }}</h2>
        <ul class="section-list">
          <li
              :class="`
                  section-list-item 
                  ${$route.params.section === 'bd' ? 'selected' : 'not-selected'}
              `"
              @mouseover="isComicsDropdownOpen = true"
              @mouseout="handleComicsDropdownMouseOut"
          >
            <span
              @click="isComicsDropdownClicked = !isComicsDropdownClicked"
              :class="`dropdown-toggler ${isComicsDropdownOpen ? 'active' : 'inactive'} ${isComicsDropdownClicked ? 'clicked' : 'not-clicked'}`"
            >
              {{ $t('bibliography.sections.comics') }}<font-awesome-icon icon="chevron-down" class="chevron"></font-awesome-icon>
            </span>
            <ul :class="`
              dropdown comics-dropdown 
              ${isComicsDropdownOpen ? 'collapsed' : 'not-collapsed'} 
              ${isComicsDropdownClicked ? 'clicked' : 'not-clicked'}
            `">
              <li :class="`
                section-list-item 
                ${currentBiblSection === 'series' ? 'selected' : 'not-selected'}
              `">
                <router-link
                  @click="isComicsDropdownClicked = true"
                  to="/bibliographie/series">{{ $t('bibliography.sections.series') }}</router-link>
              </li>
              <li :class="`
                section-list-item 
                ${currentBiblSection === 'oneshot' ? 'selected' : 'not-selected'}
              `">
                <router-link
                  @click="isComicsDropdownClicked = true"
                  to="/bibliographie/oneshot">One shot</router-link>
              </li>
              <li :class="`
                section-list-item 
                ${currentBiblSection === 'livres' ? 'selected' : 'not-selected'}
              `">
                <router-link
                  @click="isComicsDropdownClicked = true"
                  to="/bibliographie/livres">{{ $t('bibliography.sections.livres') }}</router-link>
              </li>
            </ul>
          </li>
          <li
            :class="`
                section-list-item 
                ${$route.params.section === 'divers' ? 'selected' : 'not-selected'}
            `"
            style="`animation-delay: .2s`"
          >
            <router-link to="/bibliographie/divers">
              {{ $t('bibliography.sections.divers') }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <main class="oeuvres-container">
        <header v-if="tSeries && tSeries.length > 0 && currentBiblSection === 'series'">
          <nav
            class="serie-select"
          >
            <ul class="series-list">
              <li
                v-for="(serie, index) in tSeries"
                :key="serie.nom_fr"
                :class="selectedBiblSerie && selectedBiblSerie.nom_fr === serie.nom_fr ? 'selected' : 'not-selected'"
              >
                <span
                  class="link"
                  :tabindex="index"
                  @click="$store.dispatch('selectBiblSerie', serie)"
                >
                  {{ serie.nom }}
                </span>
              </li>
            </ul>
          </nav>
          <article class="serie-info">
            <h3 class="current-serie-name">{{ selectedBiblSerie.nom_fr }}</h3>
            <p v-if="selectedBiblSerie.editeur" class="serie-publisher">
              <strong class="editeur">{{ $t('bibliographie.serie.editeur') + ':' }}</strong>&nbsp;
              <span class="publisher-name">{{ selectedBiblSerie.editeur }}</span>
            </p>
            <p v-if="selectedBiblSerie.a_propos" class="serie-about">
              {{ selectedBiblSerie.a_propos }}
            </p>
          </article>
        </header>
        <ul class="oeuvres-list" v-if="tOeuvres && tOeuvres.length > 0">
          <li
            class="oeuvre"
            v-for="(oeuvre, index) in tOeuvres"
            :style="`animation-delay: ${index/10}s`"
            :key="oeuvre.titre_fr"
          >
            <header class="oeuvre-header">       
            </header>
            <main class="oeuvre-body">
              <img
                v-if="oeuvre.illustration"
                class="oeuvre-illustration"
                :alt="oeuvre.titre + ' illustration'"
                loading="lazy"
                :src="oeuvre.illustration"
                @contextmenu.prevent
                @click="closeup(oeuvre)"
               />
              <h4 class="oeuvre-title">{{ oeuvre.titre }}</h4>
              <p class="oeuvre-about" v-if="oeuvre.a_propos">
                {{ oeuvre.a_propos }}
              </p>
            </main>
            <footer class="oeuvre-footer">
              <p class="oeuvre-date" v-if="oeuvre.parutionFormatted">
                <strong class="parution">{{ $t('bibliographie.oeuvre.parution') + ': ' }}</strong>
                {{ oeuvre.parutionFormatted }}
              </p>
            </footer>
          </li>
        </ul>
    </main>
    <transition name="fade-grow">
      <div class="modal-window" v-if="isModalOpen" @click="closeupEnd">
        <img
          v-if="selectedOeuvre"
          class="oeuvre-closeup"
          :alt="selectedOeuvre.titre"
          :src="selectedOeuvre.illustration"
          loading="eager"
          @contextmenu.prevent
         />
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import { intlifySerie, intlifyOeuvre } from '../../i18n/intlify'

export default {
  name: 'bibliographie',
  data () {
    return {
      hasSeriesFetchFailed: false,
      hasOeuvresFetchFailed: false,
      isComicsDropdownOpen: false,
      isComicsDropdownClicked: false,
      isModalOpen: false,
      selectedOeuvre: null
    }
  },
  watch: {
    currentBiblSection () {
      // Memorize current category (similarly to keep-alive component)
      if (this.currentBiblSection) {
        this.$store.dispatch('selectBiblSection', this.currentBiblSection)
      }

      // Fetch oeuvres once
      this.fetchOnceOeuvres()

      // Set document title
      document.title = 'Thierry Cayman Art | ' + this.$t(`bibliography.sections.${this.currentBiblSection}`)
    },
    selectedBiblSerie () {
      if (this.selectedBiblSerie) {
        // Fetch oeuvres if current serie doesn't have any
        // Check any oeuvre has current serie
        const oeuvreInStore = this.$store.state.biblOeuvres.series.find(oeuvre => {
          return oeuvre.serie_fr === this.selectedBiblSerie.nom_fr
        })
        // Only fetch more if current serie is empty
        if (!oeuvreInStore) {
          axios.get(`/api/bibliographie/oeuvres/?est_une_bd=true&categorie=series&serie=${encodeURIComponent(this.selectedBiblSerie.nom_fr)}`)
          .then(res => {
            this.$store.dispatch('pushOeuvres', { section: 'series', oeuvres: res.data })
          })
          .catch((err) => console.log({ err }))
        }
      }
    }
  },
  computed: {
    biblSections () {
      return ['divers', 'series', 'oneshot', 'livres']
    },
    currentBiblSection () {
      return this.biblSections.find(section => section === this.$route.params.section)
    },
    selectedBiblSerie () {
      if (!this.tSeries) return null
      return this.$store.state.selectedBiblSerie ?
        this.$store.state.selectedBiblSerie
        : this.tSeries[0]
    },
    currentOeuvres () {
      if (!this.currentBiblSection) return null
      let oeuvres = this.$store.state.biblOeuvres[this.currentBiblSection]

      // In series section, filter oeuvres so that user only views those remative to the current serie
      if (this.currentBiblSection === 'series') {
        oeuvres = oeuvres.filter(oeuvre => {
          return oeuvre.serie_fr === this.selectedBiblSerie.nom_fr
        })
      }

      if (!oeuvres || oeuvres.length <= 0) return null
      return oeuvres
    },
    tOeuvres () {
      if (!this.currentOeuvres) return null
      // Sort by date
      const current = this.currentOeuvres
      const sorted = current.sort((a, b) => {
        const date1 = new Date(a.parution)
        const date2 = new Date(b.parution)
        if (date1 > date2) return 1
        else if (date1 < date2) return -1
        return 0
      })
        // Translate
      return sorted.map(oeuvre => intlifyOeuvre(oeuvre, this.$i18n.locale))
    },
    tSeries () {
      if (!this.$store.state.biblSeries) return null
      return this.$store.state.biblSeries.map(serie => intlifySerie(serie, this.$i18n.locale))
    }
  },
  methods: {
    fetchOnceSeries: function () {
      return new Promise((resolve, reject) => {
        if (this.$store.state.biblSeries <= 0) {
          (async () => {
            try {
              const res = await axios.get('/api/bibliographie/series/')
              this.$store.dispatch('addBiblSeries', res.data)
              resolve(res.data)
            } catch (err) {
              this.hasSeriesFetchFailed = true
              reject(err)
            }
          })()
        } else {
          resolve(this.$store.state.biblSeries)
        }
      })
    },
    fetchOnceOeuvres: function (fetchedSeries) {
      (async () => {
        if (this.currentBiblSection) {
          // Find out if oeuvres of current section have already been fetched
          if (
            this.$store.state.biblOeuvres[this.currentBiblSection] && this.$store.state.biblOeuvres[this.currentBiblSection].length <= 0
          ) {
            try {
              // Call API
              let res = null
              switch (this.currentBiblSection) {
                case 'divers':
                  res = await axios.get('/api/bibliographie/oeuvres/?est_une_bd=false')
                  break
                case 'series': {
                  const currentSerie = this.selectedBiblSerie ? this.selectedBiblSerie : fetchedSeries ? fetchedSeries[0] : null
                  if (!currentSerie) {
                    this.hasOeuvresFetchFailed = true
                    return
                  }
                  res = await axios.get(`/api/bibliographie/oeuvres/?est_une_bd=true&categorie=series&serie=${encodeURIComponent(this.selectedBiblSerie.nom_fr)}`)
                  break
                }
                default:
                  res = await axios.get(`/api/bibliographie/oeuvres/?est_une_bd=true&categorie=${encodeURIComponent(this.currentBiblSection)}`)
                  break
              }
              
              // Add to store
              this.$store.dispatch('addOeuvres', { oeuvres: res.data, section: this.currentBiblSection })
              this.hasOeuvresFetchFailed = false

            } catch (err) {
              console.log({ err })
              this.hasOeuvresFetchFailed = true
            }
          }
        }
      })()
    },
    handleComicsDropdownMouseOut () {
      if (!this.isComicsDropdownClicked) this.isComicsDropdownOpen = false
    },
    closeup (oeuvre) {
      this.selectedOeuvre = oeuvre
      this.isModalOpen = true
    },
    closeupEnd () {
      this.selectedOeuvre = null
      this.isModalOpen = false
    }
  },
  created () {
    // Redirect to last visited || first category if no category is selected
    let path = this.$route.params.section

    if (!this.$route.params.section) {
        path = this.$store.state.biblSection || 'series'
        this.$router.replace(`/bibliographie/${path}`)
    }

    // Collapse dropdown
    if (path !== 'divers') {
      this.isComicsDropdownOpen = true
      this.isComicsDropdownClicked = true
    }

    // Set document title
    document.title = 'Thierry Cayman Art | ' + this.$t(`bibliography.sections.${path}`)

    // Fetch series
    this.fetchOnceSeries()
    .then(fetchedSeries => {
      // Fetch oeuvres
      this.fetchOnceOeuvres(fetchedSeries)
    })
  }
}
</script>

<style>
.dropdown {
  max-height: 0;
  transition: .3s all ease;
  overflow-y: hidden;
}
.dropdown.collapsed {
  max-height: 100%;
}
</style>

<style scoped>
.bibliography {
  display: grid;
  grid-template-columns: 4fr 18fr;
  grid-template-areas: "category-section oeuvres-container";
  grid-gap: .5rem 1rem;
}
.bibliography img {
  user-select: none;
}
.bibliography > section h2,
.bibliography > section h3,
.category-description h3 {
  margin: 0;
  font-weight: normal;
  text-transform: uppercase;
  font-size: 1.25em;
  background: var(--bg-light-broken);
  border: 1px solid var(--border-light-broken);
  border-radius: 3px;
  padding: 0 .25rem;
}
.category-section {
  grid-area: category-section;
}
.sticky {
  position: sticky; top: 1rem;
}
.section-list {
  display: flex;
  flex-direction: column;
  gap: 1rem .5rem;
  padding: 1rem 0;
  padding-bottom: 1.5rem;
  margin: 0;
  border-bottom: 1px solid var(--border-light-broken);
}
.section-list-item {
  list-style: none;
  animation: fade-in-left .3s ease-in-out both;
}
.section-list-item > a {
  display: inline-block;
  transition: .3s all ease;
  text-decoration: none;
  opacity: .875;
  word-break: break-word
}
.section-list-item > a {
  padding: 0 .25rem;
  margin-left: -.25rem;
  border-radius: 999px;
}
.section-list-item.selected > a,
.section-list-item > a:active,
.section-list-item > a:hover,
.section-list-item > a:focus {
  color: var(--link-active);
  transform: translate(.25rem);
  opacity: 1;
}

.comics-dropdown {
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: .3s all ease;
  overflow: hidden;
}
.comics-dropdown.collapsed {
  padding-top: .5rem;
  margin-top: .5rem;
  padding-bottom: .5rem;
  margin-bottom: -.5rem;
}
.comics-dropdown.clicked {
  background: var(--bg-light-broken);
  box-shadow: 0 0 0 .125rem var(--bg-light-broken);
}
.comics-dropdown.clicked a.router-link-active {
  background: var(--border-light-broken);
}
.dropdown-toggler {
  position: relative;
  cursor: pointer;
}
.chevron {
  position: absolute;
  left: calc(100% + .5rem); top: .4rem; height: .75rem;
  font-weight: bold;
  user-select: none;
  transition: .3s all ease;
}
.dropdown-toggler.active .chevron {
  transform: rotate(-90deg);
}

.section-description {
  padding-top: 1rem;
  animation: fade-in-left .3s ease-in-out both;
}

.oeuvres-container {
  grid-area: oeuvres-container;
  min-height: 66vh;
  border-radius: 2px;
  overflow: hidden;
}
.oeuvres-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 4rem 8rem;
  margin-top: 0;
  padding: 0;
}
.oeuvres-list .oeuvre {
  list-style: none;
  margin: 0 auto;
  border-radius: 1px;
  width: 100%;
  padding: 0;
  animation: fade-in-up .3s cubic-bezier(.54,.06,.58,1.4) both;
}
.oeuvre-title {
  text-transform: uppercase;
  padding: .5rem 0;
  padding-bottom: 1rem;
  text-align: center;
  margin: .5rem 1rem;
  border-bottom: 1px solid var(--border-light-broken);
  text-decoration-color: var(--text-dark);
}
.oeuvre p {
  margin: 0;
  padding: .5rem 1rem;
}
.oeuvre-footer {
  border-radius: 0 0 3px 3px;
  padding-bottom: .5rem;
}
.oeuvre-illustration {
  width: 100%;
  height: 19vw;
  object-fit: contain;
  cursor: pointer;
}
.oeuvre-date {
  text-align: right;
}

.series-list {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  padding: .5rem .25rem;
  background: var(--bg-light-broken);
  margin: 0;
  border-radius: 3px 3px 0 3px;
  border: 1px solid var(--border-light-broken);
}
.series-list > li {
  list-style: none;
}

.series-list > li > .link {
  cursor: pointer;
  color: var(--link);
  padding: 0 .5rem;
  border-radius: 999px;
  opacity: .75;
  transition: .3s all ease;
}
.series-list > li > .link:hover,
.series-list > li > .link:focus,
.series-list > li.selected > .link {
  opacity: 1;
  color: var(--link-active);
  outline: none;
}
.series-list > li.selected > .link {
  background: var(--border-light-broken);
}

.current-serie-name {
  margin-top: 0;
  padding-top: 1rem;
}
.serie-info {
  border-right: 1px solid var(--bg-light-broken);
  margin-bottom: .5rem;
  padding: .5rem 1rem;
}
.serie-publisher {
  font-family: 'Noto Sans'
}

.modal-window {
  position: fixed; top: 0; left: 0; bottom: 0; right: 0;
  background: #040404ee;
  color: #CCC;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.oeuvre-closeup {
  animation: fall .3s ease 1;
  max-height: calc(100% - 4rem);
  max-width: calc(100% - 2rem);
  width: 100%;
  border-radius: 2px;
  object-fit: contain;
}

/* Transitions */
.fade-leave-active {
  transition: all .3s ease;
  transition-delay: 0s !important;
}
.fade-leave-to {
  opacity: 0;
}

.fade-grow-leave-active,
.fade-grow-enter-active {
  transition: all .3s ease;
}
.fade-grow-leave-to,
.fade-grow-enter-from {
  opacity: 0;
  transform: scale(.5);
}

.fade-both-leave-active,
.fade-both-enter-active {
  transition: all .3s ease;
  transition-delay: 0s !important;
}
.fade-both-leave-to,
.fade-both-enter-from {
  opacity: 0;
}


@media screen and (max-width: 1100px) {
  .oeuvres-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 4rem;
  }
  .oeuvre-illustration {
    height: 32vw;
  }
}

@media screen and (max-width: 800px) {
  .sticky {
    position: unset;
  }
  .bibliography {
    grid-template-areas: 
      "category-section category-section category-section" 
      "oeuvres-container oeuvres-container oeuvres-container" 
    ;
  }

  .category-section {
    border-bottom: 1px solid var(--border-light-broken);
  }
  .section-list {
    float: left;
    border-bottom-color: transparent;
  }
  .section-section > h2,
  .section-list {
    width: calc(50% - .5rem);
  }
  .section-description {
    width: calc(50% - .5rem);
    margin-top: calc(-2.5rem - 1px);
    float: right;
  }
}

@media screen and (max-width: 500px) {
  .oeuvres-list {
    grid-template-columns: 1fr;
    gap: 2rem 1rem;
  }
  .oeuvre-illustration {
    height: 75vw;
  }
}


@keyframes reveal-down {
  from {
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
    opacity: 0;
  } to {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    opacity: 1;
  }
}
@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translate(.5rem);
  } to {
    opacity: 1;
    transform: translate(0);
  }
}
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(.5rem);
  } to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fall {
  from {
    transform: scale(1.25);
    opacity: 0;
  } to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>