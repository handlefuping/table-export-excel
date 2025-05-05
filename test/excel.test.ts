import { describe, test, beforeAll } from '@jest/globals'
import TableParser from '../internal/parser/parse'
import Excel from '../internal/excel'

function renderNormalHtml() {
    const style = document.createElement('style')
    style.textContent = `
    tr {
        height: 38px;
    }

    td {
    /* jest颜色不会转化使用rgb */
        border-bottom: 1px solid rgb(255, 255, 0);
        background-color: rgb(255, 255, 0);
        text-align: center;
        vertical-align: middle;
        font-size: 18px;
        font-style: italic;
        color: rgb(255, 255, 0)
    }`
    const div = document.createElement('table')
    div.innerHTML = `
    <tr>
         <td colspan="2"  id='colspan'>colspan</td>
      </tr>
      
      <tr>
         <td   width= "25% "rowspan="2" id='rowspan'>rowspan</td>  
         <td   width= "25% "></td>  
      </tr>
      <tr>
 
         <td   width= "25% ">last</td>  
      </tr>
  `
    document.body.appendChild(style)
    document.body.appendChild(div)
}



describe('excel test', () => {
    let excel: Excel
    beforeAll(() => {
        renderNormalHtml()
        const parseTable = new TableParser(document.querySelector('table')!)
        excel = new Excel([parseTable])
        excel.generateSheet('table2excel')
        excel.traverseCell(
            cell => {
                cell.generateStyle()
                return {
                    value: cell.node.textContent,
                    font: cell.getFont(),
                    fill: cell.getFill(),
                    alignment: cell.getAlignment(),
                    border: cell.getBorder()
                }
            },
            row => {
                row.generateStyle()
                return { height: Number.parseFloat(row.getProperty('height')) }
                return {}
            },
            true,
        )
    })

    test('merge colspan', () => {
        expect(excel.sheet!.getCell('A1').value).toBe('colspan')
        expect(excel.sheet!.getCell('B1').value).toBe('colspan')
    })
    test('merge rowspan', () => {
        expect(excel.sheet!.getCell('A2').value).toBe('rowspan')
        expect(excel.sheet!.getCell('A3').value).toBe('rowspan')
    })
    test('cell last', () => {
        expect(excel.sheet!.getCell('B3').value).toBe('last')
    })

    test('row height', () => {
        expect(excel.sheet!.getRow(1).height).toBeCloseTo(38)
    })
    test('cell style', () => {
        let cell = excel.sheet!.getCell('B2')
        expect(cell.font.size).toBe(18)
        expect(cell.font.italic).toBe(true)
        expect(cell.font.color).toEqual({ argb: 'FFFFFF00' })
        expect(cell.font.italic).toBe(true)
        expect(cell.alignment.vertical).toBe('middle')
        expect(cell.alignment.horizontal).toBe('center')
        expect(cell.border.bottom).toEqual({
            "style": "thin",
            "color": {
                "argb": "FFFFFF00"
            }
        })
        expect(cell.fill).toEqual({
            "type": "pattern",
            "pattern": "solid",
            "fgColor": {
                "argb": "FFFFFF00"
            }
        })
    })

})
