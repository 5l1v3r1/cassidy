var storageType = localStorage;

var storage = {
  cache: {},
  manifest: [],
  manifestKey: 'cache.manifest',

  initialize() {
    this.getManifest();
    this.cacheAll();
  },

  getManifest() {
    var manifest = this.get(this.manifestKey);
    if (manifest) {
      this.manifest = manifest;
    } else {
      this.saveManifest(this.manifest);
    }
  },

  saveManifest(newManfist) {
    this.manifest = newManfist;
    storageType.setItem(this.manifestKey,
      JSON.stringify(this.manifest));
  },

  addToManifest(key) {
    this.saveManifest(
      _(this.manifest).push(key).uniq().value()
    );
    this.cache[key] = this.get(key);
  },

  removeFromManifest(key) {
    this.saveManifest(
      _(this.manifest).remove(key).uniq().value()
    );
  },

  cacheAll() {
    var toRemove = [];

    _(this.manifest).each((k) => {
      var data = this.get(k);
      if (data) {
        this.cache[k] = data;
      } else {
        toRemove.push(k);
      }
    });

    if (toRemove.length) {
      this.saveManifest(_.reject(this.manifest, function(k) {
        return _.contains(toRemove, k);
      }));
    }
  },

  set(key, value) {
    storageType.setItem(key, JSON.stringify(value))
    this.addToManifest(key);
  },

  get(key) {
    var val = storageType.getItem(key);
    try {
      val = JSON.parse(val);
    } catch (e) {
      val
    }
    return val;
  },

  remove(key) {
    this.removeFromManifest(key);
    storageType.removeItem(key);
  },

  invalidate(key) {
    this.removeFromManifest(key);
  }
};

storage.initialize();

module.exports = storage;
