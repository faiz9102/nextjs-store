import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProduct() {
    return (
        <div className="animate-pulse flex flex-col">
            {/* Image placeholder */}
            <Skeleton className="w-[240px] h-[300px] rounded-lg" />

            {/* Product name */}
            <Skeleton className="mt-2 h-4 w-3/4 rounded" />

            {/* Price placeholder */}
            <Skeleton className="mt-1 h-4 w-1/2 rounded" />

            {/* Swatches row */}
            <div className="mt-3 flex space-x-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-6 h-6 rounded-full" />
            </div>

            {/* CTA button */}
            <Skeleton className="mt-4 h-8 w-full rounded" />
        </div>
    );
}
