import React, { useState, useEffect } from 'react'
import AdSenseUnit from '../../components/ads/AdSenseUnit'

interface IRRFResult {
  salary: number
  inssDeduction: number
  dependentsDeduction: number
  taxableIncome: number
  irrf: number
  effectiveRate: number
  netSalary: number
}

const IRRFCalculator: React.FC = () => {
  const [salary, setSalary] = useState<string>('')
  const [dependents, setDependents] = useState<string>('0')
  const [result, setResult] = useState<IRRFResult | null>(null)

  // Definir meta tags dinamicamente
  useEffect(() => {
    document.title = 'Calculadora IRRF 2025 - Imposto de Renda Retido na Fonte'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Calculadora IRRF 2025. Calcule o Imposto de Renda Retido na Fonte sobre salários conforme a tabela atualizada.'
    )
  }, [])

  const calculateIRRF = () => {
    if (!salary || parseFloat(salary) <= 0) return

    const salaryValue = parseFloat(salary)
    const dependentsCount = parseInt(dependents) || 0
    
    // Cálculo INSS primeiro (necessário para base de cálculo do IRRF)
    const inssDeduction = calculateINSSDeduction(salaryValue)
    
    // Dedução por dependente (2025)
    const dependentsDeduction = dependentsCount * 189.59
    
    // Base de cálculo do IRRF
    const taxableIncome = salaryValue - inssDeduction - dependentsDeduction
    
    // Cálculo do IRRF com tabela progressiva 2025
    let irrf = 0
    let effectiveRate = 0
    
    if (taxableIncome <= 2112.00) {
      irrf = 0
    } else if (taxableIncome <= 2826.65) {
      irrf = (taxableIncome * 0.075) - 158.40
    } else if (taxableIncome <= 3751.05) {
      irrf = (taxableIncome * 0.15) - 370.40
    } else if (taxableIncome <= 4664.68) {
      irrf = (taxableIncome * 0.225) - 651.73
    } else {
      irrf = (taxableIncome * 0.275) - 884.96
    }
    
    irrf = Math.max(0, irrf)
    effectiveRate = salaryValue > 0 ? (irrf / salaryValue) * 100 : 0
    
    const netSalary = salaryValue - inssDeduction - irrf

    setResult({
      salary: salaryValue,
      inssDeduction,
      dependentsDeduction,
      taxableIncome,
      irrf,
      effectiveRate,
      netSalary
    })
  }

  const calculateINSSDeduction = (salaryValue: number): number => {
    const brackets = [
      { min: 0, max: 1412.00, rate: 0.075 },
      { min: 1412.01, max: 2666.68, rate: 0.09 },
      { min: 2666.69, max: 4000.03, rate: 0.12 },
      { min: 4000.04, max: 7786.02, rate: 0.14 }
    ]

    let totalContribution = 0

    for (const bracket of brackets) {
      if (salaryValue > bracket.min) {
        const taxableAmount = Math.min(salaryValue, bracket.max) - bracket.min + (bracket.min === 0 ? 0 : 0.01)
        totalContribution += taxableAmount * bracket.rate
      }
    }

    return totalContribution
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
          Calculadora IRRF 2025
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calcule o Imposto de Renda Retido na Fonte sobre salários conforme a tabela atualizada para 2025.
        </p>
      </div>

      {/* AdSense após o título */}
      <div className="mb-8">
        <AdSenseUnit 
          slot="irrf-top"
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
                placeholder="Ex: 5000.00"
                className="input-field"
                step="0.01"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Dependentes
              </label>
              <select
                value={dependents}
                onChange={(e) => setDependents(e.target.value)}
                className="input-field"
              >
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i.toString()}>{i}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={calculateIRRF}
              disabled={!salary}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calcular IRRF
            </button>
          </div>
        </div>

        {/* Resultados */}
        {result && (
          <div className="calculator-card bg-orange-50 border border-orange-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultados</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Salário Bruto:</span>
                <span className="font-semibold">{formatCurrency(result.salary)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">(-) Desconto INSS:</span>
                <span className="text-red-600">-{formatCurrency(result.inssDeduction)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">(-) Dependentes:</span>
                <span className="text-red-600">-{formatCurrency(result.dependentsDeduction)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base de Cálculo:</span>
                  <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Imposto de Renda:</span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(result.irrf)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Alíquota Efetiva:</span>
                <span className="font-semibold">{result.effectiveRate.toFixed(2)}%</span>
              </div>
              
              <div className="border-t pt-3">
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
          slot="irrf-middle"
          format="rectangle"
          className="text-center"
        />
      </div>

      {/* Informações sobre IRRF */}
      <div className="calculator-card mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Como funciona o IRRF em 2025?</h2>
        
        <div className="space-y-4 text-gray-600">
          <p>
            O IRRF (Imposto de Renda Retido na Fonte) é calculado sobre a base tributável, 
            que é o salário bruto menos as deduções permitidas (INSS e dependentes).
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Tabela IRRF 2025:</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-4 font-medium border-b pb-2">
                <span>Base de Cálculo</span>
                <span>Alíquota</span>
                <span>Dedução</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span>Até R$ 2.112,00</span>
                <span>Isento</span>
                <span>-</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span>R$ 2.112,01 a R$ 2.826,65</span>
                <span>7,5%</span>
                <span>R$ 158,40</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span>R$ 2.826,66 a R$ 3.751,05</span>
                <span>15%</span>
                <span>R$ 370,40</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span>R$ 3.751,06 a R$ 4.664,68</span>
                <span>22,5%</span>
                <span>R$ 651,73</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span>Acima de R$ 4.664,68</span>
                <span>27,5%</span>
                <span>R$ 884,96</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Deduções permitidas:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Contribuição para o INSS (calculada automaticamente)</li>
              <li>R$ 189,59 por dependente (valor para 2025)</li>
              <li>Pensão alimentícia judicial</li>
              <li>Contribuição para previdência privada (até o limite)</li>
            </ul>
          </div>
          
          <p>
            <strong>Importante:</strong> Este cálculo considera apenas as deduções básicas 
            (INSS e dependentes). Para um cálculo mais preciso, consulte um contador.
          </p>
        </div>
      </div>
    </div>
  )
}

export default IRRFCalculator