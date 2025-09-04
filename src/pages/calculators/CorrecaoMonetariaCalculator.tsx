import React, { useState, useEffect } from 'react'
import AdSenseUnit from '../../components/ads/AdSenseUnit'
import SEOHead from '../../components/seo/SEOHead'

interface CorrecaoData {
  valor: number
  dataInicial: string
  dataFinal: string
  indice: 'IPCA' | 'INPC' | 'IGP-M' | 'IGP-DI' | 'CDI' | 'SELIC'
  juros: number
  aplicarJuros: boolean
}

interface CorrecaoResult {
  valorOriginal: number
  valorCorrigido: number
  valorJuros: number
  valorTotal: number
  variacao: number
  taxaJuros: number
  periodo: string
}

const CorrecaoMonetariaCalculator: React.FC = () => {
  const [dados, setDados] = useState<CorrecaoData>({
    valor: 0,
    dataInicial: '',
    dataFinal: '',
    indice: 'IPCA',
    juros: 1.0,
    aplicarJuros: false
  })
  
  const [resultado, setResultado] = useState<CorrecaoResult | null>(null)

  useEffect(() => {
    document.title = 'Calculadora de Correção Monetária 2025 - IPCA, INPC, IGP-M'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Calculadora de correção monetária com índices oficiais: IPCA, INPC, IGP-M, CDI, SELIC. Atualize valores com precisão e aplique juros.')
    }
  }, [])

  const [loadingIndice, setLoadingIndice] = useState(false)

  // Obter variação real do índice usando API do Banco Central
  const obterVariacaoIndice = async (indice: string, dataInicial: string, dataFinal: string): Promise<number> => {
    setLoadingIndice(true)
    try {
      const { ApiService } = await import('../../services/apiService')
      const variacao = await ApiService.calcularVariacaoIndice(indice, dataInicial, dataFinal)
      return variacao || 0
    } catch (error) {
      console.error('Erro ao obter variação do índice:', error)
      // Fallback com valores aproximados
      const variacoes: {[key: string]: number} = {
        'IPCA': 4.62,
        'INPC': 4.77,
        'IGP-M': 3.64,
        'CDI': 10.75,
        'SELIC': 11.25
      }
      
      const inicial = new Date(dataInicial)
      const final = new Date(dataFinal)
      const meses = (final.getFullYear() - inicial.getFullYear()) * 12 + (final.getMonth() - inicial.getMonth())
      
      const variacaoAnual = variacoes[indice] || 0
      return (variacaoAnual / 12) * meses
    } finally {
      setLoadingIndice(false)
    }
  }

  const calcularCorrecao = async () => {
    if (!dados.valor || !dados.dataInicial || !dados.dataFinal) return

    const inicial = new Date(dados.dataInicial)
    const final = new Date(dados.dataFinal)
    
    if (final <= inicial) {
      alert('A data final deve ser posterior à data inicial')
      return
    }

    // Obter variação do índice (agora assíncrona)
    const variacao = await obterVariacaoIndice(dados.indice, dados.dataInicial, dados.dataFinal)
    
    // Aplicar correção monetária
    const valorCorrigido = dados.valor * (1 + variacao / 100)
    
    // Calcular juros se aplicável
    let valorJuros = 0
    let valorTotal = valorCorrigido
    
    if (dados.aplicarJuros && dados.juros > 0) {
      const diasPeriodo = Math.ceil((final.getTime() - inicial.getTime()) / (1000 * 60 * 60 * 24))
      const jurosMensais = dados.juros / 100
      const meses = diasPeriodo / 30
      
      valorJuros = valorCorrigido * Math.pow(1 + jurosMensais, meses) - valorCorrigido
      valorTotal = valorCorrigido + valorJuros
    }

    const periodo = `${inicial.toLocaleDateString('pt-BR')} a ${final.toLocaleDateString('pt-BR')}`

    setResultado({
      valorOriginal: dados.valor,
      valorCorrigido,
      valorJuros,
      valorTotal,
      variacao,
      taxaJuros: dados.juros,
      periodo
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SEOHead
        title="Calculadora de Correção Monetária 2025"
        description="Calculadora de correção monetária com índices oficiais: IPCA, INPC, IGP-M, CDI, SELIC. Atualize valores com precisão."
        keywords="correção monetária, IPCA, INPC, IGP-M, CDI, SELIC, atualização monetária, índices econômicos"
      />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Calculadora de Correção Monetária
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Atualize valores monetários usando índices oficiais como IPCA, INPC, IGP-M, CDI e SELIC. 
          Adicione juros compostos para cálculos mais precisos.
        </p>
      </div>

      {/* AdSense após o título */}
      <div className="mb-8">
        <AdSenseUnit 
          slot="correcao-top"
          format="horizontal"
          className="text-center"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="calculator-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados para Correção</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Original (R$)
              </label>
              <input
                type="number"
                value={dados.valor || ''}
                onChange={(e) => setDados({...dados, valor: parseFloat(e.target.value) || 0})}
                placeholder="Ex: 1000.00"
                className="input-field"
                step="0.01"
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dados.dataInicial}
                  onChange={(e) => setDados({...dados, dataInicial: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dados.dataFinal}
                  onChange={(e) => setDados({...dados, dataFinal: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Índice de Correção
              </label>
              <select
                value={dados.indice}
                onChange={(e) => setDados({...dados, indice: e.target.value as any})}
                className="input-field"
              >
                <option value="IPCA">IPCA - Índice de Preços ao Consumidor Amplo</option>
                <option value="INPC">INPC - Índice Nacional de Preços ao Consumidor</option>
                <option value="IGP-M">IGP-M - Índice Geral de Preços do Mercado</option>
                <option value="IGP-DI">IGP-DI - Índice Geral de Preços - Disponibilidade Interna</option>
                <option value="CDI">CDI - Certificado de Depósito Interbancário</option>
                <option value="SELIC">SELIC - Taxa Básica de Juros</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="aplicarJuros"
                  checked={dados.aplicarJuros}
                  onChange={(e) => setDados({...dados, aplicarJuros: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="aplicarJuros" className="text-sm font-medium text-gray-700">
                  Aplicar juros compostos
                </label>
              </div>

              {dados.aplicarJuros && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxa de Juros Mensal (%)
                  </label>
                  <input
                    type="number"
                    value={dados.juros || ''}
                    onChange={(e) => setDados({...dados, juros: parseFloat(e.target.value) || 0})}
                    placeholder="Ex: 1.0"
                    className="input-field"
                    step="0.01"
                    min="0"
                  />
                </div>
              )}
            </div>
            
            <button
              onClick={calcularCorrecao}
              disabled={!dados.valor || !dados.dataInicial || !dados.dataFinal || loadingIndice}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingIndice ? 'Buscando índices...' : 'Calcular Correção'}
            </button>
          </div>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="calculator-card bg-blue-50 border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultado da Correção</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Período:</p>
                <p className="font-medium">{resultado.periodo}</p>
                <p className="text-sm text-gray-600 mt-2">Índice: {dados.indice}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor Original:</span>
                  <span className="font-semibold">{formatCurrency(resultado.valorOriginal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Variação do Índice:</span>
                  <span className="font-semibold text-blue-600">
                    {formatPercentage(resultado.variacao)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor Corrigido:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(resultado.valorCorrigido)}
                  </span>
                </div>
                
                {dados.aplicarJuros && resultado.valorJuros > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Juros ({formatPercentage(resultado.taxaJuros)} a.m.):</span>
                      <span className="font-semibold text-orange-600">
                        {formatCurrency(resultado.valorJuros)}
                      </span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-bold">Valor Total:</span>
                        <span className="font-bold text-xl text-green-600">
                          {formatCurrency(resultado.valorTotal)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                
                {!dados.aplicarJuros && (
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-bold">Valor Atualizado:</span>
                      <span className="font-bold text-xl text-green-600">
                        {formatCurrency(resultado.valorCorrigido)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="bg-green-100 p-3 rounded-lg mt-4">
                  <p className="text-sm text-green-800">
                    <strong>Ganho real:</strong> {formatCurrency(resultado.valorTotal - resultado.valorOriginal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AdSense entre conteúdo e informações */}
      <div className="my-12">
        <AdSenseUnit 
          slot="correcao-middle"
          format="rectangle"
          className="text-center"
        />
      </div>

      {/* Informações sobre Índices */}
      <div className="calculator-card mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Entenda os Índices de Correção</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">IPCA (IBGE):</h3>
            <p className="text-sm mb-2">
              Índice oficial de inflação do Brasil. Usado para meta de inflação e contratos.
            </p>
            <p className="text-xs text-gray-500">
              Recomendado para: Contratos, financiamentos, correção geral de valores.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">IGP-M (FGV):</h3>
            <p className="text-sm mb-2">
              Muito usado em contratos de aluguel e energia elétrica.
            </p>
            <p className="text-xs text-gray-500">
              Recomendado para: Aluguéis, energia elétrica, contratos comerciais.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">CDI:</h3>
            <p className="text-sm mb-2">
              Taxa de juros do mercado interbancário, base para investimentos.
            </p>
            <p className="text-xs text-gray-500">
              Recomendado para: Investimentos, rendimentos, aplicações financeiras.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">SELIC:</h3>
            <p className="text-sm mb-2">
              Taxa básica de juros da economia brasileira, definida pelo Banco Central.
            </p>
            <p className="text-xs text-gray-500">
              Recomendado para: Dívidas tributárias, correção de débitos públicos.
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">⚠️ Aviso Importante:</h3>
          <p className="text-sm text-gray-600">
            Os valores apresentados são estimativas baseadas em dados históricos. 
            Para cálculos oficiais, consulte as fontes oficiais (IBGE, FGV, Banco Central) 
            ou um profissional habilitado.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CorrecaoMonetariaCalculator