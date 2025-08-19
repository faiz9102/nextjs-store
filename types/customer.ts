export interface User  {
    name: string,
    email: string,
    firstname: string,
    middlename : string | null,
    lastname: string,
    phone: string | null,
    default_billing : string | null,
    default_shipping : string | null,
    dob : string | null,
    gender : string | null,
    is_subscribed : boolean,
}