# Guia de Deploy no cPanel (HostGator)

## Preparação do Build

1. Execute o build de produção:
```bash
npm run build
```

2. Isso gerará a pasta `dist/` com os arquivos estáticos otimizados.

## Upload no cPanel

### Estrutura de arquivos no servidor:

```
public_html/
├── index.html (da pasta dist)
├── assets/ (da pasta dist)
├── api/
│   ├── calculate-inss.php
│   ├── calculate-fgts.php
│   └── calculate-irrf.php
├── .htaccess
└── favicon.svg
```

### Passo a passo:

1. **Acesse o File Manager do cPanel**
2. **Navegue para public_html/**
3. **Faça upload do conteúdo da pasta dist/**:
   - index.html
   - pasta assets/
   - favicon.svg (se houver)
4. **Crie a pasta api/ e faça upload dos arquivos PHP**
5. **Faça upload do arquivo .htaccess**

## Configuração do Google AdSense

1. **Substitua `ca-pub-XXXXXXXXX` pelo seu Publisher ID** nos arquivos:
   - `src/components/ads/AdSenseUnit.tsx`
   - `index.html`

2. **Configure os slots de anúncios no AdSense:**
   - `top-banner` - Banner horizontal no topo das páginas
   - `calculator-top` - Banner nas calculadoras
   - `middle-banner` / `calculator-middle` - Banner no meio do conteúdo
   - `footer-ad` - Banner no rodapé

## SEO - URLs e Domínio

1. **Atualize a URL base** em `src/utils/seo.ts`:
```javascript
const baseUrl = 'https://seudominio.com' // Trocar pela sua URL
```

2. **URLs amigáveis configuradas**:
   - `/` - Página inicial
   - `/calculadora-inss` - Calculadora INSS
   - `/calculadora-fgts` - Calculadora FGTS  
   - `/calculadora-irrf` - Calculadora IRRF

## Verificação Pós-Deploy

1. **Teste todas as calculadoras**
2. **Verifique se os anúncios estão aparecendo**
3. **Confirme que as URLs amigáveis funcionam**
4. **Teste responsividade mobile**
5. **Verifique Core Web Vitals no Google PageSpeed**

## Manutenção

- **Atualize as tabelas** nos arquivos PHP quando houver mudanças na legislação
- **Monitore performance** através do Google Analytics
- **Acompanhe receita** no Google AdSense

## Compatibilidade

✅ cPanel/HostGator
✅ PHP 7.4+
✅ Apache com mod_rewrite
✅ Sem dependência de Node.js no servidor
✅ Build estático otimizado
✅ SEO completo
✅ Mobile-first responsivo
✅ Core Web Vitals otimizados