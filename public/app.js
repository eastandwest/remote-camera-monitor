const client = new SiRuClient('testroom', {key: '2c2ce3b1-109c-47b8-a375-bade5f77e2fd'})

client.on('connect', () => {
    client.on('device:connected', (uuid, profile) => {
      console.log(uuid)
      // request remote camera streaming
      client.requestStreaming(uuid)
        .then(stream => {
          // document.querySelector('video').srcObject = stream
          videoView.cameras.push({uuid, stream})
          videoView.cameras.push({uuid, stream})
        })

        // subscribe each topic
        client.subscribe('motiondetection')
    })

    client.on('message', (topic, mesg) => {
      videoView.lastUpdated = Date.now()
      const _uuid = mesg.uuid
      const _cameras = videoView.cameras.map(camera => {
        return camera.uuid === _uuid ? Object.assign({}, camera, {score: mesg.score, clusters: mesg.clusters}) : camera
      })

      videoView.cameras = _cameras
    })
})

document.querySelector("#show-boundary").addEventListener("change", ev => {
  videoView.show_boundary = ev.target.checked
})

const videoView = new Vue({
  el: "#monitor-app",
  data: {
    cameras: [],
    lastUpdated: 0,
    show_boundary: false
  }
})

