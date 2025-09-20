# Sistema de Atribución UTM Personalizada para HubSpot

Este documento describe la implementación completa del sistema de atribución UTM personalizada que supera las limitaciones de las propiedades Source Drilldown de HubSpot.

## 🎯 Problema Resuelto

Las propiedades **Source Drilldown** de HubSpot (`hs_analytics_source_data_1` y `hs_analytics_source_data_2`) son **solo de lectura** y no se pueden modificar via API. Este sistema implementa una **estrategia híbrida** usando propiedades personalizadas.

## 📋 Componentes del Sistema

### 1. Propiedades Custom en HubSpot
- **16 propiedades personalizadas** que replican y extienden la funcionalidad de Source Drilldown
- **Grupo personalizado** "Custom Attribution" para organización
- **Compatibilidad total** con reportes personalizados

### 2. Sistema de Atribución Inteligente
- **Mapeo automático** de UTMs a valores estándar de HubSpot
- **Extracción de contexto** (país, idioma) desde URLs y parámetros
- **Modelos de atribución** adaptados por tipo de campaña

### 3. Integración API Completa
- **Endpoint dedicado** `/api/contact` para formularios
- **Manejo de contactos nuevos** y existentes
- **Logging detallado** para debugging

### 4. Tracking del Cliente
- **Hook personalizado** `useAttribution` para React
- **Persistencia de sesión** en localStorage
- **Tracking de touchpoints** múltiples

## 🚀 Instalación y Configuración

### Paso 1: Crear Propiedades en HubSpot

```bash
# Configurar API key
export HUBSPOT_API_KEY="tu-api-key-aqui"

# Ejecutar script de creación
node scripts/create-hubspot-properties.js
```

### Paso 2: Configurar Variables de Entorno

```bash
# .env.local
HUBSPOT_API_KEY=tu-api-key-hubspot
```

### Paso 3: Integrar en Formularios

```tsx
import { useAttribution } from '@/hooks/use-attribution';

function ContactForm() {
  const { submitAttribution, isLoading } = useAttribution();

  const handleSubmit = async (formData) => {
    const result = await submitAttribution({
      email: formData.email,
      firstname: formData.firstname,
      lastname: formData.lastname,
      phone: formData.phone
    });

    if (result.success) {
      // Contacto enviado exitosamente
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
}
```

## 📊 Propiedades Creadas

### UTM Parameters Custom
- `utm_source_custom` - Fuente del tráfico (facebook, instagram, linkedin)
- `utm_medium_custom` - Medio del tráfico (cpc, rrss, email)
- `utm_campaign_custom` - Nombre de la campaña
- `utm_content_custom` - Contenido específico de la campaña
- `utm_term_custom` - Términos de búsqueda pagada
- `utm_id_custom` - ID único de campaña

### Source Drilldown Custom
- `source_detail_1_custom` - Equivalente a `hs_analytics_source_data_1`
- `source_detail_2_custom` - Equivalente a `hs_analytics_source_data_2`
- `attribution_model_custom` - Modelo de atribución aplicado

### Datos de Contexto
- `country_target_custom` - País objetivo (col, mx, general)
- `language_target_custom` - Idioma objetivo (es, en)
- `fbclid_custom` - Facebook Click ID
- `landing_page_custom` - Página de aterrizaje
- `referrer_custom` - URL de referencia

### Timestamps
- `first_attribution_date_custom` - Fecha del primer touchpoint
- `latest_attribution_date_custom` - Fecha del último touchpoint

## 🎨 Casos de Uso Soportados

### URLs de Ejemplo Soportadas

```
✅ Instagram Stories Colombia
https://www.lahaus.ai/es/vsl?utm_source=instagram&utm_medium=rrss&utm_campaign=vsl_spanish_col

✅ Instagram Stories México
https://www.lahaus.ai/es/vsl?utm_source=instagram&utm_medium=rrss&utm_campaign=vsl_spanish_mx

✅ Bio Link Instagram Colombia
https://www.lahaus.ai/es?utm_source=instagram&utm_medium=rrss&utm_campaign=landing_bio_link&utm_content=col

✅ Bio Link Instagram México
https://www.lahaus.ai/es?utm_source=instagram&utm_medium=rrss&utm_campaign=landing_bio_link&utm_content=mx

✅ LinkedIn Bio Link
https://www.lahaus.ai?utm_source=linkedin&utm_medium=rrss&utm_campaign=landing_bio_link

✅ Facebook Ads con FBCLID
https://www.lahaus.ai/es/vsl?utm_source=facebook&utm_medium=cpc&utm_campaign=Campana_VSL_B2B_col_mx&utm_content=video_ad_2_b2b&fbclid=...
```

## 🔄 Flujo de Atribución

### 1. Captura (Cliente)
```javascript
// Automático al cargar página
const attribution = useAttribution();
// → Extrae UTMs, detecta país/idioma, persiste sesión
```

### 2. Procesamiento (Servidor)
```javascript
// En /api/contact
const attributionData = processAttribution(utmParams, landingPage, referrer, isFirstTouch);
// → Mapea a HubSpot, crea drilldowns, aplica modelo
```

### 3. Envío (HubSpot)
```javascript
await sendAttributionToHubSpot(contactData, attributionData, apiKey);
// → Crea/actualiza contacto con atribución completa
```

## 📈 Ventajas del Sistema

### ✅ Ventajas Técnicas
- **Control total** sobre datos de atribución
- **Campos editables** via API
- **Compatibilidad** con reportes personalizados
- **Histórico completo** de touchpoints
- **Debugging** detallado

### ✅ Ventajas de Negocio
- **Atribución precisa** por país y idioma
- **ROI real** por campaña y contenido
- **Segmentación avanzada** en reportes
- **Optimización** basada en datos reales

## 🧪 Testing

### Ejecutar Tests de Atribución
```bash
node scripts/test-attribution.js
```

### Validar API Endpoint
```bash
# Test GET (sin crear contacto)
curl "http://localhost:3000/api/contact?utm_source=facebook&utm_campaign=test"

# Test POST (crear contacto)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstname":"Juan","utmParams":{"utm_source":"facebook","utm_medium":"cpc"}}'
```

## 📋 Checklist de Implementación

### HubSpot Setup
- [ ] API Key configurada en variables de entorno
- [ ] Script de propiedades ejecutado exitosamente
- [ ] Grupo "Custom Attribution" visible en HubSpot
- [ ] 16 propiedades custom creadas y funcionales

### Código Integration
- [ ] Hook `useAttribution` importado en formularios
- [ ] Endpoint `/api/contact` desplegado
- [ ] Variables de entorno configuradas en producción
- [ ] Tests de atribución ejecutados exitosamente

### Validación End-to-End
- [ ] UTMs capturados correctamente en cliente
- [ ] País e idioma extraídos de URLs
- [ ] Source drilldowns generados correctamente
- [ ] Contactos creados en HubSpot con atribución
- [ ] Reportes personalizados funcionando

## 🔧 Troubleshooting

### Error: "HUBSPOT_API_KEY no encontrada"
**Solución:** Configurar variable de entorno
```bash
export HUBSPOT_API_KEY="tu-api-key"
```

### Error: "Property already exists"
**Resultado:** Normal, las propiedades ya estaban creadas

### Error: "Contact already exists"
**Resultado:** Normal, el sistema actualiza contactos existentes

### UTMs no capturados
**Verificar:**
1. Hook `useAttribution` implementado correctamente
2. JavaScript habilitado en navegador
3. localStorage disponible
4. URLs con parámetros UTM válidos

## 📊 Reportes Recomendados

### 1. Reporte de Atribución por Canal
- **Campos:** `utm_source_custom`, `utm_medium_custom`, count of contacts
- **Filtros:** `utm_source_custom` no está vacío
- **Agrupación:** Por fuente y medio

### 2. Reporte de Performance por País
- **Campos:** `country_target_custom`, `utm_campaign_custom`, conversions
- **Filtros:** `country_target_custom` en ['col', 'mx']
- **Agrupación:** Por país y campaña

### 3. Reporte de Attribution Journey
- **Campos:** `first_attribution_date_custom`, `latest_attribution_date_custom`, touchpoints
- **Filtros:** Rango de fechas
- **Ordenar:** Por fecha de primera atribución

## 🎯 Próximos Pasos

1. **Validar en Producción** - Desplegar y probar con tráfico real
2. **Optimizar Reportes** - Crear dashboards personalizados en HubSpot
3. **Automatizar Alertas** - Configurar notificaciones por performance
4. **Expandir Tracking** - Agregar eventos adicionales (video views, engagement)
5. **A/B Testing** - Comparar con atribución nativa de HubSpot

---

**🎉 Sistema de Atribución Híbrida Completamente Implementado**

Este sistema proporciona control total sobre la atribución UTM mientras mantiene compatibilidad con HubSpot, superando las limitaciones de las propiedades Source Drilldown nativas.