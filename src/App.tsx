import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import INSSCalculator from './pages/calculators/INSSCalculator'
import FGTSCalculator from './pages/calculators/FGTSCalculator'
import IRRFCalculator from './pages/calculators/IRRFCalculator'
import RescisaoCalculator from './pages/calculators/RescisaoCalculator'
import CorrecaoMonetariaCalculator from './pages/calculators/CorrecaoMonetariaCalculator'
import ReajusteAluguelCalculator from './pages/calculators/ReajusteAluguelCalculator'
import SeguroDesempregoCalculator from './pages/calculators/SeguroDesempregoCalculator'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculadora-inss" element={<INSSCalculator />} />
            <Route path="/calculadora-fgts" element={<FGTSCalculator />} />
            <Route path="/calculadora-irrf" element={<IRRFCalculator />} />
            <Route path="/calculadora-rescisao" element={<RescisaoCalculator />} />
            <Route path="/calculadora-correcao-monetaria" element={<CorrecaoMonetariaCalculator />} />
            <Route path="/calculadora-reajuste-aluguel" element={<ReajusteAluguelCalculator />} />
            <Route path="/calculadora-seguro-desemprego" element={<SeguroDesempregoCalculator />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App