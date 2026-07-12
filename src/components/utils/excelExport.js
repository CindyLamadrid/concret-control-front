import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";

const HEADER_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD3D3D3" }, // gris claro
};

const HEADER_FONT = {
  bold: true,
  color: { argb: "FF000000" }, // negro
};

// Currency format
const MONEY_FORMAT = '$#,##0.00';

/**
 * Agrega un encabezado con logo de empresa al worksheet.
 * Las primeras 5 filas se reservan para el encabezado.
 * Los datos del reporte se agregan con ws.addRow() después de esta función.
 * @param {ExcelJS.Worksheet} ws
 * @param {ExcelJS.Workbook} wb
 * @param {object} options - { projectName, stageName, reportTitle, idCompany }
 */
export const addReportHeader = async (ws, wb, options = {}) => {
  const { projectName, stageName, reportTitle, idCompany } = options;
  const token = localStorage.getItem("token");

  // Intentar cargar el logo de la empresa
  if (idCompany && token) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SECURITY_URL_API}/company-logo`,
        {
          params: { idCompany },
          headers: { Authorization: `Bearer ${token}` },
          responseType: "arraybuffer",
        }
      );
      if (response.data && response.data.byteLength > 0) {
        const contentType = response.headers["content-type"] || "image/png";
        const ext = contentType.includes("jpeg") ? "jpeg" : "png";
        const imageId = wb.addImage({
          buffer: response.data,
          extension: ext,
        });
        ws.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: 120, height: 50 },
        });
      }
    } catch (err) {
      // No hay logo o error, continuar sin logo
    }
  }

  // Fila 1: título del reporte
  const r1 = ws.addRow([reportTitle || "REPORTE"]);
  r1.getCell(1).font = { bold: true, size: 12 };

  // Fila 2: proyecto
  const r2 = ws.addRow([`Proyecto: ${projectName || ""}`]);
  r2.getCell(1).font = { bold: true, size: 10 };

  // Fila 3: etapa
  const r3 = ws.addRow([`Etapa: ${stageName || ""}`]);
  r3.getCell(1).font = { size: 10 };

  // Fila 4: fecha
  const r4 = ws.addRow([`Fecha: ${new Date().toLocaleDateString()}`]);
  r4.getCell(1).font = { size: 9, italic: true };

  // Fila 5: separador vacío
  ws.addRow([]);
};

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
