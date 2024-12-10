# Menggunakan image Node.js versi 18 sebagai base image
FROM node:18

# Menetapkan direktori kerja dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Menginstal dependensi aplikasi
RUN npm install

# Menyalin seluruh aplikasi ke dalam container, termasuk folder src
COPY ./src ./src

# Mengekspos port 8080 untuk aplikasi
EXPOSE 8080

# Menjalankan aplikasi dengan path yang benar
CMD ["node", "src/server/server.js"]
