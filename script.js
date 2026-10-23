// Bright Minds Contest website interactions and demo analytics.
// IMPORTANT: Replace the placeholder below with BMC's official WhatsApp number.
// Use country code and digits only, with no +, spaces, or dashes (example format: 2119XXXXXXXX).
const BMC_WHATSAPP_NUMBER = "211XXXXXXXXX";

document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

const whatsappLink = document.getElementById("whatsappLink");
const validNumber = /^\d{8,15}$/.test(BMC_WHATSAPP_NUMBER) && !BMC_WHATSAPP_NUMBER.includes("X");
if (validNumber) {
  const message = encodeURIComponent("Hello Bright Minds Contest (BMC). I would like to learn more about your programs and how I can support your work.");
  whatsappLink.href = `https://wa.me/${BMC_WHATSAPP_NUMBER}?text=${message}`;
} else {
  whatsappLink.href = "https://wa.me/";
  whatsappLink.addEventListener("click", (event) => {
    event.preventDefault();
    alert("Please add BMC's official WhatsApp number in script.js before publishing this button.");
  });
}

const palette = { blue: "#34339d", red: "#ed1c24", green: "#00a651", pale: "#dfe2f7" };
const activityLabels = ["Debate", "Public Speaking", "Mathematics", "Academic Challenge", "Mock Exams", "Sports"];
const activityValues = [0, 0, 0, 0, 0, 0];
const focusChart = new Chart(document.getElementById("focusChart"), {
  type: "doughnut",
  data: {
    labels: ["Education", "Youth development", "Leadership", "Sports", "Talent development"],
    datasets: [{ data: [35, 25, 18, 10, 12], backgroundColor: [palette.blue, palette.green, palette.red, "#f0b43c", "#7779c8"], borderWidth: 2, borderColor: "#fff" }]
  },
  options: { responsive: true, maintainAspectRatio: true, cutout: "63%", plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 7, padding: 14, font: { size: 10 } } } } }
});
const programChart = new Chart(document.getElementById("programChart"), {
  type: "bar",
  data: { labels: activityLabels, datasets: [{ label: "Records entered", data: activityValues, backgroundColor: [palette.blue, palette.green, palette.red, "#7779c8", "#f0b43c", "#50a5d8"], borderRadius: 5, maxBarThickness: 34 }] },
  options: { responsive: true, maintainAspectRatio: true, scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "#eef0f6" } }, x: { grid: { display: false }, ticks: { font: { size: 9 }, maxRotation: 35, minRotation: 0 } } }, plugins: { legend: { display: false } } }
});

const records = [];
const programMap = {
  "Debate": 0,
  "Public Speaking": 1,
  "Mathematics Contest": 2,
  "Academic Challenge": 3,
  "Mock Examinations": 4,
  "Sports": 5
};
const form = document.getElementById("activityForm");
form.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("activityName").value.trim();
  const program = document.getElementById("activityProgram").value;
  const participants = Number(document.getElementById("activityParticipants").value);
  if (!name || !Number.isFinite(participants) || participants < 0) return;
  records.unshift({ name, program, participants, date: new Date().toLocaleDateString() });
  activityValues[programMap[program]] += 1;
  programChart.data.datasets[0].data = activityValues;
  programChart.update();
  document.getElementById("recordCount").textContent = records.length;
  document.getElementById("eventCount").textContent = records.length;
  renderRecords();
  form.reset();
  document.getElementById("activityParticipants").value = "0";
});
function renderRecords() {
  const list = document.getElementById("recordsList");
  if (!records.length) {
    list.className = "empty-records";
    list.textContent = "No activity records yet. Add your first record above.";
    return;
  }
  list.className = "";
  list.replaceChildren();
  records.slice(0, 8).forEach(record => {
    const row = document.createElement("div");
    row.className = "record-row";
    const details = document.createElement("b");
    details.textContent = record.name;
    const category = document.createElement("span");
    category.textContent = record.program;
    const count = document.createElement("span");
    count.textContent = `${record.participants} participants · ${record.date}`;
    row.append(details, category, count);
    list.appendChild(row);
  });
}
