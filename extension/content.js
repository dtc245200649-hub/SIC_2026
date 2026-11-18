/**
 * SIC Misinformation Detector - Content Script
 * Tự động chèn giao diện cảnh báo và kiểm chứng vào Facebook & TikTok.
 */

// Lắng nghe tín hiệu từ Service Worker (Background)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SHOW_VERIFY_LOADING") {
    showOverlayModal("Đang phân tích...", "Đang đối soát dữ liệu với mạng nơ-ron học sâu PhoBERT + ViT...", "loading");
  } else if (request.action === "SHOW_VERIFY_RESULT") {
    renderAnalysisResult(request.data);
  } else if (request.action === "SHOW_VERIFY_ERROR") {
    showOverlayModal("Lỗi kết nối", request.error, "error");
  }
});

function createOrGetModal() {
  let modal = document.getElementById("sic-ai-floating-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "sic-ai-floating-modal";
    modal.className = "sic-modal-container";
    document.body.appendChild(modal);
  }
  return modal;
}

function showOverlayModal(title, message, type = "info") {
  const modal = createOrGetModal();
  modal.style.display = "block";
  modal.innerHTML = `
    <div class="sic-modal-card">
      <div class="sic-modal-header">
        <div class="sic-badge">SIC 2026 AI</div>
        <h4 class="sic-title">${escapeHtml(title)}</h4>
        <button class="sic-close-btn" onclick="document.getElementById('sic-ai-floating-modal').style.display='none'">✕</button>
      </div>
      <div class="sic-modal-body">
        <p class="sic-desc">${escapeHtml(message)}</p>
      </div>
    </div>
  `;
}

function renderAnalysisResult(data) {
  const modal = createOrGetModal();
  modal.style.display = "block";

  const isFake = data.predicted_label === "SAI_SU_THAT";
  const isAccurate = data.predicted_label === "CHINH_XAC";
  const badgeColor = isFake ? "#f43f5e" : isAccurate ? "#10b981" : "#f59e0b";
  const badgeText = isFake ? "CẢNH BÁO: SAI SỰ THẬT" : isAccurate ? "THÔNG TIN CHÍNH XÁC" : "CẦN KIỂM CHỨNG THÊM";

  const confidence = Math.round((data.confidence_score || 0.85) * 100);
  const riskLevel = data.propagation_risk_level ? `Mức độ nguy hại lan truyền: <strong>${data.propagation_risk_level}</strong>` : "";
  const summary = data.multimodal_summary || data.summary || "Đã kiểm chứng đối soát với kho dữ liệu báo chí chính thống.";

  modal.innerHTML = `
    <div class="sic-modal-card">
      <div class="sic-modal-header">
        <div class="sic-badge">SIC 2026 AI (PhoBERT + GNN)</div>
        <button class="sic-close-btn" onclick="document.getElementById('sic-ai-floating-modal').style.display='none'">✕</button>
      </div>
      <div class="sic-modal-body">
        <div class="sic-verdict-banner" style="background: ${badgeColor}22; border-color: ${badgeColor}88; color: ${badgeColor};">
          <div style="font-weight: 700; font-size: 13px;">${badgeText}</div>
          <div style="font-size: 11px;">Độ tin cậy: ${confidence}%</div>
        </div>
        <p class="sic-desc" style="margin-top: 10px;">${escapeHtml(summary)}</p>
        ${riskLevel ? `<p class="sic-risk">${riskLevel}</p>` : ""}
      </div>
      <div class="sic-modal-footer">
        <a href="http://localhost:5173" target="_blank" class="sic-btn-link">Mở Dashboard đầy đủ ↗</a>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
