import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Compare Loans. Learn Finance. Decide Smart.
        </h1>

        <p className="text-lg mb-8">
          FinEd helps you compare loan offers and understand finance before applying.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/compare")}
            className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Compare Loans
          </button>

          <button
            onClick={() => navigate("/learn")}
            className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
          >
            Learn Finance
          </button>
        </div>
      </div>
    </section>
  );
}
