/**
  MeDroid - Multimedia Transcoder Service.
  
  The following input formats are supported:

  images (all image formats supported by imagegraphics)
  videos (all video formats supported by ffmpeg/avconv)
  pdf

  (c) 2013 OptimalBits - MIT Licensed.
*/
"use strict";

var redis = require('redis'),
    Queue = require('bull'),
     util = require('util');
   
var TranscoderConfig = require('./presets.js');

var JOB_QUEUE_NAME = 'Medroid';

//
//  Returns the channel for informing on job progress.
//
function progressChannel(clientId){
  return 'medroid:'+clientId +':progress:';
}

//------------------------------------------------------------------------------
// 
//  Medroid Client
// opts: {
//   redis: {
//     port: 6379,
//     host: localhost
//     opts: {}
//   }
//  }
//------------------------------------------------------------------------------
var Medroid = function Medroid(opts){
  if(!this){
    return new Medroid(opts);
  }
  this.clientId = opts.clientId || 'default';
  this.jobQueue = Queue(JOB_QUEUE_NAME, opts);
  this.resultsQueueName = 'Medroid-client-'+this.clientId;
  this.resultsQueue = Queue(this.resultsQueueName, opts);

  // Open a sub channel with redis for receiving progress events.
  this.subClient = redis.createClient(opts.redis.port, opts.redis.host)

  var channel = progressChannel(this.clientId);
  this.subClient.subscribe(channel);

  var _this = this;  
  this.subClient.on('message', function(channel, msg){ 
    var data = JSON.parse(msg);
    _this.emit('progress', data.args, data.progress); 
  });

  this.receiveResult(function(job, done){
    try{
      if(job.data.result.err){
        var err = Error(job.data.result.err.message);
        err.stack = job.data.result.err.stack;
        _this.emit('failed', job.data.jobData, err);
      }else{
        _this.emit('completed', job.data.jobData, job.data.result);  
      }
      done();
    }catch(err){
      _this.emit('failed', job.data.jobData, err);
      done(err);
    }
  });
}

util.inherits(Medroid, require('events').EventEmitter);

Medroid.prototype.transcode = function(mimeType, args){
  // TODO: Check if supported mimeType
  var mime = mimeType.split('/');
  switch(mime[0]) {
    case 'video':
      args.outputPath = args.outputPath + '.mp4'; // Hack
      if(args.previewPath){
        args.previewPath += '.mp4';
      }
      return this.transcodeVideo(args);
    case 'image':
      args.outputPath = args.outputPath + '.jpg'; // Hack
      if(args.previewPath){
        args.previewPath += '.jpg';
      }
      return this.transcodeImage(args);
    case 'audio':
      args.outputPath = args.outputPath + '.mp3'; // Hack
      return this.transcodeAudio(args);
    case 'application':
      switch(mime[1]){
        case 'vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'vnd.ms-powerpoint':
          args.outputPath = args.outputPath + '.mp4'; // Hack
          if(args.previewPath){
           args.previewPath += '.mp4';
          }
          return this.transcodePPT(args);
        case 'pdf': 
          args.outputPath = args.outputPath + '.mp4'; // Hack
          if(args.previewPath){
            args.previewPath += '.mp4';
          }
          return this.transcodePDF(args);
      }
  }
}

Medroid.prototype.transcodeVideo = function(opts){ 
  var preset =  opts.presets ? opts.presets.video : opts.account.plan.quota.videoPreset;
  var config = TranscoderConfig.video[preset];
  config.preview = TranscoderConfig.video['320p'];
  return this._addJob("Video", config, opts);
}

Medroid.prototype.transcodeImage = function(opts){
  var preset =  opts.presets ? opts.presets.image : opts.account.plan.quota.imagePreset;
  var config = TranscoderConfig.image[preset];
  config.preview = TranscoderConfig.image['320p'];
  return this._addJob("Image", config, opts);
}

Medroid.prototype.transcodeAudio = function(opts){
  var preset =  opts.presets ? opts.presets.audio : opts.account.plan.quota.audioPreset || 'high';
  return this._addJob("Audio", TranscoderConfig.audio[preset], opts);
}

Medroid.prototype.transcodePPT = function(opts){
  var preset =  opts.presets ? opts.presets.ppt : opts.account.plan.quota.pptPreset;
  var config = TranscoderConfig.video[preset];
  config.preview = TranscoderConfig.video['320p'];
  return this._addJob("Powerpoint", config, opts);
}

Medroid.prototype.transcodePDF = function(opts){
  var preset =  opts.presets ? opts.presets.pdf : opts.account.plan.quota.pdfPreset;
  var config = TranscoderConfig.video[preset];
  config.preview = TranscoderConfig.video['320p'];
  return this._addJob("PDF", config, opts);
}

Medroid.prototype._addJob = function(mediaType, config, args){
  var data = {
    args: args,
    config: config,
    mediaType: mediaType,
    clientId: this.clientId,
    resultsQueueName: this.resultsQueueName
  }
  return this.jobQueue.add(data);
}

Medroid.prototype.receiveResult = function(cb){
  //
  // We may need to ignore certain responses here some massage the results
  // into something suitable for clients.
  //
  this.resultsQueue.process(cb);
}

//------------------------------------------------------------------------------

module.exports = Medroid;

