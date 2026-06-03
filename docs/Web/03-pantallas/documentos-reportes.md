# Pantalla de documentos y reportes

## Objetivo

Solicitar, consultar y descargar documentos del proceso nutricional.

## Funciones

- Solicitar reporte nutricional.
- Solicitar PDF de dieta.
- Consultar documentos por paciente.
- Refrescar URL prefirmada.
- Descargar archivo.

## GraphQL

- `reports(filter)`.
- `reportById(id)`.
- `documentsByPatient(patientId)`.
- `documentById(id)`.
- `requestPatientReport(input)`.
- `requestDietPdf(dietId)`.
- `refreshDocumentUrl(documentId)`.

## Reglas

- La Web no almacena archivos.
- El binario vive en S3 mediante Documental.
- La Web usa URLs prefirmadas temporales.
