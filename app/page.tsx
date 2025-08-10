import headerImage from '../public/headerImage.jpg';

export default function Page() {
    return (
        <>
            <main
                className="relative h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${headerImage.src})` }}
            />
            <div className="p-8">
                <h1>Welcome to the Home Page</h1>
                <p>This is the main content of the home page.</p>
                <p>Feel free to explore the site!</p>
                <a href="/about">Go to About Page</a>
            </div>
        </>
    );
}
