<template>
  <div class="portfolio">
    <section class="category-section">
      <h2>Portfolio</h2>
      <ul class="category-list" v-if="tCategories.length > 0">
        <li
          v-for="(category, index) in tCategories"
          :key="category.nom_fr"
          :class="`
            category-list-item 
            ${currentCategory && category.nom_fr === currentCategory.nom_fr ? 'selected' : 'not-selected'}
          `"
          :style="`animation-delay: .${index}s`"
        >
          <router-link :to="`/portfolio/${category.nom_fr}`">
            {{ category.nom }}
          </router-link>
        </li>
      </ul>
      <div
        v-if="currentCategory"
        class="category-description"
        :style="`animation-delay: ${tCategories ? (tCategories.length + 1)/10 : 0}s`"
      >
        <h3>{{ currentCategory.nom }}</h3>
        <p style="padding: 0 .25rem; word-break: break-word">
          {{ currentCategory.description }}
        </p>
      </div>
    </section>
    <nav class="travaux-container">
      <template v-if="currentCategory && currentCategory.artworks">
        <artwork-preview
          v-for="(artwork, index) in currentCategory.artworks"
          :key="artwork.titre_fr"
          :tabindex="index"
          :artwork="artwork"
        ></artwork-preview>
      </template>
    </nav>
    <main class="dessin-focus">
      <transition name="fade">
          <img
            v-if="currentArtwork"
            class="current-artwork"
            :src="currentArtwork.image"
            :alt="currentArtwork.titre"
            loading="eager"
            :title="$t('artworks.maximize', { artworkTitle: currentArtwork.titre })"
            @contextmenu.prevent
            @click="isSlideShowOpen = true"
          />
      </transition>
      <transition name="fade">
        <p
          v-if="currentArtwork"
          class="artwork-title"
        >
          {{ currentArtwork.titre }}
        </p>
      </transition>
      <transition name="fade-both">
        <artwork-slideshow
          v-if="isSlideShowOpen"
          @close-slideshow="isSlideShowOpen = false"
          :artwork="currentArtwork"
          :currentIndex="currentArtworkIndex"
          :lastIndex="lastArtworkIndex"
        ></artwork-slideshow>
      </transition>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import { intlifyCategory, intlifyArtwork } from '../../i18n/intlify'
import ArtworkPreview from '../../components/artwork-preview'
import ArtworkSlideshow from '../../containers/artwork-slideshow'

export default {
  name: 'dessins',
  components: {
    'artwork-preview': ArtworkPreview,
    'artwork-slideshow': ArtworkSlideshow
  },
  data () {
    return {
      hasCategoryFetchFailed: false,
      hasArtworksFetchFailed: false,
      isSlideShowOpen: false
    }
  },
  watch: {
    currentCategory () {
      // Memorize current category (similarly to keep-alive component)
      if (this.currentCategory) {
        this.$store.dispatch('selectPortfolioCategory', this.currentCategory)
      }

      // Fetch artworks once
      (async () => {
        if (this.currentCategory) {
          if (
            this.$store.state.selectedPortfolioCategory &&
            !this.$store.state.selectedPortfolioCategory['artworks']
          ) {
            // Fetch if category in store does not have an artworks property yet
            try {
              const res = await axios.get(`/api/dessins?categorie_fr=${this.currentCategory.nom_fr}`)
              this.$store.dispatch(
                'appendArtworksToCategory',
                {
                  artworks: Object.freeze(res.data),
                  categoryNameFr: this.currentCategory.nom_fr
                }
              )
              this.hasArtworksFetchFailed = false

            } catch (err) {
              console.log({ err })
              this.hasArtworksFetchFailed = true
            }
          }
        }
      })()

      // Update document title depending on current section
      if (this.currentCategory) {
        document.title = `Thierry Cayman Art | ${this.currentCategory.nom}`
      }

      // Select first artwork on category change
      if (this.currentCategory && this.currentCategory.artworks) {
        this.$store.dispatch('selectArtwork', intlifyArtwork(this.currentCategory.artworks[0], this.$i18n.locale))
      }
    }
  },
  computed: {
    categories () {
      return this.$store.state.portfolioCategories
    },
    tCategories () {
      if (this.categories.length <= 0) return []
      return this.categories.map(category => intlifyCategory(category, this.$i18n.locale))
    },
    currentCategory () {
      if (this.tCategories.length <= 0) return null
      return this.tCategories.find(tcat => tcat.nom_fr === this.$route.params.category)
    },
    currentArtwork () {
      return this.$store.state.selectedArtwork
    },
    currentArtworkIndex () {
      // Validation
      if (!this.currentArtwork) return null
      if (!this.currentCategory) return null
      const { artworks } = this.currentCategory
      if (!artworks) return null

    // Find index of our current selected artwork
      let currentIndex = 0
      artworks.forEach((work, index) => {
          // Compare primary keys
          if (work.titre_fr === this.currentArtwork.titre_fr) currentIndex = index 
      })
      return currentIndex
    },
    lastArtworkIndex () {
      if (!this.currentCategory || !this.currentCategory.artworks) return null
      return this.currentCategory.artworks.length - 1
    }
  },
  methods: {
    fetchOnceCategories: function () {
      return new Promise((resolve, reject) => {
        if (this.$store.state.portfolioCategories <= 0) {
          (async () => {
            try {
              const res = await axios.get('/api/categories')
              this.$store.dispatch('setPortfolioCategories', Object.freeze(res.data))
              resolve(res.data)
            } catch (err) {
              this.hasCategoryFetchFailed = true
              reject(err)
            }
          })()
        } else {
          resolve(this.$store.state.portfolioCategories)
        }
      })
    },
    handleKeyUp (keyboardEvent) {
      const { keyCode } = keyboardEvent
      switch(keyCode) {
          case 32: // Space
          case 13: // Enter
              if (this.currentArtwork) this.isSlideShowOpen = true
              break
          default: return
      }
    }
  },
  created () {
    (async () => {
      try {
        // Fetch categories only once
        await this.fetchOnceCategories()
        
        // Redirect to last visited || first category if no category is selected
        if (!this.$route.params.category) {
            const currentCat = this.$store.state.selectedPortfolioCategory || this.categories[0]
            const path = currentCat ? currentCat.nom_fr : ''
            this.$router.replace(`/portfolio/${path}`)
        }
      } catch (err) {
        this.hasCategoryFetchFailed = true
      }
    })()
  },
  mounted () {
    window.addEventListener('keyup', this.handleKeyUp, true)
  },
  unmounted () {
    window.removeEventListener('keyup', this.handleKeyUp, true)
  }
}
</script>

<style scoped>
.portfolio {
  display: grid;
  grid-template-columns: 2fr 6fr 3fr;
  grid-template-areas: "category-section dessin-focus travaux-container";
  grid-gap: .5rem 1rem;
}
.portfolio img {
  user-select: none;
}
.portfolio > section > h2,
.portfolio > section > h3,
.category-description > h3 {
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
.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem .5rem;
  padding: 1rem 0;
  padding-bottom: 1.5rem;
  margin: 0;
  border-bottom: 1px solid var(--border-light-broken);
}
.category-list > .category-list-item {
  list-style: none;
  animation: fade-in-left .3s ease-in-out both;
}
.category-list > .category-list-item > a {
  display: inline-block;
  transition: .3s all ease;
  text-decoration: none;
  opacity: .875;
  word-break: break-word
}
.category-list > .category-list-item.selected > a,
.category-list > .category-list-item > a:active,
.category-list > .category-list-item > a:hover,
.category-list > .category-list-item > a:focus {
  color: var(--link-active);
  transform: translate(.25rem);
  opacity: 1;
}

.category-description {
  padding-top: 1rem;
  animation: fade-in-left .3s ease-in-out both;
}

.dessin-focus {
  grid-area: dessin-focus;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 66vh;
  animation: fade-in-blur .7s ease-out;
  border-radius: 2px;
  overflow: hidden;
}
.dessin-focus .current-artwork {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  border-radius: inherit;
  max-width: 100%;
  max-height: 66vh;
  cursor: pointer;
}

.travaux-container {
  grid-area: travaux-container;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: min-content;
  grid-gap: 1rem;
  background: var(--bg-light-broken);
  border: 1px solid var(--border-light-broken);
  border-radius: 2px;
  overflow: auto;
  padding: .5rem;
  max-height: 66vh;
  scroll-snap-stop: always;
  scroll-snap-points-y: repeat(8vw);
  scroll-snap-destination: 0 0;
  scroll-snap-type: y proximity;
}
.travaux-container::-webkit-scrollbar {
  border-radius: 0 2px 2px 0;
}
.travaux-container > * {
  height: 8vw;
}

.artwork-title {
  font-weight: 400;
  font-style: italic;
  text-align: right;
  margin: .5rem 2px;
  color: var(--titles-dark);
}


/* Transitions */
.fade-leave-active {
  transition: all .3s ease;
  transition-delay: 0s !important;
}
.fade-leave-to {
  opacity: 0;
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
  .travaux-container {
    grid-template-columns: 1fr;
  }
  .travaux-container > * {
    height: 20vw;
  }
}

@media screen and (max-width: 800px) {
  .portfolio {
    grid-template-areas: 
      "category-section category-section category-section" 
      "dessin-focus dessin-focus dessin-focus" 
      "travaux-container travaux-container travaux-container"
    ;
  }

  .category-section {
    border-bottom: 1px solid var(--border-light-broken);
  }
  .category-list {
    float: left;
    border-bottom-color: transparent;
  }
  .category-section > h2,
  .category-list {
    width: calc(50% - .5rem);
  }
  .category-description {
    width: calc(50% - .5rem);
    margin-top: calc(-2.5rem - 1px);
    float: right;
  }

  .dessin-focus {
    margin-bottom: 160px;
  }

  .travaux-container {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    display: flex;
    flex-flow: row nowrap;
    border-radius: 0;
    box-shadow: 0 -1px 3px 0 #2452;
  }
  .travaux-container > * {
    height: 150px;
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
@keyframes fade-in-blur {
  from {
    opacity: .75;
    filter: blur(2px)
  } to {
    opacity: 1;
    filter: none;
  }
}
</style>

<style>
.travaux-container figure {
    scroll-snap-align: start !important;
    scroll-margin: .5rem !important;
}
@media screen and (max-width: 800px) {
  .travaux-container {
    scroll-snap-points-x: repeat(150px) !important;
    scroll-snap-type: x proximity !important;
  }
  .travaux-container img {
    width: 150px !important;
  }
}
</style>