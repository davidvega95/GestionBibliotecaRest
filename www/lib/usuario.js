/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */
// variables para el jslint

/**
* Creamos el objeto alumno y todos sus métodos.
*/
$.usuario={};
// Configuración del HOST y URL del servicio
$.usuario.HOST = 'http://localhost:8080';
// $.alumno.URL = '/GA-JPA/webresources/com.iesvdc.acceso.entidades.alumno';
$.usuario.URL = '/GB-JPA/webresources/com.iesvdc.acceso.entidades.usuario';


/**
    Esta función hace la llamada REST al servidor y crea la tabla con todos los alumnos.
*/
$.usuario.UsuarioReadREST = function() {
    // con esta función jQuery hacemos la petición GET que hace el findAll()
    $.ajax({
        url: this.HOST+this.URL,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            $('#r_usuario').empty();
            $('#r_usuario').append('<h3>Listado de Usuarios</h3>');
            var table = $('<table />').addClass('table table-stripped');

            table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>nombre</th>', '<th>apellidos</th>')));
            var tbody = $('<tbody />');
            for (var clave in json) {
                tbody.append($('<tr />').append('<td>' + json[clave].id + '</td>',
                            '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].apellido + '</td>'));
            }
            table.append(tbody);

            $('#r_usuario').append( $('<div />').append(table) );
            $('tr:odd').css('background','#CCCCCC');
        },
        error: function (xhr, status) {
             $.usuario.error('Imposible leer usuario','Compruebe su conexión e inténtelo de nuevo más tarde');
        }
    });
};

/**
    Esta función carga los datos del formulario y los envía vía POST al servicio REST
*/


$.usuario.UsuarioCreateREST = function(){
    // Leemos los datos del formulario pidiendo a jQuery que nos de el valor de cada input.
    var datos = {
        'nombre' : $("#c_al_nombre").val(),
        'apellido': $("#c_al_apellidos").val()
    };
    
    // comprobamos que en el formulario haya datos...
    if ( datos.nombre.length>2 && datos.apellido.length>2 ) {
        $.ajax({
            url: $.usuario.HOST+$.usuario.URL,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.usuario.UsuarioReadREST();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.usuario.error('Error: Alumno Create','No ha sido posible crear el alumno. Compruebe su conexión.');
            }
        });
        
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_alumno.
        $.afui.loadContent("#r_usuario",false,false,"up");
    }
    
};

$.usuario.UsuarioDeleteREST = function(id){
    // si pasamos el ID directamente llamamos al servicio DELETE
    // si no, pintamos el formulario de selección para borrar.
    if ( id !== undefined ) {
        id = $('#d_us_sel').val();
        $.ajax({
            url: $.usuario.HOST+$.usuario.URL+'/'+id,
            type: 'DELETE',
            dataType: 'json',
            contentType: "application/json",
            // data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.usuario.UsuarioReadREST();
                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_alumno.
                $.afui.loadContent("#r_usuario",false,false,"up");
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.usuario.error('Error: Alumno Delete','No ha sido posible borrar el alumno. Compruebe su conexión.');
            }
        });    
    } else{
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#d_usuario').empty();
                var formulario = $('<div />');
                formulario.addClass('container');
                var div_select = $('<div />');
                div_select.addClass('form-group');
                var select = $('<select id="d_us_sel" />');
                select.addClass('form-group');
                for (var clave in json){
                    select.append('<option value="'+json[clave].id+'">'+json[clave].nombre+' ' + json[clave].apellido+'</option>');
                }
                formulario.append(select);
                formulario.append('<div class="form-group"></div>').append('<div class="btn btn-danger" onclick="$.usuario.UsuarioDeleteREST(1)"> eliminar! </div>');
                $('#d_usuario').append(formulario);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.usuario.error('Error: Alumno Delete','No ha sido posible conectar al servidor. Compruebe su conexión.');
            }
        });
    }
    
};





$.usuario.UsuarioUpdateREST = function(id, envio){
    if ( id === undefined ) {
      
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#u_usuario').empty();
                $('#u_usuario').append('<h3>Pulse sobre un usuario</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>nombre</th>', '<th>apellidos</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    // le damos a cada fila un ID para luego poder recuperar los datos para el formulario en el siguiente paso
                    tbody.append($('<tr id="fila_'+json[clave].id+'" onclick="$.usuario.UsuarioUpdateREST('+json[clave].id+')"/>').append('<td>' + json[clave].id + '</td>',
                    '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].apellido + '</td>'));
                }
                table.append(tbody);

                $('#u_usuario').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $.usuario.error('Error: Alumno Update','Ha sido imposible conectar al servidor.');
            }
        });
    } else if (envio === undefined ){
        
        
        var seleccion = "#fila_"+id+" td";
        var al_id = ($(seleccion))[0];
        var al_nombre = ($(seleccion))[1];
        var al_apellidos = ($(seleccion))[2];
        console.log(al_id);
        
        $("#u_us_id").val(al_id.childNodes[0].data);
        $("#u_us_nombre").val(al_nombre.childNodes[0].data);
        $("#u_us_apellido").val(al_apellidos.childNodes[0].data);
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_alumno.
        $.afui.loadContent("#uf_usuario",false,false,"up");
    } else {
        //HACEMOS LA LLAMADA REST
            var datos = {
                'id' : $("#u_us_id").val(),
                'nombre' : $("#u_us_nombre").val(),
                'apellido': $("#u_us_apellido").val()
            };

            // comprobamos que en el formulario haya datos...
            if ( datos.nombre.length>2 && datos.apellido.length>2 ) {
                $.ajax({
                    url: $.usuario.HOST+$.usuario.URL+'/'+$("#u_us_id").val(),
                    type: 'PUT',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function(result,status,jqXHR ) {
                       // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                        $.usuario.UsuarioReadREST();
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        $.usuario.error('Error: Alumno Create','No ha sido posible crear el alumno. Compruebe su conexión.');
                    }
                });

                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_alumno.
                $.afui.loadContent("#r_usuario",false,false,"up");
            }
    }
};








