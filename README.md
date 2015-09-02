# underline.js

`A javascript library that sets out to do one simple job: draw and animate the most perfect and playful text underline`


### Demo

[http://wentin.github.io/underlineJS/](http://wentin.github.io/underlineJS/)

The project is currently under development.

If you have 8 minutes and want to know what is the story behind creating underline.js, you can hear all about it in this [`NY Tech Meetup presentation video`](http://embed.wirewax.com/8013554/7bafa8/)

### Features

Underline.js has following features:
 1. It doesn't have ghost pixels. It is not just pixel perfect, but also pixel perfect on half pixel level for retina display
![pixel-perfect](https://cloud.githubusercontent.com/assets/2474904/6017363/fdf6ab3c-ab5a-11e4-936a-f7657532df50.png)
 2. It has an optimized thin stroke-width. It is always 1/6 of width of the period mark.
![optimal-stroke-width](https://cloud.githubusercontent.com/assets/2474904/6017364/fdf7ca62-ab5a-11e4-976e-285dd759b59b.png)
 3. It sits on the optimal Y position between the baseline and descender line, that optimal Y positon is the golden ratio point.
![golden-ratio](https://cloud.githubusercontent.com/assets/2474904/6017362/fdf60510-ab5a-11e4-9965-4e8a6b0a9f4c.png)
 4. It has holes around descenders. Completely respect the type's shape. If you ask, the size of the holes are also optimized to the perfection.
![descender-holes](https://cloud.githubusercontent.com/assets/2474904/6017361/fdf3f4f0-ab5a-11e4-89a4-f6e6e0588c2b.png)

### CSS4 Proposal to W3C

Underline.js is not designed to be the most useful javascript library. It is more exploratory, and it is trying to push the boundary of web typography. I want to propose these new css rules to W3C for css4 edition:

    text-underline-color: #000000;
    // auto means the same color as the text color, or hex value

    text-underline-position: auto;
    // could be ratio or px or auto

    text-underline-skip: true;
    // true to set holes around descenders, false to turn it off

    text-underline-width: auto;
    // could be auto or px or ratio

    text-underline-animation: true
    // true or false, this one is only for underline.js

### Reference

[Marcin Wichary's article on crafting Medium.com's underline](https://medium.com/designing-medium/crafting-link-underlines-on-medium-7c03a9274f9)

### Mentions (thank you!)

[`Tweets`](https://storify.com/DesignJokes/underline-js-tweets) 

[`technical.ly article`](https://technical.ly/brooklyn/2015/02/12/wenting-zhang-underline-js/) 

[`codrops collective`](http://tympanus.net/codrops/collective/collective-155/)
[`unheap.com`](http://www.unheap.com/user-interface/text-links/underline-js/)
[`coliss.com`](http://coliss.com/articles/build-websites/operation/javascript/js-draw-and-animate-underline.html)
[`speckyboy.com`](http://speckyboy.com/2015/02/24/weekly-news-for-designers-n-273/)
[`cssauthor.com`](http://www.cssauthor.com/weekly-web-development-resources-and-tools-95/)
[`beautifulopen.com`](http://beautifulopen.com/2015/01/06/underline-js/)
[`freebiesbug.com`](http://freebiesbug.com/code-stuff/underline-js-animate-text-underline/)
[`jquery-plugins.net`](http://jquery-plugins.net/underlinejs-javascript-library-to-draw-and-animate-text-underline)
*Note: underline.js doesn't have dependency on jquery*
[`designsrazzi.com`](http://www.designsrazzi.com/free-jquery-plugins/)
[`codegeekz.com`](http://codegeekz.com/15-handy-javascript-libraries-for-march-2015/)
[`bashooka.com`](http://bashooka.com/coding/javascript-libraries-for-web-typography/)
[`ninodezign.com`](http://ninodezign.com/10-funny-jquery-plugins-for-your-website/)
[`hongkiat.com`](http://www.hongkiat.com/blog/web-typography-tools/)
[`decodering.com`](http://decodering.com/post/110635667154/underline-js-a-javascript-library-that-sets-out)
[`ipixel.com.sg`](http://www.ipixel.com.sg/blog/freebies/underline-js-animate-text-underline/)
[`freede.ru`](http://freede.ru/koding/animatsionnoe-podchyorkivanie-tekst-so-zvukom-pri-navedenii.html)
[`gaetanpautler.com`](http://gaetanpautler.com/weekly-links-and-websites-89/)
[`designmeltdown.com`](http://designmeltdown.com/#s=9406)
[`html5cn.org`](http://www.html5cn.org/article-7851-1.html)
[`splashnology.com`](http://mag.splashnology.com/article/tools-web-dev-march-2015/14012/)
[`developersfeed.com`](http://www.developersfeed.com/25-best-web-development-tools-of-march-2015/)
[`Parsons Alumni news`](http://amt.parsons.edu/blog/mfa-dt-alum-wenting-zhang-presents-underline-js-project-to-ny-tech-meetup/)
[`bashooka.com`](http://bashooka.com/coding/javascript-libraries-for-web-typography/)
[`habrahabr.ru`](http://habrahabr.ru/post/251759/)
[`softpedia.com`](http://webscripts.softpedia.com/script/Text-Management/Text-Tools/underline-js-84277.html)
[`lafermeduweb.net`](http://www.lafermeduweb.net/veille/underline-js-soulignez-a-la-perfection-vos-textes-sans-couper-les-lettres-565407442654482432.html)
[`wykop.pl`](http://www.wykop.pl/wpis/11426174/https-github-com-wentin-underlinejs-fajna-bibliote/)
[`sumy.ua`](http://veselov.sumy.ua/1753-underlinejs-skript-dobavleniya-pravilnogo-podcherkivaniya.html)
[`us8`](http://us8.campaign-archive2.com/?u=9dc44712ae7c52996ea6e645b&id=f8356f478a&e=1d8514e3e4)
[`pr-cy.ru`](http://pr-cy.ru/news/p/4967)
[`takana8.tumblr.com`](http://takana8.tumblr.com/post/110873944747/underline-js-a-javascript-library-that-sets-out)
[`altervista.org`](http://iwinuxfeed.altervista.org/aggregatore/underline-js/?utm_source=dlvr.it&utm_medium=twitter)

###Contact
* Follow [@DesignJokes](http://twitter.com/DesignJokes) on Twitter
* Email <zhangwenting111@gmail.com>
* Visit [wentin.co](http://wentin.co)
