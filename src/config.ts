import type { ExpressiveCodeConfig, LicenseConfig, NavBarConfig, ProfileConfig, SiteConfig } from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
  title: "BebopNeverStop",
  subtitle: "鸵鸟与大象的漫游",
  lang: "zh_CN",
  themeColor: { hue: 30, fixed: true },
  banner: {
    enable: false,
    src: "",
    position: "center",
    credit: { enable: false, text: "", url: "" },
  },
  toc: { enable: true, depth: 2 },
  favicon: [{ src: "/favicon.svg" }],
};
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
  ],
};
export const profileConfig: ProfileConfig = {
  avatar: "/images/spike.png",
  name: "Zhang Lennon",
  bio: "赛博达摩流浪者",
  links: [
    { name: "GitHub", url: "https://github.com/ZhangLennon1207", icon: "fa6-brands:github" },
    { name: "邮箱 Email", url: "mailto:zsy1296915274@gmail.com", icon: "fa6-regular:envelope" },
    { name: "X", url: "https://x.com/zhanglennonsy", icon: "fa6-brands:x-twitter" },
    { name: "豆瓣 Douban", url: "https://www.douban.com/people/x1296915274/", icon: "fa6-solid:book-open" },
    { name: "网易云音乐 NetEase Music", url: "https://music.163.com/#/user/home?id=2109569243", icon: "fa6-solid:compact-disc" },
    { name: "Telegram", url: "https://t.me/ZhangLennon", icon: "fa6-brands:telegram" },
  ],
};
export const journalConfig = {
  about: "行无辙迹，居无室庐，美好的事物把我们带到过去和未来",
  categories: ["随笔", "乐评", "旅行", "哲学", "技术", "电影"],
};
// Reprinted works display their own author and license on the article page.
export const licenseConfig: LicenseConfig = { enable: false, name: "", url: "" };
export const expressiveCodeConfig: ExpressiveCodeConfig = { theme: "github-dark" };
