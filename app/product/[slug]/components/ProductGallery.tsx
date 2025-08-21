"use client";

import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { ProductPageProduct } from "@/types/product";
import { cn } from "@/lib/utils";

export default function ProductGallery({ product }: { product: ProductPageProduct }) {
    const images = [product.thumbnail, product.small_image, ...product.media_gallery].filter(Boolean) as { url: string; label?: string }[];

    const [selected, setSelected] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <div
                className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-muted group cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
            >
                <Image
                    src={images[selected].url}
                    alt={images[selected].label || product.name}
                    fill
                    className="object-contain bg-white transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-background/70 p-1 rounded-full">
                    <ZoomIn className="w-5 h-5 text-muted-foreground" />
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelected(idx)}
                        className={cn(
                            "relative w-20 h-20 rounded-lg overflow-hidden border cursor-pointer",
                            selected === idx && "border-primary shadow-lg"
                        )}
                    >
                        <Image src={img.url} alt={img.label || product.name} fill className="object-cover" />
                    </div>
                ))}
            </div>

            <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={images.map((img) => ({ src: img.url }))} />
        </div>
    );
}
