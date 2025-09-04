import React from 'react'
import { Link } from 'react-router-dom'
import AdSenseUnit from '../components/ads/AdSenseUnit'
import SEOHead from '../components/seo/SEOHead'
import StructuredData from '../components/common/StructuredData'
import { seoConfig, generateStructuredData, getCanonicalUrl } from '../utils/seo'

const Home: React.FC = () => {
  const calculators = [
    {
      title: 'Rescisão Trabalhista CLT',
      description: 'Calcule todas as verbas rescisórias: saldo, 13º, férias, aviso prévio e multa FGTS.',
      link: '/calculadora-rescisao',
      icon: '📋',
      category: 'Trabalhista',
      popular: true
    },
    {
      title: 'Correção Monetária',
      description: 'Atualize valores usando IPCA, IGP-M, CDI, SELIC e outros índices oficiais.',
      link: '/calculadora-correcao-monetaria',
      icon: '📈',
      category: 'Financeira',
      popular: true
    },
    {
      title: 'Reajuste de Aluguel',
      description: 'Calcule o reajuste do aluguel usando IGP-M, IPCA conforme Lei do Inquilinato.',
      link: '/calculadora-reajuste-aluguel',
      icon: '🏠',
      category: 'Financeira',
      popular: true
    },
    {
      title: 'Calculadora INSS',
      description: 'Calcule a contribuição do INSS sobre o salário bruto conforme as alíquotas atualizadas.',
      link: '/calculadora-inss',
      icon: '💼',
      category: 'Trabalhista'
    },
    {
      title: 'Seguro-Desemprego',
      description: 'Calcule o valor e número de parcelas do seguro-desemprego.',
      link: '/calculadora-seguro-desemprego',
      icon: '🛡️',
      category: 'Trabalhista'
    },
    {
      title: 'Calculadora FGTS',
      description: 'Calcule o valor do FGTS depositado mensalmente pelo empregador.',
      link: '/calculadora-fgts',
      icon: '💰',
      category: 'Trabalhista'
    },
    {
      title: 'Calculadora IRRF',
      description: 'Calcule o Imposto de Renda Retido na Fonte sobre salários e rendimentos.',
      link: '/calculadora-irrf',
      icon: '📊',
      category: 'Trabalhista'
    }
  ]

  const structuredData = generateStructuredData('website', {})

  return (
    <div className="max-w-6xl mx-auto">
      <SEOHead
        title={seoConfig.home.title}
        description={seoConfig.home.description}
        keywords={seoConfig.home.keywords}
        canonicalUrl={getCanonicalUrl('/')}
      />
      <StructuredData data={structuredData} />
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Calculadoras Online
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Ferramentas gratuitas e precisas para cálculos de INSS, FGTS, Imposto de Renda e muito mais. 
          Todas atualizadas conforme a legislação brasileira vigente.
        </p>
      </div>

      {/* AdSense após o título */}
      <div className="mb-12">
        <AdSenseUnit 
          slot="top-banner"
          format="horizontal"
          className="text-center"
        />
      </div>

      {/* Calculadoras Populares */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Calculadoras Mais Populares</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {calculators.filter(calc => calc.popular).map((calc, index) => (
            <Link
              key={index}
              to={calc.link}
              className="calculator-card group hover:scale-105 transform transition-all duration-200 relative"
            >
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Popular
              </div>
              <div className="text-4xl mb-4">{calc.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {calc.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {calc.description}
              </p>
              <div className="mt-4 text-primary-600 text-sm font-medium">
                Calcular agora →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Todas as Calculadoras por Categoria */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Todas as Calculadoras</h2>
        
        {/* Calculadoras Trabalhistas */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">👔</span> Calculadoras Trabalhistas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {calculators.filter(calc => calc.category === 'Trabalhista').map((calc, index) => (
              <Link
                key={index}
                to={calc.link}
                className="calculator-card group hover:scale-105 transform transition-all duration-200"
              >
                <div className="text-3xl mb-3">{calc.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {calc.title}
                </h4>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {calc.description}
                </p>
                <div className="mt-3 text-primary-600 text-xs font-medium">
                  Calcular →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Calculadoras Financeiras */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💹</span> Calculadoras Financeiras
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calculators.filter(calc => calc.category === 'Financeira').map((calc, index) => (
              <Link
                key={index}
                to={calc.link}
                className="calculator-card group hover:scale-105 transform transition-all duration-200"
              >
                <div className="text-3xl mb-3">{calc.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {calc.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {calc.description}
                </p>
                <div className="mt-3 text-primary-600 text-sm font-medium">
                  Calcular →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* AdSense entre conteúdo */}
      <div className="mb-12">
        <AdSenseUnit 
          slot="middle-banner"
          format="rectangle"
          className="text-center"
        />
      </div>

      {/* Seção de Informações */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Por que usar nossas calculadoras?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Sempre Atualizadas</h3>
              <p className="text-gray-600 text-sm">Nossas calculadoras são atualizadas automaticamente conforme mudanças na legislação.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Gratuitas</h3>
              <p className="text-gray-600 text-sm">Todas as nossas ferramentas são completamente gratuitas e sem limitações.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Fácil de Usar</h3>
              <p className="text-gray-600 text-sm">Interface simples e intuitiva, otimizada para dispositivos móveis.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Resultados Precisos</h3>
              <p className="text-gray-600 text-sm">Cálculos baseados nas tabelas e fórmulas oficiais do governo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home