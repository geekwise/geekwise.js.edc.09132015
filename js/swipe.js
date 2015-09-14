(function (D) {
  var abs = Math.abs,
    max = Math.max,
    createEvent = function (e, eventType) {
      var a = D.createEvent("CustomEvent");
      a.initCustomEvent(eventType, true, true, e.target);
      e.target.dispatchEvent(a);
      a = null;
      return 1;
    },
    isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? 'touch' : 'mouse'),
    moved = false,
    buttonDown = 0,
    pressedMoveThreshold = 20,
    startdt, endt,
    startx, starty,
    endx, endy,
    xdiff, ydiff,
    calcEventType = function () {
      xdiff = abs(endx - startx);
      ydiff = abs(endy - starty);
      var eventType = max(xdiff, ydiff) > pressedMoveThreshold ?
        (xdiff > ydiff ? (startx > endx ? 'swl' : 'swr') : (starty > endy ? 'swu' : 'swd')) : 'fc';
      return eventType;
    },
    f = {
      touch: {
        touchstart: function (e) {
          startx = e.touches[0].pageX;
          starty = e.touches[0].pageY;
          startdt = Date.now();
          return createEvent(e, 'sfc');
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
            return createEvent(e, 'fc');
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
          return createEvent(e, 'sfc');
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
            return createEvent(e, 'fc');
          }
          moved = false;
          return createEvent(e, calcEventType());
        }
      }
    };
  for (var eventName in f[isMobile]) {
    D.addEventListener(eventName, f[isMobile][eventName], false);
  }
})(document)

function addAllListeners() {
  function func(e) {
    div.innerHTML = v[e.type];
  }

  var div = document.getElementsByTagName('div')[0],
    a = ['sfc', 'fc', 'swl', 'swr', 'swu', 'swd'],
    b = a.length,
    v = {
      sfc: 'pressed', // superFastClick very bad name.
      fc: 'fastClick',
      swl: 'left',
      swr: 'right',
      swu: 'up',
      swd: 'down'
    };
  while (b--) {
    div.addEventListener(a[b], func, false);
  }
  div.addEventListener('touchstart', function (e) {
    e.preventDefault();
  }, false);
}

addAllListeners();
