import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function EventsPage() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const targetDate = new Date('2025-09-06T00:00:00'); // Nuakhai event date

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Event is Live!');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${days} days ${hours} hrs ${minutes} mins`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 text-gray-800">
      {/* Left Border */}
      <div
        className="absolute top-0 left-0 w-6 h-full bg-repeat-y bg-left bg-contain z-10"
        style={{ backgroundImage: "url('/border.png')" }}
      />

      {/* Right Border */}
      <div
        className="absolute top-0 right-0 w-6 h-full bg-repeat-y bg-right bg-contain z-10"
        style={{ backgroundImage: "url('/border.png')" }}
      />

      {/* Main Content */}
      <main className="relative z-20 px-6 md:px-12 pt-12">
        <Navbar />

        <section className="max-w-3xl mx-auto py-12 px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-center">Nuakhai Bhetghat 2025</h2>
          <p className="text-lg mb-6">
            Celebrate the vibrant festival of Nuakhai with us in London! Join our community in cherishing our traditions,
            enjoying cultural performances, delicious Odia cuisine, and much more.
          </p>
          <Link href="/register">
            <button className="bg-sambalpuri-bright text-white px-6 py-2 rounded-full hover:bg-sambalpuri-dark transition">
              Register Now
            </button>
          </Link>
        </section>

        <section className="max-w-3xl mx-auto py-12 px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-center">🎉 Event Highlights</h2>
          <ul className="text-left text-lg list-none max-w-xl mx-auto space-y-4">
            <li>
              📅 <strong>Date:</strong>{' '}
              <a
                href="https://www.google.com/calendar/render?action=TEMPLATE&text=Nuakhai+Bhetghat+2025&dates=20250906T120000Z/20250906T220000Z&details=Celebrate+Nuakhai+with+Juhar+Parivar+UK+in+London!&location=Hatch+End+High+School,+Headstone+Lane,+Harrow,+Middlesex,+HA3+6NR"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sambalpuri-bright underline hover:text-sambalpuri-dark"
              >
                Saturday, 6th September 2025
              </a>
            </li>
            <li>⏰ <strong>Time:</strong> 12PM – 10PM</li>
            <li>🪔 <strong>Samalei Puja:</strong> Begin the day with a sacred offering to Maa Samlei for blessings and well-being.</li>
            <li>🍛 <strong>Community Feast:</strong> Relish authentic Odia dishes like Ambila & Ghanta Tarkari, lovingly catered by Potli restaurant.</li>
            <li>💃 <strong>Sambalpuri Dance:</strong> Traditional folk dance performances showcasing the rich rhythm of Western Odisha.</li>
            <li>🎶 <strong>Folk Music:</strong> Experience soul-stirring melodies rooted in our cultural heritage.</li>
            <li>🧣 <strong>Sambalpuri Handloom:</strong> A vibrant showcase of Odisha’s iconic weaves and attire.</li>
            <li>🌟 <strong>Community Talent:</strong> Performances by children, youth, and elders — a true celebration for all generations.</li>
            <li>🤝 <strong>Community Bonding:</strong> Connect with fellow Odias and share in the spirit of togetherness.</li>
            <li>🌾 <strong>Celebrate Identity:</strong> Nuakhai Bhetghat is more than a festival — it's a heartfelt expression of culture, unity, and belonging.</li>
          </ul>
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
        <Footer />
      </main>
    </div>
  );
}