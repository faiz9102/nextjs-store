const PRODUCTION_ENV = "production";

const config = {
    cart: {
        config : {
            cookie : {
                guest: {
                    name: process.env.NODE_ENV === PRODUCTION_ENV ? "__Host-cart" : "cart",
                    maxAge: 2592000,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === PRODUCTION_ENV,
                    path: "/",
                    sameSite: 'strict' as const
                },
                customer: {
                    name: process.env.NODE_ENV === PRODUCTION_ENV ? "__Host-customer-cart" : "customer-cart",
                    maxAge: 2592000,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === PRODUCTION_ENV,
                    path: "/",
                    sameSite: 'strict' as const
                }
            }
        }
    },
    PRODUCTION_ENV : PRODUCTION_ENV
};
export default config;