import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const HEADER_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD3D3D3" }, // gris claro
};

const HEADER_FONT = {
  bold: true,
  color: { argb: "FF000000" }, // negro
};

// Chilean peso format: #.##0 with dot as thousands separator
const MONEY_FORMAT = '#,##0.00';

/**
 * Export array of plain objects to .xlsx with styled headers.
 * @param {Array} rows - array of plain objects (each key = column header)
 * @param {string} sheetName
 * @param {string} fileName - without extension
 * @param {string[]} moneyColumns - list of column header names that should use currency format
 */
export const exportToExcel = async (rows, sheetName, fileName, moneyColumns = []) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName);

  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  ws.columns = headers.map((h) => ({
    header: h,
    key: h,
    width: moneyColumns.includes(h) ? 18 : 20,
  }));

  // Style header row
  const headerRow = ws.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { horizontal: "center" };
  });

  // Add data rows and apply money format where needed
  rows.forEach((rowData) => {
    const row = ws.addRow(rowData);
    headers.forEach((h, colIndex) => {
      if (moneyColumns.includes(h)) {
        const cell = row.getCell(colIndex + 1);
        cell.numFmt = MONEY_FORMAT;
        cell.alignment = { horizontal: "right" };
      }
    });
  });

  const buffer = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};
