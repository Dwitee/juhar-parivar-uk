// components/Navbar.tsx
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-700 text-white shadow w-full px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <img src="/logo.jpg" alt="Juhar Parivar" className="h-16 sm:h-20 cursor-pointer" />
          </Link>
          <Link href="/">
            <span className="text-lg font-semibold cursor-pointer">Juhar Parivar UK</span>
          </Link>
        </div>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-white">
          <Link href="/" className="hover:text-sambalpuri-bright transition">Home</Link>
          <Link href="/events" className="hover:text-sambalpuri-bright transition text-sambalpuri-bright font-bold relative">
            Nuakhai Bhetghat 2025
            <span className="absolute -top-3 -right-10 text-xs animate-pulse text-red-500">Register Now!</span>
          </Link>
          <Link href="/register" className="hover:text-sambalpuri-bright transition">Register</Link>
          <a href="#gallery" className="hover:text-sambalpuri-bright transition">Gallery</a>
          <a href="#contact" className="hover:text-sambalpuri-bright transition">Contact</a>
        </div>
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white text-center py-2 space-y-2" id="mobile-menu">
          <Link href="/" className="block hover:text-sambalpuri-bright transition">Home</Link>
          <Link href="/events" className="block hover:text-sambalpuri-bright transition text-sambalpuri-bright font-bold relative">
            Nuakhai 2025
            <span className="ml-2 text-xs animate-pulse text-red-500">Register Now!</span>
          </Link>
          <Link href="/register" className="block hover:text-sambalpuri-bright transition">Register</Link>
          <a href="#gallery" className="block hover:text-sambalpuri-bright transition">Gallery</a>
          <a href="#contact" className="block hover:text-sambalpuri-bright transition">Contact</a>
        </div>
      )}
    </>
  );
}