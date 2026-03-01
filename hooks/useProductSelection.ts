"use client";

import { useState, useCallback, useMemo } from "react";
import { ProductPageProduct, ConfigurableVariant } from "@/types/product";

type SelectedOptions = Record<string, string>; // attribute_code → option uid

interface UseProductSelectionReturn {
    /** Currently selected option uids keyed by attribute_code */
    selectedOptions: SelectedOptions;
    /** Toggle selection for an option value. Re-clicking the same uid deselects it. */
    handleSelect: (code: string, uid: string) => void;
    /** Reset all selections */
    resetSelection: () => void;
    /** The fully-matched variant (all options selected + variant found), or null */
    matchedVariant: ConfigurableVariant | null;
    /**
     * Returns the set of option uids for a given attribute_code that still lead
     * to at least one IN_STOCK variant given the currently-selected OTHER options.
     * Used to grey out unavailable/OOS choices.
     */
    availableUids: (code: string) => Set<string>;
    /** True when every configurable option has a selected value */
    isComplete: boolean;
    /**
     * Images to show in the gallery:
     *  - Matched variant's media_gallery when a full selection is made
     *  - Falls back to the base product media_gallery
     */
    selectedImages: { url: string; label?: string }[];
    /** SKU to add to cart: variant SKU when matched, base SKU otherwise */
    selectedSku: string;
    /**
     * Whether the current selection is in stock:
     * - Configurable: true only when a variant is matched AND that variant is IN_STOCK
     * - Simple: always true (Magento filters OOS simple products from listings)
     */
    isInStock: boolean;
}

export function useProductSelection(product: ProductPageProduct): UseProductSelectionReturn {
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

    // Stabilise these arrays so hooks that depend on them don't re-run on every render
    const variants = useMemo<ConfigurableVariant[]>(
        () => product.variants ?? [],
        // product reference is stable per page — this is intentional
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [product.variants]
    );

    const options = useMemo(
        () => product.configurable_options ?? [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [product.configurable_options]
    );

    // ---------------------------------------------------------------------------
    // Toggle option selection (deselects on re-click)
    // ---------------------------------------------------------------------------
    const handleSelect = useCallback((code: string, uid: string) => {
        setSelectedOptions((prev) => {
            if (prev[code] === uid) {
                // Deselect
                const next = { ...prev };
                delete next[code];
                return next;
            }
            return { ...prev, [code]: uid };
        });
    }, []);

    const resetSelection = useCallback(() => setSelectedOptions({}), []);

    // ---------------------------------------------------------------------------
    // Matched variant — requires ALL options to be selected
    // ---------------------------------------------------------------------------
    const matchedVariant = useMemo<ConfigurableVariant | null>(() => {
        if (options.length === 0) return null; // simple product

        const selectedCodes = Object.keys(selectedOptions);
        if (selectedCodes.length !== options.length) return null; // incomplete

        return (
            variants.find((variant: ConfigurableVariant) =>
                // Every attribute on the variant must match the selected uid for that code
                variant.attributes.every(
                    (attr: { code: string; uid: string }) =>
                        selectedOptions[attr.code] === attr.uid
                )
            ) ?? null
        );
    }, [variants, options.length, selectedOptions]);

    // ---------------------------------------------------------------------------
    // Available uids — which options are still reachable + in stock given others
    // ---------------------------------------------------------------------------
    const availableUids = useCallback(
        (code: string): Set<string> => {
            // Other codes that are already selected (keep those constraints)
            const otherSelections = Object.entries(selectedOptions).filter(
                ([c]) => c !== code
            );

            const result = new Set<string>();

            for (const variant of variants) {
                // Skip OOS variants
                if (variant.product.stock_status !== "IN_STOCK") continue;

                // Check that this variant satisfies all OTHER current selections
                const satisfiesOthers = otherSelections.every(([c, uid]) =>
                    variant.attributes.some(
                        (a: { code: string; uid: string }) => a.code === c && a.uid === uid
                    )
                );

                if (satisfiesOthers) {
                    // Find this variant's value for the queried attribute code
                    const attr = variant.attributes.find(
                        (a: { code: string; uid: string }) => a.code === code
                    );
                    if (attr) result.add(attr.uid);
                }
            }

            return result;
        },
        [variants, selectedOptions]
    );

    // ---------------------------------------------------------------------------
    // isComplete
    // ---------------------------------------------------------------------------
    const isComplete = useMemo(
        () => options.length > 0 && Object.keys(selectedOptions).length === options.length,
        [options.length, selectedOptions]
    );

    // ---------------------------------------------------------------------------
    // selectedImages — variant gallery when matched, else base product gallery
    // ---------------------------------------------------------------------------
    const selectedImages = useMemo(() => {
        if (matchedVariant && matchedVariant.product.media_gallery.length > 0) {
            return matchedVariant.product.media_gallery;
        }
        return product.media_gallery;
    }, [matchedVariant, product.media_gallery]);

    // Variant SKU when matched, else base SKU
    const selectedSku = matchedVariant?.product.sku ?? product.sku;

    /**
     * isInStock:
     * - Configurable: the matched variant must exist AND be IN_STOCK
     * - Simple / no variants: always true (Magento doesn't surface OOS simples in normal queries)
     */
    const isInStock = options.length === 0
        ? true
        : matchedVariant?.product.stock_status === "IN_STOCK";

    return {
        selectedOptions,
        handleSelect,
        resetSelection,
        matchedVariant,
        availableUids,
        isComplete,
        selectedImages,
        selectedSku,
        isInStock,
    };
}
