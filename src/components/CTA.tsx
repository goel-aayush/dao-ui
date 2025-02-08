import React from "react"
import { ArrowRight } from "lucide-react"

const CTA: React.FC = () => {
  return (
    <section className="py-20 text-center relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create your AI agent now and start experiencing the future of DAO governance.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors relative overflow-hidden group">
          <span className="relative z-10">Create an Agent</span>
          <ArrowRight className="ml-2 relative z-10" />
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10 animate-pulse"></div>
    </section>
  )
}

export default CTA