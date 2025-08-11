import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProduct() {
    return (
        <div className="animate-pulse flex flex-col w-full max-w-xs mx-auto">
            {/* Image placeholder */}
            <Skeleton className="aspect-3/4 w-full rounded-xl" />

            {/* Product name */}
            <Skeleton className="mt-4 h-5 w-3/4 rounded" />

            {/* Price placeholder */}
            <Skeleton className="mt-2 h-4 w-1/3 rounded" />

            {/* Swatches row */}
            <div className="mt-3 flex gap-1.5">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-5 h-5 rounded-full" />
            </div>
        </div>
    );
}
