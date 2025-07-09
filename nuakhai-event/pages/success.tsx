import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SuccessPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white p-8 rounded shadow text-center max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-3xl font-bold text-green-700">🎉 Payment Successful!</h1>
        <p className="mt-4 text-gray-700">Thank you for registering for Nuakhai 2025.</p>
        <button
          onClick={handleClose}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}