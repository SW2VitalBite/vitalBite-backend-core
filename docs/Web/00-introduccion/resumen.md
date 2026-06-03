# Resumen de la aplicación Web Angular

La aplicación Web de VitalBite será un panel administrativo desarrollado en Angular para nutricionistas y administradores.

Su objetivo es centralizar la operación empresarial y nutricional desde navegador: pacientes, citas, medidas corporales, dietas, catálogo nutricional, seguimiento, documentos, pagos, dashboard BI y configuración.

La Web consume el Core NestJS mediante GraphQL como canal principal. No usa REST como comunicación principal.

## Actores

- **Administrador:** gestiona usuarios, roles, suscripciones, pagos, dashboard BI, auditoría y configuración del tenant.
- **Nutricionista:** gestiona pacientes, citas, medidas, dietas, dietocálculo, catálogo, plantillas, seguimiento, antropometría avanzada y reportes.

## Fuera de alcance

- El paciente no usa la Web; usa la app móvil React Native.
- La Web no ejecuta IA/ML directamente; consulta resultados expuestos por el Core o servicios integrados.
- La Web no almacena archivos binarios; usa metadatos y URLs prefirmadas del servicio Documental.
