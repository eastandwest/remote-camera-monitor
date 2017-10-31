
const client = new SiRuClient('testroom', {key: '2c2ce3b1-109c-47b8-a375-bade5f77e2fd'})

Vue.component('video-view', {
    // todo-item コンポーネントはカスタム属性のような "プロパティ" で受け取ります。
    // このプロパティは todo と呼ばれます。
  props: ['stream', 'score'],
  template: '<div><h1>score:{{ score }}</h1><div><video ref="v" :stream="stream" autoplay></video></div></div>',
  updated: function() {
    const score = Math.floor(this.score * 100) / 100
    this.score = score
  },
  mounted: function() {
    const score = Math.floor(this.score * 100) / 100
    this.score = score

    this.$nextTick(() => {
      this.$refs.v.srcObject = this.stream
    })
  }
})


const app = new Vue({
  el: "#app",
  data: {
    stream: null,
    score: 0
  }
})



client.on('connect', () => {
    client.on('device:connected', (uuid, profile) => {
      // request remote camera streaming
      client.requestStreaming(uuid)
        .then(stream => {
          // document.querySelector('video').srcObject = stream
          app.stream = stream
          console.log(stream)
        })

        // subscribe each topic
        client.subscribe('motiondetection')
    })

    client.on('message', (topic, mesg) => {
      app.score = mesg.score
      document.querySelector('#box').innerHTML = JSON.stringify(mesg.box)
    })
})
