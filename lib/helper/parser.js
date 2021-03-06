// Generated by CoffeeScript 1.4.0
(function() {
  var Parser, argReg, clean, lReg, sReg;

  lReg = /--([^-][-\w]+)/;

  sReg = /-((?:\w|[^-=\<\>]))(?:\s<([^\s]+)>)?/;

  argReg = /--([^-](?:\w|[^-=\<\>])+)(?:[\s=]\<([^\s]+)\>)?/;

  clean = function(str) {
    return str.trim().replace(/\s{2,}/g, " ");
  };

  Parser = (function() {

    function Parser(config) {
      this.options = [];
    }

    Parser.prototype.on = function(options, description, callback) {
      var opt, _ref;
      if (typeof description === "function") {
        _ref = ["", description], description = _ref[0], callback = _ref[1];
      }
      opt = this.inspect(options);
      opt.description = description;
      opt.callback = callback;
      return this.options.push(opt);
    };

    Parser.prototype.inspect = function(options) {
      var cur, parsed;
      cur = {};
      options = clean(options);
      parsed = lReg.exec(options);
      if (parsed != null) {
        options = options.replace(parsed[0], "").trim();
        cur.long = parsed[1];
        if (parsed[2] != null) {
          cur.arg = parsed[2];
        }
      }
      parsed = sReg.exec(options);
      if (parsed != null) {
        cur.short = parsed[1];
        if (parsed[2] != null) {
          cur.arg = parsed[2];
        }
      }
      cur.type = cur.arg != null ? "flag" : "switch";
      return cur;
    };

    Parser.prototype.trigger = function(opt, arg) {
      if (typeof opt.callback === "function") {
        opt.callback(arg);
      }
      return opt.callback = null;
    };

    Parser.prototype.run = function(argv) {
      var index, item, option, _i, _len, _ref, _results;
      argv = this._preArgv(argv);
      _ref = this.options;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (index = _j = 0, _len1 = argv.length; _j < _len1; index = ++_j) {
            item = argv[index];
            if (item.long === option.long && (option.long != null)) {
              _results1.push(this.trigger(option, item.arg));
            } else if (item.short === option.short && (option.short != null)) {
              this.trigger(option, item.arg);
              continue;
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Parser.prototype.output = function() {
      var result;
      result = [];
      this.options.forEach(function(opt) {
        var sep;
        sep = "";
        sep += opt.short ? "  -" + opt.short + "," : "     ";
        sep += opt.long ? "--" + opt.long + (opt.arg ? "<" + opt.arg + ">" : "   ") + "\t" : "  \t";
        sep += (opt.description || "") + "\n";
        return result.push(sep);
      });
      return result.join("");
    };

    Parser.prototype._preArgv = function(argv) {
      var option, result;
      option = argv.join(" ");
      option = option.replace(/(?:\s)-(\w{2,})/g, function(a, b, c) {
        var char, num, _i, _ref;
        char = [];
        for (num = _i = 0, _ref = b.length; 0 <= _ref ? _i < _ref : _i > _ref; num = 0 <= _ref ? ++_i : --_i) {
          char.push(" -" + b[num]);
        }
        return char.join(" ");
      });
      option = option.replace(/\=/g, " ");
      result = [];
      option.replace(/--([^-][\w-]*)(\s[^\s-]+)?|-\w(\s[^\s-]+)?/g, function(a) {
        var cur, seps;
        cur = {};
        seps = a.split(/\s+/);
        if (~seps[0].indexOf("--")) {
          cur.long = seps[0].slice(2);
        } else {
          cur.short = seps[0].slice(1);
        }
        cur.arg = seps[1];
        result.push(cur);
        return "";
      });
      return result;
    };

    return Parser;

  })();

  module.exports = Parser;

}).call(this);
