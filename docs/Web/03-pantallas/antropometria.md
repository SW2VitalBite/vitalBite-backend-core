# Pantalla de antropometria

## Ruta

- `/patients/:id?tab=Antropometria`

## Actor principal

- Nutricionista.

## Objetivo

Registrar y consultar perimetros corporales del paciente mediante un mapa corporal interactivo dentro del expediente.

## Layout implementado

- Tab `Antropometria` dentro del detalle del paciente.
- Mapa corporal frontal con figura humana clinica.
- Cuello, pecho/torax, cintura, abdomen, muslos, pantorrillas, brazos superiores y antebrazos representados con contornos anatomicos finales, integrados a la figura con sombreado suave.
- Zonas seleccionables: cuello, pecho/torax, brazos, antebrazos, cintura, abdomen, cadera, muslos y pantorrillas.
- Mapa corporal limpio sin etiquetas laterales ni puntos visibles.
- Las zonas corporales se resaltan al pasar el mouse y muestran un tooltip con la ultima medicion registrada.
- El tooltip permite registrar una nueva medida rapida de la zona seleccionada mediante un input en centimetros.
- La seleccion persistente de zonas tambien se puede realizar desde el panel de perimetros corporales.
- Panel lateral con informacion del paciente, resumen de medidas y lista de perimetros del registro seleccionado.
- Historial de mediciones antropometricas agrupado por sesiones de registro cercanas.
- Modal para crear o editar perimetros corporales.

## Acciones principales

- Registrar nueva medicion.
- Registrar una medida rapida desde el tooltip de una zona corporal.
- Editar medicion seleccionada.
- Eliminar medicion seleccionada.
- Seleccionar region corporal en el mapa.
- Seleccionar medicion historica para revisar sus perimetros corporales.

## GraphQL usado

- `anthropometryByPatient(patientId)`.
- `anthropometryMeasurementById(id)`.
- `createAnthropometryMeasurement(input)`.
- `updateAnthropometryMeasurement(id, input)`.
- `deleteAnthropometryMeasurement(id)`.

## Alcance actual

- El ajuste visual prioriza una figura humana frontal mas anatomica y clara.
- Se mantiene la identidad VitalBite verde.
- No se implementan pliegues, diametros oseos, somatotipo Heath-Carter ni somatocarta en esta fase.
- Los controles de vista y zoom son accesos visuales preparados, sin interaccion real todavia.

## Estados UI

- Cargando antropometria.
- Sin registros antropometricos.
- Medicion registrada o actualizada.
- Error por falta de perimetros.
- Error por medida rapida vacia o invalida.
- Sin permisos para registrar.

## Criterio de historial

- La accion `Actualizar medida` del tooltip crea una nueva medicion fechada al dia actual.
- No sobrescribe la ultima medicion registrada; el historial se conserva para comparar avances por zona corporal.
- La seccion `Perimetros corporales` muestra solo las zonas registradas en la medicion seleccionada desde el historial.
- Las zonas sin dato en esa medicion se ocultan para evitar mezclar fechas distintas.
- Las mediciones registradas dentro de una ventana de una hora se agrupan como una misma sesion para revisar el conjunto de perimetros tomado en ese momento.
