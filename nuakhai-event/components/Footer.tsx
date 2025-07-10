// components/Footer.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube,
  faWhatsapp,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4 mt-12 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="text-sm">
            Email us at{' '}
            <a href="mailto:Juharparivaruk@gmail.com" className="text-sambalpuri-bright underline">
              Juharparivaruk@gmail.com
            </a>
          </p>
          <p className="text-sm mt-2">
            <span className="mr-2">
              <FontAwesomeIcon icon={faPhone} />
            </span>
            <a href="tel:+447718909769" className="text-sambalpuri-bright underline">
              +44 7718 909769
            </a>
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Page Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-sambalpuri-bright">About Us</a></li>
            <li><a href="/events" className="hover:text-sambalpuri-bright">Nuakhai UK 2025</a></li>
            <li><a href="#" className="hover:text-sambalpuri-bright">News & Media</a></li>
            <li><a href="#" className="hover:text-sambalpuri-bright">Social Work</a></li>
            <li><a href="#" className="hover:text-sambalpuri-bright">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Juhar Parivar – UK</h3>
          <p className="text-sm mb-4">Follow us in various social media platforms for frequent updates.</p>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/NuakhaiParivarUK" aria-label="Facebook" className="bg-white text-black p-3 rounded-full hover:opacity-80 transition">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" aria-label="Twitter" className="bg-white text-black p-3 rounded-full hover:opacity-80 transition">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" aria-label="Instagram" className="bg-white text-black p-3 rounded-full hover:opacity-80 transition">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.youtube.com/@JuharParivarUK" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="bg-white text-black p-3 rounded-full hover:opacity-80 transition">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a href="https://wa.me/447718909769" aria-label="WhatsApp" className="bg-yellow-400 text-black p-3 rounded-full hover:opacity-80 transition">
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
          <p className="text-s text-gray-400 mt-4 flex items-center gap-2">
            Website developed & maintained by: Dwitee
            <a
              href="https://www.linkedin.com/in/dwiteekrishnapanda/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
              aria-label="LinkedIn Profile"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </p>
        </div>
        <div className="text-sm mt-4 text-gray-400 md:col-span-3">
          <p>© 2025 Juhar Parivar UK. All rights reserved.</p>
          <p>Made with ❤️ to celebrate Nuakhai in London.</p>
        </div>
      </div>
    </footer>
  );
}