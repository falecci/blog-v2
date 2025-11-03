import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12 sm:px-10"
    >
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-6xl sm:text-8xl font-black text-black mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-black hover:opacity-80 transition-opacity font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>
    </main>
  );
}
