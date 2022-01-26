# Development

The Littel framework repository comes with scripts to build, test, and experiment with the framework. A `littel.css` file is exported into `/dist/css/` as part of a build step. The `/content/` directory contains templates a lot of sample and test webpages using the framework. It's encouraged that you place test markup here.

The `/public/` folder is ignored, this is where compiled styles and markup are placed. I suggest using a very small http server, like [asdf](https://www.npmjs.com/package/asdf) to view this directory. Example: `asdf -d public`, would get the directory to act as website.
