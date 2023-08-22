// ---------------------------------------------
// Author: Stefan Marjanov - stefanmarjanov.com
// ---------------------------------------------

// Preuzmi user opcije i prosledi u init
chrome.storage.sync.get({
	quick_view: true,
	night_mode: true,
	bigimg: true,
	floatInfo: true,
	night_mode_auto: true,
	night_mode_addad: false,
	wideSite: true
	}, function(items) {
	init([items.quick_view, items.night_mode, items.bigimg, items.floatInfo, items.night_mode_auto, items.night_mode_addad, items.wideSite]);
});

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function applyColors(tip = "dark"){
	if(tip == "dark"){
		$(":root").css({
			"--color-primary-black": "#fff",
			"--color-primary-white": "#181818",
			"--color-primary-navy-blue": "#ececec",
			"--color-primary-sky-blue": "#2099dc",
			"--color-primary-gray": "#3b3b3b",
			"--color-grayscale-4": "#414141",
			"--color-grayscale-elm-1": "#414141",
			"--color-secondary-bg-brown": "#3b3211",
			"--color-grayscale-1": "#aeaeae",
			"--color-secondary-gold": "#4b3d14",
			"--color-secondary-text-red": "#e93f3f",
			"--color-secondary-text-brown": "#edba63",
			"--color-secondary-bg-blue": "#142833",
			"--color-primary-action-red": "#e03d27",
			"--color-grayscale-3": "#484848",
			"--color-secondary-price-red": "#e82626"
		});
		document.documentElement.classList.add('kpp_night');
		$('svg[class^="Logo_svgLogo__"] > g[clip-path="url(#clip0)"] path[fill="#003368"]').attr('fill', '#ffffff');
	} else {
		$(":root").css({
			"--color-primary-black": "",
			"--color-primary-white": "",
			"--color-primary-navy-blue": "",
			"--color-primary-sky-blue": "",
			"--color-primary-gray": "",
			"--color-grayscale-4": "",
			"--color-grayscale-elm-1": "",
			"--color-secondary-bg-brown": "",
			"--color-grayscale-1": "",
			"--color-secondary-gold": "",
			"--color-secondary-text-red": "",
			"--color-secondary-text-brown": "",
			"--color-secondary-bg-blue": "",
			"--color-primary-action-red": "",
			"--color-grayscale-3": "",
		});
		document.documentElement.classList.remove('kpp_night');
		$('svg[class^="Logo_svgLogo__"] > g[clip-path="url(#clip0)"] path[fill="#ffffff"]').attr('fill', '#003368');
	}
}


// Main fn
function init(options) {
	var isQuickView = options[0];
	var isNightMode = options[1];
	var isBigImg = options[2];
	var isfloatInfo = options[3];
	var isNightAuto = options[4];
	var isNightAddad = options[5];
	var isWideSite = options[6];
	
	var isSystemDark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? true : false;
	
	// Detektuj promenu URL-a u SPA
	var previousUrl = '';
	var urlObserver = new MutationObserver(function(mutations) {
	  if (location.href !== previousUrl) {
		  previousUrl = location.href;
			mainApp(location.href);
		}
	});
	const config = {subtree: true, childList: true};
	urlObserver.observe(document, config);
	
	function mainApp(href){
	
	// Resetuj sve prilikom promene URL-a
	$("body").off("click",".kpp_quick-view");
	$("body").off("click",".kpp_close_modal");
	$("body").off("click",".zoomImg");
	$(".adImgHolder").off("click");
	$(".kppLightbox").off("click");
	if($("#kpp_float_holder").length > 0){
		$("#kpp_float_holder").remove();
	}
	if($("#kpp_modal_holder").length > 0){
		$("#kpp_modal_holder").remove();
	}

	var isSingle = (href.indexOf("/oglas") > -1) ? true : false;
	var isAddAdPage = (href.indexOf("/postavljanje-oglasa") > -1) ? true : false;
	var isGrupa = ( href.indexOf("/grupa") > -1 || href.indexOf("/pretraga") > -1 || href.indexOf("/najnoviji") > -1 || href.indexOf("/svi-oglasi") > -1  ) ? true : false;
	
	
	// Ukljuci night mode (izvan document.body kako bismo primenili klasu što pre i izbegli white flash)
	if( isNightMode ){ 
		if(isNightAddad && isAddAdPage){ // Ako smo na "Dodaj oglas" i ako je korisnik omogućio opciju isNightAddad - isključi night mode
			applyColors("light");
			
		} else { // Ako smo na bilo kojoj drugoj stranici...
			if(isNightAuto){ // Ako korisnik želi da uskladi dark mode sa sistemom
				if(isSystemDark) { // Ako je dark mode u sistemu zapravo uključen
					applyColors("dark");
				}
			} else {
				applyColors("dark");
				
			}
		}

	}
	
	if( isWideSite ){ 
		document.documentElement.classList.add('kpp_wide');
	} else {
		document.documentElement.classList.remove('kpp_wide');
	}
	
	$(document.body).ready(function() { // Sačekaj da se html učita (samo za first time load)
		
		// FLOAT TRAKA
		if(isfloatInfo && isSingle) { // Samo ako je korisnik omogućio opciju i ako smo na single ad stranici
			
			waitForElm("section[class*='AdPage_adInfoBox__']").then((elm) => { // Sačekat da se el učita
				
				// Prikupi podatke iz el
				var floatNaziv = $("h1[class^='AdViewInfo_name__']").text().trim();
				var floatPrice = $("h2[class^='AdViewInfo_price__']").text().trim();
				var floatName = $("div[class^='UserSummary_userNameHolder__'] > span:not([class^='Badge_badgeHolder__'])").text().trim();
				
				if($("div[class^='AdViewInfo_imageHolder__'] img").length > 0){
					var floatImg = '<img src="'+$("div[class^='AdViewInfo_imageHolder__'] img").attr("src")+'" alt="slika" />';
				} else {
					var floatImg = $("div[class^='AdViewInfo_imageHolder__']").html();
				}
				
				// Kreiraj float traku
				if( floatNaziv != null && floatPrice != null && floatName != null && floatImg != null ){
					$("body").css("padding-bottom","50px");
				
					$("body").append('<div id="kpp_float_holder" aria-hidden="true"><div class="kpp_float_content"><div class="floatImg">'+floatImg+'</div><div class="floatNaziv">'+floatNaziv+'</div><div class="floatPrice">'+floatPrice+'</div><div class="floatName">'+floatName+'</div></div></div>');
				}
				
			
			}); //waitForElm
			
			// Prikaži/sakrij float traku na scroll
			$(window).scroll(function() {
				if($("#kpp_float_holder").length > 0){
					if( $(this).scrollTop() > 10 ){
					  $('#kpp_float_holder').slideDown();
					} else {
						$('#kpp_float_holder').slideUp();
					}
				}
				
			 });
		} else { // Reset padding kada nismo na single ad
			$("body").css("padding-bottom","");
		}
		
		if(isGrupa && (isQuickView || isBigImg)){ // Ako smo na stranici kategorije, tj. drupe, i slično

			waitForElm("section[class*='AdItem_adOuterHolder__']").then((elm) => { // Sačekaj da se ad list item učita

				$("section[class*='AdItem_adOuterHolder__']").each(function( index ) { // Prođi svaki i popuni elemente
					var big_img = false;
					var kpp_adUrl = $("a[class^='Link_link__']",$(this)).attr("href"); // Treba nam za AJAX
					$(this).attr('data-kpp_url', kpp_adUrl); 
					var kpp_adid = $(this).attr("id"); // Treba nam na više mesta kasnije, npr. za Next object i generisanja URL-a veće slike
					if( $("div[class^='AdItem_imageHolder__'] > img",$(this)).length > 0 ){
						var big_img = $("div[class^='AdItem_imageHolder__'] > img",$(this)).attr("src").replace('tmb-300x300-', '');
					}
					
					if(isQuickView) {
						if( $(".kpp_opcije",$(this)).length > 0 ){
							$(".kpp_opcije",$(this)).remove();
						}
						$("div[class^='AdItem_price__']",$(this)).append('<div class="kpp_opcije"><div class="kpp_quick-view" title="Otvori brzi pregled" data-adid="'+kpp_adid+'" data-kppurl="'+kpp_adUrl+'"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg></div></div>');
						
					}

					if(isBigImg && big_img) {
						if( $(".zoomImgHolder",$(this)).length > 0 ){
							$(".zoomImgHolder",$(this)).remove();
						}
						$(this).addClass("zoomImgWrap");
						$("article[class^='AdItem_adHolder__']",$(this)).prepend('<div class="zoomImgHolder" data-bigimg="'+big_img+'"><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"><path d="M13 10h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2zm8.172 14l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"/></svg></div>');
						
					}
					
				}); //each
				
			}); //waitForElm

		} // isGrupa
		
		
		if(isBigImg) {
			if($(".kppLightbox").length > 0){
				$(".kppLightbox").remove();
			}
			$("body").append('<div class="kppLightbox"></div>');
		}
		
		
		if(isQuickView) {
			
			// Oko ovog posla 3 dana...
			$("body").on("click",".kpp_quick-view",function(e){
			e.preventDefault();
			var url = $(this).data("kppurl");
			var oglasid = $(this).data("adid");
			var location = $(this).data("loc");
			
			if($("#kpp_modal_holder").length > 0){
				$("#kpp_modal_holder").remove();
			}
			$("body").append('<div id="kpp_modal_holder"><div id="kpp_modal_window"><span class="kpp_close_modal"><svg width="8" height="8" viewBox="0 0 8 8" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" class="asIcon_lightBlueStroke__GC9a2 asIcon_svg__Zm34q"><path d="M1 7L7 1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 7L1 1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span><div id="kpp_modal_data">Učitavanje...</div></div></div>');
			$.ajax({
			   url:url,
			   type:'GET',
			   success: function(podaci){
				   if(!podaci) {
					   $("#kpp_modal_data").html("Greška u povlačenju podataka sa sajta. Proverite internet konekciju i da li je KP sajt dostupan. Potom osvežite stranicu i probajte opet.");
					   return;
				   }
				   
				   // Pokupi informacije
				   var podaci = $.parseHTML(podaci);
				   $("#kpp_modal_data").html('<div id="drag_box" class="kpp_modal_title kpp_row">Učitavanje...</div><div class="kpp_modal_info kpp_row"><div class="photo-col">Učitavanje...</div><div class="contact-col"><div class="kpp_modal_single_info kpp_modal_cena"></div><div class="kpp_modal_single_info kpp_modal_korisnik"></div><div class="kpp_modal_single_info kpp_modal_korisnik_details"></div><div class="kpp_modal_single_info kpp_modal_ocene"></div><div class="kpp_modal_single_info kpp_modal_tel"></div><div class="kpp_modal_single_info kpp_modal_poseti"></div></div></div><div class="kpp_modal_desc kpp_row"><div class="desc_data">Učitavanje...</div></div>');
				   
				   var ocene = $(podaci).find("div[class^='ReviewThumbLinks_reviewsHolder__']").html();
				   var oceneUrl = "Nema ocena";
					
				   if(typeof ocene !== "undefined" && ocene !== "" ){
					   var oceneUrl = ocene;
				   }
				   
				   var big_img = $(podaci).find("div[class^='AdViewInfo_imageHolder__'] img").attr('src');
				   if(big_img) {
					   big_img = big_img.replace('tmb-300x300-', 'big-');
					   $('.kpp_modal_info .photo-col').html('<a href="https://www.kupujemprodajem.com/big-photo-'+oglasid+'-1.htm" target="_blank"><img src="'+big_img+'" title="Slika oglasa" /></a>');
					   
				   } else {
						$('.kpp_modal_info .photo-col').html( $(podaci).find("div[class^='AdViewInfo_imageHolder__']").html() );
				   }
				   
				   // Popuni modal
				   $('.kpp_modal_title').html('<a href="'+url+'" class="kpp_pop_title" title="Otvori oglas u novoj kartici" target="_blank">'+$(podaci).find("h1[class^='AdViewInfo_name__']").text()+'</a>');
				   $('.kpp_modal_info .kpp_modal_cena').html($(podaci).find("h2[class^='AdViewInfo_price__']").text());
				   $('.kpp_modal_info .kpp_modal_korisnik').html("<svg id='userIcon' stroke='#181818' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' ><path fill-rule='evenodd' clip-rule='evenodd' d='M8 7.5C9.933 7.5 11.5 5.933 11.5 4C11.5 2.067 9.933 0.5 8 0.5C6.067 0.5 4.5 2.067 4.5 4C4.5 5.933 6.067 7.5 8 7.5Z' stroke-linecap='round' stroke-linejoin='round'></path><path d='M1.5 15.5C1.5 11.9101 4.41015 9.5 8 9.5C11.5898 9.5 14.5 11.9101 14.5 15.5' stroke-linecap='round' stroke-linejoin='round'></path></svg> "+$(podaci).find("div[class^='UserSummary_userNameHolder__'] > span:not([class^='Badge_badgeHolder__'])").text()+'<span id="userOnline"></span>');
				   $('.kpp_modal_info .kpp_modal_korisnik_details').html($(podaci).find("div[class^='UserSummary_userDetails__'] > div").html());
				   $('.kpp_modal_info .kpp_modal_ocene').html('Ocene: '+oceneUrl);
				   $('.kpp_modal_info .kpp_modal_poseti').html('<a href="'+url+'" target="_blank" class="kpp_pop_otvori_oglas" title="Otvori oglas u novoj kartici">Otvori oglas <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14" height="14" viewBox="0,0,256,256" style="fill:#000000;vertical-align:middle;"><g fill="#307dc1" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(2,2)"><path d="M84,11c-1.7,0 -3,1.3 -3,3c0,1.7 1.3,3 3,3h22.80078l-46.40039,46.40039c-1.2,1.2 -1.2,3.09922 0,4.19922c0.6,0.6 1.39961,0.90039 2.09961,0.90039c0.7,0 1.49961,-0.30039 2.09961,-0.90039l46.40039,-46.40039v22.80078c0,1.7 1.3,3 3,3c1.7,0 3,-1.3 3,-3v-30c0,-1.7 -1.3,-3 -3,-3zM24,31c-7.2,0 -13,5.8 -13,13v60c0,7.2 5.8,13 13,13h60c7.2,0 13,-5.8 13,-13v-45c0,-1.7 -1.3,-3 -3,-3c-1.7,0 -3,1.3 -3,3v45c0,3.9 -3.1,7 -7,7h-60c-3.9,0 -7,-3.1 -7,-7v-60c0,-3.9 3.1,-7 7,-7h45c1.7,0 3,-1.3 3,-3c0,-1.7 -1.3,-3 -3,-3z"></path></g></g></svg></a>');
				   $('.kpp_modal_desc .desc_data').html($(podaci).find("section[class*='AdPage_adInfoBox__'] > div[class^='Grid_row__']").html());
				   
				   var nextData = $(podaci).filter('script#__NEXT_DATA__').text();
					var jsonObject = JSON.parse(nextData);
					var next = jsonObject["props"]["pageProps"]["initialState"]["ad"]["byId"][oglasid];
					
					if(next != null){
						if(next.ownerPhone != ""){
							$('.kpp_modal_tel').html('Telefon: '+next.ownerPhone);
						} else if(next.jobApplicationLink != ""){ // Ako je ad tipa Job i postoji link za apliciranje
							$('.kpp_modal_tel').html('Kontakt: <a title="Poseti sajt korisnika u novom tabu" class="kpp_pop_otvori_oglas" href="'+next.jobApplicationLink+'" rel="nofollow" target="_blank">Sajt korisnika <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14" height="14" viewBox="0,0,256,256" style="fill:#000000;vertical-align:middle;"><g fill="#307dc1" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(2,2)"><path d="M84,11c-1.7,0 -3,1.3 -3,3c0,1.7 1.3,3 3,3h22.80078l-46.40039,46.40039c-1.2,1.2 -1.2,3.09922 0,4.19922c0.6,0.6 1.39961,0.90039 2.09961,0.90039c0.7,0 1.49961,-0.30039 2.09961,-0.90039l46.40039,-46.40039v22.80078c0,1.7 1.3,3 3,3c1.7,0 3,-1.3 3,-3v-30c0,-1.7 -1.3,-3 -3,-3zM24,31c-7.2,0 -13,5.8 -13,13v60c0,7.2 5.8,13 13,13h60c7.2,0 13,-5.8 13,-13v-45c0,-1.7 -1.3,-3 -3,-3c-1.7,0 -3,1.3 -3,3v45c0,3.9 -3.1,7 -7,7h-60c-3.9,0 -7,-3.1 -7,-7v-60c0,-3.9 3.1,-7 7,-7h45c1.7,0 3,-1.3 3,-3c0,-1.7 -1.3,-3 -3,-3z"></path></g></g></svg></a>');
						}
						
						// Proveri status korisnika (offline/online/sakriven)
						if(next.user.isShowOnline == true){
							if(next.user.isOnline == true) {
								$('#userIcon').css('stroke','#6ab00f');
								$('.kpp_modal_info .kpp_modal_korisnik').attr("title","Korisnik je Online");
							} else {
								$('#userIcon').css('stroke','#f22e2e');
								$('.kpp_modal_info .kpp_modal_korisnik').attr("title","Korisnik je Offline");
							}
						} else { // Sakrio se
							$('#userIcon').css('stroke','');
							$('.kpp_modal_info .kpp_modal_korisnik').attr("title","Korisnik je sakrio svoj status");
						}
					}
			   },
			   error: function(err){
				    $("#kpp_modal_data").html("Greška u povlačenju podataka sa sajta. Proverite internet konekciju i da li je KP sajt dostupan. Potom osvežite stranicu i probajte opet.");
			   }
			});
			});

			$(document).mouseup(function(e) {
				var container = $("#kpp_modal_window");
				if (!container.is(e.target) && container.has(e.target).length === 0) {
					container.remove();
					$("#kpp_modal_holder").remove();
				}
			});

			$("body").on("click",".kpp_close_modal",function(){
				$("#kpp_modal_holder").remove();
			});

		} // isQuickView
		
		
		$( "body" ).on( "click",".zoomImgHolder", function(e){
			e.preventDefault();
			var bigImgUrl = $(this).data("bigimg");
			$(".kppLightbox").html('<div class="kpp_lightbox_holder"><img src="'+bigImgUrl+'"><span class="closeLightbox"><svg width="10" height="10" viewBox="0 0 8 8" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" class="asIcon_lightBlueStroke__GC9a2 asIcon_svg__Zm34q"><path d="M1 7L7 1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 7L1 1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div>').fadeIn(220);
			
		});
		
		$( ".kppLightbox" ).on( "click", function(){
			$(this).html("").fadeOut(200);
		});
		
		}); // doc ready
	} // mainApp
	
	$(document).keyup(function(e) {
		 if (e.key === "Escape") { // escape key maps to keycode `27`
			$( ".kppLightbox" ).html("").fadeOut(200);
			$("#kpp_modal_holder").remove();
		}
	});
	
} // main fn