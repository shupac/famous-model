define(function(require, exports, module) {
    var OptionsManager = require('famous/core/OptionsManager');
    var EventHandler = require('famous/core/EventHandler');

    /*
     *  @constructor
     *  @name Model
     *  @example
     *      // Alarm.js in Data folder.
     *      define(function(require, exports, module) {
     *          var Model = require('famous/mvc/Model');
     *
     *          function Alarm ( options ) {
     *              Model.apply(this, arguments );
     *          }
     *
     *          Alarm.prototype = Object.create( Model.prototype );
     *          Alarm.prototype.constructor = Alarm;
     *
     *          Alarm.TYPE = {
     *              QUICK : 0,  // the main alarm on the home screen.
     *              CUSTOM : 1  // an alarm that can be customized to choose which days.
     *          }
     *
     *          // These are the default model values.
     *          Alarm.DEFAULT_OPTIONS = {
     *              'time'   : moment({ hour: 23, minute: 55 }).format(),
     *              'type'   : Alarm.TYPE.QUICK,
     *              'days'   : [],
     *              'active' : false,
     *              'name'   : 'Home'
     *          }
     *
     *          module.exports = Alarm;
     *      });
     *
     *      // In the same folder, new file.
     *      define(function(require, exports, module) {
     *
     *          var Alarm = require('./Alarm');
     *
     *          // creating a new alarm.
     *          var myAlarm = new Alarm({
     *              'name' : 'myAlarmName!'
     *          });
     *
     *          // listening to changes
     *          myAlarm.on('change:name', function (e) {
     *              console.log(e);
     *          });
     *
     *          // setting values
     *          myAlarm.set('name', 'newName');
     *
     *      });
     *
     *  @extends {@link OptionsManager}
     *  @description
     *      A data model, with an eventhandler.
     */

    function Model(options) {
        OptionsManager.call(this, Object.create(this.constructor.DEFAULT_OPTIONS) || {});

        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        if (options) this.patch(options);

        this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.on('change', this._handleChange);

        this.id = Model.ID++;
    }

    Model.ID = 0;

    Model.prototype = Object.create(OptionsManager.prototype);
    Model.prototype.constructor = Model;

    /*
     *  @name Model#_handleChange
     *  @description
     *      Takes all change events, and reemits them as sugared events.
     *  @example
     *      //  if you call:
     *      yourModel.set('time', '123');
     *
     *      //  you can listen to this event:
     *      yourModel.on('change:time', function (e) {
     *          console.log(e);
     *      });
     */
    Model.prototype._handleChange = function _handleChange(e) {
        var value = 'change:' + e.id;
        this.eventOutput.emit(value, e.value);
    }

    /*
     *  @name Model#toJSON
     *  @description Returns valid JSON object. Sugar.
     *  @returns {Object}
     */
    Model.prototype.toJSON = function toJSON() {
        return this.value();
    }

    /*
     *  @name Model#toString
     *  @description The stringified JSON object.
     *  @returns {String}
     */
    Model.prototype.toString = function toString() {
        return JSON.stringify(this.value());
    }

    Model.DEFAULT_OPTIONS = {};

    module.exports = Model;
});
