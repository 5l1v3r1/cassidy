var React = require('react');
var servicesStore = require('../stores/servicesStore');
var settingsStore = require('../stores/settingsStore');
var serviceActions = require('../actions/serviceActions');
var generator = require('../utils/generator');
var Suggestions = require('./Suggestions');

var Generator = React.createClass({
  _onChange() {
    this.setState({
      service: servicesStore.getSelectedService()
    }, () => {
      this.generateFromExistingService();
    });
  },

  getInitialState() {
    return {
      service: servicesStore.getSelectedService(),
      interestingDomain: 'google.com',
      result: ''
    }
  },

  componentDidMount() {
    servicesStore.addChangeListener(this._onChange);
    this.setState({
      interestingDomain: this.generateInterestingDomain()
    });
  },

  componentWillUnmount() {
    servicesStore.removeChangeListener(this._onChange);
  },

  generateFromExistingService() {
    if (_.isEmpty(this.state.service)) return;

    var service = this.state.service;

    _.extend(service.settings,
      settingsStore.getSettings(), {
      phrase: settingsStore.getDecryptedPhrase()
    });

    this.setState({
      result: generator(service)
    }, () => {
      this.selectResult();
    });
  },

  generateFromNewService(e) {
    var value = e.target.value;

    var service = {
      service: value,
      settings: settingsStore.getSettings()
    };

    _.extend(service.settings, {
      phrase: settingsStore.getDecryptedPhrase()
    });

    this.setState({
      service: service,
      result: generator(service)
    });
  },

  clearService() {
    this.setState({
      service: {}
    });
  },

  selectResult() {
    this.refs.result.getDOMNode().select();
  },

  generateInterestingDomain() {
    var service = _(servicesStore.getTopServices(10)).sample()
    if (service) {
      return service.service;
    }
  },

  render() {
    var placeholder = "Eg, " + this.state.interestingDomain;

    return (
      <div id="generator" className="col-sm-7 col-md-6 col-md-push-4 col-sm-push-5">
        <form>
          <div className="form-group">
            <input
              type="text"
              className="form-control input-lg"
              value={this.state.service.service}
              onChange={this.generateFromNewService}
              placeholder={placeholder}
              ref="service"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              autoFocus={true} />

            {this.state.service.service ? (
              <a href="#" className="clear" tabIndex="-1"
                onClick={this.clearService}>
                &times;
              </a>
            ) : ''}

            <div className="errors"></div>
          </div>

          {this.state.service.service && this.state.result ? (
            <div className="form-group">
              <input type="text" id="result"
                ref="result"
                value={this.state.result}
                onFocus={this.selectResult}
                readOnly />
            </div>
          ) : ''}
        </form>

        <Suggestions
          populate={this.props.populate}
          services={this.props.services} />
      </div>
    );
  }

});

module.exports = Generator;
