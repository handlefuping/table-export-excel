import TableParser from './internal/parser/parse.js'
import Excel from './internal/excel.js'

export { TableParser, Excel }

const table2excel = (tables: HTMLTableElement[]) => {
    const tableParser = tables.map(table => {
        return new TableParser(table)
    })
    // console.log(tableParser);

    const generator = new Excel(tableParser)
    generator.generateSheet('table2excel')
    generator.traverseCell(
        cell => {
            console.log(
                cell.getStyle('backgroundColor', ['rgba(0, 0, 0, 0)']),
                cell,
            )
            return {
                value: cell.node.innerText,
                font: { bold: true, name: 'Comic Sans MS' },
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle',
                },
            }
        },
        row => {
            const height = row.getStyle('height')
            console.log(height, 111121)

            return { height }
        },
        true,
    )
    // generator.downLoad('21111.xlsx')
}

export default table2excel
