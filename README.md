Configuración del Servidor Ubuntu
Este documento detalla los pasos necesarios para configurar un servidor Ubuntu con pm2, git, Nest.js, Node.js usando nvm, nginx y Certbot para SSL.

1. Actualizar el Sistema
bash
Copiar código
sudo apt update && sudo apt upgrade -y
2. Instalar Git
bash
Copiar código
sudo apt install git -y
3. Instalar nvm (Node Version Manager)
bash
Copiar código
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
4. Instalar Node.js usando nvm
bash
Copiar código
nvm install --lts
nvm use --lts
node -v
npm -v
5. Instalar Nest.js CLI
bash
Copiar código
npm install -g @nestjs/cli
6. Instalar pm2
bash
Copiar código
npm install -g pm2
7. Instalar y Configurar nginx
bash
Copiar código
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
8. Configurar el Dominio en nginx
Editar la configuración de nginx:

bash
Copiar código
sudo nano /etc/nginx/sites-available/back-test.nipautomation.com
Añadir la siguiente configuración:

nginx
Copiar código
server {
    listen 80;
    server_name back-test.nipautomation.com;

    location / {
        proxy_pass http://localhost:3000; # Asegúrate de que tu aplicación Nest.js está corriendo en el puerto 3000
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
Habilitar el sitio y verificar la configuración:

bash
Copiar código
sudo ln -s /etc/nginx/sites-available/back-test.nipautomation.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
9. Instalar Certbot para SSL
bash
Copiar código
sudo apt install certbot python3-certbot-nginx -y
10. Obtener y Configurar el Certificado SSL con Certbot
bash
Copiar código
sudo certbot --nginx -d back-test.nipautomation.com
Sigue las instrucciones para completar la configuración SSL.

11. (Opcional) Crear y Desplegar una Aplicación Nest.js
Si aún no tienes una aplicación Nest.js, puedes crear una con los siguientes comandos:

bash
Copiar código
nest new my-app
cd my-app
npm run start:prod
Para gestionar la aplicación con pm2:

bash
Copiar código
pm2 start dist/main.js --name my-app
pm2 startup
pm2 save
Resumen:
Actualizar el sistema.
Instalar Git.
Instalar nvm y Node.js.
Instalar Nest.js CLI.
Instalar pm2.
Instalar y configurar nginx.
Configurar el dominio en nginx.
Instalar y configurar Certbot para SSL.
Con estos pasos, deberías tener un servidor configurado con las herramientas necesarias y un dominio seguro con SSL configurado usando Certbot.