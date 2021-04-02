export const monthsFR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]
export const monthsEN = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
]
export const monthsNL = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'Decembre'
]
export const monthsRU = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]
export const monthsRUGenitive = [
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
]

export const formatDate = (dateString/*"2021-02-05"*/, locale) => {
    if (!dateString) return ''
    const formattedDateSTR = dateString.split('-').join(' ')
    const dateObject = new Date(formattedDateSTR)
    const year = dateObject.getFullYear()
    const month = dateObject.getMonth()

    switch (locale) {
        case 'fr':
        case 'fr-BE':
        case 'fr-FR':
        case 'fr-CA':
        case 'fr-CH': {
            const mois = monthsFR[month]
            return `${mois} ${year}`
        } case 'nl':
        case 'nl-NL':
        case 'nl-BE': {
            const maand = monthsNL[month]
            return `${maand} ${year}`
        } case 'ru': 
        case 'ru-RU':
        case 'ru-UA': {
            const mesyats = monthsRU[month].toLowerCase()
            return `${mesyats} ${year} г.`
        } default: {
            const monthUS = monthsEN[month]
            return `${monthUS} ${year}`
        }
    }
}

export const formatDateTime = (dateTimeString, locale) => {
    if (!dateTimeString) return ''
    const dateObject = new Date(dateTimeString)
    const year = dateObject.getFullYear()
    const month = dateObject.getMonth()
    const date = dateObject.getDate()

    switch (locale) {
        case 'fr':
        case 'fr-BE':
        case 'fr-FR':
        case 'fr-CA':
        case 'fr-CH': {
            const mois = monthsFR[month].toLowerCase()
            return `Le ${date} ${mois} ${year}`
        } case 'nl':
        case 'nl-NL':
        case 'nl-BE': {
            const maand = monthsNL[month].toLowerCase()
            return `De ${date} ${maand} ${year}`
        } case 'ru': 
        case 'ru-RU':
        case 'ru-UA': {
            const mesyats = monthsRUGenitive[month].toLowerCase()
            return `${date} ${mesyats} ${year} г.`
        } default: {
            // English
            // Handle date termination
            let termination = 'th'
            if (date == 1 || date == 21 || date == 31) termination = 'st'
            else if (date == 2 || date == 22) termination = 'nd'
            else if (date == 3 || date == 23) termination = 'rd'

            const monthUS = monthsEN[month]
            return `${date}${termination} ${monthUS} ${year}`
        }
    }
}

export const formatMonth = (monthNum, locale) => {
    switch (locale) {
        case 'fr':
        case 'fr-BE':
        case 'fr-FR':
        case 'fr-CA':
        case 'fr-CH':
            return monthsFR[monthNum]
        case 'nl':
        case 'nl-NL':
        case 'nl-BE':
            return monthsNL[monthNum]
        case 'ru':
        case 'ru-RU':
        case 'ru-UA':
            return monthsRU[monthNum]
        default:
            return monthsEN[monthNum]
    }
}

export const setLangAttribute = (locale) => {
    // Get lang attribute value
    let attr = 'en'
    switch (locale) {
        case 'fr':
        case 'fr-BE':
        case 'fr-FR':
        case 'fr-CA':
        case 'fr-CH':
            attr = 'fr'
            break
        case 'nl':
        case 'nl-NL':
        case 'nl-BE':
            attr = 'nl'
            break
        case 'ru':
        case 'ru-RU':
        case 'ru-UA':
            attr = 'ru'
            break
        default: break
    }
    
    // Set attribute
    document.querySelector('html').setAttribute('lang', attr)
}