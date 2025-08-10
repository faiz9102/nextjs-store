import { Instagram } from 'lucide-react';
import { Facebook } from 'lucide-react';
import { Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white/60 backdrop-blur-lg border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-700">

                {/* Column 1 */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Shop</h3>
                    <ul className="space-y-2">
                        <li><a href="/category/whats-new" className="hover:underline">What's New</a></li>
                        <li><a href="/category/women" className="hover:underline">Women</a></li>
                        <li><a href="/category/men" className="hover:underline">Men</a></li>
                        <li><a href="/category/sale" className="hover:underline">Sale</a></li>
                    </ul>
                </div>

                {/* Column 2 */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Customer Care</h3>
                    <ul className="space-y-2">
                        <li><a href="/help/shipping" className="hover:underline">Shipping</a></li>
                        <li><a href="/help/returns" className="hover:underline">Returns</a></li>
                        <li><a href="/help/contact" className="hover:underline">Contact Us</a></li>
                        <li><a href="/help/faq" className="hover:underline">FAQ</a></li>
                    </ul>
                </div>

                {/* Column 3 */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">About</h3>
                    <ul className="space-y-2">
                        <li><a href="/about" className="hover:underline">Our Story</a></li>
                        <li><a href="/sustainability" className="hover:underline">Sustainability</a></li>
                        <li><a href="/careers" className="hover:underline">Careers</a></li>
                    </ul>
                </div>

                {/* Column 4 */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" aria-label="Instagram" className="hover:text-gray-900"><Instagram /></a>
                        <a href="#" aria-label="Twitter" className="hover:text-gray-900"><Facebook /></a>
                        <a href="#" aria-label="Facebook" className="hover:text-gray-900"><Youtube /></a>
                    </div>
                    <form className="mt-4">
                        <label htmlFor="email" className="sr-only">Subscribe</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email address"
                            className="w-full rounded-full px-4 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                        />
                        <button
                            type="submit"
                            className="mt-2 w-full bg-black text-white rounded-full py-2 text-sm hover:bg-gray-900"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Faiz. All rights reserved.
            </div>
        </footer>
    );
}
