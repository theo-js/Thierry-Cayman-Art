<template>
  <div
    class="modal-window"
    @click="$emit('close-slideshow')"
    @keypress.left.prevent="$store.dispatch('navigateArtwork', { currentIndex, lastIndex, toNextArtwork: false, locale: this.$i18n.locale })"
    @keypress.right="$store.dispatch('navigateArtwork', { currentIndex, lastIndex, toNextArtwork: true, locale: this.$i18n.locale })"
  >
    <button class="close-btn" @click="$emit('close-slideshow')">
        ×
    </button>
    <nav class="slideshow-navigation">
        <button
            class="slide-left"
            @click.stop="moveLeft"
        >‹</button>
    </nav>
    <figure
        v-if="artwork"
        class="artwork"
    >
        <img
            :class="`
                artwork-image 
                ${move === 'left' ? 'left' : 'right'}
            `"
            v-if="artwork.image && artwork.titre"
            :src="artwork.image"
            :alt="artwork.titre"
            :key="artwork.titre_fr"
            loading="eager"
            @contextmenu.prevent
            @click.stop
        />
        <figcaption
            v-if="artwork.titre || artwork.legende"
            :key="artwork.titre_fr"
            :class="`
                artwork-about 
                ${move === 'left' ? 'left' : 'right'}
            `"
        >
            <h3
                v-if="artwork.titre"
                class="artwork-title"
                @click.stop
            >{{ artwork.titre }}</h3>
            <span
                v-if="artwork.legende"
                class="artwork-legend"
                @click.stop
            >{{ artwork.legende }}</span>
        </figcaption>
    </figure>
    <nav class="slideshow-navigation">
        <button
            class="slide-right"
            @click.stop="moveRight"
        >›</button>
    </nav>
  </div>
</template>

<script>
export default {
    name: 'artwork-slideshow',
    data () {
        return {
            move: 'right'
        }
    },
    props: {
        artwork: {
            type: Object
        },
        currentIndex: {
            type: Number
        },
        lastIndex: {
            type: Number
        }
    },
    methods: {
        moveRight () {
            this.move = 'right'
            this.$store.dispatch(
                'navigateArtwork',
                {
                    currentIndex: this.currentIndex,
                    lastIndex: this.lastIndex,
                    toNextArtwork: true,
                    locale: this.$i18n.locale
                }
            )
        },
        moveLeft () {
            this.move = 'left'
            this.$store.dispatch(
                'navigateArtwork',
                {
                    currentIndex: this.currentIndex,
                    lastIndex: this.lastIndex,
                    toNextArtwork: false,
                    locale: this.$i18n.locale
                }
            )
        },
        handleKeyUp (keyboardEvent) {
            const { keyCode } = keyboardEvent
            switch(keyCode) {
                case 37: // Left
                    this.moveLeft()
                    break
                case 39: // Right
                case 32: // Space
                case 13: // Enter
                case 9: // Tab
                    this.moveRight()
                    break
                case 27: // Escape
                case 8: // Backspace
                    this.$emit('close-slideshow')
                    break
                default: return
            }
        }
    },
    created () {
        window.addEventListener('keyup', this.handleKeyUp, true)
    },
    unmounted () {
        window.removeEventListener('keyup', this.handleKeyUp, true)
    }
}
</script>

<style scoped>
.modal-window {
    position: fixed;
    left: 0; top: 0; bottom: 0; right: 0;
    background: #040404ee;
    color: #CCC;
    z-index: 2;
    cursor: default;
    display: grid;
    grid-template-columns: 7% 1fr 7%;
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0 .5rem;
    font-weight: initial !important;
}

.slideshow-navigation {
    display: flex;
    justify-content: center;
    align-items: center;
}
.slideshow-navigation > button,
.close-btn {
    background: transparent;
    border: none;
    font-size: 2rem;
    font-weight: 700;
    color: var(--title-dark);
    opacity: .75;
    transition: .3s all ease;
    cursor: pointer;
    filter: drop-shadow(0 0 3px #FFF4);
}
.slideshow-navigation > button:focus,
.slideshow-navigation > button:hover,
.close-btn:focus,
.close-btn:hover {
    outline: none;
    opacity: 1;
    font-size: 3rem;
}

.artwork {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0 auto;
}
.artwork-image {
    width: 66.6%;
    order: 2;
    border-radius: 1px;
    max-height: calc(100vh - 3rem);
    object-fit: contain;
    animation-delay: .3s;
}
.artwork-about {
    width: 33.3%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    animation-delay: .6s;
}
.artwork-about * {
    word-break: break-word;
}
.artwork-title {
    color: #FFF;
    filter: drop-shadow(0 0 4px #444);
}
.artwork-legend {
    font-style: italic;
}

/* Move to the right */
.artwork-image.right {
    animation: reveal-left .3s ease both;
}
.artwork-about.right {
    animation: reveal-right .3s ease both;
}
/* Move to the left */
.artwork-image.left {
    animation: reveal-right .3s ease both;
}
.artwork-about.left {
    animation: reveal-left .3s ease both;
}


@media screen and (max-width: 800px) {
    .modal-window {
        grid-template-columns: 7% 1fr 7%;
    }

    .artwork {
        justify-content: center;
        flex-direction: column;
    }
    .artwork-image {
        width: 100%;
        max-height: 75vh;
        order: 0;
    }
    .artwork-about {
        width: 100%;
    }
}


@keyframes fade-in {
    from {
        opacity: 0;
    } to {
        opacity: 1;
    }
}
@keyframes reveal-left {
    from {
        transform: translate(50%);
        opacity: 0;
    } to {
        transform: translate(0);
        opacity: 1;
    }
}
@keyframes reveal-right {
    from {
        transform: translate(-50%);
        opacity: 0;
    } to {
        transform: translate(0);
        opacity: 1;
    }
}
</style>