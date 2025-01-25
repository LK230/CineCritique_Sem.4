# Verwende ein Node-Image, um die React-App zu bauen
FROM node:18

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere die package.json und package-lock.json (falls vorhanden)
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest der Anwendung
COPY . ./

# Baue die React-Anwendung
RUN npm run build

# Exponiere den Port, auf dem die App läuft
EXPOSE 3030

# Startet die Anwendung
CMD ["npm", "start"]