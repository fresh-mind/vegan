/*
* Copyright (C) 2009 Joel Sutherland.
* Liscenced under the MIT liscense
*/

(function($) {
    $.fn.filterable = function(settings) {
        settings = $.extend({
            useHash: false,
            animationSpeed: 700,
            show: {opacity: 1},
            hide: {opacity: 0.1},
            useTags: true,
            tagSelector: '.filters a',
            selectedTagClass: 'current',
            normalTagClass: '',
            allTag: 'all',
			afterUpdate: function(){},
        }, settings);

        return $(this).each(function(){
			
			var portfolio_block = $(this);

            /* FILTER: select a tag and filter */
            $(this).bind("filter", function( e, tagToShow ){
                if(settings.useTags){
                    $(settings.tagSelector).removeClass(settings.selectedTagClass);
                    $(settings.tagSelector + '[href="' + tagToShow + '"]').addClass(settings.selectedTagClass);
                }
                $(this).trigger("filterportfolio", [ tagToShow.substr(1) ]);
            });

            /* FILTERPORTFOLIO: pass in a class to show, all others will be hidden */
            $(this).bind("filterportfolio", function( e, classToShow ){
                if(classToShow == settings.allTag){
                    $(this).trigger("show");
                }else{
                    $(this).trigger("show", [ '.' + classToShow ] );
                    $(this).trigger("hide", [ ':not(.' + classToShow + ')' ] );
                }
                
                if(settings.useHash){
                    location.hash = '#' + classToShow;
                }
            });

            /* SHOW: show a single class*/
            $(this).bind("show", function( e, selectorToShow ){
                $(this).children(selectorToShow).fadeIn().removeClass('inactive');
            });

            /* SHOW: hide a single class*/
            $(this).bind("hide", function( e, selectorToHide ){
                $(this).children(selectorToHide).fadeOut().addClass('inactive');   
            });

            /* ============ Check URL Hash ====================*/
            if(settings.useHash){
                if(location.hash != '')
                    $(this).trigger("filter", [ location.hash ]);
                else
                    $(this).trigger("filter", [ '#' + settings.allTag ]);
            }

            /* ============ Setup Tags ====================*/
            if(settings.useTags){
                $(settings.tagSelector).click(function(){
                    portfolio_block.trigger("filter", [ $(this).attr('href') ]);

                    $(settings.tagSelector).removeClass(settings.normalTagClass);
                    $(this).addClass(settings.normalTagClass);
					
					settings.afterUpdate();
                    
                    if(!settings.useHash){
                      return false;
                    }
					
                });
				
				/* when default section must be shown */
				
				var default_shown_tag = $(settings.tagSelector).filter('.current').attr('href');
				portfolio_block.trigger("filter", [ default_shown_tag ]);
				
            }
        });
    }
})(jQuery);