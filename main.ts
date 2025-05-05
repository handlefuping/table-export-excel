import TableParser from './internal/parser/parse.js'
import Excel from './internal/excel.js'

export { TableParser, Excel }

const table2excel = (tables: HTMLTableElement[], options?: { sheetName?: string, downLoadName?: string }) => {
    const tableParser = tables.map(table => {
        return new TableParser(table)
    })
    const excel = new Excel(tableParser)

    excel.generateSheet(options?.sheetName || 'table2excel')
    excel.traverseCell(
        cell => {
            cell.generateStyle()
            return {
                value: cell.node.innerText,
                font: cell.getFont(),
                fill: cell.getFill(),
                alignment: cell.getAlignment(),
                border: cell.getBorder()
            }
        },
        row => {
            row.generateStyle()
            return { height: Number.parseFloat(row.getProperty('height')) }
        },
        true,
    )
    excel.downLoad(options?.downLoadName || 'table2excel.xlsx')
}

export default table2excel
