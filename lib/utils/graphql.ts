import { DocumentNode, print } from 'graphql';
import CART_FRAGMENT from '@/graphql/fragments/cart.graphql';

/**
 * Combines a GraphQL operation with the CartFragment
 * This allows us to keep the fragment in one place while avoiding #import directives
 * which cause server-side syntax errors
 */
export function appendCartFragment(document: DocumentNode): string {
    // Convert the DocumentNode to a string
    const query = print(document);

    // Convert the fragment to a string
    const fragment = print(CART_FRAGMENT);

    // Combine them - the fragment needs to be at the end of the document
    return `${query}\n\n${fragment}`;
}
