import React from "react"
import { Bot, TrendingUp, ArrowRightLeft, Shield } from "lucide-react"

const features = [
  {
    icon: <Bot className="h-12 w-12 text-blue-400" />,
    title: "AI-powered governance",
    description: "Make informed decisions with AI-assisted proposal analysis and voting.",
  },
  {
    icon: <TrendingUp className="h-12 w-12 text-green-400" />,
    title: "Automated yield optimization",
    description: "Maximize your returns with AI-driven yield farming strategies.",
  },
  {
    icon: <ArrowRightLeft className="h-12 w-12 text-purple-400" />,
    title: "Cross-chain arbitrage",
    description: "Capitalize on price differences across multiple blockchains automatically.",
  },
  {
    icon: <Shield className="h-12 w-12 text-yellow-400" />,
    title: "Secure agent-controlled wallets",
    description: "Enjoy peace of mind with secure, AI-managed smart contract wallets.",
  },
]

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-700 bg-opacity-50 backdrop-blur-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features