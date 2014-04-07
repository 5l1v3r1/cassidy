class App.ServicesCollection extends Backbone.Collection
  model: App.ServiceModel

  setStorage: ->
    if Backbone.DropboxDatastore.client.isAuthenticated()
      @dropboxDatastore = new Backbone.DropboxDatastore('services')
    else
      @localStorage = new Backbone.LocalStorage("services")

  initialize: ->
    @setStorage()

    if @dropboxDatastore
      @dropboxDatastore.syncCollection(this)

  comparator: (model) ->
    model.get('service')

  syncLocalToRemote: ->
    originalCollection = this
    @dropboxDatastore = null
    @localStorage = new Backbone.LocalStorage("services")
    @fetch
      success: (collection, response, options) ->
        remote = new App.ServicesCollection()
        collection.each (m) ->
          data = m.toJSON()
          delete data.id
          data.settings = JSON.stringify(data.settings)
          remote.create(data)

  toDataset: ->
    name: 'service'
    source: @substringMatcher(@pluck('service'))

  substringMatcher: (strs) ->
    findMatches = (q, cb) ->
      matches = undefined
      substringRegex = undefined

      # an array that will be populated with substring matches
      matches = []

      # regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, "i")

      # iterate through the pool of strings and for any string that
      # contains the substring `q`, add it to the `matches` array
      $.each strs, (i, str) ->

        # the typeahead jQuery plugin expects suggestions to a
        # JavaScript object, refer to typeahead docs for more info
        matches.push value: str  if substrRegex.test(str)
        return

      cb matches
      return

  stats: ->
    _.map @topUsed(), (m) -> m.attributes

  topUsed: (limit = 5) ->
    collection = new App.ServicesCollection(@reject (m) -> !m.get('usage'))
    sorted = collection.sortBy('usage').reverse()
    _.first(sorted, limit)

  mostUsed: ->
    @max (m) -> m.get('usage')
