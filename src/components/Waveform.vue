<template>
<div>
<button @click="getWaveform">Waveform!</button>
  <svg ref="svg" width="1024" height="600"></svg>
</div>
</template>

<script>
import WaveformData from 'waveform-data'
import * as d3 from 'd3'
import { scaleLinear } from 'd3-scale'
export default {
  name: 'Waveform',
  methods: {
    getWaveform () {
      const audioContext = new AudioContext()

      fetch('./beatbox.ogg')
        .then(response => response.arrayBuffer())
        .then(buffer => {
          const options = {
            audio_context: audioContext,
            array_buffer: buffer,
            scale: 32
          }

          return new Promise((resolve, reject) => {
            WaveformData.createFromAudio(options, (err, waveform) => {
              if (err) {
                reject(err)
              } else {
                resolve(waveform)
              }
            })
          })
        })
        .then(waveform => {
          // console.log(`Waveform has ${waveform.channels} channels`)
          // console.log(`Waveform has length ${waveform.length} points`)

          const channel = waveform.channel(0)
          const layout = d3.select(this.$refs.svg)
          const x = scaleLinear()
          const y = scaleLinear()
          const offsetX = 100

          const minValue = channel.min_array()
          const maxValue = channel.max_array()

          x.domain([0, waveform.length]).rangeRound([0, 1024])
          y.domain([d3.min(minValue), d3.max(maxValue)]).rangeRound([offsetX, -offsetX])

          layout
            .selectAll('path')
            .data([maxValue])
            .enter()
            .append('path')
            .data([maxValue])
            .attr('fill', 'none')
            .attr('stroke', '#CCC')
            .attr('d', d3.line()
              .x((d, i) => x(i))
              .y((d, i) => y(d)))

          // const area = d3.area()
          //   .x((d, i) => x(i))
          //   .y0((d, i) => y(minValue[i]))
          //   .y1((d, i) => y(d))

          // const line = d3.line()
          //   .x((d, i) => x(i))
          //   .y((d, i) => y(d))
          // .curve(d3.curveMonotoneX) // apply smoothing to the line

          // maxValue.forEach((value) => {
          // const path = d3.path().moveTo(0, 20).lineTo(0, value)
          // const line = d3.line()
          //   .x((d, i) => x(i))
          //   .y((d, i) => y(d))

          // layout.selectAll('rect')
          //   .datum(maxValue)
          //   .append('rect')
          //   .attr('transform', () => `translate(0, ${offsetX})`)
          //   .attr('fill', 'none')
          //   .attr('x', (d) => {
          //     return Math.random() * 200
          //   })
          //   .attr('y', (d) => {
          //     return Math.random() * 200
          //   })
          //   .attr('width', 2)
          //   .attr('height', (d) => {
          //     return Math.random() * 100
          //   })
          //   .attr('stroke', '#CCC')
          // })

          // layout.append('path')
          //   .data([maxValue])
          //   .attr('transform', () => `translate(0, ${offsetX})`)
          //   .attr('fill', 'none')
          //   .attr('stroke', '#CCC')
          //   .attr('d', line)
          // layout.append('line')
          //   .data([maxValue])
          //   .attr('x1', 0)
          //   .attr('y1', 0)
          //   .attr('x2', () => { return Math.random() * 100 })
          //   .attr('y2', 120)
          //   .attr('width', 2)
          //   .attr('stroke', '#CCC')

          // const canvas = this.$refs.canvas
          // const scaleY = (amplitude, height) => {
          //   const range = 256
          //   const offset = 128
          //
          //   return height - ((amplitude + offset) * height) / range
          // }
          //
          // const ctx = canvas.getContext('2d')
          // ctx.beginPath()
          //
          // const channel = waveform.channel(0)
          //
          // // Loop forwards, drawing the upper half of the waveform
          // for (let x = 0; x < waveform.length; x++) {
          //   const val = channel.max_sample(x)
          //
          //   ctx.lineTo(x + 2, scaleY(val, canvas.height) + 1)
          // }
          //
          // // Loop backwards, drawing the lower half of the waveform
          // for (let x = waveform.length - 1; x >= 0; x--) {
          //   const val = channel.min_sample(x)
          //
          //   ctx.lineTo(x + 2, scaleY(val, canvas.height) + 1)
          // }
          //
          // ctx.closePath()
          // ctx.stroke()
          // ctx.fill()
        })
    }
  }
}
</script>

<style scoped>

</style>
