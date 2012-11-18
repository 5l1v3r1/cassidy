// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.DomainView = (function(_super) {

    __extends(DomainView, _super);

    function DomainView() {
      return DomainView.__super__.constructor.apply(this, arguments);
    }

    DomainView.prototype.tagName = 'li';

    DomainView.prototype.template = _.template($('#recent-domain-template').html());

    DomainView.prototype.events = {
      'click .remove': 'clear',
      'click .domain': 'load'
    };

    DomainView.prototype.initialize = function() {
      return this.model.on('destroy', this.remove, this);
    };

    DomainView.prototype.render = function(html) {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    };

    DomainView.prototype.clear = function(e) {
      e.preventDefault();
      return this.model.destroy();
    };

    DomainView.prototype.load = function(e) {
      e.preventDefault();
      app.SwipeView.swipe.next();
      $("#domain").val(this.model.get('url'));
      app.SecretView.render(this.model);
      return $('#secret')[0].setSelectionRange(0, 999);
    };

    return DomainView;

  })(Backbone.View);

}).call(this);
