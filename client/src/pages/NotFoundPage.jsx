import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="shell flex min-h-[60vh] flex-col items-center justify-center gap-5 p-8 text-center">
    <p className="text-label">404</p>
    <h1 className="font-display text-5xl text-text-primary">Page not found</h1>
    <Link to="/" className="rounded-full bg-accent-primary px-6 py-3 font-semibold text-white">
      Return home
    </Link>
  </div>
);

export default NotFoundPage;
