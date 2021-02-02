export const intlifyCategory = (category, locale) => {
    if (!category) return null

    // Default locale
    let nom = category.nom_en || category.nom_fr || category.nom_nl
    let description = category.description_en || category.description_fr || category.description_nl

    switch (locale) {
        case 'fr':
        case 'fr-BE':
        case 'fr-FR':
        case 'fr-CA':
        case 'fr-CH':
            nom = category.nom_fr || category.nom_en || category.nom_nl
            description = category.description_fr || category.description_en || category.description_nl
            break
        case 'nl':
        case 'nl-NL':
        case 'nl-BE':
            nom = category.nom_nl || category.nom_en || category.nom_fr
            description = category.description_nl || category.description_en || category.description_fr
            break
        default:
            break
    }

    // Return category with new properties nom and description
    return { ...category, nom, description }
}

export const intlifyArtwork = (artwork, locale) => {
    if (!artwork) return null

    // Default locale
    let titre = artwork.titre_en || artwork.titre_fr || artwork.titre_nl
    let legende = artwork.legende_en || artwork.legende_fr || artwork.legende_nl

    switch (locale) {
        case 'fr':
        case 'fr-BE':
        case 'fr-FR':
        case 'fr-CA':
        case 'fr-CH':
            titre = artwork.titre_fr || artwork.titre_en || artwork.titre_nl
            legende = artwork.legende_fr || artwork.legende_en || artwork.legende_nl
            break
        case 'nl':
        case 'nl-NL':
        case 'nl-BE':
            titre = artwork.titre_nl || artwork.titre_en || artwork.titre_fr
            legende = artwork.legende_nl || artwork.legende_en || artwork.legende_fr
            break
        default:
            break
    }

    // Return artwork with new properties titre and legende
    return { ...artwork, titre, legende }
}