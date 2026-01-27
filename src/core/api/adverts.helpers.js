export function resolvePhotoUrl(templateUrl, size = '240x180') {
    if (!templateUrl) return ''
    return templateUrl.replace('{0}', size)
}

export function getProp(properties, name) {
    const found = Array.isArray(properties) ? properties.find((p) => p?.name === name) : null
    return found?.value ?? ''
}

export function formatKm(value) {
    if (!value) return '-'
    const n = Number(value)
    if (Number.isNaN(n)) return String(value)
    return n.toLocaleString('tr-TR')
}
