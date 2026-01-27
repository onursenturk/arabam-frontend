const BASE_URL = 'http://sandbox.arabamd.com/api/v1'

function normalizeParamValue(value) {
    if (value === undefined || value === null || value === '') return null

    // PrimeVue Calendar -> Date objesi gelebilir
    if (value instanceof Date) {
        const t = value.getTime()
        if (Number.isNaN(t)) return null
        return value.toISOString()
    }

    return String(value)
}

function buildQuery(params = {}) {
    const query = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            // örn: categoryId=[1,2] -> categoryId=1&categoryId=2
            value.forEach((v) => {
                const nv = normalizeParamValue(v)
                if (nv !== null) query.append(key, nv)
            })
            return
        }

        const nv = normalizeParamValue(value)
        if (nv !== null) query.set(key, nv)
    })

    return query.toString()
}

export async function httpGet(path, params = {}) {
    const query = buildQuery(params)
    const url = `${BASE_URL}${path}${query ? `?${query}` : ''}`

    try {
        const res = await fetch(url, {
            headers: {
                accept: 'text/plain',
            },
        })

        if (!res.ok) {
            // Response text bazen hata detayını içerir
            const errText = await res.text().catch(() => '')
            throw new Error(`HTTP ${res.status}${errText ? ` - ${errText}` : ''}`)
        }

        return await res.json()
    } catch (error) {
        console.error('[HTTP GET ERROR]', url, error)
        throw error
    }
}
