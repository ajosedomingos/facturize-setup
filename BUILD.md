# Gerar os instaladores do Facturize

## Windows

Execute dentro de `facturacao-pos/setup`:

```powershell
npm run build:win
```

O instalador será criado em `dist/Facturize-2.0.0-win-x64.exe`.

## macOS pelo GitHub Actions

1. Envie o projecto para um repositório no GitHub.
2. Abra a aba **Actions**.
3. Escolha **Gerar Facturize para macOS**.
4. Clique em **Run workflow**.
5. Quando terminar, abra a execução e descarregue o artefacto **Facturize-macOS-universal**.

Também é possível iniciar a compilação criando uma tag com o prefixo `desktop-v`:

```bash
git tag desktop-v2.0.0
git push origin desktop-v2.0.0
```

O artefacto contém um DMG e um ZIP universais, compatíveis com Macs Intel e Apple Silicon.

## Assinatura Apple

O workflow gera inicialmente uma aplicação sem assinatura. Para distribuição pública sem o aviso do Gatekeeper, é necessário configurar um certificado Apple Developer e a notarização da aplicação.

