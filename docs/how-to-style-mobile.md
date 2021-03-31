## How to style your components for mobile

You can select styling to apply depending on the screen size. The way you do this:

1.  Write _@media only screen ..._ if it is specifically one screen size.
    Write _@media all screen ..._ if it should be all screens below this screen size.
2.  Write the condition that follows. Example: _@media only screen and (min-width: 720px) { css code }_.

If you want to target all screens below a specific screen size, you can write something like this:

```css
@media (max-width: 992px) {
  .myClass {
    margin: 10vh;
    color: white;
  }
}
```

This is generally used for desktop testing and as a more general styling. It is not very specific to devices and such. In case you need to target a specific device like iphone 10 or an ipad, here are the code snippets you need for most devices.

```css
/* ------------------ IPHONES ------------------ */
/* iphone 5 */
@media only screen and (min-device-width: 320px) and (max-device-height: 568px) and (-webkit-device-pixel-ratio: 2) {
  /* STYLES GO HERE */
}

/* iphone 6, 6s, 7, 8 */
@media only screen and (min-device-width: 375px) and (max-device-height: 667px) and (-webkit-device-pixel-ratio: 2) {
}

/* iphone 6+, 6s+, 7+, 8+ */
@media only screen and (min-device-width: 414px) and (max-device-height: 736px) and (-webkit-device-pixel-ratio: 3) {
}

/* iphone X , XS, 11 Pro, 12 Mini */
@media only screen and (min-device-width: 375px) and (max-device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
}

/* iphone 12, 12 Pro */
@media only screen and (min-device-width: 390px) and (max-device-height: 844px) and (-webkit-device-pixel-ratio: 3) {
}

/* iphone XR, 11 */
@media only screen and (min-device-width: 414px) and (max-device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
}

/* iphone XS Max, 11 Pro Max */
@media only screen and (min-device-width: 414px) and (max-device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
}

/* iphone 12 Pro Max */
@media only screen and (min-device-width: 428px) and (max-device-height: 926px) and (-webkit-device-pixel-ratio: 3) {
}

/* ------------------ IPAD ------------------ */
/* ipad 1, 2, mini and air */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 1) {
}

/* ipad 3, 4 and Pro 9.7 */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) {
}

/* ipad Pro 10.5 */
@media only screen and (min-device-width: 834px) and (max-device-width: 1112px) and (-webkit-min-device-pixel-ratio: 2) {
}

/* ipad Pro 12.9 */
@media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (-webkit-min-device-pixel-ratio: 2) {
}

/* ------------------ OTHER PHONES ------------------ */
/* Galaxy S4, S5 and Note 3 */
@media screen and (device-width: 320px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) {
}

/* Galaxy s6 + Google Pixel XL */
@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 4) {
}

/* HTC One  + Google Pixel */
@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) {
}

/* Windows Phone */
@media screen and (device-width: 480px) and (device-height: 800px) {
}
```

In case you are trying to edit the styling for phones that are tilted **Default is portrait aka horizontal**;
just add `and (orientation : landscape)` or `and (orientation: portrait)` and add you code there .
Example:

```css
@media only screen and (min-device-width: 375px) and (max-device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) {
}
```
