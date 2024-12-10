# Gunakan image node.js resmi
FROM node:18

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh file aplikasi ke dalam container
COPY . .

# Set environment variables untuk Firebase
ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/src/config/firebase-service-account.json

# Expose port untuk aplikasi
EXPOSE 8080

# Jalankan aplikasi
CMD ["node", "src/server/server.js"]
