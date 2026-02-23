# Define imagem base da aplicação (node: 23.4.0)
FROM node:23.4.0

# Define diretório de trabalho 
WORKDIR /frontend

# Copia packages
COPY package*.json /frontend/

# Instala todas as dependências
RUN npm install

# Copia restante dos arquivos agora que as dependências estão instaladas. Ou . . (copia tudo pra pasta criada ex.: frontend)
COPY . /frontend/

# Expõe porta
EXPOSE 3000

# Inicia projeto, só pode ter um comando 'CMD' por dockerfile
CMD ["npm", "run start"]

