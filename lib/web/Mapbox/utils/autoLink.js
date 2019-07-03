export function onloadCSS(ss, callback) {
  let called;
  function newcb() {
    if (!called && callback) {
      called = true;
      callback.call(ss);
    }
  }
  if (ss.addEventListener) {
    ss.addEventListener('load', newcb);
  }
  if (ss.attachEvent) {
    ss.attachEvent('onload', newcb);
  }

  // This code is for browsers that don’t support onload
  // No support for onload (it'll bind but never fire):
  //	* Android 4.3 (Samsung Galaxy S4, Browserstack)
  //	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
  //	* Android 2.3 (Pantech Burst P9070)

  // Weak inference targets Android < 4.4
  if ('isApplicationInstalled' in navigator && 'onloadcssdefined' in ss) {
    ss.onloadcssdefined(newcb);
  }
}

export default function (href, before, media, attributes) {
  // Arguments explained:
  // `href` [REQUIRED] is the URL for your CSS file.
  // `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
  // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
  // `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
  // `attributes` [OPTIONAL] is the Object of attribute name/attribute value pairs to set on the stylesheet's DOM Element.
  const doc = window.document;
  const ss = doc.createElement('link');
  let ref;
  if (before) {
    ref = before;
  } else {
    const refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
    ref = refs[refs.length - 1];
  }

  const sheets = doc.styleSheets;
  // Set any of the provided attributes to the stylesheet DOM Element.
  if (attributes) {
    for (const attributeName in attributes) {
      if (attributeName in attributes) {
        ss.setAttribute(attributeName, attributes[attributeName]);
      }
    }
  }
  ss.rel = 'stylesheet';
  ss.href = href;
  // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
  ss.media = 'only x';

  // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
  function ready(cb) {
    if (doc.body) {
      return cb();
    }
    setTimeout(() => {
      ready(cb);
    });
  }
  // Inject link
  // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
  // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
  ready(() => {
    ref.parentNode.insertBefore(ss, before ? ref : ref.nextSibling);
  });

  // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
  function onloadcssdefined(cb) {
    const resolvedHref = ss.href;
    let i = sheets.length;
    while (i--) {
      if (sheets[i].href === resolvedHref) {
        return cb();
      }
    }
    setTimeout(() => {
      onloadcssdefined(cb);
    });
  }


    function loadCB() {
        if (ss.addEventListener) {
            ss.removeEventListener( "load", loadCB );
        }
        ss.media = media || "all";
    }

    // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
    if (ss.addEventListener) {
        ss.addEventListener( "load", loadCB);
    }
    ss.onloadcssdefined = onloadcssdefined;
    onloadcssdefined( loadCB );
    return ss;
}
