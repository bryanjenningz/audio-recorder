import React, {Component} from 'react'
import {render} from 'react-dom'

class AudioRecorder {
  constructor() {
    this.state = {
      isRecording: false,
      recordingBlobs: []
    }

    let audioContext
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
      window.URL = window.URL || window.webkitURL
      
      audioContext = new AudioContext()
    } catch (e) {
      alert('There is no web audio support for this browser. Get the latest version of Google Chrome.')
    }

    const startUserMedia = (stream) => {
      const input = audioContext.createMediaStreamSource(stream)
      this.recorder = new Recorder(input)
    }

    navigator.mediaDevices.getUserMedia({audio: true})
    .then(startUserMedia)
    .catch((e) => console.log(`No audio: ${e}`))
  }

  isRecording() {
    return this.state.isRecording
  }

  record() {
    this.state.isRecording = true
    this.recorder.record()
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.recorder.stop()
      this.recorder.exportWAV((blob) => {
        this.state.isRecording = false
        this.state.recordingBlobs.push(blob)
        resolve(this.getRecordingUrls())
      })
      this.recorder.clear()
    })
  }

  getRecordingUrls() {
    return this.state.recordingBlobs.map(blob => URL.createObjectURL(blob))
  }
}

class DisplayAudioRecordings extends Component {
  constructor() {
    super()
    this.state = {
      isRecording: false,
      recordingUrls: []
    }
    this.recorder = new AudioRecorder()
  }

  record() {
    this.recorder.record()
    this.setState({isRecording: true})
  }

  stop() {
    this.recorder.stop().then(recordingUrls => {
      this.setState({recordingUrls, isRecording: false})
    })
  }

  render() {
    const {isRecording, recordingUrls} = this.state
    return (
      <div>
        <button onClick={() => this[isRecording ? 'stop' : 'record']()}>
          {isRecording ? 'Stop' : 'Record'}
        </button>
        {recordingUrls.map(url =>
          <div key={url}><audio controls={true} src={url} /></div>
        )}
      </div>
    )
  }
}

render(<DisplayAudioRecordings />, document.querySelector('#root'))
