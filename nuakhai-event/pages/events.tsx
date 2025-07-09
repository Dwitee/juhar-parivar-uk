import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    <>
      <main className="text-gray-800 bg-gray-100 min-h-screen text-center px-4 py-12">
        <nav className="bg-gray-700 text-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src="/logo.jpg" alt="Juhar Parivar" className="h-24" />
              <span className="text-lg font-semibold">Juhar Parivar UK</span>
            </div>
            <div className="space-x-6 text-sm font-medium text-white">
              <Link href="/" className="hover:text-sambalpuri-bright transition">Home</Link>
              <Link href="/events" className="hover:text-sambalpuri-bright transition">Nuakhai 2025</Link>
              <Link href="/register" className="hover:text-sambalpuri-bright transition">Register</Link>
              <a href="/#gallery" className="hover:text-sambalpuri-bright transition">Gallery</a>
              <a href="/#contact" className="hover:text-sambalpuri-bright transition">Contact</a>
            </div>
          </div>
        </nav>

        <section className="max-w-3xl mx-auto py-12 px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-center">Nuakhai 2025</h2>
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
            <li>🙏 <strong>Traditional Rituals:</strong> Witness the heartfelt offering of the new harvest to deities, followed by the sharing of <em>nua</em> (new rice) among family and friends.</li>
            <li>🎭 <strong>Cultural Performances:</strong> Enjoy captivating Sambalpuri folk dances, soulful music, and performances that showcase the vibrant spirit of Odisha’s culture.</li>
            <li>🍱 <strong>Delicious Cuisine:</strong> Savor authentic Odia dishes, including traditional sweets and savory treats, celebrating the flavors of the harvest.</li>
            <li>🤝 <strong>Community Bonding:</strong> Connect with friends, meet new people, and share in the joy of Nuakhai’s spirit of togetherness and gratitude.</li>
            <li>🎈 <strong>Fun for All Ages:</strong> Activities for children, interactive stalls, and opportunities to learn about Odisha’s rich cultural heritage.</li>
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
        <footer className="bg-gray-100 text-gray-600 text-sm py-6 px-4 mt-12 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <p>© 2025 Juhar Parivar UK. All rights reserved.</p>
            <p>Made with ❤️ to celebrate Nuakhai in London.</p>
          </div>
        </footer>
      </main>
      <div className="fixed bottom-0 w-full bg-sambalpuri-dark text-white text-center py-2 px-4 font-medium z-40">
        Countdown to Nuakhai: <span className="text-sambalpuri-bright">{timeLeft}</span>
      </div>
    </>
  );
}