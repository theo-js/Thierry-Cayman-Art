import { createStore } from 'vuex'
import {
    // Portfolio
    SET_PORTFOLIO_CATEGORIES,
    SET_SELECTED_PORTFOLIO_CATEGORY,
    APPEND_ARTWORKS_TO_CATEGORY,
    SET_SELECTED_PORTFOLIO_ARTWORK,
    NAVIGATE_ARTWORK,
    // Bibliography
    SET_BIBL_SECTION,
    ADD_OEUVRES,
    PUSH_OEUVRES,
    ADD_BIBL_SERIES,
    SET_SELECTED_SERIE,
    // Blog
    SET_BLOG_POSTS,
    // Links
    SET_LINKS
} from './mutation-types'
import { intlifyArtwork } from '../i18n/intlify'

const store = createStore({
    state: {
        // Artworks
        portfolioCategories: [],
        selectedPortfolioCategory: null,
        selectedArtwork: null,
        // Bibliography
        biblSection: '',
        biblOeuvres: {
            'series': [],
            'oneshot': [],
            'livres': [],
            'divers': []
        },
        biblSeries: [],
        selectedBiblSerie: null,
        // Blog
        blogPosts: {},
        // Links
        links: []
    },
    mutations: {
        // Artworks
        [SET_PORTFOLIO_CATEGORIES] (state, categories) {
            state.portfolioCategories = categories
        },
        [SET_SELECTED_PORTFOLIO_CATEGORY] (state, category) {
            state.selectedPortfolioCategory = category
        },
        [APPEND_ARTWORKS_TO_CATEGORY] (state, { artworks, categoryNameFr }) {
            // Make sure that category exists
            const targetCategory = state.portfolioCategories.find(cat => cat.nom_fr === categoryNameFr)
            if (targetCategory) {
                // Only update state if artworks have not been appended to category yet
                if (!targetCategory.artworks) {
                    const newCategories = state.portfolioCategories.map(cat => {
                        // Mutate only targeted category
                        if (cat.nom_fr === categoryNameFr) return { ...cat, artworks }
                        else return cat
                    })
                    state.portfolioCategories = Object.freeze(newCategories)
                }
            }
        },
        [SET_SELECTED_PORTFOLIO_ARTWORK]  (state, artwork) {
            state.selectedArtwork = artwork
        },
        [NAVIGATE_ARTWORK] (state, { currentIndex, lastIndex, toNextArtwork, locale }) {
            // Navigate to previous artwork in same category
            const { selectedArtwork, selectedPortfolioCategory } = state
            if (
                selectedPortfolioCategory &&
                selectedArtwork &&
                currentIndex !== null &&
                lastIndex !== null
            ) {
                const { artworks } = selectedPortfolioCategory
                if (artworks) {


                    // Increment or decrement index
                    let nextIndex = 0
                    if (toNextArtwork) {
                        // Increment
                        if (currentIndex < lastIndex) nextIndex = currentIndex + 1
                    } else {
                        // Decrement
                        if (currentIndex <= 0) nextIndex = lastIndex
                        else nextIndex = currentIndex - 1
                    }

                    // Replace state with new artwork
                    state.selectedArtwork = intlifyArtwork(artworks[nextIndex], locale)
                }
            }
        },
        // Bibliography
        [SET_BIBL_SECTION] (state, newSection) {
            state.biblSection = newSection
        },
        [ADD_OEUVRES] (state, { oeuvres, section }) {
            state['biblOeuvres'][section] = oeuvres
        },
        [PUSH_OEUVRES] (state, { oeuvres, section }) {
            state.['biblOeuvres'][section] = [
                ...state.['biblOeuvres'][section],
                ...oeuvres
            ]
        },
        [ADD_BIBL_SERIES] (state, series) {
            state.biblSeries = series
        },
        [SET_SELECTED_SERIE] (state, serieName) {
            state.selectedBiblSerie = serieName
        },
        // Blog
        [SET_BLOG_POSTS] (state, { posts, date }) {
            if (!state['blogPosts'][date]) {
                state['blogPosts'][date] = posts
            }
        },
        // Links
        [SET_LINKS] (state, links) {
            if (state.links.length <= 0) {
                state.links = links
            }
        }
    },
    actions: {
        // Artworks
        setPortfolioCategories: (context, categories) => {
            context.commit(SET_PORTFOLIO_CATEGORIES, categories)
        },
        selectPortfolioCategory: (context, category) => {
            context.commit(SET_SELECTED_PORTFOLIO_CATEGORY, category)
        },
        appendArtworksToCategory: (context, { artworks, categoryNameFr }) =>  {
            context.commit(APPEND_ARTWORKS_TO_CATEGORY, { artworks, categoryNameFr })
        },
        selectArtwork: (context, artwork) => {
            context.commit(SET_SELECTED_PORTFOLIO_ARTWORK, artwork)
        },
        navigateArtwork: (context, { currentIndex, lastIndex, toNextArtwork, locale }) => {
            context.commit(NAVIGATE_ARTWORK, { currentIndex, lastIndex, toNextArtwork, locale })
        },
        // Bibliography
        selectBiblSection: (context, newSection) => {
            context.commit(SET_BIBL_SECTION, newSection)
        },
        addOeuvres: (context, { oeuvres, section }) => {
            context.commit(ADD_OEUVRES, { oeuvres, section })
        },
        pushOeuvres: (context, { oeuvres, section }) => {
            context.commit(PUSH_OEUVRES, { oeuvres, section })
        },
        addBiblSeries: (context, series) => {
            context.commit(ADD_BIBL_SERIES, series)
        },
        selectBiblSerie: (context, serieName) => {
            context.commit(SET_SELECTED_SERIE, serieName)
        },
        // Blog
        setBlogPosts: (context, { posts, date }) => {
            context.commit(SET_BLOG_POSTS, { posts, date })
        },
        // Links
        setLinks (context, links) {
            context.commit(SET_LINKS, links)
        }
    }
})

export default store