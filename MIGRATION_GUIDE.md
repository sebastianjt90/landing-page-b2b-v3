# 🚀 Guía de Migración Completa - LaHaus AI Landing Page

## 📋 Resumen Ejecutivo

Esta guía documenta todos los servicios, integraciones y credenciales necesarias para migrar la landing page de LaHaus AI al nuevo dominio/proyecto manteniendo todas las funcionalidades de tracking y analytics.

---

## 1. 🔑 Credenciales y Servicios Actuales

### 1.1 Google Tag Manager (GTM)
```
GTM ID: GTM-T7BT77WG
URL: https://tagmanager.google.com
Propósito: Gestión centralizada de tags y analytics
```

### 1.2 HubSpot
```
Portal ID: 21568098
Form GUID: 64fc2ae0-2810-42af-a8dd-e7bf95f20df2
URL Portal: https://app.hubspot.com/portal/21568098
Propósito: CRM y gestión de leads del formulario
```

### 1.3 Vercel (Hosting Actual)
```
Project ID: prj_kXr4hRNQBr7QL89cEsbPzogybBCy
Org ID: team_udgBAa62GzTjdB8e67nqg3JO
Team: seba9010s-projects
Project Name: landing-page-b2b-v2
```

### 1.4 Servicios Configurados (vía GTM)
- **Google Analytics 4**: Configurado dentro de GTM
- **PostHog**: Preparado pero no activado
- **Google Ads**: Tracking de conversiones (si está activo)

---

## 2. 📦 Archivos de Configuración a Migrar

### 2.1 Variables de Entorno (.env)
```bash
# Google Tag Manager
PUBLIC_GTM_ID=GTM-T7BT77WG

# HubSpot
HUBSPOT_PORTAL_ID=21568098
HUBSPOT_FORM_GUID=64fc2ae0-2810-42af-a8dd-e7bf95f20df2

# PostHog (preparado pero no activo)
# PUBLIC_POSTHOG_KEY=phc_XXXXXXXXXX
# PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 2.2 Archivos de Analytics
```
src/components/analytics/DataLayer.astro
src/layouts/Layout.astro (contiene GTM)
src/pages/api/hubspot-submit.json.ts
```

---

## 3. 🔄 Proceso de Migración Paso a Paso

### Paso 1: Preparación del Nuevo Proyecto

#### 1.1 Clonar/Copiar el proyecto
```bash
# Opción A: Si es un repositorio nuevo
git clone [nuevo-repositorio]
cd [nuevo-proyecto]

# Opción B: Si es actualización del mismo repo
git checkout -b nueva-version
```

#### 1.2 Instalar dependencias
```bash
npm install
# o
pnpm install
```

#### 1.3 Copiar variables de entorno
```bash
# Crear archivo .env con las credenciales
cp .env.example .env
# Editar con las credenciales listadas arriba
```

### Paso 2: Configurar Google Tag Manager

#### 2.1 Acceder a GTM
1. Ir a https://tagmanager.google.com
2. Usar cuenta con acceso a: GTM-T7BT77WG
3. **IMPORTANTE**: NO crear nuevo contenedor, usar el existente

#### 2.2 Verificar Tags Activos
En GTM, verificar que estén estos tags:
- [ ] Google Tag (GA4 Config)
- [ ] Eventos de formulario
- [ ] Tracking de scroll
- [ ] Conversiones configuradas

#### 2.3 Actualizar dominio si cambia
Si el dominio cambia:
1. En GTM → Variables → Configuración
2. Actualizar cualquier variable con el dominio hardcodeado
3. Actualizar triggers que dependan del dominio

### Paso 3: Migrar HubSpot

#### 3.1 Verificar acceso
```
Portal: https://app.hubspot.com/portal/21568098
Credenciales: [solicitar al equipo]
```

#### 3.2 Configurar formulario
El formulario actual envía a:
```javascript
// src/pages/api/hubspot-submit.json.ts
const PORTAL_ID = '21568098';
const FORM_GUID = '64fc2ae0-2810-42af-a8dd-e7bf95f20df2';
```

**NO CAMBIAR** estos valores a menos que se cree nuevo formulario.

#### 3.3 Verificar webhook
Asegurar que el endpoint API funcione:
```bash
# Test local
curl -X POST http://localhost:4321/api/hubspot-submit.json \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstname":"Test"}'
```

### Paso 4: Configurar Vercel

#### 4.1 Instalar Vercel CLI
```bash
npm i -g vercel
```

#### 4.2 Login y configurar
```bash
vercel login
# Usar cuenta con acceso al team: seba9010s-projects
```

#### 4.3 Configurar proyecto

##### Opción A: Reemplazar proyecto existente
```bash
# En el directorio del nuevo proyecto
vercel

# Seleccionar:
# - Link to existing project
# - Project: landing-page-b2b-v2
```

##### Opción B: Crear nuevo proyecto
```bash
vercel

# Seleccionar:
# - Create new project
# - Configurar nombre: lahaus-ai-landing (o el deseado)
```

#### 4.4 Configurar variables de entorno en Vercel
```bash
# Agregar cada variable
vercel env add PUBLIC_GTM_ID
# Valor: GTM-T7BT77WG

vercel env add HUBSPOT_PORTAL_ID
# Valor: 21568098

vercel env add HUBSPOT_FORM_GUID
# Valor: 64fc2ae0-2810-42af-a8dd-e7bf95f20df2
```

#### 4.5 Configurar dominio
```bash
# Si se mantiene el mismo dominio
vercel domains ls

# Si se agrega nuevo dominio
vercel domains add lahaus.ai
```

### Paso 5: Deploy y Verificación

#### 5.1 Deploy a producción
```bash
# Deploy directo
vercel --prod

# O via Git (recomendado)
git push origin main
```

#### 5.2 Verificar GTM
1. Abrir https://[tu-dominio]
2. Abrir Chrome DevTools → Console
3. Escribir: `dataLayer`
4. Verificar que existe y tiene eventos

#### 5.3 Verificar GA4
1. Ir a Google Analytics
2. Tiempo real → Ver si llegan visitas
3. Verificar eventos personalizados

#### 5.4 Test formulario
1. Enviar formulario de prueba
2. Verificar en HubSpot que llegue el contacto
3. Verificar en GTM/GA4 el evento de conversión

---

## 4. 🔍 Checklist de Verificación Post-Migración

### Analytics y Tracking
- [ ] GTM carga correctamente (verificar en Tag Assistant)
- [ ] GA4 registra visitas en tiempo real
- [ ] Eventos de scroll funcionan
- [ ] Eventos de formulario se disparan
- [ ] DataLayer tiene estructura correcta

### Formularios
- [ ] Formulario envía a HubSpot
- [ ] Se crean contactos en HubSpot
- [ ] Modal de éxito aparece
- [ ] Validaciones funcionan

### Performance
- [ ] Lighthouse score > 90
- [ ] No errores en consola
- [ ] GTM no afecta performance

### SEO
- [ ] Meta tags correctos
- [ ] Open Graph tags funcionan
- [ ] Canonical URLs correctas
- [ ] Sitemap generado

---

## 5. 🚨 Troubleshooting Común

### Problema: GTM no carga
```javascript
// Verificar en consola
console.log(window.dataLayer);
// Si undefined, revisar orden de scripts en Layout.astro
```

### Problema: Formulario no envía
```bash
# Verificar variables de entorno
vercel env pull
# Revisar que estén las de HubSpot
```

### Problema: GA4 no registra eventos
1. Verificar en GTM Preview mode
2. Confirmar que triggers disparan
3. Revisar filtros en GA4

---

## 6. 🔐 Seguridad y Mejores Prácticas

### 6.1 NO commitear credenciales
```bash
# .gitignore debe incluir
.env
.env.local
.env.production
```

### 6.2 Usar variables de entorno
```javascript
// ✅ Correcto
const GTM_ID = import.meta.env.PUBLIC_GTM_ID;

// ❌ Incorrecto
const GTM_ID = 'GTM-T7BT77WG';
```

### 6.3 Validar en staging primero
```bash
# Deploy a preview
vercel

# Obtener URL preview y testear todo
```

---

## 7. 📊 Monitoreo Post-Migración

### Semana 1
- Revisar diariamente GA4 para anomalías
- Verificar tasa de conversión del formulario
- Monitorear errores en Vercel dashboard

### Semana 2-4
- Comparar métricas con período anterior
- Ajustar eventos si necesario
- Optimizar performance si hay issues

---

## 8. 👥 Contactos y Accesos Necesarios

### Para obtener accesos solicitar a:

#### Google Tag Manager / Analytics
- Necesitas acceso a: GTM-T7BT77WG
- Rol mínimo: Editor
- Solicitar a: [administrador GTM]

#### HubSpot
- Portal ID: 21568098
- Rol necesario: Marketing/Forms
- Solicitar a: [administrador HubSpot]

#### Vercel
- Team: seba9010s-projects
- Rol necesario: Member/Developer
- Solicitar a: [owner del team]

---

## 9. 📝 Scripts Útiles

### Script de verificación completa
```bash
#!/bin/bash
# verify-migration.sh

echo "🔍 Verificando migración..."

# Check GTM
echo "Checking GTM..."
curl -s https://[tu-dominio] | grep -q "GTM-T7BT77WG" && echo "✅ GTM OK" || echo "❌ GTM Missing"

# Check API endpoint
echo "Checking API..."
curl -s -o /dev/null -w "%{http_code}" https://[tu-dominio]/api/hubspot-submit.json | grep -q "405" && echo "✅ API OK" || echo "❌ API Error"

echo "✅ Verificación completa"
```

### Backup de configuración
```bash
#!/bin/bash
# backup-config.sh

# Crear backup de configuración
mkdir -p migration-backup
cp .env migration-backup/
cp -r src/components/analytics migration-backup/
cp src/layouts/Layout.astro migration-backup/
cp vercel.json migration-backup/ 2>/dev/null || true

echo "✅ Backup creado en migration-backup/"
```

---

## 10. 🆘 Soporte de Emergencia

### Si algo sale mal:

1. **Rollback rápido en Vercel**:
```bash
vercel rollback
```

2. **Restaurar GTM**:
- GTM guarda versiones automáticamente
- Ir a Versions → Seleccionar anterior → Publish

3. **Logs de error**:
```bash
vercel logs --follow
```

---

## 📅 Timeline Estimado

- **Preparación**: 1 hora
- **Configuración**: 2-3 horas  
- **Testing**: 1-2 horas
- **Deploy**: 30 minutos
- **Verificación**: 1 hora

**Total**: 5-7 horas para migración completa

---

## ✅ Confirmación Final

Una vez completada la migración, confirmar:

- [ ] Todos los servicios funcionan
- [ ] Analytics captura datos
- [ ] Formularios envían correctamente
- [ ] No hay errores en producción
- [ ] Performance es aceptable
- [ ] Documentación actualizada

---

*Documento generado: 31/08/2025*
*Versión: 1.0.0*
*Proyecto: LaHaus AI Landing Migration*