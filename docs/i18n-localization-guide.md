## Angular i18n

### Localisation using the built-in module

---

### **I**. _Prerequisites_

- An **Angular** application
- The **localize** package
  > The **localize** package is normally installed by running the command `ng add @angular/localize`. With our project's **setup** however, we have to run these two commands instead: `npm i @angular/localize` and `nx g @angular/localize:ng-add --name [app name]`
- Modifying `angular.json` ( or `workspace.json`, depending on how the project was set up )
  > Here is a **highlight** of the modifications that have to be made on **_our_** project.
  >
  > > **_Note:_** It may be different depending on whether or not you are using **NX** and which type of **NX** workspace you have created.

```json
{
  // ...
  "projects": {
    "webstore": {
      // ...
      "i18n": {
        // <----------------------------
        "sourceLocale": "en-US", // <---------------------------- 1
        "locales": {
          // <----------------------------
          "dk": "apps/webstore/src/i18n/messages.dk.xlf" // <---------------------------- 2
        } // <----------------------------
      }, // <----------------------------
      "targets": {
        "build": {
          "executor": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/apps/webstore" // <---------------------------- 3
            // ...
          },
          "configurations": {
            // ...
            "dk": {
              // <----------------------------
              "localize": ["dk"] // <---------------------------- 4
            } // <----------------------------
          }
        },
        "serve": {
          // ...
          "configurations": {
            "production": {
              "browserTarget": "webstore:build:production"
            },
            "dk": {
              // <----------------------------
              "browserTarget": "webstore:build:dk" // <---------------------------- 5
            } // <----------------------------
          }
        }
        // ...
      }
    }
  },
  "defaultProject": "webstore"
}
```

---

### **II**. _Getting Started_

- Marking the text for **translation**.
  > The **html** tags have to be marked with '_i18n_' like so: `<h1 i18n>Hello i18n!</h1>`. \
  > You can add **meaning** and a **description** to your text: `<meaning>|<description>` > _Example:_ `<h1 i18n="site header|An introduction header for this sample">Hello i18n!</h1>`
  > Any text marked with '_site header_' as the meaning is translated exactly the same way. You can read more about this **[here](https://angular.io/guide/i18n#ng-xi18n)**.\
  > Marking **element attributes** for translations: `<img [src]="logo" i18n-title title="Angular logo" />`.\
  > **Meaning** & **description**: `i18n-attribute="<meaning>|<description>@@<id>"`.
- Creating the **translation files**.
  > i18n can automatically **extract** the localization files by running the command `ng extract-i18n src/i18n`. In our project, we would have to run `nx extract-i18n webstore`.\
  > Now in the '_src/i18n_' folder you will find a '_messages.xlf_' file.
- Creating the **danish** translation file.
  > Now the text from '_messages.xlf_' can be copied into a new file called '_messages.dk.xlf_'.\
  >  In order to **translate** something, add a **target** tag immediately after the **source** in the **trans-unit** as follows:

```html
<trans-unit id="3775dcfb07584504d02ee50646c2ddcfe5c8c43c" datatype="html">
        <source>Hello</source>
        <target>Hvad så der</target>
        <context-group purpose="location">
          <context context-type="sourcefile">apps/webstore/src/app/app.component.html</context>
          <context context-type="linenumber">1</context>
        </context-group>
        <note priority="1" from="description"> Welcome message</note>
        <note priority="1" from="meaning">main header </note>
      </trans-unit>
```

> Also, it is a good idea to provide the '_target-language_' **attribute** for the **file** tag so that translation management systems can detect the **locale** properly, see below:

```html
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file
    source-language="en-US"
    datatype="plaintext"
    original="ng2.template"
    target-language="dk"
  >
    <!-- <--------- -->
    <!-- ... -->
  </file>
</xliff>
```

> Now the **Danish** version of the app can be launched with `ng serve --configuration=dk`.\
> In our project we will use: `nx serve [app name] --configuration=dk`.\
>  **_Note:_** Each translation has a _unique_ **ID** which is **changed** after any change that happens to **_its_** text. In that case, localization files have to be **regenerated !**

- Adding custom **IDs**
  > Can be done using the '_@@_' prefix:

```html
<h1 i18n="main header|Friendly welcoming message@@welcome">Hello everyone!</h1>
```

> The '_trans-unit_' should then look similar to this:

```html
<trans-unit id="welcome" datatype="html">
        <source>Hello everyone!</source>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/app.component.html</context>
          <context context-type="linenumber">9</context>
        </context-group>
        <!-- ... -->
</trans-unit>
```

---

### **III**. _Other i18n options_

- **_Pluralization_**

```html
<span i18n
  >Updated {minutes, plural, =0 {just now} =1 {one minute ago} other
  {{{minutes}} minutes ago}}</span
>
```

```ts
// ...
export class AppComponent {
  minutes = 1;
}
```

> In the above example:\
> \
> The first parameter, _minutes_, is bound to the component property (minutes), which determines the number of minutes.\
> \
> The second parameter identifies this as a plural translation type.\
> \
> The third parameter defines a pattern of pluralization categories and their matching values:\
> \
> For zero minutes, use =0 {just now}.
> For one minute, use =1 {one minute}.
> For any unmatched cardinality, use other {{{minutes}} minutes ago}. You can use HTML markup and interpolations such as {{{minutes}} with the plural clause in expressions.
> After the pluralization category, put the default text (English) within braces ({}).
> Pluralization categories include (depending on the language):\
> \
> =0 (or any other number)\
> zero\
> one\
> two\
> few\
> many\
> other\
> \
> **_Note:_** **[Pluralization rules](http://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Choosing-Plural-Category-Names)**

- **_Alternate options_**

```html
<span i18n
  >The author is {gender, select, male {male} female {female} other
  {other}}</span
>
```

```ts
// ...
export class AppComponent {
  gender = 'male';
}
```

> If you need to display alternate text depending on the value of a variable, you need to translate all of the alternates.\
> \
> The **select** clause, similar to the **plural** clause, marks choices for alternate text based on your defined string values. For example, the following clause in the component template binds to the component's gender property, which outputs one of the following string values: "male", "female" or "other".

- Combining **_pluralization_** with **_selections_**

```html
<span i18n
  >Updated: {minutes, plural, =0 {just now} =1 {one minute ago} other
  {{{minutes}} minutes ago by {gender, select, male {male} female {female} other
  {other}}}}
</span>
```

- **_Translating without a tag_**

```html
<ng-container i18n>Copyright 2020</ng-container>
```

> Upon page display, '_ng-container_' will be gone, and you’ll have simple plain text.

- **_Angular Pipes_**
  > All you need to do is provide the proper locale data in the '_src/app/app.module.ts_':

```ts
// ...

import { registerLocaleData } from '@angular/common';
import localeDk from '@angular/common/locales/dk';

registerLocaleData(localeDk, 'dk');

// ...
```

> The available **_Angular Pipes_** are: **DatePipe**, **CurrencyPipe**, **DecimalPipe**, and **PercentPipe**.\
> You can read about how to use them **[here](https://angular.io/guide/i18n#i18n-pipes)**

- **_Translations within Components_**
  > This can be done by using the '_$localize()_' function directly.

```ts
// ...
export class AppComponent {
  company = 'Treecreate';
  created_by = $localize`Created by ${this.company}`;
}
```

```html
<p>{{ created_by }}</p>
```

> The problem with this is that the translation will not automatically be extracted by the i18n tool.\
> Try to start the app by running: `nx serve [app name] --configuration=dk`.\
> You will see an **error** message: `WARNING in No translation found for "3990133897753911565" ("Created by {$PH}").`
> That long number is the **_ID_** of the translation we just added.\
> We can now make use of it and create our own '_trans-unit_' in the localization files.

- `messages.xlf`

```html
<trans-unit id="3990133897753911565" datatype="html">
        <source>Created by <x id="PH"/></source>
</trans-unit>
```

- `messages.dk.xlf`

```html
<trans-unit id="3990133897753911565" datatype="html">
        <source>Created by <x id="PH"/></source>
        <target>Some danish words <x id="PH"/></target>
</trans-unit>
```

---

### **IV**. _Adding a Language Switcher_

- First, make the component

```ts
// ...
export class AppComponent {
  localesList = [
    { code: 'en-US', label: 'English' },
    { code: 'dk', label: 'Danish' },
  ];

  // ...
}
```

- Then, we add it in the html

```html
<ul>
  <li *ngFor="let locale of localesList">
    <a href="/{{locale.code}}/"> {{locale.label}} </a>
  </li>
</ul>
```

---

### **V**. _Deployment_

Compile the application with `ng build --prod --localize`.\
In our case, it is: `nx build webstore --prod --localize`.

> This will create both **English** and **Danish** versions of the app under the '_dist_' directory in one go. It still possible to provide a specific version of the app to build like so: `ng build --configuration=production,dk`
