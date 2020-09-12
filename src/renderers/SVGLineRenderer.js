import { SVG } from '@svgdotjs/svg.js'
const padding = 10
const maxWidth = 2048
export default class SVGLineRenderer {
  constructor (parentElement) {
    this.parent = parentElement
    this.element = null
    this.group = null
    this.counter = 0
    this.width = 600
    this.height = 300

    this.settings = {
      horizontalSpacer: 1.2,
      lineWidth: 2,
      samplingFrequency: 3,
      style: 'vertical',
      color: '#3322FF'
    }
    this.originalWidth = 600
    this.originalHeight = 300
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
      const y1 = value + this.height / 2
      const x2 = padding + this.counter * this.settings.horizontalSpacer
      const y2 = -value + this.height / 2
      if ((x1 > this.width || x2 > this.width) && (x1 < maxWidth && x2 < maxWidth)) {
        this.resizeCanvas({ width: x1 + padding * 2, height: this.height })
      } else {
        this.group.line(x1.toFixed(2), y1.toFixed(2), x2.toFixed(2), y2.toFixed(2)).stroke({ color: this.settings.color, width: this.settings.lineWidth, linecap: 'round' })
        this.counter = this.counter + this.settings.samplingFrequency // this can control "sampling" frequency. +2, +3 , +4
      }
    }
  }
}
