<template>
  <div
    :class="`language-select ${isCollapsed ? 'collapsed' : ''}`"
    :tabindex="0"
    @focus="isCollapsed = true"
    @focusout="isCollapsed = false"
    ref="select"
  >
      <div class="option selected">
            <template v-if="selectedLanguage">
            </template>
          {{ selectedLanguage ? selectedLanguage.name : '~' }}
      </div>
      <ul v-if="isCollapsed" class="options-list">
          <li
            v-for="lang in languages"
            :key="lang.locale"
            class="option"
            @click="selectOption(lang)"
          >
              {{ lang.name }}
          </li>
      </ul>
  </div>
</template>

<script>
import { setLangAttribute } from '../../i18n/format'

export default {
    name: 'language-select',
    data () {
        return {
            isCollapsed: false
        }
    },
    computed: {
        locale () {
            return this.$i18n.locale
        },
        languages () {
            return [
                {
                    locale: 'fr',
                    name: 'Français',
                    country: 'fr'
                },
                {
                    locale: 'en',
                    name: 'English',
                    country: 'uk'
                },
                {
                    locale: 'nl',
                    name: 'Nederlands',
                    country: 'nl'
                },
                {
                    locale: 'ru',
                    name: 'Русский',
                    country: 'ru'
                }
            ]
        },
        selectedLanguage () {
            return this.languages.find(lang => this.locale.match(new RegExp(lang.locale, 'i')))
        }
    },
    methods : {
        selectOption: function (lang) {
            this.isCollapsed = false
            // Set new locale
            localStorage['locale'] = lang.locale
            this.$i18n.locale = lang.locale
            setLangAttribute(lang.locale)
            // Remove focus
            this.$refs.select.blur()
        }
    }
}
</script>

<style scoped>
.language-select {
    position: relative;
    background: var(--bg-light);
    border-radius: 3px;
    border: 1px solid var(--border-light-broken);
    user-select: none;
    transition: .3s background ease;
}
.language-select::after {
    content: '▷';
    position: absolute;
    left: .5rem; top: .5em;
    font-size: .75em;
    transform: rotate(90deg);
    pointer-events: none;
    transition: .3s all ease;
}
.language-select.collapsed::after {
    transform: rotate(180deg);
}
.language-select:focus {
    outline-color: var(--border-light-broken);
}
.options-list {
    position: absolute;
    top: 100%; left: 0; width: 100%;
    padding: 0;
    animation: drop-down .5s ease;
    background: var(--bg-light);
    border-radius: 0 0 3px 3px;
    box-shadow: 0 .25rem .5rem 0 #1112;
    z-index: 9;
}
.option {
    padding: .25rem .5rem;
    list-style: none;
    white-space: wrap;
    word-break: break-word;
    min-width: 125px;

}
.options-list .option:hover {
    background: var(--link);
    color: var(--bg-light);
}
.option.selected {
    cursor: pointer;
}
</style>