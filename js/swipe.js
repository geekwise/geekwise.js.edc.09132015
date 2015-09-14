document.addEventListener('DOMContentLoaded',function(){
function detect_swipe_events(element_to_detect) {

    var abs = Math.abs;
    var max = Math.max;
        
    var createEvent = function (element, event_type) {
        var a = element_to_detect.createEvent("CustomEvent");
        a.initCustomEvent(event_type, true, true, element.target);
        element.target.dispatchEvent(a);
        a = null;
        return 1;
      };
    
    
      var mobile_browser_type = (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'touch' : 'mouse');


      var moved = false,
      buttonDown = 0,
      pressedMoveThreshold = 20,
      startdt, endt,
      startx, starty,
      endx, endy,
      xdiff, ydiff,
      calcEventType = function () {
        xdiff = abs(endx - startx);
        ydiff = abs(endy - starty);
        var event_type = max(xdiff, ydiff) > pressedMoveThreshold ?
            (xdiff > ydiff ? (startx > endx ? 'swipe_left' : 'swipe_right') : (starty > endy ? 'swipe_up' : 'swipe_down')) : 'swipe_double_tap';
        return event_type;
      },
      f = {
        touch: {
          touchstart: function (e) {
            startx = e.touches[0].pageX;
            starty = e.touches[0].pageY;
            startdt = Date.now();
            return createEvent(e, 'swipe_tap');
          },
          touchmove: function (e) {
            moved = true;
            endx = e.touches[0].pageX;
            endy = e.touches[0].pageY;
            return 1;
          },
          touchend: function (e) {
            endt = Date.now();
            if (!moved) {
              return createEvent(e, 'swipe_double_tap');
            }
            moved = false;
            return createEvent(e, calcEventType());
          },
          touchcancel: function (e) {
            moved = false;
            return 1;
          }
        },
        mouse: {
          // e.button : left = 0, middle = 1, right = 2 - or left handed reversed.
          mousedown: function (e) {
            if (e.button) {
              return e.button;
            }
            buttonDown = 1; // only left is considered buttonDown
            startx = e.clientX;
            starty = e.clientY;
            startdt = Date.now();
            return createEvent(e, 'swipe_tap');
          },
          mousemove: function (e) {
            if (!buttonDown) {
              return !buttonDown;
            }
            moved = true;
            endx = e.clientX;
            endy = e.clientY;
            return 1;
          },
          mouseup: function (e) {
            endt = Date.now();
            //console.log('Total time: ' + (endt - startdt));
            if (e.button) {
              return e.button;
            }
            buttonDown = 0;
            if (!moved) {
              return createEvent(e, 'swipe_double_tap');
            }
            moved = false;
            return createEvent(e, calcEventType());
          }
        }
      };
  for (var event_name in f[mobile_browser_type]) {
    element_to_detect.addEventListener(event_name, f[mobile_browser_type][event_name], false);
  }
};

function addAllListeners(element_name) {
    
    
  function swipe_action_to_element(swipe_event) {
    element_to_detect_swipe.innerHTML = swipe_value[swipe_event.type];
  }

    
  var element_to_detect_swipe = document.getElementsByTagName(element_name)[0];
    
    var  swipe_event_type = [
          'swipe_tap',
          'swipe_double_tap',
          'swipe_left',
          'swipe_right',
          'swipe_up',
          'swipe_down'
        ];
  
      var swipe_types = swipe_event_type.length;
  
      var swipe_value = {
        swipe_tap: 'press', // superFastClick very bad name.
        swipe_double_tap: 'tap',
        swipe_left: 'left',
        swipe_right: 'right',
        swipe_up: 'up',
        swipe_down: 'down'
      };
    
  while(swipe_types --){
    element_to_detect_swipe.addEventListener(
        swipe_event_type[swipe_types],
        swipe_action_to_element,
        false)
  };
    
    
  element_to_detect_swipe.addEventListener('touchstart', function (event) {
    event.preventDefault();
  }, false);
}


    
    detect_swipe_events(document);
    addAllListeners('li');

    
});