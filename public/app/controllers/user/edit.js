angular.module('myApp').controller('EditUserController', 
  ['$scope', '$routeParams', '$location', '$translate', '$timeout', 'UserErrorService', 'NavigationService', 'EntityUtilService', 'SecurityService', 'UserService', 
  function($scope, $routeParams, $location, $translate, $timeout, UserErrorService, NavigationService, EntityUtilService, SecurityService, UserService) {

	$scope.isEdition = false;
	$scope.isCreation = false;
	$scope.isDeletion = false;
	$scope.isView = false;
	$scope.canEdit = false;
	$scope.canDelete = false;	
	$scope.readOnly = false;
	$scope.dataReceived = false;
	$scope.ui = {
		createTelefones : true

	};
	$scope.obj = {
		userId : null,
		nome : null,
		email : null,
		senha : null,
		data_criacao : null,
		data_atualizacao : null,
		ultimo_login : null,
		hideTelefones : false,
		telefones : []
	};

	var saveIndex = 0;
	var manyToManyCount = 1;

	$scope.add = function () {
		$scope.uiWorking = true;
		$scope.obj._id = undefined;
		$scope.obj.telefones = getTelefonesIds();
		UserService.add(dataToServer($scope.obj)).then(function (httpResponse) {
			if($scope.parent) {
				NavigationService.setReturnData({parent: $scope.parent, entity: httpResponse.data});
				$location.path(NavigationService.getReturnUrl());
			}
			else {
				gotoList();
			}
	    }, errorHandlerAdd, progressNotify);
	};
	
	$scope.update = function () {
		$scope.uiWorking = true;
		UserService.update(dataToServer($scope.obj)).then(function (httpResponse) {
			saveIndex = 0;
			UserService.setUserTelefones(httpResponse.data._id, getTelefonesIds()).then(saveAllThenGotoList, errorHandlerUpdate);
		}, errorHandlerUpdate, progressNotify);
	};

	$scope.delete = function () {
		$scope.uiWorking = true;
		UserService.setUserTelefones($scope.obj._id, []).then(function () {
			UserService.delete($scope.obj._id).then(returnBack, errorHandlerDelete, progressNotify);
		}, errorHandlerDelete);
	};

	function progressNotify() { //update
	}

	function errorHandlerAdd(httpError) {
		$scope.uiWorking = false;
		$scope.dataReceived = true;
		$scope.errors = UserErrorService.translateErrors(httpError, "add");
	}

	function errorHandlerUpdate(httpError) {
		$scope.uiWorking = false;
		$scope.dataReceived = true;
		$scope.errors = UserErrorService.translateErrors(httpError, "update");
	}

	function errorHandlerDelete(httpError) {
		UserService.setUserTelefones($scope.obj._id, getTelefonesIds());
		$scope.uiWorking = false;
		$scope.dataReceived = true;
		$scope.errors = UserErrorService.translateErrors(httpError, "delete");
	}

	function errorHandlerLoad(httpError) {
		$scope.uiWorking = false;
		$scope.dataReceived = true;
		$scope.errors = UserErrorService.translateErrors(httpError, "query");
	}

	function dataToServer(obj) {
	
		return obj;
	}		

	function loadTelefones(httpResponse) {
		$scope.obj.telefones = httpResponse.data;
	}

	function loadData(httpResponse) {
		$scope.obj = httpResponse.data;

		UserService.getUserTelefones($routeParams.id).then(loadTelefones, errorHandlerLoad);


		$scope.canEdit = $scope.isView && EntityUtilService.hasActionCapability($scope.obj, 'edit');
		$scope.canDelete = $scope.isView && EntityUtilService.hasActionCapability($scope.obj, 'delete');
		$scope.errors = null;
		$scope.dataReceived = true;
	}
	function returnBack() {
		if ($scope.parent) {
			NavigationService.setReturnData({ parent: $scope.parent });
			$location.path(NavigationService.getReturnUrl());
		}
		else {
			gotoList();
		}
	}

	$scope.cancel = returnBack;

	$scope.gotoEdit = function() {
		$location.path('/user/edit/' + $routeParams.id);		
	};

	$scope.gotoDelete = function() {
		$location.path('/user/delete/' + $routeParams.id);		
	};


	function saveAllThenGotoList() {
		saveIndex++;
		if (saveIndex === manyToManyCount) {
			returnBack();
		}
	}


	function gotoList() {
		$scope.uiWorking = false;
		$location.path('/user/');		
	}

	$scope.submit = function() {
		if ($scope.isCreation && !$scope.editForm.$invalid) {
			$scope.add();
		}
		else if ($scope.isEdition && !$scope.editForm.$invalid) {
			$scope.update();
		}
		else if ($scope.isDeletion) {
			$scope.delete();
		}
	};

	$scope.viewTelefones = function(obj) {
		if ($scope.editForm && $scope.editForm.$dirty) {
			if (!confirm("You have unsaved changes!, do you want to move any way? press cancel to stay in this page")) {
				return;
			}
		}

		NavigationService.push($location.path(), "ViewTelefones", {parent: $scope.obj} );
		$location.path('/telefone/view/' + obj._id);
	};

	$scope.selectTelefones = function() {
		NavigationService.push($location.path(), "SelectTelefones", {parent: $scope.obj, criteria: EntityUtilService.buildNotInQuery(getTelefonesIds())} );
		$location.path('/telefone/select');
	};
	
	$scope.addTelefones = function() {
		NavigationService.push($location.path(), "AddTelefones", {parent: $scope.obj, parentClass: 'user'} );
		$location.path('/telefone/add');
	};
	
	$scope.deleteTelefones = function(telefone) {
		var index = $scope.obj.telefones.indexOf(telefone);
		if (index > -1) {
		    $scope.obj.telefones.splice(index, 1);

			if($scope.editForm) {
				$scope.editForm.$dirty = true;
			}
		}
	};
	
	function addSelectTelefonesBack() {
		var navItem = popNavItem();
		if(navItem.returnData) {
			var user = navItem.returnData.parent;
			if(user) {
				var myTelefone = navItem.returnData.entity;
				if(myTelefone) {
					user.telefones.push(myTelefone);

				}
				$timeout(function() {
				  setObj(user);
				  $scope.dataReceived = true;
				}, 100);
				return;
			}
		}
		UserService.getDocument($routeParams.id).then(loadData, errorHandlerLoad);
	}

	function getTelefonesIds() {
		var ids = [];
		for (var i = 0; i < $scope.obj.telefones.length; i++) {
			ids.push($scope.obj.telefones[i]._id);
		}
		return ids;
	}


	function init() {
		$scope.isDeletion = isDeletionContext();
		$scope.isView     = isViewContext();
		$scope.readOnly   = $scope.isDeletion || $scope.isView;
		if ($routeParams.id) {
			$scope.isEdition = !$scope.readOnly;
			$scope.isCreation = false;
			setParent();
		}
		else {
			$scope.isEdition = false;
			$scope.isCreation = true;
			$scope.dataReceived = true;
			$scope.obj._id = 'new';
			setNavigationStatus();
		}

		SecurityService.getPermisionsFoResource('telefone').then(function(httpData) {
			$scope.ui.createTelefones = EntityUtilService.canExecute(httpData.data, 'create'); 
		});


		if (NavigationService.isReturnFrom('SelectTelefones') || NavigationService.isReturnFrom('AddTelefones')) {
			addSelectTelefonesBack();
			return;
		}
		if (NavigationService.isReturnFrom('ViewTelefones')) {
			NavigationService.pop();
			setParent();
		}

		if ($routeParams.id) {
			UserService.getDocument($routeParams.id).then(loadData, errorHandlerLoad);		
		}

	}

	function isDeletionContext() {
		return stringContains($location.path(), '/delete/');
	}

	function isViewContext() {
		return stringContains($location.path(), '/view/');
	}

	
	function stringContains(text, substring) {
		return text.indexOf(substring) > -1;
	}
	function setParent() {
		var state = NavigationService.getState();
		$scope.parent = (state && state.parent) ? state.parent : null;
		return state;
	}


	function popNavItem() {
		var navItem = NavigationService.pop();
		setNavigationStatus();
		return navItem;
	}

	function setObj(obj) {
		$scope.obj = obj;
		if($scope.editForm) {
			$scope.editForm.$dirty = true;
		}

		if ($routeParams.id && !$scope.obj) {
			UserService.getDocument($routeParams.id).then(loadData, errorHandlerLoad);
		}

	}


	function setNavigationStatus() {

		var state = setParent();
		if ($scope.parent) {
			switch (state.parentClass) {
				case 'telefone':
					$scope.obj.hideTelefones = true;
					break;

				default:
					break;
			}
		}

	}

	init();
}]);
