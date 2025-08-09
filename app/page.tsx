export default async function Page() {

    return (
        <>
            <main style={{
                "height": "100vh",
                "backgroundImage": "url('https://dummyimage.com/1920x1080/000/fff.jpg')",
                "backgroundSize": "cover",
                "backgroundPosition": "center",
            }}/>
            <div>
                <h1>Welcome to the Home Page</h1>
                <p>This is the main content of the home page.</p>
                {/* You can add more components or content here */}
                <p>Feel free to explore the site!</p>
                {/* Example of a link to another page */}
                <a href="/about">Go to About Page</a>
            </div>
        </>
    );
}