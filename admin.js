const rsvps = readRsvps();
const statsEl = document.querySelector("#adminStats");
const tableWrap = document.querySelector("#adminTableWrap");

function readRsvps() {
  try {
    return JSON.parse(localStorage.getItem("cecilia_rsvps")) || [];
  } catch {
    return [];
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function buildSummary() {
  const accepted = rsvps.filter((item) => item.status === "Vou");
  const declined = rsvps.filter((item) => item.status !== "Vou");
  const totalPeople = accepted.reduce((sum, item) => sum + 1 + Number(item.guests || 0), 0);

  return {
    accepted,
    declined,
    totalPeople,
    text: [
      "Resumo do aniversario da Cecilia:",
      `Confirmados: ${accepted.length}`,
      `Nao vao: ${declined.length}`,
      `Total de pessoas: ${totalPeople}`,
      "",
      "Lista:",
      ...rsvps.map((item) => `- ${item.name} | ${item.status} | ${item.age || "sem idade"} | acomp.: ${item.guests || 0} | tel: ${item.phone || "-"}`)
    ].join("\n")
  };
}

function render() {
  const summary = buildSummary();
  statsEl.innerHTML = `
    <article class="admin-stat"><span>Confirmados</span><strong>${summary.accepted.length}</strong></article>
    <article class="admin-stat"><span>Nao vao</span><strong>${summary.declined.length}</strong></article>
    <article class="admin-stat"><span>Pessoas</span><strong>${summary.totalPeople}</strong></article>
    <article class="admin-stat"><span>Respostas</span><strong>${rsvps.length}</strong></article>
  `;

  if (!rsvps.length) {
    tableWrap.innerHTML = '<div class="admin-empty">Nenhuma resposta salva ainda neste navegador.</div>';
    return;
  }

  tableWrap.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Status</th>
          <th>Idade</th>
          <th>Acomp.</th>
          <th>Telefone</th>
          <th>Obs.</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        ${rsvps.map((item) => `
          <tr>
            <td>${escapeHtml(item.name)}</td>
            <td>${escapeHtml(item.status)}</td>
            <td>${escapeHtml(item.age)}</td>
            <td>${Number(item.guests || 0)}</td>
            <td>${escapeHtml(item.phone || "-")}</td>
            <td>${escapeHtml(item.note || "-")}</td>
            <td>${new Date(item.createdAt).toLocaleString("pt-BR")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function exportCsv() {
  const rows = [["Nome", "Status", "Idade", "Acompanhantes", "Telefone", "Observacao", "Data"]];
  rsvps.forEach((item) => rows.push([item.name, item.status, item.age, item.guests, item.phone, item.note, item.createdAt]));
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "lista_aniversario_cecilia.csv";
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelector("#copySummaryBtn").addEventListener("click", async () => {
  const text = buildSummary().text;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  alert("Resumo copiado.");
});

document.querySelector("#whatsappSummaryBtn").addEventListener("click", () => {
  window.open(`https://wa.me/?text=${encodeURIComponent(buildSummary().text)}`, "_blank", "noopener,noreferrer");
});

document.querySelector("#exportAdminBtn").addEventListener("click", exportCsv);

document.querySelector("#clearAdminBtn").addEventListener("click", () => {
  if (confirm("Limpar todas as respostas salvas neste navegador?")) {
    localStorage.removeItem("cecilia_rsvps");
    location.reload();
  }
});

render();
