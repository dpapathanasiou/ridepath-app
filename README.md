# About

This web app uses the real time [json format](https://www.json.org/) feed from the [Port Authority Trans-Hudson (PATH)](https://www.panynj.gov/path/en/index.html) rail system to produce a view of when the next trains are arriving per station.

It is an experiment in minimalism, in that it was built without any specialized development frameworks, relying solely on standard [javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and [css](https://developer.mozilla.org/en-US/docs/Web/CSS) capabilities instead.

# Architecture &amp; Design

The app retrieves the PATH feed at `https://www.panynj.gov/bin/portauthority/ridepath.json` and flattens the results into a list of active trains per station.

The data is kept in memory, loaded on startup, but can be refreshed manually, using the corresponding button on the display.

The app does not issue cookies, nor is there any type of authentication required.

# Getting Started

## Run as a local web app

Clone this repo and set up a [local web server](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server) from within this folder.

Because of [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) security restrictions, the app cannot access the PATH feed directly.

To get around this, create a `data` directory, and download the feed data:

```sh
mkdir data
cd data
wget https://www.panynj.gov/bin/portauthority/ridepath.json
```

The `refresh` button on the web app simply reloads this file, so a true refresh means downloading the data locally again.

The docker image (below) solves the CORS problem differently, and when running that image, the `refresh` button on the web app *does* work as expected, without any local data downloads.

## Build and run the docker image

Use the [Dockerfile](Dockerfile) to create and run this application in a container; in addition to [docker](https://www.docker.com/get-started/), this code and instructions have been confirmed to work under [Rancher Desktop](https://rancherdesktop.io/) as well:

```sh
docker build --tag ridepath --file Dockerfile .
docker run -p 8080:90 ridepath
```

Opening a browser to `http://0.0.0.0:8080/` or running these commands from outside the container should result in successful responses:

```sh
curl http://0.0.0.0:8080/health
curl http://0.0.0.0:8080/
```

The [nginx proxy configuration](config/app-proxy.conf) gets around the CORS restriction by [reverse proxying](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) app requests made to `/data/ridepath.json` to the actual live feed.


## Host your own instance

All you need to do is build the docker image and find a hosting provider.

[Digital Ocean](https://www.digitalocean.com/) is a particularly good one to consider, especially given their [excellent tutorials](https://docs.digitalocean.com/products/) for all of the above (using [this link](https://m.do.co/c/71387faa5599) to sign up gets you $200 in credit, and I gain a small referral credit as well).


# Contribute

[Pull requests](https://help.github.com/articles/about-pull-requests/) are welcome!