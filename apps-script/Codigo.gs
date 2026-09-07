/**
 * Festa de 1 Aninho — recebimento das confirmações de presença.
 *
 * Publicado como "app da web", ele faz duas coisas:
 *
 *   POST  → grava uma confirmação nova na aba "Confirmações".
 *   GET   → devolve todas as confirmações em JSON, para o app importar.
 *
 * A planilha não precisa existir antes: se o script for solto (criado em
 * script.google.com), ele cria uma no seu Drive na primeira resposta e guarda
 * o endereço dela. Rode `linkDaPlanilha` no editor para descobrir qual é.
 * Se o script estiver preso a uma planilha, ele usa essa mesma.
 *
 * O passo a passo de instalação está no README, seção "Confirmação de presença".
 */

// Sobe de 1 sempre que este arquivo mudar: o GET devolve o número, e assim
// dá para saber na hora se a implantação está servindo o código novo.
var VERSAO = 3;

var SHEET_NAME = "Confirmações";
var NOME_PLANILHA = "Festa 1 Aninho — Confirmações";
var PROP_PLANILHA = "planilhaId";
var PROP_CHAVE = "chaveAdmin";
var HEADERS = ["id", "quando", "nome", "presenca", "adultos", "criancas", "telefone", "recado"];

var LIMITES = { nome: 80, telefone: 30, recado: 500, pessoas: 50 };

/** A planilha onde tudo é guardado — criando-a se ainda não existir. */
function planilha_() {
  try {
    var presa = SpreadsheetApp.getActive();
    if (presa) return presa;          // script preso a uma planilha
  } catch (err) {}                    // script solto: segue para o Drive

  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PROP_PLANILHA);
  if (id) {
    try { return SpreadsheetApp.openById(id); }
    catch (err) { props.deleteProperty(PROP_PLANILHA); }   // apagada ou na lixeira
  }

  var nova = SpreadsheetApp.create(NOME_PLANILHA);
  props.setProperty(PROP_PLANILHA, nova.getId());
  return nova;
}

/**
 * Senha para apagar respostas. Sorteada na primeira vez e guardada aqui dentro.
 * Ela vive só neste script e no app de quem organiza — nunca na página do
 * convite. Sem isso, qualquer convidado poderia apagar a lista inteira.
 */
function chaveAdmin_() {
  var props = PropertiesService.getScriptProperties();
  var chave = props.getProperty(PROP_CHAVE);
  if (!chave) {
    chave = Utilities.getUuid().replace(/-/g, "").slice(0, 12);
    props.setProperty(PROP_CHAVE, chave);
  }
  return chave;
}

/** Apaga uma resposta pelo id. Só com a chave certa. */
function apagar_(id, chave) {
  if (!id) return { ok: false, erro: "Preciso do id da resposta." };
  if (!chave || chave !== chaveAdmin_()) return { ok: false, erro: "Chave errada." };

  var sh = aba_();
  var ultima = sh.getLastRow();
  if (ultima < 2) return { ok: false, erro: "Não achei essa resposta." };

  var ids = sh.getRange(2, 1, ultima - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      sh.deleteRow(i + 2);            // +2: a linha 1 é o cabeçalho
      return { ok: true, id: id };
    }
  }
  return { ok: false, erro: "Não achei essa resposta." };
}

/** Cria (ou devolve) a aba com o cabeçalho certo. */
function aba_() {
  var ss = planilha_();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    // planilha recém-criada já vem com uma folha vazia: aproveita essa
    var folhas = ss.getSheets();
    sh = (folhas.length === 1 && folhas[0].getLastRow() === 0)
      ? folhas[0].setName(SHEET_NAME)
      : ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

/**
 * Rode esta função no editor (▶ Executar) para ver o que o app precisa:
 * o endereço da planilha e a chave para apagar respostas. Os dois aparecem
 * no "Registro de execução", lá embaixo.
 */
function dadosParaOApp() {
  var texto = "Planilha: " + planilha_().getUrl() +
              "\nChave para apagar: " + chaveAdmin_();
  Logger.log(texto);
  return texto;
}

/** Resposta JSON — com suporte a JSONP quando o app pede ?callback=. */
function resposta_(obj, callback) {
  var txt = JSON.stringify(obj);
  if (callback && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + "(" + txt + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(txt).setMimeType(ContentService.MimeType.JSON);
}

function texto_(v, max) {
  return String(v == null ? "" : v).trim().slice(0, max);
}

function inteiro_(v) {
  var n = Math.floor(Number(v));
  if (!isFinite(n) || n < 0) return 0;
  return Math.min(n, LIMITES.pessoas);
}

/** O convidado enviou o formulário. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var dados = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    if (dados.acao === "apagar") {
      lock.waitLock(20000);
      return resposta_(apagar_(dados.id, dados.chave));
    }

    var nome = texto_(dados.nome, LIMITES.nome);
    if (!nome) return resposta_({ ok: false, erro: "Preciso do nome." });

    var vai = dados.presenca === "sim" || dados.presenca === true;
    var adultos = vai ? inteiro_(dados.adultos) : 0;
    var criancas = vai ? inteiro_(dados.criancas) : 0;
    if (vai && adultos + criancas === 0) adultos = 1;

    var linha = [
      Utilities.getUuid(),
      new Date(),
      nome,
      vai ? "sim" : "nao",
      adultos,
      criancas,
      texto_(dados.telefone, LIMITES.telefone),
      texto_(dados.recado, LIMITES.recado)
    ];

    lock.waitLock(20000);
    aba_().appendRow(linha);
    return resposta_({ ok: true, id: linha[0] });
  } catch (err) {
    return resposta_({ ok: false, erro: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

/** O app está buscando as respostas. */
function doGet(e) {
  var callback = e && e.parameter ? e.parameter.callback : "";
  try {
    var sh = aba_();
    var linhas = sh.getLastRow() > 1
      ? sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).getValues()
      : [];

    var respostas = linhas.map(function (l) {
      return {
        id: String(l[0]),
        quando: l[1] instanceof Date ? l[1].toISOString() : String(l[1]),
        nome: String(l[2]),
        presenca: String(l[3]),
        adultos: Number(l[4]) || 0,
        criancas: Number(l[5]) || 0,
        telefone: String(l[6] || ""),
        recado: String(l[7] || "")
      };
    }).filter(function (r) { return r.nome; });

    return resposta_({ ok: true, versao: VERSAO, respostas: respostas }, callback);
  } catch (err) {
    return resposta_({ ok: false, versao: VERSAO, erro: String(err) }, callback);
  }
}
