export default function WhyFined() {
  const features = [
    {
      title: "AI-based Loan Comparison",
      desc: "Smart algorithms help you find the most suitable loan options.",
      icon: "🤖"
    },
    {
      title: "No Hidden Charges",
      desc: "Transparent comparison with clear interest rates and fees.",
      icon: "🔍"
    },
    {
      title: "Trusted Bank Partners",
      desc: "Offers from reliable and verified financial institutions.",
      icon: "🏦"
    },
    {
      title: "Financial Education",
      desc: "Learn finance basics before making any loan decision.",
      icon: "📘"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Why FinEd?
          </h2>
          <p className="text-gray-600">
            Everything you need to make smarter loan decisions
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 text-center"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
