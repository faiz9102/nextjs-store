import SkeletonProduct from './SkeletonProduct'

export default function SkeletonProductGrid() {
    return (
        <div className="
        grid
        grid-cols-2 gap-y-10
        sm:grid-cols-2
        md:grid-cols-3
        xl:grid-cols-5
        justify-items-center
        mb-[50px]
        z-0">
            {Array.from({length: 25}).map((_, index) => (
                <SkeletonProduct key={index}/>
            ))}
        </div>
    );
}
