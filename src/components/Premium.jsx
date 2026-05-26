import { useState } from "react";
import PageHeader from "./PageHeader";

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: "silver",
      name: "Silver",
      price: "GHC 9.99",
      period: "month",
      features: [
        "Unlimited connection requests",
        "See who viewed your profile",
        "Priority in Discover feed",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "gold",
      name: "Gold",
      price: "GHC 19.99",
      period: "month",
      features: [
        "Everything in Silver",
        "Boost profile visibility",
        "Read receipts in chat",
        "Advanced filters",
        "Priority support",
      ],
      popular: true,
    },
  ];

  const handleSubscribe = (planId) => {
    alert(`Thanks for choosing ${planId}! Payment flow coming soon.`);
  };

  return (
    <>
      <PageHeader
        title="Premium"
        description="Get more out of DevConnect with upgraded features"
      />

      <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`page-card p-6 cursor-pointer transition-all hover:shadow-md ${
              plan.popular ? "ring-2 ring-warning" : ""
            } ${selectedPlan === plan.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <span className="badge badge-warning badge-sm mb-3">
                Most popular
              </span>
            )}
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="mt-2 mb-6">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-base-content/50"> / {plan.period}</span>
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex gap-2 text-sm text-base-content/80">
                  <span className="text-success">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`btn w-full ${
                plan.popular ? "btn-warning" : "btn-primary btn-outline"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleSubscribe(plan.id);
              }}
            >
              Subscribe
            </button>
          </article>
        ))}
      </div>

      <p className="text-center text-sm text-base-content/50 mt-8">
        30-day money-back guarantee · Cancel anytime
      </p>
    </>
  );
};

export default Premium;
