FROM node

WORKDIR /opt/app

COPY api/package*.json ./ 

RUN npm install

COPY . .

CMD [ "npm", "start" ]