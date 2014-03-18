'use strict';

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
  input: String,
  nr: String,
  start: Number,
  end: Number,
  time: Number,
  descr: String,
  user: Object,
  jiraid: String
});

// Public profile information
TaskSchema
  .virtual('task')
  .get(function() {
    return {
      'id': this._id,
      'jiraid': this.jiraid,
      'nr': this.nr,
      'start': this.start,
      'end': this.end,
      'time': this.time,
      'descr': this.descr
    };
  });
    
/**
 * Validations
 */
var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Plugins
 */
TaskSchema.plugin(uniqueValidator,  { message: 'Value is not unique.' });

/**
 * Pre-save hook
 */
TaskSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.nr))
      next(new Error('Invalid task nr'));
    else
      next();
  });

mongoose.model('Task', TaskSchema);