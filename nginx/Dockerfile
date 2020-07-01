FROM nginx:stable-alpine
RUN apk add --no-cache certbot-nginx=1.0.0-r0

# RUN certbot certonly \
# --agree-tos \
# --nginx \
# --non-interactive \
# -d wils.ca \
# -d www.wils.ca \
# -m wils3005@gmail.com

CMD ["nginx", "-g", "daemon off;"]
