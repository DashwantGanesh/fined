export default function HowItWorks() {
  const steps = [
    {
      title: "Select Loan Type",
      desc: "Choose the loan you are looking for based on your need.",
      icon: "📝"
    },
    {
      title: "Compare Offers",
      desc: "View and compare interest rates from multiple banks.",
      icon: "📊"
    },
    {
      title: "Understand Finance",
      desc: "Learn about EMI, interest and repayment before applying.",
      icon: "📘"
    },
    {
      title: "Apply Confidently",
      desc: "Choose the best loan and apply with confidence.",
      icon: "✅"
    }
  ];

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            How FinEd Works
          </h2>
          <p className="text-gray-600">
            A simple and transparent process to find the right loan
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 text-center"
            >
              {/* Step Number */}
              <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {i + 1}
              </div>

              {/* Icon */}
              <div className="text-3xl mb-3">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
