import { formatDate } from './format'

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

export const intlifySerie = (serie, locale) => {
    if (!serie) return null

    // Default locale
    let nom = serie.nom_en || serie.nom_fr || serie.nom_nl
    let a_propos = serie.a_propos_en || serie.a_propos_fr || serie.a_propos_nl

    switch (locale) {
        case 'fr':
        case 'fr-BE':
        case 'fr-FR':
        case 'fr-CA':
        case 'fr-CH':
            nom = serie.nom_fr || serie.nom_en || serie.nom_nl
            a_propos = serie.a_propos_fr || serie.a_propos_en || serie.a_propos_nl
            break
        case 'nl':
        case 'nl-NL':
        case 'nl-BE':
            nom = serie.nom_nl || serie.nom_en || serie.nom_fr
            a_propos = serie.a_propos_nl || serie.a_propos_en || serie.a_propos_fr
            break
        default:
            break
    }

    // Return artwork with new properties titre and legende
    return { ...serie, nom, a_propos }
}

export const intlifyOeuvre = (oeuvre, locale) => {
    if (!oeuvre) return null

    // Default locale
    let titre = oeuvre.titre_en || oeuvre.titre_fr || oeuvre.titrem_nl
    let a_propos = oeuvre.a_propos_en || oeuvre.a_propos_fr || oeuvre.a_propos_nl

    switch (locale) {
        case 'fr':
        case 'fr-BE':
        case 'fr-FR':
        case 'fr-CA':
        case 'fr-CH':
            titre = oeuvre.titre_fr || oeuvre.titre_en || oeuvre.titre_nl
            a_propos = oeuvre.a_propos_fr || oeuvre.a_propos_en || oeuvre.a_propos_nl
            break
        case 'nl':
        case 'nl-NL':
        case 'nl-BE':
            titre = oeuvre.titre_nl || oeuvre.titre_en || oeuvre.titre_fr
            a_propos = oeuvre.a_propos_nl || oeuvre.a_propos_en || oeuvre.a_propos_fr
            break
        default:
            break
    }
    // Format date
    const parutionFormatted = formatDate(oeuvre.parution, locale)

    // Return artwork with new properties titre, legende, and formatted date
    return { ...oeuvre, titre, a_propos, parutionFormatted }
}