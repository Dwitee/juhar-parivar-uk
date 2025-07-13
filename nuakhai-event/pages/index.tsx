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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sponsorCount = 4;
  const sponsorUrls = [
    'https://www.spfsl.com/',
    'https://potli.co.uk/',
    'https://www.sheroproperties.com/',
    'https://potli.co.uk/',
  ];
  const sponsorRef = useRef<HTMLDivElement>(null);

  // Automatically scroll sponsors horizontally every 2 seconds
  useEffect(() => {
    const sponsorTimer = setInterval(() => {
      const container = sponsorRef.current;
      if (container) {
        const { scrollLeft, clientWidth, scrollWidth } = container;
        const maxScrollLeft = scrollWidth - clientWidth;
        const nextScrollLeft = scrollLeft + clientWidth;
        if (nextScrollLeft > maxScrollLeft) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollTo({ left: nextScrollLeft, behavior: 'smooth' });
        }
      }
    }, 2000);
    return () => clearInterval(sponsorTimer);
  }, []);

  // Core members carousel
  const coreRef = useRef<HTMLDivElement>(null);
  const coreMembers = [
    {
      profileUrl: 'https://www.linkedin.com/in/ankannaik/',
      photoUrl: '/coremembers/ankannaik.jpg',
      name: 'Ankan Naik',
    },
    {
      profileUrl: 'https://www.linkedin.com/in/srirampanda/',
      photoUrl: '/coremembers/srirampanda.jpg',
      name: 'Sriram Panda',
    },
    {
      profileUrl: 'https://www.linkedin.com/in/uttam-tripathy-05808534/',
      photoUrl: '/coremembers/uttam-tripathy.jpg',
      name: 'Uttam Tripathy',
    },
    {
      profileUrl: 'https://www.linkedin.com/in/debasish-mishra-41a21010/',
      photoUrl: '/coremembers/debasish-mishra.jpg',
      name: 'Debasish Mishra',
    },
    {
      profileUrl: 'https://www.linkedin.com/in/satyendupattnaik/',
      photoUrl: '/coremembers/satyendupattnaik.jpg',
      name: 'Uttam Tripathy',
    },
    {
      profileUrl: 'https://www.linkedin.com/in/vijaymeher/',
      photoUrl: '/coremembers/vijaymeher.png',
      name: 'Vijay Meher',
    },
    {
      profileUrl: 'https://www.linkedin.com/in/alok-kumar-naik/',
      photoUrl: '/coremembers/alok.png',
      name: 'Alok Naik',
    },
    
  ];
  useEffect(() => {
    const coreTimer = setInterval(() => {
      const container = coreRef.current;
      if (container) {
        const { scrollLeft, clientWidth, scrollWidth } = container;
        const maxScrollLeft = scrollWidth - clientWidth;
        const nextScrollLeft = scrollLeft + clientWidth;
        container.scrollTo({
          left: nextScrollLeft > maxScrollLeft ? 0 : nextScrollLeft,
          behavior: 'smooth',
        });
      }
    }, 2000);
    return () => clearInterval(coreTimer);
  }, []);

  return (
    <div className="flex">
      {/* Left Border */}
      <div
        className="block w-4 md:w-12 bg-repeat-y bg-left bg-contain"
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

        {/* About Us Section */}
        <section id="about" className="bg-white py-16 px-4 text-gray-800">
          <div className="max-w-6xl mx-auto text-left">
            <h2 className="text-3xl font-extrabold mb-6 text-sambalpuri-bright">About Us</h2>
            <p className="mb-4 text-lg">Welcome to <strong>Juhar Parivar UK 🙏</strong></p>
            <p className="mb-4">
              Juhar Parivar UK is a vibrant social and cultural organisation based in Harrow, United Kingdom, dedicated to preserving and promoting the rich cultural heritage and traditions of Western Odisha.
            </p>
            <p className="mb-4">
              Founded in 2015 by a group of passionate Odia individuals, our community has steadily grown into a strong and closely-knit family of over 250 members. What started as a small gathering of like-minded families has now become an annual cultural tradition for the Odia diaspora in the UK.
            </p>
            <h3 className="text-2xl font-semibold text-sambalpuri-bright mt-8 mb-2">Our Signature Event: Nuakhai Bhetghat</h3>
            <p className="mb-4">
              At the heart of our community celebrations is Nuakhai, the traditional agrarian festival observed primarily in Western Odisha and Chhattisgarh, India. Celebrated after Ganesh Chaturthi — typically in August or September — Nuakhai marks the welcoming of the new rice harvest, and is a time for gratitude, family bonding, and cultural celebration.
            </p>
            <p className="mb-4">
              Our flagship event, the Nuakhai Bhetghat, is held annually in London. It brings together Odia families from across the UK to relive the customs and spirit of our homeland. The celebration is known for its warmth, color, and authenticity.
            </p>
            <h3 className="text-2xl font-semibold text-sambalpuri-bright mt-8 mb-2">Our Mission</h3>
            <ul className="list-disc list-inside mb-4 pl-4 text-gray-700">
              <li>Celebrating and preserving the traditions of Western Odisha</li>
              <li>Building a strong support network for Odia families in the UK</li>
              <li>Passing on cultural values to the younger generation</li>
              <li>Engaging in philanthropic activities both in the UK and Odisha</li>
            </ul>
            <p className="mt-6">
              We invite you to join us on this journey of cultural celebration, community bonding, and meaningful contribution.
            </p>
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
          <div ref={sponsorRef} className="w-full overflow-x-scroll overflow-y-hidden scroll-smooth touch-pan-x snap-x snap-mandatory -webkit-overflow-scrolling-touch">
            <div className="flex flex-nowrap gap-0 sm:gap-12 px-0 sm:px-4">
              {Array.from({ length: sponsorCount }).map((_, idx) =>
                idx < sponsorUrls.length ? (
                  <a
                    key={idx}
                    href={sponsorUrls[idx]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center h-32 sm:h-24 snap-start"
                  >
                    <img
                      src={`/sponsors_icon${idx + 1}.png`}
                      alt={`Sponsor ${idx + 1}`}
                      className="h-24 w-auto object-contain transition duration-500 ease-in-out"
                    />
                  </a>
                ) : (
                  <a
                    key={idx}
                    href="#"
                    className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center h-32 sm:h-24 space-x-2 snap-start"
                  >
                    <span className="bg-gray-200 h-16 w-32 sm:w-40 rounded-lg animate-pulse" />
                  </a>
                )
              )}
            </div>
          </div>
          {/* WhatsApp sponsor contact link */}
          <p className="text-center mt-4 text-sm text-blue-600">
            <a
              href="https://wa.me/447718909769?text=Hi%20I%20am%20contacting%20you%20from%20Juhar%20Parivar%20UK%20website%2C%20I%20want%20to%20be%20a%20sponsor%20for%20the%20upcoming%20Event"
              target="_blank"
              rel="noopener noreferrer"
            >
              Want to be a sponsor? Click here to contact.
            </a>
          </p>
        </section>

        {/* Our Core Members Section */}
        <section className="bg-white py-16 border-t border-gray-200">
          <h3 className="text-center text-xl font-bold text-gray-700 mb-4">Our Core Members</h3>
          <div
            ref={coreRef}
            className="w-full overflow-x-scroll overflow-y-hidden scroll-smooth touch-pan-x snap-x snap-mandatory -webkit-overflow-scrolling-touch"
          >
            <div className="flex flex-nowrap gap-0 sm:gap-12 px-0 sm:px-4">
              {coreMembers.map((member, idx) => (
                <a
                  key={member.profileUrl}
                  href={member.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-full sm:w-auto flex flex-col items-center justify-center h-40 sm:h-32 snap-start"
                >
                  <img
                    src={member.photoUrl}
                    alt={`Core member ${idx + 1}`}
                    className="h-32 sm:h-24 w-auto object-contain transition duration-500 ease-in-out rounded-full"
                  />
                  <span className="mt-2 text-sm font-medium text-gray-700">{member.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
      <div className="fixed bottom-0 w-full bg-sambalpuri-dark text-center py-3 text-lg font-semibold text-sambalpuri-white shadow-inner z-40">
        Countdown to Nuakhai: <span className="text-white">{countdown}</span>
      </div>
      </div>

      {/* Right Border */}
      <div
        className="block w-4 md:w-12 bg-repeat-y bg-right bg-contain"
        style={{ backgroundImage: "url('/border.png')" }}
      />
    </div>
  );
}
