import angular from 'angular';
import { LogForgeViewAngular } from '@/react/portainer/logforge/LogForgeView';
import { NotificationsViewAngular } from '@/react/portainer/notifications/NotificationsView';
import { AccessHeaders } from '../authorization-guard';
import authLogsViewModule from './auth-logs-view';
import { UserActivityService } from './user-activity.service';
import { UserActivity } from './user-activity.rest';

export default angular
  .module('portainer.app.user-activity', [authLogsViewModule])
  .service('UserActivity', UserActivity)
  .service('UserActivityService', UserActivityService)
  .component('notifications', NotificationsViewAngular)
  .component('logforge', LogForgeViewAngular)
  .config(config).name;

/* @ngInject */
function config($stateRegistryProvider) {
  $stateRegistryProvider.register({
    name: 'portainer.authLogs',
    url: '/auth-logs',
    views: {
      'content@': {
        component: 'authLogsView',
      },
    },
    data: {
      docs: '/admin/logs',
      access: AccessHeaders.Admin,
    },
  });

  $stateRegistryProvider.register({
    name: 'portainer.activityLogs',
    url: '/activity-logs',
    views: {
      'content@': {
        component: 'activityLogsView',
      },
    },
    data: {
      docs: '/admin/logs/activity',
      access: AccessHeaders.Admin,
    },
  });

  $stateRegistryProvider.register({
    name: 'portainer.notifications',
    url: '/notifications',
    views: {
      'content@': {
        component: 'notifications',
      },
    },
    params: {
      id: '',
    },
    data: {
      docs: '/admin/notifications',
    },
  });

  $stateRegistryProvider.register({
    name: 'portainer.logforge',
    url: '/logforge',
    views: {
      'content@': {
        // Replace 'logforge' with the name of your component
        component: 'logforge', 
      },
    },
    data: {
      docs: '/admin/logforge',
    },
  });
}


