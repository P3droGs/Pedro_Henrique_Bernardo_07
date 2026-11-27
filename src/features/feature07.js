// Funcionalidade 07: Verificador de número primo.
// Objetivo: Determina se um inteiro é primo.
// Exemplo de entrada: { numero: 17 }
// Regras: numero deve ser inteiro >= 0; 0 e 1 não são primos; decimais,
// strings, NaN e Infinity são rejeitados. O teste de divisores vai até √n.
// Decisão: o limite é Number.MAX_SAFE_INTEGER (inteiros representados com
// exatidão em JavaScript), o que mantém o laço em no máximo ~4,7 × 10^7 passos.

const implemented = true;

// Valida a entrada e informa se o número é primo.
function execute(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Informe um objeto com o campo numero.");
  }
  const { numero } = input;
  if (!Number.isSafeInteger(numero) || numero < 0) {
    throw new Error(
      "O campo numero deve ser um inteiro maior ou igual a zero.",
    );
  }

  if (numero < 2) return { numero, primo: false };
  if (numero % 2 === 0) return { numero, primo: numero === 2 };
  for (let divisor = 3; divisor * divisor <= numero; divisor += 2) {
    if (numero % divisor === 0) return { numero, primo: false };
  }
  return { numero, primo: true };
}

// Mantém o contrato de integração utilizado pela API central.
module.exports = {
  id: 7,
  name: "Verificador de número primo",
  description: "Determina se um inteiro é primo.",
  implemented,
  execute,
};
