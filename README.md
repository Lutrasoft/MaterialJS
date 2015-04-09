# MaterialJS

A library which is based on Google Material Design. It has a pre-defined HTML structure and CSS classes. You can build your own HTML around or inside and it should be still working. You don't have to write any Javascript, just add the Javascript file material.js and material.css to your source and your up and running.

## Form
Radio button:

```html
<div class="m-radio">
    <input type="radio" name="power" id="power1" />
    <label for="power1">1x power</label>
</div>
```

Checkbox button (checkmark or square version):

```html
<div class="m-checkbox-checkmark">
    <input type="checkbox" name="water" id="water0" />
    <label for="water0">0x power</label>
</div>
<div class="m-checkbox">
    <input type="checkbox" name="water" id="water1" />
    <label for="water1"><span class="m-checkbox-check"></span>1x power</label>
</div>
```

Input (automatically ads countdown if you have a maxlength):

```html
<div class="m-input">
    <input id="input1" type="text" maxlength="20" />
    <label for="input1">Name [maxlength=20]</label>
    <label class="m-error-label" for="input3">Username or Password is incorrect.</label>
</div>
```

Datepicker (an input with the class m-datepicker):

```html
<div class="m-input">
    <input id="input5" class="m-datepicker" type="text" value="12-05-1989" />
    <label for="input5">Date</label>
</div>
```

## Ripple

Add ripple to any of your favorite elements, just by adding the class m-ripple.

```html
Button with ripple and depth change:
<div class="ripple-button m-ripple m-button"></div>

List with ripple:
<ul class="list z-depth-1">
    <li class="m-ripple">Text one</li>
    <li class="m-ripple">Text one</li>
    <li class="m-ripple">Text one</li>
</ul>
```


## Depth

You can add different depth styles to all HTML elements and it will have a nice drop shadow. You can use z-depth-1 to z-depth-5.

```html
<ul class="list z-depth-1">
    <li>Text one</li>
    <li>Text two</li>
</ul>
```

## List (sortable)

```html
<ul class="list z-depth-1 m-sortable">
    <li>Text one</li>
    <li>Text two</li>
    <li>Text three</li>
    <li>Text four</li>
    <li>Text five</li>
    <li>Text six</li>
</ul>
```