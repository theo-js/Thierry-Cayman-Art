export const light = {
    name: 'light',
    ['--text-dark']: '#6c6d6e',
    ['--titles-dark']: '#333335',
    ['--titles-purple']: '#7c7582',
    ['--bg-light']: '#FDFDFF',
    ['--bg-light-broken']: '#f7f7ff',
    ['--border-light-broken']: '#e4e4ef',
    ['--link']: 'rgba(23,118,121,0.69)',
    ['--link-active']: '#1d4575',
    ['--text-red']: '#9e2828',
    ['--bg-red']: '#fdf4f4'
}

export const dark = {
    name: 'dark',
    ['--text-dark']: '#adadad',
    ['--titles-dark']: '#d1d1d6',
    ['--titles-purple']: '#7c7582',
    ['--bg-light']: '#080808', // #06050a
    ['--bg-light-broken']: '#1b1a1d', // #19191f
    ['--border-light-broken']: '#2b2b2f',
    ['--link']: 'rgb(43 197 202 / 69%)',
    ['--link-active']: '#68bf32',
    ['--text-red']: '#9e2828',
    ['--bg-red']: '#232121'
}

const themes = [light, dark]


export const setTheme = themeName => {
    const theme = themes.find(th => th.name === themeName)
    if (!theme) return false

    const properties = Object.keys(theme)

    properties.forEach(property => {
        if (property !== 'name') {
            const value = theme[property]

            document.documentElement.style.setProperty(property, value)
        }
    })
    // Save
    localStorage['theme'] = JSON.stringify(theme)

    // Set meta theme color tag
    document.querySelector("meta[name=theme-color]").setAttribute('content',  theme['--bg-light'])
}

export const fetchTheme = () => {
    const themeString = localStorage.theme
    if (!themeString) return false

    try {
        const theme = JSON.parse(themeString)
        const properties = Object.keys(theme)
        
        properties.forEach(property => {
            if (property !== 'name') {
                const value = theme[property]
                document.documentElement.style.setProperty(property, value)
            }
        })

        // Meta theme color tag
        document.querySelector("meta[name=theme-color]").setAttribute('content',  theme['--bg-light'])
    } catch (err) {
        return
    }
}