<?php

# SiteConfig
$router->get('/api/site-config', 'SiteConfigController@get');
$router->put('/api/site-config', 'SiteConfigController@update');

# Menu
$router->options('/api/menu', 'MenuController@getSuccessResponse');
$router->get('/api/menu', 'MenuController@get');
$router->put('/api/menu', 'MenuController@update');

# Auth
$router->post('/auth/login', 'UserController@login');
$router->post('/auth/register', 'UserController@register');
# Auth > Google
$router->post('/auth/google', 'UserController@googleAuth');

# Profile
$router->options('/api/profile', 'UserController@getSuccessResponse');
$router->get('/api/profile', 'UserController@getMyProfileInfo');
$router->post('/api/profile', 'UserController@updateMyProfileInfo');

# Courses
$router->options('/api/courses/', 'CoursesController@getSuccessResponse');
$router->get('/api/courses', 'CoursesController@getMany');

$router->options('/api/courses/:slug', 'CoursesController@getSuccessResponse');
$router->get('/api/courses/:slug', 'CoursesController@getManyByCategory');

$router->options('/api/course', 'CoursesController@getSuccessResponse');
$router->get('/api/course/:slug', 'CoursesController@getOne');
$router->post('/api/course', 'CoursesController@create');

$router->options('/api/course/:id', 'CoursesController@getSuccessResponse');
$router->post('/api/course/:id', 'CoursesController@update');
$router->delete('/api/course/:id', 'CoursesController@delete');

# Course Categories
$router->get('/api/categories', 'CategoriesController@getAll');
$router->get('/api/category', 'CategoriesController@getOne');

$router->options('/api/category', 'CategoriesController@getSuccessResponse');
$router->put('/api/category/:id', 'CategoriesController@update');
$router->post('/api/category', 'CategoriesController@create');

# Course Content
$router->options('/api/course-content', 'CourseContentController@getSuccessResponse');
$router->post('/api/course-content', 'CourseContentController@create');
$router->get('/api/course-content', 'CourseContentController@getAll');


$router->options('/api/course-content/:id', 'CourseContentController@getSuccessResponse');
$router->get('/api/course-content/:id', 'CourseContentController@getOne');
$router->post('/api/course-content/:id', 'CourseContentController@update');
$router->delete('/api/course-content/:id', 'CourseContentController@delete');

$router->options('/api/content-progress/:id', 'CourseContentController@getSuccessResponse');
$router->post('/api/content-progress/:id', 'CourseContentController@updateContentProgress');

# Users
$router->options('/api/users', 'UserController@getSuccessResponse');
$router->get('/api/users', 'UserController@getMany');

$router->options('/api/users', 'UserController@getSuccessResponse');
$router->get('/api/user/:id', 'UserController@getOne');
