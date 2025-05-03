export interface IParserNode {
    node: HTMLElement
    parent: IParserElement | null
    children: IParserElement[] | null
}

export interface IParserElement extends IParserNode {
    getStyle(attribute: keyof CSSStyleDeclaration, exclude?: string[]): string
}

export type CellRender = (
    cell: IParserElement,
    rowIndex: number,
    cellIndex: number,
) => Cell
export type RowStyleRender = (row: IParserElement, rowIndex: number) => Row
export type Cell = Partial<ExcelJS.Style> & { value: ExcelJS.CellValue }
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
