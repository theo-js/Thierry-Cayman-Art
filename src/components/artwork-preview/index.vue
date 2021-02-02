<template>
  <figure
    :class="`
        artwork-preview 
        ${
            $store.state.selectedArtwork && 
            $store.state.selectedArtwork.titre_fr === artwork.titre_fr ? 
            'selected' : 'not-selected'
        }
    `"
    :tabindex="tabindex"
    :style="`animation-delay: ${tabindex/15}s`"
    @click="selectArtwork"
    @focus="selectArtwork"
  >
      <img
        v-if="artwork && tArtwork && artwork.image"
        class="image"
        loading="lazy"
        :alt="tArtwork.titre"
        :src="artwork.image"
        @contextmenu.prevent
       />
      <figcaption
        v-if="tArtwork && caption"
        class="caption"
      >
        {{ tArtwork.titre }}
      </figcaption>
  </figure>
</template>

<script>
import { intlifyArtwork } from '../../i18n/intlify'

export default {
    name: 'artwork-preview',
    props: {
        artwork: {
            type: Object
        },
        tabindex: {
            type: Number,
            default: 99
        },
        caption: {
            type: Boolean
        }
    },
    computed: {
        tArtwork () {
            return intlifyArtwork(this.artwork)
        }
    },
    methods: {
        selectArtwork () {
            this.$store.dispatch('selectArtwork', this.tArtwork)
        }
    }
}
</script>

<style scoped>
.artwork-preview {
    margin: 0;
    height: 100%;
    animation: fade-in .8s ease both;
}
.artwork-preview:focus {
    outline: none;
}
.image {
    transition: .3s all ease-in-out;
    cursor: pointer;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 3px;
    filter: saturate(0) drop-shadow(0 .125rem 2px #2473);
    opacity: .9;
}
.artwork-preview:focus .image,
.artwork-preview:hover .image {
    filter: saturate(1) drop-shadow(0 .125rem 2px #2473);
    opacity: 1;
}

.artwork-preview.selected {
    outline: 2px solid var(--link);
    outline-offset: 2px;
}


@keyframes fade-in {
    from {
        opacity: 0;
    } to {
        opacity: 1;
    }
}
</style>