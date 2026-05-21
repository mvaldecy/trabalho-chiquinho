// Mapa de abas: id da aba → função de inicialização (chamada uma vez ao ativar)
const TAB_INIT = {
  demo:         initDemo,
  introducao:   initIntroducao,
  teoria:       initTeoria,
  complexidade: initComplexidade,
  graficos:     initGraficos,
};

const initialized = new Set();

function activateTab(tabId) {
  // Atualiza botões
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });

  // Atualiza painéis
  document.querySelectorAll(".tab-content").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${tabId}`);
  });

  // Inicializa a aba na primeira visita
  if (!initialized.has(tabId) && TAB_INIT[tabId]) {
    TAB_INIT[tabId]();
    initialized.add(tabId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  // Inicia na aba Demo
  activateTab("demo");
});
