<template>
<div class="blog">
    <section class="date-filter">
        <ul class="dates-list" v-if="selectedDate">
            <li
                v-for="(date, index) in dates"
                :key="date.month + '-' + date.year"
                :style="{animationDelay: `${index/15}s`}"
                :class="`
                    dates-list-item 
                    ${date.month == selectedDate.month && date.year == selectedDate.year ? 'selected': 'not-selected'}
                `"
            >
                <h4 class="year" v-if="index === 0 || (dates[index - 1] && date.year != dates[index - 1].year)">
                    {{ date.year }}
                </h4>
                <router-link :to="`/actualites/${date.month}-${date.year}`">
                    {{ date.monthName }}
                </router-link>
            </li>
        </ul>
    </section>
    <main class="current-posts">
        <template v-if="tCurrentPosts === null">
            <p class="msg loading">
                {{ $t('blog.loadingPosts') }}&nbsp;
                <font-awesome-icon icon="cog" class="cog"></font-awesome-icon>
            </p>
        </template>
        <template v-else-if="tCurrentPosts === false">
            <p class="msg no-posts">
                {{ $t('blog.noPosts') }}
            </p>
        </template>
        <template v-else>
            <Post
                v-for="(post, index) in tCurrentPosts"
                :key="post.titre_fr"
                :post="post"
                :index="index"
             />
        </template>
    </main>
</div>
</template>

<script>
import Post from '../../components/post'
import { intlifyPost } from '../../i18n/intlify'
import { formatMonth } from '../../i18n/format'
import { monthsEN, monthsFR, monthsNL, monthsRU } from '../../i18n/format'
import axios from 'axios'
import FontAwesome from '../../lib/FontAwesome.vue'

export default {
    name: 'Blog',
    components: {
        Post,
        'font-awesome-icon': FontAwesome
    },
    computed: {
        monthsSinceCreation () {
            const now = new Date()
            const from = new Date(1612726500000) // feb2021
            const months = now.getMonth() - from.getMonth() + (12 * (now.getFullYear() - from.getFullYear()))
            return months
        },
        dates () {
            let tMonths = monthsEN
            // Translate months
            switch (this.$i18n.locale) {
                case 'fr':
                case 'fr-BE':
                case 'fr-FR':
                case 'fr-CA':
                case 'fr-CH':
                    tMonths = monthsFR
                    break
                case 'nl':
                case 'nl-NL':
                case 'nl-BE':
                    tMonths = monthsNL
                    break
                case 'ru': 
                case 'ru-RU':
                case 'ru-UA':
                    tMonths = monthsRU
                    break
                default:
                    break
            }
            // Get all dates
            const now = new Date()
            let currentYear = now.getFullYear()
            let currentMonth = now.getMonth()
            let allDates = []
            for (let i = this.monthsSinceCreation; i >= 0; i--) {
                if (currentMonth < 0) {
                    // New year
                    currentYear--
                    currentMonth = 11
                }
                allDates.push({
                    month: currentMonth,
                    monthName: tMonths[currentMonth],
                    year: currentYear
                })

                currentMonth--
            }
            return allDates
        },
        selectedDate () {
            if (
                this.$route.params.date && 
                this.$route.params.date.match(/^[0-9]{1,2}-[0-9]{4}$/i)
            ) {
                // Parse params
                const [month, year] = this.$route.params.date.split('-')
                return { month, year }
            } else return null
        },
        currentPosts () {
            if (!this.selectedDate) return null

            const matchingPosts = this.$store.state.blogPosts[`${this.selectedDate.month}-${this.selectedDate.year}`]

            // No posts or could not fetch
            if (matchingPosts === false) return false
            if (!matchingPosts) return null
            
            return matchingPosts
        },
        tCurrentPosts () {
            if (!this.currentPosts) return this.currentPosts

            // Translate
            const translated = this.currentPosts.map(post => intlifyPost(post, this.$i18n.locale))
            // Sort by creation date
            const sorted = translated.sort((postA, postB) => {
                const timestampA = new Date(postA.created_date).getTime()
                const timestampB = new Date(postB.created_date).getTime()
                if (timestampA > timestampB) return -1
                else if (timestampA < timestampB) return 1
                else return 0
            })
            return sorted
        }
    },
    methods: {
        // Fetch posts relative to this date and store them
        async fetchOncePosts (date) {
            if (
                date && 
                typeof this.$store.state.blogPosts[`${date.month}-${date.year}`] === 'undefined'
            ) {
                const { month, year } = date
                // Rename document
                document.title = `Thierry Cayman Art | Blog ${formatMonth(month, this.$i18n.locale)} ${year}`

                try {
                    // Fetch
                    const res = await axios.get(`/api/articles/?month=${parseInt(month) + 1}&year=${year}`)
                    // Store posts
                    if (res && res.data && res.data.length && res.data.length > 0) {
                        this.$store.dispatch('setBlogPosts', {
                            date: `${month}-${year}`,
                            posts: res.data
                        })
                    } else throw new Error('No posts for this date')
                } catch (err) {
                    console.log({ err })
                    this.$store.dispatch('setBlogPosts', {
                        date: `${month}-${year}`,
                        posts: false
                    })
                }
            }
        }
    },
    watch: {
        selectedDate () {
            this.fetchOncePosts(this.selectedDate)
        }
    },
    created () {
        if (
            !this.$route.params.date || 
            !this.$route.params.date.match(/^[0-9]-[0-9]{4}$/i)
        ) {
            // Redirect to current month
            const now = new Date()
            const month = now.getMonth()
            const year = now.getFullYear()
            this.$router.replace(`/actualites/${month}-${year}`)

            // Fetch posts
            this.fetchOncePosts({ month, year })
            // Rename document
            document.title = `Thierry Cayman Art | Blog ${formatMonth(month, this.$i18n.locale)} ${year}`
        } else {
            // Fetch posts from route params
            const [month, year] = this.$route.params.date.split('-')
            this.fetchOncePosts({ month, year })
            // Rename document
            document.title = `Thierry Cayman Art | Blog ${formatMonth(month, this.$i18n.locale)} ${year}`
        }
    }
}
</script>

<style scoped>
.blog {
  display: grid;
  grid-template-columns: 4fr 18fr;
  grid-template-areas: "dates oeuvres-container";
  grid-gap: .5rem 0;
  padding: 0;
}

.date-filter {
    grid-area: dates;
    position: relative;
}
.dates-list {
    position: sticky; top: 0;
    overflow: auto;
    max-height: 100vh; height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    gap: calc(1rem - 2px) 1rem;
    padding: 0 1rem; padding-bottom: 1rem;
    background-color: var(--bg-light-broken);
    margin-top: -1px;
    transition: background-color .3s ease;
    animation: fade-bg 2s ease;
}
.dates-list-item {
    list-style: none;
    border-bottom: 1px solid transparent;
    animation: fade-right .2s ease-out backwards;
}
.dates-list-item:hover {
    border-color: var(--border-light-broken);
}
.dates-list-item.selected:hover {
    border-color: transparent;
}
.dates-list-item .year {
    padding: .25rem 0;
    border-bottom: 1px solid var(--border-light-broken);
}
.dates-list-item a {
    display: block;
    text-decoration: none;
    border-radius: 999px;
    padding: 0 .333rem;
    transition: .3s all ease;
}
.dates-list-item a:hover,
.dates-list-item a:focus,
.dates-list-item a:active,
.dates-list-item.selected a {
    outline: none;
    transform: translate(.25rem);
    color: var(--link-active);
    max-width: calc(100% - .25rem);
}
.dates-list-item.selected a {
    background: var(--border-light-broken);
}

.current-posts {
    word-break: break-word;
}

.post {
    margin-top: -11px;
}

.msg {
    margin: .5rem;
    padding: .5rem 1rem;
    border-radius: 0 3px 3px 0;
}
.msg.loading {
    background: var(--bg-light-broken);
    border-left: 3px solid var(--link-active);
    font-size: 1.125rem !important;
}
.msg.no-posts {
    background: var(--bg-red);
    border-left: 3px solid var(--text-red);
    font-size: 1.125rem !important;
}
.cog {
    width: 1em;
    animation: spin 1s linear infinite;
    color: var(--link);
    vertical-align: middle;
}


@media screen and (max-width: 549px) {
    .dates-list {
        margin-top: -3px;
    }
}


@keyframes spin {
    from {
        transform: rotate(0);
    } to {
        transform: rotate(359deg);
    }
}
@keyframes fade-right {
    from { 
        opacity: 0;
        margin-left: .5rem;
    } to { 
        opacity: 1;
        margin-left: 0;
    }
}
@keyframes fade-bg {
    from {
        background-color: var(--bg-light);
    } to {
        background-color: var(--bg-light-broken);
    }
}
</style>