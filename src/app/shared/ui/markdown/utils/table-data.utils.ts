export interface TableData {
  headers: string[];
  rows: string[][];
}

export const extractTableDataFromElement = (tableElement: HTMLElement): TableData => {
  const headers: string[] = [];
  const rows: string[][] = [];

  const headerCells = tableElement.querySelectorAll('thead th');
  for (const cell of headerCells) {
    headers.push(cell.textContent?.trim() ?? '');
  }

  const bodyRows = tableElement.querySelectorAll('tbody tr');
  for (const row of bodyRows) {
    const rowData: string[] = [];
    const cells = row.querySelectorAll('td');
    for (const cell of cells) {
      rowData.push(cell.textContent?.trim() ?? '');
    }
    rows.push(rowData);
  }

  return { headers, rows };
};

export const tableDataToCSV = (data: TableData): string => {
  const { headers, rows } = data;

  const escapeCSV = (value: string): string => {
    let needsEscaping = false;
    let hasQuote = false;
    for (const char of value) {
      if (char === '"') {
        needsEscaping = true;
        hasQuote = true;
        break;
      }
      if (char === ',' || char === '\n') {
        needsEscaping = true;
      }
    }

    if (!needsEscaping) {
      return value;
    }

    if (hasQuote) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return `"${value}"`;
  };

  const totalRows = headers.length > 0 ? rows.length + 1 : rows.length;
  const csvRows = new Array<string>(totalRows);
  let rowIndex = 0;

  if (headers.length > 0) {
    csvRows[rowIndex] = headers.map(escapeCSV).join(',');
    rowIndex += 1;
  }

  for (const row of rows) {
    csvRows[rowIndex] = row.map(escapeCSV).join(',');
    rowIndex += 1;
  }

  return csvRows.join('\n');
};

export const tableDataToTSV = (data: TableData): string => {
  const { headers, rows } = data;

  const escapeTSV = (value: string): string => {
    let needsEscaping = false;
    for (const char of value) {
      if (char === '\t' || char === '\n' || char === '\r') {
        needsEscaping = true;
        break;
      }
    }

    if (!needsEscaping) {
      return value;
    }

    const chunks: string[] = [];
    for (const char of value) {
      if (char === '\t') {
        chunks.push('\\t');
      } else if (char === '\n') {
        chunks.push('\\n');
      } else if (char === '\r') {
        chunks.push('\\r');
      } else {
        chunks.push(char);
      }
    }
    return chunks.join('');
  };

  const totalRows = headers.length > 0 ? rows.length + 1 : rows.length;
  const tsvRows = new Array<string>(totalRows);
  let rowIndex = 0;

  if (headers.length > 0) {
    tsvRows[rowIndex] = headers.map(escapeTSV).join('\t');
    rowIndex += 1;
  }

  for (const row of rows) {
    tsvRows[rowIndex] = row.map(escapeTSV).join('\t');
    rowIndex += 1;
  }

  return tsvRows.join('\n');
};

const escapeMarkdownCell = (value: string): string => {
  let needsEscaping = false;
  for (const char of value) {
    if (char === '|' || char === '\\') {
      needsEscaping = true;
      break;
    }
  }

  if (!needsEscaping) {
    return value;
  }

  const chunks: string[] = [];
  for (const char of value) {
    if (char === '|') {
      chunks.push('\\|');
    } else if (char === '\\') {
      chunks.push('\\\\');
    } else {
      chunks.push(char);
    }
  }
  return chunks.join('');
};

export const tableDataToMarkdown = (data: TableData): string => {
  const { headers, rows } = data;
  if (headers.length === 0) {
    return '';
  }

  const markdownRows: string[] = new Array(rows.length + 2);
  let rowIndex = 0;

  const escapedHeaders = headers.map((header) => escapeMarkdownCell(header));
  markdownRows[rowIndex] = `| ${escapedHeaders.join(' | ')} |`;
  rowIndex += 1;

  markdownRows[rowIndex] = `| ${new Array(headers.length).fill('---').join(' | ')} |`;
  rowIndex += 1;

  for (const row of rows) {
    const normalizedRow = new Array<string>(headers.length);
    for (let index = 0; index < headers.length; index += 1) {
      normalizedRow[index] = escapeMarkdownCell(row[index] ?? '');
    }
    markdownRows[rowIndex] = `| ${normalizedRow.join(' | ')} |`;
    rowIndex += 1;
  }

  return markdownRows.join('\n');
};
