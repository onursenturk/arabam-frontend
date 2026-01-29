import {AdvertDetail} from "../models/advert";


export function formatPhotoUrl(templateUrl: string, size = "800x600") {
    // @ts-ignore
    return templateUrl.includes("{0}")
        ? templateUrl.replace("{0}", size)
        : templateUrl;
}

export function uniq<T>(arr: T[]) {
    // @ts-ignore
    return Array.from(new Set(arr));
}

export function getProp(detail: AdvertDetail | null, key: string) {
    // @ts-ignore
    return detail?.properties?.find(p => p.name === key)?.value || "";
}
