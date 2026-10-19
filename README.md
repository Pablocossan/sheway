# SheWay

**Informação que acolhe.** O Sheway é um protótipo educativo de uma plataforma comunitária que explora como informações sobre infraestrutura urbana e serviços de apoio podem ficar mais acessíveis.

## Funcionalidades

- Mapa interativo com marcadores e filtros por categoria.
- Pontos fictícios de demonstração, identificados como exemplos.
- Formulário para criar relatos com seleção aproximada do local no mapa.
- Persistência dos relatos no `localStorage` do navegador utilizado.
- Acesso rápido aos canais oficiais nacionais: 190 (emergência policial) e 180 (Central de Atendimento à Mulher).
- Interface responsiva e avisos sobre privacidade e limitações do protótipo.

## Como executar

### 1-Localmente

1. Baixe ou clone este repositório.
2. Abra `index.html` no navegador. Para uma experiência mais consistente, use a extensão **Live Server** no Visual Studio Code.
3. A conexão com a internet é necessária para carregar os mapas do OpenStreetMap, a biblioteca Leaflet e as fontes externas.
4. Clique no mapa para selecionar um local, escolha **Novo relato**, preencha os campos e salve.

### 2-GitHubPages

O Sheway foi hospedado através do GitHubPages e você pode acessa-lo facilmente através do link a seguir.
- [SheWay](https://pablocossan.github.io/sheway/)

## Tecnologias

- HTML5
- CSS3
- JavaScript
- [Leaflet](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)

## Privacidade e limites

Esta versão é um protótipo para fins educacionais. Os marcadores iniciais são fictícios e não indicam ocorrências reais nem classificam ruas como seguras ou perigosas. Os relatos criados pelo usuário são armazenados apenas no navegador atual e não são transmitidos para um servidor, para a polícia ou para contatos de confiança. Limpar os dados do navegador pode apagar os relatos.

O site não substitui os serviços oficiais. Em situações de perigo imediato, procure um local seguro quando possível e ligue para 190. Para orientação e denúncias de violência contra a mulher, consulte a Central 180: https://www.gov.br/mulheres/pt-br/ligue180.

## Próximas melhorias

- Backend com autenticação e moderação segura de relatos.
- Processo de verificação, denúncia de abuso e remoção de informações desatualizadas.
- Cadastro de pontos de apoio locais com endereços e contatos verificados em fontes oficiais.
- Testes de acessibilidade e avaliação com usuários.

## Créditos

Mapa: © OpenStreetMap contributors. Biblioteca de mapas: Leaflet. Projeto criado para fins educacionais e de demonstração de tecnologia com impacto social.
