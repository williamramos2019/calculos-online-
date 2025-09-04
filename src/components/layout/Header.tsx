import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Calculadoras Online</h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
              Início
            </Link>
            <div className="relative group">
              <span className="text-gray-600 hover:text-primary-600 transition-colors text-sm cursor-pointer">
                Trabalhistas ▼
              </span>
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/calculadora-inss" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">INSS</Link>
                <Link to="/calculadora-fgts" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">FGTS</Link>
                <Link to="/calculadora-irrf" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">Imposto de Renda</Link>
                <Link to="/calculadora-rescisao" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">Rescisão CLT</Link>
                <Link to="/calculadora-seguro-desemprego" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">Seguro-Desemprego</Link>
              </div>
            </div>
            <div className="relative group">
              <span className="text-gray-600 hover:text-primary-600 transition-colors text-sm cursor-pointer">
                Financeiras ▼
              </span>
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/calculadora-correcao-monetaria" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">Correção Monetária</Link>
                <Link to="/calculadora-reajuste-aluguel" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">Reajuste Aluguel</Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header