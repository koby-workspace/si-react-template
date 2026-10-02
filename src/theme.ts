import { theme } from "antd";
import type { ThemeConfig } from "antd";

export type ThemeName = "classic-blue" | "soft-green" | "modern-purple" | "minimal-mono" | "warm-orange";

type ThemePalette = {
  primary: string;
  layout: string;
  container: string;
  header: string;
  headerText: string;
  sidebar: string;
  sidebarText: string;
  selected: string;
  selectedText: string;
  border: string;
  tableHeader: string;
};

type ThemePreset = {
  borderRadius: number;
  light: ThemePalette;
  dark: ThemePalette;
};

export const themeOptions: { value: ThemeName; label: string }[] = [
  { value: "classic-blue", label: "Classic Blue" },
  { value: "soft-green", label: "Soft Green" },
  { value: "modern-purple", label: "Modern Purple" },
  { value: "minimal-mono", label: "Minimal Mono" },
  { value: "warm-orange", label: "Warm Orange" },
];

const themePresets: Record<ThemeName, ThemePreset> = {
  "classic-blue": {
    borderRadius: 3,
    light: {
      primary: "#2563eb", layout: "#f0f3f8", container: "#ffffff",
      header: "#172b4d", headerText: "#ffffff",
      sidebar: "#203858", sidebarText: "#e6eefb",
      selected: "#2563eb", selectedText: "#ffffff",
      border: "#c8d2e2", tableHeader: "#e6edf7",
    },
    dark: {
      primary: "#60a5fa", layout: "#0b1424", container: "#142238",
      header: "#0e1b30", headerText: "#e6eefb",
      sidebar: "#10203a", sidebarText: "#dce8fb",
      selected: "#234a7a", selectedText: "#e6f1ff",
      border: "#344b68", tableHeader: "#1d3350",
    },
  },
  "soft-green": {
    borderRadius: 12,
    light: {
      primary: "#287a50", layout: "#f3f7ef", container: "#fffffb",
      header: "#dceedd", headerText: "#20452e",
      sidebar: "#e8f2e5", sidebarText: "#304c37",
      selected: "#c8e5cd", selectedText: "#1d5935",
      border: "#c5d8c3", tableHeader: "#e6f0df",
    },
    dark: {
      primary: "#75c997", layout: "#101a14", container: "#19291e",
      header: "#213c2b", headerText: "#e1f2e5",
      sidebar: "#1a3022", sidebarText: "#d5eadb",
      selected: "#30583d", selectedText: "#c5f0d2",
      border: "#3b5844", tableHeader: "#25412e",
    },
  },
  "modern-purple": {
    borderRadius: 10,
    light: {
      primary: "#7544c5", layout: "#f3effb", container: "#ffffff",
      header: "#6035a0", headerText: "#ffffff",
      sidebar: "#ece3f8", sidebarText: "#47316a",
      selected: "#d9c7f3", selectedText: "#4d248b",
      border: "#d2c3e7", tableHeader: "#ede4fa",
    },
    dark: {
      primary: "#bc95ed", layout: "#191123", container: "#261b35",
      header: "#3f265a", headerText: "#f2e7ff",
      sidebar: "#2c1c40", sidebarText: "#e7d8f8",
      selected: "#543575", selectedText: "#f0dfff",
      border: "#59416f", tableHeader: "#3a2750",
    },
  },
  "minimal-mono": {
    borderRadius: 0,
    light: {
      primary: "#303030", layout: "#f2f2f2", container: "#ffffff",
      header: "#ffffff", headerText: "#202020",
      sidebar: "#e8e8e8", sidebarText: "#303030",
      selected: "#303030", selectedText: "#ffffff",
      border: "#c9c9c9", tableHeader: "#e6e6e6",
    },
    dark: {
      primary: "#d0d0d0", layout: "#111111", container: "#202020",
      header: "#181818", headerText: "#eeeeee",
      sidebar: "#262626", sidebarText: "#dddddd",
      selected: "#d0d0d0", selectedText: "#202020",
      border: "#505050", tableHeader: "#333333",
    },
  },
  "warm-orange": {
    borderRadius: 6,
    light: {
      primary: "#b64b13", layout: "#fff6e8", container: "#fffdf8",
      header: "#994016", headerText: "#fff5e9",
      sidebar: "#ede3d6", sidebarText: "#5b4030",
      selected: "#f7cda3", selectedText: "#7d330d",
      border: "#ddc6ad", tableHeader: "#f5e3cb",
    },
    dark: {
      primary: "#f6ac6f", layout: "#20150f", container: "#302219",
      header: "#57301d", headerText: "#fff0de",
      sidebar: "#3b291e", sidebarText: "#efddc9",
      selected: "#74462a", selectedText: "#ffe1bd",
      border: "#6c4e39", tableHeader: "#493121",
    },
  },
};

export function getAppTheme(themeName: ThemeName, isDarkMode: boolean): ThemeConfig {
  const preset = themePresets[themeName];
  const palette = isDarkMode ? preset.dark : preset.light;

  return {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: palette.primary,
      colorBgLayout: palette.layout,
      colorBgContainer: palette.container,
      colorBgElevated: palette.container,
      colorBorder: palette.border,
      colorBorderSecondary: palette.border,
      borderRadius: preset.borderRadius,
      ...(themeName === "minimal-mono" ? { boxShadow: "none", boxShadowSecondary: "none" } : {}),
    },
    components: {
      Layout: {
        headerBg: palette.header,
        headerColor: palette.headerText,
        lightSiderBg: palette.sidebar,
        bodyBg: palette.layout,
      },
      Menu: {
        itemBg: palette.sidebar,
        itemColor: palette.sidebarText,
        itemHoverBg: palette.selected,
        itemHoverColor: palette.selectedText,
        itemSelectedBg: palette.selected,
        itemSelectedColor: palette.selectedText,
        itemActiveBg: palette.selected,
        itemBorderRadius: preset.borderRadius,
      },
      Table: {
        headerBg: palette.tableHeader,
        borderColor: palette.border,
        headerBorderRadius: preset.borderRadius,
      },
    },
  };
}
