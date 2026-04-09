<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" translate="no">
<head>
    @php
        // Accedemos al dato compartido por Inertia
        $logoPath = $page['props']['appLogo'] ?? 'https://res.cloudinary.com/.../default_favicon.jpg';
    @endphp
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Título dinámico -->
    <title inertia>Terrazas</title>
    

    <!-- Favicon -->
    <link rel="icon" href="{{ $logoPath }}" type="image/jpeg">

    <!-- Fuente principal -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">

    

    <!-- Fuentes -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts Laravel + Inertia + React -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
