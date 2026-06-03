# Pantalla de login

## Objetivo

Permitir que administradores y nutricionistas ingresen a la Web Angular.

## Elementos principales

- Formulario de email y contraseña.
- Botón de inicio de sesión.
- Mensajes de error controlados.
- Estado de carga.

## GraphQL

- Mutation principal: `login(input)`.

## Reglas

- Si el login es correcto, guardar JWT y usuario autenticado.
- Redirigir a `/dashboard`.
- Si el rol es paciente, no permitir acceso Web.
- No mostrar información sensible en errores.
