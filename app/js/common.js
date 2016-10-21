"use strict";

$(function() {
	
	var device = 'desktop';
	
	// Detect device
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		device = 'mobile';			
	}
	
	// __________________ scroll to top 
    
	var scrollup = $('#scrollup');
	
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			scrollup.fadeIn();
		} else {
			scrollup.fadeOut();
		}
	});

	scrollup.click(function(){
		$("html, body").animate({ scrollTop: 0 }, 500);
		return false;
	});
    
    // _________________ Affix navbar to top 
    
	var sticker_menu = $('#topbar'),
		pos = sticker_menu.offset();
	
	if( sticker_menu.size() ){

        var start_pos = sticker_menu.offset().top;

        if( start_pos >= 0 ){
            
            $(window).scroll(function(){
				
				//console.log( '$(window).scrollTop() = ' + $(window).scrollTop() + ' vs start_pos=' + start_pos );
                
                if ( $(window).scrollTop() > start_pos + sticker_menu.height() ) {
                    
                    if( !sticker_menu.hasClass('affix') ){
                        
                        sticker_menu.addClass('affix');
                        
                    }
                    
                }else{
                    sticker_menu.removeClass('affix');
                }

            });

        }
	} 
	
    // ________________ flex slider
	
    $('#full-slider .flexslider').flexslider({
		animation: "fade",
		directionNav: true,
		controlNav: false,
		pauseOnAction: true,
		pauseOnHover: true,
		direction: "horizontal",
		slideshowSpeed: 4000,
		slideshow: true,
		before: function(slider) { $('#full-slider .flex-caption').fadeOut(100); },
		after: function(slider) { $('#full-slider .flex-caption').fadeIn(900); },
		controlsContainer: $(".custom-controls-container"),
		customDirectionNav: $(".custom-navigation a")
    });
    
    // _______________ testimonial carousel
	
	$("#owl-testimonial").owlCarousel({
 
		navigation : false, // Show next and prev buttons
		pagination: false,
		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem:true,
		autoPlay: 4500,
		stopOnHover: true

	});
	
	// _______________ announcement carousel
	
	$("#owl-announcement").owlCarousel({
 
		navigation : false, // Show next and prev buttons
		pagination: true,
		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem:true,
		autoPlay: 4500,
		stopOnHover: true

	});
	
	// _______________ partners carousel
	
	$("#owl-partners").owlCarousel({
 
		navigation : true, // Show next and prev buttons
		pagination: false,
		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem:false,
		autoPlay: 4500,
		stopOnHover: true,
		afterUpdate: function(){			
			updateOwlCarousel( $("#owl-partners") );
		},
		afterInit: function(){
			updateOwlCarousel( $("#owl-partners") );
		},
		navigationText: ['<i class="fa fa-angle-left fa-2x" aria-hidden="true"></i>', '<i class="fa fa-angle-right fa-2x" aria-hidden="true"></i>']

	});
	
	// если есть кнопки навигации по карусели, добавим класс к блоку карусели
	function updateOwlCarousel( carousel ){
		
		if( carousel.find('.owl-controls').is(':visible') ){
			carousel.addClass('hasNavs');
		}else{
			carousel.removeClass('hasNavs');
		}
		
	}
	
	// _______________ magnific gallery
	
	$('.gallery-item').magnificPopup({
	  type: 'image',
	  gallery:{
		enabled:true
	  }
	});
	
	// filterable
	$('#schedule_gallery').filterable({
		tagSelector: '#schedule_filter a',
		afterUpdate: function(){
			controlEventsVisibility('#schedule_gallery');
		},
	});
	
	$('#market_gallery').filterable({
		tagSelector: '#market_filter a',
		afterUpdate: function(){
			controlEventsVisibility('#market_gallery');
		},
	});
	
	// В расписаниях и событиях и тп оставляем для мобильников только первые 4 записи
	// остальное скрываем и показываем по кнопке
	
	controlEventsVisibility(null);
	
	$(window).resize(function(){
		controlEventsVisibility(null);
	});
	
	/*
		// Можно передать block_selector - тогда только для этого блока будет обновляться состояние,
		// иначе для всех
	*/
	function controlEventsVisibility( block_selector ){
		
		if (window.matchMedia('(max-width: 767px)').matches || device == 'mobile'){
		
			var num_visible = 4; // количество видимых событий
			
			var events_block = $('.events-wrapper');
			
			if( block_selector !== null && block_selector !== undefined ){
				events_block = $(block_selector);
			}
			
			events_block.each(function(){
				
				var events_block = $(this);
				
				var events_block_id = $(this).attr('id');
				
				var show_more_button = $(".showMoreEvents a[data-target='#" + events_block_id + "']").hide();

				var shown_blocks = events_block.children('.event:not(.inactive)');
				
				if( shown_blocks.size() > num_visible ){
					show_more_button.show();
				}
				
				if( show_more_button.is(':visible') ){
				
					shown_blocks.filter(':gt('+ (num_visible - 1) +')').hide();
				
				}

			});
		
		}
				
	}
	
	$('.showMoreEvents a').click(function(){
		
		var target = $(this).data('target');
		
		var events_block = $(target);
		
		events_block.children('.event:not(.inactive)').fadeIn();
		
		$(this).hide();
		
		return false;
		
	});
    	
	
}); // onload	