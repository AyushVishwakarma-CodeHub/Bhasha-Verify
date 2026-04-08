FROM php:8.2-apache

# Enable Apache mod_rewrite for our API routing
RUN a2enmod rewrite

# Install MySQL PDO extensions
RUN docker-php-ext-install pdo pdo_mysql

# Copy our PHP application code into the Apache document root
COPY . /var/www/html/

# Update the default apache site with the config
RUN echo "<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog \${APACHE_LOG_DIR}/error.log\n\
    CustomLog \${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>" > /etc/apache2/sites-available/000-default.conf

# Set permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
