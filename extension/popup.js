const BACKEND_URL = "http://127.0.0.1:8000/api/v1";

document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("socialUrl");
  const btnAnalyze = document.getElementById("btnAnalyze");
  const resultBox = document.getElementById("resultBox");
  const badgeContainer = document.getElementById("badgeContainer");
  const confidenceText = document.getElementById("confidenceText");
  const summaryText = document.getElementById("summaryText");
  const riskText = document.getElementById("riskText");

  document.getElementById("btnSampleTiktok").addEventListener("click", () => {
    urlInput.value = "https://www.tiktok.com/@vtv24news/video/7182938491028374820";
  });

  document.getElementById("btnSampleFb").addEventListener("click", () => {
    urlInput.value = "https://www.facebook.com/thongtinchinhphu/posts/1029384756102938";
  });

  document.getElementById("btnCurrentTab").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      urlInput.value = tab.url;
    }
  });

  btnAnalyze.addEventListener("click", async () => {
    const url = urlInput.value.trim();
    if (!url) {
      alert("Vui lòng nhập đường dẫn TikTok hoặc Facebook.");
      return;
    }

    btnAnalyze.disabled = true;
    btnAnalyze.textContent = "Đang xử lý đa phương thức...";
    resultBox.style.display = "none";

    try {
      const response = await fetch(`${BACKEND_URL}/social/analyze-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url, analyze_cascade: true })
      });

      if (!response.ok) {
        throw new Error("Máy chủ phản hồi mã lỗi " + response.status);
      }

      const data = await response.json();
      resultBox.style.display = "block";

      const isFake = data.predicted_label === "SAI_SU_THAT";
      const isAccurate = data.predicted_label === "CHINH_XAC";
      const badgeClass = isFake ? "fake-badge" : isAccurate ? "real-badge" : "check-badge";
      const badgeName = isFake ? "SAI SỰ THẬT (FAKE NEWS)" : isAccurate ? "THÔNG TIN CHÍNH XÁC" : "CẦN KIỂM CHỨNG";

      badgeContainer.innerHTML = `<span class="badge-label ${badgeClass}">${badgeName}</span>`;
      confidenceText.textContent = `Nền tảng: ${data.platform} | Độ tin cậy: ${Math.round(data.confidence_score * 100)}%`;
      summaryText.textContent = data.multimodal_summary;
      riskText.textContent = `Nguy cơ lan truyền: ${data.propagation_risk_level} (Dự báo ảnh hưởng ~${data.cascade_nodes_predicted.toLocaleString()} tài khoản)`;
    } catch (err) {
      alert("Lỗi: Không thể kết nối tới máy chủ SIC AI (127.0.0.1:8000). Vui lòng đảm bảo backend đang chạy.");
    } finally {
      btnAnalyze.disabled = false;
      btnAnalyze.textContent = "Phân tích với SIC AI";
    }
  });
});
