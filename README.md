# audio-recorder
React component that allows you to record audio.

Based on: https://github.com/mattdiamond/Recorderjs

# How to use in your project
1. Copy/paste audio-recorder.js and recorder.js into files in the same directory.
2. import AudioRecorder from './path/to/audio-recorder'

# How to use
```
import AudioRecorder from './audio-recorder'
const recorder = new AudioRecorder()

recorder.record()

// Record stuff...

let recorded = []
recorder.stop().then(recordedUrls => {
  recorded = recordedUrls
})
```

# How to display audio recordings with React
```
<div>
  {recordedUrls.map(url =>
    <div key={url}>
      <audio controls={true} src={url} />
    </div>
  )}
</div>
```
