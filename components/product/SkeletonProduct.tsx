import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProduct() {
    return (
        <div className="animate-pulse flex flex-col">
            {/* Image placeholder */}
            <div className="bg-gray-200 w-[240px] h-[300px] rounded-lg" />

            {/* Product name */}
            <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded" />

            {/* Price placeholder */}
            <div className="mt-1 h-4 w-1/2 bg-gray-200 rounded" />

            {/* Swatches row */}
            <div className="mt-3 flex space-x-2">
                <div className="bg-gray-200 rounded-full w-6 h-6" />
                <div className="bg-gray-200 rounded-full w-6 h-6" />
                <div className="bg-gray-200 rounded-full w-6 h-6" />
            </div>

            {/* CTA button */}
            <div className="mt-4 h-8 w-full bg-gray-200 rounded" />
        </div>
    );
}
