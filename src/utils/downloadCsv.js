function escapeCsvValue(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function createTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function createFilename(menuName) {
  const safeMenuName = menuName.replace(/[\\/:*?"<>|]/g, "_");
  return `${safeMenuName}_${createTimestamp()}.csv`;
}

function reactNodeToText(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(reactNodeToText).join("");
  if (typeof node === "object" && "props" in node) {
    return reactNodeToText(node.props.children);
  }
  return "";
}

export function downloadCsv({ menuName, headers, rows }) {
  const csv = [
    headers.map(({ label }) => escapeCsvValue(label)).join(","),
    ...rows.map((row) =>
      headers.map(({ key }) => escapeCsvValue(row[key])).join(","),
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = createFilename(menuName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadTableCsv({ menuName, columns, rows }) {
  const exportColumns = columns
    .map((column) => ({
      ...column,
      exportKey: column.dataIndex ?? column.field,
      exportTitle: column.title ?? column.headerName,
    }))
    .filter(
      ({ exportKey, exportTitle, exportable = true }) =>
        exportable && exportKey && typeof exportTitle === "string",
    );

  downloadCsv({
    menuName,
    headers: exportColumns.map(({ exportKey, exportTitle }) => ({
      key: exportKey,
      label: exportTitle,
    })),
    rows: rows.map((row) =>
      Object.fromEntries(
        exportColumns.map(
          ({ exportKey, exportValue, render, valueFormatter }, index) => {
          const value = row[exportKey];
          const renderedValue = exportValue
            ? exportValue(value, row)
            : render
              ? render(value, row, index)
              : valueFormatter
                ? valueFormatter({ value, data: row })
              : value;
          return [exportKey, reactNodeToText(renderedValue)];
        }),
      ),
    ),
  });
}
