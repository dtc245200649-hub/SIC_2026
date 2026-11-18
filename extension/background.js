/**
 * SIC Misinformation Detector - Background Service Worker (Manifest V3)
 */

chrome.runtime.onInstalled.addListener(() => {
  // Tạo Context Menu khi bôi đen văn bản hoặc click vào liên kết
  chrome.contextMenus.create({
    id: "sic-verify-text",
    title: "🔍 Kiểm chứng tin giả bằng SIC AI: \"%s\"",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "sic-verify-link",
    title: "🔍 Kiểm chứng liên kết mạng xã hội với SIC AI",
    contexts: ["link", "page"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const backendUrl = "http://127.0.0.1:8000/api/v1";

  if (info.menuItemId === "sic-verify-text" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {
      action: "SHOW_VERIFY_LOADING",
      text: info.selectionText
    });

    try {
      const response = await fetch(`${backendUrl}/analysis/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: info.selectionText,
          title: "Kiểm chứng nhanh từ trình duyệt"
        })
      });
      const data = await response.json();
      chrome.tabs.sendMessage(tab.id, {
        action: "SHOW_VERIFY_RESULT",
        data: data
      });
    } catch (err) {
      chrome.tabs.sendMessage(tab.id, {
        action: "SHOW_VERIFY_ERROR",
        error: "Không thể kết nối đến máy chủ SIC AI Backend (http://127.0.0.1:8000). Vui lòng kiểm tra server."
      });
    }
  } else if (info.menuItemId === "sic-verify-link") {
    const targetUrl = info.linkUrl || info.pageUrl;
    chrome.tabs.sendMessage(tab.id, {
      action: "SHOW_VERIFY_LOADING",
      url: targetUrl
    });

    try {
      const response = await fetch(`${backendUrl}/social/analyze-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          analyze_cascade: true
        })
      });
      const data = await response.json();
      chrome.tabs.sendMessage(tab.id, {
        action: "SHOW_VERIFY_RESULT",
        data: data
      });
    } catch (err) {
      chrome.tabs.sendMessage(tab.id, {
        action: "SHOW_VERIFY_ERROR",
        error: "Lỗi kết nối tới máy chủ SIC AI."
      });
    }
  }
});
