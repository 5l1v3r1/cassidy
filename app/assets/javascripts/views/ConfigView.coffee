App.ConfigView = Backbone.View.extend(
  el: $('#settings')
  tagName: "input"
  events:
    'change input': 'saveConfig'

  initialize: ->
    @model = new Config
    self = this
    @model.fetch(
      success: (model, response)->
        self.model.unset('0')
        self.model.set(response[0])
        self.render()
    )
    @import()

  import: ->
    if localStorage.hp_settings
      import_key = localStorage.hp_key
      import_settings = JSON.parse(localStorage.hp_settings)
      import_master = localStorage.hp_master

      import_settings.save_settings = import_settings.remember
      delete import_settings.remember
      delete import_settings.algorithm

      @model.set(
        master: import_master
        key: import_key
      )
      @model.set(import_settings)
      @model.save()

      localStorage.removeItem('hp_key')
      localStorage.removeItem('hp_settings')
      localStorage.removeItem('hp_master')
      console.log "Import successful"
      @render()

  render: ->
    config = @model.attributes
    for own index, value of config
      switch $("##{index}").attr('type')
        when "checkbox"
          $("##{index}").attr('checked', config[index])
          break
        else
          $("##{index}").val(config[index])
          break

  saveConfig: ->
    config = $('form', @el).serializeObject()
    config.key = config.key.toLowerCase()

    if config.save_settings
      @model.save(config)
    else
      @model.destroy()

    @saveMaster()
    AppView.focus()

  saveMaster: ->
    master = $('#master').val()
    if @model.get('save_master')
      if master.length > 0 && localStorage.master != master
        @model.save(master: master)
    else
      @model.unset('master')
      @model.save()
)

App.ConfigView = new ConfigView