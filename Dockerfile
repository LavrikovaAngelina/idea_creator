FROM node:22-alpine as react-app

WORKDIR /app
COPY package.json package-lock.json .
RUN npm install --only=prod
COPY public ./public
COPY src ./src
ENV REACT_APP_BACKEND_BASE_URL=https://api.ideacreator.ru/
RUN npm run build

FROM nginx:1.27.3-alpine
COPY --from=react-app /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
