import React from 'react'
import AdSenseUnit from '../ads/AdSenseUnit'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        {/* AdSense no rodapé */}
        <div className="mb-8">
          <AdSenseUnit 
            slot="footer-ad"
            format="horizontal"
            className="mb-6"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Calculadoras Online</h3>
            <p className="text-gray-300 text-sm">
              Ferramentas gratuitas para cálculos de INSS, FGTS, Imposto de Renda e muito mais.
              Todas as calculadoras são atualizadas conforme a legislação vigente.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Calculadoras</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/calculadora-inss" className="hover:text-white transition-colors">Calculadora INSS</a></li>
              <li><a href="/calculadora-fgts" className="hover:text-white transition-colors">Calculadora FGTS</a></li>
              <li><a href="/calculadora-irrf" className="hover:text-white transition-colors">Calculadora IRRF</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/sobre" className="hover:text-white transition-colors">Sobre</a></li>
              <li><a href="/contato" className="hover:text-white transition-colors">Contato</a></li>
              <li><a href="/politica-privacidade" className="hover:text-white transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>&copy; 2025 Calculadoras Online. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer