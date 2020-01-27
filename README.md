<p align="center"><img alt="Molder" title="Molder" src="https://raw.githubusercontent.com/sultan-ov/molder/master/app/img/_src/preview.jpg"></p>  

Create high-performance web applications using the Molder build template.  

## Description

Molder's goal is to provide an automated build system that includes a full range of optimizations for all web development tasks, whether it is image processing, scripts, styles, or layout. Molder uses [Rollup](https://github.com/rollup/rollup) to process scripts and is configured by default to build the [Inferno](https://github.com/infernojs/inferno) application. [Gulp](https://github.com/gulpjs/gulp) implements automation by watching changes in files, performing the tasks when necessary.  

## Origin

Molder is based on [OptimizedHTML](https://github.com/agragregra/OptimizedHTML-5) by [@agragregra](https://github.com/agragregra)  
and [Rollup configuration](https://github.com/krausest/js-framework-benchmark/tree/master/frameworks/keyed/inferno) committed by [@Havunen](https://github.com/Havunen)  

## Getting Started

Install Gulp and Rollup globally:  
```sh
npm i -g gulp rollup
```  
Clone repo:  
```sh
git clone https://github.com/sultan-ov/molder.git
```  
Or download and unarchive.  
Change directory and install packages:  
```sh
cd molder
npm i
```  
Run Gulp after installing:  
```sh
gulp
```  
// Notes  
If you have errors with sass on windows - try this:  
```sh
npm i -g --production windows-build-tools
```  
And after it re install Molder node_modules.  

## Features

- BrowserSync localhost and live reload
- Sass compiler
- Parse CSS and add vendor prefixes to rules
- Clean and minify CSS
- Imagemin Lossless image optimization
- Image resizer with compressor
- Compile ES6 with Babel
- Tree-shaking and bundle JS
- Terser JS mangler and compressor
- Rsync deploy (optional)
- Basic htaccess file for resources caching

## Structure rules

1. All public files are located inside the "**app**" folder.
2. Processed styles and scripts are prefixed with "**.min**".
3. Entry points are named "**main**".
4. All files starting with an underscore are included in another file, usually an entry point.
5. All folders starting with an underscore contain only included or unprocessed files.
6. "**app/js**" folder contains included scripts, processed scripts and scripts entry point.
7. "**app/sass**" folder contains included styles and styles entry point.
8. "**app/css**" folder contains processed styles.
9. "**app/fonts**" folder contains fonts, see [Adding fonts](#adding-fonts).
10. "**app/libs**" folder contains third-party libraries.
11. New images add to "**app/img/\_src**" from where they will be sorted after processing:
- all from "**app/img/\_src/.icon/**" to "**app/img/@icon/**"
- .svg .gif from "**app/img/\_src/**" to "**app/img/@spec/**"
- .png .jpg .jpeg from "**app/img/\_src/**" to "**app/img/@2x/**" and "**app/img/@1x/**"

## Example

#### Main CLI commands

```sh
gulp # run default gulp task ('img', 'styles', 'scripts', 'browser-sync', 'watch')
gulp cleanimg # delete all "@*" image folders
gulp rsync # project deployment via rsync task
```  
By default, the build system works in **development** mode and scripts will **NOT** be optimized / minified.  
Don't forget to generate an optimized bundle before deploy.  
```sh
rollup -c --environment production # generate script bundle in production mode with optimization and minification
```  

#### Adding fonts

Fonts are added to styles through a mixin so as not to prescribe each format manually. In order for the mixin to work correctly, several rules should be followed.  
Each font must have its own folder inside the fonts folder. Each font folder must be named in CamelCase style and must have the same name as the font files. Fonts must have 4 formats: **.eot**, **.ttf**, **.woff**, **.woff2**. If one of the formats is missing then the rule for this format in font-face will still be created which will lead to an error in the browser. If you want to override this then in the file "**app/sass/\_mixins/\_font-face.sass**" remove the formats that you do not want to support.  
Use "**app/sass/\_fonts.sass**" for font-face declarations:  
```sass
@import "_mixins/font-face"

//   +font-face( 'font-family', 'file-path', weight, style )

+font-face('Roboto', '../fonts/RobotoRegular/RobotoRegular')
+font-face('Roboto', '../fonts/RobotoBold/RobotoBold', bold)
```  

#### Media queries

For media queries, a [bootstrap](https://github.com/twbs/bootstrap) [mixin](https://github.com/twbs/bootstrap/blob/master/scss/mixins/_breakpoints.scss) is used which takes one of the breakpoint variables declared in "**app/sass/_vars.sass**" file:
```sass
// Media breakpoints
//
// Define the minimum dimensions at which your layout will change,
// adapting to different screen sizes, for use in media queries.

$grid-breakpoints: (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px)
```  
Media queries are used in "**app/sass/_media.sass**" file and are structured as "desktop first" and "mobile first" methods:
```sass
/*==========  Desktop First  ==========*/

// ≥1200px
+media-breakpoint-down(lg)

// ≥992px
+media-breakpoint-down(md)

// ≥768px
+media-breakpoint-down(sm)

// ≥576px
+media-breakpoint-down(xs)

/*==========  Mobile First  ==========*/

// ≤576px
+media-breakpoint-up(sm)

// ≤768px
+media-breakpoint-up(md)

// ≤992px
+media-breakpoint-up(lg)

// ≤1200px
+media-breakpoint-up(xl)
```  

## Third-party libraries

Moulder includes the following optional libraries:
- [Inferno](https://github.com/infernojs/inferno) \| Dominic Gannaway \| [MIT](https://github.com/infernojs/inferno/blob/master/LICENSE.md)
- [Normalize.css](https://github.com/necolas/normalize.css) \| Nicolas Gallagher and Jonathan Neal \| [MIT](https://github.com/necolas/normalize.css/blob/master/LICENSE.md)
- [Dead Simple Grid](https://github.com/mourner/dead-simple-grid) \| Vladimir Agafonkin \| [MIT](https://github.com/mourner/dead-simple-grid/blob/gh-pages/LICENSE.txt)
- [HTML5 Shiv](https://github.com/aFarkas/html5shiv) \| Alexander Farkas \| [MIT/GPL2](https://github.com/aFarkas/html5shiv/blob/master/MIT%20and%20GPL2%20licenses.md)
- [IE7/IE8/IE9.js](http://code.google.com/p/ie7-js/) \| Dean Edwards \| [MIT](http://www.opensource.org/licenses/mit-license.php)
- [PIE](https://github.com/lojjic/PIE) \| Jason Johnston \| [Apache2/GPL2](https://github.com/lojjic/PIE/blob/master/LICENSE)
