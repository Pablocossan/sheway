/* SheWay — protótipo educativo. Relatos ficam apenas neste navegador. */
(() => {
  "use strict";

  const STORAGE_KEY = "sheway-relatos-v1";
  const categories = {
    iluminacao: { label: "Iluminação pública", color: "#c79a3b" },
    calcada: { label: "Calçadas e acessibilidade", color: "#57856a" },
    transporte: { label: "Transporte público", color: "#5483ad" },
    outro: { label: "Outro problema urbano", color: "#ad6685" },
  };

  // Coordenadas aproximadas de demonstração em Teresina. Não são ocorrências reais.
  const demoReports = [
    {
      id: "demo-1",
      category: "iluminacao",
      location: "Ponto demonstrativo — região central",
      description:
        "Exemplo fictício para demonstrar um relato de iluminação pública.",
      lat: -5.0892,
      lng: -42.8016,
      demo: true,
      createdAt: "Exemplo",
    },
    {
      id: "demo-2",
      category: "calcada",
      location: "Ponto demonstrativo — zona central",
      description:
        "Exemplo fictício para demonstrar uma questão de acessibilidade na calçada.",
      lat: -5.0821,
      lng: -42.8072,
      demo: true,
      createdAt: "Exemplo",
    },
    {
      id: "demo-3",
      category: "transporte",
      location: "Ponto demonstrativo — área urbana",
      description:
        "Exemplo fictício de uma parada de transporte que poderia precisar de melhorias.",
      lat: -5.0968,
      lng: -42.7935,
      demo: true,
      createdAt: "Exemplo",
    },
    {
      id: "demo-4",
      category: "outro",
      location: "Ponto demonstrativo — área urbana",
      description:
        "Exemplo fictício de outro problema de infraestrutura urbana.",
      lat: -5.0757,
      lng: -42.7988,
      demo: true,
      createdAt: "Exemplo",
    },
  ];

  const mapElement = document.getElementById("map");
  const dialog = document.getElementById("report-dialog");
  const form = document.getElementById("report-form");
  const formError = document.getElementById("form-error");
  const toast = document.getElementById("toast");
  const selectedCoordinates = document.getElementById("selected-coordinates");
  const reportCount = document.getElementById("report-count");
  const mapInstruction = document.getElementById("map-instruction");
  let activeFilter = "todos";
  let selectedPoint = null;
  let toastTimeout;
  let localReports = loadReports();
  let markers = [];

  function loadReports() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter(isValidStoredReport) : [];
    } catch (error) {
      console.warn("Não foi possível ler os relatos locais.", error);
      return [];
    }
  }

  function isValidStoredReport(report) {
    return (
      report &&
      typeof report.id === "string" &&
      categories[report.category] &&
      typeof report.location === "string" &&
      typeof report.description === "string" &&
      Number.isFinite(report.lat) &&
      Number.isFinite(report.lng)
    );
  }

  function saveReports() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localReports));
      return true;
    } catch (error) {
      console.error("Não foi possível salvar o relato.", error);
      showToast(
        "Não foi possível salvar neste navegador. Verifique o armazenamento disponível.",
      );
      return false;
    }
  }

  const map = L.map(mapElement, { scrollWheelZoom: false }).setView(
    [-5.0892, -42.8016],
    13,
  );
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  }).addTo(map);

  map.on("click", (event) => {
    selectedPoint = { lat: event.latlng.lat, lng: event.latlng.lng };
    selectedCoordinates.textContent = `Ponto selecionado: ${selectedPoint.lat.toFixed(5)}, ${selectedPoint.lng.toFixed(5)}.`;
    mapInstruction.textContent =
      "Local selecionado — abra “Novo relato” para continuar";
    showToast("Local selecionado no mapa. Agora você pode criar um relato.");
  });

  function allReports() {
    return [...demoReports, ...localReports];
  }

  function makeMarkerIcon(color) {
    return L.divIcon({
      className: "custom-map-marker",
      html: `<span style="display:block;width:18px;height:18px;background:${color};border:3px solid #fff;border-radius:50% 50% 50% 5px;transform:rotate(-45deg);box-shadow:0 2px 7px #2b1d2b55"></span>`,
      iconSize: [20, 20],
      iconAnchor: [10, 17],
      popupAnchor: [0, -16],
    });
  }

  function escapeHTML(value) {
    return String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  }

  function markerPopup(report) {
    const category = categories[report.category];
    const source = report.demo
      ? "Ponto fictício de demonstração"
      : "Relato salvo neste navegador";
    return `<div class="popup-badge">${escapeHTML(category.label)}</div><div class="popup-title">${escapeHTML(report.location)}</div><div class="popup-meta">${escapeHTML(report.description)}<br><br>${source}</div>`;
  }

  function renderMap() {
    markers.forEach((marker) => map.removeLayer(marker));
    markers = [];
    const reports = allReports().filter(
      (report) => activeFilter === "todos" || report.category === activeFilter,
    );
    reports.forEach((report) => {
      const color = report.demo ? "#8d6797" : "#d887a5";
      const marker = L.marker([report.lat, report.lng], {
        icon: makeMarkerIcon(color),
      })
        .bindPopup(markerPopup(report), { maxWidth: 230 })
        .addTo(map);
      markers.push(marker);
    });
    updateCounts();
  }

  function updateCounts() {
    const reports = allReports();
    document.getElementById("count-todos").textContent = reports.length;
    Object.keys(categories).forEach((key) => {
      document.getElementById(`count-${key}`).textContent = reports.filter(
        (report) => report.category === key,
      ).length;
    });
    reportCount.textContent = localReports.length;
  }

  function setFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll(".filter-button").forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderMap();
  }

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === activeFilter),
    );
    button.addEventListener("click", () => setFilter(button.dataset.filter));
  });

  function openReportDialog() {
    formError.hidden = true;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    setTimeout(() => document.getElementById("report-category").focus(), 50);
  }

  function closeReportDialog() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  document
    .getElementById("report-button")
    .addEventListener("click", openReportDialog);
  document
    .getElementById("hero-report-button")
    .addEventListener("click", openReportDialog);
  document
    .getElementById("close-dialog")
    .addEventListener("click", closeReportDialog);
  document
    .getElementById("cancel-report")
    .addEventListener("click", closeReportDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeReportDialog();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formError.hidden = true;
    const data = new FormData(form);
    const category = String(data.get("category") || "");
    const location = String(data.get("location") || "").trim();
    const description = String(data.get("description") || "").trim();
    if (
      !categories[category] ||
      location.length < 3 ||
      description.length < 8
    ) {
      formError.textContent =
        "Confira os campos: informe a categoria, um local e uma descrição com pelo menos 8 caracteres.";
      formError.hidden = false;
      return;
    }
    if (!selectedPoint) {
      formError.textContent =
        "Clique no mapa para selecionar um ponto aproximado antes de salvar o relato.";
      formError.hidden = false;
      return;
    }
    const report = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category,
      location,
      description,
      lat: selectedPoint.lat,
      lng: selectedPoint.lng,
      demo: false,
      createdAt: new Date().toISOString(),
    };
    localReports.push(report);
    if (!saveReports()) {
      localReports = localReports.filter((item) => item.id !== report.id);
      return;
    }
    form.reset();
    selectedPoint = null;
    selectedCoordinates.textContent =
      "Nenhum ponto selecionado no mapa. Você pode marcar um local clicando no mapa.";
    closeReportDialog();
    setFilter("todos");
    renderMap();
    const marker = markers.find((item) => {
      const position = item.getLatLng();
      return (
        Math.abs(position.lat - report.lat) < 0.000001 &&
        Math.abs(position.lng - report.lng) < 0.000001
      );
    });
    if (marker) marker.openPopup();
    showToast("Relato salvo somente neste navegador. Obrigado por contribuir!");
  });

  document.getElementById("reset-demo").addEventListener("click", () => {
    const shouldReset = window.confirm(
      "Isso apaga os relatos salvos neste navegador e mantém apenas os pontos fictícios de demonstração. Deseja continuar?",
    );
    if (!shouldReset) return;
    localReports = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn(error);
    }
    selectedPoint = null;
    selectedCoordinates.textContent =
      "Nenhum ponto selecionado no mapa. Você pode marcar um local clicando no mapa.";
    setFilter("todos");
    showToast(
      "Relatos locais removidos. Os exemplos de demonstração continuam no mapa.",
    );
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 3600);
  }

  // Corrige o tamanho do mapa caso a página tenha sido aberta em uma aba inativa.
  window.addEventListener("load", () =>
    setTimeout(() => map.invalidateSize(), 150),
  );
  renderMap();
})();
