<?php

class Router
{
    protected $routes = [];

    public function get($path, $controller)
    {
        $this->routes['GET'][$path] = $controller;
    }

    public function post($path, $controller)
    {
        $this->routes['POST'][$path] = $controller;
    }

    public function put($path, $controller)
    {
        $this->routes['PUT'][$path] = $controller;
    }

    public function delete($path, $controller)
    {
        $this->routes['DELETE'][$path] = $controller;
    }

    public function options($path, $controller)
    {
        $this->routes['OPTIONS'][$path] = $controller;
    }

    protected function callController($controller, $params)
    {
        list($controllerClass, $method) = explode('@', $controller);

        require_once 'app/controllers/' . $controllerClass . '.php';

        $controllerInstance = new $controllerClass();

        call_user_func_array([$controllerInstance, $method], $params);
    }

    public function run()
    {
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $requestUriArray = explode('?', $_SERVER['REQUEST_URI'], 2);
        $requestUri = $requestUriArray[0];
        
        if (isset($this->routes[$requestMethod])) {
            $routes = $this->routes[$requestMethod];

            foreach ($routes as $route => $controller) {
                $pattern = $this->getRoutePattern($route);

                if (preg_match($pattern, $requestUri, $matches)) {
                    array_shift($matches);
                    $params = array_values($matches);

                    $this->callController($controller, $params);
                    return;
                }
            }
        }

        // Si no se encontró ninguna ruta coincidente, muestra un error 404
        http_response_code(404);
        echo json_encode(array("message" => "Route not found"));
        return;
    }

    protected function getRoutePattern($route)
    {
        $pattern = '/^' . str_replace('/', '\/', $route) . '$/';
        $pattern = preg_replace('/:(\w+)/', '(?P<$1>[^\/]+)', $pattern);

        return $pattern;
    }
}
