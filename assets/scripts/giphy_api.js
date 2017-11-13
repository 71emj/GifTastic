(function() {
	"use strict";

	(function($) {
		// three functionalities:
		// populating buttons, collecting input value from user, 
		// and making ajax request to giphy server

		const $searchBtns = $('#search-buttons'),
			$gifContents = $('#gif-contents');
		const mySearchArr = ['Caiman', 'Camel', 'Chinook', 'Bird', 'Drever', 'Akita'];

		populateSearchBtns();

		// quick test on query
		$('#search').children().children('input[type="submit"]').click(function(e) {
			e.preventDefault();

			// store value to local variable, then clear out the inputbox
			const searchInput = $(this).siblings('input[type="text"]').val();
			$(this).siblings('input[type="text"]').val('');

			!!searchInput && populateSearchBtns(searchInput);
			!!searchInput && requestData(searchInput).then(
				(json) => populatePageContents(json)
			);
		})

		$searchBtns.on('click', '.btn', function() {
			requestData($(this).data('name')).then(
				(json) => populatePageContents(json)
			);
		})

		$gifContents.on('click', '.img-fixedheight', function() {
			console.log($(this));
			if ($(this).data('still')) {
				$(this).data('still', false);
				$(this).attr('src', $(this).data('gif'));
				return;
			}

			$(this).data('still', true);
			$(this).attr('src', $(this).data('image'));
		})

		// creating buttons
		function populateSearchBtns(value = '') {
			const btnListLength = $searchBtns.children().length;

			// capitalize the first alphabet of the input value, and trim()
			!!value && mySearchArr.push(value.replace(
				/[a-zA-Z]/i, value[value.indexOf(value.match(/[a-zA-Z]/i))].toUpperCase()
			).trim());

			for (let i = btnListLength; i < mySearchArr.length; i++) {
				$searchBtns.append(
					$('<button>')
					.attr({
						'data-name': mySearchArr[i],
						'class': 'btn btn-default'
					})
					.text(mySearchArr[i])
				);
			}
			return;
		}

		// ajax
		function requestData(searchTarget = '', searchLimit = 10, pg = '', offset = 0) {
			return new Promise((resolve, reject) => {
				const basicUrl = 'https://api.giphy.com/v1/gifs/search',
					param = {
						'api_key': 'HOOPzb90bjAOTba7ni34wuQsW87ZwvTQ',
						'lang': 'en',
						'q': searchTarget,
						'rating': pg,
						'offset': offset,
						'limit': searchLimit
					};

				const queryUrl = basicUrl + '?' + $.param(param);

				try {
					$.ajax({
						url: queryUrl,
						method: 'GET'
					}).done(function(response) {
						console.log(response);
						resolve(response);
					});
				} catch (e) {
					console.log(e);
					reject(e);
				}
			})
		}

		// creating dynamic elements
		function populatePageContents(json) {
			console.log('here I am');
			const jsonArray = json['data'];
			$gifContents.empty();

			// appendding data to the page
			$.each(jsonArray, function(index, elem) {
				$gifContents.append(
					$('<figure>')
					.attr({
						'class': 'pull-left',
						'id': 'figures'
					})
					.append(
						$('<figcaption>')
						.text('Rating: ' + elem['rating'])
					)
					.append(
						$('<img>')
						.attr({
							'id': elem['id'],
							'class': 'img-fixedheight',
							'src': elem['images']['original_still']['url'],
							'data-gif': elem['images']['original']['url'],
							'data-image': elem['images']['original_still']['url'],
							'data-still': true
						})
					)
				);
			})
		}
	}(jQuery));

}());