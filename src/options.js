// Saves options to chrome.storage
function save_options() {
  
  var hover_likes = document.getElementById('opt_hover_likes').checked;
  var quick_view = document.getElementById('opt_quick_view').checked;
  var night_mode = document.getElementById('opt_night_mode').checked;
  var night_mode_auto = document.getElementById('opt_night_mode_auto').checked;
  var night_mode_addad = document.getElementById('opt_night_mode_addad').checked;
  var bigimg = document.getElementById('opt_bigimg').checked;
  var floatInfo = document.getElementById('opt_floatInfo').checked;

  chrome.storage.sync.set({
    hover_likes: hover_likes,
    quick_view: quick_view,
	night_mode: night_mode,
	night_mode_auto: night_mode_auto,
	bigimg: bigimg,
	floatInfo: floatInfo,
	night_mode_addad: night_mode_addad
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Opcije su sačuvane. Osvežite sajt.';
	status.style.opacity ="1";
    setTimeout(function() {
      status.textContent = '';
	  status.style.opacity ="0";
    }, 5000);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    hover_likes: true,
    quick_view: true,
	night_mode: true,
	night_mode_auto: false,
	bigimg: true,
	floatInfo: true,
	night_mode_addad: false
  }, function(items) {
	  
	
    document.getElementById('opt_hover_likes').checked = items.hover_likes;
    document.getElementById('opt_quick_view').checked = items.quick_view;
    document.getElementById('opt_night_mode').checked = items.night_mode;
    document.getElementById('opt_night_mode_auto').checked = items.night_mode_auto;
    document.getElementById('opt_night_mode_addad').checked = items.night_mode_addad;
    document.getElementById('opt_bigimg').checked = items.bigimg;
    document.getElementById('opt_floatInfo').checked = items.floatInfo;
	
	if (document.getElementById('opt_night_mode').checked == true){
		document.getElementById("nightAuto").style.display = "block";
	} else {
		document.getElementById("nightAuto").style.display = "none";
	}
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
	
document.getElementById('opt_night_mode').addEventListener('change', (event) => {
  if (event.target.checked) {
    document.getElementById("nightAuto").style.display = "block";
  } else {
    document.getElementById("nightAuto").style.display = "none";
  }
})

document.getElementById("hoverShowImg").onclick = function() {
    document.getElementById("close_hoverLikes_img").src = chrome.runtime.getURL("prezentacija/hoverlikes.jpg");
	document.getElementById("hoverLikes_pres").style.display = "block";
};
document.getElementById("close_hoverLikes").onclick = function() {
	document.getElementById("hoverLikes_pres").style.display = "none";
};


document.getElementById("qucikShowImg").onclick = function() {
    document.getElementById("close_quickview_img").src = chrome.runtime.getURL("prezentacija/quickview.jpg");
	document.getElementById("quickview_pres").style.display = "block";
};
document.getElementById("close_quickview").onclick = function() {
	document.getElementById("quickview_pres").style.display = "none";
};


document.getElementById("nightShowImg").onclick = function() {
    document.getElementById("close_nightmode_img").src = chrome.runtime.getURL("prezentacija/darkmode.jpg");
	document.getElementById("nightmode_pres").style.display = "block";
};
document.getElementById("close_nightmode").onclick = function() {
	document.getElementById("nightmode_pres").style.display = "none";
};


document.getElementById("bigimgShowImg").onclick = function() {
    document.getElementById("close_bigimg_img").src = chrome.runtime.getURL("prezentacija/bigimg.jpg");
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
