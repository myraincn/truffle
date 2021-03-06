var debug = require("debug")("provider"); // eslint-disable-line no-unused-vars
var Web3 = require("web3");

var wrapper = require("./wrapper");

module.exports = {
  wrap: function(provider, options) {
    return wrapper.wrap(provider, options);
  },

  create: function(options) {
    var provider;

    if (options.provider && typeof options.provider == "function") {
      provider = options.provider();
    } else if (options.provider) {
      provider = options.provider;
    } else if (options.websockets) {
      provider = new Web3.providers.WebsocketProvider(
        "ws://" + options.host + ":" + options.port
      );
    } else {
      provider = new Web3.providers.HttpProvider(
        "http://" + options.host + ":" + options.port
      );
    }

    return this.wrap(provider, options);
  },

  test_connection: function(provider, callback) {
    var web3 = new Web3();
    var fail = new Error(
      "Could not connect to your RPC client. Please check your RPC configuration."
    );

    web3.setProvider(provider);

    web3.eth
      .getCoinbase()
      .then(coinbase => callback(null, coinbase))
      .catch(() => callback(fail, null));
  }
};
