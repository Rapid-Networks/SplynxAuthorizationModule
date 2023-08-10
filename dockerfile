FROM node:18.17.0-alpine3.17

# Redis setup
RUN apk add --no-cache git make wget build-base

RUN mkdir /builds
WORKDIR /builds
RUN git clone https://github.com/redis/redis.git
# Build and install
WORKDIR /builds/redis
RUN make
RUN make install

# S.A.M setup
WORKDIR /opt
RUN mkdir config && mkdir logs
COPY environment.json /opt/config
RUN git clone https://github.com/Rapid-Networks/Splynx_Authentication.git

WORKDIR /opt/Splynx_Authentication
RUN yarn install --frozen-lockfile
RUN yarn run build


# Cleanup
RUN rm -rf /builds
# Start DB instance 
CMD [ "redis-server" ]







# SETUP ENV
# RUN mkdir -p /var/log/sam
# WORKDIR /opt
# RUN git clone https://github.com/Rapid-Networks/Splynx_Authentication.git --depth 1
# WORKDIR /opt/Splynx_Authentication
# RUN mkdir opt/Splynx_Authentication/config
# COPY ./environment.json /opt/Splynx_Authentication/config/environment.json

# RUN npm install
# RUN npm run build

# # Set up usergroups
# RUN addgroup -S sam
# RUN adduser -S -H sam -G sam
# RUN chown sam:sam /var/log/sam

# CMD [ "node ./build/index.js --env production" ]

