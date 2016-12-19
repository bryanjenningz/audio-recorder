import React, {Component} from 'react'
import {render} from 'react-dom'

class App extends Component {
  constructor() {
    super()

    this.state = {
      recording: false,
      recordings: []
    }

    // Initialized in initAudio and startUserMedia
    this.audioContext = undefined
    this.recorder = undefined
  }

  componentDidMount() {
    this.initAudio()
  }

  initAudio() {
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
      window.URL = window.URL || window.webkitURL
      
      this.audioContext = new AudioContext
    } catch (e) {
      alert('There is no web audio support for this browser. Get the latest version of Google Chrome.')
    }
    
    navigator.getUserMedia({audio: true}, this.startUserMedia.bind(this), (e) => {
      console.log(`No audio: ${e}`)
    })
  }

  startUserMedia(stream) {
    const input = this.audioContext.createMediaStreamSource(stream)
    this.recorder = new Recorder(input)
  }

  createDownloadLink() {
    if (this.recorder) {
      this.recorder.exportWAV((blob) => {
        const url = URL.createObjectURL(blob)
        const downloadUrl = `${new Date().toISOString()}.wav`

        const recordingEntry = (
          <span>
            <audio controls={true} src={url}></audio>
            <a href={url} download={downloadUrl}>{downloadUrl}</a>
          </span>
        )

        this.setState({recordings: [...this.state.recordings, recordingEntry]})
      })
    }
  }

  startRecording() {
    if (this.recorder) {
      this.setState({recording: true})
      this.recorder.record()
    }
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop()
      this.setState({recording: false})
      this.createDownloadLink()
      this.recorder.clear()
    }
  }

  render() {
    const {recording, recordings} = this.state

    return (
      <div>
        <button onClick={this[`${recording ? 'stop' : 'start'}Recording`].bind(this)}>
          {recording ? 'Stop' : 'Start'}
        </button>
        
        {recordings.length ? <h2>Recordings</h2> : null}
        <div>
          {recordings.map((recording, i) => <div key={i}>{recording}</div>)}
        </div>
      </div>
    )
  }
}

render(<App />, document.querySelector('#root'))
