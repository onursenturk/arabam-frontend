export const advertsKeys = {
    all: ["adverts"],
    listing: (params) => ["adverts", "listing", params],
    detail: (id) => ["adverts", "detail", String(id)],
};