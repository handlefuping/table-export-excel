import { describe, test, beforeAll } from '@jest/globals'
import TableParser from '../internal/parser/parse'
import Excel from '../internal/excel'
import { IParserElement } from '../global.js'

function renderNormalHtml() {
    const div = document.createElement('table')
    div.innerHTML = `
    <tr>
         <td colspan="2"  id='colspan'>
            colspan
         </td>
      </tr>
      
      <tr>
         <td   width= "25% "rowspan="2" id='rowspan'> rowspan</td>  
         <td   width= "25% "> </td>  
      </tr>
      <tr>
 
         <td   width= "25% ">  last</td>  
      </tr>
  `
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
            (cell: IParserElement) => {
                return {
                    value: cell.node.innerText,
                }
            },
            () => ({}),
            true,
        )
    })
    test('merge colspan', () => {
        excel.sheet!.getCell('A1').value = 'colspan'
        excel.sheet!.getCell('B1').value = 'colspan'
    })
    test('merge rowspan', () => {
        excel.sheet!.getCell('A2').value = 'rowspan'
        excel.sheet!.getCell('A3').value = 'rowspan'
    })
    test('cell last', () => {
        excel.sheet!.getCell('B3').value = 'last'
    })
})
