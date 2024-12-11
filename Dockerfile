# Gunakan image Node.js versi 18
FROM node:18

# Set working directory di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu untuk mengoptimalkan cache layer
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode sumber ke dalam container
COPY . .

# Expose port yang digunakan aplikasi
EXPOSE 4000

# Tentukan perintah untuk menjalankan aplikasi
CMD ["node", "src/server/server.js"]
