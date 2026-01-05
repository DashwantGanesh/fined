import { useState } from "react";

export default function LearnFinance() {
  const [openIndex, setOpenIndex] = useState(null);

  const topics = [
    {
      title: "What is EMI and how it works?",
      summary:
        "EMI stands for Equated Monthly Installment. It is the fixed amount paid every month towards loan repayment.",
      details:
        "EMI includes both principal and interest. Initially, the interest portion is higher, and gradually the principal component increases. EMI depends on loan amount, interest rate, and tenure."
    },
    {
      title: "How credit score affects loan approval",
      summary:
        "Your credit score represents your creditworthiness.",
      details:
        "A higher credit score increases chances of loan approval and lower interest rates. Scores above 750 are considered good by most banks."
    },
    {
      title: "Personal Loan vs Credit Card",
      summary:
        "Both are unsecured credit options but used differently.",
      details:
        "Personal loans usually have lower interest rates and fixed tenure, whereas credit cards have very high interest but flexible repayment."
    },
    {
      title: "How to reduce loan interest",
      summary:
        "Smart planning can reduce your interest burden.",
      details:
        "You can reduce interest by improving credit score, choosing shorter tenure, making part-prepayments, and comparing multiple banks."
    }
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Learn Finance
          </h1>
          <p className="text-gray-600">
            Learn key financial concepts without leaving the page
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-md transition"
            >
              {/* Header */}
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {topic.summary}
                  </p>
                </div>

                <span className="text-2xl text-blue-600">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {/* Content */}
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-700 text-sm leading-relaxed">
                  {topic.details}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
