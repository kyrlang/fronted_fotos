$(document).ready(function(){        
	$('li img').on('click',function(){
		var src = $(this).attr('src');
		var img = '<img src="' + src + '" class="img-responsive"/>';
		
		//start of new code new code
		var index = $(this).parent('li').index();   
		
		var html = '';
		html += img;                
		// html += '<div style="height:25px;clear:both;display:block;">';
		// html += '<a class="controls next" href="'+ (index+2) + '">next &raquo;</a>';
		// html += '<a class="controls previous" href="' + (index) + '">&laquo; prev</a>';
		// html += '</div>';
		
		$('#myModal').modal();
		$('#myModal').on('shown.bs.modal', function(){
			$('#myModal .modal-body').html(html);
			//new code
			$('a.controls').trigger('click');
		})
		$('#myModal').on('hidden.bs.modal', function(){
			$('#myModal .modal-body').html('');
		});
   });	
})