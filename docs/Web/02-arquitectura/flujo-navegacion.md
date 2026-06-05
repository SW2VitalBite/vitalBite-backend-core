# Flujo de navegación

## Flujo principal

1. Usuario ingresa a `/login`.
2. La Web ejecuta `login(input)` contra el Core GraphQL.
3. El Core devuelve JWT y datos del usuario.
4. La Web guarda sesión según estrategia configurada.
5. Guards validan acceso a rutas internas.
6. Usuario accede a dashboard y módulos permitidos.

## Rutas documentadas

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/patients`
- `/patients/:id`
- `/appointments`
- `/body-measurements`
- `/nutrition-tracking`
- `/diets`
- `/nutrition-catalog`
- `/diet-templates`
- `/anthropometry`
- `/documents-reports`
- `/payments-subscriptions`
- `/settings`

## Reglas de navegación

- Usuario no autenticado accede a landing, login y registro.
- La landing publica muestra beneficios funcionales y planes mensuales disponibles.
- Usuario autenticado que entra a `/login` o `/register` se redirige a `/dashboard`.
- Administrador accede a módulos administrativos y BI.
- Nutricionista accede a operación clínica y nutricional.
- Paciente no accede a la Web.
