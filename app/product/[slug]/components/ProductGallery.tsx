"use client";

import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState, useEffect } from "react";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
    url: string;
    label?: string;
}

interface ProductGalleryProps {
    /** Reactive image list — provided by the parent (ProductPage) which owns variant selection */
    images: GalleryImage[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selected, setSelected] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Reset to the first image whenever the image set changes (e.g. on variant selection)
    useEffect(() => {
        setSelected(0);
    }, [images]);

    // Guard: render a placeholder when no images are available
    if (!images || images.length === 0) {
        return (
            <div className="aspect-square w-full rounded-2xl border bg-muted flex items-center justify-center text-muted-foreground">
                No image available
            </div>
        );
    }

    const current = images[selected];

    return (
        <div className="flex flex-col gap-4">
            {/* Main image */}
            <div
                className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-muted group cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
            >
                <Image
                    src={current.url}
                    alt={current.label || productName}
                    fill
                    priority
                    className="object-contain bg-white transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-background/70 p-1 rounded-full">
                    <ZoomIn className="w-5 h-5 text-muted-foreground" />
                </div>
            </div>

            {/* Thumbnails — only shown when there are multiple images */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelected(idx)}
                            className={cn(
                                "relative w-20 h-20 rounded-lg overflow-hidden border cursor-pointer flex-shrink-0",
                                selected === idx
                                    ? "border-primary shadow-md ring-2 ring-primary ring-offset-1"
                                    : "border-muted hover:border-muted-foreground"
                            )}
                        >
                            <Image
                                src={img.url}
                                alt={img.label || productName}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={selected}
                slides={images.map((img) => ({ src: img.url, alt: img.label || productName }))}
                on={{ view: ({ index }) => setSelected(index) }}
            />
        </div>
    );
}
