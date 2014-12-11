# underline.js

`A javascript library that sets out to do one simple job: draw and animate the most perfect and playful text underline`

The goal of this project is not to succeed, but fail. 

If one day there is absolutely no one and no reason to use underline.jes, then it reaches its ultimate goal: to fail completely. Because that means the browser has supported  this feature natively. That is what this project is about, to push the W3C further in a pixel-perfect, designer-friendly route.

## Example

[http://wentin.github.io/underlineJS/](http://wentin.github.io/underlineJS/)

`Please click to see large picture. red is underline.js, green is browser default underline`
![PROGRESS](https://raw.githubusercontent.com/wentin/underlineJS/master/i/underlineJS.png)

The project is currently under dev. Contact me on [twitter](http://twitter.com/DesignJokes) if you want to be part of this project!

## Idea
[Marcin Wichary's ideal underline](https://medium.com/designing-medium/crafting-link-underlines-on-medium-7c03a9274f9):
* be able to change the width of the line (with additional half-pixel/retina support),
* be able to change the distance from the text,
* be able to change the color (even if just to simulate thinner width by using lighter grays instead of black),
* be able to clear the descenders,
* have a separate style for visited links.

In addition to these above, it should also 
* have no ghost pixels 

![GOAL](https://d262ilb51hltx0.cloudfront.net/max/1400/1*5iD2Znv03I2XR5QI3KLJrg.png)
*Image by Marcin Wichary*



<!--
## Examples of approaches

- **New Approach example, add single canvas for each dom element that has classname "underline"**

[http://wentin.github.io/underlineJS/](http://wentin.github.io/underlineJS/)

`red is underline.js, green is browser default underline`

- **New New Approach example, use SVG instead of canvas, key is "mask"**

[http://wentin.github.io/underlineJS/svg-experiment.html/](http://wentin.github.io/underlineJS/svg-experiment.html)

- **Old Approach example, add span and canvas to each word**

[http://wentin.github.io/underlineJS/article.html](http://wentin.github.io/underlineJS/article.html)

`Paragraph "What we’ve got …" text underline is canvas rendered!`

*Example designed by Wenting Zhang(me) in huffpost labs, article by Katelyn Bogucki from huffpostcode*
-->
## Logs
##### Dec 2, 2014
* start proof of concept
* it now works on chrome/safari!

##### Dec 4, 2014
* add approach 2, one single canvas for each element.

##### Dec 10, 2014
* finish finding descenderline with svg/js
* finish String class to draw underline with guitar string animation, not merged yet.
* start guitar string animation! Can you imagine this happen to your text underline! [http://wentin.github.io/underlineJS/stringAnimation/](http://wentin.github.io/underlineJS/stringAnimation/)


## To do list

- firefox bug
  - ctx.textBaseline="top”; render just like hanging

- detect and deal with line break word `done`

- make canvas width precise, 5px offset has to go `done`

- css like setting options.

- dynamic getting font styles `done`
  - maybe add font rendering styles and kern

- round posY to .5 px `done`

- underline stroke according to font stroke width `done`

- retina support for ghost free underline 

##Contact
* Follow [@DesignJokes](http://twitter.com/DesignJokes) on Twitter
* Email <zhangwenting111@gmail.com>
* Visit [wentin.co](http://wentin.co)
