(() => {
"use strict";

// ===== Atalhos e utilidades =====
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const imgSrc = p => p.img || `images/produtos/${p.id}.jpg`;
const byId = Object.fromEntries(PRODUTOS.map(p => [p.id, p]));
const KEY_CART = "bobesponja_sacola_v2", KEY_FORM = "bobesponja_dados_v2";

// ===== Estado: a sacola fica salva no localStorage =====
let cart = {}, filtro = "", mId = null, mQ = 1, observer = null;
try {
  const s = JSON.parse(localStorage.getItem(KEY_CART)) || {};
  for (const id in s) {
    const q = parseInt(s[id].q, 10);
    if (byId[id] && q > 0) cart[id] = { q, obs: String(s[id].obs || "").slice(0, 120) };
  }
} catch (e) { cart = {}; }
const saveCart = () => { try { localStorage.setItem(KEY_CART, JSON.stringify(cart)); } catch (e) {} };
const qtd = id => cart[id] ? cart[id].q : 0;
const ids = () => Object.keys(cart);
const subtotal = () => ids().reduce((s, id) => s + byId[id].preco * cart[id].q, 0);
const totalItens = () => ids().reduce((s, id) => s + cart[id].q, 0);
const tipo = () => $('input[name="tipo"]:checked').value;
const taxa = () => (subtotal() > 0 && tipo() === "Delivery") ? CONFIG.taxaEntrega : 0;

// ===== Aberto ou fechado =====
function aberto() {
  const d = new Date(), h = d.getHours() + d.getMinutes() / 60;
  return CONFIG.diasAbertos.includes(d.getDay()) && h >= CONFIG.abre && h < CONFIG.fecha;
}
function mostrarStatus() {
  const ok = aberto(), el = $("#status");
  el.className = "pill " + (ok ? "on" : "off");
  el.textContent = ok ? "Aberto agora" : "Fechado no momento";
}

// ===== Montagem do cardápio =====
function controles(id) {
  const q = qtd(id);
  if (!q) return `<button class="add" data-act="inc" data-id="${id}"><i class="fa-solid fa-plus"></i> Adicionar</button>`;
  return `<div class="qty">
    <button class="rnd" data-act="dec" data-id="${id}" aria-label="Tirar um"><i class="fa-solid fa-minus"></i></button>
    <span>${q}</span>
    <button class="rnd" data-act="inc" data-id="${id}" aria-label="Colocar mais um"><i class="fa-solid fa-plus"></i></button>
  </div>`;
}

function card(p) {
  return `<article class="card" data-open="${p.id}" tabindex="0" aria-label="Ver detalhes: ${esc(p.nome)}">
    <div class="thumb"><img src="${imgSrc(p)}" alt="${esc(p.nome)}" loading="lazy"></div>
    <div class="info">
      <h3>${p.nome}</h3><p>${p.desc}</p>
      <div class="foot"><span class="price">${money(p.preco)}</span><div data-ctl="${p.id}">${controles(p.id)}</div></div>
    </div></article>`;
}

function renderMenu() {
  const t = norm(filtro.trim());
  let html = "";
  CATEGORIAS.forEach(c => {
    const lista = PRODUTOS.filter(p => p.cat === c.id && (!t || norm(p.nome + " " + p.desc).includes(t)));
    if (lista.length) html += `<section class="cat" id="${c.id}"><h2>${c.ico} ${c.nome}</h2><div class="grid">${lista.map(card).join("")}</div></section>`;
  });
  $("#menu").innerHTML = html || `<p class="none">Nada encontrado para "${esc(filtro)}" 🫧<br>Tente outra palavra.</p>`;
  observarSecoes();
}

function observarSecoes() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(list => {
    list.forEach(en => {
      if (!en.isIntersecting) return;
      $$(".tab").forEach(t => t.classList.toggle("on", t.dataset.cat === en.target.id));
      const a = $(".tab.on");
      if (a) a.scrollIntoView({ inline: "center", block: "nearest" });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  $$(".cat").forEach(s => observer.observe(s));
}

// ===== Sacola =====
function renderBag() {
  $("#items").innerHTML = ids().length ? ids().map(id => {
    const p = byId[id], it = cart[id];
    return `<div class="line">
      <div><b>${p.nome}</b>${it.obs ? `<small>📝 ${esc(it.obs)}</small>` : ""}<small>${money(p.preco)} cada</small></div>
      ${controles(id)}<strong>${money(p.preco * it.q)}</strong></div>`;
  }).join("") : `<p class="none">Sua sacola está vazia 🫧<br>Escolha um lanche no cardápio!</p>`;
  const s = subtotal(), t = taxa();
  $("#sub").textContent = money(s);
  $("#fee").textContent = (s > 0 && tipo() === "Delivery") ? money(t) : "-";
  $("#tot").textContent = money(s + t);
}

function renderBar() {
  $("#barQtd").textContent = totalItens();
  $("#barTotal").textContent = money(subtotal() + taxa());
  $("#bar").classList.toggle("show", totalItens() > 0);
}

function sync(id) {
  if (id) $$(`[data-ctl="${id}"]`).forEach(e => e.innerHTML = controles(id));
  renderBag();
  renderBar();
}

function change(id, d) {
  const q = Math.max(0, qtd(id) + d);
  if (q) { cart[id] = cart[id] || { q: 0, obs: "" }; cart[id].q = q; } else delete cart[id];
  saveCart();
  sync(id);
  if (d > 0) { const b = $("#bar"); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

// ===== Janela do produto =====
function atualizarModal() {
  $("#mq").textContent = mQ;
  $("#mok").textContent = `${qtd(mId) ? "Atualizar sacola" : "Adicionar"} - ${money(byId[mId].preco * mQ)}`;
}
function abrirProduto(id) {
  const p = byId[id];
  mId = id; mQ = qtd(id) || 1;
  $("#modal").innerHTML = `
    <div class="mimg"><img src="${imgSrc(p)}" alt="${esc(p.nome)}">
      <button class="x" data-close aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button></div>
    <div class="d-pad">
      <h2>${p.nome}</h2><p class="mdesc">${p.desc}</p><div class="price big">${money(p.preco)}</div>
      <label class="lbl" for="mobs">Alguma observação?</label>
      <textarea id="mobs" maxlength="120" placeholder="Ex: sem cebola, carne bem passada">${esc(cart[id] ? cart[id].obs : "")}</textarea>
      <div class="mfoot">
        <div class="qty">
          <button class="rnd" data-m="-1" aria-label="Tirar um"><i class="fa-solid fa-minus"></i></button>
          <span id="mq">1</span>
          <button class="rnd" data-m="1" aria-label="Colocar mais um"><i class="fa-solid fa-plus"></i></button>
        </div>
        <button class="cta" id="mok" data-mok></button>
      </div>
    </div>`;
  atualizarModal();
  $("#modal").showModal();
}

// ===== Dados do cliente =====
function salvarForm() {
  const d = { nome: $("#nome").value, tipo: tipo(), end: $("#end").value, pag: $("#pag").value, troco: $("#troco").value, obs: $("#obs").value };
  try { localStorage.setItem(KEY_FORM, JSON.stringify(d)); } catch (e) {}
}
function carregarForm() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY_FORM));
    if (!d) return;
    $("#nome").value = d.nome || ""; $("#end").value = d.end || "";
    $("#troco").value = d.troco || ""; $("#obs").value = d.obs || "";
    if (["Cartão", "Pix", "Dinheiro"].includes(d.pag)) $("#pag").value = d.pag;
    const r = document.querySelector(`input[name="tipo"][value="${d.tipo}"]`);
    if (r) r.checked = true;
  } catch (e) {}
}
function ajustarForm() {
  $("#endWrap").hidden = tipo() !== "Delivery";
  $("#trocoWrap").hidden = $("#pag").value !== "Dinheiro";
  renderBag();
  renderBar();
}

// ===== Finalizar pedido =====
function finalizar() {
  if (!ids().length) { toast("Sua sacola está vazia!"); return; }
  const nome = $("#nome").value.trim(), t = tipo(), end = $("#end").value.trim();
  const pag = $("#pag").value, troco = $("#troco").value.trim(), obs = $("#obs").value.trim();

  const okNome = nome.length >= 2, okEnd = t === "Retirada" || end.length >= 5, okPag = pag !== "";
  $("#nome").classList.toggle("bad", !okNome);
  $("#end").classList.toggle("bad", !okEnd);
  $("#pag").classList.toggle("bad", !okPag);
  if (!okNome || !okEnd || !okPag) {
    toast("Preencha os campos destacados em vermelho.");
    const primeiro = $("#form .bad");
    if (primeiro) primeiro.focus();
    return;
  }
  if (!aberto() && !confirm("Estamos fechados agora. Quer enviar o pedido mesmo assim?")) return;

  const sub = subtotal(), tx = taxa();
  const linhas = [];
  ids().forEach(id => {
    const p = byId[id], it = cart[id];
    linhas.push(`• ${it.q}x ${p.nome} - ${money(p.preco * it.q)}`);
    if (it.obs) linhas.push(`   Obs: ${it.obs}`);
  });
  const msg = [
    `🧽 *NOVO PEDIDO - ${CONFIG.nome.toUpperCase()}* 🍔`,
    "━━━━━━━━━━━━━━━━━━",
    "*ITENS DO PEDIDO*", ...linhas,
    "━━━━━━━━━━━━━━━━━━",
    `Subtotal: ${money(sub)}`,
    `Taxa de entrega: ${t === "Delivery" ? money(tx) : "não se aplica"}`,
    `*TOTAL: ${money(sub + tx)}*`,
    "━━━━━━━━━━━━━━━━━━",
    "*DADOS DO CLIENTE*",
    `👤 Nome: ${nome}`,
    `🛵 Tipo: ${t}`,
    ...(t === "Delivery" ? [`📍 Endereço: ${end}`] : []),
    `💳 Pagamento: ${pag}`,
    ...(pag === "Dinheiro" ? [`💵 Troco para: ${troco ? "R$ " + troco : "não precisa"}`] : []),
    ...(obs ? [`📝 Observações: ${obs}`] : []),
    "━━━━━━━━━━━━━━━━━━",
    "Obrigado pela preferência! 🫧"
  ].join("\n");

  const url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
  cart = {};
  saveCart();
  $("#bag").close();
  renderMenu();
  sync();
  window.location.href = url;
}

// ===== Eventos do DOM =====
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]");
  if (b) { change(b.dataset.id, b.dataset.act === "inc" ? 1 : -1); return; }
  const c = e.target.closest("[data-open]");
  if (c) abrirProduto(c.dataset.open);
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.matches("[data-open]")) abrirProduto(e.target.dataset.open);
});
// Imagem que não carregou: mostra a esponja amarela
document.addEventListener("error", e => {
  const i = e.target;
  if (i.tagName === "IMG" && !i.dataset.fb) { i.dataset.fb = "1"; i.src = "images/placeholder.svg"; }
}, true);

$$("dialog").forEach(d => d.addEventListener("click", e => {
  if (e.target === d || e.target.closest("[data-close]")) d.close();
}));
$("#modal").addEventListener("click", e => {
  const m = e.target.closest("[data-m]");
  if (m) { mQ = Math.min(99, Math.max(1, mQ + Number(m.dataset.m))); atualizarModal(); }
  if (e.target.closest("[data-mok]")) {
    cart[mId] = { q: mQ, obs: $("#mobs").value.trim() };
    saveCart(); sync(mId);
    $("#modal").close();
    toast("Adicionado à sacola!");
  }
});
$("#bar").addEventListener("click", () => { renderBag(); $("#bag").showModal(); });
$("#busca").addEventListener("input", e => { filtro = e.target.value; renderMenu(); });
$("#tabs").addEventListener("click", e => {
  if (e.target.closest(".tab") && filtro) { filtro = ""; $("#busca").value = ""; renderMenu(); }
});
$("#sendBtn").addEventListener("click", finalizar);
$("#clearBtn").addEventListener("click", () => {
  if (ids().length && confirm("Quer mesmo esvaziar a sacola?")) { cart = {}; saveCart(); renderMenu(); sync(); }
});
$$('input[name="tipo"]').forEach(r => r.addEventListener("change", () => { ajustarForm(); salvarForm(); }));
$("#pag").addEventListener("change", ajustarForm);
["#nome", "#end", "#pag", "#obs", "#troco"].forEach(s => {
  $(s).addEventListener("input", () => { $(s).classList.remove("bad"); salvarForm(); });
  $(s).addEventListener("change", () => { $(s).classList.remove("bad"); salvarForm(); });
});

// ===== Início =====
$("#insta").href = CONFIG.instagram;
$("#horario").textContent = CONFIG.horarioTexto;
$("#ano").textContent = new Date().getFullYear();
$("#tabs").innerHTML = CATEGORIAS.map(c => `<a class="tab" href="#${c.id}" data-cat="${c.id}">${c.ico} ${c.nome}</a>`).join("");
mostrarStatus();
setInterval(mostrarStatus, 60000);
carregarForm();
renderMenu();
ajustarForm();
})();
