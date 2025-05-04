import TableParser from './internal/parser/parse.js'
import Excel from './internal/excel.js'

export { TableParser, Excel }

const table2excel = (tables: HTMLTableElement[], options?: { sheetName?: string, downLoadName?: string }) => {
    const tableParser = tables.map(table => {
        return new TableParser(table)
    })
    const generator = new Excel(tableParser)

    generator.generateSheet(options?.sheetName || 'table2excel')
    generator.traverseCell(
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
    generator.downLoad(options?.downLoadName || 'table2excel.xlsx')
}

export default table2excel
