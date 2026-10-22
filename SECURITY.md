# Política de Segurança

## Escopo

O DevStudy é um site **estático**: não tem backend, contas de usuário nem banco de dados. Os dados do visitante ficam apenas no `localStorage` do próprio navegador (tema, favoritos, progresso de "erros comuns"). Mesmo assim, problemas como XSS, execução de código indevida no editor ao vivo ou dependências comprometidas (CDN) são relevantes.

## Como reportar

**Não abra issue pública.** Use o relato privado do GitHub:

1. Acesse a aba **Security** do repositório.
2. Clique em **Report a vulnerability** (<https://github.com/JonathanNwokolo/devstudy2/security/advisories/new>).

Inclua: página/arquivo afetado, passos para reproduzir, impacto percebido e, se possível, sugestão de correção.

## O que esperar

- Confirmação de recebimento em até ~7 dias (mantenedor único, esforço voluntário).
- Correção ou justificativa registrada no advisory. Não há programa de recompensas.

## Versões suportadas

Apenas a branch `main` e o site publicado a partir dela.

## Limitações já conhecidas (não precisam ser reportadas)

- Scripts e fontes de CDN (Prism, Google Fonts) sem Subresource Integrity e sem Content-Security-Policy — planejado para a Fase 1.
- O editor ao vivo executa o código que o próprio visitante digita, em `iframe` com `sandbox="allow-scripts"` (sem `allow-same-origin`).
