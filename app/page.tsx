import headerImage from '../public/headerImage.jpg';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAllCategories } from '@/services/categories';

export default async function Page() {
    const categories = await getAllCategories();
    const featuredCategories = categories.slice(0, 3);

    return (
        <>
            {/* Hero section with overlay */}
            <header
                className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-screen w-full bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${headerImage.src})` }}
            >
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 sm:px-6 md:px-8 lg:px-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6">
                        Discover Premium Quality
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl max-w-3xl text-center mb-8">
                        Elevate your style with our curated collection of premium products
                    </p>
                    <Button size="lg" className="text-base md:text-lg py-6 px-8 rounded-full">
                        Shop Now
                    </Button>
                </div>
            </header>

            {/* Content section with featured categories */}
            <section className="py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
                    Featured Collections
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredCategories.map((category) => (
                        <Link
                            href={`/category/${category.slug}`}
                            key={category.uid}
                            className="group block bg-white hover:bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-8 text-center">
                                <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Discover our selection
                                </p>
                                <span className="inline-block text-primary font-medium">
                                    Browse Products →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/category/all">View All Collections</Link>
                    </Button>
                </div>
            </section>

            {/* About section */}
            <section className="bg-gray-50 py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-16">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                        About Our Store
                    </h2>
                    <p className="text-gray-600 text-lg text-center max-w-3xl mx-auto mb-8">
                        We curate high-quality products with attention to detail and exceptional craftsmanship.
                        Every item in our collection is carefully selected to ensure premium quality and style.
                    </p>
                </div>
            </section>
        </>
    );
}
