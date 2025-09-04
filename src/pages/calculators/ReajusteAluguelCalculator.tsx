import React, { useState, useEffect } from 'react'
import AdSenseUnit from '../../components/ads/AdSenseUnit'
import SEOHead from '../../components/seo/SEOHead'

interface ReajusteData {
  valorAtual: number
  dataInicio: string
  dataReajuste: string
  indice: 'IGP-M' | 'IPCA' | 'INPC' | 'IPCF'
}

interface ReajusteResult {
  valorOriginal: number
  novoValor: number
  aumentoValor: number
  percentualReajuste: number
  periodo: string
  proximoReajuste: string
}

const ReajusteAluguelCalculator: React.FC = () => {
  const [dados, setDados] = useState<ReajusteData>({
    valorAtual: 0,
    dataInicio: '',
    dataReajuste: '',
    indice: 'IGP-M'
  })
  
  const [resultado, setResultado] = useState<ReajusteResult | null>(null)

  useEffect(() => {
    document.title = 'Calculadora de Reajuste de Aluguel 2025 - IGP-M, IPCA'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Calculadora de reajuste de aluguel usando IGP-M, IPCA e outros índices. Calcule o novo valor do aluguel conforme a legislação.')
    }
  }, [])

  // Simulação de índices para demonstração
  const obterVariacaoIndice = (indice: string, dataInicio: string, dataReajuste: string): number => {
    const variacoes: {[key: string]: number} = {
      'IGP-M': 3.64,
      'IPCA': 4.62,
      'INPC': 4.77,
      'IPCF': 4.45
    }
    
    const inicio = new Date(dataInicio)
    const reajuste = new Date(dataReajuste)
    const meses = (reajuste.getFullYear() - inicio.getFullYear()) * 12 + (reajuste.getMonth() - inicio.getMonth())
    
    const variacaoAnual = variacoes[indice] || 0
    return Math.max(0, (variacaoAnual / 12) * meses)
  }

  const calcularReajuste = () => {
    if (!dados.valorAtual || !dados.dataInicio || !dados.dataReajuste) return

    const inicio = new Date(dados.dataInicio)
    const reajuste = new Date(dados.dataReajuste)
    
    if (reajuste <= inicio) {
      alert('A data de reajuste deve ser posterior à data de início do contrato')
      return
    }

    // Verificar se já se passou 1 ano
    const umAnoDepois = new Date(inicio)
    umAnoDepois.setFullYear(umAnoDepois.getFullYear() + 1)
    
    if (reajuste < umAnoDepois) {
      alert('O reajuste só pode ser feito após 12 meses do início do contrato ou último reajuste')
      return
    }

    const percentualReajuste = obterVariacaoIndice(dados.indice, dados.dataInicio, dados.dataReajuste)
    const aumentoValor = dados.valorAtual * (percentualReajuste / 100)
    const novoValor = dados.valorAtual + aumentoValor

    // Próximo reajuste (1 ano após a data atual)
    const proximoReajuste = new Date(reajuste)
    proximoReajuste.setFullYear(proximoReajuste.getFullYear() + 1)

    const periodo = `${inicio.toLocaleDateString('pt-BR')} a ${reajuste.toLocaleDateString('pt-BR')}`

    setResultado({
      valorOriginal: dados.valorAtual,
      novoValor,
      aumentoValor,
      percentualReajuste,
      periodo,
      proximoReajuste: proximoReajuste.toLocaleDateString('pt-BR')
    })
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
        title="Calculadora de Reajuste de Aluguel 2025"
        description="Calculadora de reajuste de aluguel usando IGP-M, IPCA e outros índices. Calcule o novo valor conforme a legislação."
        keywords="reajuste aluguel, IGP-M, IPCA, lei inquilinato, aluguel reajuste, índice aluguel"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Calculadora de Reajuste de Aluguel
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Calcule o reajuste do aluguel usando índices oficiais como IGP-M, IPCA, INPC. 
          Conforme a Lei do Inquilinato (Lei 8.245/91).
        </p>
      </div>

      <div className="mb-8">
        <AdSenseUnit 
          slot="aluguel-top"
          format="horizontal"
          className="text-center"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="calculator-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados do Contrato</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Atual do Aluguel (R$)
              </label>
              <input
                type="number"
                value={dados.valorAtual || ''}
                onChange={(e) => setDados({...dados, valorAtual: parseFloat(e.target.value) || 0})}
                placeholder="Ex: 1500.00"
                className="input-field"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início do Contrato (ou último reajuste)
              </label>
              <input
                type="date"
                value={dados.dataInicio}
                onChange={(e) => setDados({...dados, dataInicio: e.target.value})}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data do Reajuste
              </label>
              <input
                type="date"
                value={dados.dataReajuste}
                onChange={(e) => setDados({...dados, dataReajuste: e.target.value})}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Índice de Reajuste
              </label>
              <select
                value={dados.indice}
                onChange={(e) => setDados({...dados, indice: e.target.value as any})}
                className="input-field"
              >
                <option value="IGP-M">IGP-M (mais comum para aluguéis)</option>
                <option value="IPCA">IPCA (índice oficial de inflação)</option>
                <option value="INPC">INPC (faixa de renda 1-5 salários)</option>
                <option value="IPCF">IPCF (faixa de renda 1-33 salários)</option>
              </select>
            </div>
            
            <button
              onClick={calcularReajuste}
              disabled={!dados.valorAtual || !dados.dataInicio || !dados.dataReajuste}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calcular Reajuste
            </button>
          </div>
        </div>

        {resultado && (
          <div className="calculator-card bg-orange-50 border border-orange-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultado do Reajuste</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Período considerado:</p>
                <p className="font-medium">{resultado.periodo}</p>
                <p className="text-sm text-gray-600 mt-2">Índice: {dados.indice}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor Atual:</span>
                  <span className="font-semibold">{formatCurrency(resultado.valorOriginal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Percentual de Reajuste:</span>
                  <span className="font-semibold text-orange-600">
                    {resultado.percentualReajuste.toFixed(2)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aumento:</span>
                  <span className="font-semibold text-red-600">
                    +{formatCurrency(resultado.aumentoValor)}
                  </span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold">Novo Valor:</span>
                    <span className="font-bold text-xl text-green-600">
                      {formatCurrency(resultado.novoValor)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-100 p-3 rounded-lg mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Próximo reajuste:</strong> A partir de {resultado.proximoReajuste}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="my-12">
        <AdSenseUnit 
          slot="aluguel-middle"
          format="rectangle"
          className="text-center"
        />
      </div>

      <div className="calculator-card mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lei do Inquilinato - Reajuste de Aluguel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Regras gerais:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Reajuste anual após 12 meses do contrato</li>
              <li>Deve seguir índice acordado no contrato</li>
              <li>IGP-M é o mais usado para aluguéis</li>
              <li>Notificação com 30 dias de antecedência</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Índices mais usados:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li><strong>IGP-M:</strong> Mais comum para aluguéis</li>
              <li><strong>IPCA:</strong> Inflação oficial do país</li>
              <li><strong>INPC:</strong> Para contratos sociais</li>
              <li><strong>IPCF:</strong> Alternativa ao INPC</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Direitos do inquilino:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Receber notificação prévia</li>
              <li>Contestar índice incorreto</li>
              <li>Exigir comprovação do cálculo</li>
              <li>Buscar revisão se necessário</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Dicas importantes:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Verifique o índice no contrato</li>
              <li>Confirme as datas corretas</li>
              <li>Consulte fontes oficiais dos índices</li>
              <li>Guarde comprovantes do cálculo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReajusteAluguelCalculator