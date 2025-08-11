export interface CategoryItem  {
    uid: string;
    name: string;
    url_key: string;
    level: number;
    path: string;
    children?: CategoryItem[];
};