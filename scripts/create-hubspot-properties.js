/**
 * Script para crear propiedades custom de atribución UTM en HubSpot
 * Basado en la estrategia híbrida para superar las limitaciones de Source Drilldown
 */

// Configuración de propiedades personalizadas para atribución UTM
const customProperties = [
  // === PROPIEDADES UTM CUSTOM ===
  {
    name: "utm_source_custom",
    label: "UTM Source (Custom)",
    description: "Parámetro utm_source capturado directamente (ej: facebook, instagram, linkedin)",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },
  {
    name: "utm_medium_custom",
    label: "UTM Medium (Custom)",
    description: "Parámetro utm_medium capturado directamente (ej: cpc, rrss, email)",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },
  {
    name: "utm_campaign_custom",
    label: "UTM Campaign (Custom)",
    description: "Parámetro utm_campaign capturado directamente (ej: vsl_spanish_col, landing_bio_link)",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },
  {
    name: "utm_content_custom",
    label: "UTM Content (Custom)",
    description: "Parámetro utm_content capturado directamente (ej: video_ad_2_b2b, col, mx)",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },
  {
    name: "utm_term_custom",
    label: "UTM Term (Custom)",
    description: "Parámetro utm_term capturado directamente para búsquedas pagadas",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },
  {
    name: "utm_id_custom",
    label: "UTM ID (Custom)",
    description: "Parámetro utm_id para identificadores únicos de campaña",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },

  // === PROPIEDADES DE ATRIBUCIÓN ADICIONALES ===
  {
    name: "fbclid_custom",
    label: "Facebook Click ID (Custom)",
    description: "Facebook Click ID capturado para tracking de conversiones de Facebook",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },
  {
    name: "landing_page_custom",
    label: "Landing Page (Custom)",
    description: "Página de aterrizaje donde se generó el contacto",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },
  {
    name: "referrer_custom",
    label: "Referrer (Custom)",
    description: "URL de referencia de donde vino el visitante",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },

  // === PROPIEDADES SOURCE DRILLDOWN CUSTOM ===
  {
    name: "source_detail_1_custom",
    label: "Source Detail 1 (Custom)",
    description: "Equivalente custom a hs_analytics_source_data_1 - Canal específico",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },
  {
    name: "source_detail_2_custom",
    label: "Source Detail 2 (Custom)",
    description: "Equivalente custom a hs_analytics_source_data_2 - Campaña específica",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true
  },
  {
    name: "attribution_model_custom",
    label: "Attribution Model (Custom)",
    description: "Modelo de atribución aplicado (first-touch, last-touch, multi-touch)",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true,
    options: [
      { label: "First Touch", value: "first_touch" },
      { label: "Last Touch", value: "last_touch" },
      { label: "Multi Touch", value: "multi_touch" }
    ]
  },

  // === PROPIEDADES DE CONTEXTO ===
  {
    name: "country_target_custom",
    label: "Country Target (Custom)",
    description: "País objetivo de la campaña basado en UTMs (col, mx, etc.)",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true,
    options: [
      { label: "Colombia", value: "col" },
      { label: "México", value: "mx" },
      { label: "General", value: "general" }
    ]
  },
  {
    name: "language_target_custom",
    label: "Language Target (Custom)",
    description: "Idioma objetivo basado en la página de aterrizaje",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: true,
    options: [
      { label: "Español", value: "es" },
      { label: "English", value: "en" }
    ]
  },

  // === PROPIEDADES DE TIMESTAMP ===
  {
    name: "first_attribution_date_custom",
    label: "First Attribution Date (Custom)",
    description: "Fecha y hora del primer touchpoint de atribución",
    type: "datetime",
    fieldType: "date",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: false
  },
  {
    name: "latest_attribution_date_custom",
    label: "Latest Attribution Date (Custom)",
    description: "Fecha y hora del último touchpoint de atribución",
    type: "datetime",
    fieldType: "date",
    groupName: "contactinformation",
    hasUniqueValue: false,
    hidden: false,
    formField: false
  }
];

/**
 * Función para crear propiedades en HubSpot via API
 */
async function createHubSpotProperties(apiKey) {
  const baseUrl = 'https://api.hubapi.com/crm/v3/properties/contacts';

  console.log(`🚀 Iniciando creación de ${customProperties.length} propiedades custom...`);

  for (const property of customProperties) {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(property)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Creada: ${property.name} - ${property.label}`);
      } else {
        const error = await response.json();
        if (error.message && error.message.includes('already exists')) {
          console.log(`⚠️  Ya existe: ${property.name}`);
        } else {
          console.error(`❌ Error creando ${property.name}:`, error.message);
        }
      }
    } catch (error) {
      console.error(`❌ Error de red creando ${property.name}:`, error.message);
    }

    // Pausa para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n🎉 Proceso de creación de propiedades completado!');
}

/**
 * Función para crear grupo de propiedades personalizado
 */
async function createCustomPropertyGroup(apiKey) {
  const groupData = {
    name: "custom_attribution",
    displayName: "Custom Attribution",
    displayOrder: 10
  };

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/properties/contacts/groups', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groupData)
    });

    if (response.ok) {
      console.log('✅ Grupo "Custom Attribution" creado exitosamente');
    } else {
      const error = await response.json();
      if (error.message && error.message.includes('already exists')) {
        console.log('⚠️  Grupo "Custom Attribution" ya existe');
      } else {
        console.error('❌ Error creando grupo:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ Error de red creando grupo:', error.message);
  }
}

// Función principal
async function main() {
  const apiKey = process.env.HUBSPOT_PRIVATE_ACCESS_TOKEN || process.env.HUBSPOT_API_KEY;

  if (!apiKey) {
    console.error('❌ Error: HUBSPOT_PRIVATE_ACCESS_TOKEN o HUBSPOT_API_KEY no encontrada en variables de entorno');
    console.log('💡 Agrega tu API key: export HUBSPOT_PRIVATE_ACCESS_TOKEN="tu-token" o export HUBSPOT_API_KEY="tu-api-key"');
    process.exit(1);
  }

  console.log('🔧 Creando sistema de atribución UTM personalizada en HubSpot...\n');

  // Crear grupo personalizado primero
  await createCustomPropertyGroup(apiKey);

  // Crear todas las propiedades
  await createHubSpotProperties(apiKey);

  console.log('\n📋 Resumen de propiedades creadas:');
  console.log('• UTM Parameters: 6 propiedades (source, medium, campaign, content, term, id)');
  console.log('• Attribution Data: 3 propiedades (fbclid, landing_page, referrer)');
  console.log('• Source Drilldown: 3 propiedades (detail_1, detail_2, attribution_model)');
  console.log('• Context Data: 2 propiedades (country_target, language_target)');
  console.log('• Timestamps: 2 propiedades (first_date, latest_date)');
  console.log('\n🎯 Sistema listo para atribución híbrida!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  customProperties,
  createHubSpotProperties,
  createCustomPropertyGroup
};