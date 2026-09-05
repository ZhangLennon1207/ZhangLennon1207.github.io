const root = document.documentElement;
const readSetting = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const saveSetting = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch {} };
let english = readSetting("journal-language") === "en";
const dictionary: Record<string, string> = {
  "首页":"Home", "归档":"Archive", "关于":"About", "栏目":"Sections", "标签":"Tags",
  "随笔":"Essays", "乐评":"Music", "旅行":"Travel", "哲学":"Philosophy", "技术":"Technology", "电影":"Cinema",
  "所有文章":"All writing", "这个栏目还没有文章，慢慢写。":"No writing here yet. All in good time.",
  "亮色":"Light", "暗色":"Dark", "跟随系统":"System", "目录":"Contents",
  "搜索":"Search", "搜索文章":"Search articles", "亮色模式":"Light mode", "暗色模式":"Dark mode", "系统":"System",
  "作者：":"Author:", "原文来源：":"Source:", "访问原文":"Read the original", "转载许可：":"License:",
  "查看授权协议":"View license", "选读":"Selected reading", " · 选读":" · Selected reading",
  "无标签":"No tags", "未分类":"Uncategorized", "没有找到结果":"No results found", "搜索中…":"Searching…",
};
function translate() {
  root.dataset.uiLang = english ? "en" : "zh";
  document.querySelectorAll<HTMLElement>("[data-zh][data-en]").forEach(el => {
    const value = english ? el.dataset.en : el.dataset.zh;
    if (value != null && el.textContent !== value) el.textContent = value;
    el.lang = english ? "en" : "zh-CN";
  });
  document.querySelectorAll<HTMLElement>("#navbar, #nav-menu-panel, #sidebar, .journal-archive-heading, .journal-empty, .article-source, .magazine-post-card, #post-container > .onload-animation, #light-dark-panel").forEach(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text & { originalText?: string };
      if (node.parentElement?.closest(".custom-md, .magazine-post-title, .magazine-article-title, script, style")) continue;
      const original = node.originalText || node.textContent?.trim() || "";
      const translated = dictionary[original] || (/^\d+ 分钟$/.test(original) ? original.replace("分钟","min read") : "");
      if (translated) { node.originalText = original; const next = english ? translated : original; if (node.textContent !== next) node.textContent = next; }
    }
  });
  document.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="search"]').forEach(el => {
    if (el.placeholder && !el.dataset.originalPlaceholder) el.dataset.originalPlaceholder = el.placeholder;
    if (el.dataset.originalPlaceholder) el.placeholder = english ? "Search writing…" : el.dataset.originalPlaceholder;
  });
  document.querySelectorAll<HTMLButtonElement>("[data-language-switch]").forEach(el => {
    const buttonText = english ? "中" : "EN";
    if (el.textContent !== buttonText) el.textContent = buttonText;
    el.setAttribute("aria-label", english ? "切换界面为中文" : "Switch interface to English");
    el.title = english ? "Article text stays in its original language" : "切换界面语言，文章保留原文";
  });
}
const progress = document.createElement("div");
progress.className = "reading-progress";
progress.setAttribute("aria-hidden", "true");
document.body.append(progress);
function updateProgress() {
  const article = document.querySelector<HTMLElement>("#post-container .markdown-content");
  if (!article) { progress.style.transform = "scaleX(0)"; return; }
  const box = article.getBoundingClientRect();
  const range = Math.max(1, box.height - window.innerHeight * .5);
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, -box.top / range))})`;
}
let scheduled = false;
window.addEventListener("scroll", () => { if (!scheduled) { scheduled = true; requestAnimationFrame(() => { updateProgress(); scheduled = false; }); } }, { passive: true });
window.addEventListener("resize", updateProgress);
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
function initialize() {
  translate();
  root.classList.remove("focus-reading");
  document.querySelectorAll<HTMLButtonElement>("[data-focus-reading]").forEach(b => b.setAttribute("aria-pressed", "false"));
  document.querySelectorAll<HTMLAudioElement>("[data-journal-audio]").forEach(a => {
    if (a.dataset.bound) return;
    a.dataset.bound = "true";
    a.addEventListener("play", () => a.closest(".listening-station")?.classList.add("is-playing"));
    ["pause","ended"].forEach(event => a.addEventListener(event, () => a.closest(".listening-station")?.classList.remove("is-playing")));
    a.addEventListener("error", () => { const s = a.parentElement?.querySelector(".music-status"); if (s) s.textContent = english ? "Audio unavailable. Try the music profile." : "音频暂时无法播放，请前往音乐主页。"; });
  });
  updateProgress();
}
document.addEventListener("click", async (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest("[data-language-switch]")) { english = !english; saveSetting("journal-language", english ? "en" : "zh"); translate(); }
  const preview = target?.closest<HTMLButtonElement>("[data-music-preview]");
  if (preview) {
    const panel = document.getElementById("music-preview");
    const slot = panel?.querySelector("[data-music-frame]");
    if (panel && slot) {
      const open = preview.getAttribute("aria-expanded") !== "true";
      preview.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      slot.replaceChildren();
      if (open) {
        const frame = document.createElement("iframe");
        frame.src = preview.dataset.musicPreview!;
        frame.title = english ? "Apple Music preview player" : "Apple Music 试听播放器";
        frame.allow = "autoplay; encrypted-media";
        frame.setAttribute("sandbox", "allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation");
        slot.append(frame);
      }
    }
  }
  const focus = target?.closest<HTMLButtonElement>("[data-focus-reading]");
  if (focus) { const active = root.classList.toggle("focus-reading"); focus.setAttribute("aria-pressed", String(active)); }
  const share = target?.closest<HTMLButtonElement>("[data-share-article]");
  if (share) {
    const status = share.parentElement?.querySelector(".share-result");
    const text = (zh: string, en: string) => { if (status) status.textContent = english ? en : zh; };
    try {
      if (navigator.share) { await navigator.share({ title: share.dataset.title, url: location.href }); text("已分享", "Shared"); }
      else { await navigator.clipboard.writeText(location.href); text("链接已复制", "Link copied"); }
    } catch (e) {
      if ((e as Error).name !== "AbortError") text("请从地址栏复制链接", "Copy the link from the address bar");
    }
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape") { root.classList.remove("focus-reading"); document.querySelector("[data-focus-reading]")?.setAttribute("aria-pressed","false"); } });
document.addEventListener("swup:page:view", () => {
  initialize();
  const counter = (window as unknown as { goatcounter?: { count: (data: {path: string; title: string}) => void } }).goatcounter;
  counter?.count({ path: location.pathname, title: document.title });
});
let pending = false;
new MutationObserver(() => { if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; translate(); }); } }).observe(document.body, { childList: true, subtree: true });
document.addEventListener("pointermove", (event) => {
  if (motion.matches || event.pointerType !== "mouse") return;
  const cover = document.querySelector<HTMLElement>(".journal-cover");
  if (!cover) return;
  const box = cover.getBoundingClientRect();
  if (event.clientY >= box.top && event.clientY <= box.bottom) {
    cover.style.setProperty("--orbit-x", `${(event.clientX - box.left - box.width / 2) * .018}px`);
    cover.style.setProperty("--orbit-y", `${(event.clientY - box.top - box.height / 2) * .018}px`);
  }
}, { passive: true });
initialize();
