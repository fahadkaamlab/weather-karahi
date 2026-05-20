const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d");
const templateGrid = document.getElementById("templateGrid");
const nameInput = document.getElementById("nameInput");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

const templates = [
  {
    id: "moon",
    name: "Crescent Night",
    bgTop: "#0f2647",
    bgBottom: "#1f4e79",
    accent: "#f3d27a",
    motif: "crescent",
  },
  {
    id: "lantern",
    name: "Golden Lantern",
    bgTop: "#46311f",
    bgBottom: "#8a5a29",
    accent: "#ffd989",
    motif: "lantern",
  },
  {
    id: "floral",
    name: "Emerald Floral",
    bgTop: "#0f4b42",
    bgBottom: "#1f7b67",
    accent: "#d7f4b3",
    motif: "floral",
  },
  {
    id: "minimal",
    name: "Cream Minimal",
    bgTop: "#f6eee1",
    bgBottom: "#eadac2",
    accent: "#6e4a29",
    motif: "minimal",
  },
  {
    id: "sunset",
    name: "Sunset Mosque",
    bgTop: "#8c3f2f",
    bgBottom: "#d6874b",
    accent: "#ffe9c0",
    motif: "mosque",
  },
  {
    id: "teal",
    name: "Teal Geometry",
    bgTop: "#0e5f63",
    bgBottom: "#2ea6a6",
    accent: "#e9ffed",
    motif: "geometry",
  },
];

let selectedTemplateId = templates[0].id;

function roundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawMotif(template) {
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = template.accent;
  ctx.fillStyle = template.accent;

  if (template.motif === "crescent") {
    ctx.beginPath();
    ctx.arc(820, 280, 130, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(860, 280, 120, 0, Math.PI * 2);
    ctx.fill();
  } else if (template.motif === "lantern") {
    for (let i = 0; i < 3; i += 1) {
      const x = 240 + i * 300;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 220);
      ctx.stroke();
      roundedRect(x - 40, 220, 80, 120, 12);
      ctx.fill();
    }
  } else if (template.motif === "floral") {
    for (let i = 0; i < 10; i += 1) {
      const x = 80 + i * 105;
      const y = 120 + (i % 2) * 120;
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (template.motif === "mosque") {
    ctx.beginPath();
    ctx.moveTo(140, 760);
    ctx.lineTo(940, 760);
    ctx.stroke();
    roundedRect(440, 540, 200, 220, 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(540, 540, 100, Math.PI, 0);
    ctx.stroke();
  } else if (template.motif === "geometry") {
    for (let y = 0; y < 1080; y += 120) {
      for (let x = 0; x < 1080; x += 120) {
        ctx.strokeRect(x + 8, y + 8, 104, 104);
      }
    }
  } else {
    ctx.globalAlpha = 0.14;
    for (let i = 0; i < 5; i += 1) {
      roundedRect(120 + i * 150, 150 + i * 115, 320, 180, 28);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawCard(template, name) {
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
  gradient.addColorStop(0, template.bgTop);
  gradient.addColorStop(1, template.bgBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1080);

  drawMotif(template);

  roundedRect(80, 80, 920, 920, 36);
  ctx.strokeStyle = `${template.accent}88`;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = template.accent;
  ctx.font = "700 72px Georgia, serif";
  ctx.fillText("Eid al Adha Mubarak", 540, 490);

  ctx.font = "500 40px Inter, Segoe UI, Arial";
  ctx.fillText("May your days be filled with peace & blessings", 540, 560);

  ctx.font = "700 68px Inter, Segoe UI, Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(name || "Your Name", 540, 700);
}

function drawTemplateThumbnail(canvasEl, template) {
  const tctx = canvasEl.getContext("2d");
  const gradient = tctx.createLinearGradient(0, 0, 160, 160);
  gradient.addColorStop(0, template.bgTop);
  gradient.addColorStop(1, template.bgBottom);
  tctx.fillStyle = gradient;
  tctx.fillRect(0, 0, 160, 160);
  tctx.fillStyle = template.accent;
  tctx.globalAlpha = 0.35;
  tctx.beginPath();
  tctx.arc(120, 38, 24, 0, Math.PI * 2);
  tctx.fill();
  tctx.globalAlpha = 1;
  tctx.font = "600 13px Inter, Arial";
  tctx.textAlign = "center";
  tctx.fillText("Eid", 80, 90);
}

function renderTemplatePicker() {
  templateGrid.innerHTML = "";

  templates.forEach((template) => {
    const wrapper = document.createElement("button");
    wrapper.type = "button";
    wrapper.className = `template-option${template.id === selectedTemplateId ? " selected" : ""}`;
    wrapper.setAttribute("role", "radio");
    wrapper.setAttribute("aria-checked", String(template.id === selectedTemplateId));

    const thumb = document.createElement("canvas");
    thumb.width = 160;
    thumb.height = 160;
    thumb.className = "thumb";
    drawTemplateThumbnail(thumb, template);

    const label = document.createElement("span");
    label.className = "template-name";
    label.textContent = template.name;

    wrapper.appendChild(thumb);
    wrapper.appendChild(label);

    wrapper.addEventListener("click", () => {
      selectedTemplateId = template.id;
      renderTemplatePicker();
      refreshPreview();
    });

    templateGrid.appendChild(wrapper);
  });
}

function refreshPreview() {
  const template = templates.find((item) => item.id === selectedTemplateId) ?? templates[0];
  const name = nameInput.value.trim();
  drawCard(template, name);
}

generateBtn.addEventListener("click", () => {
  refreshPreview();
  const pngUrl = canvas.toDataURL("image/png");
  downloadBtn.href = pngUrl;
  downloadBtn.classList.remove("hidden");
});

nameInput.addEventListener("input", refreshPreview);

renderTemplatePicker();
refreshPreview();
