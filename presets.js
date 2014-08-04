/**
  Transcoder Configuration File
*/
var transcoderOptions = {
  video: {
    active: 'iphone',
    iphone: {
      width: '640',
      height: '640',
      format: 'mp4',
      videoBitrate: '1200000',
      videoCodec: 'libx264',
      audioBitrate: '128000',
      audioCodec: 'acc',
      extension: 'mp4',
      extra: []
    }
  },
  audio: {
    active: 'oga',
    oga: {
      format: 'ogg',
      audioBitrate: '128000',
      audioCodec: 'libvorbis',
      extension: 'oga',
      extra: []
    }
  },
  image: {
    active: 'png',
    png: {
      width: '800',
      height: '800',
      format: 'png',
      extension: 'png'
    }
  }
};

var VideoPresets = {
  'ppt':{
    width: '720',
    height: '720',
    format: 'mp4',
    videoBitrate: '700000',
    videoCodec: 'libx264',
    skipAudio: true,
    default: 'mp4',
    extra: []
  },
  '720p':{
    width: '720',
    height: '720',
    format: 'mp4',
    videoBitrate: '1200000',
    videoCodec: 'libx264',
    audioBitrate: '128000',
    audioCodec: 'acc',
    default: 'mp4',
    extra: []
  },
  '480p':{
    width: '480',
    height: '480',
    format: 'mp4',
    videoBitrate: '900000',
    videoCodec: 'libx264',
    audioBitrate: '96000',
    audioCodec: 'acc',
    default: 'mp4',
    extra: []
  },
  '360p':{
    width: '360',
    height: '360',
    format: 'mp4',
    videoBitrate: '75000',
    videoCodec: 'libx264',
    audioBitrate: '80000',
    audioCodec: 'acc',
    default: 'mp4',
    extra: []
  },
  '240p':{
    width: '240',
    height: '240',
    format: 'mp4',
    videoBitrate: '50000',
    videoCodec: 'libx264',
    audioBitrate: '60000',
    audioCodec: 'acc',
    default: 'mp4',
    extra: []
  }
}

var ImagePresets = {
  '720p': {
    formats: ['png','gif','jpg','jpeg'],
    default:'jpg',
    width: '720',
    height: '720',
    format: 'jpg'
  },
  '480p': {
    formats: ['png','gif','jpg','jpeg'],
    default:'jpg',
    width: '480',
    height: '480',
    format: 'jpg'
  },
  '360p': {
    formats: ['png','gif','jpg','jpeg'],
    default:'jpg',
    width: '360',
    height: '360',
    format: 'jpg'
  },
  '240p': {
    formats: ['png','gif','jpg','jpeg'],
    default:'jpg',
    width: '720',
    height: '720',
    format: 'jpg'
  }
}

var AudioPresets = {
  'high': {
    audioBitrate: '128000',
    audioCodec: 'libmp3lame',
    format: 'mp3',
    default: 'mp3',
  },
}

module.exports = {
  video: VideoPresets,
  image: ImagePresets,
  audio: AudioPresets,
};


