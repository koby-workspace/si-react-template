import { theme } from "antd";
import type { ThemeConfig } from "antd";
import { themeQuartz } from "ag-grid-community";

export type ThemeName = "classic-blue" | "soft-green" | "modern-purple" | "minimal-mono" | "warm-orange" | "atelier-stone";

const ATELIER_FONT_FAMILY = '"Segoe UI", "Noto Sans KR", "Malgun Gothic", sans-serif';

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
  text?: string;
  textSecondary?: string;
  hover?: string;
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
  { value: "atelier-stone", label: "Atelier Stone" },
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
  "atelier-stone": {
    borderRadius: 4,
    light: {
      primary: "#305c54", layout: "#f6f5f0", container: "#fffefa",
      header: "#fffefa", headerText: "#292f2b",
      sidebar: "#eeeee6", sidebarText: "#505950",
      selected: "#dce7df", selectedText: "#254c42",
      border: "#d6dbd2", tableHeader: "#eeeee7",
      text: "#292f2b", textSecondary: "#626b61", hover: "#e5e9e1",
    },
    dark: {
      primary: "#8bbcaf", layout: "#171e1b", container: "#202925",
      header: "#1c2420", headerText: "#e6e9df",
      sidebar: "#1c2420", sidebarText: "#bac4b8",
      selected: "#304b40", selectedText: "#c5dfcf",
      border: "#3e4b43", tableHeader: "#29352e",
      text: "#e6e9df", textSecondary: "#a9b5a7", hover: "#27382f",
    },
  },
};

export function getAppTheme(themeName: ThemeName, isDarkMode: boolean): ThemeConfig {
  const preset = themePresets[themeName];
  const palette = isDarkMode ? preset.dark : preset.light;
  const isAtelier = themeName === "atelier-stone";

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
      ...(isAtelier ? {
        fontFamily: ATELIER_FONT_FAMILY,
        colorText: palette.text,
        colorTextSecondary: palette.textSecondary,
        colorTextHeading: palette.text,
        controlHeight: 36,
        boxShadow: isDarkMode
          ? "0 12px 40px rgb(0 0 0 / 32%)"
          : "0 12px 40px rgb(41 47 43 / 10%)",
        boxShadowSecondary: isDarkMode
          ? "0 6px 24px rgb(0 0 0 / 28%)"
          : "0 6px 24px rgb(41 47 43 / 8%)",
      } : {}),
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
        itemHoverBg: palette.hover ?? palette.selected,
        itemHoverColor: palette.selectedText,
        itemSelectedBg: palette.selected,
        itemSelectedColor: palette.selectedText,
        itemActiveBg: palette.selected,
        itemBorderRadius: preset.borderRadius,
        ...(isAtelier ? { itemHeight: 42, itemMarginBlock: 6 } : {}),
      },
      ...(isAtelier ? {
        Button: {
          primaryShadow: "none", defaultShadow: "none", dangerShadow: "none",
          fontWeight: 500,
          primaryColor: isDarkMode ? "#172e25" : "#fffefa",
          ...(isDarkMode ? { colorPrimaryActive: "#719b91" } : {}),
        },
        Checkbox: { colorWhite: isDarkMode ? "#172e25" : "#fffefa" },
        Form: { labelColor: palette.textSecondary },
      } : {}),
    },
  };
}

export function getGridTheme(themeName: ThemeName, isDarkMode: boolean) {
  const preset = themePresets[themeName];
  const palette = isDarkMode ? preset.dark : preset.light;

  return themeQuartz.withParams({
    browserColorScheme: isDarkMode ? "dark" : "light",
    backgroundColor: palette.container,
    foregroundColor: palette.text ?? (isDarkMode ? "#eeeeee" : "#222222"),
    headerBackgroundColor: palette.tableHeader,
    borderColor: palette.border,
    accentColor: palette.primary,
    borderRadius: preset.borderRadius,
    wrapperBorderRadius: preset.borderRadius,
    fontFamily: "inherit",
    fontSize: 14,
    rowHeight: 48,
    headerHeight: 48,
    ...(themeName === "atelier-stone" ? {
      fontFamily: ATELIER_FONT_FAMILY,
      headerTextColor: palette.textSecondary,
      headerFontWeight: 600,
      rowHoverColor: palette.hover,
      selectedRowBackgroundColor: palette.selected,
      columnBorder: false,
      headerColumnBorder: false,
      headerColumnResizeHandleColor: "transparent",
      wrapperBorder: true,
    } : {}),
  });
}
