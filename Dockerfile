FROM php:8.2-apache

# Enable Apache mod_rewrite for our API routing
RUN a2enmod rewrite

# Install MySQL PDO extensions and security certificates
RUN apt-get update && apt-get install -y git unzip zip ca-certificates \
    && update-ca-certificates \
    && docker-php-ext-install pdo pdo_mysql

# Install Composer globally
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy our PHP application code into the Apache document root
COPY . /var/www/html/

# Run composer installation
WORKDIR /var/www/html
RUN composer install --no-dev --optimize-autoloader

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
