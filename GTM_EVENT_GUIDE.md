# Guía de Implementación de Eventos GTM para "Agenda Demo"

## 1. Implementación en el Código (✅ Completado)

### Eventos implementados:

#### A. Botón Hero Section (Página principal)
- **Ubicación**: `/components/hero-section.tsx:139`
- **Evento**: `book_demo_click`
- **Label**: `hero_section`
- **Datos enviados**:
  ```javascript
  {
    event: 'book_demo_click',
    event_category: 'engagement',
    event_label: 'hero_section',
    page_location: 'main_page',
    button_text: 'Agenda un demo',
    locale: 'es' // o 'en'
  }
  ```

#### B. Botón Header (Todas las páginas)
- **Ubicación**: `/components/hero-section.tsx:45`
- **Evento**: `book_demo_click`
- **Label**: `header`
- **Datos enviados**:
  ```javascript
  {
    event: 'book_demo_click',
    event_category: 'engagement',
    event_label: 'header',
    page_location: 'main_page',
    button_text: 'Agenda demo',
    locale: 'es' // o 'en'
  }
  ```

#### C. Botón CTA Section (Página principal)
- **Ubicación**: `/components/hero-section.tsx:180`
- **Evento**: `book_demo_click`
- **Label**: `cta_section`
- **Datos enviados**:
  ```javascript
  {
    event: 'book_demo_click',
    event_category: 'engagement',
    event_label: 'cta_section',
    page_location: 'main_page',
    button_text: 'Agenda tu demo ahora',
    locale: 'es' // o 'en'
  }
  ```

#### D. Botón VSL (Página VSL)
- **Ubicación**: `/components/content-5.tsx:112`
- **Evento**: `book_demo_click`
- **Label**: `vsl_section`
- **Datos enviados**:
  ```javascript
  {
    event: 'book_demo_click',
    event_category: 'engagement',
    event_label: 'vsl_section',
    page_location: 'vsl_page',
    button_text: 'Agenda tu demo ahora',
    locale: 'es'
  }
  ```

## 2. Configuración en Google Tag Manager

### Paso 1: Crear Variables de Data Layer

1. Ve a **Variables** en GTM
2. Crea las siguientes variables de capa de datos:

#### Variable: Event Category
- **Tipo**: Variable de capa de datos
- **Nombre de variable**: `event_category`
- **Versión**: Versión 2

#### Variable: Event Label
- **Tipo**: Variable de capa de datos
- **Nombre de variable**: `event_label`
- **Versión**: Versión 2

#### Variable: Page Location
- **Tipo**: Variable de capa de datos
- **Nombre de variable**: `page_location`
- **Versión**: Versión 2

#### Variable: Button Text
- **Tipo**: Variable de capa de datos
- **Nombre de variable**: `button_text`
- **Versión**: Versión 2

#### Variable: Locale
- **Tipo**: Variable de capa de datos
- **Nombre de variable**: `locale`
- **Versión**: Versión 2

### Paso 2: Crear el Trigger (Activador)

1. Ve a **Activadores** en GTM
2. Crea un nuevo activador:
   - **Nombre**: `Book Demo Click`
   - **Tipo**: Evento personalizado
   - **Nombre del evento**: `book_demo_click`
   - **Este activador se activa en**: Todos los eventos personalizados

### Paso 3: Crear la Etiqueta para Google Analytics 4

1. Ve a **Etiquetas** en GTM
2. Crea una nueva etiqueta:

#### Configuración de la etiqueta:
- **Nombre**: `GA4 - Book Demo Click`
- **Tipo**: Google Analytics: Evento de GA4
- **ID de medición**: Tu ID de GA4 (ej: G-XXXXXXXXXX)
- **Nombre del evento**: `book_demo_click`

#### Parámetros del evento:
Añade estos parámetros:
- `event_category`: {{Event Category}}
- `event_label`: {{Event Label}}
- `page_location`: {{Page Location}}
- `button_text`: {{Button Text}}
- `locale`: {{Locale}}

#### Activador:
- Selecciona el activador `Book Demo Click` creado anteriormente

### Paso 4: Crear la Etiqueta para Meta/Facebook Pixel

1. Crea una nueva etiqueta:

#### Configuración de la etiqueta:
- **Nombre**: `Facebook - Book Demo Click`
- **Tipo**: HTML personalizado
- **Código HTML**:
```html
<script>
  fbq('track', 'Lead', {
    content_name: '{{Button Text}}',
    content_category: '{{Event Category}}',
    value: 1,
    currency: 'USD',
    custom_data: {
      event_label: '{{Event Label}}',
      page_location: '{{Page Location}}',
      locale: '{{Locale}}'
    }
  });
</script>
```

#### Activador:
- Selecciona el activador `Book Demo Click` creado anteriormente

### Paso 5: Probar la Implementación

1. Activa el **Modo Vista Previa** en GTM
2. Navega a tu sitio web
3. Haz clic en los botones "Agenda demo"
4. Verifica en el panel de depuración que:
   - El evento `book_demo_click` se dispara
   - Las variables contienen los valores correctos
   - Las etiquetas se ejecutan correctamente

### Paso 6: Publicar los Cambios

1. Una vez verificado que todo funciona:
2. Haz clic en **Enviar** en GTM
3. Añade un nombre y descripción a la versión
4. Haz clic en **Publicar**

## 3. Verificación en Google Analytics 4

### Tiempo Real:
1. Ve a GA4 > **Informes** > **Tiempo real**
2. Haz clic en un botón "Agenda demo" en tu sitio
3. Deberías ver el evento `book_demo_click` aparecer inmediatamente

### DebugView:
1. Ve a GA4 > **Administrar** > **DebugView**
2. Con el modo de depuración activado, verás los eventos detallados con todos sus parámetros

## 4. Crear Informes Personalizados

En GA4, puedes crear informes para analizar:

1. **Conversiones por ubicación del botón**:
   - Dimensión: `event_label`
   - Métrica: Conteo de eventos

2. **Conversiones por idioma**:
   - Dimensión: `locale`
   - Métrica: Conteo de eventos

3. **Rendimiento por página**:
   - Dimensión: `page_location`
   - Métrica: Conteo de eventos

## 5. Configuración de Objetivos/Conversiones

En GA4:
1. Ve a **Administrar** > **Eventos**
2. Encuentra `book_demo_click`
3. Activa "Marcar como conversión"

## Notas Importantes

### CSP (Content Security Policy)
El archivo `next.config.ts` ya está configurado para permitir:
- Scripts de Facebook/Meta
- Conexiones a APIs de Facebook/Meta
- Píxeles de seguimiento

### Variables de Entorno
- GTM ID está en `.env.local` y `.env.production`
- Valor actual: `GTM-T7BT77WG`

### Testing
Para probar localmente:
```bash
pnpm dev
# Abre http://localhost:3000
# Abre la consola del navegador
# Los eventos GTM aparecerán en console.log
```

## Troubleshooting

### Si los eventos no se disparan:
1. Verifica que GTM esté cargando (revisa Network tab)
2. Verifica que no haya errores de CSP en la consola
3. Asegúrate de que `window.dataLayer` existe
4. Revisa que el GTM ID sea correcto

### Si Meta/Facebook no recibe eventos:
1. Verifica que el Pixel ID esté configurado en GTM
2. Revisa la configuración de CSP en `next.config.ts`
3. Usa Facebook Pixel Helper para debug

## Contacto y Soporte

Para cualquier problema con la implementación, verifica:
1. Los logs de la consola del navegador
2. El panel de depuración de GTM
3. Los reportes en tiempo real de GA4