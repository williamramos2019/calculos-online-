import React, { useState, useEffect } from 'react'
import AdSenseUnit from '../../components/ads/AdSenseUnit'
import SEOHead from '../../components/seo/SEOHead'
import { ApiService } from '../../services/apiService'

interface ConversaoData {
  valor: number
  moedaOrigem: string
  moedaDestino: string
}

interface ConversaoResult {
  valorOriginal: number
  valorConvertido: number
  taxa: number
  moedaOrigem: string
  moedaDestino: string
  dataAtualizacao: string
  variacao?: number
}

interface Cotacao {
  nome: string
  valor: number
  variacao: number
  simbolo: string
}

const ConversaoMoedaCalculator: React.FC = () => {
  const [dados, setDados] = useState<ConversaoData>({
    valor: 0,
    moedaOrigem: 'BRL',
    moedaDestino: 'USD'
  })
  
  const [resultado, setResultado] = useState<ConversaoResult | null>(null)
  const [cotacoesPrincipais, setCotacoesPrincipais] = useState<{[key: string]: Cotacao} | null>(null)
  const [loading, setLoading] = useState(false)

  const moedas = ApiService.getMoedasSuportadas()

  useEffect(() => {
    document.title = 'Conversor de Moedas Online - Cotação em Tempo Real 2025'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Conversor de moedas com cotação em tempo real. Dólar, Euro, Bitcoin e mais de 150 moedas. Dados atualizados do mercado financeiro.')
    }

    // Carregar cotações principais ao iniciar
    carregarCotacoesPrincipais()
  }, [])

  const carregarCotacoesPrincipais = async () => {
    try {
      const cotacoes = await ApiService.buscarCotacoes(['USD-BRL', 'EUR-BRL', 'BTC-BRL'])
      if (cotacoes) {
        setCotacoesPrincipais(cotacoes)
      }
    } catch (error) {
      console.error('Erro ao carregar cotações:', error)
    }
  }

  const converterMoeda = async () => {
    if (!dados.valor || dados.valor <= 0) return

    setLoading(true)
    try {
      let resultadoConversao: any = null

      if (dados.moedaOrigem === 'BRL') {
        // De Real para outra moeda - usar cotação inversa
        const cotacao = `${dados.moedaDestino}-BRL`
        const dadosCotacao = await ApiService.buscarCotacoes([cotacao])
        
        if (dadosCotacao && dadosCotacao[cotacao.replace('-', '')]) {
          const taxa = 1 / dadosCotacao[cotacao.replace('-', '')].valor
          resultadoConversao = {
            valorOriginal: dados.valor,
            valorConvertido: dados.valor * taxa,
            taxa,
            moedaOrigem: dados.moedaOrigem,
            moedaDestino: dados.moedaDestino,
            dataAtualizacao: dadosCotacao[cotacao.replace('-', '')].dataAtualizacao,
            variacao: dadosCotacao[cotacao.replace('-', '')].variacao
          }
        }
      } else if (dados.moedaDestino === 'BRL') {
        // De outra moeda para Real - usar cotação direta
        const cotacao = `${dados.moedaOrigem}-BRL`
        const dadosCotacao = await ApiService.buscarCotacoes([cotacao])
        
        if (dadosCotacao && dadosCotacao[cotacao.replace('-', '')]) {
          resultadoConversao = {
            valorOriginal: dados.valor,
            valorConvertido: dados.valor * dadosCotacao[cotacao.replace('-', '')].valor,
            taxa: dadosCotacao[cotacao.replace('-', '')].valor,
            moedaOrigem: dados.moedaOrigem,
            moedaDestino: dados.moedaDestino,
            dataAtualizacao: dadosCotacao[cotacao.replace('-', '')].dataAtualizacao,
            variacao: dadosCotacao[cotacao.replace('-', '')].variacao
          }
        }
      } else {
        // Entre duas moedas diferentes de Real - passar por BRL
        resultadoConversao = await ApiService.converterMoeda(dados.valor, dados.moedaOrigem, dados.moedaDestino)
      }

      if (resultadoConversao) {
        setResultado(resultadoConversao)
      } else {
        alert('Erro ao obter cotação. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro na conversão:', error)
      alert('Erro ao converter moeda. Verifique sua conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number, currency: string) => {
    const locale = currency === 'BRL' ? 'pt-BR' : 'en-US'
    const currencyCode = currency === 'BRL' ? 'BRL' : currency
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency === 'BTC' ? 8 : 2,
      maximumFractionDigits: currency === 'BTC' ? 8 : 2
    }).format(value)
  }

  const getMoedaNome = (codigo: string) => {
    if (codigo === 'BRL') return 'Real Brasileiro'
    const moeda = moedas.find(m => m.codigo === codigo)
    return moeda?.nome || codigo
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SEOHead
        title="Conversor de Moedas Online - Cotação Tempo Real"
        description="Conversor de moedas com cotação em tempo real. Dólar, Euro, Bitcoin e mais moedas. Dados atualizados."
        keywords="conversor moedas, cotação dólar, cotação euro, bitcoin, câmbio, conversão moeda"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Conversor de Moedas
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Converta entre Real, Dólar, Euro, Bitcoin e outras moedas com cotações atualizadas em tempo real.
        </p>
      </div>

      {/* Cotações Principais */}
      {cotacoesPrincipais && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(cotacoesPrincipais).map(([key, cotacao]) => (
            <div key={key} className="bg-white rounded-lg border p-4 text-center">
              <h3 className="font-semibold text-gray-900">{cotacao.simbolo}/BRL</h3>
              <p className="text-2xl font-bold text-blue-600">
                R$ {cotacao.valor.toFixed(cotacao.simbolo === '₿' ? 0 : 4)}
              </p>
              <p className={`text-sm ${cotacao.variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cotacao.variacao >= 0 ? '+' : ''}{cotacao.variacao.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-8">
        <AdSenseUnit 
          slot="conversao-top"
          format="horizontal"
          className="text-center"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="calculator-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Converter Moeda</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor a Converter
              </label>
              <input
                type="number"
                value={dados.valor || ''}
                onChange={(e) => setDados({...dados, valor: parseFloat(e.target.value) || 0})}
                placeholder="Ex: 1000"
                className="input-field"
                step="0.01"
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  De
                </label>
                <select
                  value={dados.moedaOrigem}
                  onChange={(e) => setDados({...dados, moedaOrigem: e.target.value})}
                  className="input-field"
                >
                  <option value="BRL">BRL - Real Brasileiro</option>
                  {moedas.map(moeda => (
                    <option key={moeda.codigo} value={moeda.codigo}>
                      {moeda.codigo} - {moeda.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para
                </label>
                <select
                  value={dados.moedaDestino}
                  onChange={(e) => setDados({...dados, moedaDestino: e.target.value})}
                  className="input-field"
                >
                  <option value="BRL">BRL - Real Brasileiro</option>
                  {moedas.map(moeda => (
                    <option key={moeda.codigo} value={moeda.codigo}>
                      {moeda.codigo} - {moeda.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={converterMoeda}
                disabled={!dados.valor || dados.valor <= 0 || loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Convertendo...' : 'Converter'}
              </button>
              
              <button
                onClick={() => setDados({
                  ...dados,
                  moedaOrigem: dados.moedaDestino,
                  moedaDestino: dados.moedaOrigem
                })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Inverter moedas"
              >
                ⇄
              </button>
            </div>
          </div>
        </div>

        {resultado && (
          <div className="calculator-card bg-green-50 border border-green-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultado da Conversão</h2>
            
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  {formatCurrency(resultado.valorOriginal, resultado.moedaOrigem)}
                </p>
                <p className="text-gray-500 text-sm mb-2">=</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(resultado.valorConvertido, resultado.moedaDestino)}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Detalhes da Conversão:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Taxa de câmbio: 1 {resultado.moedaOrigem} = {resultado.taxa.toFixed(8)} {resultado.moedaDestino}</p>
                  <p>Última atualização: {resultado.dataAtualizacao}</p>
                  {resultado.variacao !== undefined && (
                    <p className={resultado.variacao >= 0 ? 'text-green-600' : 'text-red-600'}>
                      Variação: {resultado.variacao >= 0 ? '+' : ''}{resultado.variacao.toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Cotações fornecidas pela AwesomeAPI • Dados em tempo real
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="my-12">
        <AdSenseUnit 
          slot="conversao-middle"
          format="rectangle"
          className="text-center"
        />
      </div>

      <div className="calculator-card mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sobre as Cotações</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Moedas Principais:</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>USD:</strong> Dólar americano - moeda de referência mundial</li>
              <li><strong>EUR:</strong> Euro - moeda oficial da União Europeia</li>
              <li><strong>BTC:</strong> Bitcoin - principal criptomoeda</li>
              <li><strong>GBP:</strong> Libra esterlina - moeda do Reino Unido</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Informações Importantes:</h3>
            <ul className="space-y-2 text-sm">
              <li>• Cotações atualizadas em tempo real</li>
              <li>• Dados obtidos de fontes confiáveis do mercado</li>
              <li>• Para uso informativo e educacional</li>
              <li>• Consulte corretoras para operações oficiais</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversaoMoedaCalculator