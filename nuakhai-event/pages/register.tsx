import Navbar from '../components/Navbar';
import RegistrationForm from '../components/RegistrationForm';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faYoutube, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Footer from '../components/Footer';

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row w-full min-h-screen relative">
        {/* Left Border */}
        <div
          className="block w-6 md:w-12 bg-repeat-y bg-left bg-contain absolute left-0 top-0 bottom-0 z-0"
          style={{ backgroundImage: "url('/border.png')" }}
        />
        
        {/* Main Content */}
        <div className="flex-1 z-10 px-6 md:px-12">
          <main className="bg-gray-100 text-gray-800 text-center flex flex-col items-center justify-center px-4 py-12 min-h-screen pb-24">
            <h2 className="text-3xl font-bold mb-6">Register for Nuakhai 2025</h2>
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl space-y-4">
              <RegistrationForm />
            </div>
          </main>

          <Footer />
        </div>

        {/* Right Border */}
        <div
          className="block w-6 md:w-12 bg-repeat-y bg-right bg-contain absolute right-0 top-0 bottom-0 z-0"
          style={{ backgroundImage: "url('/border.png')" }}
        />
      </div>
    </>
  );
}
