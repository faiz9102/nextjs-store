export interface CategoryItem  {
    id: number;
    uid: string;
    name: string;
    url_key: string;
    level: number;
    path: string;
    description?: string;
    image?: string;
    children?: CategoryItem[];
};