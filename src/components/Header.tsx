import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Bot, Menu, X } from "lucide-react"

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gray-800 bg-opacity-50 py-4 backdrop-blur-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bot className="h-8 w-8 mr-2 text-blue-400" />
          <span className="text-xl font-bold">AI DAO</span>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/create-agent" className="hover:text-blue-400 transition-colors">
                Create an Agent
              </Link>
            </li>
            <li>
              <Link to="/chatbot" className="hover:text-blue-400 transition-colors">
                Chatbot
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-blue-400 transition-colors">
                Docs
              </Link>
            </li>
          </ul>
        </nav>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden mt-4">
          <ul className="flex flex-col items-center space-y-4">
            <li>
              <Link to="/" className="hover:text-blue-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/create-agent" className="hover:text-blue-400 transition-colors">
                Create an Agent
              </Link>
            </li>
            <li>
              <Link to="/chatbot" className="hover:text-blue-400 transition-colors">
                Chatbot
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-blue-400 transition-colors">
                Docs
              </Link>
            </li>

          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header