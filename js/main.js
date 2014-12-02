$(function(){
	$('.caption.collapse').click(function(){
		$(this).prev('*').show();
		$(this).removeClass('collapse');
	})
})