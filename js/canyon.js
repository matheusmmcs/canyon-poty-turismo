var initPhotoSwipeFromDOM = function(gallerySelector) {
    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for(var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element
            // include only element nodes 
            if(figureEl.nodeType !== 1) {
                continue;
            }
            if (figureEl.tagName.toUpperCase() !== 'FIGURE') {
                continue;
            }


            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');
            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }
            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }
        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if(!clickedListItem) {
            return;
        }
        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }
            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }
        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };
    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);
        // define options (if needed)
        options = {
            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            shareEl: false,
            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };
        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }
        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }
        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }
        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };
    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );
    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};
// execute above function
initPhotoSwipeFromDOM('.my-gallery');





//Video
var vid = document.getElementById("bgvid");
var playVid = document.getElementById("play-vid");
var sectionVid = document.getElementById("schedule");
var scheduleInfo = document.querySelectorAll(".schedule-info");
//var pauseButton = document.querySelector("#schedule a");

if (window.matchMedia('(prefers-reduced-motion)').matches) {
    vid.removeAttribute("autoplay");
    vid.pause();
    //pauseButton.innerHTML = "Paused";
}
function vidPlayDesc() {
    sectionVid.classList.remove('stopfade');
    playVid.innerHTML = "Pausar vídeo do passeio";
    scheduleInfo[0].classList.add('video-played');
}
function vidPauseDesc() {
    sectionVid.classList.add('stopfade');
    playVid.innerHTML = "Ver vídeo do passeio";
    scheduleInfo[0].classList.remove('video-played');
}

playVid.addEventListener("click", function() {
    if (vid.paused) {
        vidPlayDesc();
        vid.play();
    } else {
        vidPauseDesc();
        vid.pause();
    }
});

if (vid.paused) {
    vidPauseDesc();
} else {
    vidPlayDesc();
}


/*
pauseButton.addEventListener("click", function() {
  vid.classList.toggle("stopfade");
  if (vid.paused) {
    vid.play();
    pauseButton.innerHTML = "Pause";
  } else {
    vid.pause();
    pauseButton.innerHTML = "Paused";
  }
})
*/

$(document).ready(function() {

    var $EMAIL_FORM = $('#formEmail');
    var $MSG_EMAIL = $("#msg-email");
    var $BTN_EMAIL = $('#sendEmail');

    function hideMsgEmail() {
        $MSG_EMAIL.attr('class', 'hide');
        sendingEmail = true;
        $BTN_EMAIL.html('Enviando Mensagem...');
        $BTN_EMAIL.attr('disabled', 'disabled');
    }

    function showMsgEmail(msg, success) {
        $MSG_EMAIL.html(msg);
        $MSG_EMAIL.attr('class', 'alert ' + (success ? 'alert-success' : 'alert-danger'));
        sendingEmail = false;
        $BTN_EMAIL.html('Enviar Mensagem');
        $BTN_EMAIL.removeAttr('disabled');
    }

    function getFormData($form){
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function(n, i){
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    var sendingEmail = false;
    $BTN_EMAIL.click(function(e) {
        //method="post" action="/email"
        //$EMAIL_FORM.attr('action', act);
        //$('#formEmail').submit();
        e.preventDefault();

        if (!sendingEmail) {
            hideMsgEmail();
            var dados = getFormData($EMAIL_FORM);
            if (dados.name && dados.phone && dados.msg) {
                $.ajax({
                    type: "POST",
                    url: $EMAIL_FORM.attr('action'),
                    data: dados,
                    success: function(res) {
                        showMsgEmail(res.msg, res.status);
                    },
                    error: function(request, status, error) {
                        showMsgEmail("Ocorreu algum problema no servidor, tente novamente.", false);
                        console.error(request, status, error);
                    }
                });
            } else {
                showMsgEmail("Preencha os dados do formulário para entrar em contato.", false);
            }
        }
    });
});




