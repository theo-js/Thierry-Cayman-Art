export const monthsFR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]
export const monthsEN = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
]
export const monthsNL = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'Decembre'
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
            const monthUS = monthsEN[month]
            let termination = 'th'
            if (date === 1 || date === 21 || date === 31) termination = 'st'
            else if (date === 2) termination = 'nd'
            else if (date === 3) termination = 'rd'
            return `${monthUS} ${date}${termination}, ${year}`
        }
    }
}