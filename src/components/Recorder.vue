<template>
  <div>
    <button @click='startRecording'>Start</button>
    <button @click='stopRecording'>Stop</button>
    <button @click='clearCanvas'>Clear</button>
    <button @click='download'>Download</button>
    <div class="canvas" ref="canvas" :style="{ width: `${canvas.width}px`, height: `${canvas.height}px`}"></div>
  </div>
</template>

<script>
import SVGLineRenderer from '../renderers/SVGLineRenderer'
import SVGCircleRenderer from '../renderers/SVGCircleRenderer'
import fileDownload from 'svg-file-downloader'

let audioCtx
let analyser
let source
let animationFrame
let audioStream
let renderer

export default {
  name: 'Recorder',
  data () {
    return {
      error: null,
      ctx: null,
      playhead: 0,
      recording: false,
      renderer: {
        line: new SVGLineRenderer(),
        circle: new SVGCircleRenderer()
      },
      canvas: {
        width: 600,
        height: 400
      },
      volumes: [],
      amplitudeMultiplier: 500
    }
  },
  mounted () {
    if (!window.navigator.mediaDevices.getUserMedia) {
      // Use our helper method to show an error on the page
      this.error = 'We support the latest versions of Chrome, Firefox, Safari, and Edge. Update your browser and try your request again.'
    } else {
      this.onInitialize()
    }
  },
  methods: {
    clearCanvas () {
      renderer.clear()
    },
    download () {
      fileDownload(renderer.getDomNode(), 3, 'waveform.svg')
    },
    startRecording  () {
      window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      })
        // ...then we convert the mic stream to binary event stream messages when the promise resolves
        .then(this.streamAudio)
        .catch(() => {
          // console.log(error)
        })
    },
    onInitialize () {
      renderer = this.renderer.circle // Switch to this.renderer.line for line renderer!
      renderer.addParent(this.$refs.canvas)
      renderer.attach({ width: this.canvas.width, height: this.canvas.height })
    },
    onRecordingStarted () {

    },
    onVolumeReadingAdded (value) {
      renderer.drawSingleReading(value)
    },
    onRecordingComplete () {

    },
    streamAudio (userMediaStream) {
      // this.playhead = 0
      audioStream = userMediaStream
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      analyser = audioCtx.createAnalyser()
      analyser.minDecibels = -90
      analyser.maxDecibels = -10
      // analyser.smoothingTimeConstant = 0.85
      source = audioCtx.createMediaStreamSource(userMediaStream)
      source.connect(analyser)
      // analyser.connect(audioCtx.destination)
      this.visualize()
    },
    visualize () {
      analyser.fftSize = 2048
      let bufferLength = analyser.fftSize
      let dataArray = new Uint8Array(bufferLength)
      // const ctx = this.ctx
      // let playhead = this.playhead
      const draw = () => {
        animationFrame = requestAnimationFrame(draw)
        // counter++
        analyser.getByteTimeDomainData(dataArray)

        let total = 0
        let k = 0
        let float

        while (k < bufferLength) {
          float = (dataArray[k++] / 0x80) - 1
          total += (float * float)
        }
        let rms = this.amplitudeMultiplier * Math.sqrt(total / bufferLength)
        // TODO: map from 0 to 100 here for convenience?
        this.volumes.push(rms)
        this.onVolumeReadingAdded(rms)
      }
      draw()
    },
    stopRecording  () {
      // renderer.render()
      // console.log('recording stopped')
      // console.log(JSON.stringify(volumes))
      window.cancelAnimationFrame(animationFrame)
      audioStream.getTracks().forEach((track) => track.stop())
      source.disconnect()
      analyser.disconnect()
      audioCtx.close()
    }
  }
}
</script>
