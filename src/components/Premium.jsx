import React, { useState } from 'react'

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)

  const plans = [
    {
      id: 'silver',
      name: 'Silver Plan',
      price: 'GHC9.99',
      period: 'month',
      features: [
        'Basic premium features',
        'Ad-free experience',
        'HD quality streaming',
        '2 devices simultaneously',
        'Email support'
      ],
      popular: false,
      color: 'silver'
    },
    {
      id: 'gold',
      name: 'Gold Plan',
      price: 'GHC19.99',
      period: 'month',
      features: [
        'All Silver features',
        '4K Ultra HD streaming',
        'Unlimited devices',
        'Offline downloads',
        'Priority customer support',
        'Exclusive content access',
        'Family sharing (up to 6 accounts)'
      ],
      popular: true,
      color: 'gold'
    }
  ]

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId)
  }

  const handleSubscribe = (planId) => {
    // Handle subscription logic here
    console.log(`Subscribing to ${planId} plan`)
    alert(`Thank you for choosing the ${planId} plan! Redirecting to payment...`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Premium Plan</h1>
          <p className="text-xl text-gray-600">Unlock unlimited possibilities with our premium features</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${
                plan.popular ? 'border-yellow-400 shadow-yellow-100' : 'border-gray-200'
              } ${
                selectedPlan === plan.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold mb-4 ${
                  plan.color === 'gold' ? 'text-yellow-600' : 'text-gray-600'
                }`}>
                  {plan.name}
                </h2>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
              </div>

              <div className="mb-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-300 ${
                  plan.color === 'gold' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSubscribe(plan.id)
                }}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-2">All plans include a 30-day money-back guarantee</p>
          <p className="text-gray-500">Cancel anytime. No commitment required.</p>
        </div>
      </div>
    </div>
  )
}

export default Premium
