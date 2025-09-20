#!/bin/bash

# Prueba rápida con curl (maneja redirecciones correctamente)

echo "🚀 PRUEBA RÁPIDA CON CURL"
echo "========================"

echo "📡 Probando API de atribución..."

response=$(curl -s -L -w "HTTPSTATUS:%{http_code}" \
  -X POST https://lahaus.ai/api/hubspot-attribution \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nonexistent.com","utmData":{"utm_source":"curl_test","utm_medium":"bash"}}')

# Separar el body del status code
body=$(echo "$response" | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
status=$(echo "$response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

echo "📋 Status Code: $status"
echo "📄 Response: $body"

if [ "$status" = "404" ] && [[ "$body" == *"Contact not found"* ]]; then
    echo ""
    echo "✅ ¡PERFECTO! La API funciona correctamente"
    echo "   El error 'Contact not found' es esperado"
    echo "   Esto confirma que:"
    echo "   - ✅ API está respondiendo"
    echo "   - ✅ HubSpot está conectado"
    echo "   - ✅ Autenticación funciona"
    echo "   - ✅ Solo falta el contacto (normal)"
elif [ "$status" = "200" ]; then
    echo ""
    echo "🎉 ¡ÉXITO TOTAL! Contacto encontrado y actualizado"
else
    echo ""
    echo "❌ Error inesperado - Status: $status"
    if [ "$status" = "401" ]; then
        echo "🔧 Problema: Token HubSpot incorrecto"
    elif [ "$status" = "403" ]; then
        echo "🔧 Problema: Permisos insuficientes"
    elif [ "$status" = "500" ]; then
        echo "🔧 Problema: Error del servidor"
    fi
fi

echo ""
echo "💡 Para probar con contacto real:"
echo "   1. Crea contacto en HubSpot"
echo "   2. Cambia 'test@nonexistent.com' por email real"
echo "   3. Ejecuta este script de nuevo"