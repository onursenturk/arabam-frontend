import { httpGet } from '@/core/api/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';

export function getListing(params) {
    return httpGet(ENDPOINTS.LISTING, params)
}

export function getDetail(id) {
    // API: /detail?id=...
    return httpGet(ENDPOINTS.DETAIL, { id })
}