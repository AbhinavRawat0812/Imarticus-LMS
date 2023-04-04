var MainCtrl = angular.module('MainCtrl', [
  'apiService',
  'ui.bootstrap',
  'ng.deviceDetector',
])

MainCtrl.controller('MainController', [
  '$scope',
  '$rootScope',
  'apiService',
  '$location',
  '$stateParams',
  '$uibModal',
  '$window',
  'deviceDetector',
  function (
    $scope,
    $rootScope,
    api,
    $location,
    $stateParams,
    $uibModal,
    $window,
    deviceDetector
  ) {
    $scope.categories = []

    $scope.class = 'none'
    $scope.ready = false
    $scope.mobile = true

    if (deviceDetector.os == 'ios' || deviceDetector.os == 'android') {
      $scope.mobile = true
    } else {
      // $scope.mobile = false;
      // Userback = window.Userback || {};
      //   (function(id) {
      //       if (document.getElementById(id)) {return;}
      //       var s = document.createElement('script');
      //       s.id = id;
      //       s.src = 'https://app.userback.io/widget.js';
      //       var parent_node = document.head || document.body;
      //       parent_node.appendChild(s);
      //   })('userback-sdk');
      //   Userback.access_token = '556|633|o4jiW70nZhpf4pp4prEHkjtqTPvizIeXNygKGg7FyxVCXkHmMl';
      //   var feedback;
      //   Userback.email = "hi@eckovation.com";
      // //   Userback.custom_data = {
      // 	// userId 		: api.localStorageWrapper.getItem("uid"),
      // 	// pluginToken : api.localStorageWrapper.getItem("plugin_at"),
      // 	// pluginId    : api.localStorageWrapper.getItem("pl_id"),
      // 	// groupId    	: api.localStorageWrapper.getItem("gcode")
      // //   }
      //   Userback.before_send = function() {
      //     var list = document.getElementsByClassName('userback-controls-options')
      // 	feedback = list[0].getElementsByTagName('textarea')[0].value;
      // 	// if(window.NODE_ENV == "debug"){console.log("userback before_send MainCtrl")};
      // };
      // Userback.after_send = function() {
      // 	// if(window.NODE_ENV == "debug"){console.log("userback after_send MainCtrl")};
      //   	$rootScope.$broadcast('feedback',feedback);
      //   	api.sendFeedback(function(res){
      //     	if(window.NODE_ENV == "debug"){console.log(res)};
      //     },function(res){
      //     	if(window.NODE_ENV == "debug"){console.log(res)};
      //     },feedback);
      // };
      // Userback.widget_settings = {
      //     autohide                      : false,      // boolean: true, false
      //     display_feedback              : false,       // boolean: true, false
      // };
      // setTimeout(function(){
      // 	$window.document.getElementsByClassName('userback-button')[0].classList.add('display-userback-button')
      // },0);
    }

    $scope.popError = function (str) {
      var platform = api.localStorageWrapper.getItem('pf')

      if (platform == 'Adrd') {
        // platform android
        if (str) {
          window.androidAppProxy.showDialogOnWeb('Error', str, 'Ok', 'Cancel')
          return
        }
        window.androidAppProxy.showDialogOnWeb(
          'Error',
          'Oops! There was an error! Please try again later',
          'Ok',
          'Cancel'
        )
      } else if (platform == 'ios') {
        // platform ios
        if (str) {
          try {
            webkit.messageHandlers.callbackHandler.postMessage({
              f: 'error',
              p: [str],
            })
          } catch (e) {
            $exceptionHandler(e)
          }
          return
        }
        try {
          webkit.messageHandlers.callbackHandler.postMessage({
            f: 'error',
            p: ['Please try again later'],
          })
        } catch (e) {
          $exceptionHandler(e)
        }
      } else {
        // platform web
        var temp, mode
        var title = 'Error'
        if (str) {
          temp = str
          mode = 'warning'
        } else {
          mode = 'danger'
          str = 'Please try again later'
        }

        $scope.data = {
          mode: mode,
          boldTextTitle: title,
          textAlert: str,
        }

        var modalInstance = $uibModal.open({
          templateUrl: 'views/alertmodal.html',
          controller: 'ModalInstanceCtrl',
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          size: 'lg',
          resolve: {
            data: function () {
              return $scope.data
            },
          },
        })

        modalInstance.result.then(
          function () {},
          function (res) {
            if (window.NODE_ENV == 'debug') {
              console.log(res)
            }
            if (res != 'backdrop click') alert(str)
          }
        )
      }
    }

    $scope.showLoading = function (status) {
      return
      var platform = api.localStorageWrapper.getItem('pf')
      if ($scope.pf) {
        platform = $scope.pf
      }

      if (status) {
        if (platform == 'Adrd') {
          window.androidAppProxy.setProgressBarVisibility(true)
        } else if (platform == 'ios') {
          try {
            webkit.messageHandlers.callbackHandler.postMessage({
              f: 'showLoading',
            })
          } catch (e) {
            $exceptionHandler(e)
          }
        } else {
          $scope.showSpinner = true // web spinner here
        }
      } else {
        if (platform == 'Adrd') {
          window.androidAppProxy.setProgressBarVisibility(false)
        } else if (platform == 'ios') {
          try {
            webkit.messageHandlers.callbackHandler.postMessage({
              f: 'stopLoading',
            })
          } catch (e) {
            $exceptionHandler(e)
          }
        } else {
          $scope.showSpinner = false // web spinner here
        }
      }
    }

    $scope.showLoading(true)
  },
])
var StatusCtrl = angular.module('StatusCtrl', ['apiService'])

StatusCtrl.controller('StatusCtrl', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  'Upload',
  '$rootScope',
  'superCache',
  'alertify',
  '$uibModal',
  '$copyToClipboard',
  '$cookies',
  '$window',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    $upload,
    $rootScope,
    cache,
    alertify,
    $uibModal,
    $copyToClipboard,
    $cookies,
    $window
  ) {
    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid

    $scope.disp = {
      current: '1',
      enable: false,
    }
    $scope.names = [
      'Andhra Pradesh',
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Dadra and Nagar Haveli',
      'Daman and Diu',
      'Delhi',
      'Goa',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Jammu and Kashmir',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Orissa',
      'Puducherry',
      'Punjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Telangana',
      'Tripura',
      'Uttar Pradesh',
      'Uttarakhand',
      'West Bengal',
    ]

    $scope.delvy_num = ''
    $scope.display_num = ''
    $scope.change1 = false
    $scope.changet = function () {
      $scope.change1 = true
      console.log('changed')
    }

    $scope.saveDetails = function () {
      if ($scope.disp.address2 === undefined) {
        $scope.disp.address2 = ''
      }
      var data = {
        //adrs : "Address: "+$scope.disp.address1+" "+$scope.disp.address2+","+$scope.disp.address3+","+$scope.disp.address4+","+$scope.disp.address5+","+$scope.disp.address6,
        adrs1: $scope.disp.address1,
        adrs2: $scope.disp.address2,
        adrs_cty: $scope.disp.address3,
        adrs_ste: $scope.disp.address4,
        adrs_cnty: $scope.disp.address6,
        adrs_p_code: $scope.disp.address5,
      }
      $scope.saveGraduationDetails(data)

      setTimeout(function () {
        $window.location.reload()
      }, 1000)
    }

    $scope.saveNumber = function () {
      var data = {
        delvy_num: $scope.delvy_num,
      }
      $scope.saveDispatchNumber(data)
      setTimeout(function () {
        $window.location.reload()
      }, 1000)
    }

    $scope.saveDispatchNumber = function (data) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.save_number,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
            delvy_num: data.delvy_num,
          }
        )
        .then(function (res) {})
        .catch(function (err) {
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.saveDispatchNumber(data)
            })
          }
        })
    }

    $scope.saveGraduationDetails = function (data) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.upload_grad_details,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
            adrs1: data.adrs1,
            adrs2: data.adrs2,
            adrs_cty: data.adrs_cty,
            adrs_ste: data.adrs_ste,
            adrs_cnty: data.adrs_cnty,
            adrs_p_code: data.adrs_p_code,
          }
        )
        .then(function (res) {
          console.log(res)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.saveGraduationDetails(data)
            })
          }
        })
    }

    $scope.getGraduationStatus = function () {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.get_grad_status,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.npsTopics = res.data.data.nps
          $scope.details = res.data.data.details
          $scope.linkedinKeys = res.data.data.linked_keys
          $scope.i_paid = res.data.data.i_paid
          $scope.intrstr = res.data.data.intrstr
          $scope.address = res.data.data.address
          if ($scope.details.d_num) {
            $scope.delivery_num = $scope.details.d_num
          }
          if ($scope.details.email) {
            $scope.mail = $scope.details.email
          }
          if ($scope.address) {
            $scope.disp.address1 = $scope.address.adrs1
            $scope.disp.address2 = $scope.address.adrs2
            $scope.disp.address3 = $scope.address.adrs_cty
            $scope.disp.address4 = $scope.address.adrs_ste
            $scope.disp.address5 = parseInt($scope.address.adrs_p_code)
            $scope.disp.address6 = $scope.address.adrs_cnty
            $scope.disp.adrs =
              'Address: ' +
              $scope.disp.address1 +
              ' ' +
              $scope.disp.address2 +
              ',' +
              $scope.disp.address3 +
              ',' +
              $scope.disp.address4 +
              ',' +
              $scope.disp.address5 +
              ',' +
              $scope.disp.address6
          }
          console.log($scope.disp.address5)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.getGraduationStatus()
            })
          }
        })
    }

    $scope.getCourseContent = function () {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.course_content,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.course = res.data.data
          cache.put('course', $scope.course)
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.getCertificateStatus = function () {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.certifiate_status,
          {},
          {
            crs_id: $stateParams.cid,
            a_id: $cookies.get('aid'),
            p_id: $stateParams.pid,
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.certi_status = res.data.data.status
          $scope.internal_status = res.data.data.internal_status
          $scope.tracking_id = res.data.data.tracking_id
          $scope.assign_date = res.data.data.assign_date
          $scope.disp_date = res.data.data.dispatch_date
          $scope.number = res.data.data.number
          $scope.del_date = res.data.data.del_date
          $scope.delvery_num = res.data.data.delvy_num
          $scope.c_name = res.data.data.c_name
          cache.put('certificate_status', $scope.certi_status)
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.downloadCertificate = function () {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.apply_certificate,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.crtf_file = res.data.data.crtf_file
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.downloadCertificate()
            })
          }
        })
    }

    $scope.certificateText = function (internal_status) {
      $scope.text = ''
      if (internal_status == 1) {
        $scope.text = 'Request Received'
        $scope.textColor = {
          color: '#4bb543',
        }
      }
      if (internal_status == 2 || internal_status == 3) {
        $scope.text = 'Certificate Dispatched'
        $scope.textColor = {
          color: '#4bb543',
        }
      }
      if (internal_status == 5) {
        $scope.text = 'Certificate Delivered'
        $scope.textColor = {
          color: '#4bb543',
        }
      }
      if (internal_status == 4) {
        $scope.text = 'Delivery Failed'
        $scope.textColor = {
          color: '#e94b35',
        }
      }
      return $scope.text
    }

    $scope.init = function () {
      console.log('Status controller loaded')
      $scope.getGraduationStatus()
      $scope.getCourseContent()
      $scope.getCertificateStatus()
      $scope.downloadCertificate()
    }
    $scope.init()
  },
])
var assignmentController = angular.module('assignmentController', [
  'ngMaterial',
  'apiService',
  'ui.ace',
])

assignmentController.controller('assignmentController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  '$http',
  'Upload',
  'alertify',
  '$cookies',
  '$mdDialog',
  '$timeout',
  '$sce',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    $http,
    $upload,
    alertify,
    $cookies,
    $mdDialog,
    $timeout,
    $sce
  ) {
    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid
    $scope.topic = $stateParams.topic
    $scope.chapter = $stateParams.chid
    $scope.progress = 0
    $scope.fetchcompilerresult = false
    $scope.showTestCaseInputArea = false
    $scope.custominput = ''
    $scope.codingassignment_result = false
    $scope.codingAssignmentSubmissionStatusModal = false
    $scope.submitAssignmentModal = false
    $scope.compilerresult = false
    $scope.assignment_dealine_reached = false
    $scope.plag_check = false
    $scope.word_count = 0
    $scope.is_deadline_set = false
    $scope.st_dl = ''
    $scope.last_dt = ''
    $scope.tz = ''
    $scope.showDt = ''
    $scope.isDeadLineExceeded = false
    $scope.remarks = ''
    $scope.breadCrumbs = store.getBreadCrumbs()

    $scope.execution_status_value = {
      11: 'Compilation Error',
      12: 'Runtime Error',
      13: 'Time Limit Exceeded',
      14: 'Wrong Answer',
      15: 'Accepted',
      17: 'Memory limit exceeded',
      19: 'Illegal System Call',
      20: 'Internal Error',
    }

    $scope.languagemodes = {
      C: 'c_cpp',
      'C++': 'c_cpp',
      'C++14': 'c_cpp',
      'C++ 4.3.2': 'c_cpp',
      Java: 'java',
      'JavaScript (rhino)': 'javascript',
      'JavaScript (spidermonkey)': 'javascript',
      'JavaScript(Node.js)': 'javascript',
      PHP: 'php',
      Python: 'python',
      'Python (Pypy)': 'python',
      'Python 3': 'python',
      R: 'r',
      Ruby: 'ruby',
    }

    $scope.$on('$locationChangeStart', function () {
      $scope.$parent.submitcodingassignmentcounter = false
      console.log(
        'routechanges ' + $scope.$parent.submitcodingassignmentcounter
      )
    })

    $scope.init = function () {
      $scope.$parent.markTopicActive($scope.chapter, $scope.topic)
      $scope.resubmit_button = true
      $scope.show_submit_assignment = false
      if ($scope.course) {
        $scope.activateAssignment()
      }
      $scope.updatePage()
    }

    $scope.updatePage = function () {
      $timeout(function () {
        if ($scope.showDt != '') {
          var timeGap = Date.now() - new Date($scope.showDt)
          if (timeGap > 0) {
            console.log('timegap', timeGap)
            //timelimit has reached
            $scope.showDt = ''
            $scope.userdata = {}
            $scope.init()
          }
        }
        $scope.updatePage()
      }, 60 * 1000)
    }

    $scope.$on('courseLoaded', function (args, course) {
      $scope.course = course
      $scope.activateAssignment()
    })

    $scope.aceLoaded = function (_editor) {
      // Options
      $scope.aceSession = _editor.getSession()
      _editor.setFontSize(16)
      _editor.getSession().setUseWorker(false)
      // _editor.setReadOnly(true);
    }

    $scope.aceChanged = function (e) {
      $scope.code_editor_value = $scope.aceSession.getDocument().getValue()
    }

    $scope.activateAssignment = function () {
      $scope.assignment = $scope.course.assignments[$scope.topic]
      $scope.descriptionAsHtml = $sce.trustAsHtml($scope.assignment.dsc)
      store.currentactive($scope.assignment)
      console.log(':::: Assignment :::: ', $scope.assignment)
      if ($scope.$parent.topics.length > 0) {
        $scope.$parent.doIhaveAParent(
          function (parent) {
            $scope.updateLectureAssignmentStatus(
              $scope.chapter,
              $scope.quiz._id,
              parent
            )
          },
          function () {
            $scope.updateAssignmentStatus($scope.chapter, $scope.assignment._id)
          }
        )
      }
      if ($scope.assignment.url) {
        $scope.viewInstructorVideo()
      }
      console.log($scope.assignment.extras)
      if ($scope.assignment && $scope.assignment.extras.length > 0) {
        for (var i = 0; i < $scope.assignment.extras.length; i++) {
          console.log($scope.assignment.extras[i])
          $scope.getSignedUrlAndUpdateData(
            $scope.course.others[$scope.assignment.extras[i]].url,
            $scope.assignment.extras[i],
            function (id, res) {
              $scope.course.others[id].signed_url = res.signed_url
            },
            function (err) {
              console.log(err)
            }
          )
        }
      }
    }

    $scope.updateLectureAssignmentStatus = function (
      chapter_id,
      assignment_id,
      lecture
    ) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.lecture_quiz_status,
          {},
          {
            crs_id: $stateParams.cid,
            cp_id: chapter_id,
            lc_id: lecture,
            qz_id: quiz_id,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {})
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.updateLectureAssignmentStatus(
                chapter_id,
                assignment_id,
                lecture
              )
            })
          }
        })
    }

    var getEventDate = function (event_date, event_timezone_offset) {
      var d = new Date(event_date)
      // var timeCorrection = d.getTimezoneOffset() - event_timezone_offset;
      // d.setMinutes(d.getMinutes() + timeCorrection);

      var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]

      var day = days[d.getDay()]
      var hr = d.getHours()
      var min = d.getMinutes()
      if (min < 10) {
        min = '0' + min
      }
      var ampm = 'AM'
      if (hr > 12) {
        hr -= 12
        ampm = 'PM'
      }

      var date = d.getDate()
      var month = months[d.getMonth()]
      var year = d.getFullYear()

      return (
        day +
        ' ' +
        date +
        ' ' +
        month +
        ' ' +
        year +
        ' ' +
        hr +
        ':' +
        min +
        ' ' +
        ampm
      )
    }

    $scope.updateAssignmentStatus = function (chapter_id, assignment_id) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.chapter_assignment_status,
          {},
          {
            crs_id: $stateParams.cid,
            cp_id: chapter_id,
            ag_id: assignment_id,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          $scope.userdata = res.data.data
          $scope.isDeadLineExceeded = $scope.userdata.isDeadLineExceeded
            ? true
            : false
          $scope.remarks = $scope.userdata.remarks
          $scope.assignment_dealine_reached = false
          $scope.is_deadline_set = $scope.userdata.is_deadline_set
          $scope.plag_check = $scope.userdata.plag_check
          $scope.word_count = $scope.userdata.word_count
          $scope.last_dt = $scope.userdata.last_dt
          $scope.server_time = $scope.userdata.stim
          $scope.tz = $scope.userdata.tz
          if (!$scope.userdata.submission_date) {
            $scope.resubmit_button = false
            $scope.updateShowSubmitAssignment()
          } else {
            $scope.showSubmitAssignment()
          }

          var serverTime = getEventDate(parseInt($scope.server_time), $scope.tz)
          if ($scope.last_dt) {
            $scope.showDt = getEventDate(parseInt($scope.last_dt), $scope.tz)
          }
          if ($scope.userdata.st_dl != '') {
            $scope.st_dl = $scope.userdata.st_dl
            if (parseInt($scope.st_dl) > parseInt($scope.last_dt)) {
              $scope.showDt = getEventDate(parseInt($scope.st_dl), $scope.tz)
            }
          }
          console.log('serverTime, ', serverTime)
          if ($scope.userdata.codingproblemdetails) {
            $scope.problem_statment_value =
              $scope.userdata.codingproblemdetails.prob_desc
            $scope.code_editor_value = $scope.userdata.user_source_code
              ? $scope.userdata.user_source_code
              : $scope.userdata.codingproblemdetails.pre_filled_code

            var editor = function () {
              this.theme = 'monokai'
              this.mode = $scope.languagemodes[$scope.userdata.language.lang]
                ? $scope.languagemodes[$scope.userdata.language.lang]
                : 'c_cpp'
              this.useWrapMode = true
              this.gutter = true
            }
            $scope.editor = new editor()
          }
        })
        .catch(function (err) {
          console.log(err)
          if (err.data && err.data.code == 207600) {
            $scope.assignment_dealine_reached = true
          }
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.updateChapterStatus(chapter._id)
            })
          }
        })
    }

    var handleFileSelect = function (evt) {
      $scope.progress = 0
      var file = evt.currentTarget.files[0]
      $scope.file_name = file.name
      var reader = new FileReader()
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          $scope.file = evt.target.result
          $scope.uploadFile(
            $scope.file,
            file.name,
            file.type,
            $scope.getExtension(file.name)
          )
        })
      }
      reader.readAsDataURL(file)
    }

    $scope.getExtension = function (filename) {
      return (
        filename.substring(filename.lastIndexOf('.') + 1, filename.length) ||
        filename
      )
    }

    $scope.getWithoutExtension = function (filename) {
      return filename.substring(0, filename.lastIndexOf('.')) || filename
    }

    $scope.uploadFile = function (file, fname, type, ext) {
      var time = new Date().getTime()
      var name = $scope.pid + '_' + time + '_' + fname

      $scope.getAWSCredentials(type, function (s3Params) {
        $scope.uploadToAWS(s3Params, name, type, file, function (url) {
          console.log(url)
          // $scope.assignment.file_url = url;
          $scope.progress = 100
        })
      })
    }

    $scope.getAWSCredentials = function (type, cb) {
      api
        .query(
          'GET',
          {
            'x-access-token': $cookies.get('at'),
          },
          constants.upload_media,
          {
            p_id: $stateParams.pid,
            g_id: $stateParams.gid,
            mimetype: type,
          },
          {}
        )
        .then(function (res) {
          cb(res.data.data)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (url) {
              $scope.getAWSCredentials(type, cb)
            })
          }
        })
    }

    $scope.uploadToAWS = function (s3Params, name, type, file, cb) {
      $upload
        .upload({
          url: 'https://' + s3Params.bucket + '.s3.amazonaws.com/',
          method: 'POST',
          transformRequest: function (data, headersGetter) {
            //Headers change hereee
            var headers = headersGetter()
            delete headers['Authorization']
            return data
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          fields: {
            key: name,
            AWSAccessKeyId: s3Params.AWSAccessKeyId,
            acl: 'authenticated-read',
            Policy: s3Params.s3Policy,
            Signature: s3Params.s3Signature,
            'Content-Type': type,
            success_action_status: '201',
          },
          file: file,
        })
        .then(
          function (response) {
            $scope.uploading = false
            $scope.uploaded = true
            $scope.assignment.file_url =
              'https://' + s3Params.bucket + '.s3.amazonaws.com/' + name
            cb('https://' + s3Params.bucket + '.s3.amazonaws.com/' + name)

            if (response.status === 201) {
              console.log(response)
            } else {
              $scope.error = 'Upload Failed'
            }
          },
          null,
          function (evt) {
            console.log(evt.loaded)
            console.log(evt.total)
            $scope.progress = parseInt((90.0 * evt.loaded) / evt.total)
          }
        )
    }

    $scope.deleteAttachment = function () {
      alertify.confirm(
        ' Are you sure you want to remove attachment ?',
        function () {
          $scope.$apply(function () {
            $scope.file_name = null
            $scope.progress = 0
          })
          document.getElementById('file').value = null
          $scope.assignment.file_url = null
        },
        function () {}
      )
    }

    $scope.viewInstructorVideo = function () {
      if ($scope.assignment.url.includes('https://vimeo.com/')) {
        $scope.assignment.url = $scope.assignment.url.replace(
          'https://vimeo.com/',
          'https://player.vimeo.com/video/'
        )
      } else if ($scope.assignment.url.includes('https://www.youtube.com/')) {
        $scope.assignment.url = $scope.assignment.url.replace(
          'https://www.youtube.com/watch?v=',
          'https://www.youtube.com/embed/'
        )
      } else if ($scope.assignment.url.includes('https://youtu.be/')) {
        $scope.assignment.url = $scope.assignment.url.replace(
          'https://youtu.be/',
          'https://www.youtube.com/embed/'
        )
      }
      $scope.assignment.replacedurl = $sce.trustAsResourceUrl(
        $scope.assignment.url
      )

      if ($scope.assignment.url.includes('https://player.vimeo.com/')) {
        var iframe = document.querySelector('iframe')
        setTimeout(function () {
          if ($scope.assignment.url && iframe) {
            $scope.player = new Vimeo.Player(iframe)
          }
        }, 0)
      }
    }

    $scope.downloadFile = function (id) {
      $scope.getSignedUrl(
        $scope.assignment.file,
        function (res) {
          $scope.signed_url = res.signed_url
          var i = '',
            file_content = ''
          var linkSource = '',
            downloadLink = '',
            fileName = '',
            content_type = ''
          $http({
            method: 'GET',
            url: res.signed_url,
          }).then(function mySuccess(response) {
            $scope.File = response.data
            i = $scope.File.indexOf(',')
            file_content = $scope.File.slice(i + 1)
            fileName = $scope.File.split(';')[0]
            content_type = fileName.slice(fileName.indexOf(':') + 1)
            // console.log("type---- "+content_type+"fileName "+fileName+"-----  "+file_content);
            var blob = b64toBlob(file_content, content_type, 512)
            var blobUrl = URL.createObjectURL(blob)
            linkSource = blobUrl
            downloadLink = document.getElementById(id)
            downloadLink.href = linkSource
            downloadLink.download = res.filename
            downloadLink.click()
          }),
            function myError(response) {
              $scope.myWelcome = response.statusText
            }
        },
        function (err) {
          console.log(err)
        }
      )
    }
    $scope.getSignedUrlAndUpdateData = function (
      url,
      resource,
      successCallback,
      failureCallback
    ) {
      api
        .query(
          'GET',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.get_signed_url,
          {
            m_url: url,
            g_id: $scope.gid,
            p_id: $stateParams.pid,
            tokn: $cookies.get('at'),
          },
          {}
        )
        .then(function (res) {
          console.log(res)
          successCallback(resource, res.data.data)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.getSignedUrlAndUpdateData(url)
            })
          }
          failureCallback(err)
        })
    }

    $scope.downloadPreviousUploadedFile = function (id) {
      $scope.getSignedUrl(
        $scope.userdata.assignment_data.file,
        function (res) {
          $scope.signed_url = res.signed_url
          var i = '',
            file_content = ''
          var linkSource = '',
            downloadLink = '',
            fileName = '',
            content_type = ''
          $http({
            method: 'GET',
            url: res.signed_url,
          })
            .then(function mySuccess(response) {
              $scope.File = response.data
              i = $scope.File.indexOf(',')
              file_content = $scope.File.slice(i + 1)
              fileName = $scope.File.split(';')[0]
              content_type = fileName.slice(fileName.indexOf(':') + 1)
              console.log(
                'type---- ' +
                  content_type +
                  'fileName ' +
                  fileName +
                  '-----  ' +
                  file_content
              )
              var blob = b64toBlob(file_content, content_type, 512)
              var blobUrl = URL.createObjectURL(blob)
              linkSource = blobUrl
              downloadLink = document.getElementById(id)
              downloadLink.href = linkSource
              downloadLink.download = res.filename
              downloadLink.click()
            })
            .catch(function (err) {
              linkSource = $scope.userdata.assignment_data.file
              downloadLink = document.getElementById(id)
              downloadLink.href = linkSource
              downloadLink.download = res.filename
              downloadLink.click()
            })
        },
        function (err) {
          console.log(err)
        }
      )
    }

    var b64toBlob = function (b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 512

      var byteCharacters = atob(b64Data)

      var byteArrays = []

      for (
        var offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        var slice = byteCharacters.slice(offset, offset + sliceSize)

        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        var byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }

      var blob = new Blob(byteArrays, { type: contentType })
      return blob
    }

    $scope.getSignedUrl = function (url, successCallback, failureCallback) {
      api
        .query(
          'GET',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.get_signed_url,
          {
            m_url: url,
            g_id: $scope.gid,
            p_id: $stateParams.pid,
            tokn: $cookies.get('at'),
          },
          {}
        )
        .then(function (res) {
          successCallback(res.data.data)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.getSignedUrl(url)
            })
          }
          failureCallback(err)
        })
    }

    $scope.showDialog = function (ev) {
      // console.log(history.state);
      if (screen.width > 500) {
        $scope.webModal = true
        $scope.mobileModal = false
        $mdDialog.show({
          contentElement: '#myDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          escapeToClose: false,
        })
      } else {
        // console.log($(location).attr('href'));
        // history.pushState(null, null, $(location).attr('href'));
        // window.addEventListener('popstate', function () {
        // 		history.pushState(null, null, $(location).attr('href'));
        // });
        $scope.webModal = false
        $scope.mobileModal = true
        $mdDialog.show({
          contentElement: '#myMobileDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          escapeToClose: false,
        })
      }
    }

    $scope.cancel = function () {
      $mdDialog.cancel()
    }

    $scope.backPanel = function () {
      $mdDialog.cancel()
      // console.log(history.state);
      // history.back();
      // history.back();

      // console.log($(location).attr('href'));

      // history.pushState("sd", "sdsd", $(location).attr('href'));
      // window.history.back();
    }

    $scope.submitAssignment = function () {
      // console.log($scope.assignment.file_url+'-----'+$scope.assignment.text);
      //  console.log("sssWSS "+$scope.progress+" ss "+$scope.file_name);
      if ($scope.file_name && $scope.progress != 100) {
        alertify.alert('Please wait for the file to get uploaded completely!')
      } else if (
        ($scope.assignment.file_url == null &&
          $scope.assignment.text == null) ||
        ($scope.assignment.file_url == '' && $scope.assignment.text == '') ||
        ($scope.assignment.file_url == null && $scope.assignment.text == '') ||
        ($scope.assignment.file_url == '' && $scope.assignment.text == null)
      ) {
        alertify.alert('Please complete the assignment before submitting!')
      } else {
        api
          .query(
            'POST',
            {
              'x-access-crs-token': $cookies.get('crs_tkn'),
            },
            constants.submit_assignment,
            {},
            {
              crs_id: $stateParams.cid,
              p_id: $stateParams.pid,
              a_id: $cookies.get('aid'),
              ag_id: $scope.assignment._id,
              dt: {
                file: $scope.assignment.file_url,
                text: $scope.assignment.text,
              },
            }
          )
          .then(function (res) {
            alertify.alert('Successfully submitted assignment.', function () {
              $scope.init()
            })
          })
          .catch(function (err) {
            console.log(err)
            if (err.status && err.status == 498 && err.data.code == 4100) {
              api.getAccessToken().then(function (res) {
                $scope.init()
              })
            }
            if (
              err.status &&
              (err.data.code == 701000 || err.data.code == 703000)
            ) {
              var err_msg =
                err.data.message + ' Word Limit : ' + $scope.word_count
              alertify.alert(err_msg, function () {
                $scope.init()
              })
            }
          })
      }
    }

    $scope.testRunCodingAssignment = function () {
      $scope.codingassignment_result = false
      if (!$scope.code_editor_value) {
        alertify.alert("Source Code can't be empty!")
      } else {
        $scope.fetchcompilerresult = true
        $scope.compilerresult = ''
        api
          .query(
            'POST',
            {
              'x-access-crs-token': $cookies.get('crs_tkn'),
            },
            constants.test_run_src_code,
            {},
            {
              crs_id: $stateParams.cid,
              p_id: $stateParams.pid,
              a_id: $cookies.get('aid'),
              ag_id: $scope.assignment._id,
              src_cod: $scope.code_editor_value,
              cstm_inp: $scope.custominput,
            }
          )
          .then(function (res) {
            $scope.codingassignment_result = false
            $scope.fetchcompilerresult = false
            $scope.compilerresult = res.data.data
          })
          .catch(function (err) {
            console.log(err)
            $scope.fetchcompilerresult = false
            alertify.alert(
              'Some error occurs while submitting the assignment. Please, try again after some time.'
            )
            if (err.status && err.status == 498 && err.data.code == 4100) {
              api.getAccessToken().then(function (res) {
                $scope.init()
              })
            }
          })
      }
    }

    $scope.submitCodingAssignment = function (ev) {
      $scope.compilerresult = false
      $scope.showTestCaseInputArea = false
      $scope.custominput = ''
      document.getElementById('custominputcheckbox').checked = false
      if (!$scope.code_editor_value) {
        alertify.alert("Source Code can't be empty!")
      } else {
        $scope.submitAssignmentModal = true
        $mdDialog.show({
          contentElement: '#submitAssignmentModal',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          escapeToClose: false,
        })
      }
    }

    $scope.fetchCodingAssignmentSubmissionResult = function (ev) {
      $scope.$parent.submitcodingassignmentcounter = true
      // console.log($scope.$parent.submitcodingassignmentcounter);
      $mdDialog.cancel()
      $scope.fetchcompilerresult = true
      $scope.codingassignment_result = false
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.submit_coding_assignment,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            cp_id: $scope.chapter,
            a_id: $cookies.get('aid'),
            ag_id: $scope.assignment._id,
            src_cod: $scope.code_editor_value,
          }
        )
        .then(function (res) {
          // console.log(res);
          $scope.fetchcompilerresult = false
          $scope.compilerresult = false

          if (
            $scope.$parent != null &&
            $scope.$parent.submitcodingassignmentcounter == true
          ) {
            $scope.codingAssignmentSubmissionStatusModal = true
            $scope.assignment_status = res.data.data
            $scope.codingassignment_result = res.data.data.codingsubmission
            $scope.testcases = res.data.data.testcases
            $mdDialog.show({
              contentElement: '#codingAssignmentSubmissionStatusModal',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: false,
              escapeToClose: false,
              closeTo: {
                left: 4800,
              },
            })
          }
        })
        .catch(function (err) {
          console.log(err)
          $scope.fetchcompilerresult = false
          alertify.alert(
            'Some error occurs while submitting the assignment. Please, try again after some time.'
          )
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.init()
            })
          }
        })
    }

    $scope.resetCodeToOriginal = function () {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.reset_code_editor_value,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            cp_id: $scope.chapter,
            a_id: $cookies.get('aid'),
            ag_id: $scope.assignment._id,
          }
        )
        .then(function (res) {
          setTimeout(function () {
            $scope.$apply(function ($scope) {
              $scope.code_editor_value =
                $scope.userdata.codingproblemdetails.pre_filled_code
            })
          }, 0)
        })
        .catch(function (err) {
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.init()
            })
          }
        })
    }

    $scope.showSubmitAssignment = function () {
      var userdata = $scope.userdata
      // check if we will be uploading assignment or not
      if (userdata.upload_assignment) {
        // check if responded by mentor or not
        if (userdata.assignment_status) {
          // check if assignment is approved or not
          if (userdata.assignment_status == 1) {
            $scope.show_submit_assignment = $scope.resubmit_button
              ? false
              : true
          } else {
            $scope.show_submit_assignment = false
          }
        } else {
          $scope.show_submit_assignment = $scope.resubmit_button ? false : true
        }
      } else {
        $scope.show_submit_assignment = false
      }
    }

    $scope.updateShowSubmitAssignment = function () {
      var userdata = $scope.userdata
      // check if we will be uploading assignment or not
      if (userdata.upload_assignment) {
        // check if responded by mentor or not
        if (userdata.assignment_status) {
          // check if assignment is approved or not
          if (userdata.assignment_status == 1) {
            $scope.show_submit_assignment = true
          } else {
            $scope.show_submit_assignment = false
          }
        } else {
          $scope.show_submit_assignment = true
        }
      } else {
        $scope.show_submit_assignment = false
      }
    }

    $scope.resubmitAssignment = function () {
      $scope.resubmit_button = false
      $scope.userdata.upload_assignment = true
      $scope.assignment.file_url = null
      $scope.assignment.text = null
      $scope.file_name = null
      $scope.progress = 0
      document.getElementById('file').value = null
      $scope.updateShowSubmitAssignment()
    }

    $scope.customTestCaseInputArea = function () {
      if (document.getElementById('custominputcheckbox').checked) {
        $scope.showTestCaseInputArea = true
      } else {
        $scope.custominput = ''
        $scope.showTestCaseInputArea = false
      }
    }

    angular
      .element(document.querySelector('#file'))
      .on('change', handleFileSelect)

    $scope.init()
  },
])
var certificateController = angular.module('certificateController', [
  'apiService',
])
certificateController.controller('certificateController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  'Upload',
  '$rootScope',
  'superCache',
  'alertify',
  '$uibModal',
  '$copyToClipboard',
  '$cookies',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    $upload,
    $rootScope,
    cache,
    alertify,
    $uibModal,
    $copyToClipboard,
    $cookies
  ) {
    $scope.safeApply = function (fn) {
      var phase = this.$root.$$phase
      if (phase == '$apply' || phase == '$digest') {
        if (fn && typeof fn === 'function') {
          fn()
        }
      } else {
        this.$apply(fn)
      }
    }
    console.log($stateParams, $stateParams.pid, ';=============;')
    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid
    $scope.i_paid = false
    $scope.r_dsp = false
    $scope.topics = {}
    $scope.slider = {
      value: 5,
      options: {
        showTicksValues: true,
        stepsArray: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
          { value: 7 },
          { value: 8 },
          { value: 9 },
          { value: 10 },
        ],
      },
    }

    $scope.adrs_req_stt = ''

    $scope.disp = {
      current: '1',
      enable: false,
    }
    $scope.isCodingCourse = false
    $scope.progress = 0
    $scope.shouldUpdateAttachment = false
    $scope.upload = {}
    $scope.names = [
      'Andhra Pradesh',
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Dadra and Nagar Haveli',
      'Daman and Diu',
      'Delhi',
      'Goa',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Jammu and Kashmir',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Orissa',
      'Puducherry',
      'Punjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Telangana',
      'Tripura',
      'Uttar Pradesh',
      'Uttarakhand',
      'West Bengal',
    ]

    //---Social Link---//
    $scope.gh_url = null
    $scope.gh_conn = false

    $scope.fb_url = null
    $scope.fb_conn = false

    $scope.ln_url = null
    $scope.isSocCon = false

    $scope.user_linkedin_url = ''
    $scope.user_facebook_url = ''
    $scope.socialInptUpdate = false
    $scope.socErr = false
    $scope.socErrMsg = ''
    //-----------------//

    $scope.connectGithub = function () {
      var r_url = window.location.href
        .replace('/certificate/social/', '/certificate/social_redirect/')
        .replace('/#/', '/?type=github#/')
        .replace(/\:/g, '%3A')
        .replace(/\//g, '%2F')
        .replace(/#/g, '%23')
        .replace(/=/g, '%3D')
        .replace(/\?/g, '%3F')
      console.log(r_url)
      var g_url = 'https://github.com/login/oauth/authorize?'
      g_url += 'client_id=727cada534a8610dccc8'
      g_url += '&state=eckovationcertificatesocialconnect&allow_signup=false'
      g_url += '&scope=read%3Auser'
      g_url += '&redirect_uri=' + r_url
      console.log(g_url)
      window.location.href = g_url
    }

    $scope.connectFacebook = function () {
      FB.getLoginStatus(function (resp) {
        if (resp.status !== 'connected') {
          return login()
        }
        return verifyLogin(resp)
      })

      function login() {
        FB.login(
          function (resp) {
            if (resp.status === 'connected') {
              return verifyLogin(resp)
            }
          },
          { scope: 'email' }
        )
      }

      function verifyLogin(ob) {
        var data = ob.authResponse
        data.aid = $cookies.get('aid')
        api
          .query(
            'POST',
            {
              'x-access-crs-token': $cookies.get('crs_tkn'),
            },
            constants.auth_facebook,
            {},
            data
          )
          .then(function (res) {
            return window.location.reload()
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    }

    $scope.saveGraduationDetails = function (data, cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.upload_grad_details,
          {},
          {
            crs_id: $stateParams.cid,
            npsv: data.npsv,
            fdbk: data.fdbk,
            img: data.img,
            rtng: data.rtng,
            idntf: data.idntf,
            email: data.email,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
            r_dsp: data.r_dsp,
            adrs1: data.adrs1,
            adrs2: data.adrs2,
            adrs_cty: data.adrs_cty,
            adrs_ste: data.adrs_ste,
            adrs_cnty: data.adrs_cnty,
            adrs_p_code: data.adrs_p_code,
            usr_crt_nme: data.usr_crt_nme,
          }
        )
        .then(function (res) {
          cb()
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.saveGraduationDetails(data)
            })
          }
        })
    }

    $scope.getGraduationStatus = function () {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.get_grad_status,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.adrs_req_stt = res.data.data.adrs_req_stt
          $scope.isCodingCourse =
            !isNaN(res.data.data.c_type) && res.data.data.c_type === 2
              ? true
              : false
          $scope.gh_url = res.data.data.soc_gh ? res.data.data.soc_gh : null
          $scope.fb_url = res.data.data.soc_fb ? res.data.data.soc_fb : null
          $scope.ln_url = res.data.data.soc_ln ? res.data.data.soc_ln : null
          $scope.fb_id = res.data.data.soc_fb_id
            ? res.data.data.soc_fb_id
            : null
          if (res.data.data.soc_gh) {
            $scope.gh_conn = true
          }
          if (res.data.data.soc_fb_id) {
            $scope.fb_conn = true
          }
          if (res.data.data.soc_fb) {
            $scope.user_facebook_url = res.data.data.soc_fb
          }
          if (res.data.data.soc_ln) {
            $scope.user_linkedin_url = res.data.data.soc_ln
          }
          if ($scope.isCodingCourse) {
            $scope.isSocCon =
              res.data.data.soc_gh && res.data.data.soc_ln
                ? // || ((res.data.data.soc_fb && res.data.data.soc_fb_id))

                  true
                : false
          } else {
            $scope.isSocCon =
              (res.data.data.soc_fb && res.data.data.soc_fb_id) ||
              res.data.data.soc_ln
                ? true
                : false
          }

          $scope.safeApply()
          $scope.npsTopics = res.data.data.nps
          $scope.details = res.data.data.details
          $scope.linkedinKeys = res.data.data.linked_keys
          $scope.i_paid = res.data.data.i_paid
          if ($scope.details.crtf && !$stateParams.edit) {
            $state.go('chapter.certificate.getc')
          }
          if ($scope.details.rtng) {
            $scope.slider.value = parseInt($scope.details.rtng)
          }
          if ($scope.details.fdbk) {
            $scope.textfb = $scope.details.fdbk
          }
          if ($scope.details.email) {
            $scope.mail = $scope.details.email
          }
          if ($scope.details.npsv) {
            for (var i = 0; i < $scope.details.npsv.length; i++) {
              $scope.topics[$scope.details.npsv[i]] = true
            }
          }
          if (
            $scope.details.idnt &&
            $state.current.name.includes('chapter.certificate.idupload')
          ) {
            $scope.progress = 100
            $scope.file_name = $scope.details.idnt
            $scope.shouldUpdateAttachment = false
          }

          if (
            $scope.details.img &&
            $state.current.name.includes('chapter.certificate.tupload')
          ) {
            $scope.progress = 100
            $scope.file_name = $scope.details.img
            $scope.shouldUpdateAttachment = false
          }
          if ($scope.details.usr_crt_nme) {
            $scope.usr_crt_nme = $scope.details.usr_crt_nme
          }
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.getGraduationStatus()
            })
          }
        })
    }

    $scope.changeFacebookUrlInpt = function (e) {
      $scope.user_facebook_url = e
      $scope.socialInptUpdate = true
      var lnu =
        typeof $scope.user_linkedin_url === 'string' &&
        $scope.user_linkedin_url.trim().length > 0
          ? $scope.user_linkedin_url
          : null
      var fbu =
        typeof $scope.user_facebook_url === 'string' &&
        $scope.user_facebook_url.trim().length > 0
          ? $scope.user_facebook_url
          : null

      if ($scope.isCodingCourse) {
        $scope.isSocCon = $scope.gh_conn && lnu ? true : false
      } else {
        $scope.isSocCon = fbu || lnu ? true : false
      }
    }

    $scope.changeLinkedInUrlInpt = function (e) {
      $scope.user_linkedin_url = e
      $scope.socialInptUpdate = true
      var lnu =
        typeof $scope.user_linkedin_url === 'string' &&
        $scope.user_linkedin_url.trim().length > 0
          ? $scope.user_linkedin_url
          : null
      var fbu =
        typeof $scope.user_facebook_url === 'string' &&
        $scope.user_facebook_url.trim().length > 0
          ? $scope.user_facebook_url
          : null

      if ($scope.isCodingCourse) {
        $scope.isSocCon = $scope.gh_conn && lnu ? true : false
      } else {
        $scope.isSocCon = fbu || lnu ? true : false
      }
    }

    $scope.saveAndGoToTopicFB = function () {
      console.log($stateParams)
      var data = {
        rtng: $scope.slider.value,
      }
      $scope.saveGraduationDetails(data, function () {
        console.log('graduation ratings details saved', data)

        if (data.rtng > 8) {
          $state.go('chapter.certificate.leavefb', {
            edit: !!$stateParams.edit,
            cid: $scope.cid,
          })
          return
        }
        $state.go('chapter.certificate.topicfb', {
          edit: $stateParams.edit,
          cid: $scope.cid,
        })
      })
    }

    $scope.saveAndGoToFB = function () {
      console.log($scope.free)
      var npsvArr = []

      npsvArr = Object.keys($scope.topics)
        .map(function (key, index) {
          return key
        })
        .filter(function (topic) {
          return $scope.topics[topic]
        })

      if (npsvArr.length <= 0) {
        $scope.error = 'Please select atleast one feedback'
        return
      }

      var data = {
        npsv: npsvArr,
      }

      $scope.saveGraduationDetails(data, function () {
        console.log('graduation nps details saved')
        $state.go('chapter.certificate.leavefb', {
          edit: $stateParams.edit,
          cid: $scope.cid,
        })
      })
    }

    $scope.saveAndGoToSocialConnect = function () {
      var data = {
        usr_crt_nme: $scope.usr_crt_nme,
      }
      $scope.saveGraduationDetails(data, function () {
        console.log('Certificate Name Saved')
        $state.go('chapter.certificate.social', {
          edit: $stateParams.edit,
          cid: $scope.cid,
        })
      })
    }

    $scope.saveAndGoToMail = function () {
      if ($scope.socialInptUpdate === true) {
        api
          .query(
            'POST',
            {
              'x-access-crs-token': $cookies.get('crs_tkn'),
            },
            constants.save_social_detail,
            {},
            {
              a_id: $cookies.get('aid'),
              fb_url: $scope.user_facebook_url,
              ln_url: $scope.user_linkedin_url,
            }
          )
          .then(function (res) {
            if (res && res.data && res.data.success) {
              return $state.go('chapter.certificate.mail', {
                edit: $stateParams.edit,
                cid: $scope.cid,
              })
            } else if (
              res &&
              res.data &&
              res.data.success === false &&
              res.data.message
            ) {
              $scope.socErr = true
              $scope.socErrMsg = res.data.message
              $scope.safeApply()
              setTimeout(function () {
                $scope.socErr = false
                $scope.socErrMsg = ''
                $scope.safeApply()
              }, 2000)
            }
          })
          .catch(function (err) {
            if (err && err.data && err.data.message) {
              $scope.socErr = true
              $scope.socErrMsg = err.data.message
              $scope.safeApply()
              setTimeout(function () {
                $scope.socErr = false
                $scope.socErrMsg = ''
                $scope.safeApply()
              }, 2000)
            }
            if (err.status && err.status == 498 && err.data.code == 4100) {
              return api.getAccessToken().then(function (res) {
                $scope.saveAndGoToMail()
              })
            }
          })
      } else {
        return $state.go('chapter.certificate.mail', {
          edit: $stateParams.edit,
          cid: $scope.cid,
        })
      }
    }

    $scope.saveAndGoToCerti_Name = function () {
      var data = {
        fdbk: $scope.textfb,
      }
      $scope.saveGraduationDetails(data, function () {
        console.log('graduation feedback saved')
        $state.go('chapter.certificate.certi', {
          edit: $stateParams.edit,
          cid: $scope.cid,
        })
      })
    }

    $scope.delivery = function (data) {
      var data = {
        email: $scope.mail,
      }
      $scope.saveGraduationDetails(data, function () {
        if (!$scope.i_paid) {
          a = {
            adrs1: '',
            adrs2: '',
            adrs_cty: '',
            adrs_cnty: '',
            adrs_p_code: '',
            adrs_ste: '',
          }
          store.storeStatus('true')
          store.storeAdd(a)
          $state.go('chapter.certificate.idupload', {
            edit: $stateParams.edit,
            cid: $scope.cid,
          })
        } else {
          $state.go('chapter.certificate.dispatch', {
            edit: $stateParams.edit,
            cid: $scope.cid,
          })
        }
      })
    }

    $scope.saveAndGoToDispatch = function () {
      $scope.saveGraduationDetails(data, function () {
        console.log('graduation email saved')
        $state.go('chapter.certificate.dispatch', {
          edit: $stateParams.edit,
          cid: $scope.cid,
        })
      })
    }

    $scope.enableDelivery = function (shouldDeliver) {
      if (shouldDeliver == 'Yes') {
        $scope.disp.current = '2'
        var data = {
          r_dsp: true,
        }
        store.storeStatus('true')
        $scope.saveGraduationDetails(data, function () {
          console.log('details saved')
        })
      } else if (shouldDeliver == 'No') {
        // $scope.disp.current = '3';
        a = {
          adrs1: '',
          adrs2: '',
          adrs_cty: '',
          adrs_cnty: '',
          adrs_p_code: '',
          adrs_ste: '',
        }
        store.storeStatus('true')
        store.storeAdd(a)
        $state.go('chapter.certificate.idupload', {
          edit: $stateParams.edit,
          cid: $scope.cid,
        })
      }
    }

    $scope.validatePinCode = function (event) {
      if (event.target.value.length >= 6) {
        event.preventDefault()
      } else {
        var validNumCodes = []
        var userPressedKey = event.which

        for (var i = 48; i < 58; i++) {
          validNumCodes.push(i)
        }

        if (!(validNumCodes.indexOf(userPressedKey) >= 0)) {
          event.preventDefault()
        }
      }
    }

    $scope.saveAndGoToUploadID = function () {
      var dataA = {
        adrs1: $scope.disp.address1,
        adrs2: $scope.disp.address2,
        adrs_cty: $scope.disp.address3,
        adrs_ste: $scope.disp.address4,
        adrs_cnty: $scope.disp.address6,
        adrs_p_code: $scope.disp.address5,
      }
      if ($scope.disp.address6 == 'India') {
        var data = {
          adrs1: $scope.disp.address1,
          adrs2: $scope.disp.address2,
          adrs_cty: $scope.disp.address3,
          adrs_ste: $scope.disp.address4,
          adrs_cnty: $scope.disp.address6,
          adrs_p_code: $scope.disp.address5,
        }
      }
      //	console.log(dataA)
      store.storeAdd(dataA)
      $scope.saveGraduationDetails(data, function () {
        console.log('graduation address saved')
        $state.go('chapter.certificate.idupload', {
          edit: $stateParams.edit,
          cid: $scope.cid,
        })
      })
    }

    $scope.init = function () {
      $scope.showLoader = true
      console.log('Certificate controller loaded')
      $scope.getGraduationStatus()
      if ($state.current.name.includes('chapter.certificate.getc')) {
        // $scope.certificateMode = true;
        console.log('Auto get certificate')
        $scope.downloadCertificate()
      }
    }

    var handleFileSelect = function (evt) {
      console.log(evt)
      var file = evt.currentTarget.files[0]
      $scope.file_name = file.name
      $scope.progress = 0
      $scope.shouldUpdateAttachment = true
      var reader = new FileReader()
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          $scope.file = evt.target.result
          $scope.uploadFile(
            $scope.file,
            file.name,
            file.type,
            $scope.getExtension(file.name)
          )
        })
      }
      reader.readAsDataURL(file)
    }

    $scope.getExtension = function (filename) {
      return (
        filename.substring(filename.lastIndexOf('.') + 1, filename.length) ||
        filename
      )
    }

    $scope.getWithoutExtension = function (filename) {
      return filename.substring(0, filename.lastIndexOf('.')) || filename
    }

    $scope.uploadFile = function (file, fname, type, ext) {
      var time = new Date().getTime()
      var name = $scope.pid + '_' + time + '_' + fname

      $scope.getAWSCredentials(type, function (s3Params) {
        $scope.uploadToAWS(s3Params, name, type, file, function (url) {
          $scope.upload.idntf_url = url
        })
      })
    }

    $scope.getAWSCredentials = function (type, cb) {
      api
        .query(
          'GET',
          {
            'x-access-token': $cookies.get('at'),
          },
          constants.upload_media,
          {
            p_id: $stateParams.pid,
            g_id: $stateParams.gid,
            mimetype: type,
          },
          {}
        )
        .then(function (res) {
          console.log(res)
          cb(res.data.data)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (url) {
              $scope.getAWSCredentials(type, cb)
            })
          }
        })
    }

    $scope.uploadToAWS = function (s3Params, name, type, file, cb) {
      $upload
        .upload({
          url: 'https://' + s3Params.bucket + '.s3.amazonaws.com/',
          method: 'POST',
          transformRequest: function (data, headersGetter) {
            //Headers change here
            var headers = headersGetter()
            delete headers['Authorization']
            return data
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          fields: {
            key: name,
            AWSAccessKeyId: s3Params.AWSAccessKeyId,
            acl: 'authenticated-read',
            Policy: s3Params.s3Policy,
            Signature: s3Params.s3Signature,
            'Content-Type': type,
            success_action_status: '201',
          },
          file: file,
        })
        .then(
          function (response) {
            $scope.progress = 100
            $scope.uploading = false
            $scope.uploaded = true

            cb('https://' + s3Params.bucket + '.s3.amazonaws.com/' + name)

            if (response.status === 201) {
              console.log(response)
            } else {
              $scope.error = 'Upload Failed'
            }
          },
          null,
          function (evt) {
            $scope.progress = parseInt((100.0 * evt.loaded) / evt.total)
          }
        )
    }

    $scope.deleteAttachment = function () {
      alertify.confirm(
        ' Are you sure you want to remove attachment ?',
        function () {
          $scope.$apply(function () {
            $scope.file_name = null
          })
          document.getElementById('file').value = null
          $scope.upload.idntf_url = null
          $scope.progress = 0
          $scope.progress = 0
          $scope.progress = 0
        },
        function () {}
      )
    }

    $scope.saveAndUploadTestimonial = function () {
      var a = store.getAddress()
      if (
        a.add1.length == 0 &&
        a.add2.length == 0 &&
        a.addcity.length == 0 &&
        a.addstate.length == 0 &&
        a.addcountry.length == 0 &&
        a.zip.length == 0 &&
        !$scope.shouldUpdateAttachment
      ) {
        var data = {
          r_dsp: false,
        }
        $scope.saveGraduationDetails(data, function () {
          console.log('graduation address saved ')
          $state.go('chapter.certificate.tupload', {
            cid: $scope.cid,
            edit: $stateParams.edit,
          })
        })
      } else if (
        a.add1.length == 0 &&
        a.add2.length == 0 &&
        a.addcity.length == 0 &&
        a.addstate.length == 0 &&
        a.addcountry.length == 0 &&
        a.zip.length == 0 &&
        $scope.shouldUpdateAttachment
      ) {
        var data = {
          idntf: $scope.upload.idntf_url,
          r_dsp: false,
        }
        $scope.saveGraduationDetails(data, function () {
          console.log('graduation address saved ')
          $state.go('chapter.certificate.tupload', {
            cid: $scope.cid,
            edit: $stateParams.edit,
          })
        })
      } else if (!$scope.shouldUpdateAttachment) {
        $state.go('chapter.certificate.tupload', {
          cid: $scope.cid,
          edit: $stateParams.edit,
        })
      } else {
        console.log('should update : ', $scope.shouldUpdateAttachment)
        var data = {
          idntf: $scope.upload.idntf_url,
        }
        $scope.saveGraduationDetails(data, function () {
          console.log('graduation address saved re')
          $state.go('chapter.certificate.tupload', {
            cid: $scope.cid,
            edit: $stateParams.edit,
          })
        })
      }
    }

    $scope.saveAndGoToGetCertificate = function () {
      console.log('should update : ', $scope.shouldUpdateAttachment)
      if (!$scope.shouldUpdateAttachment) {
        $state.go('chapter.certificate.getc', {
          cid: $scope.cid,
        })
        return
      }
      var data = {
        img: $scope.upload.idntf_url,
      }
      $scope.saveGraduationDetails(data, function () {
        console.log('graduation address saved')
        $state.go('chapter.certificate.getc', {
          cid: $scope.cid,
        })
      })
    }

    $scope.downloadCertificate = function () {
      store.savelaststate()
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.apply_certificate,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.showLoader = false
          //	store.changestate()
          $scope.crtf_file = res.data.data.crtf_file
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.downloadCertificate()
            })
          }
        })
    }

    $scope.goBack = function () {
      window.history.back()
    }

    $scope.editDetails = function () {
      $state.go('chapter.certificate.nps', {
        edit: true,
      })
    }

    $scope.linkedinController = function (
      $scope,
      keys,
      $copyToClipboard,
      $uibModalInstance,
      alertify
    ) {
      console.log('linkedin', keys)
      $scope.keys = keys

      $scope.copyKeyToClipboard = function (key) {
        // console.log(key);
        $copyToClipboard.copy(key).then(function () {
          alertify.logPosition('top right')
          alertify.log("Copied '" + key + "'")
        })
      }

      $scope.ok = function () {
        window.open(
          'https://www.linkedin.com/profile/add/?startTask=CERTIFICATION_NAME',
          '_blank'
        )
      }

      $scope.cancel = function () {
        $uibModalInstance.dismiss()
      }
    }

    $scope.shareOnLinkedin = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/linkedin.html',
        controller: $scope.linkedinController,
        size: 'lg',
        resolve: {
          keys: function () {
            return $scope.linkedinKeys
          },
        },
      })

      modalInstance.result.then(
        function () {
          // $ctrl.selected = selectedItem;
        },
        function () {
          // $log.info('Modal dismissed at: ' + new Date());
        }
      )
    }

    angular
      .element(document.querySelector('#file'))
      .on('change', handleFileSelect)

    $scope.init()
  },
])
var courseController = angular.module('certificateViewController', [
  'apiService',
])
courseController.controller('certificateViewController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  'superCache',
  '$cookies',
  '$window',
  '$timeout',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    cache,
    $cookies,
    $window,
    $timeout
  ) {
    // console.log("fucked")
    $scope.downloadCertificate = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.apply_certificate,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.crtf_file = res.data.data.crtf_file
          $scope.shortedCertiverificationUrl = res.data.data.verification_url
          cb(res.data.data.crtf_file)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.downloadCertificate(cb)
            })
          }
        })
    }
    $scope.copiedSuccess = false
    $scope.hideCopiedSuccessfunction = function () {
      $scope.copiedSuccess = false
    }
    $scope.copyUrl = function () {
      navigator.clipboard.writeText($scope.shortedCertiverificationUrl)
      $scope.copiedSuccess = true
      $timeout(function () {
        $scope.hideCopiedSuccessfunction()
      }, 1000)
    }
    $scope.previousNavigate = function () {
      $window.history.back()
    }
    $scope.shareModal = false
    $scope.toggleShareModal = function () {
      $scope.shareModal = !$scope.shareModal
    }
    $scope.initiateAdobeReader = function (cb) {
      // alert("initiation complete AdobeReader");
      console.log({ constantPdf: constants.adobe_pdf_reader_key })
      $scope.adobeDCView = new AdobeDC.View({
        clientId: constants.adobe_pdf_reader_key,
        divId: 'adobe-dc-view',
      })
      if (typeof $scope.adobeDCView == 'object') {
        return cb('success')
      } else {
        $scope.init()
      }
    }
    $scope.downloadToClient = function () {
      window.open(
        course_backend_host +
          constants.download_crtf +
          '?a_id=' +
          $cookies.get('aid') +
          '&crs_id=' +
          $stateParams.cid +
          '&crs_token=' +
          $cookies.get('crs_tkn'),
        '_self'
      )
    }

    $scope.init = function () {
      // $scope.downloadCertificate(function(){

      // })
      console.log('hi')
      // alert("hi");
      if (typeof AdobeDC == 'object') {
        $scope.adobeDCView = new AdobeDC.View({
          clientId: constants.adobe_pdf_reader_key,
          divId: 'adobe-dc-view',
        })
        $scope.downloadCertificate(function (crtf_file) {
          console.log(crtf_file)
          console.log('hi')
          $scope.adobeDCView.previewFile(
            {
              content: { location: { url: crtf_file } },
              metaData: { fileName: '.' },
            },
            {
              embedMode: 'SIZED_CONTAINER',
            }
          )
        })
      }
      $window.addEventListener('adobe_dc_view_sdk.ready', function () {
        console.log('hi')

        console.log(AdobeDC)
        $scope.initiateAdobeReader(function () {
          $scope.downloadCertificate(function (crtf_file) {
            console.log(crtf_file)
            console.log('hi')
            $scope.adobeDCView.previewFile(
              {
                content: { location: { url: crtf_file } },
                metaData: { fileName: '.' },
              },
              {
                embedMode: 'SIZED_CONTAINER',
              }
            )
          })
        })
      })
    }
    $scope.init()
  },
])
var chapterController = angular.module('chapterController', ['apiService'])

chapterController.controller('chapterController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  '$rootScope',
  'superCache',
  '$cookies',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    $rootScope,
    cache,
    $cookies
  ) {
    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid
    $scope.levelId = $stateParams.levelId
    $scope.course_certi
    $scope.topics = []
    $scope.certificateMode = false

    $scope.certiEnabled = false
    $scope.certiAutoPublish = false
    $scope.certiPublished = false
    $scope.certiGenerated = false
    $scope.crtf_eligible = false
    $scope.brand
    $scope.breadCrumbs = store.getBreadCrumbs()
    $scope.my_course_url = constants.my_course_url
    $scope.dashboard_url = constants.dashboard_url
    $scope.payment_url = constants.payment_url
    $scope.levelsArr = null
    $scope.cid = $stateParams.cid
    $scope.pid = $stateParams.pid
    if (cache.get('course')) {
      var course = cache.get('course')
      if (course.course_id == $scope.cid) {
        $scope.course = course
        $rootScope.$broadcast('courseLoaded', $scope.course)
        var text = $scope.course.course_name
      }
    }

    $scope.authenticateCourse = function (cb) {
      api
        .query(
          'POST',
          {},
          constants.course_auth,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            g_id: $stateParams.gid,
            tokn: $cookies.get('at'),
            a_id: $cookies.get('aid'),
            cl: 'W',
            d_id: window.fingerprint.md5hash,
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.levelsArr = res.data.data.course.level_labels
          store.storeCookie('crs_tkn', res.data.data.at)
          cb()
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.init()
            })
          }
        })
    }

    $scope.getCurrentIndex = function (id) {
      for (var i = 0; i < $scope.topics.length; i++) {
        if ($scope.topics[i].id == id) {
          return i
        }
      }
    }

    $scope.doIhaveAParent = function (yes, no) {
      if ($scope.topics[$scope.index].parent != '') {
        yes($scope.topics[$scope.index].parent)
        return
      }
      no()
    }

    $scope.getCourseContent = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.course_content,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
            levelId: $scope.levelId,
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.course = res.data.data
          $scope.course_certi = res.data.data.crtf_enable
          if (
            res.data.data.emistatus.trxn_typ_emi &&
            res.data.data.emistatus.emi_paid <
              res.data.data.emistatus.emi_needed_to_pay
          ) {
            $scope.trxn_typ_emi = res.data.data.emistatus.trxn_typ_emi
            $scope.hide_course_content =
              res.data.data.emistatus.hide_course_content
            $scope.no_of_visible_chapters =
              res.data.data.emistatus.no_of_visible_chapters
          } else {
            $scope.trxn_typ_emi = false
            $scope.hide_course_content =
              res.data.data.emistatus.hide_course_content
            $scope.no_of_visible_chapters = res.data.data.emistatus
              .no_of_visible_chapters
              ? res.data.data.emistatus.no_of_visible_chapters
              : res.data.data.chapters.length
          }
          console.log({ chapter: $scope.chapter })
          var ourChap = res.data.data.chapters.filter(function (el) {
            return el._id == $scope.chapter
          })[0]
          var chapIndex = -1
          for (var i = 0; i < $scope.breadCrumbs.length; i++) {
            if ($scope.breadCrumbs[i]._id == ourChap._id) chapIndex = i
          }
          console.log('breadCrumbsBefore::', $scope.breadCrumbs)
          if (chapIndex == -1) {
            console.log('Settingchapter entry')
            var breadcrumbsTemp = $scope.breadCrumbs
            breadcrumbsTemp.push({
              _id: ourChap._id,
              name: ourChap.nm,
              chap: true,
            })
            $scope.breadCrumbs = breadcrumbsTemp
            console.log($scope.breadCrumbs)
          }
          console.log({ chapter: ourChap })
          console.log($scope.topic)
          if ($scope.chapter && $scope.topic) {
            $scope.compileTopicsArray()
            $scope.processTopics()
            $rootScope.$broadcast('courseLoaded', $scope.course)
          }
          cb()
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.getCerti = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.aply_crtf,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res, ':response data')
          $scope.certiLink = res.data.data.crtf_file
          console.log('certiLink::', $scope.certiLink)
          // cb();
        })
        .catch(function (err) {
          console.log(err)
          $scope.loading = false
        })
    }

    $scope.getCertificateStatus = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.certificate_status,
          {},
          {
            crs_id: $stateParams.cid,
            a_id: $cookies.get('aid'),
            p_id: $stateParams.pid,
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.certiEnabled = res.data.data.certiEnabled
          $scope.certiAutoPublish = res.data.data.auto_publish
          $scope.certiPublished = res.data.data.published
          $scope.certiGenerated = res.data.data.generated

          // $scope.course = res.data.data.course;
          console.log({
            certiEnabled: $scope.certiEnabled,
            certiAutoPublish: $scope.certiAutoPublish,
            certiPublished: $scope.certiPublished,
            certiGenerated: $scope.certiGenerated,
            crtf_eligible: $scope.crtf_eligible,
            course: $scope.course,
          })
          cb()
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.getCourseStatus = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.course_status,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.status = res.data.data
          $scope.crtf_eligible = res.data.data.crtf_eligible
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.downloadCertificate = function () {
      $scope.state = store.getstate()
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.apply_certificate,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          //	$scope.state =	store.changestate()
          $scope.crtf_file = res.data.data.crtf_file
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.downloadCertificate()
            })
          }
        })
    }

    $scope.updateChapterStatusAndToggle = function (chapter, chapter_no) {
      if (
        $scope.hide_course_content &&
        chapter_no > $scope.no_of_visible_chapters
      ) {
        console.log('hidden')
      } else {
        chapter.isCollapsed = !chapter.isCollapsed
        api
          .query(
            'POST',
            {
              'x-access-crs-token': $cookies.get('crs_tkn'),
            },
            constants.chapter_status,
            {},
            {
              crs_id: $stateParams.cid,
              cp_id: chapter._id,
              p_id: $stateParams.pid,
              a_id: $cookies.get('aid'),
            }
          )
          .then(function (res) {})
          .catch(function (err) {
            console.log(err)
            if (err.status && err.status == 498 && err.data.code == 4100) {
              api.getAccessToken().then(function (res) {
                $scope.updateChapterStatus(chapter._id)
              })
            }
          })
      }
    }

    $scope.processTopics = function () {
      if (!$scope.course) {
        return
      }
      for (var i = 0; i < $scope.course.chapters.length; i++) {
        if ($scope.course.chapters[i]._id == $scope.chapter) {
          $scope.course.chapters[i].isCollapsed = true
        }
        if (
          $scope.trxn_typ_emi && $scope.course.all_chapters
            ? $scope.course.all_chapters[i]._id == $scope.chapter
            : false
        ) {
          $scope.course.all_chapters[i].isCollapsed = true
        }
      }
      $scope.index = $scope.getCurrentIndex($scope.topic)
    }

    $scope.compileTopicsArray = function () {
      for (var i = 0; i < $scope.course.chapters.length; i++) {
        var chapter = $scope.course.chapters[i]
        for (var j = 0; j < chapter.lec.length; j++) {
          var lecture = chapter.lec[j]
          $scope.topics.push({
            id: lecture,
            type: 'lecture',
            chapter: chapter._id,
            parent: '',
          })
          for (
            var k = 0;
            k < $scope.course.lectures[lecture].quiz.length;
            k++
          ) {
            $scope.topics.push({
              id: $scope.course.lectures[lecture].quiz[k],
              chapter: chapter._id,
              type: 'quiz',
              parent: lecture,
            })
          }
          for (
            var l = 0;
            l < $scope.course.lectures[lecture].asgn.length;
            k++
          ) {
            $scope.topics.push({
              id: $scope.course.lectures[lecture].asgn[l],
              chapter: chapter._id,
              type: 'assignment',
              parent: lecture,
            })
          }
        }

        for (var s in chapter.scorm) {
          var scormId = chapter.scorm[s]
          $scope.topics.push({
            id: scormId,
            type: 'scorm',
            chapter: chapter._id,
            parent: '',
          })
        }
        for (var k = 0; k < chapter.quiz.length; k++) {
          $scope.topics.push({
            id: chapter.quiz[k],
            type: 'quiz',
            chapter: chapter._id,
            parent: '',
          })
        }
        for (var l = 0; l < chapter.asgn.length; l++) {
          $scope.topics.push({
            id: chapter.asgn[l],
            type: 'assignment',
            chapter: chapter._id,
            parent: '',
          })
        }
        for (var l = 0; l < chapter.doc_lec.length; l++) {
          $scope.topics.push({
            id: chapter.doc_lec[l],
            type: 'doclecture',
            chapter: chapter._id,
            parent: '',
          })
        }
        for (var l = 0; l < chapter.liv_lec.length; l++) {
          if (
            $scope.course.liv_lec_id_map[chapter.liv_lec[l]] &&
            $scope.course.liv_lec_id_map[chapter.liv_lec[l]].recurl != null &&
            $scope.course.liv_lec_id_map[chapter.liv_lec[l]].recurl != ''
          ) {
            $scope.topics.push({
              id: chapter.liv_lec[l],
              type: 'livelecture',
              chapter: chapter._id,
              parent: '',
            })
          }
        }
      }
    }

    $scope.markTopicActive = function (chapter_id, lecture_id) {
      $scope.chapter = chapter_id
      $scope.topic = lecture_id
      $scope.processTopics()
    }

    $scope.getactive = function () {
      return store.getactive()
    }

    $rootScope.$on('playnext', function () {
      $scope.next()
    })

    $scope.next = function () {
      if (!$scope.topics || !$scope.topics[$scope.index + 1]) {
        return
      }

      var nextTopic = $scope.topics[$scope.index + 1]

      if (nextTopic.type == 'lecture') {
        $state.go('chapter.lecture', {
          chid: nextTopic.chapter,
          topic: nextTopic.id,
        })
      } else if (nextTopic.type == 'livelecture') {
        $state.go('chapter.lecture', {
          chid: nextTopic.chapter,
          topic: nextTopic.id,
        })
      } else if (nextTopic.type == 'assignment') {
        $state.go('chapter.assignment', {
          chid: nextTopic.chapter,
          topic: nextTopic.id,
        })
      } else if (nextTopic.type == 'quiz') {
        $state.go('chapter.quiz', {
          chid: nextTopic.chapter,
          topic: nextTopic.id,
        })
      } else if (nextTopic.type == 'scorm') {
        $state.go('chapter.scorm', {
          chid: nextTopic.chapter,
          topic: nextTopic.id,
        })
      } else {
        console.log('invalid id')
      }
    }

    $scope.previous = function () {
      if (!$scope.topics || !$scope.topics[$scope.index - 1]) {
        return
      }

      var prevTopic = $scope.topics[$scope.index - 1]

      if (prevTopic.type == 'lecture') {
        $state.go('chapter.lecture', {
          chid: prevTopic.chapter,
          topic: prevTopic.id,
        })
      } else if (prevTopic.type == 'livelecture') {
        $state.go('chapter.lecture', {
          chid: prevTopic.chapter,
          topic: prevTopic.id,
        })
      } else if (prevTopic.type == 'assignment') {
        console.log('assignment')
        $state.go('chapter.assignment', {
          chid: prevTopic.chapter,
          topic: prevTopic.id,
        })
      } else if (prevTopic.type == 'quiz') {
        $state.go('chapter.quiz', {
          chid: prevTopic.chapter,
          topic: prevTopic.id,
        })
      } else if (prevTopic.type == 'scorm') {
        $state.go('chapter.scorm', {
          chid: prevTopic.chapter,
          topic: prevTopic.id,
        })
      } else {
        console.log('invalid id')
      }
    }

    $scope.checkState = function () {
      if ($state.current.name.includes('chapter.certificate')) {
        $scope.certificateMode = true
      }
    }

    $scope.$on('$stateChangeSuccess', function (e, to, toParams) {
      if (to.name.includes('chapter.certificate')) {
        $scope.certificateMode = true
      } else {
        $scope.certificateMode = false
      }
    })

    $scope.getLevelContent = function (cb) {
      var params = {
        cid: $stateParams.cid,
        pid: $stateParams.pid,
        aid: $cookies.get('aid'),
      }
      if ($stateParams.levelId) {
        params['levelId'] = $stateParams.levelId
      }
      api
        .query(
          'GET',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.gt_level_content,
          params,
          {}
        )
        .then(function (res) {
          console.log(res)
          var breadCrumbs = res.data.data.breadCrumbs
          breadCrumbs.unshift({
            name: 'All Courses',
            link: $scope.dashboard_url,
          })
          console.log('breadCrumbs::', breadCrumbs)
          store.setBreadCrumbs(breadCrumbs)
          $scope.breadCrumbs = store.getBreadCrumbs()
          $scope.brand = res.data.data.brand
          console.log({ brand: $scope.brand })
          cb()
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.back = function () {
      history.back()
    }
    $scope.redirectTo = function () {
      console.log({ levelsArr: $scope.levelsArr })
      if ($scope.levelsArr && $scope.levelsArr.length == 1) {
        var url =
          '#/course/' +
          $scope.pid +
          '/' +
          $scope.gid +
          '/' +
          $scope.cid +
          '/' +
          $scope.levelId
        console.log('Only Chapters')
        window.location.replace(url)
        return
      } else {
        window.location.replace(
          $scope.my_course_url + '?cid=' + $stateParams.cid
        )
      }
    }
    $scope.init = function () {
      console.log({ levelId: $scope.levelId })
      $scope.submitcodingassignmentcounter = false
      console.log($scope.submitcodingassignmentcounter)
      $scope.authenticateCourse(function () {})
      $scope.getLevelContent(function () {})
      $scope.getCourseContent(function () {
        $scope.getCourseStatus()
        $scope.getCerti()
        $scope.getCertificateStatus(function () {
          //console.log($scope.showLoader)
        })
        $scope.downloadCertificate()
      })
      if ($state.current.name.includes('chapter.certificate')) {
        $scope.certificateMode = true
      }
    }

    $scope.init()
  },
])
var monthsArr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

var courseController = angular.module('courseController', [
  'apiService',
  'ui.bootstrap',
])
function locationOptionValue(location) {
  if (location == undefined) {
    return ''
  }
  console.log({ location: location.toLocaleLowerCase() })

  //returns option values from freshdesk
  switch (location.toLocaleLowerCase()) {
    case 'ahmedabad':
      return 33000209535
    case 'bangalore':
      return 33000064348
    case 'chennai':
      return 33000064355
    case 'coimbatore':
      return 33000064351
    case 'fsb':
      return 33000213003
    case 'isa':
      return 33000213004
    case 'jaipur':
      return 33000213005
    case 'lucknow':
      return 33000213006
    case 'mumbai':
      return 33000064310
    case 'ncr':
      return 33000208740
    case 'online':
      return 33000064309
    case 'pune':
      return 33000064311
    case 'thane':
      return 33000207449
    case 'hyderabad':
      return 33000064349
    default:
      return 0
  }
}
courseController.controller('courseController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  'superCache',
  '$cookies',
  '$window',
  '$http',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    cache,
    $cookies,
    $window,
    $http
  ) {
    $scope.safeApply = function (fn) {
      var phase = this.$root.$$phase
      if (phase == '$apply' || phase == '$digest') {
        if (fn && typeof fn === 'function') {
          fn()
        }
      } else {
        this.$apply(fn)
      }
    }

    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid
    $scope.levelId = $stateParams.levelId
    $scope.course_certi
    $scope.plcmnt_enable = false
    $scope.submitcodingassignmentcounter = false
    $scope.showDetailEmiTrack = false
    $scope.show_modules = false
    $scope.live_lectures = {}
    $scope.crs_thumb_url = 'https://cdn.eckovation.com/images/Mechanical.png'
    $scope.primary_url = constants.primary_url
    $scope.dashboard_url = constants.dashboard_url
    $scope.my_course_url = constants.my_course_url
    $scope.discussion_url = constants.discussion_url
    $scope.payment_url = constants.payment_url
    $scope.ongoing_class = []
    $scope.soon_to_be_live = []
    $scope.hide_gradebook = true
    $scope.pre_wait_time = 0
    $scope.end_buffer_time = 0
    $scope.certiEnabled = false
    $scope.certiAutoPublish = false
    $scope.certiPublished = false
    $scope.certiGenerated = false
    $scope.crtf_eligible = false
    $scope.to_be_live = false
    $scope.breadCrumbs = store.getBreadCrumbs()
    $scope.levelsArr = null
    $scope.feedbacks = []
    $scope.feedbackOpen = false
    $scope.u_idntFeedback = ''
    $scope.srv_id = ''
    $scope.quizUserId = ''
    $scope.testAid = null
    $scope.quizToken = null
    $scope.user_test_id = null
    $scope.feedbackSections = {}
    $scope.fullFeedbackAttempted = false
    $scope.feedbackQuizSubmissions = {}
    $scope.lastFeedbackIndex = null
    $scope.currentFeedbackQuiz = null
    $scope.showAttempted = false
    $scope.showFeedbackLocked = false
    $scope.batchObj = {}

    $scope.gjsci_crs_id = '5e006e3eb7e9b0b878fdae04'
    if ($stateParams.cid == $scope.gjsci_crs_id) {
      $scope.show_modules = true
    }

    if (cache.get('course')) {
      var course = cache.get('course')
      if (course.course_id == $scope.cid) {
        $scope.course = cache.get('course')
        $scope.status = cache.get('course_status')
      }
    }

    $scope.authenticateCourse = function (cb) {
      api
        .query(
          'POST',
          {},
          constants.course_auth,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            g_id: $stateParams.gid,
            tokn: $cookies.get('at'),
            a_id: $cookies.get('aid'),
            cl: 'W',
            d_id: window.fingerprint.md5hash,
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.batchObj = res.data.data.course
          $scope.levelsArr = res.data.data.course.level_labels
          store.storeCookie('crs_tkn', res.data.data.at)
          $scope.hide_gradebook = res.data.data.hide_gradebook
          if ($scope.batchObj.nextInstallmentTime) {
            $scope.pendingInstallment = {
              _id: $scope.batchObj._id,
              nextInstallmentTime: $scope.batchObj.nextInstallmentTime,
              installmentPlan: $scope.batchObj.installmentPlan,
              installmentIndex: $scope.batchObj.installmentIndex,
              name: $scope.batchObj.name,
              currSymbol: $scope.batchObj.currSymbol,
              crs_pg_id: $scope.batchObj.crs_pg_id,
              endDate: $scope.batchObj.endDate,
            }
            console.log(
              '$scope.pendingInstallment::',
              $scope.pendingInstallment
            )
          }
          console.log({ hide_gradebook: $scope.hide_gradebook })
          cb()
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.init()
            })
          }
        })
    }
    $scope.pluralise = function (n) {
      return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th'
    }
    $scope.convertPriceToLocalString = function (amount) {
      // console.log({amount:amount})
      return parseFloat(String(amount)).toLocaleString()
    }
    $scope.redirectToInstallmentPayment = function () {
      console.log('redirectToInstallmentPayment')
      var payInstallmentsUrl =
        constants.PAYMENT_INSTALLMENT_URL + $scope.pendingInstallment.crs_pg_id
      console.log({ payInstallmentsUrl: payInstallmentsUrl })
      window.open(payInstallmentsUrl)
    }

    // $scope.fetchEmiStatus = function(cb){
    // 	api.query('POST',{
    // 		'x-access-crs-token' : $cookies.get('crs_tkn')
    // 	},constants.get_emi_status,{},{
    // 		crs_id : $stateParams.cid,
    // 		p_id : $stateParams.pid,
    // 		a_id : $cookies.get('aid')
    // 	}).then(function(res){
    // 		console.log(res);
    // 		// $scope.trxn_typ_emi 		  = res.data.data.trxn_typ_emi;
    // 		// $scope.hide_course_content    = res.data.data.hide_course_content;
    // 		// $scope.no_of_visible_chapters = res.data.data.no_of_visible_chapters;
    // 		// // $scope.course_certi = res.data.data.crtf_enable
    // 		// cache.put('course',$scope.course);
    // 		cb();
    // 	}).catch(function(err){
    // 		console.log(err);
    // 	})
    // }

    $scope.showEmiTracking = function () {
      $scope.showDetailEmiTrack = !$scope.showDetailEmiTrack
    }
    $scope.hideFreshDesk = function () {
      FreshworksWidget('hide')
    }
    $scope.getLevelContent = function (cb) {
      var params = {
        cid: $stateParams.cid,
        pid: $stateParams.pid,
        aid: $cookies.get('aid'),
      }
      if ($scope.levelId != 'undefined') {
        params['levelId'] = $stateParams.levelId
      }
      api
        .query(
          'GET',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.gt_level_content,
          params,
          {}
        )
        .then(function (res) {
          console.log(res)
          var breadCrumbs = res.data.data.breadCrumbs
          console.log('$scope.dashboard_url', $scope.dashboard_url)
          breadCrumbs.unshift({
            name: 'All Courses',
            link: $scope.dashboard_url,
          })
          console.log('breadCrumbs::', breadCrumbs)
          store.setBreadCrumbs(breadCrumbs)
          $scope.breadCrumbs = store.getBreadCrumbs()
          $scope.brand = res.data.data.brand
          console.log($scope.brand)
          $scope.isLoadingImg = false
          cb()
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.getCourseContent = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.course_content,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
            levelId: $stateParams.levelId,
          }
        )
        .then(function (res) {
          console.log(
            res,
            ':LLllllllllllllllLLLLLLLLLLLLLLLllllllllllllllLLLLLLLLLLLLLLLLllllllllllllllLLLLLLLLLLLLLlll'
          )
          console.log('COURSE', res.data.data)
          ;($scope.course = res.data.data),
            ($scope.batchName = res.data.data.batch_name),
            ($scope.profileName = res.data.data.profilename),
            ($scope.profilePic =
              res.data.data.profilepic ||
              'https://cdn.eckovation.com/images/Profile-01.svg'),
            ($scope.primaryEmail = res.data.data.email),
            ($scope.courseLocation = res.data.data.location),
            ($scope.course_certi = res.data.data.crtf_enable)
          $scope.plcmnt_enable = res.data.data.plcmnt_enable
          $scope.impartusEnabled = res.data.data.impartus_enabled
          $scope.pre_wait_time = res.data.data.pre_wait_live_class_time
          if ('end_live_buffer_class_time' in res.data.data) {
            $scope.end_buffer_time = res.data.data.end_live_buffer_class_time
          }
          if (
            res.data.data.emistatus.trxn_typ_emi &&
            res.data.data.emistatus.emi_paid <
              res.data.data.emistatus.emi_needed_to_pay
          ) {
            $scope.trxn_typ_emi = res.data.data.emistatus.trxn_typ_emi
            $scope.hide_course_content =
              res.data.data.emistatus.hide_course_content
            if ('no_of_visible_chapters' in res.data.data) {
              $scope.no_of_visible_chapters =
                res.data.data.emistatus.no_of_visible_chapters
            }
          } else {
            $scope.trxn_typ_emi = false
            $scope.hide_course_content =
              res.data.data.emistatus.hide_course_content
            $scope.no_of_visible_chapters = res.data.data.emistatus
              .no_of_visible_chapters
              ? res.data.data.emistatus.no_of_visible_chapters
              : res.data.data.chapters.length
          }
          if (
            res.data.data &&
            Object.prototype.toString.call(res.data.data.livlec) ===
              '[object Object]'
          ) {
            $scope.live_lectures = JSON.parse(
              JSON.stringify(res.data.data.livlec)
            )
          }
          if (
            res.data.data &&
            typeof res.data.data.crs_thumb_url === 'string' &&
            res.data.data.crs_thumb_url.length
          ) {
            $scope.crs_thumb_url = res.data.data.crs_thumb_url
          }

          for (key in $scope.course.liv_lec_id_map) {
            var arOb = $scope.course.liv_lec_id_map[key]
            console.log(arOb, 'arOIbj')
            var d = new Date(arOb.stm)
            var ee = arOb.etm ? new Date(arOb.etm) : null
            if (ee) {
              var current_time = new Date().getTime()
              var start_time = d.getTime()
              var end_time = ee.getTime()
              console.log(
                parseInt(start_time - current_time),
                'time_difference'
              )
              console.log(
                'current_time:',
                current_time,
                'start_time:',
                start_time,
                'end_time:',
                end_time,
                'end_buffer_time:',
                $scope.end_buffer_time
              )
              if (
                current_time < start_time &&
                parseInt(start_time - current_time) < $scope.pre_wait_time &&
                parseInt(start_time - current_time) > 0
              ) {
                arOb.live_status = 1
                arOb.to_be_live = true
                $scope.to_be_live = true
              } else if (
                current_time > start_time - $scope.pre_wait_time &&
                current_time < end_time + $scope.end_buffer_time
              ) {
                arOb.live_status = 2
              } else if (
                current_time > start_time &&
                current_time > end_time + $scope.end_buffer_time
              ) {
                arOb.live_status = 3
              } else if (
                current_time < start_time &&
                current_time < end_time + $scope.end_buffer_time
              ) {
                arOb.live_status = 1
                $scope.to_be_live = false
                arOb.to_be_live = false
              }
              console.log({ status: arOb.live_status })
              var ed = ee.getDate()
              var em = monthsArr[ee.getMonth()]
              var ey = ee.getFullYear()
              arOb.lcedt = ed + ' ' + em + ' ' + ey

              var amPm = 'AM'
              var ehh = ee.getHours()
              var emin = ee.getMinutes()
              if (ehh >= 12) {
                ehh = ehh > 12 ? ehh - 12 : ehh
                amPm = 'PM'
              }
              if (ehh < 10) {
                ehh = '0' + String(ehh)
              }
              if (emin < 10) {
                emin = '0' + String(emin)
              }

              arOb.lcetm = ehh + ':' + emin + ' ' + amPm
            } else {
              var tim = new Date()
              var tdiff = tim.getTime() - d.getTime()
              /**
               * live_status
               * 1 -> in future or upcoming
               * 2 -> going on
               * 3 -> was live
               */
              arOb.live_status = 1
              arOb.tdiff = tdiff
              if (tdiff > 0 && tdiff <= 7200000) {
                arOb.live_status = 2
              } else if (tdiff > 7200000) {
                arOb.live_status = 3
              }
            }

            var dd = d.getDate()
            var mm = monthsArr[d.getMonth()]
            var yy = d.getFullYear()
            arOb.lcdt = dd + ' ' + mm + ' ' + yy

            var amPm = 'AM'
            var hh = d.getHours()
            var min = d.getMinutes()
            if (hh >= 12) {
              hh = hh > 12 ? hh - 12 : hh
              amPm = 'PM'
            }
            if (hh < 10) {
              hh = '0' + String(hh)
            }
            if (min < 10) {
              min = '0' + String(min)
            }

            arOb.lctm = hh + ':' + min + ' ' + amPm
            console.log(
              key,
              ':+========++++++++++++++==============||||||||',
              d
            )
            // ar[i] = arOb;

            if (arOb.live_status == 2) {
              $scope.ongoing_class.push(arOb)
            }
            if (arOb.live_status == 1 && $scope.to_be_live) {
              $scope.soon_to_be_live.push(arOb)
            }
            $scope.course.liv_lec_id_map[key] = JSON.parse(JSON.stringify(arOb))
          }
          // console.log($scope.soon_to_be_live,":$scope.soon_to_be_live/??????????????////////////////?????????????////////////////?????????????//");
          // console.log($scope.live_lectures,":/??????????????////////////////?????????????////////////////?????????????//");
          // console.log($scope.ongoing_class,":/??????????????////////////////?????????????////////////////?????????????//");

          if (res.data.data.emistatus.emi_needed_to_pay > 0) {
            $scope.total_emi_arr = []
            for (
              var i = 0;
              i < res.data.data.emistatus.emi_needed_to_pay;
              i++
            ) {
              $scope.total_emi_arr.push(i)
            }
            var screen_width = 88
            if (screen.width < 576) {
              screen_width = 88
            }
            console.log(screen.width)
            var width_val = Math.floor(
              screen_width / $scope.total_emi_arr.length
            ).toString()
            console.log(width_val)
            $scope.emi_tiles_width = {
              width: width_val + '%',
            }
            $scope.no_of_visible_chapters =
              res.data.data.emistatus.no_of_visible_chapters
          }

          if (res.data.data.chapters) {
            var feedbacks = []
            res.data.data.chapters.map(function (chap) {
              if (chap.feedback && chap.feedbackObj) {
                var obj = chap.feedbackObj
                obj.chap = chap
                feedbacks.push(obj)
              }
            })
            console.log({ feedbacks: feedbacks })
            store.setFeedbacks(feedbacks)
            $scope.feedbacks = store.getFeedbacks()
            console.log({ feedbacksSet: $scope.feedbacks })
          }
          cache.put('course', $scope.course)
          $scope.safeApply()
          cb()
        })
        .catch(function (err) {
          console.log(err)
        })
    }
    $scope.nextFeedback = function () {
      console.log({ lastFeedbackIndex: $scope.lastFeedbackIndex })
      var lastIndex =
        $scope.lastFeedbackIndex == null ? 0 : $scope.lastFeedbackIndex
      for (var i = $scope.lastFeedbackIndex; i < $scope.feedbacks.length; i++) {
        var quiz = $scope.feedbacks[i]
        var flag = false
        if ($scope.batchObj.gradebook_auto_publish) {
          flag = true
        } else if (quiz.chap.feedback_publish) {
          flag = true
        }
        if (!quiz['completion'] && flag) {
          var chapPerc = $scope.status.cperc[quiz.chap._id]
          if (chapPerc != 100) {
            continue
          }
          $scope.fullFeedbackAttempted = false
          $scope.lastFeedbackIndex = i
          console.log({ newFeedbackIndex: $scope.lastFeedbackIndex })
          $scope.currentFeedbackQuiz = quiz
          console.log({ currentFeedbackQuiz: $scope.currentFeedbackQuiz })
          $scope.get_plugin_identifier(
            $scope.currentFeedbackQuiz,
            $stateParams.gid
          )
          console.log({
            lastIndex: lastIndex,
            lastFeedbackIndex: $scope.lastFeedbackIndex,
          })
          break
        }
      }
      if (lastIndex == $scope.lastFeedbackIndex) {
        $scope.feedbackOpen = false
        return
      }
    }
    $scope.get_plugin_identifier = function (quiz, gid) {
      console.log({ '$scope.batchObj': $scope.batchObj })
      $scope.isLoading = true
      api
        .query(
          'POST',
          {},
          constants.get_plugin_identifier,
          {},
          {
            p_id: $cookies.get('pid'),
            g_id: gid ? gid : quiz.gid,
            pl_id: $scope.batchObj.plugin_id,
            tokn: $cookies.get('at'),
            type: 1,
          }
        )
        .then(function (res) {
          // console.log({get_plugin_identifierres: res})
          if (res.data && res.data.success && res.data.data) {
            $scope.u_idntFeedback = res.data.data.u_idnt
            console.log({ u_idntFeedback: $scope.u_idntFeedback })
            $scope.registerUserQuiz(quiz)
          } else {
            console.log("user doesn't have access for this quiz")
          }
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.init()
            })
          }
        })
    }
    $scope.registerUserQuiz = function (quiz) {
      console.log({ quiz: quiz })
      var url = constants.quiz_backend_url + constants.register_user_quiz
      console.log({ url: url })

      // var deferred = $q.defer();
      $http({
        method: 'POST',
        headers: {},
        url: url,
        params: {},
        data: {
          // for_vrf: false,
          // g_id:quiz.gcod,
          // pl_id  : quiz.plid,
          // // test_id: quiz._id,
          // user_id: $cookies.get('aid'),
          // tokn   : $scope.u_idntFeedback
          user_idnt: $scope.u_idntFeedback,
          testId: quiz.tid,
        },
      }).then(
        function (data) {
          if (!data.config) {
            console.log('Server error occured.')
          }
          console.log({ registerUserQuizdata: data })
          if (data.data.data.srv_id && data.data.data.id) {
            $scope.srv_id = data.data.data.srv_id
            $scope.quizUserId = data.data.data.id
            console.log({ srv_id: $scope.srv_id })
            $scope.feedbackGCode = data.data.data.gid
            $scope.initializeQuiz(quiz)
          }

          // deferred.resolve(data);
        },
        function (error) {
          // deferred.reject(error);
          console.log(error)
          console.log("user doesn't have access for this quiz")
        }
      )
    }
    $scope.initializeQuiz = function (quiz) {
      console.log({ quiz: quiz })
      var url = constants.quiz_backend_url + constants.init_quiz
      console.log({ url: url })

      $http({
        method: 'POST',
        headers: {},
        url: url,
        params: {},
        data: {
          g_id: $scope.feedbackGCode,
          pl_id: $scope.batchObj.plugin_id,
          user_id: $scope.quizUserId,
          user_idnt: $scope.u_idntFeedback,
          srv_id: $scope.srv_id,
          testId: quiz.tid,
        },
      }).then(
        function (data) {
          if (!data.config) {
            console.log('Server error occured.')
          }
          console.log({ initializeQuizdata: data })
          if (data.data.success && data.data.data.at)
            $scope.u_idntFeedback2 = data.data.data.at
          $scope.getUserQuizToken(quiz)
        },
        function (error) {
          console.log(error)
          console.log("user doesn't have access for this quiz")
        }
      )
    }
    $scope.getUserQuizToken = function (quiz) {
      console.log({ quiz: quiz })
      var url = constants.quiz_backend_url + constants.get_user_quiz_token
      console.log({ url: url })

      $http({
        method: 'POST',
        headers: {},
        url: url,
        params: {},
        data: {
          g_id: $scope.feedbackGCode,
          pl_id: $scope.batchObj.plugin_id,
          user_id: $scope.quizUserId,
          tokn: $scope.u_idntFeedback2,
          testId: quiz.tid,
        },
      }).then(
        function (data) {
          if (!data.config) {
            console.log('Server error occured.')
          }
          console.log({ getUserQuizTokendata: data })
          if (data.data.data.stats && data.data.data.stats.user_id) {
            $scope.testAid = data.data.data.stats.user_id
            $scope.getTestToken(quiz)
          }
        },
        function (error) {
          console.log(error)
          console.log("user doesn't have access for this quiz")
        }
      )
    }

    $scope.getTestToken = function (quiz) {
      console.log({ quiz: quiz })
      var url = constants.quiz_backend_url + constants.get_quiz_test_token
      console.log({ url: url })

      $http({
        method: 'POST',
        headers: {},
        url: url,
        params: {},
        data: {
          g_id: $scope.feedbackGCode,
          pl_id: $scope.batchObj.plugin_id,
          user_id: $scope.testAid,
          tokn: $scope.u_idntFeedback2,
          test_id: quiz.tid,
        },
      }).then(
        function (data) {
          if (!data.config) {
            console.log('Server error occured.')
          }
          console.log({ getTestToken: data })
          if (data.data.data.test_at) {
            $scope.quizToken = data.data.data.test_at
            console.log({ quizToken: $scope.quizToken })
          }
          if (data.data.data.id) {
            $scope.user_test_id = data.data.data.id
          }
          $scope.getTestQuestions(quiz)
        },
        function (error) {
          console.log(error)
          console.log("user doesn't have access for this quiz")
        }
      )
    }
    $scope.getTestQuestions = function (quiz) {
      console.log({ quiz: quiz })
      var url = constants.quiz_backend_url + constants.get_test_questions
      console.log({ url: url })

      $http({
        method: 'POST',
        headers: {},
        url: url,
        params: {},
        data: {
          g_id: $scope.feedbackGCode,
          ipp: '200',
          start: 0,
          pl_id: $scope.batchObj.plugin_id,
          t_tokn: $scope.quizToken,
          test_id: quiz.tid,
          tokn: $scope.u_idntFeedback2,
          user_id: $scope.testAid,
          user_test_id: $scope.user_test_id,
        },
      }).then(
        function (data) {
          if (!data.config) {
            console.log('Server error occured.')
          }
          console.log({ getTestQuestions: data })
          if (data.data.data.sectionsFound) {
            $scope.feedbackSections = data.data.data.sectionsFound
            console.log({ feedbackSections: $scope.feedbackSections })
            angular.element('#feedbacksContainer')[0].scrollTop = 0
            console.log({
              scroll: angular.element('#feedbacksContainer')[0].scrollTop,
            })
            $scope.isLoading = false
          }
        },
        function (error) {
          console.log(error)
          console.log("user doesn't have access for this quiz")
        }
      )
    }
    $scope.getModuleName = function () {
      var currentFeedback = $scope.currentFeedbackQuiz
      if (!currentFeedback) return null
      var moduleName = currentFeedback.chap.nm
      // console.log({moduleName: moduleName})
      return moduleName
    }
    $scope.selectOption = function (section, ques, ans) {
      ques.question.answer = ans
      // console.log({ section: section, ques: ques, ans: ans })
      console.log({ feedbackSections: $scope.feedbackSections })
    }
    $scope.checkAllFilled = function () {
      console.log('trying to check:::')
      console.log({ feedbackSections: $scope.feedbackSections })
      var questions = []
      var filled = true
      for (var i = 0; i < $scope.feedbackSections.length; i++) {
        var section = $scope.feedbackSections[i]
        // console.log({section:section})
        for (var j = 0; j < section.ques.length; j++) {
          var ques = section.ques[j]
          console.log({ ques: ques })
          if (
            !ques ||
            !ques.question ||
            (!('answer' in ques.question) && ques.question.compulsory) ||
            ((ques.question.answer == null || ques.question.answer == '') &&
              ques.question.compulsory)
          ) {
            filled = false
          }
        }
      }
      // console.log({ filled: filled })
      $scope.fullFeedbackAttempted = filled
      console.log({ fullFeedbackAttempted: $scope.fullFeedbackAttempted })
    }
    $scope.submitFeedback = function () {
      console.log('trying to submitFeedback:::')
      $scope.isLoading = true

      var answers = []

      for (var i = 0; i < $scope.feedbackSections.length; i++) {
        var section = $scope.feedbackSections[i]
        console.log({ section: section })
        for (var j = 0; j < section.ques.length; j++) {
          var ques = section.ques[j]
          console.log({ ques: ques })
          var ans = { q: ques.question._id, t: 1 }
          if (ques.question.answer) {
            if (ques.question.type == 1) {
              ans['a'] = ques.question.answer.index
            } else {
              ans['a'] = ques.question.answer
            }
          }
          if (ans) {
            answers.push(ans)
          }
          console.log({ ans: ans })
        }
      }
      console.log({ answers: answers })

      console.log({ feedbackSections: $scope.feedbackSections })
      console.log({ feedbacks: $scope.feedbacks })
      var testId = $scope.feedbackSections[0].testId

      var feedbackQuiz = $scope.feedbacks[$scope.lastFeedbackIndex]
      console.log({ feedbackQuiz: feedbackQuiz })

      var url = constants.quiz_backend_url + constants.submit_feedback
      console.log({ url: url })

      $http({
        method: 'POST',
        headers: {},
        url: url,
        params: {},
        data: {
          answers: answers,
          g_id: $scope.feedbackGCode,
          pl_id: $scope.batchObj.plugin_id,
          t_tokn: $scope.quizToken,
          test_id: feedbackQuiz.tid,
          tokn: $scope.u_idntFeedback2,
          user_id: $scope.testAid,
          user_test_id: $scope.user_test_id,
        },
      }).then(
        function (data) {
          $scope.isLoading = false
          if (!data.config) {
            console.log('Server error occured.')
          }
          console.log({ submitFeedback: data })
          if (data.data.success) {
            console.log('Submitted successFully')
            $scope.feedbackQuizSubmissions[
              $scope.currentFeedbackQuiz._id
            ] = true
            console.log({
              feedbackQuizSubmissions: $scope.feedbackQuizSubmissions,
            })
            feedbackQuiz['completion'] = true
            $scope.completeFeedback(feedbackQuiz, testId)
          }
        },
        function (error) {
          $scope.isLoading = false
          console.log(error)
          console.log("user doesn't have access for this quiz")
        }
      )
    }

    $scope.completeFeedback = function (quiz, testId) {
      console.log('updating user feedback completion status')
      var chapter = quiz.chap
      console.log({ chapter: chapter })
      var url = constants.submit_feedback_status
      console.log({ url: url })
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          url,
          {},
          {
            aid: $cookies.get('aid'),
            pid: $cookies.get('pid'),
            feedbackId: quiz._id,
            cid: $stateParams.cid,
            chpId: chapter._id,
            user_id: $scope.testAid,
            user_test_id: $scope.user_test_id,
          }
        )
        .then(function (res) {
          console.log({ completeFeedback: res })
        })
        .catch(function (err) {
          console.log(err)
          alert('Something went wrong')
        })
    }
    $scope.getCourseStatus = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.course_status,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.status = res.data.data
          console.log($scope.status, ':::::::::::::::::::::::::::1')
          console.log($scope.course, '+++++++++++++++++++++++++++2')
          var course = $scope.course
          $scope.resumeChapName = null
          $scope.resumeChapProg = 0
          $scope.resumeChapIdx = 0
          $scope.resumeChapId = null
          $scope.isResume = false
          $scope.crtf_eligible = res.data.data.crtf_eligible

          var crprg = 0
          var seq = null
          for (var i = 0; i < course.chapters.length; i++) {
            var chapter = course.chapters[i]
            var chap = null
            try {
              if (
                !isNaN($scope.status.cperc[chapter._id]) &&
                $scope.status.cperc[chapter._id] !== null
              ) {
                if ($scope.status.cperc[chapter._id] > crprg) {
                  crprg = $scope.status.cperc[chapter._id]
                  chap = chapter.nm
                }
                if (chap) {
                  $scope.resumeChapName = chap
                  $scope.resumeChapProg = crprg
                  $scope.resumeChapIdx = i + 1
                  seq = course.sequence[chapter._id]
                  $scope.resumeChapId = chapter._id
                }
              }
            } catch (err) {
              console.log(err)
            }
          }
          $scope.resumeChapFid = null
          if (seq) {
            console.log(seq)
            var force = true
            var force2 = true
            var force3 = true
            var fid = null
            var cstatus = $scope.status.status
            var cfid = null //compleated fid
            console.log(seq, ':============================3', cstatus)
            for (var j = 0; j < seq.length; j++) {
              try {
                if (seq[j].fid) {
                  if (cstatus[seq[j].fid]) {
                    if (
                      cstatus[seq[j].fid] &&
                      (cstatus[seq[j].fid].stts === 2 ||
                        cstatus[seq[j].fid].stts === 3)
                    ) {
                      fid = seq[j].fid
                      $scope.resumeType = seq[j].type
                      break
                    } else if (
                      force === true &&
                      cstatus[seq[j].fid] &&
                      cstatus[seq[j].fid].stts === 4
                    ) {
                      $scope.isResume = true
                      cfid = seq[j].fid
                    } else if (
                      force2 &&
                      cstatus[seq[j].fid] &&
                      cstatus[seq[j].fid].stts === 1
                    ) {
                      fid = seq[j].fid
                      force2 = false
                      $scope.isResume = true
                    }
                  } else if (force3) {
                    fid = seq[j].fid
                    cfid = seq[j].fid
                    force3 = false
                  }
                }
              } catch (err) {
                console.log(err)
              }
            }
            fid = fid ? fid : cfid
            if (fid) {
              $scope.resumeChapFid = fid
            }
          }
          cache.put('course_status', $scope.status)
          if ($scope.feedbacks.length > 0) {
            $scope.fullFeedbackAttempted = false
            var index = 0
            var statusMap = cache.get('course_status').status
            console.log({ statusMap: statusMap })
            for (var i = 0; i < $scope.feedbacks.length; i++) {
              var quiz = $scope.feedbacks[i]
              var feedbackCompletionStatus = statusMap[quiz._id]
              if (
                feedbackCompletionStatus &&
                feedbackCompletionStatus.stts == 4 &&
                feedbackCompletionStatus.cpid == quiz.chap._id
              ) {
                quiz['completion'] = true
              }
            }
            var feedbacks = $scope.feedbacks
            feedbacks = feedbacks.sort(function (a, b) {
              // console.log({acom:a.completion, bcom:b.completion})
              var x = a.completion != undefined ? a.completion : false
              var y = b.completion != undefined ? b.completion : false
              // console.log({a:a, b:b})
              // console.log({x:x, y:y})
              // console.log(x - y)
              return x - y
              // return Number(b.completion) - Number(a.completion)
            })
            console.log({ feedbacks: feedbacks })
            store.setFeedbacks(feedbacks)
            $scope.feedbacks = store.getFeedbacks()
            console.log({ feedbacksAfterCompleteCheck: $scope.feedbacks })
            // $scope.lastFeedbackIndex = 0
            for (var i = 0; i < $scope.feedbacks.length; i++) {
              var quiz = $scope.feedbacks[i]
              console.log({ currentQuiz: quiz })
              var flag = false
              if ($scope.batchObj.gradebook_auto_publish) {
                flag = true
              } else if (quiz.chap.feedback_publish) {
                flag = true
              }
              if (!quiz['completion'] && flag) {
                var chapPerc = $scope.status.cperc[quiz.chap._id]
                if (chapPerc != 100) {
                  continue
                }
                $scope.lastFeedbackIndex = i
                console.log({ lastFeedbackIndex: $scope.lastFeedbackIndex })
                $scope.feedbackOpen = true
                $scope.currentFeedbackQuiz = $scope.feedbacks[i]
                $scope.get_plugin_identifier(
                  $scope.currentFeedbackQuiz,
                  $stateParams.gid
                )
                break
              }
            }
          }
          cb()
        })
        .catch(function (err) {
          console.log(err)
        })
    }
    $scope.logOut = function () {
      console.log('logging out')
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.logout_url,
          {},
          {
            a_id: $cookies.get('aid'),
            d_id: window.fingerprint.md5hash,
            at: $cookies.get('at'),
            cl: 'W',
            rt: $cookies.get('rt'),
          }
        )
        .then(function (res) {
          $cookies.remove('at', { domain: constants.domain })
          $cookies.remove('secret', { domain: constants.domain })
          $cookies.remove('aid', { domain: constants.domain })
          $cookies.remove('rt', { domain: constants.domain })
          $cookies.remove('isLoggedIn', { domain: constants.domain })
          $cookies.remove('pid', { domain: constants.domain })
          $cookies.remove('pid', { domain: constants.domain })
          $cookies.remove('crs_tkn', { domain: constants.domain })

          window.open(constants.logout_url_redirect, '_self')
        })
        .catch(function (err) {
          console.log(err)
          alert('Something went wrong')
        })
    }
    $scope.impartusLogin = function (email) {
      $scope.isLoading = true

      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.impartus_login,
          {},
          {
            a_id: $cookies.get('aid'),
            c_id: $stateParams.cid,
          }
        )
        .then(function (response) {
          $scope.isLoading = false

          const token = response.data.data.token
          var newWin = window.open(
            'https://a.impartus.com/gateway/index.html?token=' + token,
            '_blank'
          )
          if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
            alert('Please allow browser popups to view class recordings')
          }
        })
        .catch(function (err) {
          $scope.isLoading = false
          alert(err.data.message)
          console.log(err)
        })
    }
    $scope.showFreshDesk = function () {
      var description =
        '[Please Enter Your Query Here]\n' +
        '-'.repeat(30) +
        '\nCourse Name -\n' +
        $scope.course.course_name +
        '\nBatch Name -\n' +
        $scope.batchName +
        '\n\t' +
        '-'.repeat(30) +
        '\n'

      var courseLocationId = locationOptionValue($scope.courseLocation)
      FreshworksWidget('identify', 'ticketForm', {
        name: $scope.profileName,
        email: $scope.primaryEmail,
        group_id: courseLocationId,
        description: description,
      })
      FreshworksWidget('open')
    }
    $scope.profileDropDownVisible = false
    $scope.toggleProfileDropDown = function () {
      $scope.profileDropDownVisible = !$scope.profileDropDownVisible
    }
    $scope.downloadCertificate = function () {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.apply_certificate,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.crtf_file = res.data.data.crtf_file
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.downloadCertificate()
            })
          }
        })
    }

    $scope.init = function () {
      $scope.isLoadingImg = true
      console.log('breadcrumbs::', store.getBreadCrumbs())
      window.globalAid = $cookies.get('aid')
      console.log('coursectrl.window.globalAid' + window.globalAid)
      console.log('levelId::', $scope.levelId, 'type:', typeof $scope.levelId)
      $scope.authenticateCourse(function () {
        $scope.getLevelContent(function () {})
        $scope.getCourseContent(function () {
          $scope.getCourseStatus(function () {
            $scope.getCertificateStatus(function () {})
            $scope.downloadCertificate()
          })
        })
      })
    }

    loadScript = function (url, callback) {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      if (script.readyState) {
        // only required for IE <9
        script.onreadystatechange = function () {
          if (
            script.readyState === 'loaded' ||
            script.readyState === 'complete'
          ) {
            script.onreadystatechange = null
            callback()
          }
        }
      } else {
        //Others
        script.onload = function () {
          callback()
        }
      }

      script.src = url
      document.getElementsByTagName('head')[0].appendChild(script)
    }

    loadZoomCss = function (url, callback) {
      var link = document.createElement('link')

      // set the attributes for link element
      link.rel = 'stylesheet'

      link.type = 'text/css'

      link.href = 'style.css'

      link.href = url
      // Get HTML head element to append
      // link element to it
      document.getElementsByTagName('HEAD')[0].appendChild(link)

      return callback()
    }

    $scope.joinZoomMeeting = function (liv_lec_id) {
      console.log('inside joinZoomMeeting')
      console.log(liv_lec_id, ' >>>> liv_lec_id')
      // loadZoomCss('https://source.zoom.us/1.9.5/css/bootstrap.css', function() {
      // 	loadZoomCss('https://source.zoom.us/1.9.5/css/react-select.css', function() {
      // loadScript('https://source.zoom.us/1.9.5/lib/vendor/react.min.js', function() {
      // 	loadScript('https://source.zoom.us/1.9.5/lib/vendor/react-dom.min.js', function() {
      // 		loadScript('https://source.zoom.us/1.9.5/lib/vendor/redux.min.js', function() {
      // 			loadScript('https://source.zoom.us/1.9.5/lib/vendor/redux-thunk.min.js', function() {
      // 				loadScript('https://source.zoom.us/1.9.5/lib/vendor/lodash.min.js', function() {
      // 					loadScript('https://source.zoom.us/zoom-meeting-1.9.5.min.js', function() {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.generate_zoom_signature,
          {},
          {
            liv_lec_id: liv_lec_id,
            // crs_id : $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res, 'signature response')
          var meetingConfig = {}
          meetingConfig['signature'] = res.data.data.signature
          meetingConfig['meetingNumber'] = res.data.data.meeting_number
          meetingConfig['password'] = res.data.data.meeting_password
          meetingConfig['apiKey'] = res.data.data.api_key
          meetingConfig['userName'] = res.data.data.user_name
          meetingConfig['userEmail'] = res.data.data.user_email
          meetingConfig['leaveUrl'] = window.location.href
          meetingConfig['isSupportAV'] = true

          // meetingConfig.signature = res.result;
          // meetingConfig.apiKey = API_KEY;
          var joinUrl = '/zoom_meeting?' + serialize(meetingConfig)
          console.log(joinUrl)
          window.open(joinUrl, '_self')

          // console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));
          // ZoomMtg.preLoadWasm();
          // ZoomMtg.prepareJssdk();
          // ZoomMtg.init({
          // 	leaveUrl: $scope.dashboard_url,//window.location.href,//"https://pegasus.imarticus.org",//window.location.href,
          // 	isSupportAV: true,
          // 	success: function() {
          // 		ZoomMtg.join({
          // 			signature: signature,
          // 			meetingNumber: meeting_number,
          // 			userName: user_name,
          // 			apiKey: api_key,
          // 			userEmail: user_email,
          // 			passWord: meeting_password,
          // 			success: function(success) {
          // 			// document.getElementById("zmmtg-root").style.display = 'block !important';
          // 			console.log(success)
          // 			},
          // 			error: function(error) {
          // 			console.log(error)
          // 			}
          // 		})
          // 	}
          // })
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.joinZoomMeeting()
            })
          }
        })
      // 					})
      // 				})
      // 			})
      // 		})
      // 	})
      // });
      // 	})
      // })
    }

    serialize = function (obj) {
      // eslint-disable-next-line no-shadow
      var keyOrderArr = [
        'name',
        'mn',
        'email',
        'pwd',
        'role',
        'lang',
        'signature',
        'china',
      ]

      Array.intersect = function () {
        var result = new Array()
        var obj = {}
        for (var i = 0; i < arguments.length; i++) {
          for (var j = 0; j < arguments[i].length; j++) {
            var str = arguments[i][j]
            if (!obj[str]) {
              obj[str] = 1
            } else {
              obj[str]++
              if (obj[str] == arguments.length) {
                result.push(str)
              }
            }
          }
        }
        return result
      }

      if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
          enumerable: false,
          value: function (obj) {
            var newArr = this.filter(function (el) {
              return el === obj
            })
            return newArr.length > 0
          },
        })
      }

      var tmpInterArr = Array.intersect(keyOrderArr, Object.keys(obj))
      var sortedObj = []
      keyOrderArr.forEach(function (key) {
        if (tmpInterArr.includes(key)) {
          sortedObj.push([key, obj[key]])
        }
      })
      Object.keys(obj)
        .sort()
        .forEach(function (key) {
          if (!tmpInterArr.includes(key)) {
            sortedObj.push([key, obj[key]])
          }
        })
      var tmpSortResult = (function (sortedObj) {
        var str = []
        for (var p in sortedObj) {
          if (typeof sortedObj[p][1] !== 'undefined') {
            str.push(
              encodeURIComponent(sortedObj[p][0]) +
                '=' +
                encodeURIComponent(sortedObj[p][1])
            )
          }
        }
        return str.join('&')
      })(sortedObj)
      return tmpSortResult
    }

    $scope.updateChapterStatusAndToggle = function (chapter, chapter_no) {
      if (
        $scope.hide_course_content &&
        chapter_no > $scope.no_of_visible_chapters
      ) {
        console.log('hidden')
      } else {
        chapter.isCollapsed = !chapter.isCollapsed
        api
          .query(
            'POST',
            {
              'x-access-crs-token': $cookies.get('crs_tkn'),
            },
            constants.chapter_status,
            {},
            {
              crs_id: $stateParams.cid,
              cp_id: chapter._id,
              p_id: $stateParams.pid,
              a_id: $cookies.get('aid'),
            }
          )
          .then(function (res) {})
          .catch(function (err) {
            console.log(err)
            if (err.status && err.status == 498 && err.data.code == 4100) {
              api.getAccessToken().then(function (res) {
                $scope.updateChapterStatus(chapter._id)
              })
            }
          })
      }
    }

    $scope.getCertificateStatus = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.certificate_status,
          {},
          {
            crs_id: $stateParams.cid,
            a_id: $cookies.get('aid'),
            p_id: $stateParams.pid,
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.certiEnabled = res.data.data.certiEnabled
          $scope.certiAutoPublish = res.data.data.auto_publish
          $scope.certiPublished = res.data.data.published
          $scope.certiGenerated = res.data.data.generated
          console.log({
            certiEnabled: $scope.certiEnabled,
            certiAutoPublish: $scope.certiAutoPublish,
            certiPublished: $scope.certiPublished,
            certiGenerated: $scope.certiGenerated,
            crtf_eligible: $scope.crtf_eligible,
          })
          cb()
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.checkCertificate = function () {
      if (!$scope.course.crtf_eligible) {
        return false
      } else {
        console.log($scope.course.crtf_eligible)
        return true
      }
    }

    $scope.redirectTo = function (type) {
      if (type == 1) {
        // window.location.replace($scope.my_course_url);
        // window.history.back();
        var url = constants.my_course_url + '?cid=' + $stateParams.cid
        console.log('url:::', url)
        window.location.href = url
      } else if (type == 2) {
        window.location.replace(
          $scope.discussion_url + '/' + $scope.gid + '?pid=' + $scope.pid
        )
      } else if (type == 3) {
        console.log('level_labels:::', $scope.levelsArr)
        if ($scope.levelsArr && $scope.levelsArr.length > 1) {
          window.location.replace(
            $scope.my_course_url + '?cid=' + $stateParams.cid
          )
        } else {
          console.log('Only Chapters')
          return
        }
      } else if (type == 4) {
        if ($scope.levelsArr && $scope.levelsArr.length == 1) {
          console.log('Only Chapters')
          return
        } else {
          window.location.replace(
            $scope.my_course_url + '?cid=' + $stateParams.cid
          )
        }
      }

      // return false
    }
    $scope.openFeedback = function (quiz, chapId) {
      console.log({ quiz: quiz })
      console.log({ chapterStatus: $scope.status.cperc[chapId] })
      var chapPerc = $scope.status.cperc[chapId]
      if (chapPerc != 100) {
        return ($scope.showFeedbackLocked = true)
      }

      for (var i = 0; i < $scope.feedbacks.length; i++) {
        console.log({ currentQuiz1: $scope.feedbacks[i] })
        if (quiz._id != $scope.feedbacks[i]._id) continue
        var currentQuiz = $scope.feedbacks[i]
        console.log({ currentSelectedQuiz: currentQuiz })
        if (!currentQuiz['completion']) {
          $scope.lastFeedbackIndex = i
          console.log({ lastFeedbackIndex: $scope.lastFeedbackIndex })
          $scope.feedbackOpen = true
          $scope.currentFeedbackQuiz = $scope.feedbacks[i]
          $scope.get_plugin_identifier(
            $scope.currentFeedbackQuiz,
            $stateParams.gid
          )
          break
        } else {
          $scope.showAttempted = true
        }
      }
    }
    $scope.redirectToDashboard = function () {
      window.location.replace($scope.dashboard_url)
    }

    $scope.redirectToPlacements = function () {
      api
        .query(
          'POST',
          {
            'x-access-token': $cookies.get('at'),
          },
          constants.placement_redirect,
          {},
          {
            c_id: $stateParams.cid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          if (res.data.success) {
            var urlToRedirect = res.data.data.urlToRedirect
            window.open(urlToRedirect, '_blank')
          } else {
            window.alert('Something went wrong')
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.init()
  },
])
var docLectureController = angular.module('docLectureController', [
  'ngMaterial',
  'apiService',
  'ui.ace',
])

docLectureController.controller('docLectureController', [
  '$window',
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  '$http',
  'Upload',
  'alertify',
  '$cookies',
  '$mdDialog',
  '$timeout',
  '$sce',
  function (
    $window,
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    $http,
    $upload,
    alertify,
    $cookies,
    $mdDialog,
    $timeout,
    $sce
  ) {
    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid
    $scope.topic = $stateParams.topic
    $scope.chapter = $stateParams.chid
    $scope.progress = 0
    $scope.fetchcompilerresult = false
    $scope.showTestCaseInputArea = false
    $scope.custominput = ''
    $scope.codingassignment_result = false
    $scope.codingAssignmentSubmissionStatusModal = false
    $scope.submitAssignmentModal = false
    $scope.documentAsLecture = ''
    $scope.adobeDCView

    $scope.$on('$locationChangeStart', function () {
      $scope.$parent.submitcodingassignmentcounter = false
      console.log(
        'routechanges ' + $scope.$parent.submitcodingassignmentcounter
      )
    })

    $scope.init = function () {
      $window.addEventListener(
        'adobe_dc_view_sdk.ready',
        $scope.initiateAdobeReader(function (res) {
          // alert(res)
          $scope.$parent.markTopicActive($scope.chapter, $scope.topic)
          $scope.resubmit_button = true
          if ($scope.course) {
            console.log(course, 'course >>>>>')
            $scope.activateDocumentAsLecture()
          }
        })
      )
    }

    $scope.initiateAdobeReader = function (cb) {
      // alert("initiation complete AdobeReader");
      $scope.adobeDCView = new AdobeDC.View({
        clientId: constants.adobe_pdf_reader_key,
        divId: 'adobe-dc-view',
      })
      // $scope.adobeDCView = new AdobeDC.View({
      //   clientId: 'ce29ea55c76f4846a76b486869dd9413',
      //   divId: 'adobe-dc-view',
      // })
      if (typeof $scope.adobeDCView == 'object') {
        return cb('success')
      } else {
        $scope.init()
      }
    }

    $scope.$on('courseLoaded', function (args, course) {
      $scope.course = course
      $scope.activateDocumentAsLecture()
    })

    $scope.activateDocumentAsLecture = function () {
      $scope.documentAsLecture = $scope.course.documentAsLectures[$scope.topic]
      $scope.descriptionAsHtml = $sce.trustAsHtml($scope.documentAsLecture.dsc)
      $scope.downloadFile(function (res) {
        // alert(JSON.stringify(res))
        $scope.file_url = res.url
        console.log($scope.file_url)
        $scope.adobeDCView.previewFile(
          {
            content: { location: { url: $scope.file_url } },
            metaData: { fileName: '.' },
          },
          {
            embedMode: 'SIZED_CONTAINER',
            showSaveButton: false,
            showDownloadPDF: false,
            showPrintPDF: false,
          }
        )
        store.currentactive($scope.documentAsLecture)
        console.log($scope.documentAsLecture)
        // if ($scope.documentAsLecture !== null) {
        if (
          $scope.$parent.topics.length > 0 &&
          $scope.documentAsLecture !== null
        ) {
          $scope.updateDocumentAsLectureStatus(
            $scope.chapter,
            $scope.documentAsLecture._id
          )
        }
      })
      if (
        $scope.documentAsLecture.extras &&
        $scope.documentAsLecture.extras.length > 0
      ) {
        for (var i = 0; i < $scope.documentAsLecture.extras.length; i++) {
          $scope.getSignedUrlAndUpdateData(
            $scope.course.others[$scope.documentAsLecture.extras[i]].url,
            $scope.documentAsLecture.extras[i],
            function (id, res) {
              $scope.course.others[id].signed_url = res.signed_url
            },
            function (err) {
              console.log(err)
            }
          )
        }
      }
    }
    $scope.getSignedUrlAndUpdateData = function (
      url,
      resource,
      successCallback,
      failureCallback
    ) {
      api
        .query(
          'GET',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.get_signed_url,
          {
            m_url: url,
            g_id: $scope.gid,
            p_id: $stateParams.pid,
            tokn: $cookies.get('at'),
          },
          {}
        )
        .then(function (res) {
          console.log(res)
          successCallback(resource, res.data.data)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.getSignedUrlAndUpdateData(url)
            })
          }
          failureCallback(err)
        })
    }

    $scope.updateDocumentAsLectureStatus = function (chapter_id, doc_lec_id) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.chapter_doc_lecture_status,
          {},
          {
            crs_id: $stateParams.cid,
            cp_id: chapter_id,
            doc_lec_id: doc_lec_id,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          $scope.userdata = res.data.data
        })
        .catch(function (err) {
          console.log(err)

          if (err.data && err.data.code == 207600) {
            $scope.assignment_dealine_reached = true
          }
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.updateChapterStatus(chapter._id, doc_lec_id)
            })
          }
        })
    }

    var handleFileSelect = function (evt) {
      $scope.progress = 0
      var file = evt.currentTarget.files[0]
      $scope.file_name = file.name
      var reader = new FileReader()
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          $scope.file = evt.target.result
          $scope.uploadFile(
            $scope.file,
            file.name,
            file.type,
            $scope.getExtension(file.name)
          )
        })
      }
      reader.readAsDataURL(file)
    }

    $scope.getExtension = function (filename) {
      return (
        filename.substring(filename.lastIndexOf('.') + 1, filename.length) ||
        filename
      )
    }

    $scope.getWithoutExtension = function (filename) {
      return filename.substring(0, filename.lastIndexOf('.')) || filename
    }

    $scope.uploadFile = function (file, fname, type, ext) {
      var time = new Date().getTime()
      var name = $scope.pid + '_' + time + '_' + fname

      $scope.getAWSCredentials(type, function (s3Params) {
        $scope.uploadToAWS(s3Params, name, type, file, function (url) {
          console.log(url)
          // $scope.assignment.file_url = url;
          $scope.progress = 100
        })
      })
    }

    $scope.getAWSCredentials = function (type, cb) {
      api
        .query(
          'GET',
          {
            'x-access-token': $cookies.get('at'),
          },
          constants.upload_media,
          {
            p_id: $stateParams.pid,
            g_id: $stateParams.gid,
            mimetype: type,
          },
          {}
        )
        .then(function (res) {
          cb(res.data.data)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (url) {
              $scope.getAWSCredentials(type, cb)
            })
          }
        })
    }

    $scope.uploadToAWS = function (s3Params, name, type, file, cb) {
      $upload
        .upload({
          url: 'https://' + s3Params.bucket + '.s3.amazonaws.com/',
          method: 'POST',
          transformRequest: function (data, headersGetter) {
            //Headers change hereee
            var headers = headersGetter()
            delete headers['Authorization']
            return data
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          fields: {
            key: name,
            AWSAccessKeyId: s3Params.AWSAccessKeyId,
            acl: 'authenticated-read',
            Policy: s3Params.s3Policy,
            Signature: s3Params.s3Signature,
            'Content-Type': type,
            success_action_status: '201',
          },
          file: file,
        })
        .then(
          function (response) {
            $scope.uploading = false
            $scope.uploaded = true
            $scope.assignment.file_url =
              'https://' + s3Params.bucket + '.s3.amazonaws.com/' + name
            cb('https://' + s3Params.bucket + '.s3.amazonaws.com/' + name)

            if (response.status === 201) {
              console.log(response)
            } else {
              $scope.error = 'Upload Failed'
            }
          },
          null,
          function (evt) {
            console.log(evt.loaded)
            console.log(evt.total)
            $scope.progress = parseInt((90.0 * evt.loaded) / evt.total)
          }
        )
    }

    $scope.deleteAttachment = function () {
      alertify.confirm(
        ' Are you sure you want to remove attachment ?',
        function () {
          $scope.$apply(function () {
            $scope.file_name = null
            $scope.progress = 0
          })
          document.getElementById('file').value = null
          $scope.assignment.file_url = null
        },
        function () {}
      )
    }

    $scope.downloadFile = function (cb) {
      $scope.getSignedUrl(
        $scope.documentAsLecture.file,
        function (res) {
          $scope.signed_url = res.signed_url
          reply = {
            success: true,
            url: $scope.signed_url,
          }
          return cb(reply)
          var i = '',
            file_content = ''
          var linkSource = '',
            downloadLink = '',
            fileName = '',
            content_type = ''
          $http({
            method: 'GET',
            url: res.signed_url,
          }).then(function mySuccess(response) {
            $scope.File = response.data
            i = $scope.File.indexOf(',')
            file_content = $scope.File.slice(i + 1)
            fileName = $scope.File.split(';')[0]
            content_type = fileName.slice(fileName.indexOf(':') + 1)
            // console.log("type---- "+content_type+"fileName "+fileName+"-----  "+file_content);
            var blob = b64toBlob(file_content, content_type, 512)
            var blobUrl = URL.createObjectURL(blob)
            linkSource = blobUrl
            downloadLink = document.getElementById(id)
            downloadLink.href = linkSource
            downloadLink.download = res.filename
            downloadLink.click()
          }),
            function myError(response) {
              $scope.myWelcome = response.statusText
            }
        },
        function (err) {
          console.log(err)
          reply = {
            success: false,
            err: err,
          }
          return cb(reply)
        }
      )
    }

    $scope.downloadPreviousUploadedFile = function (id) {
      $scope.getSignedUrl(
        $scope.userdata.assignment_data.file,
        function (res) {
          $scope.signed_url = res.signed_url
          var i = '',
            file_content = ''
          var linkSource = '',
            downloadLink = '',
            fileName = '',
            content_type = ''
          $http({
            method: 'GET',
            url: res.signed_url,
          })
            .then(function mySuccess(response) {
              $scope.File = response.data
              i = $scope.File.indexOf(',')
              file_content = $scope.File.slice(i + 1)
              fileName = $scope.File.split(';')[0]
              content_type = fileName.slice(fileName.indexOf(':') + 1)
              console.log(
                'type---- ' +
                  content_type +
                  'fileName ' +
                  fileName +
                  '-----  ' +
                  file_content
              )
              var blob = b64toBlob(file_content, content_type, 512)
              var blobUrl = URL.createObjectURL(blob)
              linkSource = blobUrl
              downloadLink = document.getElementById(id)
              downloadLink.href = linkSource
              downloadLink.download = res.filename
              downloadLink.click()
            })
            .catch(function (err) {
              linkSource = $scope.userdata.assignment_data.file
              downloadLink = document.getElementById(id)
              downloadLink.href = linkSource
              downloadLink.download = res.filename
              downloadLink.click()
            })
        },
        function (err) {
          console.log(err)
        }
      )
    }

    var b64toBlob = function (b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 512

      var byteCharacters = atob(b64Data)

      var byteArrays = []

      for (
        var offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        var slice = byteCharacters.slice(offset, offset + sliceSize)

        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        var byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }

      var blob = new Blob(byteArrays, { type: contentType })
      return blob
    }

    $scope.getSignedUrl = function (url, successCallback, failureCallback) {
      api
        .query(
          'GET',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.get_signed_url,
          {
            m_url: url,
            g_id: $scope.gid,
            p_id: $stateParams.pid,
            tokn: $cookies.get('at'),
          },
          {}
        )
        .then(function (res) {
          successCallback(res.data.data)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.getSignedUrl(url)
            })
          }
          failureCallback(err)
        })
    }

    $scope.showDialog = function (ev) {
      // console.log(history.state);
      if (screen.width > 500) {
        $scope.webModal = true
        $scope.mobileModal = false
        $mdDialog.show({
          contentElement: '#myDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          escapeToClose: false,
        })
      } else {
        // console.log($(location).attr('href'));
        // history.pushState(null, null, $(location).attr('href'));
        // window.addEventListener('popstate', function () {
        // 		history.pushState(null, null, $(location).attr('href'));
        // });
        $scope.webModal = false
        $scope.mobileModal = true
        $mdDialog.show({
          contentElement: '#myMobileDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          escapeToClose: false,
        })
      }
    }

    $scope.cancel = function () {
      $mdDialog.cancel()
    }

    $scope.backPanel = function () {
      $mdDialog.cancel()
    }

    $scope.submitAssignment = function () {
      // console.log($scope.assignment.file_url+'-----'+$scope.assignment.text);
      //  console.log("sssWSS "+$scope.progress+" ss "+$scope.file_name);
      if ($scope.file_name && $scope.progress != 100) {
        alertify.alert('Please wait for the file to get uploaded completely!')
      } else if (
        ($scope.assignment.file_url == null &&
          $scope.assignment.text == null) ||
        ($scope.assignment.file_url == '' && $scope.assignment.text == '') ||
        ($scope.assignment.file_url == null && $scope.assignment.text == '') ||
        ($scope.assignment.file_url == '' && $scope.assignment.text == null)
      ) {
        alertify.alert('Please complete the assignment before submitting!')
      } else {
        api
          .query(
            'POST',
            {
              'x-access-crs-token': $cookies.get('crs_tkn'),
            },
            constants.submit_assignment,
            {},
            {
              crs_id: $stateParams.cid,
              p_id: $stateParams.pid,
              a_id: $cookies.get('aid'),
              ag_id: $scope.assignment._id,
              dt: {
                file: $scope.assignment.file_url,
                text: $scope.assignment.text,
              },
            }
          )
          .then(function (res) {
            alertify.alert('Successfully submitted assignment.', function () {
              $scope.init()
            })
          })
          .catch(function (err) {
            console.log(err)
            if (err.status && err.status == 498 && err.data.code == 4100) {
              api.getAccessToken().then(function (res) {
                $scope.init()
              })
            }
            if (
              err.status &&
              (err.data.code == 701000 || err.data.code == 703000)
            ) {
              var err_msg =
                err.data.message + ' Word Limit : ' + $scope.word_count
              alertify.alert(err_msg, function () {
                $scope.init()
              })
            }
          })
      }
    }

    $scope.resubmitAssignment = function () {
      $scope.resubmit_button = false
      $scope.userdata.upload_assignment = true
      $scope.assignment.file_url = null
      $scope.assignment.text = null
      $scope.file_name = null
    }

    angular
      .element(document.querySelector('#file'))
      .on('change', handleFileSelect)

    $scope.init()
  },
])
var monthsArr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

var gradebookController = angular.module('gradebookController', [
  'apiService',
  'ui.bootstrap',
])
function locationOptionValue(location) {
  if (location == undefined) {
    return ''
  }

  //returns option values from freshdesk
  switch (location.toLocaleLowerCase()) {
    case 'ahmedabad':
      return 33000209535
    case 'bangalore':
      return 33000064348
    case 'chennai':
      return 33000064355
    case 'coimbatore':
      return 33000064351
    case 'fsb':
      return 33000213003
    case 'isa':
      return 33000213004
    case 'jaipur':
      return 33000213005
    case 'lucknow':
      return 33000213006
    case 'mumbai':
      return 33000064310
    case 'ncr':
      return 33000208740
    case 'online':
      return 33000064309
    case 'pune':
      return 33000064311
    case 'thane':
      return 33000207449
    case 'hyderabad':
      return 33000064349
    default:
      return 0
  }
}
gradebookController.controller('gradebookController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  'superCache',
  '$cookies',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    cache,
    $cookies,
    $sce
  ) {
    $scope.isOpen = false
    $scope.isTiersOpen = false
    $scope.isFactOpen = false
    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid
    $scope.assignment_data = []
    $scope.quiz_data = []
    $scope.primary_url = constants.primary_url
    $scope.dashboard_url = constants.dashboard_url
    $scope.my_course_url = constants.my_course_url
    $scope.discussion_url = constants.discussion_url
    $scope.payment_url = constants.payment_url
    $scope.totalP = 0
    $scope.totalPView = 0
    $scope.totalWeightAssignedP = 0
    $scope.joining = null
    $scope.courseName = ''
    $scope.course = {}
    $scope.dp = ''
    $scope.userName = ''
    $scope.uid = ''
    $scope.certiAvailable = false
    $scope.certiLink = ''
    $scope.tiers = []
    $scope.samplehtml = []
    $scope.weightAssigned = 0
    $scope.noAssigned = 0
    $scope.averageWeight = 0
    $scope.tierRange = []
    $scope.selfPaced = false
    $scope.view = false
    $scope.certiEnabled = false
    $scope.certiAutoPublish = false
    $scope.certiPublished = false
    $scope.certiGenerated = false
    $scope.crtf_eligible = false
    $scope.impartusEnabled = false
    $scope.closeSimplePopover = function () {
      $scope.isOpen = false
    }
    $scope.closeTiersPopover = function () {
      $scope.tiersOpen = false
    }
    $scope.closeFactorsPopover = function () {
      $scope.isFactOpen = false
      console.log('tryin to close::', $scope.isFactOpen)
    }

    $scope.authenticateCourse = function (cb) {
      api
        .query(
          'POST',
          {},
          constants.course_auth,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            g_id: $stateParams.gid,
            tokn: $cookies.get('at'),
            a_id: $cookies.get('aid'),
            cl: 'W',
            d_id: window.fingerprint.md5hash,
          }
        )
        .then(function (res) {
          console.log(res)
          store.storeCookie('crs_tkn', res.data.data.at)
          if (res.data.data.joined) {
            $scope.joining = new Date(res.data.data.joined)
          }
          if (res.data.data.uid) {
            $scope.uid = res.data.data.uid
          }
          $scope.uid = res.data.data.uid
          if (res.data.data.name) {
            $scope.courseName = res.data.data.name
          }
          if (res.data.data.selfPaced) {
            $scope.selfPaced = res.data.data.selfPaced
          }
          ;($scope.impartusEnabled = res.data.data.course.impartus_enabled),
            ($scope.batchName = res.data.data.course.btch_name),
            ($scope.courseLocation = res.data.data.location)
          console.log($scope.batchName)
          console.log($scope.impartusEnabled)

          cb()
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.init()
            })
          }
        })
    }

    $scope.findProfile = function (cb) {
      api
        .query(
          'POST',
          {},
          constants.find_profile,
          {},
          {
            tokn: $cookies.get('at'),
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          res.data.data.Profile.reverse().forEach(function (profile) {
            if (profile.ppic) {
              $scope.dp = profile.ppic
            }
            console.log(' name::', profile.nam, Boolean(profile.nam))
            if (profile.nam) {
              $scope.userName = profile.nam
              console.log('setting name::', profile.nam)
            }
          })
          $scope.primaryEmail = res.data.data.primaryEmail
          cb()
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.init()
            })
          }
        })
    }
    $scope.impartusLogin = function (email) {
      $scope.isLoading = true

      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.impartus_login,
          {},
          {
            a_id: $cookies.get('aid'),
            c_id: $stateParams.cid,
          }
        )
        .then(function (response) {
          $scope.isLoading = false

          const token = response.data.data.token
          var newWin = window.open(
            'https://a.impartus.com/gateway/index.html?token=' + token,
            '_blank'
          )
          if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
            alert('Please allow browser popups to view class recordings')
          }
        })
        .catch(function (err) {
          $scope.isLoading = false
          alert(err.data.message)
          console.log(err)
        })
    }
    $scope.getBrandData = function (cb) {
      var params = {
        cid: $stateParams.cid,
      }
      api
        .query(
          'GET',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.fetch_brand_data,
          params,
          {}
        )
        .then(function (res) {
          console.log(res)
          $scope.brand = res.data.data.brand
          cb()
        })
        .catch(function (err) {
          console.log(err)
        })
    }
    $scope.showFreshDesk = function () {
      var description =
        '[Please Enter Your Query Here]\n' +
        '-'.repeat(30) +
        '\nCourse Name -\n' +
        $scope.courseName +
        '\nBatch Name -\n' +
        $scope.batchName +
        '\n\t' +
        '-'.repeat(30) +
        '\n'

      var courseLocationId = locationOptionValue($scope.courseLocation)
      FreshworksWidget('identify', 'ticketForm', {
        name: $scope.userName,
        email: $scope.primaryEmail,
        group_id: courseLocationId,
        description: description,
      })
      FreshworksWidget('open')
    }
    $scope.hideFreshDesk = function () {
      FreshworksWidget('hide')
    }
    $scope.profileDropDownVisible = false
    $scope.toggleProfileDropDown = function () {
      $scope.profileDropDownVisible = !$scope.profileDropDownVisible
    }
    $scope.logOut = function () {
      console.log('logging out')
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.logout_url,
          {},
          {
            a_id: $cookies.get('aid'),
            d_id: window.fingerprint.md5hash,
            at: $cookies.get('at'),
            cl: 'W',
            rt: $cookies.get('rt'),
          }
        )
        .then(function (res) {
          $cookies.remove('at', { domain: constants.domain })
          $cookies.remove('secret', { domain: constants.domain })
          $cookies.remove('aid', { domain: constants.domain })
          $cookies.remove('rt', { domain: constants.domain })
          $cookies.remove('isLoggedIn', { domain: constants.domain })
          $cookies.remove('pid', { domain: constants.domain })
          $cookies.remove('pid', { domain: constants.domain })
          $cookies.remove('crs_tkn', { domain: constants.domain })

          window.open(constants.logout_url_redirect, '_self')
        })
        .catch(function (err) {
          console.log(err)
          alert('Something went wrong')
        })
    }
    $scope.profileDropDownVisible = false
    $scope.toggleProfileDropDown = function () {
      $scope.profileDropDownVisible = !$scope.profileDropDownVisible
    }
    $scope.getGradebookData = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.gradebook_data,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          $scope.loading = false
          console.log(res, ':response data')
          $scope.grades = res.data.data.controlled_data
          $scope.totalP = res.data.data.totalGrade
          $scope.totalPView = res.data.data.totalGradeView
          $scope.totalWeightAssignedP = res.data.data.totalWeightAssignedP
          $scope.selfPaced = res.data.data.gradebook_auto_publish
          cache.put('grades', $scope.grades)
          for (var i = 0; i < $scope.grades.length; i++) {
            if ($scope.grades[i]['type'] == 1) {
              $scope.assignment_data.push($scope.grades[i])
            } else if ($scope.grades[i]['type'] == 2) {
              $scope.quiz_data.push($scope.grades[i])
            }
          }
          cb()
        })
        .catch(function (err) {
          $scope.loading = false
          console.log(err)
        })
    }

    $scope.getTiersData = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.gt_tiers,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log({ tiersRes: res })
          console.log($scope.tiers, ':getTiers data')
          if (res.data.data.tiers.length > 0) {
            $scope.tiers = res.data.data.tiers
            console.log($scope.tiers, ':getTiers data later')
            for (var i = 0; i < $scope.tiers.length; i++) {
              $scope.tierRange[i] = {
                start: $scope.tiers[i].tier_start,
                end: $scope.tiers[i].tier_end,
              }
            }
          }
          console.log({ tierRange: $scope.tierRange })
          console.log($scope.tierRange[0].end == 0)
          if ($scope.tierRange[0].end == 0) {
            $scope.tierRange = [
              {
                start: 90,
                end: 100,
              },
              {
                start: 70,
                end: 90,
              },
              {
                start: 50,
                end: 70,
              },
              {
                start: 0,
                end: 50,
              },
            ]
          }
          console.log({ tierRange: $scope.tierRange })
          cb()
        })
        .catch(function (err) {
          console.log(err)
          $scope.loading = false
        })
    }
    $scope.checkCertiReq = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.cert_req_status,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res, ':response data')
          $scope.certiAvailable = res.data.data.view
            ? res.data.data.view
            : false
          console.log('certiAvailable::', $scope.certiAvailable)
          cb()
        })
        .catch(function (err) {
          console.log(err)
          $scope.loading = false
        })
    }
    $scope.getCerti = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.aply_crtf,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res, ':response data')
          $scope.certiLink = res.data.data.crtf_file
          console.log('certiLink::', $scope.certiLink)
          cb()
        })
        .catch(function (err) {
          console.log(err)
          $scope.loading = false
        })
    }

    $scope.init = function () {
      $scope.loadingImg = true
      $scope.authenticateCourse(function () {
        $scope.findProfile(function () {
          $scope.getGradebookData(function () {
            $scope.getTiersData(function () {})
          })
          $scope.getCertificateStatus(function () {
            $scope.getCourseStatus()
          })
          // $scsaope.getCourseContent(function(){
          // 	$scope.getCertificateStatus()
          // });
          $scope.checkCertiReq(function () {})
          $scope.getCerti(function () {})
          $scope.getBrandData(function () {
            $scope.loadingImg = false
          })
        })
      })
    }

    $scope.redirectTo = function (type) {
      FreshworksWidget('hide')
      if (type == 1) {
        console.log('level_labels:::', $scope.course.level_labels)
        if (
          $scope.course &&
          $scope.course.level_labels &&
          $scope.course.level_labels.length > 1
        ) {
          window.location.replace(
            $scope.my_course_url + '?cid=' + $stateParams.cid
          )
        } else {
          link =
            '/#/course/' +
            $scope.pid +
            '/' +
            $scope.gid +
            '/' +
            $scope.cid +
            '/undefined'
          console.log('link::', link)
          window.location.href = link
        }
      }

      if (type == 2) {
        window.location.replace(
          $scope.discussion_url + '/' + $scope.gid + '?pid=' + $scope.pid
        )
      } else if (type == 3) {
        console.log('level_labels:::', $scope.course.level_labels)
        if (
          $scope.course &&
          $scope.course.level_labels &&
          $scope.course.level_labels.length > 1
        ) {
          window.location.href =
            $scope.my_course_url + '?cid=' + $stateParams.cid
        } else {
          link =
            '/#/course/' +
            $scope.pid +
            '/' +
            $scope.gid +
            '/' +
            $scope.cid +
            '/undefined'
          console.log('link::', link)
          window.location.href = link
        }
      }
      // return false
    }
    $scope.redirectToDash = function () {
      window.location.replace($scope.dashboard_url)
    }

    $scope.getCertificateStatus = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.certificate_status,
          {},
          {
            crs_id: $stateParams.cid,
            a_id: $cookies.get('aid'),
            p_id: $stateParams.pid,
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.certiEnabled = res.data.data.certiEnabled
          $scope.certiAutoPublish = res.data.data.auto_publish
          $scope.certiPublished = res.data.data.published
          $scope.certiGenerated = res.data.data.generated
          console.log({
            certiEnabled: $scope.certiEnabled,
            certiAutoPublish: $scope.certiAutoPublish,
            certiPublished: $scope.certiPublished,
            certiGenerated: $scope.certiGenerated,
            crtf_eligible: $scope.crtf_eligible,
          })

          $scope.course = res.data.data.course
          if (cb) cb()
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.getCourseStatus = function (cb) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.course_status,
          {},
          {
            crs_id: $stateParams.cid,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.status = res.data.data
          $scope.crtf_eligible = res.data.data.crtf_eligible
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.init()
  },
])
var homeController = angular.module('homeController', ['apiService'])

homeController.controller('homeController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  '$location',
  '$state',
  'store',
  'constants',
  '$stateParams',
  'superCache',
  '$cookies',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    $location,
    $state,
    store,
    constants,
    $stateParams,
    cache,
    $cookies
  ) {
    $scope.loadingImg = true
    $scope.showSidebar = false
    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.dashboard_url = constants.dashboard_url
    $scope.payment_url = constants.payment_url
    if (cache.get('courses')) {
      $scope.courses = cache.get('courses')
    }
    $scope.chapter_url = constants.chapter_url

    $scope.init = function () {
      window.globalAid = $cookies.get('aid')
      console.log('homectrl.window.globalAid' + window.globalAid)
      api
        .query(
          'POST',
          {},
          constants.get_courses,
          {},
          {
            p_id: $stateParams.pid,
            g_id: $stateParams.gid,
            tokn: $cookies.get('at'),
          }
        )
        .then(function (res) {
          console.log(res)
          $scope.courses = res.data.data.groupcourse
          $scope.group_name = res.data.data.group_name
          $scope.status = res.data.data.ucstatus
          $scope.courseLinks = res.data.data.courselinks
          cache.put('courses', $scope.courses)
          $scope.authenticateCourse(function () {
            $scope.getBrandData(function () {})
          })
        })
        .catch(function (err) {
          console.log(err)
          if (err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function () {
              $scope.init()
            })
          }
        })
    }

    $scope.processRatings = function (rtg) {
      var rating = parseFloat(rtg)
      var ratingsArr = []
      for (var i = 0; i < 5; i++) {
        if (i < rating) {
          if (i == Math.floor(rating)) {
            ratingsArr.push(Math.round((rating % i) * 10))
            continue
          }
          ratingsArr.push(10)
        } else {
          ratingsArr.push(0)
        }
      }
      return ratingsArr
    }

    $scope.authenticateCourse = function (cb) {
      api
        .query(
          'POST',
          {},
          constants.course_auth,
          {},
          {
            crs_id: $scope.courses[0]._id,
            p_id: $stateParams.pid,
            g_id: $stateParams.gid,
            tokn: $cookies.get('at'),
            a_id: $cookies.get('aid'),
            cl: 'W',
            d_id: window.fingerprint.md5hash,
          }
        )
        .then(function (res) {
          console.log(res)
          store.storeCookie('crs_tkn', res.data.data.at)
          if (res.data.data.joined) {
            $scope.joining = new Date(res.data.data.joined)
          }
          if (res.data.data.uid) {
            $scope.uid = res.data.data.uid
          }
          $scope.uid = res.data.data.uid
          if (res.data.data.name) {
            $scope.courseName = res.data.data.name
          }
          if (res.data.data.selfPaced) {
            $scope.selfPaced = res.data.data.selfPaced
          }
          ;($scope.impartusEnabled = res.data.data.course.impartus_enabled),
            ($scope.batchName = res.data.data.course.btch_name),
            ($scope.courseLocation = res.data.data.location)
          console.log($scope.batchName)
          console.log($scope.impartusEnabled)

          cb()
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.init()
            })
          }
        })
    }

    $scope.getBrandData = function (cb) {
      var params = {
        cid: $scope.courses[0]._id,
      }
      api
        .query(
          'GET',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.fetch_brand_data,
          params,
          {}
        )
        .then(function (res) {
          console.log(res)
          $scope.brand = res.data.data.brand
          $scope.loadingImg = false
          cb()
        })
        .catch(function (err) {
          console.log(err)
          $scope.loadingImg = false
        })
    }

    $scope.getStar = function (val) {
      return 'https://cdn.eckovation.com/courses/images/4.' + val + '.svg'
    }
    $scope.backToGroup = function () {
      console.log(
        'redirect url::',
        dashboard_url + '/group-detail?gid=' + $stateParams.gid
      )
      window.location.href =
        dashboard_url + '/group-detail?gid=' + $stateParams.gid
    }

    $scope.init()

    $scope.redirectTo = function (type, cid) {
      if (type == 1) {
        // window.location.replace($scope.my_course_url);
        // window.history.back();
        console.log('cid:::', cid)
        // var url = constants.my_course_url + '?cid=' + cid
        // console.log('url:::', url)
        // window.location.href = url
        var course = {}
        for (var i = 0; i < $scope.courses; i++) {
          if (el._id == cid) {
            course = $scope.courses[i]
          }
        }
        if (course && course.level_labels && course.level_labels.length > 1) {
          window.location.href =
            $scope.my_course_url + '?cid=' + $stateParams.cid
        } else {
          link =
            $scope.chapter_url +
            '/#/course/' +
            $scope.pid +
            '/' +
            $scope.gid +
            '/' +
            cid +
            '/undefined'
          console.log('link::', link)
          window.location.href = link
          // window.location.replace(link)
        }
      } else {
        window.location.replace($scope.dashboard_url)
      }
    }
  },
])
var lectureController = angular.module('lectureController', [
  'apiService',
  'ngMaterial',
])

lectureController.controller('lectureController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  '$cookies',
  '$sce',
  '$anchorScroll',
  '$location',
  '$timeout',
  '$interval',
  '$mdDialog',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    $cookies,
    $sce,
    $anchorScroll,
    $timeout,
    $interval,
    $location,
    $mdDialog
  ) {
    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid
    $scope.topic = $stateParams.topic
    $scope.chapter = $stateParams.chid
    $scope.skptime = $stateParams.skptm / 1000
    $scope.topics = []
    $scope.timeForNextVideo = 5
    $scope.updated = false
    $scope.firstTimeReload = false
    $scope.currentUrl = null
    $scope.timer = null
    $scope.currentT = 0
    var mm, ss
    $scope.totalSec = null
    $scope.addnewBk = false
    $scope.editBk = false
    $scope.selectedBkIndex = -1
    $scope.openDeleteBkModal = false
    $scope.playerPlay = false
    $scope.playerMute = false
    $scope.playerFullScreen = false
    $scope.playerProgressBar = 0
    $scope.playerTimeStamp = 0
    $scope.videoSource = ''
    $scope.breadCrumbs = store.getBreadCrumbs()

    $scope.submitivq = function () {
      console.log($scope.selected)
      if ($scope.qusdata.data.cueData.type == 1) {
        $scope.selected = []
        $scope.lst.forEach(function (opt) {
          $scope.selected.push(opt.id.toString())
        })
      } else {
        $scope.selected = [$scope.selected.toString()]
      }

      api
        .query(
          'POST',
          {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.user_response_ivq,
          {},
          {
            qus_id: $scope.qusdata.data.cueData._id,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
            qus_res: $scope.selected.sort(),
            lec_id: $scope.lecture._id,
          }
        )
        .then(function (res) {
          $scope.is_corrected = res.data.data.is_correct
          displayExplanation(res.data.data)
        })
        .catch(function (err) {
          console.log(err)
          if (err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              console.log(res)
              $scope.submitivq()
            })
          }
        })
    }

    // for display explanation after click submit ivq
    var displayExplanation = function (correct_options) {
      angular.element('#overlay').css('display', 'none')
      $scope.selected = null
      $scope.correct_opt = []
      $scope.lst = []
      if ($scope.qusdata.data.cueData.type == 2) {
        $scope.correct_opt.push({
          ans: correct_options.correct_answer[0].text,
          exp: correct_options.correct_answer[0].explanation,
        })
        $scope.showAdvanced()
      } else {
        correct_options.correct_answer.forEach(function (correct_opt) {
          $scope.qusdata.data.cueData.options.forEach(function (opt) {
            if (opt.id == correct_opt.text) {
              $scope.correct_opt.push({
                ans: opt.text,
                exp: correct_opt.explanation,
              })
            }
          })
        })
        $scope.showAdvanced()
      }
    }
    $scope.lst = [] // only for multiple correct options
    $scope.changeCheckbox = function (list, active) {
      if (active) $scope.lst.push(list)
      else $scope.lst.splice($scope.lst.indexOf(list), 1)
      console.log($scope.lst)
    }

    $scope.init = function () {
      angular.element('#overlay').css('display', 'none')
      angular.element('#autostart-overlay').css('display', 'none')
      $scope.$parent.markTopicActive($scope.chapter, $scope.topic)
      if ($scope.course) {
        $scope.activateVideo()
      }
    }
    var setVariables = function (cond) {
      $scope.selected = null
      $scope.correct_opt = null
      $scope.is_corrected = null
      $scope.lst = []
      console.log($scope.selected)
      if (cond == true) {
        // $scope.showContinue = !$scope.showContinue;
        // $scope.hidesubmit = !$scope.hidesubmit ;
      }
    }

    $scope.$on('courseLoaded', function (args, course) {
      $scope.course = course
      $scope.activateVideo()
    })
    $scope.getactive = function () {
      return $scope.lecture.nm
    }
    $scope.$on('$destroy', function () {
      console.log('destriyed re')
      $scope.videoSource = ''
      clearInterval($scope.playerTimer)
      if ($scope.lecture.url.includes('https://player.vimeo.com/')) {
        $scope.player.pause()
      }
      if ($scope.lecture.url.includes('https://www.youtube.com/embed/')) {
        if ($scope.currentT > 60) {
          $scope.cleartimer()
          if ($scope.liveData) {
            $scope.updateLectureStatus(
              $scope.chapter,
              $scope.lecture._id,
              false,
              function () {
                console.log('done')
              }
            )
          } else {
            $scope.updateLectureStatus(
              $scope.chapter,
              $scope.lecture._id,
              true,
              function () {
                console.log('done')
              }
            )
          }
        } //youtube video will be marked completed if a total 1 min watchtime will be completed
        //if video is less than 1 min then it will be instantly marked and timer willl be stopped
        //in case of vimeo we need to get the video above 80% wheather by skipping dragging or watching
        else if ($scope.currentT <= 60) {
          console.log($scope.totalSec)
          if ($scope.totalSec <= 60) {
            console.log('too small')
            $scope.cleartimer()
            if ($scope.liveData) {
              $scope.updateLectureStatus(
                $scope.chapter,
                $scope.lecture._id,
                false,
                function () {
                  console.log('done')
                }
              )
            } else {
              $scope.updateLectureStatus(
                $scope.chapter,
                $scope.lecture._id,
                function () {
                  console.log('done')
                }
              )
            }
          }
        }
        $scope.cleartimer()
      }
    })
    $scope.cleartimer = function () {
      clearInterval($scope.timer)
      timer = null
    }
    $scope.activateVideo = function () {
      $scope.lecture = $scope.course.lectures[$scope.topic]
      if ($scope.lecture) {
        $scope.descriptionAsHtml = $sce.trustAsHtml($scope.lecture.dsc)
      }
      $scope.liveData = false
      if (!$scope.lecture) {
        $scope.liveData = true
        for (var i = 0; i < $scope.course.livlec[$scope.chapter].length; i++) {
          if ($scope.course.livlec[$scope.chapter][i]._id === $scope.topic) {
            $scope.lecture = $scope.course.livlec[$scope.chapter][i]
            $scope.descriptionAsHtml = $sce.trustAsHtml($scope.lecture.dsc)
          }
        }
        if ($scope.lecture.vlen === null || !$scope.lecture.vlen) {
          getLectureLength($scope.lecture._id)
        }
        if ($scope.lecture.recurl.includes('https://vimeo.com/')) {
          $scope.lecture.url = $scope.lecture.recurl
          $scope.videoSource = 'vimeo'
        } else if ($scope.lecture.recurl.includes('https://www.youtube.com/')) {
          $scope.videoSource = 'youtube'
        } else if ($scope.lecture.recurl.includes('https://youtu.be/')) {
          $scope.videoSource = 'youtube'
        }
      } else {
        if ($scope.lecture.url.includes('https://vimeo.com/')) {
          $scope.videoSource = 'vimeo'
        } else if ($scope.lecture.url.includes('https://www.youtube.com/')) {
          $scope.videoSource = 'youtube'
        } else if ($scope.lecture.url.includes('https://youtu.be/')) {
          $scope.videoSource = 'youtube'
        }
      }
      store.currentLectureUrl($scope.lecture._id)
      store.currentactive($scope.lecture)
      if ($scope.lecture.url.includes('https://vimeo.com/')) {
        $scope.lecture.url = $scope.lecture.url.replace(
          'https://vimeo.com/',
          'https://player.vimeo.com/video/'
        )
      } else if ($scope.lecture.url.includes('https://www.youtube.com/')) {
        $scope.lecture.url = $scope.lecture.url.replace(
          'https://www.youtube.com/watch?v=',
          'https://www.youtube.com/embed/'
        )
      } else if ($scope.lecture.url.includes('https://youtu.be/')) {
        $scope.lecture.url = $scope.lecture.url.replace(
          'https://youtu.be/',
          'https://www.youtube.com/embed/'
        )
      }
      $scope.lecture.replacedurl = $sce.trustAsResourceUrl($scope.lecture.url)
      if ($scope.lecture.pdf && $scope.lecture.pdf.length > 0) {
        for (var i = 0; i < $scope.lecture.pdf.length; i++) {
          $scope.getSignedUrl(
            $scope.course.others[$scope.lecture.pdf[i]].url,
            $scope.lecture.pdf[i],
            function (id, res) {
              $scope.course.others[id].signed_url = res.signed_url
            },
            function (err) {
              console.log(err)
            }
          )
        }
      }
      /* 
algo for video marking:
    1> vimeo video
    vimeo video is started.
    vimeo timeupdate event will give timeupdate data on fraction of seconds till video ends
    as video started we store current video in services.store
    now a $scope.updated is maintained to get video is marked or not if marked stop repeated requests to server
    as 80 is reached we will check if this is the same video present in store or else previous video may ge t updated

    2> youtube video
    destroy event is used here
    if we run multiple video multiple timer arises which complex the situation
    so to free memory and kill timer we clearinterval on destroy event
    if video length is greater then 1 min we will consider 1min must watch time
    if it is lower than 1 min video will be marked instantiately.
*/

      if ($scope.lecture.url.includes('https://www.youtube.com/embed/')) {
        if ($scope.videoSource === 'youtube') {
          var video_code = $scope.lecture.url.split('/embed/')[1]
          console.log('video code :', video_code)
          var player_ready = false

          var setPlayer = setTimeout(function () {
            if (player_ready) {
              console.log('player already set', $scope.player)
              clearTimeout(setPlayer)
            } else {
              $scope.player = new YT.Player('player', {
                height: '100%',
                width: '100%',
                videoId: video_code + '',
                events: {
                  onReady: onPlayerReady,
                  onStateChange: onPlayerStateChange,
                },
              })
              function onPlayerReady(event) {
                if ($scope.skptime) {
                  event.target.seekTo($scope.skptime)
                } else {
                  event.target.playVideo()
                }
              }

              function onPlayerStateChange(event) {
                if ($scope.liveData) {
                  $scope.updateLectureStatus(
                    $scope.chapter,
                    $scope.lecture._id,
                    false,
                    function () {
                      console.log('done')
                    }
                  )
                }
                if (event.data == YT.PlayerState.PLAYING) {
                  $scope.playerTimer = setInterval(function () {
                    var tmp_timestamp =
                      Math.floor($scope.player.getCurrentTime()) * 1000
                    $scope.playerTimeStamp = tmp_timestamp
                    document.getElementById('yt-plr-tmstmp').innerText =
                      convertMillisToMinuteAndSeconds(tmp_timestamp)
                  }, 1000)
                } else {
                  clearInterval($scope.playerTimer)
                }
              }
              console.log('player', $scope.player)
            }
          }, 2000)
          onYouTubeIframeAPIReady()
          function onYouTubeIframeAPIReady() {
            console.log(
              'yt iframe ready',
              typeof $scope.videoSource,
              $scope.videoSource
            )
            $scope.player = new YT.Player('player', {
              height: '100%',
              width: '100%',
              videoId: video_code + '',
              events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
              },
            })
            function onPlayerReady(event) {
              console.log('iframe api ready')
              if ($scope.skptime) {
                event.target.seekTo($scope.skptime)
              } else {
                event.target.playVideo()
              }
              player_ready = true
            }

            function onPlayerStateChange(event) {
              console.log('iframe api state change')
              if ($scope.liveData) {
                $scope.updateLectureStatus(
                  $scope.chapter,
                  $scope.lecture._id,
                  false,
                  function () {
                    console.log('done')
                  }
                )
              }
              if (event.data == YT.PlayerState.PLAYING) {
                $scope.playerTimer = setInterval(function () {
                  var tmp_timestamp =
                    Math.floor($scope.player.getCurrentTime()) * 1000
                  $scope.playerTimeStamp = tmp_timestamp
                  document.getElementById('yt-plr-tmstmp').innerText =
                    convertMillisToMinuteAndSeconds(tmp_timestamp)
                }, 1000)
              } else {
                clearInterval($scope.playerTimer)
              }
            }
          }
        }

        if (!$scope.liveData) {
          timea = $scope.lecture.vlen.split(':')
          if (timea.length == 3) {
            hh = parseInt(timea[0])
            mm = parseInt(timea[1])
            ss = parseInt(timea[2])

            $scope.totalSec = hh * 60 * 60 + mm * 60 + ss
          } else if (timea.length == 2) {
            mm = parseInt(timea[0])
            ss = parseInt(timea[1])

            $scope.totalSec = +mm * 60 + ss
          } else {
            ss = parseInt(timea[0])
            $scope.totalSec = ss
          }
        }
        $scope.startTimer = function () {
          if ($scope.timer) {
            clearInterval($scope.timer)
          }
          $scope.timer = setInterval(function () {
            $scope.currentT += 1

            if ($scope.currentT > 60) {
              $scope.cleartimer()
              if ($scope.liveData) {
                $scope.updateLectureStatus(
                  $scope.chapter,
                  $scope.lecture._id,
                  false,
                  function () {
                    console.log('done')
                  }
                )
              } else {
                $scope.updateLectureStatus(
                  $scope.chapter,
                  $scope.lecture._id,
                  true,
                  function () {
                    console.log('done')
                  }
                )
              }
            } else if ($scope.currentT <= 60) {
              if (!$scope.liveData && $scope.totalSec <= 60) {
                console.log('too small')
                $scope.cleartimer()
                if ($scope.liveData) {
                  $scope.updateLectureStatus(
                    $scope.chapter,
                    $scope.lecture._id,
                    false,
                    function () {
                      console.log('done')
                    }
                  )
                } else {
                  $scope.updateLectureStatus(
                    $scope.chapter,
                    $scope.lecture._id,
                    true,
                    function () {
                      console.log('done')
                    }
                  )
                }
              }
            }
          }, 1000)
        }

        $scope.startTimer()
      }

      if ($scope.lecture.url.includes('https://player.vimeo.com/')) {
        var iframe = document.querySelector('iframe')
        //if (!$scope.liveData) {
        $scope.videoSource = 'vimeo'
        console.log('vds:', $scope.videoSource)
        //}
        timerT = setTimeout(function () {
          if ($scope.lecture.url) {
            $scope.player = new Vimeo.Player(document.querySelector('iframe'))
            // console.log("player :", $scope.player);
            $scope.player
              .setCurrentTime($scope.skptime)
              .then(function (seconds) {
                if ($scope.liveData) {
                  $scope.updateLectureStatus(
                    $scope.chapter,
                    $scope.lecture._id,
                    false,
                    function () {
                      console.log('done')
                    }
                  )
                }
              })
              .catch(function (error) {
                console.log('video set currenttime error', error)
              })
            $scope.player.play()

            //if (!$scope.liveData) {
            playerInterval = setInterval(function () {
              $scope.player
                .getDuration()
                .then(function (duration) {
                  $scope.player
                    .getCurrentTime()
                    .then(function (seconds) {
                      $scope.playerTimeStamp = seconds * 1000
                      $scope.playerProgressBar = 100 * (seconds / duration)
                      // document.getElementById('lc-plr-player-pr-bar').value =
                      //   100 * (seconds / duration)
                    })
                    .catch(function (error) {
                      console.error(error)
                    })
                })
                .catch(function (error) {
                  console.error('video get duration error', error)
                })
            }, 1000)
            //}
            $scope.player.on('play', function (data) {
              $scope.videopercent = data.percent
              angular.element('#autostart-overlay').css('display', 'none')
              $scope.topics = []
            })
            $scope.player.on('timeupdate', function (data) {
              if (data.percent >= 0.8) {
                if (!$scope.updated) {
                  if (store.getUrl() == $scope.lecture._id) {
                    if ($scope.liveData) {
                      $scope.updateLectureStatus(
                        $scope.chapter,
                        $scope.lecture._id,
                        false,
                        function () {
                          console.log('done')
                        }
                      )
                    } else {
                      $scope.updateLectureStatus(
                        $scope.chapter,
                        $scope.lecture._id,
                        true,
                        function () {
                          console.log('done')
                        }
                      )
                    }
                  }
                  $scope.updated = true
                  clearTimeout(timerT)
                }
              }
            })
            $scope.player.on('ended', function (data) {
              if ($scope.liveData) {
                $scope.updateLectureStatus(
                  $scope.chapter,
                  $scope.lecture._id,
                  false,
                  function () {
                    console.log('done')
                  }
                )
              } else {
                $scope.updateLectureStatus(
                  $scope.chapter,
                  $scope.lecture._id,
                  true,
                  function () {
                    console.log('done')
                  }
                )
              }
              $scope.updated = true
              exitFullScreen()
              $scope.videopercent = data.percent
              $scope.compileTopicsArray()
              $scope.index = $scope.getCurrentIndex()
              // console.log($scope.index +"______"+$scope.topics.length)
              if (
                $scope.index != -1 &&
                $scope.index + 1 != $scope.topics.length
              ) {
                $scope.getNextTopic()
                $scope.$apply(function () {
                  angular.element('#autostart-overlay').css('display', 'block')
                  $scope.timeForNextVideo = 5
                })
                setTimeout(function () {
                  if ($scope.videopercent == 1) {
                    $scope.playnext()
                  }
                }, 5000)

                $scope.time = 0

                var timer = function () {
                  if ($scope.time < 4) {
                    $scope.time += 1
                    $scope.timeForNextVideo = $scope.timeForNextVideo - 1
                    $interval(timer, 1000)
                  }
                }
                $interval(timer, 1000)
              }
            })
            createCuePoints()
          }
        }, 0)
      }
    }

    var playOn = function (cond, setVariables) {
      console.log('okay')
      setTimeout(function () {
        $scope.$apply(function () {
          $scope.player.play().then(function () {
            setVariables(cond)
          })
        })
      }, 500)
    }

    $scope.playnext = function () {
      $scope.videopercent = 0
      $rootScope.$emit('playnext', {})
    }

    $scope.compileTopicsArray = function () {
      console.log($scope.course)
      for (var i = 0; i < $scope.course.chapters.length; i++) {
        for (var j = 0; j < $scope.course.chapters[i].lec.length; j++) {
          var lecture = $scope.course.chapters[i].lec[j]
          $scope.topics.push({
            id: lecture,
            lect_name: $scope.course.lectures[lecture].nm,
            type: 'lecture',
            chapter: $scope.course.chapters[i]._id,
            chp_name: $scope.course.chapters[i].nm,
            parent: '',
          })
          for (
            var k = 0;
            k < $scope.course.lectures[lecture].quiz.length;
            k++
          ) {
            $scope.topics.push({
              id: $scope.course.lectures[lecture].quiz[k],
              chapter: $scope.course.chapters[i]._id,
              chp_name: $scope.course.chapters[i].nm,
              type: 'quiz',
              parent: lecture,
            })
          }
          for (
            var l = 0;
            l < $scope.course.lectures[lecture].asgn.length;
            k++
          ) {
            $scope.topics.push({
              id: $scope.course.lectures[lecture].asgn[l],
              chapter: $scope.course.chapters[i]._id,
              chp_name: $scope.course.chapters[i].nm,
              type: 'assignment',
              parent: lecture,
            })
          }
        }
        for (var k = 0; k < $scope.course.chapters[i].quiz.length; k++) {
          $scope.topics.push({
            id: $scope.course.chapters[i].quiz[k],
            quiz_name:
              $scope.course.quizzes[$scope.course.chapters[i].quiz[k]].nm,
            type: 'quiz',
            chapter: $scope.course.chapters[i]._id,
            chp_name: $scope.course.chapters[i].nm,
            parent: '',
          })
        }
        for (var l = 0; l < $scope.course.chapters[i].asgn.length; l++) {
          $scope.topics.push({
            id: $scope.course.chapters[i].asgn[l],
            asgn_name:
              $scope.course.assignments[$scope.course.chapters[i].asgn[l]].nm,
            type: 'assignment',
            chapter: $scope.course.chapters[i]._id,
            chp_name: $scope.course.chapters[i].nm,
            parent: '',
          })
        }
      }
    }

    $scope.getCurrentIndex = function () {
      for (var i = 0; i < $scope.topics.length; i++) {
        if ($scope.topics[i].id == $scope.lecture._id) {
          return i
        }
      }
      return -1 //not found
    }

    $scope.getNextTopic = function () {
      if (!$scope.topics || !$scope.topics[$scope.index + 1]) {
        return
      }

      var nextTopic = $scope.topics[$scope.index + 1]
      if (nextTopic.type == 'lecture') {
        ;($scope.autostartchaptername = nextTopic.chp_name),
          ($scope.autostartlecturename = nextTopic.lect_name)
      } else if (nextTopic.type == 'assignment') {
        ;($scope.autostartchaptername = nextTopic.chp_name),
          ($scope.autostartassignmentname = nextTopic.asgn_name)
      } else if (nextTopic.type == 'quiz') {
        ;($scope.autostartchaptername = nextTopic.chp_name),
          ($scope.autostartquizname = nextTopic.quiz_name)
      } else {
        console.log('invalid id')
      }
    }

    function exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(function (err) {})
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen().catch(function (err) {})
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen().catch(function (err) {})
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen().catch(function (err) {})
      }
    }

    var createCuePoints = function () {
      var i
      if ($scope.lecture.ivqs === undefined) {
        return
      }
      for (i = 0; i < $scope.lecture.ivqs.ques.length; i++) {
        $scope.player.addCuePoint($scope.lecture.ivqs.cuetime[i].cue_time, {
          cueData: $scope.lecture.ivqs.ques[i],
        })
      }
      setCuePoints()
    }

    var setCuePoints = function () {
      $scope.player.on('cuepoint', function (data) {
        $scope.qusdata = data
        exitFullScreen()
        $scope.player.pause().then(function () {
          setTimeout(function () {
            $scope.$apply(function () {
              angular.element('#overlay').css('display', 'block')
            })
          }, 200)
        })
      })
    }

    $scope.getSignedUrl = function (
      url,
      resource,
      successCallback,
      failureCallback
    ) {
      api
        .query(
          'GET',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.get_signed_url,
          {
            m_url: url,
            g_id: $scope.gid,
            p_id: $stateParams.pid,
            tokn: $cookies.get('at'),
          },
          {}
        )
        .then(function (res) {
          console.log(res)
          successCallback(resource, res.data.data)
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.getSignedUrl(url)
            })
          }
          failureCallback(err)
        })
    }

    $scope.updateLectureStatus = function (chapter_id, lecture_id, video) {
      console.log('updateLectureStatus invoke::')
      if (video) {
        api
          .query(
            'POST',
            {
              'x-access-crs-token': $cookies.get('crs_tkn'),
            },
            constants.chapter_lecture_status,
            {},
            {
              crs_id: $stateParams.cid,
              cp_id: chapter_id,
              lc_id: lecture_id,
              p_id: $stateParams.pid,
              a_id: $cookies.get('aid'),
            }
          )
          .then(function (res) {})
          .catch(function (err) {
            console.log(err)
            if (err.status && err.status == 498 && err.data.code == 4100) {
              api.getAccessToken().then(function (res) {
                $scope.updateChapterStatus(chapter._id)
              })
            }
          })
      } else {
        api
          .query(
            'POST',
            {
              'x-access-crs-token': $cookies.get('crs_tkn'),
            },
            constants.chapter_live_lecture_status,
            {},
            {
              crs_id: $stateParams.cid,
              cp_id: chapter_id,
              liv_lec_id: lecture_id,
              p_id: $stateParams.pid,
              a_id: $cookies.get('aid'),
            }
          )
          .then(function (res) {})
          .catch(function (err) {
            console.log(err)
            if (err.status && err.status == 498 && err.data.code == 4100) {
              api.getAccessToken().then(function (res) {
                $scope.updateChapterStatus(chapter._id)
              })
            }
          })
      }
    }

    $scope.updateLStatus = function (chapter_id, lecture_id) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.chapter_lecture_status,
          {},
          {
            crs_id: $stateParams.cid,
            cp_id: chapter_id,
            lc_id: lecture_id,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {})
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.updateChapterStatus(chapter._id)
            })
          }
        })
    }
    $scope.showAdvanced = function () {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'dialog1.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        resolve: {
          data: function () {
            return {
              correct_options: $scope.correct_opt,
              is_corrected: $scope.is_corrected,
            }
          },
        },
      })
    }

    function DialogController($scope, data, $mdDialog) {
      console.log('dialog')
      $scope.correct_opt = data.correct_options
      $scope.is_corrected = data.is_corrected
      $scope.continue = function () {
        $mdDialog.hide()
        playOn(true, setVariables)
      }
    }

    $scope.getBookmarks = function () {
      $scope.closeAddBookmark()
      getLectureBookmarks($scope.lecture._id)
      getChapterBookmarks($scope.cid)
    }

    $scope.openAddBookmark = function () {
      if ($scope.videoSource == 'vimeo') {
        $scope.player.pause()
      } else if ($scope.videoSource === 'youtube') {
        $scope.player.pauseVideo()
      }
      $scope.addnewBk = true
    }
    $scope.closeAddBookmark = function () {
      $scope.addnewBk = false
    }
    $scope.saveAddBookmark = function (value) {
      console.log(
        'save bookmarks',
        $scope.lecture._id,
        $scope.playerTimeStamp,
        value
      )
      updateLectureBookmarks($scope.lecture._id, $scope.playerTimeStamp, value)
    }
    $scope.closeEditBookmark = function () {
      $scope.editBk = false
      $scope.selectedBkIndex = -1
      $scope.getBookmarks()
    }
    $scope.saveEditBookmark = function (index) {
      $scope.editBk = false
      updateLectureBookmarks(
        $scope.lecture._id,
        $scope.lecture_bookmarks[index].millis,
        $scope.lecture_bookmarks[index].note
      )
      $scope.getBookmarks()
    }
    $scope.editBookmark = function (index) {
      // console.log("index :", index);
      $scope.editBk = true
      $scope.selectedBkIndex = index
    }
    $scope.openDeleteBookmark = function (index) {
      // console.log("open delete bk" , $scope.openDeleteBkModal);
      $scope.selectedBkIndex = index
      $scope.openDeleteBkModal = true
    }
    $scope.closeDeleteBookmark = function () {
      // console.log("close delete bk");
      $scope.selectedBkIndex = -1
      $scope.openDeleteBkModal = false
    }
    $scope.deleteBookmark = function () {
      deleteLectureBookmarks(
        $scope.lecture_bookmarks[$scope.selectedBkIndex].lec_id,
        $scope.lecture_bookmarks[$scope.selectedBkIndex]._id
      )
    }

    var deleteLectureBookmarks = function (lecture_id, bookmark_id) {
      api
        .query(
          'PUT',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.remove_bookmark,
          {},
          {
            lec_id: lecture_id,
            a_id: $cookies.get('aid'),
            bkmrk_id: bookmark_id,
          }
        )
        .then(function (res) {
          // console.log("bookmark deleted :", res);
          $scope.lecture_bookmarks.splice($scope.selectedBkIndex, 1)
          $scope.openDeleteBkModal = false
        })
        .catch(function (err) {
          console.eror('error bookmark :', err)
        })
    }

    var getLectureBookmarks = function (lecture_id) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.get_lecture_bookmarks,
          {},
          {
            lec_id: lecture_id,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log('getbookmark res :', res.data.data)
          $scope.selected_lecture_bookmarks = res.data.data ? res.data.data : []
          $scope.lecture_bookmarks = res.data.data ? res.data.data : []
          $scope.selected_lecture_bookmarks.sort(function (a, b) {
            var first = new Date(a.updatedAt)
            var second = new Date(b.updatedAt)
            if (first < second) {
              return 1
            }
            if (first > second) {
              return -1
            }
            return 0
          })
        })
        .catch(function (err) {
          console.error(err)
        })
    }
    var getChapterBookmarks = function (chapter_id) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.get_chapter_bookmarks,
          {},
          {
            c_id: chapter_id,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {
          console.log('get chapter bk res :', res.data.data)
          $scope.chapter_bookmarks = res.data.data ? res.data.data : []
          $scope.chapter_bookmarks.sort(function (a, b) {
            var first = new Date(a.updatedAt)
            var second = new Date(b.updatedAt)
            if (first < second) {
              return 1
            }
            if (first > second) {
              return -1
            }
            return 0
          })
        })
        .catch(function (err) {
          console.error(err)
        })
    }
    var updateLectureBookmarks = function (lecture_id, millis, note) {
      api
        .query(
          'PUT',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.update_bookmarks,
          {},
          {
            lec_id: lecture_id,
            a_id: $cookies.get('aid'),
            millis: millis,
            note: note,
          }
        )
        .then(function (res) {
          $scope.playerPlayPause()
          $scope.playerPlayPause()
          console.log('bookmark saved :', res)
          $scope.addnewBk = false
          $scope.getBookmarks()
        })
        .catch(function (err) {
          console.error('error bookmark :', err)
        })
    }

    var getLectureLength = function (lecture_id) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.get_lecture_duration,
          {},
          {
            lec_id: lecture_id,
          }
        )
        .then(function (res) {
          console.log('With time res :', res.data.data)
          //$scope.lecture = res.data.data
        })
        .catch(function (err) {
          console.error(err)
        })
    }

    $scope.playerPlayPause = function () {
      $scope.playerPlay = !$scope.playerPlay
      if (!$scope.playerPlay) {
        if ($scope.videoSource === 'vimeo') {
          console.log('player :', $scope.player)
          $scope.player.play()
        } else if ($scope.videoSource === 'youtube') {
          $scope.player.playVideo()
        }
      } else {
        if ($scope.videoSource === 'vimeo') {
          console.log('player :', $scope.player)
          $scope.player.pause()
        } else if ($scope.videoSource === 'youtube') {
          $scope.player.pauseVideo()
        }
      }
    }
    $scope.playerMuteUnmute = function () {
      $scope.playerMute = !$scope.playerMute
      if ($scope.videoSource == 'vimeo') {
        if ($scope.playerMute) {
          $scope.player
            .setVolume(0)
            .then(function (volume) {
              // volume was set
            })
            .catch(function (error) {
              console.error(error)
            })
        } else {
          $scope.player
            .setVolume(1)
            .then(function (volume) {
              // volume was set
            })
            .catch(function (error) {
              console.error(error)
            })
        }
      } else if ($scope.videoSource == 'youtube') {
        $scope.playerMute ? $scope.player.unMute() : $scope.player.mute()
      }
    }
    $scope.playerFullScreen = function () {
      //   $scope.playerFullScreen = !$scope.playerFullScreen;

      $scope.player.requestFullscreen()

      //   if (!$scope.playerFullScreen) {
      //     $scope.player.requestFullscreen();
      //   } else {
      //     $scope.player.exitFullScreen();
      //   }
    }
    $scope.handlePlayerInputChange = function (selectedValue) {
      $scope.player
        .getDuration()
        .then(function (duration) {
          // duration = the duration of the video in seconds
          var value = duration * (selectedValue / 100)
          $scope.playerProgressBar = selectedValue

          $scope.player
            .setCurrentTime(value)
            .then(function (seconds) {})
            .catch(function (error) {
              console.log('video set currenttime error', error)
            })
        })
        .catch(function (error) {
          console.error('video set duration error', error)
        })
    }
    $scope.millisToMinutesAndSeconds = function (millis) {
      return convertMillisToMinuteAndSeconds(millis)
    }

    $scope.bookmarkSort = function (value) {
      $scope.lecture_bookmarks.sort(function (a, b) {
        var first = new Date(a.updatedAt)
        var second = new Date(b.updatedAt)
        if (value === 'smr') {
          if (first < second) {
            return 1
          }
          if (first > second) {
            return -1
          }
        } else if (value === 'sbo') {
          if (first < second) {
            return -1
          }
          if (first > second) {
            return 1
          }
        }
        return 0
      })
    }
    $scope.bookmarkFilter = function (value) {
      if (value == 'clc') {
        $scope.lecture_bookmarks = $scope.selected_lecture_bookmarks
      } else if (value == 'alc') {
        $scope.lecture_bookmarks = $scope.chapter_bookmarks
      }
    }
    $scope.skipVideo = function (time) {
      var selected_time = time / 1000
      console.log('seek to :', time)
      if ($scope.videoSource == 'vimeo') {
        $scope.player
          .setCurrentTime(selected_time)
          .then(function (seconds) {})
          .catch(function (error) {
            console.log('video set currenttime error', error)
          })
      } else if ($scope.videoSource == 'youtube') {
        $scope.player.seekTo(selected_time)
      }
    }

    var convertMillisToMinuteAndSeconds = function (millis) {
      var minutes = Math.floor(millis / 60000)
      var seconds = ((millis % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    }

    $scope.init()
  },
])
var oauthController = angular.module('oauthController', [, 'apiService'])

oauthController.controller('oauthController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  'superCache',
  '$cookies',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    cache,
    $cookies
  ) {
    var vm = this

    vm.pid = $stateParams.pid
    vm.gid = $stateParams.gid
    vm.cid = $stateParams.cid
    vm.aid = $stateParams.aid
    vm.at = $stateParams.at
    vm.rt = $stateParams.rt
    vm.secret = $stateParams.secret
    vm.isLoggedIn = $stateParams.isLoggedIn

    vm.init = function () {
      store.storeCookie('aid', vm.aid)
      store.storeCookie('at', vm.at)
      store.storeCookie('rt', vm.rt)
      store.storeCookie('secret', vm.secret)
      store.storeCookie('isLoggedIn', vm.isLoggedIn)
      $location.path('/course/' + vm.pid + '/' + vm.gid + '/' + vm.cid)
    }

    vm.init()
  },
])
var quizController = angular.module('quizController', ['apiService'])

quizController.controller('quizController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  '$cookies',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    $cookies
  ) {
    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid
    $scope.topic = $stateParams.topic
    $scope.chapter = $stateParams.chid
    $scope.quiz_url = constants.quiz_user_url

    $scope.init = function () {
      $scope.$parent.markTopicActive($scope.chapter, $scope.topic)
      if ($scope.course) {
        $scope.activateQuiz()
      }
    }

    $scope.$on('courseLoaded', function (args, course) {
      $scope.course = course
      $scope.activateQuiz()
    })

    $scope.activateQuiz = function () {
      $scope.quiz = $scope.course.quizzes[$scope.topic]
      store.currentactive($scope.quiz)
      console.log($scope.quiz)
      $scope.quiz.enable = false
      $scope.getQuizPluginIdentifier()
      if ($scope.$parent.topics.length > 0) {
        $scope.$parent.doIhaveAParent(
          function (parent) {
            $scope.updateLectureQuizStatus(
              $scope.chapter,
              $scope.quiz._id,
              parent
            )
          },
          function () {
            $scope.updateQuizStatus($scope.chapter, $scope.quiz._id)
          }
        )
      }
    }

    $scope.getQuizPluginIdentifier = function () {
      api
        .query(
          'POST',
          {},
          constants.get_plugin_identifier,
          {},
          {
            p_id: $stateParams.pid,
            g_id: $stateParams.gid,
            pl_id: $scope.quiz.plid,
            tokn: $cookies.get('at'),
            quizId: $scope.quiz._id,
            type: 1,
          }
        )
        .then(function (res) {
          $scope.quiz.u_idnt = res.data.data.u_idnt
          $scope.quiz.enable = true
        })
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.init()
            })
          }
        })
    }

    $scope.updateLectureQuizStatus = function (chapter_id, quiz_id, lecture) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.lecture_quiz_status,
          {},
          {
            crs_id: $stateParams.cid,
            cp_id: chapter_id,
            lc_id: lecture,
            qz_id: quiz_id,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {})
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.updateLectureQuizStatus(chapter_id, quiz_id, lecture)
            })
          }
        })
    }

    $scope.updateQuizStatus = function (chapter_id, quiz_id) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.chapter_quiz_status,
          {},
          {
            crs_id: $stateParams.cid,
            cp_id: chapter_id,
            qz_id: quiz_id,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
          }
        )
        .then(function (res) {})
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken().then(function (res) {
              $scope.updateQuizStatus(chapter_id, quiz_id)
            })
          }
        })
    }

    $scope.startQuiz = function () {
      // $scope.url="https://examf.pathshala.eckovation.com/#/list/test/"+$scope.quiz.tid+"?uid="+$scope.quiz.u_idnt+"&plid="+$scope.quiz.plid;
      // if(window.NODE_ENV == "debug"){
      //    	$scope.url="https://examft.pathshala.eckovation.com/#/list/test/"+$scope.quiz.tid+"?uid="+$scope.quiz.u_idnt+"&plid="+$scope.quiz.plid;
      //    }
      $scope.url =
        $scope.quiz_url +
        '/#/list/test/' +
        $scope.quiz.tid +
        '?uid=' +
        $scope.quiz.u_idnt +
        '&plid=' +
        $scope.quiz.plid
      window.open($scope.url, '_blank')
    }

    $scope.init()
  },
])
var scormController = angular.module('scormController', ['apiService'])
scormController.controller('scormController', [
  '$scope',
  '$rootScope',
  'ngProgressFactory',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  '$cookies',
  '$sce',
  function (
    $scope,
    $rootScope,
    ngProgressFactory,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    $cookies,
    $sce
  ) {
    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid
    $scope.topic = $stateParams.topic
    $scope.chapter = $stateParams.chid

    $scope.init = function () {
      $scope.$parent.markTopicActive($scope.chapter, $scope.topic)
      if ($scope.course) {
        $scope.activateScorm()
      }
    }

    $scope.$on('courseLoaded', function (args, course) {
      $scope.course = course
      $scope.activateScorm()
    })

    $scope.playerFullScreen = function () {
      var docEl = document.querySelector('iframe')
      docEl.requestFullscreen()
      docEl.webkitRequestFullscreen()
      docEl.mozRequestFullScreen()
      docEl.msRequestFullscreen()
    }

    $scope.activateScorm = function () {
      $scope.scorm = $scope.course.scorm[$scope.topic]
      $scope.descriptionAsHtml = $sce.trustAsHtml($scope.scorm.dsc)
      store.currentactive($scope.scorm)
      console.log('scorm stuff', $scope.scorm, $scope.course)
      var API_URL =
        window.NODE_ENV && window.NODE_ENV == 'debug'
          ? constants.development_url
          : constants.production_url

      var params = new URLSearchParams({
        courseId: $stateParams.cid,
        chapterId: $stateParams.chid,
        scormId: $scope.scorm._id,
        pid: $stateParams.pid,
        aid: $cookies.get('aid'),
        crs: $cookies.get('crs_tkn'),
      })
      $scope.scorm.scormHTML = API_URL + '/scorm/' + $scope.topic + '/gt_scorm'
      $scope.scorm.scormHTML += '?' + params.toString()

      window.addEventListener(
        'message',
        function (event) {
          var status = event.data
          if (status['lesson_status'] != undefined) {
            if (
              status['lesson_status'] == 'completed' ||
              status['lesson_status'] == 'passed'
            )
              $scope.scormCompleted(status['dump'])
            console.log(status['lesson_status'])
            console.log(status['dump'])
          } else if (status['action'] != undefined) {
            if (
              status['action'] == 'exit' &&
              this.document.fullscreenElement != null
            ) {
              this.document.exitFullscreen()
            }
          }
        },
        false
      )
    }

    $scope.scormCompleted = function (dump) {
      api
        .query(
          'POST',
          {
            'x-access-crs-token': $cookies.get('crs_tkn'),
          },
          constants.chapter_scorm_status,
          {},
          {
            crs_id: $stateParams.cid,
            cp_id: $stateParams.chid,
            scorm_id: $scope.scorm._id,
            p_id: $stateParams.pid,
            a_id: $cookies.get('aid'),
            dump: JSON.stringify(dump),
          }
        )
        .then(function (res) {})
        .catch(function (err) {
          console.log(err)
          if (err.status && err.status == 498 && err.data.code == 4100) {
            api.getAccessToken()
          }
        })
    }

    $scope.init()
  },
])

scormController.config([
  '$sceProvider',
  function ($sceProvider) {
    $sceProvider.enabled(false)
  },
])
var socailRedirectController = angular.module('socailRedirectController', [
  'apiService',
])

socailRedirectController.controller('socailRedirectController', [
  '$scope',
  'apiService',
  'store',
  '$location',
  '$state',
  'constants',
  '$stateParams',
  'Upload',
  '$rootScope',
  'superCache',
  '$cookies',
  function (
    $scope,
    api,
    store,
    $location,
    $state,
    constants,
    $stateParams,
    $upload,
    $rootScope,
    cache,
    $cookies
  ) {
    $scope.socialLoader = true

    $scope.safeApply = function (fn) {
      var phase = this.$root.$$phase
      if (phase == '$apply' || phase == '$digest') {
        if (fn && typeof fn === 'function') {
          fn()
        }
      } else {
        this.$apply(fn)
      }
    }

    var search = window.location.search.substring(1)
    try {
      $scope.query = JSON.parse(
        '{"' +
          decodeURI(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      )
    } catch (err) {
      $scope.query = {}
    }

    $scope.pid = $stateParams.pid
    $scope.gid = $stateParams.gid
    $scope.cid = $stateParams.cid
    $scope.i_paid = false
    $scope.r_dsp = false
    $scope.topics = {}

    //---Social Link---//
    $scope.gh_url = null
    $scope.fb_url = null
    $scope.ln_url = null
    $scope.isSocCon = false
    //-----------------//

    $scope.init = function () {
      $scope.saveSocailLoginDetail()
    }

    $scope.saveSocailLoginDetail = function () {
      var data = {
        aid: $cookies.get('aid'),
      }
      if ($scope.query.type === 'github') {
        if (typeof $scope.query.code !== 'string') {
          return
        }
        data.code = $scope.query.code
        return postRequest()
      }
      function postRequest() {
        api
          .query(
            'POST',
            {
              'x-access-crs-token': $cookies.get('crs_tkn'),
            },
            constants.auth_github,
            {},
            data
          )
          .then(function (res) {
            var url = (
              window.location.origin +
              '/' +
              window.location.hash
            ).replace('/certificate/social_redirect/', '/certificate/social/')
            window.location.replace(url)
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    }

    $scope.init()
  },
])
;('use strict')

var apiService = angular.module('apiService', [])

apiService.factory('apiService', [
  '$http',
  '$q',
  'constants',
  '$cookies',
  'store',
  function apiService($http, $q, constants, $cookies, store) {
    var service = {
      query: query,
      formQuery: formQuery,
      getAccessToken: getAccessToken,
    }

    return service

    function query(method, headers, url, params, data) {
      var deferred = $q.defer()

      var API_URL =
        window.NODE_ENV && window.NODE_ENV == 'debug'
          ? constants.development_url
          : constants.production_url

      $http({
        method: method,
        headers: headers,
        url: API_URL + url,
        params: params,
        data: data,
      }).then(
        function (data) {
          if (!data.config) {
            console.log('Server error occured.')
          }
          deferred.resolve(data)
        },
        function (error) {
          deferred.reject(error)
        }
      )

      return deferred.promise
    }

    function getAccessToken() {
      var deferred = $q.defer()

      var API_URL =
        window.NODE_ENV && window.NODE_ENV == 'debug'
          ? constants.development_url
          : constants.production_url

      $http({
        method: 'POST',
        url: API_URL + constants.get_at,
        data: {
          a_id: $cookies.get('aid'),
          d_id: window.fingerprint.md5hash,
          at: $cookies.get('at'),
          cl: 'W',
          rt: $cookies.get('rt'),
          k_ey: $cookies.get('secret'),
        },
      }).then(
        function (data) {
          if (!data.config) {
            console.log('Server error occured.')
          }
          console.log(data)
          console.log('reset access token', data)
          // $cookies.put('at',data.data.data.at,{domain : '.eckovation.com' }); // keep secure : true
          store.storeCookie('at', data.data.data.at)
          deferred.resolve(data)
        },
        function (error) {
          if (error.status == 498 && error.data.code == 4800) {
            window.open('https://www.eckovation.com/', '_self')
          }
          deferred.reject(error)
        }
      )

      return deferred.promise
    }

    function formQuery(method, headers, url, params, data) {
      var deferred = $q.defer()

      var API_URL =
        window.NODE_ENV && window.NODE_ENV == 'debug'
          ? constants.development_url
          : constants.production_url

      $http({
        method: method,
        url: API_URL + url,
        headers: headers,
        params: params,
        transformRequest: function (obj) {
          var str = []
          for (var p in obj)
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
          return str.join('&')
        },
        data: data,
      }).then(
        function (data) {
          if (!data.config) {
            console.log('Server error occured.')
          }
          deferred.resolve(data)
        },
        function (error) {
          deferred.reject(error)
        }
      )

      return deferred.promise
    }
  },
])

;(function (angular) {
  'use strict'

  var app = angular.module('angular-progress-arc', [])

  app.provider('progressArcDefaults', function () {
    var defaults = {
      size: 200,
      strokeWidth: 20,
      stroke: 'black',
      background: null,
    }

    this.setDefault = function (name, value) {
      defaults[name] = value
      return this
    }

    this.$get = function () {
      return function (attr) {
        angular.forEach(defaults, function (value, key) {
          if (!attr[key]) {
            attr[key] = value
          }
        })
      }
    }
  })

  app.directive('progressArc', [
    'progressArcDefaults',
    function (progressArcDefaults) {
      return {
        restrict: 'E',
        scope: {
          size: '@', // Size of element in pixels.
          strokeWidth: '@', // Width of progress arc stroke.
          stroke: '@', // Color/appearance of stroke.
          stopStroke: '@', // Color/appearance of stroke.
          stopComplete: '&', // Color/appearance of stroke.
          counterClockwise: '@', // Boolean value indicating
          complete: '&', // Expression evaluating to float [0.0, 1.0]
          background: '@', // Color of the background ring. Defaults to null.
        },
        compile: function (element, attr) {
          progressArcDefaults(attr)

          return function (scope, element, attr) {
            // Firefox has a bug where it doesn't handle rotations and stroke dashes correctly.
            // https://bugzilla.mozilla.org/show_bug.cgi?id=949661
            scope.offset = /firefox/i.test(navigator.userAgent) ? -89.9 : -90
            var updateRadius = function () {
              scope.strokeWidthCapped = Math.min(
                scope.strokeWidth,
                scope.size / 2 - 1
              )
              scope.radius = Math.max(
                (scope.size - scope.strokeWidthCapped) / 2 - 1,
                0
              )
              scope.circumference = 2 * Math.PI * scope.radius
            }
            scope.$watchCollection('[size, strokeWidth]', updateRadius)
            updateRadius()
          }
        },
        template:
          '<svg ng-attr-width="{{size}}" ng-attr-height="{{size}}">' +
          '<circle class="ngpa-background" fill="none" ' +
          'ng-if="background" ' +
          'ng-attr-cx="{{size/2}}" ' +
          'ng-attr-cy="{{size/2}}" ' +
          'ng-attr-r="{{radius}}" ' +
          'ng-attr-stroke="{{background}}" ' +
          'ng-attr-stroke-width="{{strokeWidthCapped}}"' +
          '/>' +
          '<circle class="ngpa-progress" fill="none" ' +
          'ng-attr-cx="{{size/2}}" ' +
          'ng-attr-cy="{{size/2}}" ' +
          'ng-attr-r="{{radius}}" ' +
          'ng-attr-stroke="{{stroke}}" ' +
          'ng-attr-stroke-width="{{strokeWidthCapped}}"' +
          'ng-attr-stroke-dasharray="{{circumference}}"' +
          'ng-attr-stroke-dashoffset="{{(1 - complete()) * circumference}}"' +
          'ng-attr-transform="rotate({{offset}}, {{size/2}}, {{size/2}})' +
          "{{ (counterClockwise && counterClockwise != 'false') ? ' translate(0, ' + size + ') scale(1, -1)' : '' }}\"" +
          '/>' +
          '<circle class="ngpa-progress" fill="none" ' +
          'ng-attr-cx="{{size/2}}" ' +
          'ng-attr-cy="{{size/2}}" ' +
          'ng-attr-r="{{radius}}" ' +
          'ng-attr-stroke="{{stopStroke}}" ' +
          'ng-attr-stroke-width="{{strokeWidthCapped}}"' +
          'ng-attr-stroke-dasharray="{{circumference}}"' +
          'ng-attr-stroke-dashoffset="{{(1 - stopComplete()) * circumference}}"' +
          'ng-attr-transform="rotate({{offset}}, {{size/2}}, {{size/2}})' +
          "{{ (counterClockwise && counterClockwise != 'false') ? ' translate(0, ' + size + ') scale(1, -1)' : '' }}\"" +
          '/>' +
          '</svg>',
      }
    },
  ])
})(window.angular)
;('use strict')

var store = angular.module('store', [])

store.factory('store', [
  '$http',
  '$q',
  'constants',
  '$cookies',
  function store($http, $q, constants, $cookies) {
    var course = {}
    var address = {}
    var status = {}
    var link = {}
    var currentactUrl = {}
    var a = false
    var currentact = { nm: 'FirstTime' }
    var service = {
      storeCookie: storeCookie,
      storeAdd: storeAdd,
      getAddress: getAddress,
      storeStatus: storeStatus,
      getStatus: getStatus,
      currentactive: currentactive,
      getactive: getactive,
      savelaststate: savelaststate,
      getstate: getstate,
      changestate: changestate,
      currentLectureUrl: currentLectureUrl,
      getUrl: getUrl,
      getBreadCrumbs: getBreadCrumbs,
      setBreadCrumbs: setBreadCrumbs,
      getFeedbacks: getFeedbacks,
      setFeedbacks: setFeedbacks,
    }
    var breadCrumbs = []
    var feedbacks = []
    return service

    function getBreadCrumbs() {
      return breadCrumbs
    }
    function setBreadCrumbs(arr) {
      breadCrumbs = arr
      return breadCrumbs
    }
    function getFeedbacks() {
      return feedbacks
    }
    function setFeedbacks(arr) {
      feedbacks = arr
      return feedbacks
    }
    function savelaststate() {
      a = true
    }
    function getstate() {
      return a
    }
    function changestate() {
      a = false
      return a
    }
    function currentactive(active) {
      currentact.nm = active.nm
    }
    function currentLectureUrl(url) {
      currentactUrl.url = url
    }
    function getUrl(url) {
      return currentactUrl.url
    }

    function getactive() {
      return currentact.nm.toString()
    }

    function storeStatus(check) {
      status.status = check
    }
    function getStatus() {
      return status.status
    }

    function storeAdd(object) {
      address.add1 = object.adrs1
      address.add2 = object.adrs2
      address.addcity = object.adrs_cty
      address.addstate = object.adrs_ste
      address.addcountry = object.adrs_cnty
      address.zip = object.adrs_p_code
    }
    function getAddress() {
      return address
    }

    function storeCookie(name, value) {
      var expiredate = new Date()
      expiredate.setDate(expiredate.getDate() + 180)

      const NODE_ENV = window.NODE_ENV ? window.NODE_ENV : ''
      const BUILD_ENV = window.BUILD_ENV ? window.BUILD_ENV : 'local'

      if (
        (NODE_ENV == 'production' && BUILD_ENV == 'testing') ||
        window.location.href.search('pegasust.imarticus') != -1
      ) {
        if ($cookies.get(name, { domain: 'pegasust.imarticus.org' })) {
          $cookies.remove(name)
        }
        //testing
        $cookies.put(name, value, {
          expires: expiredate,
          domain: '.imarticus.org',
        })
      } else if (
        (NODE_ENV == 'production' && BUILD_ENV == 'staging') ||
        window.location.href.search('pegasuss.imarticus') != -1
      ) {
        if ($cookies.get(name, { domain: 'pegasuss.imarticus.org' })) {
          $cookies.remove(name)
        }
        //production
        $cookies.put(name, value, {
          expires: expiredate,
          domain: '.imarticus.org',
        })
      } else if (
        (NODE_ENV == 'production' && BUILD_ENV == 'production') ||
        window.location.href.search('pegasus.imarticus') != -1
      ) {
        if ($cookies.get(name, { domain: 'pegasus.imarticus.org' })) {
          $cookies.remove(name)
        }
        //production
        $cookies.put(name, value, {
          expires: expiredate,
          domain: '.imarticus.org',
        })
      } else {
        if ($cookies.get(name, { domain: '.imarticus.org' })) {
          $cookies.remove(name)
        }
        //local
        $cookies.put(name, value, { domain: 'localhost', expires: expiredate })
      }
    }
  },
])
;('use strict')
FreshworksWidget('hide', 'launcher')
var eckPlug = angular.module('eckPlug', [
  'ui.router',
  'ui.bootstrap',
  'videosharing-embed',
  'ngProgress',
  'ngAnimate',
  'ngSanitize',
  'ngCookies',
  'ngAlertify',
  'ng.deviceDetector',
  'highcharts-ng',
  'apiService',
  'MainCtrl',
  'store',
  'homeController',
  'courseController',
  'angular-progress-arc',
  'angular-loading-bar',
  'lectureController',
  'quizController',
  'scormController',
  'assignmentController',
  'chapterController',
  'gradebookController',
  'certificateController',
  'socailRedirectController',
  'ngFileUpload',
  'rzModule',
  'StatusCtrl',
  'oauthController',
  'docLectureController',
  'certificateViewController',
])

function getParameterByName(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

eckPlug.config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('home')

    $stateProvider
      .state('topics', {
        url: '/:pid/:gid/topics',
        templateUrl: 'views/topics.html',
        controller: 'topicsController',
      })
      .state('home', {
        url: '/home/:pid/:gid/',
        templateUrl: 'views/home.html',
        controller: 'homeController',
      })
      .state('certiview', {
        url: '/certificate/:pid/:cid/',
        templateUrl: 'views/certificateview.html',
        controller: 'certificateViewController',
      })
      .state('gradebook', {
        url: '/gradebook/:pid/:gid/:cid',
        templateUrl: 'views/gradebook.html',
        controller: 'gradebookController',
      })
      .state('course', {
        url: '/course/:pid/:gid/:cid/:levelId',
        templateUrl: 'views/course.html',
        controller: 'courseController',
      })
      .state('course2', {
        url: '/course/:pid/:gid/:cid/undefined',
        templateUrl: 'views/course.html',
        controller: 'courseController',
      })
      .state('chapter', {
        abstract: true,
        url: '/chapter/:pid/:gid/:cid/:levelId',
        templateUrl: 'views/chapter.html',
        controller: 'chapterController',
      })
      .state('chapter.lecture', {
        parent: 'chapter',
        templateUrl: 'views/lecture.html',
        url: '/lecture/:chid/:topic/:skptm',
        controller: 'lectureController',
      })
      .state('chapter.doc_lecture', {
        parent: 'chapter',
        templateUrl: 'views/docLecture.html',
        url: '/docLecture/:chid/:topic/:skptm',
        controller: 'docLectureController',
      })
      .state('chapter.quiz', {
        parent: 'chapter',
        templateUrl: 'views/quiz.html',
        url: '/quiz/:chid/:topic',
        controller: 'quizController',
      })
      .state('chapter.scorm', {
        parent: 'chapter',
        templateUrl: 'views/scorm.html',
        url: '/scorm/:chid/:topic',
        controller: 'scormController',
      })
      .state('chapter.assignment', {
        parent: 'chapter',
        templateUrl: 'views/assignment.html',
        url: '/assignment/:chid/:topic',
        controller: 'assignmentController',
      })
      .state('chapter.certificate', {
        parent: 'chapter',
        templateUrl: 'views/certificate.html',
        url: '/certificate/:cid',
        controller: 'certificateController',
      })
      .state('chapter.certificate.nps', {
        parent: 'chapter',
        templateUrl: 'views/nps.html',
        url: '/certificate/nps/:cid?edit',
        controller: 'certificateController',
      })
      .state('chapter.certificate.social', {
        parent: 'chapter',
        templateUrl: 'views/social.html',
        url: '/certificate/social/:cid?edit',
        controller: 'certificateController',
      })
      .state('chapter.certificate.social_redirrect', {
        parent: 'chapter',
        templateUrl: 'views/social-redirect.html',
        url: '/certificate/social_redirect/:cid?code',
        controller: 'socailRedirectController',
      })
      .state('chapter.certificate.topicfb', {
        parent: 'chapter',
        templateUrl: 'views/topicfb.html',
        url: '/certificate/topicfb/:cid?edit',
        controller: 'certificateController',
      })
      .state('chapter.certificate.leavefb', {
        parent: 'chapter',
        templateUrl: 'views/leavefb.html',
        url: '/certificate/leavefb/:cid?edit',
        controller: 'certificateController',
      })
      .state('chapter.certificate.mail', {
        parent: 'chapter',
        templateUrl: 'views/mail.html',
        url: '/certificate/mail/:cid?edit',
        controller: 'certificateController',
      })
      .state('chapter.certificate.dispatch', {
        parent: 'chapter',
        templateUrl: 'views/dispatch.html',
        url: '/certificate/dispatch/:cid?edit',
        controller: 'certificateController',
      })
      .state('chapter.certificate.idupload', {
        parent: 'chapter',
        templateUrl: 'views/idupload.html',
        url: '/certificate/idupload/:cid?edit',
        controller: 'certificateController',
      })
      .state('chapter.certificate.tupload', {
        parent: 'chapter',
        templateUrl: 'views/tupload.html',
        url: '/certificate/tupload/:cid?edit',
        controller: 'certificateController',
      })
      .state('chapter.certificate.getc', {
        parent: 'chapter',
        templateUrl: 'views/getc.html',
        url: '/certificate/getc/:cid',
        controller: 'certificateController',
      })
      .state('chapter.certificate.certi', {
        parent: 'chapter',
        templateUrl: 'views/certi_name.html',
        url: '/certificate/certi_name/:cid?edit',
        controller: 'certificateController',
      })
      .state('status', {
        templateUrl: 'views/status.html',
        url: '/status/:pid/:gid/:cid',
        controller: 'StatusCtrl',
      })
      .state('oauth', {
        url: '/course/:pid/:gid/:cid/:aid/:at/:rt/:secret/:isLoggedIn',
        controller: 'oauthController',
      })
  },
])

eckPlug.run(function ($location) {
  if (getParameterByName('pid') && getParameterByName('gid')) {
    $location.path(
      '/home/' +
        getParameterByName('pid') +
        '/' +
        getParameterByName('gid') +
        '/'
    )
  }
})

eckPlug.factory('superCache', [
  '$cacheFactory',
  function ($cacheFactory) {
    return $cacheFactory('super-cache')
  },
])

var course_backend_host = 'http://127.0.0.1:3000'
var protocol = 'http://'
var host = 'localhost'
var port = 3000
var primary_url = protocol + host + ':' + port
var dashboard_url = 'http://localhost:7015/dashboard'
var my_course_url = 'http://localhost:7015/view/'
var discussion_url = 'http://localhost:3034/group'
var quiz_user_url = 'http://localhost:3006'
var quiz_backend_url = 'http://localhost:3008'
var payment_url = 'http://localhost:3511'
var amp_login = '/eckhomepage/amp_login'
var domain = 'localhost'
var logout_url_redirect = primary_url + amp_login
var chapter_url = 'http://localhost:3019'
var PAYMENT_INSTALLMENT_URL = 'http://localhost:3511/installments/?crs_pg_id='
var adobe_pdf_reader_key = '23fb9c0e52ca4cc99ea6e62e8688eca3'

const NODE_ENV = window.NODE_ENV ? window.NODE_ENV : ''
const BUILD_ENV = window.BUILD_ENV ? window.BUILD_ENV : 'local'

if (
  (NODE_ENV == 'production' && BUILD_ENV == 'testing') ||
  window.location.href.search('pegasust.imarticus') != -1
) {
  course_backend_host = 'https://apict.pegasust.imarticus.org'
  adobe_pdf_reader_key = '6475105e1e954b5d8dc0182099b441d0'
  protocol = 'https:'
  host = 'apiht.pegasus.imarticus.org'
  port = 443
  primary_url = 'https://pegasust.imarticus.org'
  logout_url_redirect = primary_url
  dashboard_url = primary_url + '/dashboard'
  my_course_url = primary_url + '/view/'
  discussion_url = primary_url + '/group'
  payment_url = primary_url + '/payments'
  quiz_user_url = 'https://examft.pegasust.imarticus.org'
  quiz_backend_url = 'https://examt.pegasust.imarticus.org'
  domain = '.imarticus.org'
  chapter_url = 'https://learnt.pegasust.imarticus.org'
  PAYMENT_INSTALLMENT_URL =
    'https://pegasust.imarticus.org/payments/installments/?crs_pg_id='
} else if (
  (NODE_ENV == 'production' && BUILD_ENV == 'staging') ||
  window.location.href.search('pegasuss.imarticus') != -1
) {
  course_backend_host = 'https://apics.pegasuss.imarticus.org'
  adobe_pdf_reader_key = '6475105e1e954b5d8dc0182099b441d0'
  protocol = 'https:'
  host = 'apihs.pegasuss.imarticus.org'
  port = 443
  primary_url = 'https://pegasuss.imarticus.org'
  logout_url_redirect = primary_url
  domain = '.imarticus.org'

  dashboard_url = primary_url + '/dashboard'
  my_course_url = primary_url + '/view/'
  discussion_url = primary_url + '/group'
  payment_url = primary_url + '/payments'
  quiz_user_url = 'https://examfs.pegasuss.imarticus.org'
  quiz_backend_url = 'https://exams.pegasuss.imarticus.org'
  chapter_url = 'https://learns.pegasuss.imarticus.org'
  PAYMENT_INSTALLMENT_URL =
    'https://pegasuss.imarticus.org/payments/installments/?crs_pg_id='
} else if (
  (NODE_ENV == 'production' && BUILD_ENV == 'production') ||
  window.location.href.search('pegasus.imarticus') != -1
) {
  course_backend_host = 'https://apic.pegasus.imarticus.org'
  adobe_pdf_reader_key = '6475105e1e954b5d8dc0182099b441d0'

  protocol = 'https:'
  host = 'apih.pegasus.imarticus.org'
  port = 443
  primary_url = 'https://pegasus.imarticus.org'
  dashboard_url = primary_url + '/dashboard'
  my_course_url = primary_url + '/view/'
  discussion_url = primary_url + '/group'
  payment_url = primary_url + '/payments'
  quiz_user_url = 'https://examf.pegasus.imarticus.org'
  quiz_backend_url = 'https://exam.pegasus.imarticus.org'
  logout_url_redirect = primary_url

  domain = '.imarticus.org'
  chapter_url = 'https://learn.pegasus.imarticus.org'
  PAYMENT_INSTALLMENT_URL =
    'https://pegasus.imarticus.org/payments/installments/?crs_pg_id='
}

eckPlug.constant('constants', {
  primary_url: primary_url,
  dashboard_url: dashboard_url,
  my_course_url: my_course_url,
  discussion_url: discussion_url,
  payment_url: payment_url,
  development_url: course_backend_host,
  production_url: course_backend_host,
  quiz_user_url: quiz_user_url,
  quiz_backend_url: quiz_backend_url,
  chapter_url: chapter_url,
  PAYMENT_INSTALLMENT_URL: PAYMENT_INSTALLMENT_URL,
  adobe_pdf_reader_key: adobe_pdf_reader_key, // localhost
  // adobe_pdf_reader_key: '6475105e1e954b5d8dc0182099b441d0', // imarticus
  get_courses: '/plugin/g_pl_cf',
  get_plugin_identifier: '/plugin/usr_plg_idnt',
  course_auth: '/auth/at_crs',
  course_content: '/courselib/gcontent_v5',
  scorm_route: '/scorm/gt_scorm',
  impartus_login: '/courselib/offline_class_recordings_login',
  gradebook_data: '/courselib/gt_grades',
  course_status: '/courselib/gstatus',
  upload_grad_details: '/courselib/u_grd_dtl',
  get_grad_status: '/courselib/grad_sts',
  upload_media: '/media/webcpolicy-coursemedia',
  get_signed_url: '/media/g_crs_med',
  submit_assignment: '/courselib/s_ag',
  get_at: '/account/g_at_w',
  apply_certificate: '/courselib/aply_crtf_v2',
  // adobe_pdf_reader_key: 'ad72a92956ed4aaf88a971f36c28d9b4', // localhost
  // adobe_pdf_reader_key: '6475105e1e954b5d8dc0182099b441d0', // imarticus
  upload_media: '/media/webcpolicy-coursemedia',
  get_signed_url: '/media/g_crs_med',
  //status calls start
  chapter_status: '/courselib/o_cp',
  chapter_lecture_status: '/courselib/o_lc',
  chapter_scorm_status: '/courselib/o_sc',
  chapter_live_lecture_status: '/courselib/o_liv_lec',
  chapter_doc_lecture_status: '/courselib/o_cp_doc_lc',
  chapter_quiz_status: '/courselib/o_cp_qz',
  chapter_assignment_status: '/courselib/o_cp_ag',
  lecture_quiz_status: '/courselib/o_lc_qz',
  lecture_assignment_status: '/courselib/o_lc_ag',
  pdf_status: '/courselib/o_pd',
  get_ivq: '/cfpanel/get_ivq', //not used anywhere
  user_response_ivq: '/courselib/user_response_ivq',
  certifiate_status: '/courselib/cert_req_status',
  certificate_status: '/courselib/cert_req_status_v2',
  save_number: '/courselib/cert_sv_phn',
  test_run_src_code: '/courselib/test_run_src',
  submit_coding_assignment: '/courselib/s_cod_ag',
  reset_code_editor_value: '/courselib/reset_cod',
  auth_github: '/oauth/gh_auth_crt',
  auth_facebook: '/oauth/fb_auth_crt',
  save_social_detail: '/courselib/u_soc_dtl',
  find_profile: '/profile/find',
  cert_req_status: '/courselib/cert_req_status',
  aply_crtf: '/courselib/aply_crtf_v2',
  download_crtf: '/courselib/download_crtf',
  gt_tiers: '/courselib/gt_tiers',
  gt_level_content: '/courselib/levelContent',
  fetch_brand_data: '/pegasusbrandconfigs/fetch_brand_data_crs',
  logout_url: '/auth/logout',
  // get_user_quiz_token:"/usertest/start",
  get_user_quiz_token: '/user/u_stats_g',
  register_user_quiz: '/user/register',
  init_quiz: '/user/init',
  get_quiz_test_token: '/usertest/start_f',
  get_test_questions: '/testquestion/get_m',
  submit_feedback: '/usertest/end_v2',
  submit_feedback_status: '/courselib/o_fdbk',
  //status calls over
  FIRST_TRY: 0,
  MAX_TRIES: 1,
  //
  get_email_and_pname: '/account/gt_ep_pname',

  // bookmark apis
  get_chapter_bookmarks: '/courselib/gt_bkmrk_cp',
  get_lecture_bookmarks: '/courselib/gt_bkmrk',
  update_bookmarks: '/courselib/updt_bkmrk',
  remove_bookmark: '/courselib/rm_bkmrk',
  generate_zoom_signature: '/courselib/gen_zm_sgn',
  course_backend_host: course_backend_host,
  protocol: protocol,
  host: host,
  port: port,
  primary_url: primary_url,
  dashboard_url: dashboard_url,
  my_course_url: my_course_url,
  discussion_url: discussion_url,
  payment_url: payment_url,
  quiz_user_url: quiz_user_url,
  quiz_backend_url: quiz_backend_url,
  logout_url_redirect: logout_url_redirect,
  domain: domain,
  //
  get_lecture_duration: '/courselib/gt_lc_time',
  //creatrix placement
  placement_redirect: '/course/placementredirect',
})

MathJax.Hub.Config({
  tex2jax: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    processEscapes: true,
  },
})

eckPlug.directive('uploader', [
  function () {
    return {
      restrict: 'A',
      scope: {
        model: '=',
      },
      link: function (scope, elem, attrs) {
        $(elem).click(function () {
          $('#file').click()
        })
      },
    }
  },
])

eckPlug.provider('$copyToClipboard', [
  function () {
    this.$get = [
      '$q',
      '$window',
      function ($q, $window) {
        var body = angular.element($window.document.body)
        var textarea = angular.element('<textarea/>')
        textarea.css({
          position: 'fixed',
          opacity: '0',
        })
        return {
          copy: function (stringToCopy) {
            var deferred = $q.defer()
            deferred.notify('copying the text to clipboard')
            textarea.val(stringToCopy)
            body.append(textarea)
            textarea[0].select()

            try {
              var successful = $window.document.execCommand('copy')
              if (!successful) throw successful
              deferred.resolve(successful)
            } catch (err) {
              deferred.reject(err)
              //window.prompt("Copy to clipboard: Ctrl+C, Enter", toCopy);
            } finally {
              textarea.remove()
            }
            return deferred.promise
          },
        }
      },
    ]
  },
])
