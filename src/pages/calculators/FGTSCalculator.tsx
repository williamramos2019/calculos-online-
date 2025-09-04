import React, { useState, useEffect } from 'react'
import AdSenseUnit from '../../components/ads/AdSenseUnit'

interface FGTSResult {
  salary: number
  monthlyDeposit: number
  yearlyDeposit: number
}

const FGTSCalculator: React.FC = () => {
  const [salary, setSalary] = useState<string>('')
  const [result, setResult] = useState<FGTSResult | null>(null)

  // Definir meta tags dinamicamente
  useEffect(() => {
    document.title = 'Calculadora FGTS 2025 - Calcule o Depósito Mensal'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Calculadora FGTS 2025. Calcule quanto o empregador deposita mensalmente na sua conta do FGTS baseado no salário bruto.'
    )
  }, [])

  const calculateFGTS = () => {
    if (!salary || parseFloat(salary) <= 0) return

    const salaryValue = parseFloat(salary)
    
    // FGTS é sempre 8% do salário bruto
    const monthlyDeposit = salaryValue * 0.08
    const yearlyDeposit = monthlyDeposit * 12

    setResult({
      salary: salaryValue,
      monthlyDeposit,
      yearlyDeposit
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Calculadora FGTS 2025
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calcule o valor que o empregador deposita mensalmente na sua conta do FGTS.
        </p>
      </div>

      {/* AdSense após o título */}
      <div className="mb-8">
        <AdSenseUnit 
          slot="fgts-top"
          format="horizontal"
          className="text-center"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="calculator-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados para Cálculo</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salário Bruto (R$)
              </label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Ex: 3000.00"
                className="input-field"
                step="0.01"
                min="0"
              />
            </div>
            
            <button
              onClick={calculateFGTS}
              disabled={!salary}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calcular FGTS
            </button>
          </div>
        </div>

        {/* Resultados */}
        {result && (
          <div className="calculator-card bg-green-50 border border-green-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultados</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Salário Bruto:</span>
                <span className="font-semibold text-lg">{formatCurrency(result.salary)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Depósito Mensal:</span>
                <span className="font-semibold text-lg text-green-600">
                  {formatCurrency(result.monthlyDeposit)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Depósito Anual:</span>
                <span className="font-semibold text-lg text-green-600">
                  {formatCurrency(result.yearlyDeposit)}
                </span>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg mt-4">
                <p className="text-sm text-green-800">
                  <strong>Lembre-se:</strong> O FGTS é depositado pelo empregador, 
                  não é descontado do seu salário.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AdSense entre conteúdo e informações */}
      <div className="my-12">
        <AdSenseUnit 
          slot="fgts-middle"
          format="rectangle"
          className="text-center"
        />
      </div>

      {/* Informações sobre FGTS */}
      <div className="calculator-card mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Como funciona o FGTS?</h2>
        
        <div className="space-y-4 text-gray-600">
          <p>
            O FGTS (Fundo de Garantia do Tempo de Serviço) é um direito dos trabalhadores regidos pela CLT. 
            O empregador deve depositar mensalmente 8% do salário bruto na conta do FGTS do funcionário.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Principais características:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Alíquota fixa de 8% sobre o salário bruto</li>
              <li>Depositado pelo empregador, não descontado do salário</li>
              <li>Rendimento de 3% ao ano + TR (Taxa Referencial)</li>
              <li>Pode ser sacado em situações específicas (demissão, casa própria, etc.)</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Quando posso sacar?</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Demissão sem justa causa</li>
              <li>Término do contrato por prazo determinado</li>
              <li>Aposentadoria</li>
              <li>Compra da casa própria (primeira aquisição)</li>
              <li>Doenças graves</li>
              <li>Situações de emergência (calamidade pública)</li>
            </ul>
          </div>
          
          <p>
            <strong>Dica:</strong> O FGTS é uma reserva importante para situações de emergência 
            e também pode ser usado como entrada para financiar a casa própria.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FGTSCalculator