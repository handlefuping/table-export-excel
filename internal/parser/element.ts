import { IParserElement } from '../../global'

class ParserElement implements IParserElement {
    node: HTMLElement
    parent: IParserElement | null
    children: IParserElement[] | null
    constructor(
        node: HTMLElement,
        parent: IParserElement | null,
        children: IParserElement[] | null,
    ) {
        this.node = node
        this.parent = parent
        this.children = children
    }
    getStyle(attribute: keyof CSSStyleDeclaration, exclude?: string[]): string {
        /* eslint-disable @typescript-eslint/no-this-alias */
        let current: IParserElement | null = this
        while (current) {
            const attr = window.getComputedStyle(current.node)[
                attribute
            ] as string
            if (Array.isArray(exclude) && exclude.includes(attr)) {
                current = current.parent
            } else {
                return attr
            }
        }
        return ''
    }
}

export default ParserElement
