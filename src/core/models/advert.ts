export type Location = { cityName: string; townName: string };
export type Category = { id: number; name: string };

export type AdvertProperty = {
    name: "km" | "color" | "year" | string;
    value: string;
};

export type ListingAdvert = {
    id: number;
    title: string;
    location: Location;
    category: Category;
    modelName: string;
    price: number;
    priceFormatted: string;
    date: string;
    dateFormatted: string;

    // Listing response'ta tek foto varsa:
    photo: string;

    properties: AdvertProperty[];
};

// Detail varsa ayrıca:
export type UserInfo = {
    id: number;
    nameSurname: string;
    phone: string;
    phoneFormatted: string;
};

export type AdvertDetail = Omit<ListingAdvert, "photo"> & {
    photos: string[];
    text: string;
    userInfo: UserInfo;
};
