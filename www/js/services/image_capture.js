angular.module("SpotJams")

.factory('imageCapture', function() {

	var _instance = {};
	_instance._image = {};

	return _instance;
}