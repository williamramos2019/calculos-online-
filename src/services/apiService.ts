// Serviço centralizado para APIs brasileiras gratuitas
export class ApiService {
  private static readonly BANCO_CENTRAL_BASE = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs'
  private static readonly AWESOME_API_BASE = 'https://economia.awesomeapi.com.br'
  private static readonly VIACEP_BASE = 'https://viacep.com.br/ws'

  // Códigos das séries do Banco Central
  private static readonly SERIES_CODES = {
    SELIC: '11',
    CDI: '12', 
    IPCA: '433',
    IGP_M: '189',
    SELIC_META: '432',
    INPC: '188'
  }

  /**
   * Busca índices econômicos do Banco Central
   */
  static async buscarIndiceEconomico(indice: string, ultimosValores: number = 12) {
    try {
      const codigo = this.SERIES_CODES[indice as keyof typeof this.SERIES_CODES]
      if (!codigo) throw new Error('Índice não encontrado')

      const url = `${this.BANCO_CENTRAL_BASE}.${codigo}/dados/ultimos/${ultimosValores}?formato=json`
      const response = await fetch(url)
      
      if (!response.ok) throw new Error('Erro ao buscar dados do BC')
      
      const data = await response.json()
      return data.map((item: any) => ({
        data: item.data,
        valor: parseFloat(item.valor)
      }))
    } catch (error) {
      console.error('Erro API Banco Central:', error)
      return null
    }
  }

  /**
   * Calcula variação percentual acumulada de um índice entre datas
   */
  static async calcularVariacaoIndice(indice: string, dataInicial: string, dataFinal: string) {
    try {
      const codigo = this.SERIES_CODES[indice as keyof typeof this.SERIES_CODES]
      if (!codigo) throw new Error('Índice não encontrado')

      // Formatar datas para dd/MM/yyyy
      const formatarData = (data: string) => {
        const [ano, mes, dia] = data.split('-')
        return `${dia}/${mes}/${ano}`
      }

      const url = `${this.BANCO_CENTRAL_BASE}.${codigo}/dados?formato=json&dataInicial=${formatarData(dataInicial)}&dataFinal=${formatarData(dataFinal)}`
      const response = await fetch(url)
      
      if (!response.ok) throw new Error('Erro ao buscar dados do BC')
      
      const data = await response.json()
      
      if (data.length === 0) return null

      // Calcular variação acumulada
      let variacaoAcumulada = 1
      data.forEach((item: any) => {
        const valor = parseFloat(item.valor)
        if (!isNaN(valor)) {
          variacaoAcumulada *= (1 + valor / 100)
        }
      })
      
      return (variacaoAcumulada - 1) * 100 // Retorna em percentual
    } catch (error) {
      console.error('Erro ao calcular variação:', error)
      return null
    }
  }

  /**
   * Busca cotações de moedas e criptomoedas
   */
  static async buscarCotacoes(moedas: string[] = ['USD-BRL', 'EUR-BRL', 'BTC-BRL']) {
    try {
      const moedasString = moedas.join(',')
      const url = `${this.AWESOME_API_BASE}/json/last/${moedasString}`
      const response = await fetch(url)
      
      if (!response.ok) throw new Error('Erro ao buscar cotações')
      
      const data = await response.json()
      
      // Normalizar dados
      const cotacoes: {[key: string]: any} = {}
      Object.keys(data).forEach(key => {
        const moeda = data[key]
        cotacoes[key] = {
          nome: moeda.name,
          valor: parseFloat(moeda.bid),
          variacao: parseFloat(moeda.pctChange),
          dataAtualizacao: new Date(moeda.create_date).toLocaleString('pt-BR'),
          simbolo: moeda.code
        }
      })
      
      return cotacoes
    } catch (error) {
      console.error('Erro API cotações:', error)
      return null
    }
  }

  /**
   * Histórico de uma moeda específica
   */
  static async buscarHistoricoMoeda(moeda: string, dias: number = 30) {
    try {
      const url = `${this.AWESOME_API_BASE}/json/daily/${moeda}/${dias}`
      const response = await fetch(url)
      
      if (!response.ok) throw new Error('Erro ao buscar histórico')
      
      const data = await response.json()
      return data.map((item: any) => ({
        data: item.timestamp,
        valor: parseFloat(item.bid),
        alta: parseFloat(item.high),
        baixa: parseFloat(item.low)
      }))
    } catch (error) {
      console.error('Erro histórico moeda:', error)
      return null
    }
  }

  /**
   * Busca endereço por CEP
   */
  static async buscarCEP(cep: string) {
    try {
      // Limpar CEP (remover pontos, traços, espaços)
      const cepLimpo = cep.replace(/\D/g, '')
      
      if (cepLimpo.length !== 8) {
        throw new Error('CEP deve conter 8 dígitos')
      }

      const url = `${this.VIACEP_BASE}/${cepLimpo}/json/`
      const response = await fetch(url)
      
      if (!response.ok) throw new Error('Erro ao buscar CEP')
      
      const data = await response.json()
      
      if (data.erro) {
        throw new Error('CEP não encontrado')
      }
      
      return {
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf,
        estado: data.estado,
        regiao: data.regiao,
        ddd: data.ddd,
        ibge: data.ibge
      }
    } catch (error) {
      console.error('Erro API CEP:', error)
      throw error
    }
  }

  /**
   * Busca múltiplos endereços por cidade/logradouro
   */
  static async buscarEnderecos(uf: string, cidade: string, logradouro: string) {
    try {
      const url = `${this.VIACEP_BASE}/${uf}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/`
      const response = await fetch(url)
      
      if (!response.ok) throw new Error('Erro ao buscar endereços')
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        return data.slice(0, 10).map((item: any) => ({
          cep: item.cep,
          logradouro: item.logradouro,
          bairro: item.bairro,
          cidade: item.localidade,
          uf: item.uf
        }))
      }
      
      return []
    } catch (error) {
      console.error('Erro busca endereços:', error)
      return []
    }
  }

  /**
   * Converte valor entre moedas usando cotação atual
   */
  static async converterMoeda(valor: number, moedaOrigem: string, moedaDestino: string) {
    try {
      const cotacao = `${moedaOrigem}-${moedaDestino}`
      const dados = await this.buscarCotacoes([cotacao])
      
      if (!dados || !dados[cotacao.replace('-', '')]) {
        throw new Error('Cotação não encontrada')
      }
      
      const taxa = dados[cotacao.replace('-', '')].valor
      return {
        valorOriginal: valor,
        valorConvertido: valor * taxa,
        taxa,
        moedaOrigem,
        moedaDestino,
        dataAtualizacao: dados[cotacao.replace('-', '')].dataAtualizacao
      }
    } catch (error) {
      console.error('Erro conversão moeda:', error)
      return null
    }
  }

  /**
   * Lista de moedas suportadas
   */
  static getMoedasSuportadas() {
    return [
      { codigo: 'USD', nome: 'Dólar Americano', simbolo: '$' },
      { codigo: 'EUR', nome: 'Euro', simbolo: '€' },
      { codigo: 'BTC', nome: 'Bitcoin', simbolo: '₿' },
      { codigo: 'ETH', nome: 'Ethereum', simbolo: 'Ξ' },
      { codigo: 'GBP', nome: 'Libra Esterlina', simbolo: '£' },
      { codigo: 'JPY', nome: 'Iene Japonês', simbolo: '¥' },
      { codigo: 'CHF', nome: 'Franco Suíço', simbolo: 'CHF' },
      { codigo: 'CAD', nome: 'Dólar Canadense', simbolo: 'C$' },
      { codigo: 'AUD', nome: 'Dólar Australiano', simbolo: 'A$' },
      { codigo: 'CNY', nome: 'Yuan Chinês', simbolo: '¥' },
      { codigo: 'ARS', nome: 'Peso Argentino', simbolo: '$' }
    ]
  }

  /**
   * Lista de índices econômicos suportados
   */
  static getIndicesSuportados() {
    return [
      { codigo: 'IPCA', nome: 'IPCA - Índice de Preços ao Consumidor Amplo' },
      { codigo: 'IGP_M', nome: 'IGP-M - Índice Geral de Preços do Mercado' },
      { codigo: 'INPC', nome: 'INPC - Índice Nacional de Preços ao Consumidor' },
      { codigo: 'CDI', nome: 'CDI - Certificado de Depósito Interbancário' },
      { codigo: 'SELIC', nome: 'SELIC - Taxa Básica de Juros' },
      { codigo: 'SELIC_META', nome: 'SELIC Meta - Taxa Básica Meta' }
    ]
  }
}