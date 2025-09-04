// Configurações SEO para cada página
export const seoConfig = {
  home: {
    title: 'Calculadoras Online - INSS, FGTS, Imposto de Renda 2025',
    description: 'Calculadoras online gratuitas e atualizadas para INSS, FGTS, Imposto de Renda e muito mais. Ferramentas precisas baseadas na legislação brasileira vigente.',
    keywords: 'calculadora online, INSS, FGTS, imposto de renda, IRRF, salário líquido, calculadora trabalhista'
  },
  inss: {
    title: 'Calculadora INSS 2025 - Calcule sua Contribuição Previdenciária',
    description: 'Calculadora INSS 2025 atualizada. Calcule o desconto do INSS sobre o salário bruto conforme as alíquotas vigentes. Tabela oficial.',
    keywords: 'calculadora INSS, contribuição previdenciária, desconto INSS, tabela INSS 2025, previdência social'
  },
  fgts: {
    title: 'Calculadora FGTS 2025 - Calcule o Depósito Mensal',
    description: 'Calculadora FGTS 2025. Calcule quanto o empregador deposita mensalmente na sua conta do FGTS baseado no salário bruto.',
    keywords: 'calculadora FGTS, fundo de garantia, depósito FGTS, FGTS mensal, direitos trabalhistas'
  },
  irrf: {
    title: 'Calculadora IRRF 2025 - Imposto de Renda Retido na Fonte',
    description: 'Calculadora IRRF 2025. Calcule o Imposto de Renda Retido na Fonte sobre salários conforme a tabela progressiva atualizada.',
    keywords: 'calculadora IRRF, imposto de renda, IR na fonte, tabela IR 2025, salário líquido'
  }
}

// Função para obter a URL canônica baseada no pathname
export const getCanonicalUrl = (pathname: string): string => {
  const baseUrl = 'https://seudominio.com' // Substituir pela URL real
  return `${baseUrl}${pathname === '/' ? '' : pathname}`
}

// Structured data para SEO
export const generateStructuredData = (type: 'calculator' | 'website', data: any) => {
  if (type === 'calculator') {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": data.name,
      "description": data.description,
      "url": data.url,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL"
      }
    }
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Calculadoras Online",
    "description": "Calculadoras online gratuitas para INSS, FGTS, Imposto de Renda e muito mais",
    "url": "https://seudominio.com"
  }
}