// Saves options to chrome.storage
function save_options() {
  
  var quick_view = document.getElementById('opt_quick_view').checked;
  var night_mode = document.getElementById('opt_night_mode').checked;
  var night_mode_auto = document.getElementById('opt_night_mode_auto').checked;
  var night_mode_addad = document.getElementById('opt_night_mode_addad').checked;
  var bigimg = document.getElementById('opt_bigimg').checked;
  var floatInfo = document.getElementById('opt_floatInfo').checked;
  var wideSite = document.getElementById('opt_wideSite').checked;

  chrome.storage.sync.set({
    quick_view: quick_view,
	night_mode: night_mode,
	night_mode_auto: night_mode_auto,
	bigimg: bigimg,
	floatInfo: floatInfo,
	night_mode_addad: night_mode_addad,
	wideSite: wideSite
  }, function() {
    var status = document.getElementById('status');
	
    status.innerHTML = 'Opcije su sačuvane <span id="opcijeReloadSite"> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABC0lEQVR4nJ3TO04DUQwF0AQBC4CGil9oQ9bABsIGWELEp0KCsJfsIi0oW4CeTyQ6PhV0B1l40GSYiSCWLD09+15f2++1WjWGNnrop+/HXTWnDriKM0x920d62D2OsYxzjKrgdUzwggtsl2K7GOI9c0YYVytPcIvNhrai8gGeU9EMwWlWrgVnzpFZG5cHNg3ZTeDMW4q2sp3wjSLQS8adeQTzmA9j0gvgrrBXEHzW7rUZ3M719hdqAZ3EdAu2J1z+U/7Dj2qc4BVbfwDHJt4wKF+u4CYfUiNJgu9wHZhqMJ5ykISSeLadSs8hOyoHeK2pQiiJD/NY+kyxobDoefCrcgNRDLZb+s5xrl3zFxmenz2CEuYiAAAAAElFTkSuQmCC" style="vertical-align: bottom;"> Osveži sve KP tabove</span>';
	status.style.opacity ="1";
    setTimeout(function() {
      status.innerHTML = '';
	  status.style.opacity ="0";
    }, 7000);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    quick_view: true,
	night_mode: true,
	night_mode_auto: true,
	bigimg: true,
	floatInfo: true,
	night_mode_addad: false,
	wideSite: true
  }, function(items) {
	  
	
    document.getElementById('opt_quick_view').checked = items.quick_view;
    document.getElementById('opt_night_mode').checked = items.night_mode;
    document.getElementById('opt_night_mode_auto').checked = items.night_mode_auto;
    document.getElementById('opt_night_mode_addad').checked = items.night_mode_addad;
    document.getElementById('opt_bigimg').checked = items.bigimg;
    document.getElementById('opt_floatInfo').checked = items.floatInfo;
    document.getElementById('opt_wideSite').checked = items.wideSite;
	
	if (document.getElementById('opt_night_mode').checked == true){
		document.getElementById("nightAuto").style.display = "block";
	} else {
		document.getElementById("nightAuto").style.display = "none";
	}
  });
}

document.addEventListener('DOMContentLoaded', restore_options);


/* ****************************************************************************** */
/* *********************** HOOK NA CHANGE EVENT ZA OPCIJE *********************** */
/* ****************************************************************************** */
document.getElementById('opt_night_mode').addEventListener('change', (event) => {
  if (event.target.checked) {
    document.getElementById("nightAuto").style.display = "block";
  } else {
    document.getElementById("nightAuto").style.display = "none";
  }
  save_options();
});
document.getElementById('opt_quick_view').addEventListener('change', (event) => {
	save_options();
});
document.getElementById('opt_night_mode_auto').addEventListener('change', (event) => {
	save_options();
});
document.getElementById('opt_night_mode_addad').addEventListener('change', (event) => {
	save_options();
});
document.getElementById('opt_bigimg').addEventListener('change', (event) => {
	save_options();
});
document.getElementById('opt_floatInfo').addEventListener('change', (event) => {
	save_options();
});
document.getElementById('opt_wideSite').addEventListener('change', (event) => {
	save_options();
});

/* ****************************************************************************** */
/* *********************** PRIKAŽI ILI SAKRIJ OPIS OPCIJE *********************** */
/* ****************************************************************************** */
document.getElementById("qucikShowImg").onclick = function() {
    document.getElementById("close_quickview_img").src = chrome.runtime.getURL("prezentacija/quickview.png");
	document.getElementById("quickview_pres").style.display = "block";
};
document.getElementById("close_quickview").onclick = function() {
	document.getElementById("quickview_pres").style.display = "none";
};

document.getElementById("nightShowImg").onclick = function() {
    document.getElementById("close_nightmode_img").src = chrome.runtime.getURL("prezentacija/darkmode.png");
	document.getElementById("nightmode_pres").style.display = "block";
};
document.getElementById("close_nightmode").onclick = function() {
	document.getElementById("nightmode_pres").style.display = "none";
};

document.getElementById("bigimgShowImg").onclick = function() {
    document.getElementById("close_bigimg_img").src = chrome.runtime.getURL("prezentacija/bigimg.png");
	document.getElementById("bigimg_pres").style.display = "block";
};
document.getElementById("close_bigimg").onclick = function() {
	document.getElementById("bigimg_pres").style.display = "none";
};

document.getElementById("floatInfoShowImg").onclick = function() {
    document.getElementById("close_floatInfo_img").src = chrome.runtime.getURL("prezentacija/floatinfo.png");
	document.getElementById("floatInfo_pres").style.display = "block";
};
document.getElementById("close_floatInfo").onclick = function() {
	document.getElementById("floatInfo_pres").style.display = "none";
};

document.getElementById("wideSiteShowImg").onclick = function() {
    document.getElementById("close_wideSite_img").src = chrome.runtime.getURL("prezentacija/widesite.png");
	document.getElementById("wideSite_pres").style.display = "block";
};
document.getElementById("close_wideSite").onclick = function() {
	document.getElementById("wideSite_pres").style.display = "none";
};


/* ****************************************************************************** */
/* ************************ RELOAD SVE KP TABOVE NA KLIK ************************ */
/* ****************************************************************************** */
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'opcijeReloadSite') {
      chrome.tabs.query({ url: 'https://novi.kupujemprodajem.com/*' }, function(tabs) {
        tabs.forEach(function(tab) {
          chrome.tabs.reload(tab.id);
        });
      });
	  document.getElementById('status').innerHTML = "";
    }
  });
});