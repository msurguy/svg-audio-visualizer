import { SVG } from '@svgdotjs/svg.js'
const padding = 30
const maxWidth = 2048
export default class SVGCircleRenderer {
  constructor (parentElement) {
    this.parent = parentElement
    this.element = null
    this.group = null
    this.counter = 0
    this.width = 600
    this.height = 600

    this.settings = {
      horizontalSpacer: 1.2,
      lineWidth: 1,
      samplingFrequency: 3,
      style: 'vertical',
      color: '#3322FF'
    }
    this.originalWidth = 600
    this.originalHeight = 600
  }

  addParent (parentNode) {
    this.parent = parentNode
  }

  attach (size) {
    this.originalWidth = size.width
    this.originalHeight = size.height
    this.element = SVG().addTo(this.parent).size(size.width, size.height)
    this.group = this.element.group()
    this.width = size.width
    this.height = size.height
  }

  render (values, style = 'vertical') {
    // console.log('rendering', this.element)
  }

  getDomNode () {
    return this.element.node
  }

  clear () {
    this.group.clear()
    this.counter = 0
    this.element.size(this.originalWidth, this.originalHeight)
  }

  resizeCanvas (newSize) {
    this.width = newSize.width
    this.height = newSize.height
    this.element.size(this.width, this.height)
  }

  drawSingleReading (value, style = 'vertical') {
    if (style === 'vertical') {
      const x1 = padding + this.counter * this.settings.horizontalSpacer
      // const y1 = value + this.height / 2
      // const y2 = -value + this.height / 2
      if ((x1 > this.width) && (x1 < maxWidth)) {
        this.resizeCanvas({ width: x1 + padding * 2, height: this.height })
      } else {
        this.group.circle(value).move(x1, (this.height / 2) - value / 2).stroke({ color: this.settings.color, width: this.settings.lineWidth, linecap: 'round' }).fill('none')
        this.counter = this.counter + this.settings.samplingFrequency // this can control "sampling" frequency. +2, +3 , +4
      }
    }
  }
}
