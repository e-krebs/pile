function date() {
	var date = new Date();
	return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}.${date.getSeconds()} -`;
}

if (window.console) {
	if (console.log) {
		var oldlog = console.log;
		console.log = function() {
			Array.prototype.unshift.call(arguments, date());
			oldlog.apply(this, arguments);
		}
	}

	if (console.info) {
		var oldinfo = console.info;
		console.info = function() {
			Array.prototype.unshift.call(arguments, date());
			oldinfo.apply(this, arguments);
		}
	}

	if (console.warn) {
		var oldwarn = console.warn;
		console.warn = function() {
			Array.prototype.unshift.call(arguments, date());
			oldwarn.apply(this, arguments);
		}
	}

	if (console.error) {
		var olderror = console.error;
		console.error = function() {
			Array.prototype.unshift.call(arguments, date());
			olderror.apply(this, arguments);
		}
	}
}
