## Button useage explained 

I have added 5 classes of buttons and one extra class called aling-right. 
```css 
.TC-button-100 {
  width: 100%;
}
.TC-button-50 {
  width: 45%;
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
```
So far it looks good for mobile use as well, but i expect there might be a couple of extra buttons or changes to the current ones at a later time. No need to worry, they will all be with the same name, so no need to refactor or add class names to the buttons u create. 

I have also added styling to the Input fields:
```css 
.md-form input[type='email']:focus:not([readonly]),
.md-form input[type='password']:focus:not([readonly])
.md-form input[type='text']:focus:not([readonly]) {
  border-bottom: 1px solid #ebc6ab;
  box-shadow: 0 1px 0 0 #ebc6ab;
}
´´´
If you end up using additional types of inputfields, please notify *Teodor* or add it in **styles.css** with the rest.