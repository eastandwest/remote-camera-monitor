Vue.component('video-view', {
    // todo-item コンポーネントはカスタム属性のような "プロパティ" で受け取ります。
    // このプロパティは todo と呼ばれます。
  props: ['width', 'height', 'camera', 'last_updated', 'show_boundary'],
  template: `
    <div ref="component">
      <span ref="hidden">{{last_updated}}</span>
      <video ref="v" autoplay></video>
      <canvas ref="boundary-canvas"></canvas>
      <canvas ref="score-canvas"></canvas>
    </div>`,
  updated: function() {
    if(this.show_boundary) this.updateBoundaryCanvas()
    else this.clearBoundaryCanvas()
  },
  data: function() {
    return {
      new_score: Math.floor(this.camera.score * 100) / 100
    }
  },
  methods: {
    init() {
      this.component = this.$refs.component
      this.video = this.$refs.v
      this.boundaryCanvas = this.$refs['boundary-canvas']
      this.boundaryCtx = this.boundaryCanvas.getContext('2d')
      this.scoreCanvas = this.$refs['score-canvas']
      this.scoreCtx = this.scoreCanvas.getContext('2d')

      this.$refs['hidden'].style.display = 'none'


      this.component.style.position = 'relative'
      this.video.style.position = 'absolute'
      this.boundaryCanvas.style.position = 'absolute'
      this.scoreCanvas.style.position = 'absolute'
    },
    changeFrame() {
      this.component.style.width = this.width.slice(-1) === "%" ? this.width : this.width + "px"
      this.component.style.height = this.height.slice(-1) === "%" ? this.height : this.height + "px"
    },
    clearBoundaryCanvas() {
      this.boundaryCanvas.width = this.video.clientWidth
      this.boundaryCanvas.height = this.video.clientHeight

      this.boundaryCtx.clearRect(0, 0, this.boundaryCanvas.width, this.boundaryCanvas.height)
    },
    updateBoundaryCanvas() {
      if(!this.camera.boundary) return
      this.boundaryCanvas.width = this.video.clientWidth
      this.boundaryCanvas.height = this.video.clientHeight

      this.boundaryCtx.strokeStyle = 'yellow'
      this.boundaryCtx.lineWidth = 2
      this.boundaryCtx.clearRect(0, 0, this.boundaryCanvas.width, this.boundaryCanvas.height)

      const b = this.camera.boundary
      const x = b.x * this.video.clientWidth / this.video.videoWidth
      const y = b.y * this.video.clientHeight / this.video.videoHeight
      const w = b.width * this.video.clientWidth / this.video.videoWidth
      const h = b.height * this.video.clientHeight / this.video.videoHeight
      this.boundaryCtx.strokeRect(x, y, w, h)
    },
    updateScoreCanvas() {
      this.scoreCanvas.width = this.video.clientWidth
      this.scoreCanvas.height = this.video.clientHeight

      this.scoreCtx.clearRect(0, 0, this.scoreCanvas.width, this.scoreCanvas.height)

      const score = Math.floor(this.camera.score * 100) / 100
      const date = new Date()
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`

      this.scoreCtx.font = "bold 14px 'Arial'"
      this.scoreCtx.fillStyle = 'green'
      this.scoreCtx.fillText(`score: ${score}`, 10, 20)
      this.scoreCtx.fillText(`${new Date().toLocaleDateString()} ${time}`, 10, 36)
    }
  },
  mounted: function() {
    this.init()
    this.changeFrame()

    setInterval(() => {
      this.updateScoreCanvas()
    }, 30)

    this.$nextTick(() => {
      this.video.style.width = "100%"
      this.video.style.height = this.video.offsetWidth * 640 / 480
      this.video.srcObject = this.camera.stream
    })
  }
})


