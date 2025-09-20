# Guía de Configuración HubSpot Private App

## Paso 1: Crear Private App en HubSpot

### 1.1 Acceso a HubSpot Settings
1. Ve a tu cuenta de HubSpot: https://app.hubspot.com
2. En la esquina superior derecha, haz clic en el ⚙️ (Settings)
3. En el menú lateral izquierdo, ve a **Integrations** → **Private Apps**

### 1.2 Crear Nueva Private App
1. Haz clic en **"Create a private app"**
2. Completa la información básica:
   - **App name**: `LaHaus AI UTM Attribution`
   - **App description**: `Backend API for updating UTM attribution on HubSpot contacts`
   - **Logo**: (opcional, puedes subir el logo de LaHaus AI)

### 1.3 Configurar Scopes (Permisos)
En la pestaña **"Scopes"**, habilita los siguientes permisos:

#### CRM - Contacts:
- ✅ `crm.objects.contacts.read` - Read contacts
- ✅ `crm.objects.contacts.write` - Write contacts

#### Opcional (para funcionalidades futuras):
- ✅ `crm.objects.companies.read` - Read companies
- ✅ `crm.schemas.contacts.read` - Read contact properties

### 1.4 Crear la App
1. Haz clic en **"Create app"**
2. HubSpot te mostrará una advertencia sobre el token privado
3. Haz clic en **"Continue creating"**

## Paso 2: Obtener Access Token

### 2.1 Copiar Token
1. Después de crear la app, verás la página de configuración
2. En la pestaña **"Auth"**, encontrarás el **Access token**
3. Haz clic en **"Show token"**
4. **COPIA EL TOKEN COMPLETO** (empieza con `pat-na1-...` o similar)

### 2.2 Instalar la App
1. Ve a la pestaña **"Install app"**
2. Haz clic en **"Install app"**
3. Confirma la instalación

## Paso 3: Configurar Variables de Entorno

### 3.1 Crear archivo .env.local
```bash
# En la raíz del proyecto landing-page-b2b-v3
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=21568098
HUBSPOT_PRIVATE_ACCESS_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_GTM_ID=GTM-T7BT77WG
```

### 3.2 Configurar en Vercel (Producción)
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega las variables:
   - `HUBSPOT_PRIVATE_ACCESS_TOKEN` = tu token copiado
   - `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` = 21568098

## Paso 4: Verificar Configuración

### 4.1 Test Local
```bash
# Verificar que las variables están cargadas
curl -X POST http://localhost:3000/api/hubspot-attribution \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "utmData": {
      "utm_source": "test",
      "utm_medium": "api",
      "utm_campaign": "setup"
    }
  }'
```

### 4.2 Verificar Permisos
El endpoint `/api/hubspot-attribution` debería:
- ✅ Encontrar contactos por email
- ✅ Actualizar propiedades de contacto
- ✅ Retornar confirmación de éxito

## Paso 5: Propiedades HubSpot Mapeadas

La API actualiza estas propiedades en HubSpot:

| UTM Parameter | HubSpot Property | Descripción |
|---------------|------------------|-------------|
| `utm_source` | `hs_analytics_source` | Fuente de tráfico original |
| `utm_medium` | `hs_analytics_source_data_1` | Medio de tráfico |
| `utm_campaign` | `hs_analytics_source_data_2` | Campaña |
| `utm_content` | `utm_content` | Contenido del anuncio |
| `utm_term` | `utm_term` | Término de búsqueda |

## Troubleshooting

### Error 401 Unauthorized
- Verifica que el token está bien copiado
- Confirma que la app está instalada
- Revisa que los scopes están habilitados

### Error 404 Contact Not Found
- El contacto debe existir en HubSpot antes de actualizar
- Verifica que el email es correcto
- La API buscará por email exacto

### Error 403 Forbidden
- Faltan permisos en la Private App
- Agrega los scopes necesarios y reinstala la app

## Seguridad

🔐 **IMPORTANTE**:
- Nunca commits el token en git
- Úsalo solo en variables de entorno
- El token da acceso completo a tus contactos HubSpot
- Revoca y regenera si se compromete