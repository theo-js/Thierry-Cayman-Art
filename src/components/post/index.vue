<template>
  <article
    :class="`post ${isCollapsed ? 'collapsed' : 'not-collapsed'}`"
    :style="{animationDelay: index/5 + 's'}"
  >
      <header class="post-header">
          <h2 
            class="post-title" 
            v-if="post.titre"
          >
              <a 
                @click.prevent="isCollapsed = !isCollapsed"
                @keyup.enter="isCollapsed = !isCollapsed"
                :title="togglerCollapseTitle"
                tabindex="0"
              >
                  {{ post.titre }}
              </a>
          </h2>
          <p class="created-date" v-if="post.created_date_formatted">
              {{ post.created_date_formatted }}
          </p>
          <button
            @click="isCollapsed = !isCollapsed" 
            :class="`toggle-collapse ${isCollapsed ? 'active' : 'not-active'}`"
            :title="togglerCollapseTitle"
          >
              <font-awesome-icon icon="chevron-down" class="chevron"></font-awesome-icon>
          </button>
      </header>
      <main 
        class="post-content"
        :style="{ 
            gridTemplateColumns: hasImage ? '2fr 1fr' : '1fr',
            maxHeight: postContentMaxHeight
        }"
        ref="postBody"
      >
        <section class="text" v-if="post">
            <vue3-markdown-it :source="post.contenu"></vue3-markdown-it>
        </section>
        <section class="images" v-if="hasImage">
            <figure
                class="post-image"
                v-if="post.image1"
            >
                <img
                    :alt="`${post.titre}-01`"
                    :src="post.image1"
                    loading="lazy"
                    @contextmenu.prevent
                 />
            </figure>
            <figure
                class="post-image"
                v-if="post.image2"
            >
                <img
                    :alt="`${post.titre}-02`"
                    :src="post.image2"
                    loading="lazy"
                    @contextmenu.prevent
                 />
            </figure>
            <figure
                class="post-image"
                v-if="post.image3"
            >
                <img
                    :alt="`${post.titre}-03`"
                    :src="post.image3"
                    loading="lazy"
                    @contextmenu.prevent
                 />
            </figure>
            <figure
                class="post-image"
                v-if="post.image4"
            >
                <img
                    :alt="`${post.titre}-04`"
                    :src="post.image4"
                    loading="lazy"
                    @contextmenu.prevent
                 />
            </figure>
            <figure
                class="post-image"
                v-if="post.image5"
            >
                <img
                    :alt="`${post.titre}-05`"
                    :src="post.image5"
                    loading="lazy"
                    @contextmenu.prevent
                 />
            </figure>
        </section>
      </main>
      <footer class="post-footer"></footer>
  </article>
</template>

<script>
import VueMarkdownIt from 'vue3-markdown-it'

export default {
    name: 'post',
    data () {
        return {
            isCollapsed: true
        }
    },
    components: {
        'vue3-markdown-it': VueMarkdownIt
    },
    props: {
        post: {
            type: Object
        },
        index: {
            type: Number
        }
    },
    computed: {
        hasImage () {
            return this.post.image1 || this.post.image2 || this.post.image3 || this.post.image4 || this.post.image5
        },
        togglerCollapseTitle () {
            return this.$t(this.isCollapsed ? 'blog.post.read' : 'blog.post.close')
        },
        postContentMaxHeight () {
            if (this.isCollapsed) return '5rem'
            // Opened post state
            return `calc(${this.$refs.postBody.scrollHeight*1.5}px - 1em)` // Scroll height increases of 50% due to line-height transition
        }
    }
}
</script>

<style scoped>
.post {
    animation: fade-in-up .8s both cubic-bezier(.13,.56,.52,.99);
    position: relative;
}
.post > * {
    padding-left: 1rem; padding-right: 1rem;
    box-sizing: content-box;
}
.post p {
    font-size: 1.25em;
    word-break: break-word;
}

.post-header {
    margin-top: .5rem;
    overflow: hidden;
    z-index: 1;
    padding-top: 2rem;
    border-bottom: 1px dashed transparent;
    transition: 
        .3s background-color ease,
        .3s border ease,
        .3s padding ease
    ;
}
.post-title {
    padding: .25rem 0;
    padding-right: 2rem;
    color: var(--titles-purple);
    margin: 0;
    height: auto;
    font-size: 38vw;
    display: flex; align-items: center;
    transition: .3s all ease;
}
.post-title > a {
    position: relative;
    display: inline-block; width: fit-content;
    font-size: 1.5rem;
    color: inherit;
    word-break: break-word;
    text-align: center;
    overflow: visible;
    transition: 
        .3s transform ease,
        .3s font-size ease,
        .2s opacity ease
    ;
}
.post-title > a::after { /* Underline */
    content: '';
    opacity: .5;
    background: linear-gradient(to right, var(--titles-purple), var(--link-active));
    border-radius: 99px;
    position: absolute;
    top: calc(100% + 1px);
    left: 0;
    height: 3px; width: 100%;
    transform: scaleX(0);
    transform-origin: right;
    transition: .3s transform ease-out;
}
.post-title > a:hover,
.post-title > a:focus {
    outline: none; cursor: pointer;
}
.post-title > a:hover { opacity: .5; }
.post-title > a:hover::after,
.post-title > a:focus::after {
    transform: scaleX(1);
    transform-origin: left;
    transition: .1s transform ease-in;
}

.created-date {
    font-size: .875em !important;
    font-family: 'Nanum Gothic', sans-serif;
    letter-spacing: initial;
    color: var(--titles-purple);
    margin-left: 1.5rem;
    margin-top: .25rem;
    opacity: .75;
}
.toggle-collapse {
    position: absolute;
    top: 2.25rem; right: .5rem;
    border-radius: 50%;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    transition: .3s all ease;
    height: 2rem; width: 2rem;
    box-sizing: border-box;
    display: flex; justify-content: center; align-items: center;
}
.chevron {
    height: 1em;
    color: var(--titles-purple);
}
.toggle-collapse:hover,
.toggle-collapse:focus {
    outline: none;
    background: var(--bg-light-broken);
    border-color: var(--border-light-broken);
}
.post.not-collapsed .toggle-collapse:hover,
.post.not-collapsed .toggle-collapse:focus { background: var(--bg-light); }
.toggle-collapse:hover .chevron,
.toggle-collapse:focus .chevron {
    color: var(--text-dark);
}

.post-content {
    display: grid;
    grid-gap: 1rem;
    font-size: 1.125em;
    overflow: hidden;
    transition: .3s all ease;
    /* Gradient blur lower text */
    -webkit-mask-image: linear-gradient(to bottom, #000, #000 1rem, #0000);
    mask-image: linear-gradient(to bottom, #000, #000 1rem, #0000);
}
.post-content .text {
    line-height: 2em;
    text-indent: 1em;
    transition: .3s line-height ease;
}
.post-content .text strong,
.post-content .text em {
    color: var(--titles-purple);
}
.post-content .text > div {
    margin-top: -1rem;
}

.post-content .images {
    margin: 0 auto;
}

.post-image {
    margin: 1rem 0;
}
.post-image > img {
    max-width: 100%;
    border-radius: 2px;
}
.post-image:first-child {
    margin-top: 0;
}

.post-footer {
    border-bottom: 1px solid var(--border-light-broken);
    padding-bottom: 1rem;
}

/* Collapsed post state */
.post.collapsed .post-content .text {
    line-height: 1.5rem
}

/* Opened post state */
.post.not-collapsed .post-header {
    /* Sticky header */
    position: sticky;
    top: 0;
    background-color: var(--bg-light-broken);
    border-bottom-color: var(--border-light-broken);
}
.post.not-collapsed .post-content {
    /* Blur inner margins */
    -webkit-mask-image: linear-gradient(to bottom, #0000, #000 1rem, #000 calc(100% - 1.5rem), #0000) !important;
    mask-image: linear-gradient(to bottom, #0000, #000 1rem, #000 calc(100% - 1.5rem), #0000) !important;
}

.toggle-collapse.active {
    transform: rotate(90deg);
}


@media screen and (min-width: 550px) {
    /* Opened post state */
    .post.not-collapsed .post-title {
        margin-left: 1em; /* center horizontally */
        width: 75%;
    }
    .post.not-collapsed .post-title > a {
        transform: translate(-50%); /* center horizontally */
        font-size: 1.25rem;
    }
}

@media screen and (max-width: 800px) {
    .post-content {
        grid-template-columns: 1fr !important;
    }
    .post-image:first-child {
        margin-top: 1rem;
    }
}

@media screen and (max-width: 549px) {
    .post .post-title > a {
        text-align: left !important;
    }
    .post-content .text {
        line-height: 1.75rem;
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