# Módulo de dietas

## Objetivo

Crear y asignar planes alimenticios personalizados.

## Actor principal

- Nutricionista.

## Responsabilidades

- Crear dietas.
- Definir comidas por día.
- Asignar alimentos, porciones y restricciones.
- Asociar dieta a un paciente.
- Actualizar dieta según progreso.
- Solicitar generación de PDF al servicio Documental.

## Datos principales

- Dieta.
- Comida.
- Alimento.
- Porción.
- Restricción.
- Objetivo.
- Vigencia.

## Operaciones GraphQL esperadas

- `diets`
- `dietById`
- `dietsByPatient`
- `createDiet`
- `updateDiet`
- `assignDietToPatient`
- `requestDietPdf`
