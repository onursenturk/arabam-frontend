/**
 * @typedef {{ cityName: string, townName: string }} Location
 * @typedef {{ id: number, name: string }} Category
 * @typedef {{ name: 'km' | 'color' | 'year' | string, value: string }} AdvertProperty
 *
 * @typedef {{
 *  id: number,
 *  title: string,
 *  location: Location,
 *  category: Category,
 *  modelName: string,
 *  price: number,
 *  priceFormatted: string,
 *  date: string,
 *  dateFormatted: string,
 *  photo: string,
 *  properties: AdvertProperty[]
 * }} ListingAdvert
 */

export {}
