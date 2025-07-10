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

      <main className="bg-gray-100 text-gray-800 text-center flex flex-col items-center justify-center px-4 py-12 min-h-screen pb-24">
        <h2 className="text-3xl font-bold mb-6">Register for Nuakhai 2025</h2>
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl space-y-4">
          <RegistrationForm />
        </div>
      </main>

      <Footer />
    </>
  );
}
