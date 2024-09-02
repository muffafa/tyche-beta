import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page-container p-6 text-center">
      <h1 className="text-4xl font-bold text-tycheRed mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-tycheGray mb-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="text-tycheBlue">
        Go back to the homepage
      </Link>
    </div>
  );
}

export default NotFound;
