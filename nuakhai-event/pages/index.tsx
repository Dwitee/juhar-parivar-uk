import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faYoutube, faWhatsapp, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const eventDate = new Date('2025-09-06T10:00:00Z').getTime();
  const [countdown, setCountdown] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        setCountdown('Event Started!');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Gallery images and state moved outside of JSX for proper hook usage
  const images = [0,1, 2, 3, 4, 5].map(n => `/gallery${n}.jpg`);
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex">
      {/* Left Border */}
      <div
        className="hidden md:block w-12 bg-repeat-y bg-left bg-contain"
        style={{ backgroundImage: "url('/border.png')" }}
      />

      {/* Main content */}
      <div className="flex-1 scroll-smooth">
        <main className="text-gray-800 text-center flex flex-col items-center justify-center bg-gray-100 pb-24">
        <Navbar />

        <div className="sticky top-16 z-30">
          <div className="flex justify-center items-center mt-4 mb-6">
            <Link href="/events">
              <div className="relative group">
                <div className="bg-sambalpuri-bright hover:bg-sambalpuri-dark text-white text-xl font-bold py-3 px-6 rounded-full transition transform hover:scale-105 shadow-lg">
                  Nuakhai Bhetghat 2025
                </div>
                <div className="absolute -top-3 -right-4 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full transform rotate-6 shadow-md">
                  <span className="animate-pulse">Register Now</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <section id="gallery" className="relative h-[70vh] w-full bg-white flex flex-col justify-center items-center text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10 pointer-events-none" />
          <div className="relative z-20 mx-auto w-full max-w-[90vw] h-full max-h-[500px] text-center flex items-center justify-center">
            <button
              onClick={() => setCurrentImage((currentImage - 1 + images.length) % images.length)}
              className="absolute top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 rounded-full p-3 shadow-xl z-10 left-4"
              aria-label="Previous Image"
            >
              ◀
            </button>
            <img
              src={images[currentImage]}
              alt={`Gallery ${currentImage + 1}`}
              className="w-full h-full object-cover rounded-xl shadow-lg border-4 border-white transition duration-500 ease-in-out"
            />
            <button
              onClick={() => setCurrentImage((currentImage + 1) % images.length)}
              className="absolute top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 rounded-full p-3 shadow-xl z-10 right-4"
              aria-label="Next Image"
            >
              ▶
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full ${idx === currentImage ? 'bg-red-600' : 'bg-yellow-300'} transition`}
                />
              ))}
            </div>
          </div>
        </section>


        <section className="bg-gray-50 py-16 px-4 text-gray-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 text-left">
              <p className="uppercase tracking-widest text-sm text-gray-600">Nuakhai Bhetghat 2024</p>
              <h2 className="text-3xl font-extrabold mt-2 mb-4">
                Highlights of <span className="text-sambalpuri-bright">Nuakhai Bhetghat London 2024 </span>
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 mb-6">
                London, 9th November 2024 — The seventh annual Nuakhai Bhetghat celebration hosted by Juhar Parivar UK took place with great fanfare on 9th November 2024 at Hatch End High School, Pinner, London. Nearly 200 people, including Odiya families from different parts of the UK, attended the event, which was marked by vibrant cultural performances, traditional rituals, and a joyous community spirit.
              </p>
              <p className="text-sm leading-relaxed text-gray-700 mb-6">
                The festivities began with a traditional Samalei Puja, where prayers were offered to Maa Samlei for the well-being of everyone. The prayers were followed by a delicious lunch, catered by Potli, one of London’s renowned Indian restaurants. The meal featured classic Odia dishes such as "Ambila" and "Ghanta Tarkari," specially prepared by the lady members of Juhar Parivar UK, including Sushri Wells, Ena Pattnaik, and Manasi Panigrahi.
              </p>
              <p className="text-sm leading-relaxed text-gray-700 mb-6">
                A highlight of the event was the cultural program, which commenced with the devotional Samlei Bhajan. This was followed by a heartwarming ceremony to honour the elders of the community, as they were felicitated, and their blessings were sought. The chief guest for the occasion, Sri Rohit Pujhari, former Chief Whip of BJD, Ex-Minister for Higher Education, Government of Odisha, and a two-time MLA from Rairakhol, who flew over from India specifically to celebrate with the UK Odiya community.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-sambalpuri-bright text-white px-5 py-2 rounded-full hover:bg-sambalpuri-dark transition">Media Gallery</button>
                <button className="bg-sambalpuri-bright text-white px-5 py-2 rounded-full hover:bg-sambalpuri-dark transition">Photo Gallery</button>
              </div>
            </div>
            <div className="md:w-1/2">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/LOvsge6aNVc?autoplay=1&mute=1&controls=1&rel=0&loop=1&playlist=LOvsge6aNVc"
                title="YouTube video player"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section id="contact" className="bg-gray-100 py-12 text-center w-full">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">📍 Venue Location</h2>
            <p className="mb-4">Join us at Hatch End High School, Headstone Lane, Harrow, Middlesex, HA3 6NR </p>
          </div>
          <div className="w-full">
            <iframe
              className="w-full h-96 border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3363.695723440557!2d-0.360092039183468!3d51.606131662164344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487614a3a4f35739%3A0x745618daf053e8d5!2sHatch%20End%20High%20School!5e0!3m2!1sen!2suk!4v1752027270997!5m2!1sen!2suk"
            />
          </div>
        </section>

        {/* Sponsors Banner Section */}
        <section className="bg-white py-8 border-t border-gray-200">
          <h3 className="text-center text-xl font-bold text-gray-700 mb-4">Our Sponsors</h3>
          <div className="overflow-hidden relative">
            <div className="flex animate-scroll-left space-x-8 px-4">
              {[1, 2, 3, 4, 5].map((n) =>
                n === 1 || n===5 ? (
                  <a key={n} href="https://potli.co.uk/" target="_blank" rel="noopener noreferrer">
                    <img
                      src={`/sponsors_icon${n}.png`}
                      alt={`Sponsor ${n}`}
                      className="h-16 w-auto object-contain"
                    />
                  </a>
                ) : (
                  <img
                    key={n}
                    src={`/sponsors_icon${n}.png`}
                    alt={`Sponsor ${n}`}
                    className="h-16 w-auto object-contain"
                  />
                )
              )}
            </div>
          </div>
          <style jsx>{`
            @keyframes scroll-left {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-scroll-left {
              animation: scroll-left 20s linear infinite;
            }
          `}</style>
        </section>

        <Footer />
      </main>
      <div className="fixed bottom-0 w-full bg-sambalpuri-dark text-center py-3 text-lg font-semibold text-sambalpuri-white shadow-inner z-40">
        Countdown to Nuakhai: <span className="text-white">{countdown}</span>
      </div>
      </div>

      {/* Right Border */}
      <div
        className="hidden md:block w-12 bg-repeat-y bg-right bg-contain"
        style={{ backgroundImage: "url('/border.png')" }}
      />
    </div>
  );
}
