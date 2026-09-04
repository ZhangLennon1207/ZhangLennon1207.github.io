import type { ExpressiveCodeConfig, LicenseConfig, NavBarConfig, ProfileConfig, SiteConfig } from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
  title: "BebopNeverStop",
  subtitle: "鸵鸟还是大象的漫游",
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
  bio: "鸵鸟还是大象的漫游",
  links: [],
};
export const journalConfig = {
  about: "行无辙迹，居无室庐，美好的事物把我们带到过去和未来",
  categories: ["随笔", "乐评", "旅行", "哲学", "AI", "电影"],
};
// Reprinted works display their own author and license on the article page.
export const licenseConfig: LicenseConfig = { enable: false, name: "", url: "" };
export const expressiveCodeConfig: ExpressiveCodeConfig = { theme: "github-dark" };
