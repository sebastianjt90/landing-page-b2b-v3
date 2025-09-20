# ARREGLAR PERMISOS HUBSPOT - ACCIÓN REQUERIDA

## 🚨 **PROBLEMA IDENTIFICADO**

El contacto `sebastian.jimeneztr@gmail.com` **SÍ EXISTE** en HubSpot, pero la API está fallando porque necesitamos **más permisos** en el Private App.

## 🔧 **SOLUCIÓN: Agregar Scopes Adicionales**

### **Paso 1: Ve a HubSpot Private App**
1. Ve a: https://app.hubspot.com/settings/21568098/integrations/private-apps
2. Encuentra la app "LaHaus AI UTM Attribution"
3. Haz clic en **"Edit app"**

### **Paso 2: Agregar Scopes Necesarios**
En la pestaña **"Scopes"**, asegúrate de tener **TODOS** estos permisos:

#### ✅ **Scopes Básicos (ya los tienes):**
- `crm.objects.contacts.read`
- `crm.objects.contacts.write`

#### 🆕 **Scopes Adicionales REQUERIDOS:**
- `crm.objects.contacts.sensitive.write.v2`
- `crm.objects.contacts.highly_sensitive.write.v2`
- `crm.schemas.contacts.write`

### **Paso 3: Reinstalar la App**
1. Después de agregar los scopes, haz clic en **"Update app"**
2. Ve a la pestaña **"Install app"**
3. Haz clic en **"Install app"** de nuevo
4. Confirma la instalación con los nuevos permisos

### **Paso 4: Verificar que Funciona**
```bash
# Ejecutar la prueba de nuevo
node scripts/test-real-user.js
```

## 📋 **Error Específico Recibido:**
```
"This app hasn't been granted all required scopes to make this call"
Required scopes: crm.objects.contacts.sensitive.write.v2, crm.objects.contacts.highly_sensitive.write.v2
```

## 💡 **Por Qué Necesitamos Estos Scopes:**

- **`sensitive.write.v2`**: Para actualizar campos de marketing/atribución
- **`highly_sensitive.write.v2`**: Para campos críticos de negocio
- **`schemas.contacts.write`**: Para trabajar con propiedades personalizadas

Estos permisos son necesarios porque **los campos de atribución de HubSpot se consideran sensibles** ya que afectan reportes de ROI y análisis de marketing.

## 🎯 **Una Vez Arreglado, Deberías Ver:**

```
🎉 ¡ÉXITO TOTAL! Atribución actualizada correctamente
📊 Propiedades actualizadas: 15+
🏷️ Original Traffic Source: api_test_real
```

Y en HubSpot, el contacto mostrará **la fuente real** en lugar de "Tráfico directo".