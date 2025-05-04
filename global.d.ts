export interface IParserNode {
    node: HTMLElement
    parent: IParserElement | null
    children: IParserElement[] | null
}
export type RowStyleRender = (row: IParserElement, rowIndex: number) => Row
export type Cell = Partial<ExcelJS.Style> & { value: ExcelJS.CellValue }
export type ParserElementProperty = keyof CSSStyleDeclaration
export interface IParserElement extends IParserNode {
    generateStyle()
    getFont(): {}
    getBorder(): {} | undefined
    getFill(): {} | undefined
    getAlignment():{}
    getProperty(property: ParserElementProperty)
}

export type CellRender = (
    cell: IParserElement,
    rowIndex: number,
    cellIndex: number,
) => Cell

export type Row = Partial<
    Pick<ExcelJS.Row, 'height' | 'hidden' | 'outlineLevel'>
>
export type SheetOptions = Partial<ExcelJS.AddWorksheetOptions>

export interface IExcel {
    readonly tableParsers: ITableParser[]
    traverseCell(
        renderCell: CellRender,
        rowStyleRender: RowStyleRender,
        mergeCell?: boolean,
    ): IExcel
    mergeCell(renderMergeCell: CellRender): IExcel
}

export type MergeArea = [number, number, number, number]
export interface ITableParser {
    readonly table: IParserElement
    readonly mergeMap: Map<IParserElement, MergeArea>
}


export class TableParser {
    constructor(table: HTMLTableElement)
    readonly table: IParserElement
    readonly mergeMap: Map<IParserElement, MergeArea>
    static isHTMLTableElement(t: unknown): t is HTMLTableElement
}

export class Excel {
    constructor(tableParsers: ITableParser[])
    public workbook: ExcelJS.Workbook
    public sheet: ExcelJS.Worksheet | undefined
    public traverseCell(
        renderCell: CellRender,
        rowStyleRender: RowStyleRender,
        mergeCell?: boolean,
    ): IExcel
    public mergeCell(renderMergeCell: CellRender): IExcel
    public downLoad(filename: string)
}

declare function table2excel(
    tables: HTMLTableElement[],
    options?: {
        sheetName?: string;
        downLoadName?: string;
    }
): void;




export default table2excel;
