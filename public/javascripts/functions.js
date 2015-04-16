
jQuery(document).ready(function()
{
	jQuery('#inputCheck').val('sign');
	jQuery('#chk1').click(function()
	{
		var values = {sign:"log", log:"sign"};
		jQuery('#inputCheck').val(values[jQuery('#inputCheck').val()]);
	});
	jQuery('#name_surname_modal').modal();
	
	jQuery('#add-epigraph-button').click(function()
	{
		var name = jQuery('#add-epigraph-input').val();
		if(name && name.replace(/\s/g,'')!="")
			jQuery('#epigraph-row-container').append(getTheepigraphListElementHtml(name));
		jQuery('#add-epigraph-input').val("").focus();
	});
	jQuery('body').delegate('[data-change-user-epigraph-button="true"]', 'click', function()
	{
		
		var data 			= {};
		data.epigraph_id	= jQuery(this).attr('data-epigrah_id');
		data.finish			= jQuery(this).attr('data-epigraph-finish');
		
		jQuery.post('/epigraph.html', {data:data}, function(results, status)
		{
			console.log(status);
			if(status=="success")
			{
				if(results.finish)
				{
					jQuery('[data-span-epigrah_id="'+data.epigraph_id+'"]').removeClass('glyphicon-pushpin').addClass('glyphicon-ok-sign');
					jQuery('[data-epigrah_id="'+data.epigraph_id+'"]').removeClass('btn-info').addClass('btn-success').attr('title','Acabas de finalizar esta tarea');
				}
				else
				{
					jQuery('[data-span-epigrah_id="'+data.epigraph_id+'"]').removeClass('glyphicon-tags').addClass('glyphicon-pushpin');
					jQuery('[data-epigrah_id="'+data.epigraph_id+'"]').removeClass('btn-warning').addClass('btn-info').attr('title','Acabas de asignarte esta tarea.');
				}
				jQuery('[data-epigrah_id="'+data.epigraph_id+'"]').tooltip('destroy');
				setTimeout(function()
				{
					jQuery('[data-epigrah_id="'+data.epigraph_id+'"]').tooltip();
				}, 300);
			}
			console.log(results);
		});
	});
	jQuery('body').delegate('[data-remove-epigraph-button="true"]', 'click', function()
	{
		jQuery(this).parent().parent().parent().remove();
	});
	
	jQuery('#reset-add-epigraph').click(function()
	{
		jQuery('#epigraph-row-container').html('');
	});
	jQuery('.subject-item-list').on('click', function()
	{
		jQuery('#epigraph-content').html('');
		var data 		= {};
		data.populate	= true;
		data.subject	= jQuery(this).html();
		jQuery.post('/take_epigraph.html', {data:data}, function(data, status){
			for(var i in data)
				jQuery('#epigraph-content').append(	getTheEpigraphListUserAdjudicate(data[i]));
			jQuery('[data-toggle="tooltip"]').tooltip();
		});
	});
	jQuery('#subject-select').on('change', function()
	{
		jQuery.post('/take_epigraph.html', {data:jQuery(this).val()}, function(data, status){
			for(var i in data)jQuery('#epigraph-row-container').append(getTheepigraphListElementHtml(data[i].content));
		});
	});
	jQuery(window).on("resize",function()
	{
		if(jQuery(window).width()<992)
			jQuery('.list-unstyled').removeClass('list-unstyled').addClass('list-inline');
		else 
			jQuery('.list-inline').removeClass('list-inline').addClass('list-unstyled');
	});
	if(jQuery(window).width()<992)
		jQuery('.list-unstyled').removeClass('list-unstyled').addClass('list-inline');
});
function getTheEpigraphListUserAdjudicate(data)
{
	var html = '<div class="row">'+
					'<div class="epigraph-content-from-data col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">'+
						'<span class="col-xs-10 epigraph-name">' + data.content + '</span>';
	
	if(data.finish)
		html +=			'<span class="col-xs-2 epigraph-button">'+
							'<button data-epigrah_id="' + data._id + '" data-epigraph-finish="true" class="btn btn-success" type="button" data-toggle="tooltip" data-placement="right" title="Tarea finalizada por el usuario ' + data.user_id.name + '">'+
								'<span class="glyphicon glyphicon-ok-sign"></span>'+
							'</button>'+
						'</span>';
	
	else if(data.user_id && data.user_id.name==jQuery('#epigraph-user').attr('data-user_name'))
		html +=		 	'<span class="col-xs-2 epigraph-button">'+
							'<button data-change-user-epigraph-button="true" data-epigrah_id="' + data._id + '" data-epigraph-finish="true" class="btn btn-info" type="button" data-toggle="tooltip" data-placement="right" title="Te has asignado esta tarea.">'+
								'<span data-span-epigrah_id="' + data._id + '" class="glyphicon glyphicon-pushpin"></span>'+
							'</button>'+
						'</span>';
	else if(data.user_id) 
		html +=			'<span class="col-xs-2 epigraph-button">'+
							'<button class="btn btn-danger" type="button"data-toggle="tooltip" data-placement="right" title="Tarea en curso por el usuario ' + data.user_id.name + '">'+
								'<span class="glyphicon glyphicon-transfer"></span>'+
							'</button>'+
						'</span>';
	else
		html +=		 	'<span class="col-xs-2 epigraph-button">'+
							'<button data-change-user-epigraph-button="true" data-epigrah_id="' + data._id + '" data-epigraph-finish="false" class="btn btn-warning" type="button" data-toggle="tooltip" data-placement="right" title="Esta tarea está sin asignar">'+
								'<span data-span-epigrah_id="' + data._id + '" class="glyphicon glyphicon-tags"></span>'+
							'</button>'+
						'</span>';
	html +=			'</div>'+
				'</div>';
	return html;
					
}
function getTheepigraphListElementHtml(name)
{
	return '<div class="col-lg-6">'+
				'<div class="input-group">'+
					'<input data-epigraph-input="true" class="form-control" name="epigraph[]" type="text" value="'+name+'" readonly>'+
					'<span class="input-group-btn">'+
						'<button data-remove-epigraph-button="true" class="btn btn-danger" type="button">'+
							'<span class="glyphicon glyphicon-minus"></span>'+
						'</button>'+
					'</span>'+
				'</div>'+
			'</div>';
}