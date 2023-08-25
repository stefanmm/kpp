// ---------------------------------------------
// Author: Stefan Marjanov - stefanmarjanov.com
// ---------------------------------------------
if (typeof browser === "undefined") {
    var browser = chrome;
}

// Preuzmi user opcije i prosledi u init
browser.storage.sync.get({
	quick_view: true,
	night_mode: true,
	bigimg: true,
	floatInfo: true,
	night_mode_auto: true,
	night_mode_addad: false,
	wideSite: true
	},(items) => {
	init([items.quick_view, items.night_mode, items.bigimg, items.floatInfo, items.night_mode_auto, items.night_mode_addad, items.wideSite]);
});

function applyColors(tip = "dark"){
	if(tip == "dark"){
		document.documentElement.classList.add('kpp_night');
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
		$('svg[class^="Logo_svgLogo__"] g path[fill="#003368"]').attr('fill', '#ffffff');
		
	} else {
		document.documentElement.classList.remove('kpp_night');
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
		$('svg[class^="Logo_svgLogo__"] g path[fill="#ffffff"]').attr('fill', '#003368');
		
	}
}

function checkColorMode(isNightMode, isNightAddad, isAddAdPage, isNightAuto, isSystemDark ){
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
}

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

function findKeyInObject(obj, targetKey) {
	
	if (typeof obj !== 'object' || obj === null) {
		return null;
	}

	if (targetKey in obj) {
		return obj[targetKey];
	}

	for (const key in obj) {
		const result = findKeyInObject(obj[key], targetKey);
		if (result !== null) {
			return result;
		}
	}
	
	return null;
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
	var href = window.location.href;
	var isAddAdPage = (href.indexOf("/postavljanje-oglasa") > -1) ? true : false; // Proveri stranicu prilikom load-a
	
	// Uraditi proveru što pre kako bismo izbegli "white flash" prilikom učitavanja stranice
	// (fn se poziva samo prilikom page refresh)
	checkColorMode(isNightMode, isNightAddad, isAddAdPage, isNightAuto, isSystemDark);
	
	if( isWideSite ){
		document.documentElement.classList.add('kpp_wide');
	} else {
		document.documentElement.classList.remove('kpp_wide');
	}
	
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
	$("body").off("click",".openLightbox");
	$(".adImgHolder").off("click");
	$(".kppLightbox").off("click");
	if($("#kpp_float_holder").length > 0){
		$("#kpp_float_holder").remove();
	}
	if($("#kpp_modal_holder").length > 0){
		$("#kpp_modal_holder").remove();
	}
	
	// SPA menja URL i ne osvežava stranicu - proveri URL
	var isSingle = (href.indexOf("/oglas") > -1) ? true : false;
	var isGrupa = ( href.indexOf("/grupa") > -1 || href.indexOf("/pretraga") > -1 || href.indexOf("/najnoviji") > -1 || href.indexOf("/svi-oglasi") > -1  ) ? true : false;
	var isAddAdPage = (href.indexOf("/postavljanje-oglasa") > -1) ? true : false;
	
	$(document.body).ready(function() { // Sačekaj da se html učita (samo za first time load)
	
		// Potrebno je i ovde proveriti ako želimo da manipulišemo DOM u zavisnosti od Night mode
		// (fn se poziva samo prilikom navigacije)
		checkColorMode(isNightMode, isNightAddad, isAddAdPage, isNightAuto, isSystemDark);
		
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
						$("article[class^='AdItem_adHolder__']",$(this)).prepend('<div class="openLightbox zoomImgHolder" data-bigimg="'+big_img+'"><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"><path d="M13 10h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2zm8.172 14l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"/></svg></div>');
						
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
			
			// Oko ovog posla 5 dana...
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
				   $("#kpp_modal_data").html('\
					<div id="drag_box" class="kpp_modal_title kpp_row">Učitavanje...</div>\
					<div class="kpp_modal_info">\
						<div class="photo-col" id="kppGalleryHolder">Učitavanje...</div>\
						<div class="contact-col">\
							<div class="kpp_modal_single_info kpp_modal_cena"></div>\
							<div class="kpp_modal_korisnik_wrap kpp_modal_single_info">\
								<div class="kpp_modal_korisnik"></div>\
								<div class="kpp_modal_korisnik_details"></div>\
							</div>\
							<div class="kpp_modal_single_info kpp_modal_ocene">\
							</div>\
							<div class="kpp_modal_single_info kpp_modal_tel">\
							</div>\
							<div class="kpp_modal_single_info kpp_modal_poseti btn_holder"></div>\
						</div>\
					</div>\
					<div class="kpp_modal_desc kpp_row"><div class="desc_data">Učitavanje...</div></div>\
				   ');
				   
				   var ocene = $(podaci).find("div[class^='ReviewThumbLinks_reviewsHolder__']").html();
				   var oceneUrl = "Nema ocena";
					
				   if(typeof ocene !== "undefined" && ocene !== "" ){
					   var oceneUrl = ocene;
				   }
				  
				   // Popuni modal
				   $('.kpp_modal_title').html('<a href="'+url+'" class="kpp_pop_title" title="Otvori oglas u novoj kartici" target="_blank">'+$(podaci).find("h1[class^='AdViewInfo_name__']").text()+'</a>');
				   $('.kpp_modal_info .kpp_modal_cena').html($(podaci).find("h2[class^='AdViewInfo_price__']").text());
				   $('.kpp_modal_info .kpp_modal_korisnik').html("<svg id='userIcon' stroke='#181818' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' ><path fill-rule='evenodd' clip-rule='evenodd' d='M8 7.5C9.933 7.5 11.5 5.933 11.5 4C11.5 2.067 9.933 0.5 8 0.5C6.067 0.5 4.5 2.067 4.5 4C4.5 5.933 6.067 7.5 8 7.5Z' stroke-linecap='round' stroke-linejoin='round'></path><path d='M1.5 15.5C1.5 11.9101 4.41015 9.5 8 9.5C11.5898 9.5 14.5 11.9101 14.5 15.5' stroke-linecap='round' stroke-linejoin='round'></path></svg> "+$(podaci).find("div[class^='UserSummary_userNameHolder__'] > span:not([class^='Badge_badgeHolder__'])").text()+'<span id="userOnline"></span>');
				   $('.kpp_modal_info .kpp_modal_korisnik_details').html($(podaci).find("div[class^='UserSummary_userDetails__'] > div").html());
				   $('.kpp_modal_info .kpp_modal_ocene').html('Ocene: '+oceneUrl);
				   $('.kpp_modal_info .kpp_modal_poseti').html('<a href="'+url+'" target="_blank" class="kpp_pop_otvori_oglas" title="Otvori oglas u novoj kartici">Otvori oglas <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0,0,256,256" style="fill:#000000;vertical-align:middle;"><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(2,2)"><path d="M84,11c-1.7,0 -3,1.3 -3,3c0,1.7 1.3,3 3,3h22.80078l-46.40039,46.40039c-1.2,1.2 -1.2,3.09922 0,4.19922c0.6,0.6 1.39961,0.90039 2.09961,0.90039c0.7,0 1.49961,-0.30039 2.09961,-0.90039l46.40039,-46.40039v22.80078c0,1.7 1.3,3 3,3c1.7,0 3,-1.3 3,-3v-30c0,-1.7 -1.3,-3 -3,-3zM24,31c-7.2,0 -13,5.8 -13,13v60c0,7.2 5.8,13 13,13h60c7.2,0 13,-5.8 13,-13v-45c0,-1.7 -1.3,-3 -3,-3c-1.7,0 -3,1.3 -3,3v45c0,3.9 -3.1,7 -7,7h-60c-3.9,0 -7,-3.1 -7,-7v-60c0,-3.9 3.1,-7 7,-7h45c1.7,0 3,-1.3 3,-3c0,-1.7 -1.3,-3 -3,-3z"></path></g></g></svg></a>');
				   $('.kpp_modal_desc .desc_data').html($(podaci).find("section[class*='AdPage_adInfoBox__'] > div[class^='Grid_row__']").html());
				   
				   var nextData = $(podaci).filter('script#__NEXT_DATA__').text();
					var jsonObject = JSON.parse(nextData);
					if(jsonObject && oglasid) {
						
						var next = findKeyInObject(jsonObject, oglasid);
						
					}
					
					if(typeof next !== 'undefined'){
						
						// Phone
						if(next.ownerPhone != ""){
							$('.kpp_modal_tel').html('Telefon: '+next.ownerPhone);
						} else if(next.jobApplicationLink != ""){ // Ako je ad tipa Job i postoji link za apliciranje
							$('.kpp_modal_tel').html('Kontakt: <a title="Poseti sajt korisnika u novom tabu" class="kpp_pop_external_link" href="'+next.jobApplicationLink+'" rel="nofollow" target="_blank">Sajt korisnika <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0,0,256,256" style="fill:#000000;vertical-align:middle;"><g fill="#2099dc" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(2,2)"><path d="M84,11c-1.7,0 -3,1.3 -3,3c0,1.7 1.3,3 3,3h22.80078l-46.40039,46.40039c-1.2,1.2 -1.2,3.09922 0,4.19922c0.6,0.6 1.39961,0.90039 2.09961,0.90039c0.7,0 1.49961,-0.30039 2.09961,-0.90039l46.40039,-46.40039v22.80078c0,1.7 1.3,3 3,3c1.7,0 3,-1.3 3,-3v-30c0,-1.7 -1.3,-3 -3,-3zM24,31c-7.2,0 -13,5.8 -13,13v60c0,7.2 5.8,13 13,13h60c7.2,0 13,-5.8 13,-13v-45c0,-1.7 -1.3,-3 -3,-3c-1.7,0 -3,1.3 -3,3v45c0,3.9 -3.1,7 -7,7h-60c-3.9,0 -7,-3.1 -7,-7v-60c0,-3.9 3.1,-7 7,-7h45c1.7,0 3,-1.3 3,-3c0,-1.7 -1.3,-3 -3,-3z"></path></g></g></svg></a>');
						} else {
							$('.kpp_modal_tel').remove();
						}
						
						// KP izlog
						if( next.kpizlog == true && next.user.kpizlogUrl != "" ){
							$('.kpp_modal_info .kpp_modal_poseti').append('<a href="'+next.user.kpizlogUrl+'" target="_blank" class="kpp_pop_otvori_oglas kpp_kpizlog" title="Otvori KP izlog u novoj kartici"><span class="kp_monogram_k">k</span><span class="kp_monogram_p">p</span> Izlog</a>');
						}
						
						// Info box
						if( next.user.infoBox != "" ){
							$('.kpp_modal_desc').append('<div class="desc_data dodatne_informacije_korisnik"><section class="AdViewDescription_descriptionHolder__"><p style="margin-bottom:10px;font-weight: bold;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="dodatne_informacije_korisnik_svg "><path fill-rule="evenodd" clip-rule="evenodd" d="M8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.5 11H9C8.44772 11 8 10.5523 8 10V7.5C8 7.22386 7.77614 7 7.5 7H7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.75 4.5C7.61193 4.5 7.5 4.61193 7.5 4.75C7.5 4.88807 7.61193 5 7.75 5C7.88807 5 8 4.88807 8 4.75C8 4.61193 7.88807 4.5 7.75 4.5V4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg> Informacije:</p>'+next.user.infoBox+'</section></div>');
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
						
						// Galerija
						var galeryArray = next.photos;
						
						if(Array.isArray(galeryArray) && galeryArray.length > 1 ){ // Imamo galeriju i galerija ima više od 1 slike (jer ako ima samo jednu, onda to i nije baš galerija)
						
							var big_img = true;
							$("#kppGalleryHolder").html('<section id="main-carousel" class="splide"><div class="splide__track"><ul class="splide__list"></ul></div></section><section id="thumbnail-carousel" class="splide"><div class="splide__track"><ul class="splide__list"></ul></div></section>');
							$.each(galeryArray, function( index, value ) {
								$("#thumbnail-carousel ul.splide__list").append('<li class="splide__slide"><img data-splide-lazy="'+value.thumbnail+'" alt="umanjena slika oglasa"></li>');
								
								$("#main-carousel ul.splide__list").append('<li class="splide__slide"><img class="openLightbox" data-bigimg="'+value.fullscreen+'" data-splide-lazy="'+value.original+'" alt="slika oglasa"></li>');
								
							});
							var mainSlider = new Splide( '#main-carousel', {
								type      : 'fade',
								rewind    : true,
								pagination: false,
								arrows    : true,
								lazyLoad  : 'nearby',
								preloadPages: 1
							  } );

							  var thumbnailsSlider = new Splide( '#thumbnail-carousel', {
								fixedWidth  : 100,
								fixedHeight : 60,
								gap         : 0,
								rewind      : true,
								pagination  : false,
								isNavigation: true,
								lazyLoad  : 'nearby',
								preloadPages: 3,
								focus      : 'center',
								breakpoints : {
								  600: {
									fixedWidth : 60,
									fixedHeight: 44,
								  },
								},
							  } );

							  mainSlider.sync( thumbnailsSlider );
							  mainSlider.mount();
							  thumbnailsSlider.mount();
						}
					} // next podaci
					
					if(!big_img) { // Ako nemamo galeriju ili joj se nešto (pu pu pu) desilo, prikažu običnu sliku
					
						var big_img = $(podaci).find("div[class^='AdViewInfo_imageHolder__'] img").attr('src');
						if(big_img){ // Ima makar jednu sliku
						
							var full_img = big_img.replace('tmb-300x300-', ''); // Zameni umanjenu sliku sa najvećom
							big_img = big_img.replace('tmb-300x300-', 'big-'); // Zameni umanjenu sliku sa malo većom
							
							$('.kpp_modal_info .photo-col').html('<img class="openLightbox" data-bigimg="'+full_img+'" src="'+big_img+'" />');
						} else { // Nema nijednu baš sliku?! Ok, prikaži šta ima
							$('.kpp_modal_info .photo-col').html( $(podaci).find("div[class^='AdViewInfo_imageHolder__']").html() );
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
				
				if (!container.is(e.target) && container.has(e.target).length === 0 && e.target.className != "kpp_lightbox_holder" && e.target.className != "lightboximg"  && e.target.className != "kppLightbox" ) {
					container.remove();
					$("#kpp_modal_holder").remove();
				}
			});

			$("body").on("click",".kpp_close_modal",function(){
				$("#kpp_modal_holder").remove();
			});

		} // isQuickView
		
		
		$( "body" ).on( "click",".openLightbox", function(e){
			e.preventDefault();
			
			var bigImgUrl = false;
			
			if( $(this).data("bigimg") != "" ){
				bigImgUrl = $(this).data("bigimg");
			} else if( $(this).prop("currentSrc") != undefined ) {
				bigImgUrl = $(this).prop("currentSrc");
			}
			
			if(bigImgUrl != false){
				$(".kppLightbox").html('<div class="kpp_lightbox_holder"><img class="lightboximg" src="'+bigImgUrl+'"><span class="closeLightbox"><svg width="10" height="10" viewBox="0 0 8 8" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" class="asIcon_lightBlueStroke__GC9a2 asIcon_svg__Zm34q"><path d="M1 7L7 1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 7L1 1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div>').fadeIn(220);
			}
			
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