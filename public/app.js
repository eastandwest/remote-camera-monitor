
const client = new SiRuClient('testroom', {key: '2c2ce3b1-109c-47b8-a375-bade5f77e2fd'})

client.on('connect', () => {
    client.on('device:connected', (uuid, profile) => {
      // request remote camera streaming
      client.requestStreaming(uuid)
        .then(stream => {
          document.querySelector('video').srcObject = stream
          console.log(stream)
        })

        // subscribe each topic
        client.subscribe('motiondetection')
    })

    client.on('message', (topic, mesg) => {
      document.querySelector('#score').innerHTML = mesg.score
      document.querySelector('#box').innerHTML = JSON.stringify(mesg.box)
    })
})
