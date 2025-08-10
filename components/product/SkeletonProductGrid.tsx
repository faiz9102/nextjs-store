import SkeletonProduct from './SkeletonProduct'

export default function SkeletonProductGrid() {
    return (
        <div className="
                grid
                grid-cols-2
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-3
                xl:grid-cols-4
                gap-x-4
                sm:gap-x-6
                md:gap-x-8
                gap-y-10
                sm:gap-y-12
                md:gap-y-16
        ">
            {Array.from({length: 8}).map((_, index) => (
                <SkeletonProduct key={index}/>
            ))}
        </div>
    );
}
