# Pruebas de integración

Las pruebas de integración validan módulos conectados con base de datos o servicios simulados.

## Objetivo

- Validar flujo resolver → service → base de datos.
- Validar autenticación y autorización.
- Validar separación por tenant.
- Validar integraciones mockeadas con .NET, Spring Boot y FastAPI.

## Casos sugeridos

- Usuario autenticado consulta pacientes de su tenant.
- Usuario no accede a datos de otro tenant.
- Core consulta .NET para validar suscripción.
- Core solicita PDF al servicio Documental.
- Core consulta resultado de riesgo nutricional.
- Nutricionista crea alimento del catálogo y lo usa en una receta.
- Nutricionista crea plantilla de dieta y genera dieta para un paciente.
- Dieta generada conserva snapshot nutricional aunque cambie el catálogo.
- Core calcula nutrientes de una dieta y guarda el resultado.
- Core rechaza guardar cálculo nutricional sin dieta asociada.
- Paciente registra seguimiento diario desde React Native.
- Paciente solicita URL prefirmada, sube foto a S3 y vincula referencia documental.
- Paciente crea meta y la marca como completada.
- Nutricionista consulta seguimiento diario del paciente asignado.
- Nutricionista registra antropometría avanzada y consulta somatotipo.
- Core rechaza cálculo de somatotipo cuando faltan datos mínimos.
- Dashboard consume adherencia, dietocálculo y evolución antropométrica.
