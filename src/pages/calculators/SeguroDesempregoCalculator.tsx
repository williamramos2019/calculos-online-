import React, { useState, useEffect } from 'react'
import AdSenseUnit from '../../components/ads/AdSenseUnit'
import SEOHead from '../../components/seo/SEOHead'

interface SeguroData {
  salarios: number[]
  tempoTrabalhado: number
  vezesRecebeu: number
}

interface SeguroResult {
  valorParcela: number
  numeroParcelas: number
  valorTotal: number
  mediasSalariais: number
  observacoes: string[]
}

const SeguroDesempregoCalculator: React.FC = () => {
  const [dados, setDados] = useState<SeguroData>({
    salarios: [0, 0, 0],
    tempoTrabalhado: 0,
    vezesRecebeu: 0
  })
  
  const [resultado, setResultado] = useState<SeguroResult | null>(null)

  useEffect(() => {
    document.title = 'Calculadora de Seguro-Desemprego 2025 - Valor e Parcelas'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Calculadora de seguro-desemprego 2025. Calcule o valor das parcelas e quantidade baseado nos últimos salários e tempo trabalhado.')
    }
  }, [])

  const calcularSeguro = () => {
    if (dados.salarios.some(s => s <= 0) || dados.tempoTrabalhado <= 0) return

    // Verificar direito ao seguro
    const tempoMinimoMeses = dados.vezesRecebeu === 0 ? 12 : dados.vezesRecebeu === 1 ? 9 : 6
    
    if (dados.tempoTrabalhado < tempoMinimoMeses) {
      alert(`Tempo mínimo necessário: ${tempoMinimoMeses} meses`)
      return
    }

    // Calcular média dos últimos 3 salários
    const mediaSalarial = dados.salarios.reduce((acc, sal) => acc + sal, 0) / 3

    // Determinar número de parcelas baseado no tempo trabalhado
    let numeroParcelas = 0
    if (dados.tempoTrabalhado >= 6 && dados.tempoTrabalhado < 12) {
      numeroParcelas = 3
    } else if (dados.tempoTrabalhado >= 12 && dados.tempoTrabalhado < 24) {
      numeroParcelas = 4
    } else if (dados.tempoTrabalhado >= 24) {
      numeroParcelas = 5
    }

    // Primeira solicitação tem direito a todas as parcelas
    if (dados.vezesRecebeu === 0) {
      // Mantém as parcelas calculadas acima
    } else if (dados.vezesRecebeu === 1) {
      numeroParcelas = Math.min(numeroParcelas, 4) // Máximo 4 parcelas
    } else {
      numeroParcelas = Math.min(numeroParcelas, 3) // Máximo 3 parcelas
    }

    // Calcular valor da parcela (2025)
    const salarioMinimo = 1412.00 // Salário mínimo 2025
    const valorParcela = Math.max(
      salarioMinimo, // Mínimo
      Math.min(mediaSalarial * 0.8, salarioMinimo * 3) // 80% da média, limitado a 3 salários mínimos
    )

    const valorTotal = valorParcela * numeroParcelas

    // Observações importantes
    const observacoes = []
    if (dados.vezesRecebeu > 0) {
      observacoes.push(`${dados.vezesRecebeu}ª solicitação - número de parcelas pode ser reduzido`)
    }
    if (valorParcela === salarioMinimo) {
      observacoes.push('Valor limitado ao salário mínimo')
    }
    if (valorParcela === salarioMinimo * 3) {
      observacoes.push('Valor limitado ao teto máximo (3 salários mínimos)')
    }
    observacoes.push('Prazo para requerer: até 120 dias após a demissão')
    observacoes.push('Benefício pago pela Caixa Econômica Federal')

    setResultado({
      valorParcela,
      numeroParcelas,
      valorTotal,
      mediasSalariais: mediaSalarial,
      observacoes
    })
  }

  const atualizarSalario = (index: number, valor: string) => {
    const novosSalarios = [...dados.salarios]
    novosSalarios[index] = parseFloat(valor) || 0
    setDados({...dados, salarios: novosSalarios})
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SEOHead
        title="Calculadora de Seguro-Desemprego 2025"
        description="Calculadora de seguro-desemprego 2025. Calcule o valor das parcelas e quantidade baseado nos últimos salários."
        keywords="seguro desemprego, auxílio desemprego, CAIXA, parcelas seguro desemprego, valor seguro desemprego"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Calculadora de Seguro-Desemprego
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Calcule o valor e número de parcelas do seguro-desemprego baseado nos seus últimos salários 
          e tempo de trabalho formal.
        </p>
      </div>

      <div className="mb-8">
        <AdSenseUnit 
          slot="seguro-top"
          format="horizontal"
          className="text-center"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="calculator-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados Trabalhistas</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Últimos 3 salários (do mais recente para o mais antigo)
              </label>
              
              <div className="space-y-2">
                {dados.salarios.map((salario, index) => (
                  <div key={index}>
                    <label className="block text-xs text-gray-500 mb-1">
                      {index === 0 ? 'Último salário' : index === 1 ? 'Penúltimo salário' : 'Antepenúltimo salário'}
                    </label>
                    <input
                      type="number"
                      value={salario || ''}
                      onChange={(e) => atualizarSalario(index, e.target.value)}
                      placeholder="Ex: 2500.00"
                      className="input-field"
                      step="0.01"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo trabalhado (meses)
              </label>
              <input
                type="number"
                value={dados.tempoTrabalhado || ''}
                onChange={(e) => setDados({...dados, tempoTrabalhado: parseInt(e.target.value) || 0})}
                placeholder="Ex: 18"
                className="input-field"
                min="0"
                max="120"
              />
              <p className="text-xs text-gray-500 mt-1">
                Considere apenas o tempo com carteira assinada nos últimos 36 meses
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantas vezes já recebeu seguro-desemprego?
              </label>
              <select
                value={dados.vezesRecebeu}
                onChange={(e) => setDados({...dados, vezesRecebeu: parseInt(e.target.value)})}
                className="input-field"
              >
                <option value={0}>Primeira vez</option>
                <option value={1}>Segunda vez</option>
                <option value={2}>Terceira vez ou mais</option>
              </select>
            </div>
            
            <button
              onClick={calcularSeguro}
              disabled={dados.salarios.some(s => s <= 0) || dados.tempoTrabalhado <= 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calcular Seguro-Desemprego
            </button>
          </div>
        </div>

        {resultado && (
          <div className="calculator-card bg-blue-50 border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultado do Seguro</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Média salarial:</p>
                <p className="font-medium">{formatCurrency(resultado.mediasSalariais)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor por parcela:</span>
                  <span className="font-semibold text-blue-600 text-lg">
                    {formatCurrency(resultado.valorParcela)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Número de parcelas:</span>
                  <span className="font-semibold text-lg">
                    {resultado.numeroParcelas}x
                  </span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold">Total a receber:</span>
                    <span className="font-bold text-xl text-green-600">
                      {formatCurrency(resultado.valorTotal)}
                    </span>
                  </div>
                </div>

                {resultado.observacoes.length > 0 && (
                  <div className="bg-yellow-50 p-3 rounded-lg mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Observações importantes:</h4>
                    <ul className="space-y-1">
                      {resultado.observacoes.map((obs, index) => (
                        <li key={index} className="text-xs text-gray-700">
                          • {obs}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="my-12">
        <AdSenseUnit 
          slot="seguro-middle"
          format="rectangle"
          className="text-center"
        />
      </div>

      <div className="calculator-card mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Como funciona o Seguro-Desemprego?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quem tem direito:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Trabalhadores demitidos sem justa causa</li>
              <li>Mínimo de 12 meses trabalhados (1ª solicitação)</li>
              <li>Mínimo de 9 meses trabalhados (2ª solicitação)</li>
              <li>Mínimo de 6 meses trabalhados (3ª+ solicitação)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Como calcular:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Média dos últimos 3 salários</li>
              <li>Valor = 80% da média salarial</li>
              <li>Mínimo: 1 salário mínimo</li>
              <li>Máximo: 3 salários mínimos</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Número de parcelas:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>6 a 11 meses: 3 parcelas</li>
              <li>12 a 23 meses: 4 parcelas</li>
              <li>24+ meses: 5 parcelas</li>
              <li>Reduzido em solicitações subsequentes</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Como solicitar:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>App Carteira de Trabalho Digital</li>
              <li>Portal gov.br</li>
              <li>Agências da CAIXA</li>
              <li>Prazo: até 120 dias após demissão</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeguroDesempregoCalculator