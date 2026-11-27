// Testes da Feature 07 – Verificador de número primo
// Execute com: node --test test/feature07.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const feature = require("../src/features/feature07");

// Testes de referência (Testes.pdf, Enunciado 07)
test("reconhece números primos", () => {
  assert.equal(feature.execute({ numero: 17 }).primo, true);
  assert.equal(feature.execute({ numero: 2 }).primo, true);
});

test("reconhece não primos e fronteiras 0 e 1", () => {
  for (const numero of [0, 1, 4, 9, 100])
    assert.equal(feature.execute({ numero }).primo, false);
});

test("rejeita negativos, decimais e strings", () => {
  for (const numero of [-2, 2.5, "17", Infinity])
    assert.throws(() => feature.execute({ numero }), { name: "Error" });
});

// Testes complementares
test("caso típico: retorna objeto com numero e primo", () => {
  assert.deepEqual(feature.execute({ numero: 17 }), { numero: 17, primo: true });
});

test("limite: primos e compostos maiores, incluindo quadrado de primo", () => {
  assert.equal(feature.execute({ numero: 3 }).primo, true);
  assert.equal(feature.execute({ numero: 7919 }).primo, true);
  assert.equal(feature.execute({ numero: 25 }).primo, false);
  assert.equal(feature.execute({ numero: 7919 * 7919 }).primo, false);
  assert.equal(feature.execute({ numero: 2147483647 }).primo, true);
});

test("rejeita campo ausente, null, NaN, inteiro inseguro e entrada que não é objeto", () => {
  for (const input of [{}, { numero: null }, { numero: NaN }, { numero: 2 ** 53 }, null, undefined, 17, [17]])
    assert.throws(() => feature.execute(input), { name: "Error" });
});

test("não modifica o objeto de entrada", () => {
  const entrada = { numero: 9 };
  feature.execute(entrada);
  assert.deepEqual(entrada, { numero: 9 });
});

test("mantém o contrato do módulo", () => {
  assert.equal(feature.id, 7);
  assert.equal(feature.name, "Verificador de número primo");
  assert.equal(feature.implemented, true);
  assert.equal(typeof feature.execute, "function");
});
