import ExcelJS from 'exceljs'
import {
    CellRender,
    IExcel,
    ITableParser,
    RowStyleRender,
    SheetOptions,
} from '../global'

class Excel implements IExcel {
    public workbook: ExcelJS.Workbook
    public sheet: ExcelJS.Worksheet | undefined
    readonly tableParsers: ITableParser[]
    constructor(tableParsers: ITableParser[]) {
        if (!Array.isArray(tableParsers)) {
            throw new Error('必须为数组')
        }
        this.workbook = new ExcelJS.Workbook()
        this.tableParsers = tableParsers
    }
    private validSheet(): never | undefined {
        if (!this.sheet) {
            throw new Error('请初始化sheet')
        }
    }

    public generateSheet(name?: string, options?: SheetOptions): Excel {
        this.sheet = this.workbook.addWorksheet(name, options)
        return this
    }
    public traverseCell(
        renderCell: CellRender,
        rowStyleRender: RowStyleRender,
        mergeCell?: boolean,
    ): IExcel {
        this.validSheet()
        let currentRowIndex = 0
        this.tableParsers.forEach(tableParser => {
            tableParser.table.children!.forEach(rowParser => {
                const sheetRow = this.sheet!.getRow(currentRowIndex + 1)
                // 设置表单row的样式
                Object.assign(
                    sheetRow,
                    rowStyleRender(rowParser, currentRowIndex + 1),
                )
                rowParser.children!.forEach((cellParser, cellIndex) => {
                    if (!tableParser.mergeMap.has(cellParser)) {
                        Object.assign(
                            sheetRow.getCell(cellIndex + 1),
                            renderCell(
                                cellParser,
                                currentRowIndex + 1,
                                cellIndex + 1,
                            ),
                        )
                    }
                })
                currentRowIndex++
            })
        })

        if (mergeCell) {
            this.mergeCell(renderCell)
        }
        return this
    }
    public mergeCell(renderMergeCell: CellRender): IExcel {
        this.validSheet()
        let prevTableRows = 0
        this.tableParsers.forEach(tableParser => {
            tableParser.mergeMap.forEach((value, cellParser) => {
                this.sheet!.mergeCells(
                    prevTableRows + value[0] + 1,
                    value[1] + 1,
                    prevTableRows + value[2] + 1,
                    value[3] + 1,
                )
                Object.assign(
                    this.sheet!.getCell(
                        prevTableRows + value[0] + 1,
                        value[1] + 1,
                    ),
                    renderMergeCell(cellParser, value[0] + 1, value[1] + 1),
                )
            })
            prevTableRows += tableParser.table.children!.length
        })
        return this
    }

    public downLoad(filename: string) {
        this.workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            a.click()
        })
    }
}

export default Excel
