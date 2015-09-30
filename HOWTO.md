### Howto

(To view this file properly open it in the IDE and select Preview from the
menu at the top).

The application supports arbitrary template in the body tag.
Data binding is configured with the ```data-ng-model``` html property (please
see included HTML file).

Element hiding / showing is provided by the
```data-ng-show``` property - if it is present on an element the element will
be shown only if the model bound to it evaluates to true.

Example:

```
<div class="myelement" data-ng-show="hasUser">
  <span>We have a user!</span>
</div>
```

In the above example if the value of ```hasUser``` evaluates to true the div
and all its content will be visible (style.display == 'block'), if the value of
```hasUser``` is evaluated to false then the div and all its content will not
be visible (style.display == 'none').

### Recognized data bindings

The following models are recognized:

* ```locationName```
* ```userLikes```
* ```userRating```
* ```username```
* ```locationLikes```
* ```usericonurl```
* ```hasUser```

The following filters on data values are supported:

* ```pad(n)``` - pads the number to become at least ```n``` digits long, filling empty spaces with zeroes.
* ```splitInMiddle``` - splits a string in the middle and insets a space at the split point.

### Configuration options

The configuration for the backend is to be found in the first script tag in the
header.

* ```__acctid``` - a string specifying the account ID on the backend system for the current business account.
* ```__NFC.CONFIG.BASE_URL``` - a string representing the path to request for updates. Note that the account ID will be appended to it.

The HTML content should be put __before__ the link to the ```e-like.js```
script as the script auto-runs and looks for the *body* element.

CSS can be inlined (as in the example) or external (via a *link* tag).
