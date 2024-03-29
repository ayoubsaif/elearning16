# eLearning16 - Linkia FP Group 16 DAW22-23
eLearning consist in a application for schools, teams or companies to organize their courses and tutorials using iframes to embed the videos or presentations.

## Requirements
- ### 🤖 Backend
  - AMP (Apache, MySQL, PHP)
      - [Xampp for Windows]("https://www.apachefriends.org/es/index.html")
      - [Tutorial for Linux]("https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-20-04")
  - [Mamp for Mac OS]("https://www.mamp.info/en/downloads/")
  - [Composer (PHP Package Manager)]("https://getcomposer.org/download/")
  - Firebase/JWT (Install with composer of you can download it manually [here]("https://github.com/firebase/php-jwt/releases/tag/v6.4.0"))

- ### 🎨 Frontend
  - Node 16.10.0 + and NPM (Node Package Manager)
  - ReactJS 18 +
  - @mui 15.11 +

## Get Started

1. Installing requirements for backend application 


    ```bash
    cd ./backend && composer install
    ```
    Remove comments in your Apache server in `php.ini` for the next values:
    ```ini
    extension=gd
    ```

2. Install the requirements for frontend application

    > Using NPM:
    ```bash
    cd ./frontend && npm install
    ```
    > Using Yarn:
    ```bash
    cd ./frontend && yarn install
    ```

3. Import database using the file ```elearning_16.sql``` at root of this project
   1. Import it using PhpMyAdmin: [http://localhost/phpmyadmin]("http://localhost/phpmyadmin")
    ![]("word/phpmyadmin_import_sql.png")

4. Run backend starting Apache Server and MySQL using your AMP software (Xamp, Mamp or your linux services)
    ```bash
    sudo service apache2 start
    ```
    Run MySQL
    ```bash
    sudo service mariadb start
    ```
    Change the enviroment values in .htaccess with you database credentials:
    ```txt
    # Enviroment variables
    SetEnv DB_HOST localhost
    SetEnv DB_USER database_name
    SetEnv DB_PASS database_password
    SetEnv DB_NAME database_name
    ```
    Add JWT secret key:
    ```txt
    SetEnv JWT_SECRET_KEY your_secret_key
    ```

    Set hostname to use it in logic of media management:

    ```txt
    SetEnv HOST http://localhost/
    ```
5. Run Frontend using the next commands:
   
   Access to frontend folder
   ```bash
   cd ./frontend
   ```
   Start it using the next command:
   ```bash
   npm start
   ```
