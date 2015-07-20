define(function() {

	var Utils = {};

	//Only one level objects
	Utils.arrayClone = function(arrayToClone){
		var clonedArray = [];
		arrayToClone.forEach(function (element) {
			var newElement = {};
			Object.keys(element).forEach(function(prop) {
				newElement[prop] = element[prop];
			});

			clonedArray.push(newElement);
		});

		return clonedArray;
	};

	Utils.reactClassAppender = function(conditionToClassname, initialClassName) {
		var result = (initialClassName) ? initialClassName + " " : "";

		Object.keys(conditionToClassname).forEach(function(className) {
			result += (conditionToClassname[className]) ? className + " " : "";
		});

		return result.trim();
	};

	return Utils;
}); 