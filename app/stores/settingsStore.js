'use strict';
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var registerActions = require('../utils/registerActions');
var storage = require('../utils/storage');
var settingsUtils = require('../utils/settingsUtils');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var _serviceIsActive = false;

var _state = {
  settings: {},
  phrase: ''
};

var _updateCache = function () {
  storage.set('settings', _state.settings);
};

var hydrate = function () {
  var savedSettings = storage.get('settings');
  var savedPhrase   = storage.get('phrase');

  _state.settings = savedSettings || settingsUtils.createDefaultSettings();
  _state.phrase = savedPhrase;

  _updateCache();
};

var update = function (data) {
  _state.settings[data.name] = data.value;
  if (!_serviceIsActive) {
    _updateCache();
  }
};

var resetSettings = function () {
  var newSettings = settingsUtils.createDefaultSettings();
  var key = _state.settings.key;
  _state.settings = newSettings;
  _state.settings.key = key;
  _updateCache();
};

var clearLocalSettings = function () {
  storage.remove('settings');
  storage.remove('phrase');
  _state = {
    settings: settingsUtils.createDefaultSettings(),
    phrase: ''
  };
};

var applySettings = function (data) {
  _state.settings = data.settings;
};

var savePhrase = function (phrase) {
  var phrase = settingsUtils.encryptPhrase(phrase, _state.settings.key);
  if (phrase) {
    _state.phrase = phrase;
    storage.set('phrase', _state.phrase);
  }
};

var decryptPhrase = function () {
  return settingsUtils.decryptPhrase(_state.phrase, _state.settings.key);
};

var settingsStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getState: function () {
    return _state;
  },

  getDecryptedPhrase: function () {
    return decryptPhrase();
  },
});

registerActions(settingsStore, {
  HYDRATE_SETTINGS: function () {
    hydrate();
  },

  CHANGE_SETTING: function (action) {
    update(action.data)
  },

  SET_ACTIVE_SERVICE: function (action) {
    _serviceIsActive = true;
    applySettings(action.data);
  },

  CLEAR_ACTIVE_SERVICE: function () {
    _serviceIsActive = false;
    hydrate();
  },

  CHANGE_PHRASE: function (action) {
    savePhrase(action.data);
  },

  RESET_SETTINGS: function () {
    resetSettings();
  },

  CLEAR_LOCAL_DATA: function () {
    clearLocalSettings();
  }
});

hydrate();
module.exports = settingsStore;
