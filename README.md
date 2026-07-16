<div align="center">
  <img src="./assets/icon.png" alt="CausalForge Logo" width="120" height="120" />

  <h1>CausalForge</h1>

  <p><strong>Lab de inferência causal aplicada — Diff-in-Diff, matching, incerteza e memos de decisão.</strong></p>
  <p><strong>Applied causal inference lab — Diff-in-Diff, matching, uncertainty and decision memos.</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a> ·
    <a href="#en">English</a> ·
    <a href="#live-demo">Live Demo</a> ·
    <a href="#stack--tecnologias">Stack</a> ·
    <a href="#arquitetura--architecture">Architecture</a> ·
    <a href="#quick-start--início-rápido">Quick Start</a> ·
    <a href="#autor--author">Author</a>
  </p>

  <p>
    <a href="https://causalforge-rose.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-causalforge--rose.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-React-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Python" src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img alt="Lab Demo" src="https://img.shields.io/badge/Status-Lab%20demo-2563EB?style=for-the-badge" />
    <img alt="MIT" src="https://img.shields.io/badge/License-MIT-111827?style=for-the-badge" />
  </p>

  <p>
    <a href="https://causalforge-rose.vercel.app"><strong>Live Demo</strong></a> ·
    <a href="https://github.com/BarujaFe1/CausalForge"><strong>Repositório</strong></a> ·
    <a href="https://barujafe.vercel.app/"><strong>Portfólio</strong></a> ·
    <a href="https://www.linkedin.com/in/barujafe/"><strong>LinkedIn</strong></a>
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.png" alt="CausalForge overview" width="100%" />
</p>

---

<a id="pt-br"></a>

## PT-BR

## Visão geral

**CausalForge** é um lab para avaliar intervenções de negócio com métodos causais declarados (Diff-in-Diff, matching), intervalos de incerteza e memos de decisão com limitações explícitas.

> **Aviso de lab:** demo de portfólio com dados sintéticos/amostra. Não é produto em produção com SLA, integrações reais de clientes ou garantia operacional.

---

## Problema

Dashboards correlacionais confundem correlação com impacto. Times precisam de um fluxo honesto para estimar efeito com hipóteses e limitações visíveis.

---

## Para quem

- Analistas de experimentação e product analytics
- Consultores de operação/negócio
- Estudantes de causal inference aplicada
- Recrutadores avaliando rigor analítico

---

## Funcionalidades

- Cenários de intervenção sintéticos
- Diff-in-Diff e matching
- Visualização de incerteza
- Memo de decisão com caveats
- Metodologia documentada em docs/

---

## Escopo e limites

- **É:** lab educacional/portfólio de causalidade aplicada.
- **Não é:** RCT platform, A/B testing production suite, causalidade automática sem revisão humana.

---

<a id="en"></a>

## English

## Overview

**CausalForge** is a lab to evaluate business interventions with declared causal methods (Diff-in-Diff, matching), uncertainty intervals and decision memos with explicit limitations.

> **Lab notice:** portfolio demo with synthetic/sample data. Not a production product with SLA, real customer integrations, or operational guarantees.

---

## Problem

Correlation dashboards confuse association with impact. Teams need an honest workflow to estimate effects with visible assumptions and limits.

---

## Who it is for

- Experimentation and product analytics practitioners
- Operations/business consultants
- Students of applied causal inference
- Recruiters assessing analytical rigor

---

## Features

- Synthetic intervention scenarios
- Diff-in-Diff and matching
- Uncertainty visualization
- Decision memo with caveats
- Methodology docs under docs/

---

## Scope and limits

- **Is:** educational/portfolio lab for applied causality.
- **Is not:** RCT platform, production A/B suite, automatic causality without human review.

---

<a id="live-demo"></a>

## Live Demo

**URL:** [https://causalforge-rose.vercel.app](https://causalforge-rose.vercel.app)

Demo hospedada para avaliação de portfólio / Hosted for portfolio review.

> Lab demo — synthetic / sample data unless noted. Not a production SLA product.

---

<a id="stack--tecnologias"></a>

## Stack / Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| Next.js 15 / React 19 / TypeScript | UI |
| Recharts / Lucide | Charts e navegação |
| FastAPI / Pandas / NumPy / SciPy | Estimativas e API |
| Pytest / Ruff | Qualidade Python |

---

<a id="arquitetura--architecture"></a>

## Arquitetura / Architecture

Monorepo com API FastAPI (pps/api), frontend Next (pps/web) e entry pi/index.py para deploy serverless quando aplicável.

`	xt
CausalForge/
├── api/index.py
├── apps/
│   ├── api/
│   └── web/
├── assets/
├── data/seed/
├── docs/
├── scripts/
├── requirements.txt
├── start.bat
└── vercel.json
`

---

<a id="quick-start--início-rápido"></a>

## Quick Start / Início rápido

### Pré-requisitos / Requirements

- Node.js 20+
- Python 3.12+
- npm

### Clonar / Clone

`ash
git clone https://github.com/BarujaFe1/CausalForge.git
cd CausalForge
`

### Windows (atalho)

`at
start.bat
`

Sobe API em :8000 e web em :3000.

### Manual

`ash
# API
cd apps/api
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
`

`ash
# Web (outro terminal)
cd apps/web
npm install
npm run dev
`

Abra http://localhost:3000

Copie .env.example se precisar de NEXT_PUBLIC_API_URL.


---

## Technical decisions / Decisões técnicas

- **SciPy/Pandas** para estimativas transparentes, não AutoML causal.
- **Memos com limitações** como feature de produto.
- **Dados sintéticos** para demo segura.

---

## Roadmap

### Implementado
- DiD, matching, UI de incerteza, memo, demo Vercel

### Planejado
- Synthetic control
- Export PDF
- Biblioteca de cenários

---

<a id="autor--author"></a>

## Autor / Author

Developed by **Felipe Alirio Baruja**.

- **Portfolio:** [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- **GitHub:** [github.com/BarujaFe1](https://github.com/BarujaFe1)
- **LinkedIn:** [linkedin.com/in/barujafe](https://www.linkedin.com/in/barujafe/)
- **Repository:** [github.com/BarujaFe1/CausalForge](https://github.com/BarujaFe1/CausalForge)

---

## License / Licença

MIT License.

See [LICENSE](./LICENSE) for details.

---

<div align="center">
  <p><strong>CausalForge</strong></p>
  <p>Impacto com método e limites declarados.</p>
  <p><em>Impact with declared methods and limits.</em></p>
</div>
