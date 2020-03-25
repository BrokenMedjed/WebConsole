var stdin;
var stdout;

$("document").ready(function() {
	stdin = document.getElementById("commandbox");
	stdout = document.getElementById("stdout");

	IOKit.stdout.println("WebConsole v1.0 beta");
	IOKit.stdout.println("(C) Rune-Rune 2016; GPLv3 license");
	IOKit.stdout.println("Current time and date: " + moment().format("HH:mm, DD/MM/YYYY"));
	IOKit.stdout.print("<br>");
	IOKit.stdout.print(MiscUtils.GetPrompt());
});

var MiscUtils = {
	"GetPrompt": function() {
		var UserName = OSKit.GetEnvLocal("USER");
		var WorkingDirectory = OSKit.GetWorkingDirectory();
		var ComputerName = OSKit.GetHostname();
		var PromptDelimiter;

		if (UserName != "root") {
			PromptDelimiter = "$ ";
		}
		else {
			PromptDelimiter = "# ";
		}

		return UserName + "@" + ComputerName + ":" + WorkingDirectory + PromptDelimiter;
	}
}

var OnEnterPress = function(ev, callback) {
	if (ev.keyCode == 13) {
		if (typeof(callback) != "function") {
			return false;
		}
		else {
			callback();
		}
	}
}

var Command = {
	"run": function() {
		try {
			var Runnable = stdin.value.split(" ");

			IOKit.stdout.println(stdin.value);

			if (ObjectArrayKit.CheckFor(Commands, "Name", Runnable[0]) == false) {
				IOKit.stdout.println("Unknown command: " + Runnable[0]);
			}
			else

			if (Runnable[0] == "help") {
				if (Runnable[1] == undefined) {
					Commands[0].Runnables.NoArgs();
				}
				else {
					Commands[0].Runnables.Args(Runnable[1]);
				}
			}
			else

			if (Runnable[0] == "clear") {
				Commands[1].Runnables.NoArgs();
			}
			else

			if (Runnable[0] == "color") {
				if (Runnable[1] == undefined) {
					Commands[2].Runnables.NoArgs();
				}
				else {
					Commands[2].Runnables.Args(Runnable[1]);
				}
			}
			else

			if (Runnable[0] == "jsrun") {
				if (Runnable[1] == undefined) {
					Commands[3].Runnables.NoArgs();
				}
				else {
					var EvalString = "";

					for (var i = 1; i < Runnable.length; i++) {
						EvalString += " " + Runnable[i];
					}

					EvalString.replace(" ", "");

					Commands[3].Runnables.Args(EvalString);
				}
			}
			else

			if (Runnable[0] == "echo") {
				if (Runnable[1] == undefined) {
					Commands[4].Runnables.NoArgs();
				}
				else {
					var PrintString = "";

					for (var i = 1; i < Runnable.length; i++) {
						PrintString += " " + Runnable[i];
					}

					PrintString.replace(" ", "");

					Commands[4].Runnables.Args(PrintString);
				}
			}
			else

			if (Runnable[0] == "ls") {
				if (Runnable[1] == undefined) {
					Commands[5].Runnables.NoArgs();
				}
				else {
					Commands[5].Runnables.Args(Runnable[1]);
				}
			}
			else

			if (Runnable[0] == "pwd") {
				Commands[6].Runnables.NoArgs();
			}
			else

			if (Runnable[0] == "touch") {
				if (Runnable[1] == undefined) {
					Commands[7].Runnables.NoArgs();
				}
				else {
					Commands[7].Runnables.Args(Runnable[1]);
				}
			}
			else

			if (Runnable[0] == "mkdir") {
				if (Runnable[1] == undefined) {
					Commands[8].Runnables.NoArgs()
				}
				else {
					Commands[8].Runnables.Args(Runnable[1]);
				}
			}
			else

			if (Runnable[0] == "cd") {
				if (Runnable[1] == undefined) {
					Commands[9].Runnables.NoArgs();
				}
				else {
					Commands[9].Runnables.Args(Runnable[1]);
				}
			}
			else

			if (Runnable[0] == "rm") {
				if (Runnable[1] == undefined) {
					Commands[10].Runnables.NoArgs();
				}
				else {
					Commands[10].Runnables.Args(Runnable[1]);
				}
			}

			stdin.value = "";

			if (Runnable[0] != "clear") {
				IOKit.stdout.print("<br>");
			}

			IOKit.stdout.print(MiscUtils.GetPrompt());
			stdout.scrollTop = stdout.scrollHeight;
		} catch(err) {
			IOKit.stdout.println(err);
		}
	}
};

var IOKit = {
	"stdout": {
		"print": function(string) {
			stdout.innerHTML += string;
		},
		"println": function(string) {
			stdout.innerHTML += string + "<br>";
		},
		"erase": function() {
			stdout.innerHTML = "";
		}
	},
	"stdin": {
		"get": function() {
			return stdin.value;
		},
		"set": function(string) {
			stdin.value = string;
		}
	}
};

var ObjectArrayKit = {
	"CheckFor": function(array, value, condition) {
		var ArrayNameList = [];

		for (var i = 0; i < array.length; i++) {
			ArrayNameList[i] = array[i][value];
		}

		if (ArrayNameList.indexOf(condition) == -1) {
			return false;
		}
		else {
			return true;
		}
	},
	"IndexGetter": function(array, value, find) {
		var ArrayNameList = [];

		for (var i = 0; i < array.length; i++) {
			ArrayNameList[i] = array[i][value];
		}

		if (ArrayNameList.indexOf(find) == -1) {
			return false;
		}
		else {
			return ArrayNameList.indexOf(find);
		}
	}
};

var HTTPRequestKit = {
	"get": function(url) {
		var request = new XMLHttpRequest();

		request.open("GET", url, false);
		request.send();

		return request.responseText;
	},
	"post": function(url, args) {
		var request = new XMLHttpRequest();

		request.open("POST", url, false);
		request.send(args);
	}
};

var OSKit = {
	"GetEnvLocal": function(env) {
		HTTPRequestKit.get("http://localhost:8000/frontendutils/getenv?args=" + env);

		return HTTPRequestKit.get("http://localhost:8000/env.txt");
	},
	"GetHostname": function() {
		HTTPRequestKit.get("http://localhost:8000/frontendutils/hostname");

		return HTTPRequestKit.get("http://localhost:8000/hostname.txt");
	},
	"GetWorkingDirectory": function() {
		HTTPRequestKit.get("http://localhost:8000/frontendutils/pwd");

		return HTTPRequestKit.get("http://localhost:8000/pwd.txt");
	}
}

var Commands = [
	{
		"Name": "help",
		"Info": "Prints available commands to the screen and provides command info<br>Usage: help [command]",
		"Runnables": {
			"NoArgs": function() {
				IOKit.stdout.println("Available commands:");

				for (var i = 0; i < Commands.length; i++) {
					IOKit.stdout.println(Commands[i].Name);
				}

				IOKit.stdout.println("Type 'help [command]' to get info on  specific commands");
			},
			"Args": function(args) {
				if (ObjectArrayKit.CheckFor(Commands, "Name", args) == false) {
					IOKit.stdout.println("help: Unknown command " + args);
				}
				else {
					var Index = ObjectArrayKit.IndexGetter(Commands, "Name", args);
					IOKit.stdout.println(Commands[Index].Info);
				}
			}
		}
	},
	{
		"Name": "clear",
		"Info": "Clears the output screen<br>Usage: clear",
		"Runnables": {
			"NoArgs": function() {
				IOKit.stdout.erase();
			}
		}
	},
	{
		"Name": "color",
		"Info": "Changes the text color of the console<br>Usage: color *color*<br>The colors must be defined with CSS hex codes.<br>For example, 'color FFFFFF' will make the text white",
		"Runnables": {
			"NoArgs": function() {
				IOKit.stdout.println("Usage: color <color>");
			},
			"Args": function(args) {

				if (args.match(/[g-zG-Z\u2000-\u206F\u2E00-\u2E7F\\'!"$%#&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g)) {
					IOKit.stdout.println("The definition cannot contain punctuation characters or letters from G to Z");
				}
				else {
					if (args.length != 6) {
						IOKit.stdout.println("Color definition must be exactly six characters long");
					}
					else {
						document.getElementsByTagName("html")[0].style.color = "#" + args;
					}
				}
			}
		}
	},
	{
		"Name": "jsrun",
		"Info": "Evaluates the given JavaScript code and runs it.<br>WARNING: be careful of what you do with this as you can do everything Javascript can!<br>Usage: jsrun *code*",
		"Runnables": {
			"NoArgs": function() {
				IOKit.stdout.println("Usage: jsrun *code*");
			},
			"Args": function(args) {
				try {
					eval(args);
				} catch(err) {
					IOKit.stdout.println(err);
				}
			}
		}
	},
	{
		"Name": "echo",
		"Info": "Prints text onto the screen<br>Usage: echo *text*",
		"Runnables": {
			"NoArgs": function() {
				IOKit.stdout.println("Usage: echo *text*");
			},
			"Args": function(args) {
				IOKit.stdout.println(args);
			}
		}
	},
	{
		"Name": "ls",
		"Info": "List all files in the current directory<br>Usage: ls [directory]",
		"Runnables": {
			"NoArgs": function() {
				HTTPRequestKit.get("http://localhost:8000/frontendutils/ls");

				var LSFiles = HTTPRequestKit.get("http://localhost:8000/lsfiles.txt");

				var Files = LSFiles.split(",");

				for (var i = 0; i < Files.length; i++) {
					IOKit.stdout.println(Files[i]);
				}
			},
			"Args": function(args) {
				HTTPRequestKit.get("http://localhost:8000/frontendutils/lsargs?args=" + args);

				var LSFiles = HTTPRequestKit.get("http://localhost:8000/lsfiles.txt");

				var Files = LSFiles.split(",");

				for (i = 0; i < Files.length; i++) {
					IOKit.stdout.println(Files[i]);
				}
			}
		}
	},
	{
		"Name": "pwd",
		"Info": "Prints your current working directory<br>Usage: pwd",
		"Runnables": {
			"NoArgs": function() {
				HTTPRequestKit.get("http://localhost:8000/frontendutils/pwd");

				var cwd = HTTPRequestKit.get("http://localhost:8000/pwd.txt");

				IOKit.stdout.println(cwd);
			}
		}
	},
	{
		"Name": "touch",
		"Info": "Creates files<br>Usage: touch *file*",
		"Runnables": {
			"NoArgs": function() {
				IOKit.stdout.println("Usage: touch *file*");
			},
			"Args": function(args) {
				var touch_err;

				HTTPRequestKit.get("http://localhost:8000/frontendutils/touch?args=" + args);

				if (!HTTPRequestKit.get("http://localhost:8000/touch_err.txt").startsWith("Cannot GET")) {
					touch_err = HTTPRequestKit.get("http://localhost:8000/touch_err.txt");
				}

				HTTPRequestKit.get("http://localhost:8000/frontendutils/delete_touch_err");

				if (touch_err != null) {
					IOKit.stdout.println(touch_err);
				}
			}
		}
	},
	{
		"Name": "mkdir",
		"Info": "Creates directories<br>Usage: mkdir *directory*",
		"Runnables": {
			"NoArgs": function() {
				IOKit.stdout.println("Usage: mkdir *directory*");
			},
			"Args": function(args) {
				var mkdir_err;

				HTTPRequestKit.get("http://localhost:8000/frontendutils/mkdir?args=" + args);

				if (!HTTPRequestKit.get("http://localhost:8000/mkdir_err.txt").startsWith("Cannot GET")) {
					mkdir_err = HTTPRequestKit.get("http://localhost:8000/mkdir_err.txt");
				}

				HTTPRequestKit.get("http://localhost:8000/frontendutils/delete_mkdir_err");

				if (mkdir_err != null) {
					IOKit.stdout.println(mkdir_err);
				}
			}
		}
	},
	{
		"Name": "cd",
		"Info": "Changes the current working directory<br>Usage: cd *directory*",
		"Runnables": {
			"NoArgs": function() {
				HTTPRequestKit.get("http://localhost:8000/frontendutils/cd");
			},
			"Args": function(args) {
				var cd_err;

				HTTPRequestKit.get("http://localhost:8000/frontendutils/cd?args=" + args);

				if (!HTTPRequestKit.get("http://localhost:8000/cd_err.txt").startsWith("Cannot GET")) {
					cd_err = HTTPRequestKit.get("http://localhost:8000/cd_err.txt");
				}

				HTTPRequestKit.get("http://localhost:8000/frontendutils/delete_cd_err");

				if (cd_err != null) {
					IOKit.stdout.println(cd_err);
				}
			}
		}
	},
	{
		"Name": "rm",
		"Info": "Removes files or directories<br>WARNING: YOU CAN LITERALLY DELETE EVERYTHING YOU HAVE PERMISSIONS TO RECURSIVELY,<br>EVEN YOUR HOME FOLDER, JUST BY DOING ONE COMMAND. That said, be really careful PLEASE.<br><br>Usage: rm *file or directory*",
		"Runnables": {
			"NoArgs": function() {
				IOKit.stdout.println("Usage: rm *file or directory*");
			},
			"Args": function(args) {
				var rm_err;

				HTTPRequestKit.get("http://localhost:8000/frontendutils/rm?args=" + args);

				if (!HTTPRequestKit.get("http://localhost:8000/rm_err.txt").startsWith("Cannot GET")) {
					rm_err = HTTPRequestKit.get("http://localhost:8000/rm_err.txt");
				}

				HTTPRequestKit.get("http://localhost:8000/frontendutils/delete_rm_err");

				if (rm_err != null) {
					IOKit.stdout.println(rm_err);
				}
			}
		}
	}
];
