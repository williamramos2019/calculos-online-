import React, { useState, useEffect } from 'react'
import AdSenseUnit from '../../components/ads/AdSenseUnit'

interface INSSResult {
  salary: number
  contribution: number
  percentage: number
  netSalary: number
}

const INSSCalculator: React.FC = () => {
  const [salary, setSalary] = useState<string>('')
  const [result, setResult] = useState<INSSResult | null>(null)
  const [loading, setLoading] = useState(false)

  // Definir meta tags dinamicamente
  useEffect(() => {
    document.title = 'Calculadora INSS 2025 - Calcule sua Contribuição Previdenciária'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Calculadora INSS 2025 atualizada. Calcule o desconto do INSS sobre o salário bruto conforme as alíquotas vigentes.'
    )
  }, [])

  const calculateINSS = async () => {
    if (!salary || parseFloat(salary) <= 0) return

    setLoading(true)
    try {
      // Chamada para o backend PHP
      const response = await fetch('/api/calculate-inss.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ salary: parseFloat(salary) })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Erro ao calcular INSS:', error)
      // Fallback para cálculo local se a API falhar
      const salaryValue = parseFloat(salary)
      const inssResult = calculateINSSLocal(salaryValue)
      setResult(inssResult)
    }
    setLoading(false)
  }

  // Cálculo local como fallback (valores de 2025)
  const calculateINSSLocal = (salaryValue: number): INSSResult => {
    const brackets = [
      { min: 0, max: 1412.00, rate: 0.075 },
      { min: 1412.01, max: 2666.68, rate: 0.09 },
      { min: 2666.69, max: 4000.03, rate: 0.12 },
      { min: 4000.04, max: 7786.02, rate: 0.14 }
    ]

    let totalContribution = 0
    let effectiveRate = 0

    for (const bracket of brackets) {
      if (salaryValue > bracket.min) {
        const taxableAmount = Math.min(salaryValue, bracket.max) - bracket.min + (bracket.min === 0 ? 0 : 0.01)
        totalContribution += taxableAmount * bracket.rate
      }
    }

    if (salaryValue > 0) {
      effectiveRate = (totalContribution / salaryValue) * 100
    }

    return {
      salary: salaryValue,
      contribution: totalContribution,
      percentage: effectiveRate,
      netSalary: salaryValue - totalContribution
    }
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
          Calculadora INSS 2025
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calcule o desconto do INSS sobre o salário bruto de acordo com as alíquotas atualizadas para 2025.
        </p>
      </div>

      {/* AdSense após o título */}
      <div className="mb-8">
        <AdSenseUnit 
          slot="calculator-top"
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
              onClick={calculateINSS}
              disabled={loading || !salary}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Calculando...' : 'Calcular INSS'}
            </button>
          </div>
        </div>

        {/* Resultados */}
        {result && (
          <div className="calculator-card bg-blue-50 border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultados</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Salário Bruto:</span>
                <span className="font-semibold text-lg">{formatCurrency(result.salary)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Desconto INSS:</span>
                <span className="font-semibold text-lg text-red-600">
                  -{formatCurrency(result.contribution)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Alíquota Efetiva:</span>
                <span className="font-semibold text-lg">{result.percentage.toFixed(2)}%</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">Salário Líquido:</span>
                  <span className="font-bold text-xl text-green-600">
                    {formatCurrency(result.netSalary)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AdSense entre conteúdo e informações */}
      <div className="my-12">
        <AdSenseUnit 
          slot="calculator-middle"
          format="rectangle"
          className="text-center"
        />
      </div>

      {/* Informações sobre INSS */}
      <div className="calculator-card mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Como funciona o INSS em 2025?</h2>
        
        <div className="space-y-4 text-gray-600">
          <p>
            O INSS (Instituto Nacional do Seguro Social) é uma contribuição obrigatória para todos os trabalhadores 
            com carteira assinada no Brasil. A alíquota varia de acordo com a faixa salarial.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Tabela INSS 2025:</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <span>Até R$ 1.412,00</span>
                <span className="font-medium">7,5%</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span>De R$ 1.412,01 até R$ 2.666,68</span>
                <span className="font-medium">9%</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span>De R$ 2.666,69 até R$ 4.000,03</span>
                <span className="font-medium">12%</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span>De R$ 4.000,04 até R$ 7.786,02</span>
                <span className="font-medium">14%</span>
              </div>
            </div>
          </div>
          
          <p>
            <strong>Importante:</strong> O teto de contribuição do INSS para 2025 é de R$ 7.786,02. 
            Valores acima deste limite não sofrem desconto adicional do INSS.
          </p>
        </div>
      </div>
    </div>
  )
}

export default INSSCalculator