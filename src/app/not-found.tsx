import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6 text-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-2">404</p>
        <h1 className="mpp-display text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">The page you're looking for doesn't exist or has moved.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Back to Mind Elevate
        </Link>
      </div>
    </main>
  );
}
