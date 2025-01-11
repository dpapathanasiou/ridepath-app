FROM nginx:stable-alpine 

RUN set -eux \
  && apk update \
  && apk add ca-certificates \
  && update-ca-certificates

COPY index.html /etc/nginx/html/index.html
COPY css/style.css /etc/nginx/html/css/style.css
COPY js/network.js /etc/nginx/html/js/network.js
COPY js/processor.js /etc/nginx/html/js/processor.js
COPY config/app-proxy.conf /etc/nginx/conf.d/app-proxy.conf

EXPOSE 90
