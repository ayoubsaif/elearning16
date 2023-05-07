<?php

# SiteConfig
$router->get('/api/site-config', 'SiteConfigController@get');

# Auth
$router->post('/api/login', 'UserController@login');
$router->post('/api/register', 'UserController@register');

# Profile
$router->get('/api/profile', 'UserController@getMyProfileInfo');
$router->put('/api/profile', 'UserController@updateMyProfileInfo');

# Courses
$router->get('/api/courses', 'CoursesController@getAll');

$router->get('/api/course/:slug', 'CoursesController@getOne');
$router->post('/api/course', 'CoursesController@create');

# Course Content
$router->post('/api/course-content', 'CourseContentController@create');
$router->get('/api/course-content', 'CourseContentController@getAll');
$router->get('/api/course-content/:id', 'CourseContentController@getOne');

# Attachments
$router->get('/api/attachments', 'AttachmentsController@getAll');

$router->post('/api/attachment', 'AttachmentsController@create');
$router->get('/api/attachment/:id', 'AttachmentsController@getOne');
