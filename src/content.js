
// Dobavi user opcije i prosledi u init
chrome.storage.sync.get({
	hover_likes: true,
	quick_view: true,
	night_mode: true,
	bigimg: true,
	floatInfo: true,
	night_mode_auto: false,
	night_mode_addad: false
	}, function(items) {
	init([items.hover_likes, items.quick_view, items.night_mode, items.bigimg, items.floatInfo, items.night_mode_auto, items.night_mode_addad]);
});

// Main fn
function init(options) {
	var isHoverLinks = options[0];
	var isQuickView = options[1];
	var isNightMode = options[2];
	var isBigImg = options[3];
	var isfloatInfo = options[4];
	var isNightAuto = options[5];
	var isNightAddad = options[6];
	
	var isSystemDark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? true : false;
	var isAddAdPage = new URLSearchParams(window.location.search).get('action');
	

	// Ukljuci night mode
	if(isNightMode){
		if(isAddAdPage == "new" && isNightAddad){
			return;
		} else {
			if(isNightAuto){
				if(isSystemDark) {
					document.documentElement.classList.add('kpp_night');
				}
			} else {
				document.documentElement.classList.add('kpp_night');
			}
		}
		
	}
	
	// Dodaj elemente u DOM
$( document ).ready(function() {
	var isSingle = (document.getElementById("oglas-holder") != null) ? true : false;
	if(isNightMode){
		if(isNightAuto){
			if(isSystemDark) {
				$( ".logo img" ).attr("src", chrome.runtime.getURL('whitelogo.svg'));
			}
		} else {
			$( ".logo img" ).attr("src", chrome.runtime.getURL('whitelogo.svg'));
		}
	}
	
	if(isfloatInfo && isSingle) {
		var floatNaziv = $("h1.oglas-title").text().trim();
		var floatPrice = $(".price-holder").text().trim();
		var floatName = $(".contact-name").text().trim();
		var floatTel = $('.phone-number img[alt="Telefon"]').attr("src");
		var floatImg = $('.ad-thumbnail-holder img').attr("src");
		
		if(typeof floatTel !== "undefined" ) { floatTel = '<img src="'+floatTel+'"/>'; } else { floatTel = 'Tel: /'; }
		
		$("body").css("padding-bottom","50px");
		
		$("body").append('<div id="kpp_float_holder" aria-hidden="true"><div class="kpp_float_content"><div class="floatImg"><img src="'+floatImg+'" alt="slika"></div><div class="floatNaziv">'+floatNaziv+'</div><div class="floatPrice">'+floatPrice+'</div><div class="floatTel">'+floatTel+'</div><div class="floatName">'+floatName+'</div></div></div>');
		
		
		   $(window).scroll(function() {
			if ($(this).scrollTop()>10){
			  $('#kpp_float_holder').slideDown();
			 }else{
				$('#kpp_float_holder').slideUp();
			 }
		 });
	} 
		
	$("#adListContainer .item:not(.head)").each(function( index ) {
		
		// Pokupi vrednosti ovog elementa i kesiraj u vars
		var kpp_adUrl = $("a.adName",$(this)).attr("href");
		$(this).attr('data-kpp_url', kpp_adUrl);
		var kpp_adid = $(".ad-options",$(this)).attr("ad-id"); 
		var kpp_location = $(".locationSec",$(this)).text(); 
		
		if(isQuickView) {
			
			$(".adPrice",$(this)).append('<div class="kpp_opcije"><div class="kpp_quick-view" title="Otvori brzi pregled" data-loc="'+kpp_location+'" data-adid="'+kpp_adid+'" data-kppurl="'+kpp_adUrl+'"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg></div></div>');
			$(".replacementText",$(this)).css("margin-top","10px");
		}
		if(isHoverLinks) {
			
			$(".ad-options",$(this)).prepend('<div class="ad-option kpp_likes_hover"><img src="/images/ajax-loader.gif" class="kpp_loader"></div>');
		}
		if(isBigImg) {
			
			$(".adImgHolder",$(this)).prepend('<div class="zoomImgHolder"><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"><path d="M13 10h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2zm8.172 14l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"/></svg></div>');
			$(".adImgHolder",$(this)).addClass('kppZoomImg');
		}
		

	});
	
	// Init funkcije
	if(isBigImg) {
		$("body").append('<div class="kppLightbox"></div>');
	}
	
	if(isQuickView) {

		$(".kpp_quick-view").on("click",function(e){
		e.preventDefault();
		var url = $(this).data("kppurl");
		var oglasid = $(this).data("adid");
		var location = $(this).data("loc");
		$("body").append('<div id="kpp_modal_holder"><div id="kpp_modal_window"><span class="kpp_close_modal">x</span><div id="kpp_modal_data">Učitavanje...</div></div></div>');
		$.ajax({
		   url:url,
		   type:'GET',
		   success: function(data){
				var upOcena_raw = $(data).find('.thumb-up').html();
			   var downOcena_raw = $(data).find('.thumb-down').html();
			   var upOcena, downOcena;
				var telefon = $(data).find('.phone-number img[alt="Telefon"]').attr("src");
			   if(typeof upOcena_raw !== "undefined" || typeof downOcena_raw !== "undefined" ){
				   var upOcena = upOcena_raw;
					var downOcena = downOcena_raw;
					var oceneUrl = '<a href="'+$(data).find('.thumbs-holder').attr('href')+'" title="Vidi sve ocene korisnika" target="_blank"><span class="thumb-up">'+upOcena+'</span> / <span class="thumb-down">'+downOcena+'</span></a>';
			   } else {
				   var oceneUrl = "Nema ocena";
			   }
			  if(typeof telefon !== "undefined" ) {
				  telefon = '<img src="'+telefon+'"/>';
			  } else {
				  telefon = 'Tel: /';
			  }
			   
			   
			  var big_img = $(data).find('.ad-thumbnail-holder a img').attr('src').replace('tmb-150x150-', 'big-');
			  
			   $("#kpp_modal_data").html('<div id="drag_box" class="kpp_modal_title kpp_row">Učitavanje...</div><div class="kpp_modal_info kpp_row"><div class="photo-col">Učitavanje...</div><div class="contact-col"><div class="kpp_modal_single_info kpp_modal_cena"></div><div class="kpp_modal_single_info kpp_modal_korisnik"></div><div class="kpp_modal_single_info kpp_modal_clanod"></div><div class="kpp_modal_single_info kpp_modal_mesto"></div><div class="kpp_modal_single_info kpp_modal_ocene"></div><div class="kpp_modal_single_info kpp_modal_tel"></div><div class="kpp_modal_single_info kpp_modal_poseti"></div></div></div><div class="kpp_modal_desc kpp_row"><div class="desc_data">Učitavanje...</div></div>');
			   
			   $('.kpp_modal_title').html('<a href="'+url+'" class="kpp_pop_title" title="Otvori oglas" target="_blank">'+$(data).find('.oglas-title').text()+'</a>');
			   $('.kpp_modal_info .photo-col').html('<a href="https://www.kupujemprodajem.com/big-photo-'+oglasid+'-1.htm" target="_blank"><img src="'+big_img+'" title="Slika oglasa" /></a>');
			   $('.kpp_modal_info .kpp_modal_cena').html($(data).find('.price-holder').text());
			   $('.kpp_modal_info .kpp_modal_korisnik').html($(data).find('.contact-name').text());
			   $('.kpp_modal_info .kpp_modal_clanod').html($(data).find('.registration-date').text());
			   $('.kpp_modal_info .kpp_modal_mesto').html(location);
			   $('.kpp_modal_info .kpp_modal_ocene').html('Ocene: '+oceneUrl);
			   $('.kpp_modal_info .kpp_modal_tel').html(telefon);
			   $('.kpp_modal_info .kpp_modal_poseti').html('<a href="'+url+'" target="_blank" class="kpp_pop_otvori_oglas" title="Otvori oglas">Otvori oglas</a>');
			   $('.desc_data').html($(data).find('.oglas-description').html());
			  
		   }
		});
		});

		$(document).mouseup(function(e) {
			var container = $("#kpp_modal_window");
			if (!container.is(e.target) && container.has(e.target).length === 0) 
			{
				container.remove();
				$("#kpp_modal_holder").remove();
			}
		});

		$("body").on("click",".kpp_close_modal",function(){
			$("#kpp_modal_holder").remove();
		});

	}
	if(isHoverLinks){
		var timer;
		$('#adListContainer .item:not(.head)').hover(function() {
			var _this = $(this);
			var url = _this.data("kpp_url");
			
		
			timer = setTimeout(function() {
				if( $(".kpp_likes_hover",_this).find(".kpp_loader").length > 0 ) {
					
					$.ajax({
						url:url,
						type:'GET',
						success: function(data){
							var upOcena_raw = $(data).find('.thumb-up').html();
							var downOcena_raw = $(data).find('.thumb-down').html();
							var upOcena = "0";
							var downOcena = "0";
							var url = $(data).find('.thumbs-holder').attr('href');
							
							if(typeof upOcena_raw !== "undefined" || typeof downOcena_raw !== "undefined" ){
								var upOcena = upOcena_raw;
								var downOcena = downOcena_raw;

							} else {
								var upOcena = "Nema";
								var downOcena = " ocena";
							}
							$(".kpp_likes_hover",_this).html("<div class='kpp_likes_url' data-likes_url='"+url+"' title='Ocene korisnika'><span class='thumb-up'>"+upOcena+"</span> <span class='thumb-down'>"+downOcena+"</span></div>");

						}
					});
				} 
				
			}, 600);
		}, function() {
			// on mouse out, cancel the timer
			clearTimeout(timer);
		});
		$(".kpp_likes_hover").on("click",".kpp_likes_url",function(){
			var url = $(this).data("likes_url");
			if(url !== "undefined") {
				window.open(url, '_blank');
			}
			
		});
	}
	
	// Na lightbox trigger click uradi:
	$( ".adImgHolder" ).on( "click", function(){
		var bigImgUrl = $("img",$(this)).attr("src").replace("tmb-300x300-", "");
		$(".kppLightbox").html('<div class="kpp_lightbox_holder"><img src="'+bigImgUrl+'"><span class="closeLightbox">x</span></div>').fadeIn(220);
		
	});
	$( ".kppLightbox" ).on( "click", function(){
		$(this).html("").fadeOut(200);
	});

}); // doc ready

$(document).keyup(function(e) {
     if (e.key === "Escape") { // escape key maps to keycode `27`
        $( ".kppLightbox" ).html("").fadeOut(200);
		$("#kpp_modal_holder").remove();
    }
});

} // main fn




