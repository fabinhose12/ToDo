FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Faz o build da aplicação Next.js para produção
RUN npm run build

EXPOSE 3000

# Inicia o servidor do Next.js em modo produção
CMD ["npm", "run", "start"]