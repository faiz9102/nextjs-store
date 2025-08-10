import headerImage from '../public/headerImage.jpg';

export default function Page() {
    return (
        <>
            <header
                className="relative h-screen w-screen bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${headerImage.src})` }}
            />

            {/* Content section with proper padding */}
            <div className="p-8 pt-25">
                <h1>Welcome to the Home Page</h1>
                <p>This is the main content of the home page.</p>
                <p>Feel free to explore the site!</p>
                <a href="/about">Go to About Page</a>
            </div>
        </>
    );
}
