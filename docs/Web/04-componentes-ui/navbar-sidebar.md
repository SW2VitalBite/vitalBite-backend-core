# Navbar y sidebar

## Sidebar

Debe mostrar accesos segun rol y permisos:

- Dashboard.
- Pacientes.
- Citas.
- Seguimiento nutricional.
- Catalogo nutricional.
- Plantillas de dietas.
- Antropometria.
- Documentos y reportes.
- Pagos y suscripciones.
- Configuracion.

Dietas y Medidas no aparecen como opciones globales del sidebar. Ambos modulos se abren desde Pacientes y desde las tabs del expediente.

## Topbar

Debe mostrar:

- Nombre del usuario.
- Rol.
- Tenant actual.
- Accion de cierre de sesion.

## Reglas

- Ocultar opciones sin permiso.
- Mantener navegacion estable.
- Mostrar Dietas y Medidas solo dentro del expediente del paciente.
- No mostrar modulos de paciente Web porque el paciente usa React Native.
