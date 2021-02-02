import { createStore } from 'vuex'
import {
    SET_PORTFOLIO_CATEGORIES,
    SET_SELECTED_PORTFOLIO_CATEGORY,
    APPEND_ARTWORKS_TO_CATEGORY,
    SET_SELECTED_PORTFOLIO_ARTWORK,
    NAVIGATE_ARTWORK
} from './mutation-types'
import { intlifyArtwork } from '../i18n/intlify'

const store = createStore({
    state: {
        // Artworks
        portfolioCategories: [],
        selectedPortfolioCategory: null,
        selectedArtwork: null
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
        [NAVIGATE_ARTWORK] (state, { currentIndex, lastIndex, toNextArtwork }) {
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
                    state.selectedArtwork = intlifyArtwork(artworks[nextIndex])
                }
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
        navigateArtwork: (context, { currentIndex, lastIndex, toNextArtwork }) => {
            context.commit(NAVIGATE_ARTWORK, { currentIndex, lastIndex, toNextArtwork })
        }
    }
})

export default store