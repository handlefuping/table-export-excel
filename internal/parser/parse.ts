import { IParserElement, ITableParser, MergeArea } from '../../global'
import ParserElement from './element'

class TableParser implements ITableParser {
    readonly table: IParserElement
    readonly mergeMap: Map<IParserElement, MergeArea> = new Map()
    constructor(table: HTMLTableElement) {
        if (TableParser.isHTMLTableElement(table)) {
            this.table = new ParserElement(table, null, [])
            this.parse()
        } else {
            throw new Error('参数错误')
        }
    }
    static isHTMLTableElement(t: unknown): t is HTMLTableElement {
        return t instanceof HTMLTableElement
    }
    private getSpan(
        node: HTMLElement,
        type: 'colspan' | 'rowspan',
        freeSpan: number = 1,
    ): number {
        const span = node.getAttribute(type)
        if (!span) {
            return 1
        }
        if (span === '0') {
            return freeSpan
        } else {
            return +span
        }
    }
    private parse() {
        const rowElements = Array.from(this.table.node.querySelectorAll('tr'))
        const cellParserElementMatrix: IParserElement[][] = []
        rowElements.forEach((row, rowIndex) => {
            const rowParserElement = new ParserElement(row, this.table, [])
            this.table.children?.push(rowParserElement)

            let cellIndex = 0
            const tdElements = row.querySelectorAll('td')
            const thElements = row.querySelectorAll('th')
            const cellElements = Array.from(
                thElements.length > 0 ? thElements : tdElements,
            )
            cellElements.forEach(cell => {
                const cellParserElement = new ParserElement(
                    cell,
                    rowParserElement,
                    null,
                )
                // 寻找未被占位的索引
                while (cellParserElementMatrix[rowIndex]?.[cellIndex]) {
                    cellIndex++
                }
                // 设置元素合并区域
                const cellOffset =
                    this.getSpan(cellParserElement.node, 'colspan', 1) - 1
                const rowOffset =
                    this.getSpan(
                        cellParserElement.node,
                        'rowspan',
                        rowElements.length - rowIndex,
                    ) - 1
                // row超边界
                let endRowIndex =
                    rowIndex + rowOffset > rowElements.length - 1
                        ? rowElements.length - 1
                        : rowIndex + rowOffset
                if (cellOffset > 0 || rowOffset > 0) {
                    this.mergeMap.set(cellParserElement, [
                        rowIndex,
                        cellIndex,
                        endRowIndex,
                        cellIndex + cellOffset,
                    ])
                }
                // 设置占位元素
                for (; endRowIndex >= rowIndex; endRowIndex--) {
                    for (
                        let endCellIndex = cellIndex + cellOffset;
                        endCellIndex >= cellIndex;
                        endCellIndex--
                    ) {
                        if (
                            !Array.isArray(cellParserElementMatrix[endRowIndex])
                        ) {
                            cellParserElementMatrix[endRowIndex] = []
                        }
                        cellParserElementMatrix[endRowIndex][endCellIndex] =
                            cellParserElement
                    }
                }
            })
            rowParserElement.children?.push(
                ...cellParserElementMatrix[rowIndex],
            )
        })
    }
}

export default TableParser
