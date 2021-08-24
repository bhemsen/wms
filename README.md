<h3>What does this repository do?</h3>
<p>This is a basic laravel package combined with a basic jwt-auth integration (taken from: <a href="https://www.positronx.io/laravel-jwt-authentication-tutorial-user-login-signup-api/" target="__blank">https://www.positronx.io/laravel-jwt-authentication-tutorial-user-login-signup-api</a>) and a simple websocket setup (taken from: <a href="https://beyondco.de/docs/laravel-websockets/getting-started/introduction" target="__blank">https://beyondco.de/docs/laravel-websockets/getting-started/introduction</a>)</p>

<h3>How to make it run?</h3>
<p>After you checked out the repo, you need to do the following steps:</p>
<ul>
    <li>
        1. Run composer install in your root directory:<br/>
        <code>composer install</code>
    </li>
    <li>
        2. Create an .env file from the .env.example and adjust the database credentials to your needs
    </li>
    <li>
        3. Run the following code in the root directory to create an app key:<br/>
        <code>php artisan key:generate</code>
    </li>
    <li>
        4. Run the following code in the root directory to create an jwt secret:<br/>
        <code>php artisan jwt:secret</code>
    </li>
</ul>

<h3>How to start the applications?</h3>
<ul>
    <li>
        The backend application has to be started from the root:<br/>
        <code>php artisan serve</code>
    </li>
    <li>
        The Angular Application has to be started from the /resources/frontend/Angular directory:<br/>
        <code>ng serve</code>
    </li>
    <li>
        The websocket application has to be started from the repository root:<br/>
        <code>php artisan websockets:serve</code>
    </li>
</ul>

<h3>How can I test the applications?</h3>
<ul>
    <li>
        The backend application can be opened at http://127.0.0.1:8000
    </li>
    <li>
        The angular application can be opened at http://127.0.0.1:4200
    </li>
    <li>
        The websocket application can be opened at http://127.0.0.1:6001 (but it is empty for some reason :()
    </li>
    <li>
        To test the websocket do the following:
        <ul>
            <li>
                - open http://127.0.0.1:8000
            </li>
            <li>
                - have a look into the console tab in your browser
            </li>
            <li>
                - open a terminal at root level of the repository and open tinker: <br/>
                <code>php artisan tinker</code>
            </li>
            <li>
                - inside tinker type the following and press enter:<br/>
                <code>event(new App\Events\NewMessage("hello world"))</code>
            <li>
            <li>
                - If everything works properly you should see "hello world" inside your console tab
            </li>
        </ul>
    </li>
</ul>

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 1500 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**
- **[CMS Max](https://www.cmsmax.com/)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
