(function ($) {
    $.SortableGridView = function (options) {
		var defaultOptions = {
			id: 'sortable-grid-view',
			action: 'sortItem',
			sortingPromptText: 'Loading...',
			sortingFailText: 'Fail to sort',
			moveItem: '',
			csrfTokenName: '',
			csrfToken: '',
		};

		$.extend({}, defaultOptions, options);

		function initModal() {
			if (!options.noModal)
				$('body').append('<div class="modal fade" id="' + options.id + '-sorting-modal" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-body">' + options.sortingPromptText + '</div></div></div></div>');
		}

		function showModal() {
			if (!options.noModal)
				$('#' + options.id + '-sorting-modal').modal('show');
		}

		function hideModal() {
			if (!options.noModal)
				$('#' + options.id + '-sorting-modal').modal('hide');	
		}

		var regex = /items\[\]\_(\d+)/;

		initModal();

		$('#' + options.id + ' .sortable-grid-view tbody').sortable({
			handle: options.moveItem,
			update : function () {
				showModal();
				//serial = $('#' + options.id + ' .sortable-grid-view tbody').sortable('toArray', {attribute:'id'});
				serial = [];

				$('#' + options.id + ' .sortable-grid-view tbody.ui-sortable tr').each( function() {
					//console.log($(this).data('key'));
					serial.push($(this).data('key'));
				});

				//console.log(serial);


				var length = serial.length;
				var currentRecordNo = 0;
				var successRecordNo = 0;
				var data = [];

				if (length > 0) {
					for (var i=0; i<length; i++) {
						//var itemID = regex.exec(serial[i]);
						var itemID = serial[i];
						//data = data + 'items[' + i + ']=' + itemID[1] + '&';
						data.push(itemID)
						currentRecordNo++;

						if (currentRecordNo == 500 || i == (length-1)) {
							//data =  data + options.csrfTokenName + '=' + options.csrfToken;

							(function (currentRecordNo) {
								$.ajax({
									'url': options.action,
									'type': 'post',
									'data': { 'items': data, [options.csrfTokenName] : options.csrfToken },
									success: function (data) {
										checkSuccess(currentRecordNo);
									},
									error: function(data) {
										hideModal();
										alert(options.sortingFailText);
									}
								});
							})(currentRecordNo);

							currentRecordNo = 0;
							data = [];
						}
					}
				}

				function checkSuccess(count){
					successRecordNo += count;

					if (successRecordNo >= length) {
						hideModal();
					}
				}
			}
		});
    };
})(jQuery);
