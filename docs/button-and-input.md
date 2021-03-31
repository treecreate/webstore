## Button usage explained

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

## input fields explained

There was an issue linking the TCInputField.scss file, therefore, you will have to link the stylesheet in your component like this:

```ts
@Component({
  selector: 'webstore-footer',
  templateUrl: './footer.component.html',
  styleUrls: [
    './footer.component.css',
    '../../../../assets/styles/TCInputField.scss', // This line will add it to your components styling. The link could change depending on you files location.
  ],
})
```

There are 3 elements that need to be created to make an input field with the proper styling with 3 matching classes:

**1.** div to wrap the other elements - _TC-input-group_
**2.** input field - _TC-input-field_
**3.** label - _TC-input-label_

Here's an example of what it could look like when writing it in your HTML file:

```html
<!-- E-mail -->
<div class="TC-input-group field">
  <!-- FIRST a wrapper div to contain the input field and the label  Classes: 'TC-input-group' + 'field' -->
  <input
    type="email"
    class="TC-input-field"
    placeholder="E-mail"
    name="email"
    id="email"
    required
  />
  <!-- SECOND the input field itself  Classes: 'TC-input-field' -->
  <label for="email" class="TC-input-label">E-mail</label>
  <!-- THIRD a label that explains the input fields function like 'email'   Classes: 'TC-input-label' -->
</div>
```

There is only one type of input field, but you can also create a text area, this will contain same form of styling, just remember to add a specified min and max height.
Here's an example:

```html
<div class="TC-input-group field">
  <textarea
    type="text"
    class="TC-input-field text-area-height"
    placeholder="Your message ... "
    name="message"
    id="message"
  ></textarea>
  <label for="message" class="TC-input-label">Subject</label>
</div>
```

```css
.text-area-height {
  height: 150px;
}
```
