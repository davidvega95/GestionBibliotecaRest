/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */
// variables para el jslint

/**
* Creamos el objeto alumno y todos sus métodos.
*/
//libro.js

$.libro2={};
// Configuración del HOST y URL del servicio
$.libro2.HOST = 'http://localhost:8080';
// $.alumno.URL = '/GA-JPA/webresources/com.iesvdc.acceso.entidades.alumno';
$.libro2.URL = '/GB-JPA/webresources/com.iesvdc.acceso.entidades.libro2';

$.libro2.LibroReadREST = function() {
    // con esta función jQuery hacemos la petición GET que hace el findAll()
    $.ajax({
        url: $.libro2.HOST+$.libro2.URL,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            $('#r_libro').empty();
            $('#r_libro').append('<h3>Listado de Libros</h3>');
            var table = $('<table />').addClass('table table-stripped');

            table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>autor</th>', '<th>titulo</th>','<th>editorial</th>')));
            var tbody = $('<tbody />');
            for (var clave in json) {
                tbody.append($('<tr />').append('<td>' + json[clave].id + '</td>',
                            '<td>' + json[clave].autor + '</td>', '<td>' + json[clave].titulo + '</td>','<td>' + json[clave].editorial + '</td>'));
            }
            table.append(tbody);

            $('#r_libro').append( $('<div />').append(table) );
            $('tr:odd').css('background','#CCCCCC');
        },
        error: function (xhr, status) {
             $.libro2.error('Imposible leer usuario','Compruebe su conexión e inténtelo de nuevo más tarde');
        }
    });
};



$.libro2.LibroCreateREST = function(){
    // Leemos los datos del formulario pidiendo a jQuery que nos de el valor de cada input.
    var datos = {
        'autor' : $("#c_li_autor").val(),
        'titulo': $("#c_li_titulo").val(),
		'editorial' : $("#c_li_editorial").val()
      
        
    };
    
    // comprobamos que en el formulario haya datos...
    if ( datos.autor.length>2 && datos.editorial.length>2 && datos.titulo.length>2) {
         $.ajax({
            url: $.libro2.HOST+$.libro2.URL,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
				
                $.libro2.LibroReadREST();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro2.error('Error: LIbro Create','No ha sido posible crear el alumno. Compruebe su conexión.');
            }
        });
        
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_alumno.
        $.afui.loadContent("#r_libro",false,false,"up");
    }
    
};

$.libro2.LibroDeleteREST = function(id){
    // si pasamos el ID directamente llamamos al servicio DELETE
    // si no, pintamos el formulario de selección para borrar.
    if ( id !== undefined ) {
		
        id = $('#d_li_sel').val();
        $.ajax({
            url: $.libro2.HOST+$.libro2.URL+'/'+id,
            type: 'DELETE',
            dataType: 'json',
            contentType: "application/json",
            // data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.libro2.LibroReadREST();
                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_alumno.
                $.afui.loadContent("#r_libro",false,false,"up");
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro2.error('Error: Alumno Delete','No ha sido posible borrar el alumno. Compruebe su conexión.');
            }
        });    
    } else{
		
        $.ajax({
            url: $.libro2.HOST+$.libro2.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#d_libro').empty();
                var formulario = $('<div />');
                formulario.addClass('container');
                var div_select = $('<div />');
                div_select.addClass('form-group');
                var select = $('<select id="d_li_sel" />');
                select.addClass('form-group');
                for (var clave in json){
                    select.append('<option value="'+json[clave].id+'">'+json[clave].autor+' ' + json[clave].titulo+'</option>');
                }
                formulario.append(select);
                formulario.append('<div class="form-group"></div>').append('<div class="btn btn-danger" onclick="$.libro2.LibroDeleteREST(1)"> eliminar! </div>');
                $('#d_libro').append(formulario);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro2.error('Error: Alumno Delete','No ha sido posible conectar al servidor. Compruebe su conexión.');
            }
        });
    }
    
};

$.libro2.LibroUpdateREST = function(id, envio){
    if ( id === undefined ) {
      
        $.ajax({
             url: $.libro2.HOST+$.libro2.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#u_libro').empty();
                $('#u_libro').append('<h3>Pulse sobre un usuario</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>autor</th>', '<th>titulo</th>','<th>editorial</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    // le damos a cada fila un ID para luego poder recuperar los datos para el formulario en el siguiente paso
                    tbody.append($('<tr id="fila_'+json[clave].id+'" onclick="$.libro2.LibroUpdateREST('+json[clave].id+')"/>').append('<td>' + json[clave].id + '</td>',
                    '<td>' + json[clave].autor + '</td>', '<td>' + json[clave].titulo + '</td>', '<td>' + json[clave].editorial + '</td>'));
                }
                table.append(tbody);

                $('#u_libro').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $.libro2.error('Error: Alumno Update','Ha sido imposible conectar al servidor.');
            }
        });
    } else if (envio === undefined ){
        
        
        var seleccion = "#fila_"+id+" td";
        var li_id = ($(seleccion))[0];
        var li_autor = ($(seleccion))[1];
        var li_titulo = ($(seleccion))[2];
		 var li_editorial = ($(seleccion))[2];
        console.log(li_id);
        
        $("#u_li_id").val(li_id.childNodes[0].data);
        $("#u_li_autor").val(li_autor.childNodes[0].data);
        $("#u_li_titulo").val(li_titulo.childNodes[0].data);
		$("#u_li_editorial").val(li_editorial.childNodes[0].data);
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_alumno.
        $.afui.loadContent("#uf_libro",false,false,"up");
    } else {
        //HACEMOS LA LLAMADA REST
            var datos = {
                'id' : $("#u_li_id").val(),
                'autor' : $("#u_li_autor").val(),
                'titulo': $("#u_li_titulo").val(),
				'editorial': $("#u_li_editorial").val(),
            };

            // comprobamos que en el formulario haya datos...
            if ( datos.autor.length>2 && datos.titulo.length>2 && datos.editorial.length>2) {
                $.ajax({
                    url: $.libro2.HOST+$.libro2.URL+'/'+$("#u_li_id").val(),
                    type: 'PUT',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function(result,status,jqXHR ) {
                       // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                        $.libro2.LibroReadREST();
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        $.libro2.error('Error: Alumno Create','No ha sido posible crear el alumno. Compruebe su conexión.');
                    }
                });

                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_alumno.
                $.afui.loadContent("#r_libro",false,false,"up");
            }
    }
};





