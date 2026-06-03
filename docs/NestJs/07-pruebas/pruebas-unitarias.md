# Pruebas unitarias

Las pruebas unitarias validan servicios y reglas de negocio aisladas.

## Objetivo

- Probar services.
- Probar validaciones.
- Probar reglas de negocio.
- Probar manejo de errores.

## Casos sugeridos

- Crear paciente válido.
- Rechazar paciente sin tenant.
- Crear cita con fecha válida.
- Rechazar cita cancelada para confirmación.
- Calcular IMC desde medidas corporales.
- Validar permiso requerido para crear dieta.
- Calcular calorías y macronutrientes de una dieta.
- Consolidar micronutrientes desde alimentos o recetas.
- Validar fuente única en `DietItem` y `DietTemplateItem`.
- Generar snapshot nutricional al crear dieta.
- Confirmar que cambios en catálogo no alteran dietas históricas.
- Rechazar `saveNutritionCalculation` sin `dietId`.
- Rechazar receta con alimentos de otro tenant.
- Crear dieta desde plantilla reutilizable.
- Validar que el paciente solo registre seguimiento diario propio.
- Validar creación y cambio de estado de metas del paciente.
- Validar flujo documental de foto diaria con `documentMetadataId`.
- Calcular o registrar somatotipo desde antropometría avanzada.
- Rechazar somatotipo sin campos mínimos Heath-Carter.
- Rechazar antropometría asociada a paciente de otro tenant.
- Validar permisos para catálogo, plantillas y dietocálculo.

## Herramienta sugerida

- Jest.
