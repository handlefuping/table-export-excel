import { describe, expect, test, beforeAll } from '@jest/globals'
import TableParser from '../internal/parser/parse'

function renderNormalHtml() {
    const div = document.createElement('table')
    div.innerHTML = `
    <tr>
         <td colspan="2"  id='colspan'>
 
         </td>
      </tr>
      
      <tr>
         <td   width= "25% "rowspan="2" id='rowspan'>  </td>  
         <td   width= "25% ">  </td>  
      </tr>
      <tr>
 
         <td   width= "25% ">  </td>  
      </tr>
  `
    document.body.appendChild(div)
}

function renderAbnormalHtml() {
    const div = document.createElement('table')
    div.innerHTML = `
    <tr>
         <td   width= "25% " rowspan="0" id='rowspan'>  </td>  
         <td   width= "25% ">  </td>  
     </tr>
     <tr>
         <td   width= "25% " colspan="0" id='colspan'>  </td>  
     </tr>
  `
    document.body.appendChild(div)
}

describe('table parser', () => {
    describe('normal table', () => {
        let parseTable: TableParser
        beforeAll(() => {
            renderNormalHtml()
            parseTable = new TableParser(document.querySelector('table')!)
        })
        afterAll(() => {
            return document.body.removeChild(document.querySelector('table')!)
        })
        test('table rows', () => {
            expect(parseTable.table.children?.length).toBe(3)
        })
        test('colspan test', () => {
            const colspan = document.querySelector('#colspan')
            expect(parseTable.table.children![0].children![0].node).toBe(
                colspan,
            )
            expect(parseTable.table.children![0].children![1].node).toBe(
                colspan,
            )
        })

        test('rowspan test', () => {
            const rowspan = document.querySelector('#rowspan')
            expect(parseTable.table.children![1].children![0].node).toBe(
                rowspan,
            )
            expect(parseTable.table.children![2].children![0].node).toBe(
                rowspan,
            )
        })
        test('merge test', () => {
            expect(parseTable.mergeMap.size).toBe(2)
            expect(
                parseTable.mergeMap.get(
                    parseTable.table.children![0].children![0],
                ),
            ).toEqual([0, 0, 0, 1])
            expect(
                parseTable.mergeMap.get(
                    parseTable.table.children![1].children![0],
                ),
            ).toEqual([1, 0, 2, 0])
        })
    })

    describe('abnormal table', () => {
        let parseTable: TableParser
        beforeAll(() => {
            renderAbnormalHtml()
            parseTable = new TableParser(document.querySelector('table')!)
        })
        afterAll(() => {
            return document.body.removeChild(document.querySelector('table')!)
        })
        test('rowspan test', () => {
            const rowspan = document.querySelector('#rowspan')
            expect(parseTable.table.children![0].children![0].node).toBe(
                rowspan,
            )
            expect(parseTable.table.children![1].children![0].node).toBe(
                rowspan,
            )
        })
        test('colspan test', () => {
            const colspan = document.querySelector('#colspan')
            expect(parseTable.table.children![1].children![1].node).toBe(
                colspan,
            )
        })
        test('merge test', () => {
            expect(parseTable.mergeMap.size).toBe(1)
            expect(
                parseTable.mergeMap.get(
                    parseTable.table.children![0].children![0],
                ),
            ).toEqual([0, 0, 1, 0])
        })
    })
})
