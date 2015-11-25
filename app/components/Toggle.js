var React = require('react');
var classNames = require('classnames');
var settingsUtils = require('../utils/settingsUtils');
var settingsStore = require('../stores/settingsStore');

var toggleFields = settingsUtils.toggleFields;

var Toggle = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    handleToggleChange: React.PropTypes.func.isRequired,
    settings: React.PropTypes.object.isRequired
  },

  getToggleClass() {
    var value = this.getValue();
    if (value) {
      return 'fa-toggle-on';
    } else {
      return 'fa-toggle-off';
    }
  },

  getValue() {
    return this.props.settings[this.props.name];
  },

  getLabel() {
    return toggleFields[this.props.name];
  },

  render() {
    var iconClasses = classNames("fa fa-lg pull-right", this.getToggleClass());

    return (
      <div className="toggle">
        <input
          type="checkbox"
          name={this.props.name}
          id={this.props.name}
          value={this.getValue()}
          onChange={this.props.handleToggleChange}
          checked={!!this.getValue()} />

        <label htmlFor={this.props.name}>
          {this.getLabel()}
          <i className={iconClasses}></i>
        </label>
      </div>
    );
  }
});

module.exports = Toggle;
