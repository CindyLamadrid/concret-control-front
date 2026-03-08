# Estructura de Estilos SCSS

## Descripción
Los estilos de la aplicación han sido migrados de CSS a SCSS para aprovechar las ventajas de preprocesadores como variables, mixins y anidamiento.

## Estructura de Archivos

### Archivos Base
- `_variables.scss` - Contiene todas las variables globales (colores, tamaños, espaciados, breakpoints)
- `_mixins.scss` - Contiene mixins reutilizables para responsive design y componentes comunes

### Archivos de Componentes
- `button.scss` - Estilos para botones
- `container.scss` - Estilos para contenedores y layouts
- `controls.scss` - Estilos para inputs, selects y controles de formulario
- `login.scss` - Estilos específicos para la pantalla de login
- `menu.scss` - Estilos para el menú de navegación
- `table.scss` - Estilos para tablas

### Archivos Principales
- `../App.scss` - Estilos globales de la aplicación
- `../index.scss` - Estilos base del documento

## Variables Principales

### Colores
- `$primary-color: #0F5258` - Color primario
- `$secondary-color: #06a796` - Color secundario
- `$tertiary-color: #004d40` - Color terciario

### Breakpoints Responsive
- `$breakpoint-mobile: 480px` - Dispositivos móviles
- `$breakpoint-tablet: 768px` - Tablets
- `$breakpoint-desktop: 1024px` - Desktop
- `$breakpoint-large: 1200px` - Pantallas grandes

## Mixins Disponibles

### `@mixin respond-to($breakpoint)`
Facilita la creación de media queries responsive.

**Uso:**
```scss
.elemento {
  width: 100%;
  
  @include respond-to(mobile) {
    width: 50%;
  }
}
```

**Breakpoints disponibles:**
- `mobile` - max-width: 480px
- `tablet` - 481px a 767px
- `desktop` - 768px a 1024px
- `large` - min-width: 1025px

### `@mixin button-base($bg-color, $text-color, $border-color)`
Crea estilos base para botones con responsive automático.

### `@mixin title($font-size, $color, $border-left)`
Crea estilos para títulos con opciones de borde.

### `@mixin input-base`
Estilos base para inputs con responsive.

### `@mixin select-base`
Estilos base para selects con responsive.

### `@mixin container-responsive`
Hace un contenedor responsive con padding adaptativo.

### `@mixin table-responsive`
Convierte tablas en formato responsive para móviles.

## Características Responsive

La aplicación ahora es completamente responsive:

1. **Móviles (< 480px):**
   - Formularios a ancho completo
   - Tablas en formato de tarjetas
   - Menú colapsable
   - Fuentes reducidas
   - Padding reducido

2. **Tablets (481px - 767px):**
   - Layout adaptado a pantalla mediana
   - Elementos con anchos intermedios

3. **Desktop (768px - 1024px):**
   - Layout optimizado para escritorio
   - Todos los elementos visibles

4. **Pantallas Grandes (> 1024px):**
   - Layout completo sin restricciones

## Cómo Usar

### Importar en componentes
```scss
@import './variables';
@import './mixins';

.mi-componente {
  color: $primary-color;
  
  @include respond-to(mobile) {
    font-size: $font-size-small;
  }
}
```

### Crear nuevos estilos responsive
```scss
.nuevo-elemento {
  width: 50%;
  padding: 20px;
  
  @include respond-to(mobile) {
    width: 100%;
    padding: 10px;
  }
  
  @include respond-to(tablet) {
    width: 75%;
  }
}
```

## Notas Importantes

1. La apariencia visual en desktop se mantiene idéntica a la versión anterior
2. Los archivos CSS originales se mantienen como referencia pero ya no se usan
3. Todos los imports en JS ahora apuntan a archivos .scss
4. SASS se compila automáticamente durante el build de React
