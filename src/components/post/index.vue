<template>
  <article
    class="post"
    :style="{animationDelay: index/5 + 's'}"
  >
      <header class="post-header">
          <h2 class="post-title">
              {{ post.titre }}
          </h2>
          <p class="created-date">
              {{ post.created_date_formatted }}
          </p>
          <button @click="isCollapsed = !isCollapsed" :class="`toggle-collapse ${isCollapsed ? 'active' : 'not-active'}`">
              <font-awesome-icon icon="chevron-down" class="chevron"></font-awesome-icon>
          </button>
      </header>
      <main
        :class="`post-content ${isCollapsed ? 'collapsed' : 'not-collapsed'}`"
        :style="{ gridTemplateColumns: hasImage ? '2fr 1fr' : '1fr' }"
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
            isCollapsed: false
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
        }
    }
}
</script>

<style scoped>
.post {
    animation: fade-in-up .8s both cubic-bezier(.13,.56,.52,.99);
}
.post p {
    font-size: 1.25em;
    word-break: break-word;
}

.post-header {
    position: relative;
}
.post-title {
    padding: .25rem 0;
    padding-right: 2rem;
    color: var(--titles-purple);
    margin-bottom: 0;
    word-break: break-word;
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
    top: .5rem; right: 0;
    border-radius: 50%;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    transition: .3s all ease;
    height: 2rem; width: 2rem;
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
.toggle-collapse:hover .chevron,
.toggle-collapse:focus .chevron {
    color: var(--text-dark);
}
.toggle-collapse.active {
    transform: rotate(90deg);
}

.post-content {
    display: grid;
    grid-gap: 1rem;
    font-size: 1.125em;
    overflow: hidden;
    height: 100%;
    transition: .3s all ease;
}
.post-content .text {
    line-height: 2em;
    text-indent: 1em;
}
.post-content .text strong,
.post-content .text em {
    color: var(--titles-purple);
}

.post-content .images {
    margin: 0 auto;
}
.post-content.collapsed {
    height: 0;
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
    margin-bottom: 2rem;
}


@media screen and (max-width: 800px) {
    .post-content {
        grid-template-columns: 1fr !important;
    }
    .post-image:first-child {
        margin-top: 1rem;
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