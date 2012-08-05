App.Config = Backbone.Model.extend(
  localStorage: new Store("settings")
  defaults:
    key: ''
    length: 10
    caps: true
    symbols: true
    # save_settings: false
    save_master: false

  initialize: ->
    @set(key: @newKey())

  newKey: ->
    Crypto.SHA256(new Date().getTime().toString()).substr(0, 5)
)