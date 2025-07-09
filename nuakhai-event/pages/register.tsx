import RegistrationForm from '../components/RegistrationForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <>
      <nav className="bg-gray-700 text-white shadow w-full px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/logo.jpg" alt="Juhar Parivar" className="h-24" />
          <span className="text-lg font-semibold">Juhar Parivar UK</span>
        </div>
        <div className="space-x-6 text-sm font-medium text-white">
          <Link href="/" className="hover:text-sambalpuri-bright transition">Home</Link>
          <Link href="/events" className="hover:text-sambalpuri-bright transition">Nuakhai 2025</Link>
          <Link href="/register" className="text-sambalpuri-bright font-semibold">Register</Link>
          <a href="/#gallery" className="hover:text-sambalpuri-bright transition">Gallery</a>
          <a href="/#contact" className="hover:text-sambalpuri-bright transition">Contact</a>
        </div>
      </nav>

      <main className="bg-gray-100 text-gray-800 text-center flex flex-col items-center justify-center px-4 py-12 min-h-screen pb-24">
        <h2 className="text-3xl font-bold mb-6">Register for Nuakhai 2025</h2>
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl space-y-4">
          <RegistrationForm />
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-10 px-4 mt-12 relative z-10 w-full">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <p className="text-base">Follow us in various social media platforms for frequent updates.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" aria-label="Facebook" className="bg-white text-black p-3 rounded-full hover:opacity-80 transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter" className="bg-white text-black p-3 rounded-full hover:opacity-80 transition">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram" className="bg-white text-black p-3 rounded-full hover:opacity-80 transition">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="YouTube" className="bg-white text-black p-3 rounded-full hover:opacity-80 transition">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" aria-label="WhatsApp" className="bg-yellow-400 text-black p-3 rounded-full hover:opacity-80 transition">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
          <div className="text-sm mt-4 text-gray-400">
            <p>© 2025 Juhar Parivar UK. All rights reserved.</p>
            <p>Made with ❤️ to celebrate Nuakhai in London.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
