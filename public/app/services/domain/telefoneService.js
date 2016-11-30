angular.module('myApp').service('TelefoneService', ['$http', '$q', 'baseApi', 'QueryBuilderService', 'EntityUtilService', function ($http, $q, baseApi, QueryBuilderService, EntityUtilService) {

	var TelefoneService = {};

	var resourceUrl = baseApi + '/telefones';
	var fields = null;

	function buildFields() {
		if (!fields) {
			fields = [
				{name: 'ddd', type: 'int'},
				{name: 'numero', type: 'int'}
			];
		}
		return fields;
	}

	function getDisplayLabel(telefone) {
		return telefone.ddd;
	}
	TelefoneService.getDisplayLabel = getDisplayLabel;

	//-- Public API -----

	TelefoneService.getCount =  function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		opts.count = true;		
		return QueryBuilderService.buildBaucisQuery(opts).then(function(q) {
			return $http.get(resourceUrl + q);
		}, function (err) {
			return $q.reject(err);
		});
	};
	
	TelefoneService.getList = function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		return QueryBuilderService.buildBaucisQuery(opts).then(function(q) {
			return $http.get(resourceUrl + q).then(function(response) {
				response.data.forEach(function(element) {
					element._displayLabel = getDisplayLabel(element);
				});
				return response;
			}, function (err) {
				return $q.reject(err);
			});
		}, function (err) {
			return $q.reject(err);
		});
	};

	function exportQuery(opts) {
		opts = opts || {};
		opts.paginate = false;
		opts.fields = opts.fields || buildFields();
		return QueryBuilderService.buildBaucisQuery(opts).then(function (q) {
		    return q;
		}, function (err) {
		    return $q.reject(err);
		});
	}

	TelefoneService.getListAsCsv = function (opts) {
		return exportQuery(opts).then(function (q) {
			return $http({
				method: 'GET', 
				url: resourceUrl + q, 
				headers: {'Accept': 'text/csv'} 
			});
		}, function (err) {
			return $q.reject(err);
		});
	};	

	TelefoneService.getFileAsCsv = function (opts) {
		return exportQuery(opts).then(function (q) {
			return $http({
				method: 'GET', 
				url: resourceUrl + q, 
				headers: {'Accept': 'text/csv'} 
			});
		}, function (err) {
			return $q.reject(err);
		});
	};	
	TelefoneService.getFileAsXml = function (opts) {
		return exportQuery(opts).then(function (q) {
			return $http({
				method: 'GET', 
				url: resourceUrl + q, 
				headers: {'Accept': 'text/xml'} 
			});
		}, function (err) {
			return $q.reject(err);
		});
	};		
	TelefoneService.getFileAsXlsx = function (opts) {
		return exportQuery(opts).then(function (q) {
			return $http({
				method: 'GET', 
				url: resourceUrl + q, 
				headers: {'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
				responseType: 'blob' 
			});
		}, function (err) {
			return $q.reject(err);
		});
	};		
	
	TelefoneService.get = function (link) {
		return $http.get(link);
	};
	
	TelefoneService.getDocument = function (id) {
		return TelefoneService.get(resourceUrl + '/' + id ).then(function(response) {
			response.data._displayLabel = getDisplayLabel(response.data);
			return response;
		}, function (err) {
			return $q.reject(err);
		});
	};

	TelefoneService.add = function (item) {
		return $http.post(resourceUrl, JSON.stringify(item));
	};

	TelefoneService.update = function (item) {
		return $http.put(resourceUrl + '/' + item._id, JSON.stringify(item));
	};

	TelefoneService.delete = function (id) {
		return $http.delete(resourceUrl + '/' + id);
	};

	TelefoneService.deleteMany = function (ids) {
		return $http.post(resourceUrl + '/deleteByIds', JSON.stringify(ids));
	};	

	TelefoneService.deleteByQuery = function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		opts.paginate = false;		
		return QueryBuilderService.buildBaucisQuery(opts).then(function (q) {
			return $http.delete(resourceUrl + q);
		}, function (err) {
			return $q.reject(err);
		});
	};

	return TelefoneService;

}]);
