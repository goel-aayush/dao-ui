import type React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Web3ReactProvider } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import CTA from "./components/CTA"
import Background3D from "./components/Background3D"
import CreateAgent from "./pages/CreateAgent"
import ChatbotGovernance from "./pages/ChatbotGovernance"

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const App: React.FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
          <Background3D />
          <div className="relative z-10">
            <Header />
            <main>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <Features />
                      <CTA />
                    </>
                  }
                />
                <Route path="/create-agent" element={<CreateAgent />} />
                <Route path="/chatbot" element={<ChatbotGovernance />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </Web3ReactProvider>
  )
}

export default App

