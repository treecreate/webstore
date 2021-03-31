## Button useage explained

I have added 5 classes of buttons and one extra class called align-right.

````css
.TC-button-100 {
  width: 100%;
}
.TC-button-50 {
  width: 47%;
}
.TC-button-33 {
  width: 33%;
}
.TC-button-25 {
  width: 25%;
}
.TC-button-static {
  width: 250px;
}
.align-right {
  text-align: right;
}
´´´

all 5 classes have the same styling on them, so using one of these classes will add the following styling: 
```css
.TC-button-25, 
.TC-button-33,
.TC-button-50,
.TC-button-100,
.TC-button-static {
  /* button */
  box-shadow: 0px 3px 10px 0 rgba(0, 0, 0, 0.15);
  background: #ebc6ab;
  height: 35px;
  border: none;

  /* text */
  color: white;
  font-family: Seravek;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  line-height: 22px;
  align-items: center;
  text-align: center;

  /* effect */
  outline: none !important;
  transition: 0.5s;
}
````

So far it looks good for mobile use as well, but i expect there might be a couple of extra buttons or changes to the current ones at a later time. No need to worry, they will all be with the same name, so no need to refactor or add class names to the buttons u create.
