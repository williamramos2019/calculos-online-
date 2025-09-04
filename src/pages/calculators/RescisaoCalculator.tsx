import React, { useState, useEffect } from 'react'
import AdSenseUnit from '../../components/ads/AdSenseUnit'
import SEOHead from '../../components/seo/SEOHead'

interface RescisaoData {
  salario: number
  dataAdmissao: string
  dataRescisao: string
  tipoRescisao: 'semJustaCausa' | 'pedidoDemissao' | 'comJustaCausa' | 'acordoMutuo'
  avisoPrevio: 'trabalhado' | 'indenizado' | 'nao'
  ultimasFerias: boolean
  saldoFGTS: number
}

interface RescisaoResult {
  saldoSalario: number
  decimoTerceiro: number
  ferias: number
  tercoFerias: number
  avisoPrevio: number
  multaFGTS: number
  totalBruto: number
  inss: number
  irrf: number
  totalLiquido: number
  detalhes: {
    diasTrabalhados: number
    mesesTrabalhados: number
    anosCompletos: number
  }
}

const RescisaoCalculator: React.FC = () => {
  const [dados, setDados] = useState<RescisaoData>({
    salario: 0,
    dataAdmissao: '',
    dataRescisao: '',
    tipoRescisao: 'semJustaCausa',
    avisoPrevio: 'indenizado',
    ultimasFerias: false,
    saldoFGTS: 0
  })
  
  const [resultado, setResultado] = useState<RescisaoResult | null>(null)

  useEffect(() => {
    document.title = 'Calculadora de Rescisão Trabalhista CLT 2025 - Calcule suas Verbas'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Calculadora completa de rescisão trabalhista CLT. Calcule saldo de salário, 13º, férias, aviso prévio, FGTS e multa. Conforme legislação 2025.')
    }
  }, [])

  const calcularRescisao = () => {
    if (!dados.salario || !dados.dataAdmissao || !dados.dataRescisao) return

    const admissao = new Date(dados.dataAdmissao)
    const rescisao = new Date(dados.dataRescisao)
    
    // Cálculo do tempo trabalhado
    const diffTime = rescisao.getTime() - admissao.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)
    const anosCompletos = Math.floor(diffMonths / 12)
    
    // Saldo de salário (dias do mês atual)
    const diasMes = rescisao.getDate()
    const saldoSalario = (dados.salario / 30) * diasMes
    
    // 13º salário proporcional
    const mesesTrabalhados = rescisao.getMonth() + 1
    const decimoTerceiro = (dados.salario / 12) * mesesTrabalhados
    
    // Férias vencidas e proporcionais
    let ferias = 0
    let tercoFerias = 0
    
    if (dados.ultimasFerias) {
      // Férias vencidas (ano anterior)
      ferias += dados.salario
      tercoFerias += dados.salario / 3
    }
    
    // Férias proporcionais (ano atual)
    if (dados.tipoRescisao === 'semJustaCausa' || dados.tipoRescisao === 'acordoMutuo') {
      const feriasProporcionais = (dados.salario / 12) * mesesTrabalhados
      ferias += feriasProporcionais
      tercoFerias += feriasProporcionais / 3
    }
    
    // Aviso prévio
    let avisoPrevio = 0
    if (dados.avisoPrevio === 'indenizado' && dados.tipoRescisao === 'semJustaCausa') {
      // 30 dias + 3 dias por ano trabalhado (máximo 90 dias)
      const diasAvisoExtra = Math.min(anosCompletos * 3, 60)
      const totalDiasAviso = 30 + diasAvisoExtra
      avisoPrevio = (dados.salario / 30) * totalDiasAviso
    }
    
    // Multa FGTS (40% ou 20% no acordo mútuo)
    let multaFGTS = 0
    if (dados.tipoRescisao === 'semJustaCausa') {
      multaFGTS = dados.saldoFGTS * 0.40
    } else if (dados.tipoRescisao === 'acordoMutuo') {
      multaFGTS = dados.saldoFGTS * 0.20
    }
    
    const totalBruto = saldoSalario + decimoTerceiro + ferias + tercoFerias + avisoPrevio
    
    // Cálculo INSS
    const inss = calcularINSS(totalBruto)
    
    // Cálculo IRRF (simplificado)
    const baseIRRF = totalBruto - inss
    const irrf = calcularIRRF(baseIRRF)
    
    const totalLiquido = totalBruto - inss - irrf + multaFGTS

    setResultado({
      saldoSalario,
      decimoTerceiro,
      ferias,
      tercoFerias,
      avisoPrevio,
      multaFGTS,
      totalBruto,
      inss,
      irrf,
      totalLiquido,
      detalhes: {
        diasTrabalhados: diffDays,
        mesesTrabalhados: diffMonths,
        anosCompletos
      }
    })
  }

  const calcularINSS = (valor: number): number => {
    const brackets = [
      { min: 0, max: 1412.00, rate: 0.075 },
      { min: 1412.01, max: 2666.68, rate: 0.09 },
      { min: 2666.69, max: 4000.03, rate: 0.12 },
      { min: 4000.04, max: 7786.02, rate: 0.14 }
    ]

    let totalContribution = 0
    for (const bracket of brackets) {
      if (valor > bracket.min) {
        const taxableAmount = Math.min(valor, bracket.max) - bracket.min + (bracket.min === 0 ? 0 : 0.01)
        totalContribution += taxableAmount * bracket.rate
      }
    }
    return totalContribution
  }

  const calcularIRRF = (valor: number): number => {
    if (valor <= 2112.00) return 0
    if (valor <= 2826.65) return (valor * 0.075) - 158.40
    if (valor <= 3751.05) return (valor * 0.15) - 370.40
    if (valor <= 4664.68) return (valor * 0.225) - 651.73
    return (valor * 0.275) - 884.96
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
        title="Calculadora de Rescisão Trabalhista CLT 2025"
        description="Calculadora completa de rescisão trabalhista CLT. Calcule saldo de salário, 13º, férias, aviso prévio, FGTS e multa."
        keywords="rescisão trabalhista, CLT, verbas rescisórias, aviso prévio, FGTS, 13º salário"
      />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Calculadora de Rescisão Trabalhista CLT
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Calcule todas as verbas rescisórias: saldo de salário, 13º proporcional, férias, 
          aviso prévio, multa do FGTS e descontos de INSS e IRRF.
        </p>
      </div>

      {/* AdSense após o título */}
      <div className="mb-8">
        <AdSenseUnit 
          slot="rescisao-top"
          format="horizontal"
          className="text-center"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="calculator-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados do Contrato</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salário Atual (R$)
              </label>
              <input
                type="number"
                value={dados.salario || ''}
                onChange={(e) => setDados({...dados, salario: parseFloat(e.target.value) || 0})}
                placeholder="Ex: 3000.00"
                className="input-field"
                step="0.01"
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Admissão
                </label>
                <input
                  type="date"
                  value={dados.dataAdmissao}
                  onChange={(e) => setDados({...dados, dataAdmissao: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Rescisão
                </label>
                <input
                  type="date"
                  value={dados.dataRescisao}
                  onChange={(e) => setDados({...dados, dataRescisao: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Rescisão
              </label>
              <select
                value={dados.tipoRescisao}
                onChange={(e) => setDados({...dados, tipoRescisao: e.target.value as any})}
                className="input-field"
              >
                <option value="semJustaCausa">Demissão sem justa causa</option>
                <option value="pedidoDemissao">Pedido de demissão</option>
                <option value="comJustaCausa">Demissão por justa causa</option>
                <option value="acordoMutuo">Acordo mútuo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aviso Prévio
              </label>
              <select
                value={dados.avisoPrevio}
                onChange={(e) => setDados({...dados, avisoPrevio: e.target.value as any})}
                className="input-field"
              >
                <option value="indenizado">Indenizado</option>
                <option value="trabalhado">Trabalhado</option>
                <option value="nao">Não aplicável</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saldo FGTS (R$)
              </label>
              <input
                type="number"
                value={dados.saldoFGTS || ''}
                onChange={(e) => setDados({...dados, saldoFGTS: parseFloat(e.target.value) || 0})}
                placeholder="Ex: 5000.00"
                className="input-field"
                step="0.01"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="ultimasFerias"
                checked={dados.ultimasFerias}
                onChange={(e) => setDados({...dados, ultimasFerias: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="ultimasFerias" className="text-sm text-gray-700">
                Possui férias vencidas (período anterior)
              </label>
            </div>
            
            <button
              onClick={calcularRescisao}
              disabled={!dados.salario || !dados.dataAdmissao || !dados.dataRescisao}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calcular Rescisão
            </button>
          </div>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="calculator-card bg-green-50 border border-green-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Verbas Rescisórias</h2>
            
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Tempo Trabalhado:</h3>
                <p className="text-sm text-gray-600">
                  {resultado.detalhes.anosCompletos} anos, {resultado.detalhes.mesesTrabalhados % 12} meses 
                  ({resultado.detalhes.diasTrabalhados} dias totais)
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Verbas a Receber:</h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Saldo de Salário:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(resultado.saldoSalario)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">13º Proporcional:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(resultado.decimoTerceiro)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Férias:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(resultado.ferias)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">1/3 Férias:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(resultado.tercoFerias)}
                  </span>
                </div>
                
                {resultado.avisoPrevio > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Aviso Prévio:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(resultado.avisoPrevio)}
                    </span>
                  </div>
                )}
                
                {resultado.multaFGTS > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Multa FGTS:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(resultado.multaFGTS)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Bruto:</span>
                  <span className="font-semibold text-lg">{formatCurrency(resultado.totalBruto)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Descontos:</h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">(-) INSS:</span>
                  <span className="text-red-600">-{formatCurrency(resultado.inss)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">(-) IRRF:</span>
                  <span className="text-red-600">-{formatCurrency(resultado.irrf)}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold text-lg">Total Líquido:</span>
                  <span className="font-bold text-2xl text-green-600">
                    {formatCurrency(resultado.totalLiquido)}
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
          slot="rescisao-middle"
          format="rectangle"
          className="text-center"
        />
      </div>

      {/* Informações sobre Rescisão */}
      <div className="calculator-card mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Como funciona a Rescisão CLT?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Verbas sempre devidas:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Saldo de salário (dias trabalhados no mês)</li>
              <li>13º salário proporcional</li>
              <li>Férias vencidas + 1/3 constitucional</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Demissão sem justa causa:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Férias proporcionais + 1/3</li>
              <li>Aviso prévio (30 dias + 3 por ano)</li>
              <li>Multa FGTS 40%</li>
              <li>Seguro-desemprego</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Pedido de demissão:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Apenas verbas básicas</li>
              <li>Sem aviso prévio indenizado</li>
              <li>Sem multa FGTS</li>
              <li>Sem seguro-desemprego</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Acordo mútuo:</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>50% do aviso prévio</li>
              <li>Multa FGTS reduzida (20%)</li>
              <li>Movimenta 80% do FGTS</li>
              <li>Seguro-desemprego (50% parcelas)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RescisaoCalculator