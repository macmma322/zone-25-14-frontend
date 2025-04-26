import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <h1 className="text-5xl md:text-7xl font-bold text-center mb-8">
        Welcome to <span className="text-blue-500">Zone 25-14</span>
      </h1>
      <p className="text-lg md:text-2xl text-center mb-12 max-w-2xl">
        Loyalty. Brotherhood. Rebellion.
        <br />
        Where outsiders build a legacy.
      </p>
      <div className="flex flex-wrap gap-6 justify-center">
        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
        >
          Login
        </a>
        <a
          href="/register"
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition"
        >
          Register
        </a>
        <a
          href="/products"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition"
        >
          Explore Products
        </a>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          <span>Add to Cart</span>
        </div>
      </div>
    </div>
  );
}
