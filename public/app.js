var hookapp = angular.module('hookapp', ['ngResource', 'lumx']);

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

hookapp.controller('mainctrl', function($scope, repo, dateFilter, LxDialogService){
	$scope.new_form = {sub_projects: false, git_account: 'LiftOffLLC', email: ''};
	$scope.new_form.total = [{email: '', sha:'', last_build: '', id: 1}, {email: '', sha:'', last_build: '', id: 2}];
	$scope.addnew = false;

  $scope.opendDialog = function(dialogId, project_data){
    $scope.project_data = project_data;
    LxDialogService.open(dialogId);
  };

  $scope.openForm = function(dialogId){
    LxDialogService.open(dialogId);
  };

	$scope.loadData = function(){
		repo.getExistingConfig(function(data){
			$scope.existing_projects = data;
			console.log($scope.existing_projects);
			$scope.display_data = [];
			_.each($scope.existing_projects, function(proj){
				if(proj.subproj_configs) {
					_.each(proj.subproj_configs, function(subproj){
						subproj.git_appname = proj.git_appname;
            if(!$scope.isEmpty(subproj.report_to)) subproj.email = subproj.report_to.join(",")
						$scope.display_data.push(subproj);
					})
				} else {
          if(!$scope.isEmpty(proj.report_to)) proj.email = proj.report_to.join(",")
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
    return $scope.new_form.sub_projects? 360+(($scope.new_form.total.length-2)*10) : 280;
  }
  $scope.getWidth = function(){
    return $scope.new_form.sub_projects? 805 : 590;
  }
  $scope.addSub = function(){
    $scope.new_form.total.push({sha:'', last_build: '', id: $scope.new_form.total.length, email: ''});
  }

  $scope.isEmpty = function(element){
    return (typeof element === "undefined" || element === null || $.trim(element) === '');
  }

  $scope.validateEmail = function(proj){
    if(proj.email != ''){
      var report_to = [];
      var regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
      var email_ids = proj.email.split(',');
      for(var e_ind in email_ids){
        var email = email_ids[e_ind].trim();
        if (!regex.test(email)) 
          return false;
        else 
          report_to.push(email);
      }
      proj.report_to = report_to;
    } else {
      proj.report_to = [];
    }
    delete proj.email;
    return true;
  }

	$scope.saveForm = function(){
    if($scope.new_form.sub_projects){
      for(var pro_ind in $scope.new_form.total){
        var is_valid = $scope.validateEmail($scope.new_form.total[pro_ind]);
        if(!is_valid) return false;
      }
    } else {
      var is_valid = $scope.validateEmail($scope.new_form);
      if(!is_valid) return false;
    }
		repo.addNewConfig({formdata: $scope.new_form}, function(data){
			location.reload();
		});
  }
  $scope.loadData();
})

hookapp.controller('renameCtrl',function($scope, repo){
  // getting the existing branch name
  $scope.branch_name = $scope.data.branch;
  $scope.email = $scope.data.email;
  // renaming the branch
  $scope.updateNow = function(){
    console.log(this.data);
    var upd_config = this.data;
    upd_config.branch = $scope.branch_name;
    upd_config.email = $scope.email;
    var is_valid = $scope.validateEmail(upd_config);
    if(!is_valid) return false;

    repo.renameConfig(upd_config, function(flg){
      if (flg.success == true){
        $scope.data.branch = $scope.branch_name;
        $scope.data.email = $scope.email;
      }
    });
  }
});