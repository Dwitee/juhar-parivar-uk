import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Marquee from 'react-fast-marquee';

export default function EventsPage() {
  const [timeLeft, setTimeLeft] = useState('');
  const [flowers, setFlowers] = useState<{ id: number; x: number; y?: number; speed?: number }[]>([]);
  const [isFalling, setIsFalling] = useState(false);
  const handleMaaClick = () => {
    // Trigger falling for 3 seconds
    setIsFalling(true);
    // Clear any existing flowers
    setFlowers([]);
    // Stop falling after 3 seconds
    setTimeout(() => setIsFalling(false), 3000);
  };
  // Spawn falling flowers (hibiscus) at intervals, only when isFalling
  useEffect(() => {
    if (typeof window === 'undefined' || !isFalling) return;
    const spawnInterval = setInterval(() => {
      const id = Date.now() + Math.random();
      const x = Math.random() * window.innerWidth;
      const speed = 1 + Math.random() * 2;
      setFlowers(prev => [...prev, { id, x, y: -50, speed }]);
    }, 300);
    return () => clearInterval(spawnInterval);
  }, [isFalling]);

  // Animate the falling flowers (hibiscus)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let animationFrame: number;
    const gravity = 0.03;
    const animate = () => {
      setFlowers(prev =>
        prev
          .map(f => {
            if (typeof f.y === 'number' && typeof f.speed === 'number') {
              const newSpeed = f.speed + gravity;
              const newY = f.y + newSpeed;
              return { ...f, y: newY, speed: newSpeed };
            }
            return f;
          })
          .filter(f => typeof f.y !== 'number' || f.y < window.innerHeight + 50)
      );
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

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
      {/* Full-screen falling hibiscus flowers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {flowers.map(f => (
          <span
            key={f.id}
            className="absolute text-4xl"
            style={{
              top: typeof f.y === 'number' ? f.y : -50,
              left: f.x,
            }}
          >
            🌺
          </span>
        ))}
      </div>
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
        <div className="sticky top-4 z-50 bg-white py-2">
          <Link href="/register">
            <button className="mx-auto block bg-gradient-to-r from-sambalpuri-bright to-sambalpuri-dark text-white px-6 py-3 rounded-full shadow-lg animate-pulse hover:animate-none hover:scale-105 transition-transform duration-300">
              Register Now
            </button>
          </Link>
          <Marquee
            gradient={false}
            speed={50}
            className="-mx-6 sm:-mx-8 md:-mx-12 py-2 text-sambalpuri-bright"
          >
            ⚡️ Hurry—Early Bird Ends Soon! Register NOW & score a FREE £10 raffle ticket! 🎟️🎉  
          </Marquee>
        </div>
        

        <section className="max-w-3xl mx-auto py-12 px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-center">Nuakhai Bhetghat 2025</h2>
          <p className="text-lg mb-6">
            Celebrate the vibrant festival of Nuakhai with us in London! Join our community in cherishing our traditions,
            enjoying cultural performances, delicious Odia cuisine, and much more.
          </p>
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
                {/* Participate in Cultural Programmes */}
        <section className="max-w-3xl mx-auto py-12 px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-sambalpuri-bright">🎉 Participate in Cultural Programmes</h2>
          <p className="text-lg text-gray-700">
            🌟 <span className="font-semibold">Ready to showcase your talent?</span> 🎭 Join our cultural extravaganza and light up the stage!
          </p>
          <div className="mt-6">
            <a
              href="https://tinyurl.com/nkuk2025"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-400 text-white px-6 py-3 rounded-full hover:bg-gray-500 transition duration-300"
            >
              Fill the Form Now
            </a>
          </div>
        </section>
        {/* Samlei Game */}
        <section className="w-full overflow-hidden bg-gray-100 py-8">
          {/* Clickable Maa Samlei image */}
          <div className="flex justify-center items-center mb-4">
            <img
              src="/game/maa.png"
              alt="Maa Samlei"
              className="w-32 h-32 cursor-pointer"
              onClick={handleMaaClick}
            />
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}