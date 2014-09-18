var hookapp = angular.module('hookapp', ['ngResource']);

hookapp.factory('repo', ['$resource', function ($resource, $scope) {
  //REST-API for the user is invoked from here
  var Repo = $resource('/:action',
    {action:'@action'},
    {
      //like action for the given media_id
      'addNewConfig': { method:'POST', params: {action: 'new_form'}},
      'deleteConfig': { method:'DELETE', params: {action: 'exiting_config'}},
      'getExistingConfig': {method: 'GET', isArray: true, params: {action: 'get_existing_conf'}},
      'renameConfig': { method:'PUT', params: {action: 'update_branch'}}
    }
  )
  return Repo;
}]);

hookapp.controller('mainctrl', function($scope, repo, dateFilter){
	$scope.new_form = {sub_projects: 'false', git_account: 'LiftOffLLC'};
	$scope.new_form.total = [{sha:'', last_build: '', id: 1}, {sha:'', last_build: '', id: 2}];
	$scope.addnew = false;

	$scope.loadData = function(){
		repo.getExistingConfig(function(data){
			$scope.existing_projects = data;
			console.log($scope.existing_projects);
			$scope.display_data = [];
			_.each($scope.existing_projects, function(proj){
				if(proj.subproj_configs) {
					_.each(proj.subproj_configs, function(subproj){
						subproj.git_appname = proj.git_appname;
						$scope.display_data.push(subproj);
					})
				} else {
					$scope.display_data.push(proj);
				}
			})
		})
	}
  $scope.delete = function(){
    repo.deleteConfig({git_appname: this.data.git_appname}, function(data){
      location.reload();
    })
  }
  $scope.getHeight = function(){
    return $scope.new_form.sub_projects == 'true'? 360+(($scope.new_form.total.length-2)*10) : 260;
  }
  $scope.addSub = function(){
    $scope.new_form.total.push({sha:'', last_build: '', id: $scope.new_form.total.length});
  }
	$scope.saveForm = function(){
		repo.addNewConfig({formdata: $scope.new_form}, function(data){
			location.reload();
		});
  }
  $scope.loadData();
})

hookapp.controller('renameCtrl',function($scope, repo){
  // getting the existing branch name
  $scope.branch_name = $scope.data.branch;
  // renaming the branch
  $scope.updateNow = function(){
    console.log(this.data);
    var upd_config = this.data;
    upd_config.branch = $scope.branch_name;
    repo.renameConfig(upd_config, function(flg){
      if (flg.success == true){
        $scope.data.branch = $scope.branch_name;
      }
    });
  }
});