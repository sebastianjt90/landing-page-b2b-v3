# Guía Completa de Pruebas - Atribución UTM HubSpot

## 🧪 Métodos de Prueba Disponibles

### 1. **Prueba Rápida de API (2 minutos)**
```bash
# En la terminal del proyecto
node scripts/test-production-api.js
```
✅ **Qué valida**: API funcionando, conexión HubSpot, estructura de datos

### 2. **Análisis de Propiedades HubSpot (1 minuto)**
```bash
# Verifica qué propiedades están disponibles
node scripts/analyze-hubspot-attribution.js
```
✅ **Qué valida**: Configuración HubSpot, propiedades disponibles, permisos

### 3. **Test Completo de Atribución (3 minutos)**
```bash
# Test con datos completos incluidos Click IDs
node scripts/test-complete-attribution.js
```
✅ **Qué valida**: Todos los datos que se envían, comparación antes/después

## 🎯 Prueba Real End-to-End (LA MÁS IMPORTANTE)

### **Paso 1: Crear Contact de Prueba en HubSpot**
1. Ve a HubSpot → Contacts
2. Crea contacto nuevo con email: `test.attribution.real@tu-dominio.com`
3. Guarda el contacto

### **Paso 2: Visitar con UTMs**
Abre en una **ventana privada/incógnito**:
```
https://lahaus.ai?utm_source=test_final&utm_medium=manual&utm_campaign=validation_2024&utm_content=end_to_end&gclid=test_google_123
```

### **Paso 3: Verificar Captura UTM**
1. Abre **DevTools** (F12)
2. Ve a la pestaña **Console**
3. Debes ver estos logs:
```
🎯 IMMEDIATE UTM CAPTURE: {utm_source: test_final, utm_medium: manual...}
🔧 Initializing HubSpot with pre-captured UTMs...
📡 Setting HubSpot attributes BEFORE tracking loads
🏷️ Set utm_source = test_final
🏷️ Set utm_medium = manual
```

### **Paso 4: Simular Booking**
1. Click en **"Book a demo"**
2. En el modal, llena el formulario con el email de prueba
3. **NO completes realmente** - solo simula hasta llenar email
4. En console debes ver:
```
🎯 MEETING BOOKING DETECTED
📧 Found email for attribution: test.attribution.real@tu-dominio.com
⏰ Scheduling delayed attribution for test.attribution.real@tu-dominio.com
```

### **Paso 5: Probar API Directamente**
En otra terminal:
```bash
curl -X POST https://lahaus.ai/api/hubspot-attribution \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.attribution.real@tu-dominio.com",
    "utmData": {
      "utm_source": "test_final",
      "utm_medium": "manual",
      "utm_campaign": "validation_2024",
      "utm_content": "end_to_end",
      "gclid": "test_google_123"
    }
  }'
```

**Respuesta esperada**:
```json
{
  "success": true,
  "contactId": "12345",
  "updatedProperties": {
    "hs_analytics_source": "test_final",
    "hs_analytics_source_data_1": "manual",
    "hs_latest_source": "test_final",
    "hs_google_click_id": "test_google_123",
    "recent_conversion_event_name": "Meeting Booked"
    // ... más propiedades
  }
}
```

### **Paso 6: Verificar en HubSpot**
1. Ve a HubSpot → Contacts
2. Busca `test.attribution.real@tu-dominio.com`
3. En la pestaña **"About"**, busca sección **"Marketing"**
4. **ANTES** veías:
   ```
   Fuente original de tráfico: Tráfico directo
   ```
5. **AHORA** debes ver:
   ```
   Fuente original de tráfico: test_final
   Original Traffic Source Drill-Down 1: manual
   Original Traffic Source Drill-Down 2: validation_2024
   ```

## 🔍 Diagnóstico de Problemas

### **Si la API devuelve 404 "Contact not found"**
✅ **NORMAL** - Significa que la API funciona pero el contacto no existe
🔧 **Solución**: Crear el contacto en HubSpot primero

### **Si la API devuelve 401 Unauthorized**
❌ **Error de token**
🔧 **Verificar**:
```bash
# Verificar token en variables de entorno
npx vercel env ls
# Debería mostrar HUBSPOT_PRIVATE_ACCESS_TOKEN
```

### **Si no se capturan UTMs en console**
❌ **Error de frontend**
🔧 **Verificar**:
- URL tiene UTMs correctos
- Console no muestra errores JavaScript
- Ventana incógnito (sin extensiones)

### **Si HubSpot no actualiza propiedades**
❌ **Error de permisos HubSpot**
🔧 **Verificar**:
1. Private App tiene scopes: `crm.objects.contacts.read` y `crm.objects.contacts.write`
2. App está instalada en HubSpot
3. Token no ha expirado

## ⚡ Prueba Super Rápida (30 segundos)

### **Opción 1: Script Node.js (Recomendado)**
```bash
node scripts/quick-test.js
```

### **Opción 2: Script Bash con curl**
```bash
./scripts/curl-test.sh
```

### **Opción 3: curl manual (maneja redirecciones)**
```bash
curl -s -L -X POST https://lahaus.ai/api/hubspot-attribution \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nonexistent.com","utmData":{"utm_source":"test"}}'
```

**Resultado esperado**:
```json
{"error": "Contact not found"}
```
✅ Si ves este error = **API FUNCIONANDO PERFECTAMENTE**
❌ Si solo ves "Redirecting..." = usar los scripts de arriba
❌ Si ves otro error = revisar configuración

## 📊 Validation Checklist

- [ ] Scripts de prueba ejecutan sin errores
- [ ] API responde (aunque sea con 404)
- [ ] UTMs se capturan en browser console
- [ ] HubSpot Private App configurada
- [ ] Variables de entorno en Vercel
- [ ] Contact de prueba creado en HubSpot
- [ ] Propiedades actualizadas en HubSpot

## 🎉 Señales de Éxito Total

1. **Console logs** muestran captura UTM
2. **API test** devuelve success con contacto real
3. **HubSpot contact** muestra `utm_source` real en lugar de "Tráfico directo"
4. **Multiple properties** actualizadas (15+ propiedades)
5. **Click IDs** capturados si están presentes
6. **Timestamps** y eventos de conversión registrados

¡Cuando veas todo esto funcionando, la atribución UTM estará 100% operativa!