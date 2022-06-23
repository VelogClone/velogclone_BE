FROM node:12-alpine
WORKDIR /velogclone_BE
COPY package.json /velogclone_BE
RUN npm install
COPY . /velogclone_BE
CMD ["npm","start"]
EXPOSE 3000