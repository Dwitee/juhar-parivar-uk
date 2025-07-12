// pages/admin.tsx
const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME!;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD!;
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { Html5Qrcode } from 'html5-qrcode';

export default function AdminPage() {
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      setSupabase(client);
    }
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [guests, setGuests] = useState<any[]>([]);
  const [scanned, setScanned] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const qrCodeSuccessCallback = (decodedText: string) => {
      handleScan(decodedText);
    };

    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250,
      },
      qrCodeSuccessCallback,
      (errorMessage) => {
        console.warn("QR scan error:", errorMessage);
      }
    ).catch((err) => console.error("Unable to start QR code scanner", err));

    return () => {
      html5QrCode.stop().catch((err) => console.error("Failed to stop QR scanner", err));
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGuests();
    }
  }, [isAuthenticated]);

  async function fetchGuests() {
    if (!supabase) return;
    const { data, error } = await supabase.from('guests').select('*').order('created_at', { ascending: false });
    if (error) console.error('Fetch error:', error);
    else setGuests(data || []);
    setLoading(false);
  }

  async function handleScan(data: string | null) {
    if (!supabase) return;
    if (data && data !== scanned) {
      setScanned(data);
      // assuming QR contains JSON with ticketId and guest info
      const { ticketId } = JSON.parse(data);
      const id = ticketId;
      const { error } = await supabase
        .from('guests')
        .update({ checked_in_at: new Date() })
        .eq('ticket_id', id);
      if (error) alert('Error updating check-in');
      else {
        alert(`Guest ${id} checked in!`);
        fetchGuests();
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 max-w-sm mx-auto mt-10 border rounded shadow text-center">
        <div className="flex justify-center mb-4">
          <img src="/logo_wide.png" alt="Juhar Parivar UK" className="h-16 object-contain mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to Juhar Parivar UK Admin Panel </h2>
        <p className="text-sm text-red-600 mb-4">
          ☠️☠️ This page is for official admins only. If you're not a Juhar Parivar UK admin, you're probably in the wrong place! ☠️☠️
          <br />
          Curious about credentials? 📞 Contact Ankan Dada.
        </p>
        <input
          className="border p-2 mb-2 w-full text-center"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative mb-2">
          <input
            className="border p-2 w-full text-center pr-10"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mx-auto"
          onClick={() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
              setIsAuthenticated(true);
            } else {
              alert('Invalid credentials');
            }
          }}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Check-In Panel</h1>
      <div className="max-w-lg mb-6">
        <div id="qr-reader" style={{ width: '100%' }} />
      </div>

      <h2 className="text-xl font-semibold mb-2 text-center">Guest List</h2>
      <div className="text-center mb-2">
        <button
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          onClick={fetchGuests}
        >
          🔄 Refresh Guest List
        </button>
      </div>
      {loading ? (
        <p>Loading guests...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Checked In</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className="border-t">
                <td className="p-2">{guest.name}</td>
                <td className="p-2">{guest.email}</td>
                <td className="p-2">
                  {guest.checked_in_at ? format(new Date(guest.checked_in_at), 'Pp') : '❌ Not Checked In'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}