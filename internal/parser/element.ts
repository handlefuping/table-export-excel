import { IParserElement, ParserElementProperty } from '../../global'





class ParserElement implements IParserElement {
    node: HTMLElement
    parent: IParserElement | null
    children: IParserElement[] | null
    propertyMap: Map<ParserElementProperty, string> = new Map()
    static inheritProperty: ParserElementProperty[] = ['fontSize', 'fontWeight', 'fontStyle', 'textDecoration', 'textAlign', 'verticalAlign', 'color']
    static nonInheritProperty: [ParserElementProperty, string][] = [['outline', '0px'], ['borderTop', '0px'], ['borderLeft', '0px'], ['borderRight', '0px'], ['borderBottom', '0px'], ['backgroundColor', 'rgba(0, 0, 0, 0)'], ['height', '0px']]
    constructor(
        node: HTMLElement,
        parent: IParserElement | null,
        children: IParserElement[] | null,
    ) {
        this.node = node
        this.parent = parent
        this.children = children
    }
    static convertColor(rgbaStr: string) {
        const parts = rgbaStr.match(/[\d.]+/g) as RegExpMatchArray;
        const r = parseInt(parts[0]);
        const g = parseInt(parts[1]);
        const b = parseInt(parts[2]);
        const a = parseFloat(parts[3] || '1');
        const hex = [
            Math.round(a * 255).toString(16).padStart(2, '0'),
            r.toString(16).padStart(2, '0'),
            g.toString(16).padStart(2, '0'),
            b.toString(16).padStart(2, '0')
        ].join('').toUpperCase();

        return hex.length === 8 ? hex : 'FF000000';
    }
    static convertPx(pxStr: string) {
        let parseVal = Number.parseFloat(pxStr)
        return Number.isNaN(parseVal) ? 0 : parseVal
    }
    static convertBorder(dir: string, val?: string) {
        if (!val) {
            return {}
        } else {
            const rgb = val.match(/rgb\([0-9,\s\.]+\)/g)
            if (rgb && rgb[0]) {
                return { [dir]: { style: 'thin', color: { argb: ParserElement.convertColor(rgb[0]) } } }
            } else {
                return {}
            }
        }
    }
    getFont() {
        const fontSize = this.propertyMap.get('fontSize')
        const fontWeight = this.propertyMap.get('fontWeight')
        const fontStyle = this.propertyMap.get('fontStyle')
        const color = this.propertyMap.get('color')
        const underline = this.propertyMap.get('textDecoration')
        const outline = this.propertyMap.get('outline')
        return {
            size: fontSize && ParserElement.convertPx(fontSize),
            bold: fontWeight && +fontWeight > 400,
            italic: fontStyle && fontStyle !== 'normal',
            color: color && { argb: ParserElement.convertColor(color) },
            underline: underline && !underline.includes('none'),
            outline: outline && !outline.includes('none')
        }
    }
    getBorder() {
        const borderTop = this.propertyMap.get("borderTop")
        const borderBottom = this.propertyMap.get("borderBottom")
        const borderRight = this.propertyMap.get("borderRight")
        const borderLeft = this.propertyMap.get("borderLeft")

        return (borderTop || borderBottom || borderRight || borderLeft) && Object.assign({},
            ParserElement.convertBorder('top', borderTop),
            ParserElement.convertBorder('bottom', borderBottom),
            ParserElement.convertBorder('right', borderRight),
            ParserElement.convertBorder('left', borderLeft)
        )

    }
    getFill() {
        const backgroundColor = this.propertyMap.get('backgroundColor')
        return backgroundColor && {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: ParserElement.convertColor(backgroundColor) }
        }
    }
    getAlignment() {
        const textAlign = this.propertyMap.get('textAlign')
        const verticalAlign = this.propertyMap.get('verticalAlign')
        return {
            vertical: verticalAlign && ({
                'baseline': 'middle',
                'sub': 'bottom',
                'super': 'top',
                'text-top': 'top',
                'text-bottom': 'bottom'
            }[verticalAlign]) || verticalAlign,
            horizontal: textAlign && (({ star: 'left', end: 'right' })[textAlign] || textAlign)
        }
    }
    getProperty(property: ParserElementProperty) {
        return this.propertyMap.get(property)
    }
    generateStyle() {
        const properties = [...ParserElement.inheritProperty, ...ParserElement.nonInheritProperty];
        let current: IParserElement | null = this
        while (current && properties.length) {
            const nodeStyle = window.getComputedStyle(current.node)
            let index = 0
            while (index < properties.length) {
                let property = properties[index]
                if (Array.isArray(property)) {
                    const [pro, cond] = property
                    const proValue = nodeStyle[pro] as string
                    if (!proValue.includes(cond)) {
                        this.propertyMap.set(pro, proValue)
                        properties.splice(index, 1)
                    } else {
                        index++
                    }
                } else {
                    this.propertyMap.set(property, nodeStyle[property] as string)
                    properties.splice(index, 1)
                }
            }

            current = current.parent
        }
    }
}

export default ParserElement
