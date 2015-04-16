# vaportemas
Para que se puedan administrar trabajos en grupo. Se generan los apéndices adscritos a cada familia de trabajos, y después, los usuarios pueden ir seleccionando qué trabajos están dispuestos a realizar.

#Como usarlo
Es una aplicación en node. Se descarga vía tradicional de github, y seguramente habrá que eliminar el contenido de la carpeta node_modules y volver a realizar el "npm install". Esto se debe a un fallo mío que no quería subir estas carpetas pero lo hice sin querer y ahora hay se quedó.<br>
Por otra parte, el combo de asignaturas (o de familias de tareas) es estático, está en make_appendix.jade y se puede cambiar al gusto.<br>
La aplicación tiene, al menos, un fallo conocido:     

Si pones en la asignatura de ética los épigrafes (por ejemplo):   
<ul>
  <li>Contrato</li>
  <li>Internet</li>
</ul>
Y alquien X elige Internet, pero mañana quieres ampliar la lista de epígrafes y añades   
<ul>
  <li>LOPD</li>
  <li>Sociedad información</li>
</ul>
Los cuatro apéndices permanecerían, PERO la persona X ya no tendrá asignada ningún epígrafe. Este problema sólo sucede en cambios intra-asignaturales (por decirlo de alguna forma).<br>
Por ejemplo, si alguien crea un listado de epígrafes de la asignatura de matemáticas, no interfiere en los epígrafes ya asignados de otras asignaturas... sólo interferiría, como digo, si ya existieran epígrafes adjudicados en la propia asignatura de matemáticas, que eliminaría estas adjudicaciones.
