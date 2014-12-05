# underline.js
Check out [http://wentin.github.io/underlineJS/](http://wentin.github.io/underlineJS/) and 
<a href="https://twitter.com/share" class="twitter-share-button" data-url="https://github.com/wentin/underlineJS" data-text="A javascript library that sets out to do one simple job: draw the perfect underline" data-via="DesignJokes" data-size="large" data-hashtags="UnderlineJS">Tweet about this project</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>

`A javascript library that sets out to do one simple job: draw the most perfect underline`

`A pixel-perfect javascript library for drawing text underline, or maybe even animate it, data-viz it, or more`

The goal of this project is not to succeed, but fail. 

If one day there is absolutely no reason to use this third party js library to render underline, it reached its ultimate goal: to fail completely. Because that means the browser has supported  this feature natively. That is what this project is about, to push the W3C further in a pixel-perfect, designer-friendly route.

[Marcin Wichary](https://twitter.com/mwichary)'s ideal underline:
* be able to change the width of the line (with additional half-pixel/retina support),
* be able to change the distance from the text,
* be able to change the color (even if just to simulate thinner width by using lighter grays instead of black),
* be able to clear the descenders,
* have a separate style for visited links.

In addition to these above, it should also 
* have no ghost pixels 

![GOAL](https://d262ilb51hltx0.cloudfront.net/max/1400/1*5iD2Znv03I2XR5QI3KLJrg.png)
*Image by Marcin Wichary*


## Progress Preview
`Please click to see large picture. red is underline.js, green is browser default underline`
![PROGRESS](https://raw.githubusercontent.com/wentin/underlineJS/master/i/underlineJS.png)

The project is currently under dev. Contact me on [twitter](http://twitter.com/DesignJokes) if you want to contribute!

## Examples

- **New Approach example, add single canvas for each dom element that has classname "underline"**

[http://wentin.github.io/underlineJS/](http://wentin.github.io/underlineJS/)

`red is underline.js, green is browser default underline`

- **New New Approach example, use SVG instead of canvas, key is "mask"**

[http://wentin.github.io/underlineJS/svg-experiment.html/](http://wentin.github.io/underlineJS/svg-experiment.html)

- **Old Approach example, add span and canvas to each word**

[http://wentin.github.io/underlineJS/article.html](http://wentin.github.io/underlineJS/article.html)

`Paragraph "What we’ve got …" text underline is canvas rendered!`

*Example designed by Wenting Zhang(me) in huffpost labs, article by Katelyn Bogucki from huffpostcode*

## Logs
##### Dec 2, 2014
* start proof of concept
* it now works on chrome/safari!

##### Dec 4, 2014
* add approach 2, one single canvas for each element.

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
