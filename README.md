# grunt handlebars html
=======================

! ALPHA release

A grunt.js task to render Handlebars templates against a context &amp; produce HTML

[Handlebars templates](http://handlebarsjs.com)

[Mustache](http://mustache.github.io)

To precompile Handlebars templates to JST file use [grunt-contrib-handlebars](https://github.com/gruntjs/grunt-contrib-handlebars)

## About

This task renders Dust templates against a context to produce HTML.

Inspired by [grunt-dust-html](https://github.com/ehynds/grunt-dust-html)


## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-handlebars-html --save-dev
```

Next, add this line to your project's grunt file:

```js
grunt.loadNpmTasks("grunt-handlebars-html");
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.3](https://github.com/gruntjs/grunt-contrib-handlebars/tree/grunt-0.3-stable).*


Lastly, add the configuration settings (see below) to your grunt file.

## Documentation

This task has two required properties, `src` and `dest`. `src` is the path to your source file and `dest` is the file this task will write to (relative to the grunt.js file). If this file already exists **it will be overwritten**.

An example configuration looks like this:

```js
  grunt.initConfig({
    handlebarshtml: {
      home: {
        files: {
          "dist/home.html": "src/home.html"
        },
        options: {
          basePath: "src/",
          partials: "partials/*.hbs",
          layout: "layout.html",
          context: {
            title: "Layout Test",
            items: [
              "apple",
              "orange",
              "banana"
            ]
          }
        }
      }
    }
  });
  grunt.registerTask("default", ["handlebarshtml"]);
```

### Optional Configuration Properties

This plugin can be customized by specifying the following options:

* `layout`: layout file is optional.
* `partials`: partials files.
* `basePath`: The base location to all your templates so that includes/partials can be resolved correctly.
* `defaultExt`: The default template extension. Defaults to `.hbs`.
* `context`: A JavaScript object to render the template against. This option supports a few different types:

**String**: the location to a file containing valid JSON:

```js
context: "/path/to/file.json"
```

**Object**: a regular ol' JavaScript object:

```js
context: {
  pageTitle: "My Awesome Website"
}
```

**Array**: an array of contexts, either string (files to parse) or JavaScript objects, or both. Each item in the array will be merged into a single context and rendered against the template:
    
```js
context: [
  "path/to/context.json",
  "path/to/another/context.json",
  { more: "data" }
]
```

### FAQ

1. soon

## License

MIT
