# LAB40 – Laboratório de Funcionalidades Web

Projeto-base para avaliação prática de Integração e Entrega Contínua (CI/CD).

## Requisitos
- Node.js 20 ou superior.
- npm.

## Executar localmente
```bash
npm install
npm start
```
Acesse http://localhost:3000. Para desenvolvimento com reinicialização automática: `npm run dev`.

## Endpoints
- `GET /health`: verificação de disponibilidade.
- `GET /api/features`: lista as 40 funcionalidades e seus estados.
- `POST /api/features/:id`: executa uma funcionalidade, recebendo JSON no corpo.

Exemplo:
```bash
curl -X POST http://localhost:3000/api/features/1 -H "Content-Type: application/json" -d '{"valor":200,"percentual":15}'
```

## Estrutura
```text
lab40/
├── public/
├── src/
│   ├── app.js
│   ├── server.js
│   └── features/
├── package.json
└── package-lock.json
```

## Contrato de cada módulo
Cada arquivo `src/features/featureNN.js` exporta `id`, `name`, `description`, `implemented` e `execute(input)`.

1. Implemente `execute(input)`.
2. Valide os dados recebidos.
3. Retorne um objeto serializável em JSON.
4. Trate entradas inválidas lançando `Error` com mensagem clara.
5. Depois de implementar e validar, altere `implemented` para `true`.
6. Não altere o contrato dos outros módulos nem a API central sem autorização.

Enquanto `implemented` for `false`, a API retorna HTTP 501 para aquele módulo.

## Importante
Este repositório é entregue intencionalmente sem testes automatizados, análise estática, workflow de CI, build ou configuração de deploy. O estudante deverá criar e justificar esses elementos durante a avaliação.

O servidor escuta `process.env.PORT` e `0.0.0.0`, e a aplicação não persiste dados em disco.

---

## Feature 07 – Verificador de número primo

Módulo: `src/features/feature07.js`

- **Entrada:** `{ "numero": 17 }`
- **Saída:** `{ "numero": 17, "primo": true }`
- **Regras:** `numero` deve ser inteiro maior ou igual a 0. 0 e 1 não são primos. Decimais, strings, `null`, `NaN`, `Infinity`, campo ausente e entrada que não seja objeto são rejeitados com `Error` (HTTP 400 na API).
- **Algoritmo:** trata 0, 1 e os pares direto. Para os ímpares, testa divisores ímpares até √n.
- **Decisão técnica:** o maior valor aceito é `Number.MAX_SAFE_INTEGER` (2^53 − 1). Acima disso o JavaScript não representa inteiros com exatidão e o resultado não seria confiável. Esse limite também deixa o laço com no máximo ~4,7 × 10^7 iterações.

## Testes automatizados

Usam o test runner nativo `node:test`, sem dependências externas.

```bash
npm test                              # todos os testes
node --test test/feature07.test.js    # só a feature 07
npm run test:spec                     # relatório detalhado
npm run test:smoke                    # sobe o servidor e testa /health, /api/features e /api/features/7
```

O arquivo `test/feature07.test.js` cobre:
- **caso típico:** 17 e 2 são primos, e a resposta tem o formato `{ numero, primo }`;
- **fronteiras:** 0, 1, 3, 4, 9, 25, 100, 7919, 7919², 2147483647;
- **entradas inválidas:** -2, 2.5, "17", Infinity, NaN, null, 2^53, campo ausente, entrada `null`/`undefined`/número/array;
- o objeto de entrada não é modificado e o contrato do módulo (`id`, `name`, `implemented`, `execute`) é mantido.

## Roteiro de testes manuais

1. `npm install` e depois `npm start`. Abrir http://localhost:3000/health e conferir `{"status":"ok",...}`.
2. Abrir http://localhost:3000/api/features e conferir que o item `id: 7` tem `implemented: true`.
3. Na interface (http://localhost:3000), selecionar o cartão **07 – Verificador de número primo**, carregar o exemplo `{"numero":17}` e executar. Esperado: `primo: true`.
4. Pela API (PowerShell):
   ```powershell
   $body = @{ numero = 17 } | ConvertTo-Json
   Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/features/7 -ContentType "application/json" -Body $body
   ```
   Esperado: `result.primo = True`. Repetir com `numero = 100`. Esperado: `False`.
5. Enviar uma entrada inválida (`@{ numero = "17" }` ou `@{ numero = 2.5 }`). Esperado: HTTP 400 com a mensagem `O campo numero deve ser um inteiro maior ou igual a zero.`
6. Encerrar o servidor com Ctrl+C.

## Qualidade e segurança

- **Lint:** `npm run lint` (ESLint 10, configurado em `eslint.config.js` com as regras recomendadas). Saída sem erros.
- **Auditoria:** `npm audit --audit-level=high`. Saída observada: `found 0 vulnerabilities`. As únicas dependências são de desenvolvimento (`eslint`, `@eslint/js`, `globals`). A imagem Docker instala apenas as de produção (`npm ci --omit=dev`), ou seja, nenhuma.

## CI (GitHub Actions)

O workflow `.github/workflows/ci.yml` roda em todo `push` e `pull_request`, nesta ordem:
1. checkout;
2. Node 22;
3. `npm ci`;
4. lint;
5. testes;
6. smoke test;
7. `npm audit`;
8. build da imagem Docker;
9. container efêmero validando `/health` e `POST /api/features/7`;
10. exportação da imagem (`lab40-feature07.tar`) como artefato.

## Docker

```bash
docker build --pull -t lab40:feature07 .
docker run -d --name lab40-container -p 3000:3000 lab40:feature07
curl --fail http://localhost:3000/health
curl --fail -X POST http://localhost:3000/api/features/7 -H "Content-Type: application/json" -d '{"numero":17}'
docker stop lab40-container && docker rm lab40-container
```
