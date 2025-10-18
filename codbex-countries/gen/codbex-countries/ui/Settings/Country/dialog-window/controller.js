angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Country successfully created';
		let propertySuccessfullyUpdated = 'Country successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Country Details',
			create: 'Create Country',
			update: 'Update Country'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-countries:codbex-countries-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-countries:codbex-countries-model.defaults.formHeadSelect', { name: '$t(codbex-countries:codbex-countries-model.t.COUNTRY)' });
			$scope.formHeaders.create = LocaleService.t('codbex-countries:codbex-countries-model.defaults.formHeadCreate', { name: '$t(codbex-countries:codbex-countries-model.t.COUNTRY)' });
			$scope.formHeaders.update = LocaleService.t('codbex-countries:codbex-countries-model.defaults.formHeadUpdate', { name: '$t(codbex-countries:codbex-countries-model.t.COUNTRY)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-countries:codbex-countries-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-countries:codbex-countries-model.t.COUNTRY)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-countries:codbex-countries-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-countries:codbex-countries-model.t.COUNTRY)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-countries.Settings.Country.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-countries:codbex-countries-model.t.COUNTRY'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-countries:codbex-countries-model.messages.error.unableToCreate', { name: '$t(codbex-countries:codbex-countries-model.t.COUNTRY)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-countries.Settings.Country.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-countries:codbex-countries-model.t.COUNTRY'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-countries:codbex-countries-model.messages.error.unableToUpdate', { name: '$t(codbex-countries:codbex-countries-model.t.COUNTRY)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'Country-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});