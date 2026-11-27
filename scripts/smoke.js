// Smoke test: sobe o servidor em uma porta livre e verifica /health,
// /api/features e a execução da Feature 07 (caso válido e inválido).
const { createServer } = require("node:http");
const app = require("../src/app");

async function main() {
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const falhas = [];
  const check = (condicao, mensagem) => {
    console.log(`${condicao ? "OK  " : "FAIL"} ${mensagem}`);
    if (!condicao) falhas.push(mensagem);
  };

  try {
    const health = await fetch(`${base}/health`);
    const healthBody = await health.json();
    check(
      health.status === 200 && healthBody.status === "ok",
      "GET /health responde status ok",
    );

    const lista = await fetch(`${base}/api/features`);
    const listaBody = await lista.json();
    const f07 = listaBody.items.find((item) => item.id === 7);
    check(
      lista.status === 200 && listaBody.total === 40,
      "GET /api/features lista 40 funcionalidades",
    );
    check(
      f07 && f07.implemented === true,
      "Feature 07 aparece como implementada",
    );

    const post = (body) =>
      fetch(`${base}/api/features/7`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    const valido = await post({ numero: 17 });
    const validoBody = await valido.json();
    check(
      valido.status === 200 && validoBody.result.primo === true,
      "POST /api/features/7 {numero:17} -> primo=true",
    );

    const invalido = await post({ numero: "17" });
    const invalidoBody = await invalido.json();
    check(
      invalido.status === 400 && typeof invalidoBody.error === "string",
      "POST /api/features/7 {numero:'17'} -> HTTP 400",
    );
  } catch (error) {
    check(false, `erro inesperado: ${error.message}`);
  } finally {
    server.close();
  }

  if (falhas.length) {
    console.error(`Smoke test falhou (${falhas.length} verificação(ões)).`);
    process.exit(1);
  }
  console.log("Smoke test aprovado.");
}

main();
