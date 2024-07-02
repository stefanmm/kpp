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
			"--kp-color-bg-primary": "#181818",
			"--kp-color-bg-secondary": "#383838",
			"--kp-color-border-default": "#393939",
			"--kp-color-content-interactive-secondary": "#dddddd",
			"--kp-color-content-interactive-primary": "#8acaef",
			"--kp-color-content-regular-primary": "#dddddd",
			"--kp-color-content-accent-secondary": "#007dff",
			"--kp-color-brand-logo-navy-blue": "#dddddd",
			"--kp-color-form-bg-input": "#272727",
			"--kp-color-form-border-default": "#424242",
			"--kp-color-form-bg-control": "#424242",
			"--kp-color-form-bg-control-hover": "#585858",
			"--kp-color-form-bg-selected": "#585858",
			"--kp-color-fill-neutral": "#2f2f2f",
			"--kp-color-fill-neutral-dim": "#4f4f4f",
			"--kp-color-fill-interactive-secondary": "#1e5676",
			"--kp-color-fill-interactive-secondary-hover": "#3589b9",
			"--kp-color-bg-info": "#0d1920",
			"--kp-color-fill-skeleton-dim": "#464646",
			"--kp-color-bg-warning": "#372c00",
			"--kp-color-fill-ZO-dim": "#574208",
			"--kp-color-content-ZO": "#fed388",
			"--kp-color-content-regular-secondary": "#979797",
			"--kp-color-bg-alert": "#411d19",
			"--color-primary-black": "#fff",
			"--color-primary-white": "#000",
			"--color-secondary-bg-blue": "#034263",
			"--color-grayscale-elm-1": "#275386",
			"--color-primary-navy-blue": "#5594d6",
			"--color-primary-gray": "#303030",
			"--kp-color-brand-monogram-navy-blue": "#2d94ff",
			"--kp-color-fill-poslovi": " #487111",
			"--kp-color-bg-base": " #4e4e4e",
			"--kp-color-bg-tertiary": " #4a617c",

		});
		
	} else {
		document.documentElement.classList.remove('kpp_night');
		$(":root").css({
			"--kp-color-bg-primary": "",
			"--kp-color-bg-secondary": "",
			"--kp-color-border-default": "",
			"--kp-color-content-interactive-secondary": "",
			"--kp-color-content-interactive-primary": "",
			"--kp-color-content-regular-primary": "",
			"--kp-color-content-accent-secondary": "",
			"--kp-color-brand-logo-navy-blue": "",
			"--kp-color-form-bg-input": "",
			"--kp-color-form-border-default": "",
			"--kp-color-form-bg-control": "",
			"--kp-color-form-bg-control-hover": "",
			"--kp-color-form-bg-selected": "",
			"--kp-color-fill-neutral": "",
			"--kp-color-fill-neutral-dim": "",
			"--kp-color-fill-interactive-secondary": "",
			"--kp-color-fill-interactive-secondary-hover": "",
			"--kp-color-bg-info": "",
			"--kp-color-fill-skeleton-dim": "",
			"--kp-color-bg-warning": "",
			"--kp-color-fill-ZO-dim": "",
			"--kp-color-content-ZO": "",
			"--kp-color-content-regular-secondary": "",
			"--kp-color-bg-alert": "",
			"--color-primary-black": "",
			"--color-primary-white": "",
			"--color-secondary-bg-blue": "",
			"--color-grayscale-elm-1": "",
			"--color-primary-navy-blue": "",
			"--color-primary-gray": "",
			"--kp-color-brand-monogram-navy-blue": "",
			"--kp-color-fill-poslovi": "",
			"--kp-color-bg-base": "",
			"--kp-color-bg-tertiary": "",

		});

		
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
				var floatImg = $("meta[property='og:image']").attr("content"); 
				
				if( !floatImg.includes("static/images/meta/original.png") ){
					var floatImg = '<img src="'+$("meta[property='og:image']").attr("content")+'" alt="slika" />'; 
				} else {
					var floatImg = "";
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
				   var nextData = $(podaci).filter('script#__NEXT_DATA__').text();
					var jsonObject = JSON.parse(nextData);
					
					if(jsonObject && oglasid) {
						
						var next = findKeyInObject(jsonObject, oglasid);
						
					} 
					if(typeof next === 'undefined'){ return; }
					
				   $("#kpp_modal_data").html('\
					<div id="drag_box" class="kpp_modal_title kpp_row">Učitavanje...</div>\
					<div class="kpp_modal_info">\
						<div class="photo-col" id="kppGalleryHolder">Učitavanje...</div>\
						<div class="contact-col">\
							<div class="kpp_modal_single_info kpp_modal_cena"></div>\
							<div class="kpp_modal_korisnik_wrap kpp_modal_single_info">\
								<div class="kpp_modal_korisnik"></div>\
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
				  
				   // Popuni modal
				   $('.kpp_modal_title').html('<a href="'+url+'" class="kpp_pop_title" title="Otvori oglas u novoj kartici" target="_blank">'+next.formattedName+'</a>');
				   
				   if(next.adKind == "job"){
					   $('.kpp_modal_info .kpp_modal_cena').html(next.priceText);
				   } else {
					   $('.kpp_modal_info .kpp_modal_cena').html("Cena: "+next.priceText);
				   }
				   
				   $('.kpp_modal_info .kpp_modal_korisnik').html("<svg id='userIcon' stroke='#181818' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' ><path fill-rule='evenodd' clip-rule='evenodd' d='M8 7.5C9.933 7.5 11.5 5.933 11.5 4C11.5 2.067 9.933 0.5 8 0.5C6.067 0.5 4.5 2.067 4.5 4C4.5 5.933 6.067 7.5 8 7.5Z' stroke-linecap='round' stroke-linejoin='round'></path><path d='M1.5 15.5C1.5 11.9101 4.41015 9.5 8 9.5C11.5898 9.5 14.5 11.9101 14.5 15.5' stroke-linecap='round' stroke-linejoin='round'></path></svg> "+next.user.username+'<span id="userOnline"></span>'+'<br>Član od '+next.user.created+'<br>'+next.user.userLocation);
				   
				   $('.kpp_modal_info .kpp_modal_ocene').html('Ocene: <span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="asIcon_blueStroke__lvaue asIcon_svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 14.5C3.85146 14.5053 4.37134 14.7235 4.70932 14.82L6.902 15.346C7.25908 15.4481 7.62863 15.4999 8 15.5H11.2567C13.3109 15.5 15.2946 14.044 15.5 12V8.66667C15.5 7.00395 14.4568 5.95245 13.0667 5.604L12.2593 5.392C11.8132 5.28139 11.5 4.88095 11.5 4.42134V2.16667C11.5 1.33824 10.8284 0.5 10 0.5C9.17157 0.5 8.47261 1.33824 8.47261 2.16667V3.20267C8.47261 5.9641 6.26142 8.5 3.5 8.5V14.5Z" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M0.499939 6.5H3.49994L3.49996 15.5H0.5L0.499939 6.5Z" stroke-linecap="round" stroke-linejoin="round"></path></svg><span class="ReviewThumbLinks_positive">'+next.user.reviewsPositive+'</span></span><span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="asIcon_blueStroke__lvaue asIcon_svg__Zm34q"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 1.5C3.85146 1.49475 4.53803 1.40785 4.87601 1.31133L6.902 0.654003C7.25908 0.551948 7.62863 0.500116 8 0.500003H11.2567C13.3109 0.499977 15.2946 3.1227 15.5 5.16666V7.49999C15.5 9 14.6234 10.2142 13.2333 10.5627L12.2593 10.7747C11.8132 10.8853 11.5 11.2857 11.5 11.7453V14C11.5 14.8284 10.8284 15.5 10 15.5C9.17157 15.5 8.50401 14.8284 8.50401 14V12.964C8.50401 10.2026 6.26142 7.5 3.5 7.5V1.5Z" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 9.50002H3.5V0.500011H0.5V9.50002Z" stroke-linecap="round" stroke-linejoin="round"></path></svg><span class="ReviewThumbLinks_negative">'+next.user.reviewsNegative+'</span></span>');
				   
				   $('.kpp_modal_info .kpp_modal_poseti').html('<a href="'+url+'" target="_blank" class="kpp_pop_otvori_oglas" title="Otvori oglas u novoj kartici">Otvori oglas <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0,0,256,256" style="fill:#000000;vertical-align:middle;"><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(2,2)"><path d="M84,11c-1.7,0 -3,1.3 -3,3c0,1.7 1.3,3 3,3h22.80078l-46.40039,46.40039c-1.2,1.2 -1.2,3.09922 0,4.19922c0.6,0.6 1.39961,0.90039 2.09961,0.90039c0.7,0 1.49961,-0.30039 2.09961,-0.90039l46.40039,-46.40039v22.80078c0,1.7 1.3,3 3,3c1.7,0 3,-1.3 3,-3v-30c0,-1.7 -1.3,-3 -3,-3zM24,31c-7.2,0 -13,5.8 -13,13v60c0,7.2 5.8,13 13,13h60c7.2,0 13,-5.8 13,-13v-45c0,-1.7 -1.3,-3 -3,-3c-1.7,0 -3,1.3 -3,3v45c0,3.9 -3.1,7 -7,7h-60c-3.9,0 -7,-3.1 -7,-7v-60c0,-3.9 3.1,-7 7,-7h45c1.7,0 3,-1.3 3,-3c0,-1.7 -1.3,-3 -3,-3z"></path></g></g></svg></a>');
				   
				   
				   if(next.website != "") {
					   var website = '<section class="kpp_modal_desc_site"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.72133 6.50002C6.15717 5.86544 5.3491 5.50166 4.5 5.50002H3.5C1.84315 5.50002 0.5 6.84316 0.5 8.50002C0.5 10.1569 1.84315 11.5 3.5 11.5H4.5C5.34902 11.498 6.15696 11.1343 6.72133 10.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.27869 6.5C9.8428 5.86535 10.6509 5.50156 11.5 5.5H12.5C14.1569 5.5 15.5 6.67648 15.5 8.33334C15.5 9.99019 14.1569 11.5 12.5 11.5H11.5C10.651 11.4982 9.84295 11.1344 9.27869 10.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.5 8.50002H11.5" stroke-linecap="round" stroke-linejoin="round"></path></svg> <a aria-label="Posetite websajt" target="_blank" id="" role="button" tabindex="-1" href="'+next.website+'">Posetite websajt</a></section>';
				   } else {
					   var website = "";
				   }
				   
				   if(next.video != "") {
					   var video = '<section class="kpp_modal_desc_site"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.47498 5.76666V10.5917L10.525 8.14166L6.47498 5.76666Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M2.975 3.41666C2.83214 3.41666 2.69175 3.42729 2.55528 3.44804C1.53099 3.6239 0.75 4.51767 0.75 5.59166V10.7167C0.75 11.9167 1.775 12.9167 2.975 12.9167H13.05C13.6596 12.9167 14.2112 12.665 14.6063 12.2601C14.9901 11.8606 15.225 11.3134 15.225 10.7167V5.36666C15.225 5.32317 15.2238 5.28024 15.2213 5.23789C15.052 4.20576 14.1546 3.41666 13.075 3.41666H2.975ZM13.075 12.1667H2.95C2.86851 12.1667 2.78633 12.1568 2.70475 12.1383C2.02528 12.0905 1.5 11.5346 1.5 10.8417V5.36666C1.5 5.11977 1.58697 4.90187 1.73031 4.72185C1.96374 4.38483 2.35341 4.16666 2.8 4.16666H13.075C13.8 4.16666 14.475 4.64166 14.475 5.36666V10.7167C14.475 11.4417 13.8 12.1667 13.075 12.1667Z"></path></svg> <a aria-label="Pustite video" target="_blank" id="" role="button" tabindex="-1" href="'+next.video+'">Pogledajte video</a></section>';
				   } else {
					   var video = "";
				   }
				   $('.kpp_modal_desc .desc_data').html(website+video+next.description);
				   

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
					
					if(Array.isArray(galeryArray) && galeryArray.length > 0 ){
					
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