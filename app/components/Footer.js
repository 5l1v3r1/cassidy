var React = require('react/addons');
require('../styles/footer.scss');

var Footer = React.createClass({
  propTypes: {
    dropboxIsAuth: React.PropTypes.bool.isRequired
  },

  _connectedClassName() {
    return this.props.dropboxIsAuth ? 'connected' : '';
  },

  _handleConnectDropbox(e) {
    e.preventDefault();
    this.props.connectDropbox();
  },

  _handleDisconnectDropbox(e) {
    e.preventDefault();
    this.props.disconnectDropbox();
  },

  render() {
    var cx = React.addons.classSet;
    var dropboxClasses = cx('btn btn-link connect-dropbox', this._connectedClassName());

    var dropboxButton = this.props.dropboxIsAuth ? (
      <a href="#"
        className={dropboxClasses}
        onClick={this._handleDisconnectDropbox}
        title="Disconnect Dropbox">
        <i className="fa fa-dropbox fa-lg"></i> Disconnect Dropbox
      </a>
    ) : (
      <a href="#"
        className={dropboxClasses}
        onClick={this._handleConnectDropbox}
        title="Connect Dropbox">
        <i className="fa fa-dropbox fa-lg"></i> Connect Dropbox
      </a>
    );

    return (
      <div id="footer" className="col-sm-8 col-sm-push-4 col-lg-9 col-lg-push-3">
        <div className="wrapper">
          <nav>
            <a href="https://github.com/nicinabox/cassidy">Source</a>
            <span className="text-muted">
              Made by <a href="http://twitter.com/nicinabox">@nicinabox</a>
            </span>
          </nav>

          {dropboxButton}
        </div>
      </div>
    );
  }

});

module.exports = Footer;
