# Project: Nextjs Store (open source)
https://github.com/faiz9102/nextjs-store

This project is an open source implementation of a eCommerce store using Next.js, TypeScript, and Tailwind CSS.
It is the client facing part of the Three tier app in which magento 2.4.8 (current latest) is used as the backend.  
Next.js is used as BFF Backend for frontend. the client never queries or knows about the magento backend.

all the communication is done through the Next.js BFF which in turn communicates with the Magento backend via graphql api.

# Copilot Instructions
- Use TypeScript for all code.
- Use Tailwind CSS for styling.
- Use Next.js for the framework.
- Use GraphQL for data fetching.
- Follow best practices for Next.js and TypeScript.
- Use functional components and hooks.
- Utilize as much server side rendering (SSR) as possible.
- Optimize for performance and SEO.
- Using App router for the project
- Use shadcn components for UI components.
- Keep the code clean and well-organized.
- use styling according to the theme of the project. ("clean","minimalistic","modern","elegant","light","professional")
- all the graphql queries and mutations are in the `graphql` folder.
- Use the `lib` folder for utility functions and helpers.
- Use the `components` folder for reusable components.
- Use the `components` folder inside the /app folder for page specific components.
- Use the `hooks` folder for custom hooks.
- Use the `context` folder for context providers.
- Use the `types` folder for TypeScript types and interfaces.
- use the `services` folder for API calls and data fetching logic.
- Use Proper Typescript types for all data structures.

# Roadmap
- [x]  Make basic Store front to show products and navigate categories
- [ ]  Make actual product page with product details and add to cart functionality
- [ ]  Implement user authentication and account management
- [ ]  Implement search functionality
- [ ]  Implement cart functionality with add, remove, and update items
- [ ]  Implement checkout process with payment and shipping options
- [ ]  Implement order history and tracking
- [ ]  Implement wishlist functionality
- [ ]  Implement reviews and ratings for products
- [ ]  Implement client dashboard for managing orders, account, and settings