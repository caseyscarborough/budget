'use strict';

angular.module('budgetApp', ['ui.router', 'angular-jwt', 'ui.bootstrap'])
    .run(function ($window, $rootScope, authService) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            authService.authorize(event);
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.previousStateName = fromState.name;
            $rootScope.previousStateParams = fromParams;

            if (toState.data.pageTitle) {
                $window.document.title = toState.data.pageTitle;
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'scripts/app/navbar/navbar.html',
                    controller: 'NavbarController'
                }
            }
        });

        jwtInterceptorProvider.tokenGetter = ['sessionService', function (sessionService) {
            return sessionService.getToken();
        }];
        $httpProvider.interceptors.push('jwtInterceptor');
    });