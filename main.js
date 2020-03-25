var http = require("http");
var fs = require("fs-plus");
var ServeStatic = require("serve-static");
var finalhandler = require("finalhandler");
var url = require("url");
var path = require("path");
var os = require("os");

require("string.prototype.startswith");

var GetEnv = function(env) {
  if (process.env[env] != undefined) {
    return process.env[env];
  }
  else {
    return false;
  }
}

var UserLocation = GetEnv("HOME");

var UserHome = GetEnv("HOME");
var UserName = GetEnv("USER");
var ComputerName = os.hostname();

var AsteriskThing = function(string, rule) {
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(string);
}

var serve = ServeStatic(__dirname + "/frontend");
var server = http.createServer(function(req, res) {
  serve(req, res, finalhandler(req, res));

  console.log("Request landed at " + req.url);

  if (req.url == "/frontendutils/hostname") {
    fs.writeFileSync(__dirname + "/frontend/hostname.txt", os.hostname());
  }

  if (url.parse(req.url, true).pathname == "/frontendutils/getenv") {
    var args = url.parse(req.url, true).query.args;

    fs.writeFileSync(__dirname + "/frontend/env.txt", GetEnv(args));
  }

  if (req.url == "/frontendutils/ls") {
    var errored = false;
    var FilesInCurrentDirectory;

    try {
      FilesInCurrentDirectory = fs.readdirSync(UserLocation);
    } catch(err) {
      if (err.code == "EACCES") {
        fs.writeFileSync(__dirname + "/frontend/lsfiles.txt", "ls: Cannot open " + UserLocation + ": Permission denied");
      }
      else {
        console.log(err);
      }
      errored = true;
    }

    if (errored == false) {
      fs.writeFileSync(__dirname + "/frontend/lsfiles.txt", FilesInCurrentDirectory);
    }
  }
  else

  if (url.parse(req.url, true).pathname == "/frontendutils/lsargs") {
    var LSArgs = url.parse(req.url, true).query.args;
    var files;
    var errored = false;

    if (LSArgs.startsWith("/")) {
      if (fs.isDirectorySync(fs.absolute(LSArgs)) == false) {
        if (fs.existsSync(fs.absolute(LSArgs)) == true) {
          fs.writeFileSync(__dirname + "/frontend/lsfiles.txt", fs.absolute(LSArgs));
          errored = true;
        }
        else {
          fs.writeFileSync(__dirname + "/frontend/lsfiles.txt", "ls: Invalid directory");
          errored = true;
        }
      }
      else {
        try {
          files = fs.readdirSync(fs.absolute(LSArgs));
        } catch(err) {
          if (err.code == "EACCES") {
            fs.writeFileSync(__dirname + "/frontend/lsfiles.txt", "ls: Cannot open " + LSArgs + ": Permission denied");
          }
          else {
            console.log(err);
          }
          errored = true;
        }
      }
    }
    else {
      if (fs.isDirectorySync(fs.absolute(UserLocation + "/" + LSArgs)) == false) {
        if (fs.existsSync(fs.absolute(UserLocation + "/" + LSArgs)) == true) {
          fs.writeFile(__dirname + "/frontend/lsfiles.txt", fs.absolute(UserLocation + "/" + LSArgs));
          errored = true;
        }
        else {
          fs.writeFileSync(__dirname + "/frontend/lsfiles.txt", "ls: Invalid directory");
          errored = true;
        }
      }
      else {
        try {
          files = fs.readdirSync(fs.absolute(UserLocation + "/" + LSArgs));
        } catch(err) {
          if (err.code == "EACCES") {
            fs.writeFileSync(__dirname + "/frontend/lsfiles.txt", "ls: Cannot open " + fs.absolute(UserLocation + "/" + LSArgs) + ": Permission denied");
          }
          else {
            console.log(err);
          }
          errored = true;
        }
      }
    }

	  if (errored == false) {
	    fs.writeFileSync(__dirname + "/frontend/lsfiles.txt", files);
	  }
  }
  else

  if (req.url == "/frontendutils/pwd") {
    fs.writeFileSync(__dirname + "/frontend/pwd.txt", UserLocation);
  }
  else

  if (url.parse(req.url, true).pathname == "/frontendutils/touch") {
    var args = url.parse(req.url, true).query.args;
    var SplitArgs = args.split("/");
    var ParentDirectory;
    var errored = false;

    if (SplitArgs.length > 1) {
      ParentDirectory = path.dirname(args);
    }

    if (ParentDirectory != null) {
      if (args.startsWith("/")) {
        if (fs.isDirectorySync(ParentDirectory) == false) {
          fs.writeFileSync(__dirname + "/frontend/touch_err.txt", "touch: Cannot create " + args + ": Invalid parent directory");
          errored = true;
        }
      }
      else {
        if (fs.isDirectorySync(UserLocation + "/" + ParentDirectory) == false) {
          fs.writeFileSync(__dirname + "/frontend/touch_err.txt", "touch: Cannot create " + args + ": Invalid parent directory");
          errored = true;
        }
      }
    }

    if (args.startsWith("/")) {
      if (fs.existsSync(args)) {
        fs.writeFileSync(__dirname + "/frontend/touch_err.txt", "touch: File already exists");
        errored = true;
      }

      if (errored == false) {
        fs.writeFile(args, "", function(err) {
          if (err) {
            if (err.code == "EACCES") {
              fs.writeFileSync(__dirname + "/frontend/touch_err.txt", "touch: Cannot create " + args + ": Permission denied");
            }
            else {
              console.log(err);
            }
          }
        });
      }
    }
    else {
      if (fs.existsSync(UserLocation + "/" + args)) {
        fs.writeFileSync(__dirname + "/frontend/touch_err.txt", "touch: File already exists");
        errored = true;
      }

      if (errored == false) {
        fs.writeFile(UserLocation + "/" + args, "", function(err) {
          if (err) {
            if (err.code == "EACCES") {
              fs.writeFileSync(__dirname + "/frontend/touch_err.txt", "touch: Cannot create " + args + ": Permission denied");
            }
            else {
              console.log(err);
            }
          }
        });
      }
    }
  }
  else

  if (req.url == "/frontendutils/delete_touch_err") {
    if (fs.existsSync(__dirname + "/frontend/touch_err.txt")) {
      fs.removeSync(__dirname + "/frontend/touch_err.txt");
    }
  }
  else

  if (url.parse(req.url, true).pathname == "/frontendutils/mkdir") {
    var args = url.parse(req.url, true).query.args;
    var SplitArgs = args.split("/");
    var ParentDirectory;
    var errored = false;

    if (SplitArgs.length > 1) {
      ParentDirectory = path.dirname(args);
    }

    if (ParentDirectory != null) {
      if (args.startsWith("/")) {
        if (fs.isDirectorySync(ParentDirectory) == false) {
          fs.writeFileSync(__dirname + "/frontend/mkdir_err.txt", "mkdir: Cannot create " + args + ": Invalid parent directory");
          errored = true;
        }
      }
      else {
        if (fs.isDirectorySync(UserLocation + "/" + ParentDirectory) == false) {
          fs.writeFile(__dirname + "/frontend/mkdir_err.txt", "mkdir: Cannot create " + args + ": Invalid parent directory");
          errored = true;
        }
      }
    }

    if (args.startsWith("/")) {
      if (fs.existsSync(args)) {
        fs.writeFileSync(__dirname + "/frontend/mkdir_err.txt", "mkdir: Directory already exists");
        errored = true;
      }

      if (errored == false) {
        fs.makeTree(args, function(err) {
          if (err) {
            if (err.code == "EACCES") {
              fs.writeFile(__dirname + "/frontend/mkdir_err.txt", "mkdir: Cannot create " + args + ": Permission denied", function(err) {
                if (err) {
                  console.log(err);
                }
              });
            }
            else {
              console.log(err);
            }
          }
        });
      }
    }
    else {
      if (fs.existsSync(UserLocation + "/" + args)) {
        fs.writeFileSync(__dirname + "/frontend/mkdir_err.txt", "mkdir: Directory already exists");
        errored = true;
      }

      if (errored == false) {
        fs.makeTree(UserLocation + "/" + args, function(err) {
          if (err) {
            if (err.code == "EACCES") {
              fs.writeFileSync(__dirname + "/frontend/mkdir_err.txt", "mkdir: Cannot create " + args + ": Permission denied");
            }
            else {
              console.log(err);
            }
          }
        });
      }
    }
  }
  else

  if (req.url == "/frontendutils/delete_mkdir_err") {
    if (fs.existsSync(__dirname + "/frontend/mkdir_err.txt")) {
      fs.removeSync(__dirname + "/frontend/mkdir_err.txt");
    }
  }
  else

  if (url.parse(req.url, true).pathname == "/frontendutils/cd") {
    var args = url.parse(req.url, true).query.args;
    var errored = false;

    if (args != undefined) {
      if (args.startsWith("/")) {
        if (fs.isDirectorySync(args) == false) {
          fs.writeFileSync(__dirname + "/frontend/cd_err.txt", "cd: Cannot cd to " + args + ": Invalid directory");
        }
      }
      else {
        if (fs.isDirectorySync(UserLocation + "/" + args) == false) {
          fs.writeFileSync(__dirname + "/frontend/cd_err.txt", "cd: Cannot cd to " + args + ": Invalid directory");
          errored = true;
        }
      }
    }
    else {
      UserLocation = GetEnv("HOME");
    }

    if (errored == false) {
      if (args.startsWith("/")) {
        UserLocation = args;
      }
      else {
        UserLocation = fs.absolute(UserLocation + "/" + args);
      }
    }
  }
  else

  if (req.url == "/frontendutils/delete_cd_err") {
    if (fs.existsSync(__dirname + "/frontend/cd_err.txt")) {
      fs.removeSync(__dirname + "/frontend/cd_err.txt");
    }
  }
  else

  if (url.parse(req.url, true).pathname == "/frontendutils/rm") {
    var args = url.parse(req.url, true).query.args;

    if (args.startsWith("/")) {
      if (fs.existsSync(args)) {
        fs.remove(args, function(err) {
          if (err) {
            if (err.code == "EACCES") {
              fs.writeFileSync(__dirname + "/frontend/rm_err.txt", "rm: " + args + ": permission denied");
            }
            else {
              console.log(err);
            }
          }
        });
      }
      else {
        fs.writeFileSync(__dirname + "/frontend/rm_err.txt", "rm: Invalid file/directory");
      }
    }
    else {
      if (fs.existsSync(UserLocation + "/" + args)) {
        fs.remove(UserLocation + "/" + args, function(err) {
          if (err) {
            if (err.code == "EACCES") {
              fs.writeFileSync(__dirname + "/frontend/rm_err.txt", "rm: " + args + ": permission denied");
            }
            else {
              console.log(err);
            }
          }
        });
      }
      else {
        fs.writeFileSync(__dirname + "/frontend/rm_err.txt", "rm: Invalid file/directory");
      }
    }
  }
  else

  if (req.url == "/frontendutils/delete_rm_err") {
    if (fs.existsSync(__dirname + "/frontend/rm_err.txt")) {
      fs.removeSync(__dirname + "/frontend/rm_err.txt");
    }
  }
});

server.listen(8000, "localhost");
console.log("Hosting WebConsole on localhost:8000");
