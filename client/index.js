import React, {Component} from 'react'
import {render} from 'react-dom'
import AudioRecorder from './audio-recorder'

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
