/* global ready */
$(function () {
    //Agrego funcion al presionar el boton de exportar a Excel
    $('#btnExcel').click(function () {
        $('#icon-excel').css("display", "none");
        $('#status-green-sm').css("display", "block");
        setTimeout(function () {
            $('#status-green-sm').css("display", "none");
            $('#icon-excel').css("display", "block");
            $('#icon-excel').css("padding-top", "2.5px");
        }, 1000);
    });
});

/**
 * Metodo especial para obtener el valor del token actual.
 */
function getToken() {
    return $('#globalCsrfToken').val();
}
/**
 * Metodo especial para verificar si la sesion sigue activa o si los token de seguridad corresponden. 
 */
function validarSession() {
    $.ajax({
        url: 'UserManage?action=VALIDATESTATESESION',
        method: 'post',
        dataType: 'json',
        data: {csrfToken: getToken()},
        success: function (r) {
            console.log(r);
            if (!r.sessionState) {
                location.href = 'login';
            } else {
                if (!r.tokenState) {
                    $('#globalCsrfToken').val(r.globalCsrfToken);
                    $('#csrfToken').val(r.globalCsrfToken);
                    console.log('Se actualiza el token.');
                }
            }
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

/**
 * Metodo para cargar las vistas dentro de los tabs principales, para evitar abrir pestañas del navegador y mejorar
 * la fluidez del trabajo del usuario final
 * rtamnx recibe la ruta de la vista
 * nromnx recibe el identificador unico de la vista
 * nommnx recibe el nombre de la pestaña
 * reloadView valor booleano que indica si la vista se debe recargar o permanece con el contenido previamente cargado cuando la pestaña ya existe en el panel de pestañas
 */
function viewOnTab(rtamnx, nromnx, nommnx, reloadView) {

    if (!reloadView) {
        $("#wrapper").toggleClass("toggled");
    }

    onKeyUpWithTimeout(validarSession, 800);

    if (!$('#tab-' + nromnx).length) {

        //SE QUITA LA CLASE ACTIVE DE LA PESTAÑA PREVIAMENTE SELECCIONADA
        $('#tabs').find(".principal-tab").removeClass("active"); //EN EL DIV TABS
        $('#content-tab').find(".principal-content").removeClass("active"); //EN EL DIV CONTENT-TAB                        

        //SE CREA EL TAB
        tab = '<li class="nav-item">';
        tab += '<a class="nav-link active principal-tab" id="tab-' + nromnx + '" data-toggle="tab" href="#content-tab-' + nromnx + '">';

        tab += '<table>';
        tab += '<tr>';
        tab += '<td>';
        //Nombre de la pestaña
        tab += '<span class="fs-estandar" id="nomtab_' + nromnx + '">' + nommnx + '</span>';
        tab += '</td>';
        tab += '<td>';
        //Boton para refrescar la pestaña (Se puede comentar en caso de querer quitarla).
        tab += '<button class="btn btn-sm btn-light btn-refresh-eyelash" data-toggle="tooltip" data-placement="bottom" title="Actualizar" onclick="viewSubPage(\'' + rtamnx + '\', \'content-tab-' + nromnx + '\')"><i class="fas fa-sync-alt color-black"></i></button>';
        tab += '</td>';
        tab += '<td>';
        //Boton para cerrar la pestaña (Se puede comentar en caso de querer quitarla).
        tab += '<button  data-toggle="tooltip" data-placement="bottom" title="Cerrar" id="button-tab-' + nromnx + '" class="btn btn-sm btn-light btn-close-eyelash" onclick="deleteTabs(\'' + nromnx + '\')"><i class="fas fa-times-circle color-red"></i></button>';
        tab += '</td>';
        tab += '</tr>';
        tab += '</table>';

        //------------------------------------------------------------------------


        tab += '</a>';
        tab += '</li>';

        //SE CREA EL CONTENT - TAB
        content_tab = '<div id="content-tab-' + nromnx + '" class="tab-pane active principal-content  p-3">';
        content_tab += '</div>';

        //SE AGREGA EL TAB Y EL CONTENT TAB AL PANEL DE TABS
        $('#tabs').append(tab);
        $('#content-tab').append(content_tab);

        //SE ABRE LA VISTA EN EL TAB INDICADO       
        loader = '';
        loader += '<div class="row mt-2">';
        loader += '<div class="col-sm-12 pl-0 ml-0">';
        loader += '<div class="pnl pnl-loading d-flex flex-column justify-content-center align-items-center">';
        loader += '<span id="spinner-preview">';
        loader += '<span class="spinner-border spinner-border-sm color-black" role="status" aria-hidden="true"></span>';
        loader += '<span class="sr-only">Loading...</span>';
        loader += '</span>';
        loader += '<p class=" mt-2 font-12px">Cargando, por favor espere...</p>';
        loader += '</div>';
        loader += '<div class="w-100 text-center" style="margin-top: -35px">';
        loader += '<img src="' + $('#resourceRoute').val() + '/img/logotipo-softmedic-blue.png" alt="" width="50" class="mx-auto animated fadeIn">';
        loader += '</div>';
        loader += '</div>';
        loader += '</div>';
        $('#content-tab-' + nromnx).html(loader);


        $('#content-tab-' + nromnx).load(rtamnx);
        $('#content-tab-' + nromnx).focus();


        //SI EL TAB EXISTE, SE ABRE
    } else {
        //SE QUITA LA CLASE ACTIVE DE LA PESTAÑA PREVIAMENTE SELECCIONADA
        $('#tabs').find(".principal-tab").removeClass("active"); //EN EL DIV TABS
        $('#content-tab').find(".principal-content").removeClass("active"); //EN EL DIV CONTENT-TAB    

        //SE AGREGA EL ACTIVE A LA PAGINA SELECCIONADA YA EXISTENTE
        $('#tab-' + nromnx).addClass('active');
        $('#content-tab-' + nromnx).addClass('active');
        $('#content-tab-' + nromnx).focus();
        $('#nomtab_' + nromnx).html(nommnx);

        //SE CIERRA LA BARRA LATERAL
        //SI RELOADVIEW ES TRUE, QUIERE DECIR QUE NO ES UNA VISTA PRINCIPAL
        //Y SE REQUIERE QUE EL TAB SEA RECARGADO, DE LO CONTRARIO ES UNA VISTA PRINCIPAL
        //Y NO SE REQUIERE LA RECARGA DEL TAB
        if (reloadView) {
            //CARGO LA VISTA CON LA NUEVA RUTA
            $('#content-tab-' + nromnx).load(rtamnx);
            //ACTUALIZO EL NOMBRE DEL TAB Y AGREGO EL NUEVO BOTON CON SUS RESPECTIVOS ID
            //Boton para refrescar la pagina (Se puede comentar en caso de querer quitarla).
            tab += '<button class="btn btn-sm btn-light btn-refresh-eyelash" onclick="viewSubPage(\'' + rtamnx + '\', \'content-tab-' + nromnx + '\')" title="Cargar pestaña de nuevo"><i class="fa fa-refresh"></i></button>';
            //------------------------------------------------------------------------

            tab += '<button id="button-tab-' + nromnx + '" class="btn btn-sm btn-light btn-close-eyelash" onclick="deleteTabs(\'' + nromnx + '\')" title="Cerrar pestaña"><i class="fa fa-times-circle"></i></button>';
        }
    }
}

/**
 * Metodo para cargar las vistas dentro del div de contenido con un loader mas pequeño que el original
 * y sin cerrar el panel lateral de opciones.
 * url recibe la url de la vista a abrir
 * id recibe el id del div en donde se va a abrir la vista requerida
 */
function viewSubPage(url, id) {

    html = '';
    html += '<div class="row mt-2">';
    html += '<div class="col-sm-12 pl-0 ml-0">';
    html += '<div class="pnl pnl-loading-sm d-flex flex-column justify-content-center align-items-center" style="box-shadow: none !important">';
    html += '<span id="spinner-preview">';
    html += '<span class="spinner-border spinner-border-sm color-black" role="status" aria-hidden="true"></span>';
    html += '<span class="sr-only">Loading...</span>';
    html += '</span>';
    html += '<p class=" mt-2 font-12px">Cargando, por favor espere...</p>';
    html += '</div>';
    html += '<div class="w-100 text-center" style="margin-top: -35px">';
    html += '<img src="' + $('#resourceRoute').val() + '/img/logotipo-softmedic-blue.png" alt="" width="50" class="mx-auto animated fadeIn">';
    html += '</div>';
    html += '</div>';
    $('#' + id).html(html);

    onKeyUpWithTimeout(validarSession, 800);

    $('#' + id).load(url);
}

function viewCta() {
    onKeyUpWithTimeout(validarSession, 800);
    window.open('views/pnt/gestionCitas.jsp', '_blank', 'height:800,width:800');
}


function showDinamicModal(url) {
    onKeyUpWithTimeout(validarSession, 800);
    $('#show-dinamic-modal').load(url);
}

function openShowDinamicModal(url) {
    $("#wrapper").toggleClass("toggled");
    onKeyUpWithTimeout(validarSession, 800);
    $('#show-dinamic-modal').load(url);
}

/* TOAST BOOTSTRAP 4.3.0
 * titleMsg: titulo del mensaje.
 * bodyMsg: cuerpo del mensaje.
 * tpoMsg: tipo de mensaje.
 */
function showToast(titleMsg, bodyMsg, tpoMsg) {

    html = '';
    html += '<div id="toast" class="toast toast-bottom-right-position rounded-lg animated fadeIn" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="true">';

    if (tpoMsg === 'success') {
        html += '<div class="toast-header-success">';
        html += '<i id="icoMsg" class="fas fa-check-circle color-white font-18px mr-2"></i>';
    }

    if (tpoMsg === 'error') {
        html += '<div class="toast-header-error">';
        html += '<i id="icoMsg" class="fas fa-times-circle color-white font-18px mr-2"></i>';
    }

    if (tpoMsg === 'info') {
        html += '<div class="toast-header-info">';
        html += '<i id="icoMsg" class="fas fa-info-circle color-white font-18px mr-2"></i>';
    }

    if (tpoMsg === 'warning') {
        html += '<div class="toast-header-warning">';
        html += '<i id="icoMsg" class="fas fa-exclamation-circle color-white font-18px mr-2"></i>';
    }

    if (tpoMsg === 'progress') {
        html += '<div class="toast-header-progress">';
        html += '<i id="icoMsg" class="fas fa-clock color-white font-18px mr-2"></i>';
    }

    html += '<p id="titleMsg" class="mr-auto mb-0 font-12px text-white f-bold">' + titleMsg + '</p>';
    html += '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    html += '</div>';
    html += '<div class="toast-body font-12px bg-color-white">';
    html += '<p id="bodyMsg" class="mb-0">' + bodyMsg + '</p>';
    html += '</div>';

    //Toast option
    var toastOption = {
        delay: 7000
    };
    if (tpoMsg === 'progress') {        
        toastOption = {
            delay: 10000000000
        };
    }

    $('#toastContent').html(html);
    $('.toast').toast(toastOption);
    $('#toast').toast('show');
}

function showTransactionMessage(message) {
    showToast('Transacción en curso.', message, 'progress');
}

function showErrorConnectionMessage() {
    showToast('Error interno', 'Tenemos problemas al intentar comunicarnos con el servidor. Intente mas tarde.', 'error');
}

function setValueSelect(SelectId, Value) {
    var index = 0;
    var SelectObject = document.getElementById(SelectId);
    for (index = 0; index < SelectObject.length; index++) {
        if (SelectObject[index].value === Value)
            SelectObject.selectedIndex = index;
    }
}

/**
 * Metodo que valida si la tecla presionada es el enter para proceder a ejecutar
 * un metodo.
 * @param {type} e recibe el evento a validar. 
 */
function validarEnter(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
    return (tecla === 13);
}

/**
 * Metodo que valida si en un select se ha escogido una opcion o si se dejó la
 * opcion por defecto para proceder a ejecutar un evento dependiendo de la condicion. 
 * @param {type} obj recibe el id del select a validar 
 */
function validarSelect(obj) {
    return (obj.options[obj.selectedIndex].value === '');
}

/**
 * Metodo que limpia todos los checkboxes de un formulario.
 */
function clearCheckBox() {
    $('input[type=checkbox]').each(function ()
    {
        this.checked = false;
    });
}

/**
 * Metodo que limpia todos los elementos de un select.
 * @param {type} idSelect recibe el id del select a limpiar
 */
function clearSelect(idSelect) {
    $('#' + idSelect).empty();
    $('#' + idSelect).append('<option value="" selected disabled>Seleccione opción</option>');
}
/*
 * Metodo para cargar dinamicamente un json en un select determinado.
 * @param {type} idSelect recibe el id del select donde se van a cargar los datos.
 * @param {type} date recibe los datos a ser cargados en formato json.
 * @param {type} clave recibe el nombre del id del registro unico a que sera reemplazado por un id por defecto.
 * @param {type} valor recibe el nombre del id del dato a presentarse en el select que sera reemplazado por un id por defecto.
 */
function loadDinamicSelect(idSelect, data, clave, valor) {

    var reClave = new RegExp(clave, 'g');
    var reValor = new RegExp(valor, 'g');
    data = data.replace(reClave, 'clave');
    data = data.replace(reValor, 'valor');
    data = JSON.parse(data);
    html = '<option value="" selected disabled>Seleccione opción</option>';
    $.each(data, function (index, d) {
        html += '<option value="' + d.clave + '">' + d.valor + '</option>';
    });
    $('#' + idSelect).html(html);

}

function cargarSelectSucursales(idSelectSucursal, isDefaultOption) {
    var data = {
        csrfToken: getToken(),
        action: 'ALL'
    };
    $.ajax({
        url: 'CiaManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            html = '';
            if (!$.isEmptyObject(data)) {
                if (isDefaultOption) {
                    html = '<option value="" selected disabled>Seleccione opción</option>';
                }
                $.each(data, function (index, d) {
                    html += '<option value="' + d.nrocia + '">' + d.nomcia + '</option>';
                });
            } else {
                html = '<option value="" selected disabled>Sin sucursales</option>';
            }
            $('#' + idSelectSucursal).html(html);
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

function cargarSelectEps(idSelectEps, tipoEps) {
    onKeyUpWithTimeout(validarSession, 800);

    $.ajax({
        url: 'EpsManage?action=' + tipoEps,
        method: 'post',
        success: function (data) {
            loadDinamicSelect(idSelectEps, data, 'nroeps', 'nomeps');
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

//Funcion para cargar los contratos de una eps previamente seleccionada
/**
 * idSelectEps: indica el select de donde se va a seleccionar la eps
 * idSelectContrato: indica el select donde se van a cargar los contratos de la eps seleccionada
 * isDefaultOption: indica si se agrega un primer item bloqueado para obligar al usuario seleccionar uno de los items
 * isEnabledOnActivo: indica si los contratos terminados se muestran como un item deshabilitado
 * 
 */
function cargarSelectContratosPorEps(idSelectEps, idSelectContrato, isDefaultOption, isEnabledOnActivo) {
    onKeyUpWithTimeout(validarSession, 800);

    var data = {
        epsId: $('#' + idSelectEps).val(),
        csrfToken: getToken(),
        action: 'CONTRATOSENCURSOPOREPS'
    };
    $.ajax({
        url: 'ContratoManage',
        method: 'post',
        data: data,
        dataType: 'json',
        async: true,
        success: function (data) {
            html = '';
            if (!$.isEmptyObject(data)) {
                if (isDefaultOption) {
                    html = '<option value="" selected disabled>Seleccione opción</option>';
                }
                $.each(data, function (index, d) {
                    if (d.estado !== 'TERMINADO') {
                        html += '<option value="' + d.contratoId + '">' + d.numeroContrato + ' - ' + d.estado + '</option>';
                    } else {
                        if (isEnabledOnActivo) {
                            html += '<option value="' + d.contratoId + '"  selected disabled>' + d.numeroContrato + ' - ' + d.estado + '</option>';
                        } else {
                            html += '<option value="' + d.contratoId + '">' + d.numeroContrato + ' - ' + d.estado + '</option>';
                        }
                    }
                });
            } else {
                html = '<option value="" selected disabled>Sin contratos</option>';
            }
            $('#' + idSelectContrato).html(html);
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

//Funcion para cargar los numeros de contratos de una eps previamente seleccionada
function cargarSelectNumeroContratoPorEps(idSelectEps, idSelectContrato, isDefaultOption, isEnabledOnActivo) {
    onKeyUpWithTimeout(validarSession, 800);

    var data = {
        epsId: $('#' + idSelectEps).val(),
        csrfToken: getToken(),
        action: 'CONTRATOSPOREPS'
    };
    $.ajax({
        url: 'ContratoManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            html = '';
            if (!$.isEmptyObject(data)) {
                if (isDefaultOption) {
                    html = '<option value="" selected disabled>Seleccione opción</option>';
                }
                $.each(data, function (index, d) {
                    if (d.estado !== 'TERMINADO') {
                        html += '<option value="' + d.numeroContrato + '">' + d.numeroContrato + ' - ' + d.estado + '</option>';
                    } else {
                        if (isEnabledOnActivo) {
                            html += '<option value="' + d.numeroContrato + '"  selected disabled>' + d.numeroContrato + ' - ' + d.estado + '</option>';
                        } else {
                            html += '<option value="' + d.numeroContrato + '">' + d.numeroContrato + ' - ' + d.estado + '</option>';
                        }
                    }
                });
            } else {
                html = '<option value="" selected disabled>Sin contratos</option>';
            }
            $('#' + idSelectContrato).html(html);
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

//Funcion para cargar los servicios de un contrato
function cargarSelectServiciosPorContrato(idSelectContrato, idSelectServicio, categoria, isDefaultOption) {
    onKeyUpWithTimeout(validarSession, 800);

    var data = {
        contratoId: $('#' + idSelectContrato).val(),
        csrfToken: getToken(),
        categoria: categoria,
        action: 'GETSERVICIOSCONTRATO'
    };
    $.ajax({
        url: 'ContratoManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            html = '';
            if (!$.isEmptyObject(data)) {
                if (isDefaultOption) {
                    html = '<option value="" selected disabled>Seleccione opción</option>';
                }
                $.each(data, function (index, d) {
                    html += '<option value="' + d.nrosrv + '">' + d.descup + '</option>';
                });
            } else {
                html = '<option value="" selected disabled>Sin servicios</option>';
            }
            $('#' + idSelectServicio).html(html);
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}
//Funcion para cargar los servicios de un contrato por especialidad del medico
function cargarSelectServiciosPorEspecialidad(idSelectContrato, idSelectServicio, categoria, especialidadId, isDefaultOption) {
    onKeyUpWithTimeout(validarSession, 800);

    var data = {
        contratoId: $('#' + idSelectContrato).val(),
        csrfToken: getToken(),
        categoria: categoria,
        especialidadId: especialidadId,
        action: 'GETSERVICIOSESPECIALIDAD'
    };
    $.ajax({
        url: 'ContratoManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            html = '';
            if (!$.isEmptyObject(data)) {
                if (isDefaultOption) {
                    html = '<option value="" selected disabled>Seleccione opción</option>';
                }
                $.each(data, function (index, d) {
                    html += '<option value="' + d.nrosrv + '">' + d.descup + '</option>';
                });
            } else {
                html = '<option value="" selected disabled>Sin servicios</option>';
            }
            $('#' + idSelectServicio).html(html);
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

//Funcion para cargar los servicios de un contrato
function cargarSelectPaquetesPorContrato(idSelectContrato, idSelectPaquete, isDefaultOption) {
    onKeyUpWithTimeout(validarSession, 800);

    var data = {
        contratoId: $('#' + idSelectContrato).val(),
        csrfToken: getToken(),
        action: 'GETPAQUETESCONTRATO'
    };
    $.ajax({
        url: 'ContratoManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            html = '';
            if (!$.isEmptyObject(data)) {
                if (isDefaultOption) {
                    html = '<option value="" selected disabled>Seleccione opción</option>';
                }
                $.each(data, function (index, d) {
                    html += '<option value="' + d.paqueteId + '">' + d.nombre + ' - $' + number_format(d.valor) + '</option>';
                });
            } else {
                html = '<option value="" selected disabled>Sin paquetes</option>';
            }
            $('#' + idSelectPaquete).html(html);
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

//Funcion para cargar los periodos de facturacion y evolucion de un tratamiento ya registrado
function cargarSelectPeriodosTratamientoRegistrado(tratamientoId, idSelectPeriodos, isDefaultOption) {
    var data = {
        tratamientoId: $('#' + tratamientoId).val(),
        csrfToken: getToken(),
        action: 'GETPERIODOSTRATAMIENTOREGISTRADO'
    };

    $.ajax({
        url: 'TmoManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            html = '';
            if (!$.isEmptyObject(data)) {
                if (isDefaultOption) {
                    html = '<option value="" selected disabled>Seleccione opción</option>';
                }
                $.each(data, function (index, d) {
                    html += '<option value="' + d.periodoId + '">' + d.mes + ' DE ' + d.anio + '</option>';
                });
            } else {
                html = '<option value="" selected disabled>Sin contratos</option>';
            }
            $('#' + idSelectPeriodos).html(html);
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}


function number_format(amount, decimals) {

    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

    decimals = decimals || 0; // por si la variable no fue fue pasada

    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0)
        return parseFloat(0).toFixed(decimals);

    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);

    var amount_parts = amount.split('.'),
            regexp = /(\d+)(\d{3})/;

    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + '.' + '$2');

    return amount_parts.join('.');
}

function searchMdcXSpd(especialidadId, medicoId) {
    onKeyUpWithTimeout(validarSession, 800);

    var data = {
        nrospd: $('#' + especialidadId).val(),
        action: 'SEARCHXSPD'
    };

    $.ajax({
        url: 'MdcManage',
        method: 'post',
        dataType: 'json',
        data: data,
        success: function (r) {

            //Limpio el select de medicos
            $('#' + medicoId).empty();
            $('#' + medicoId).removeAttr('disabled');

            //Agrego la opcion por defecto
            $('#' + medicoId).append('<option value="" selected disabled>Seleccione una opción</option>');

            //Recorro el json y agrego las nuevas opciones
            $.each(r, function (index, d) {
                $('#' + medicoId).append('<option value="' + d.nrousr + '">' + d.pnmprs + ' ' + d.papprs + '</option>');
            });
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });

}

function searchHraXMdc() {
    onKeyUpWithTimeout(validarSession, 800);

    var data = {
        nromdc: $('#slctmdc').val(),
        fchcta: $('#fchcta').val(),
        action: 'GETHRAXMDC'
    };

    $.ajax({
        url: 'CtaManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (r) {
            //Limpio el select de las horas
            $('#slcthra').empty();
            $('#slcthra').removeAttr('disabled');

            //Agrego la opcion por defecto
            $('#slcthra').append('<option value="" selected disabled>Seleccione una opción</option>');

            //Recorro el json y agrego las nuevas opciones
            $.each(r, function (index, d) {
                $('#slcthra').append('<option value="' + d.nomelm + '">' + d.nomelm + '</option>');
            });
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getMes(periodo) {
    switch (periodo) {
        case "01" :
            return "ENERO";
            break;
        case "02" :
            return "FEBRERO";
            break;
        case "03" :
            return "MARZO";
            break;
        case "04" :
            return "ABRIL";
            break;
        case "05" :
            return "MAYO";
            break;
        case "06" :
            return "JUNIO";
            break;
        case "07" :
            return "JULIO";
            break;
        case "08" :
            return "AGOSTO";
            break;
        case "09" :
            return "SEPTIEMBRE";
            break;
        case "10" :
            return "OCTUBRE";
            break;
        case "11" :
            return "NOVIEMBRE";
            break;
        case "12" :
            return "DICIEMBRE";
            break;
    }
}

function getMunicipios(coddep, idSelect) {
    html = '<option value="" selected disabled>Seleccione ciudad...</option>';
    var data = {
        action: 'GETMUNICIPIOS',
        coddep: coddep
    };

    $.ajax({
        url: 'UserManage',
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $('#' + idSelect).attr('disabled', 'true');
        },
        success: function (response) {
            $.each(response, function (index, mun) {
                html += '<option value="' + mun.codmun + '">' + mun.nommun + '</option>';
            });
            $('#' + idSelect).html(html);
            $('#' + idSelect).removeAttr('disabled');
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

/*
 * Funcion especial para finalizar las transacciones de manera reducida en el 
 * codigo principal.
 * @param {type} response recibe la respuesta enviada por el servidor
 * @param {type} message recibe el mensaje en caso de ser exitosa la transaccion
 * @param {type} functionSuccess recibe una funcion que se ejecuta en caso de ser exitosa la transaccion
 * @param {type} functionError recibe una funcion que se ejecuta en caso de ser fallida la transaccion
 * @returns {undefined}
 * 
 */
function endTransaction(response, message, functionSuccess, functionError) {
    setTimeout(function () {
        if (response.includes('OK')) {
            showToast('¡Transacción exitosa!', message, 'success');
            functionSuccess();
        } else {
            showToast('¡Transacción abortada!', response, 'error');
            functionError();
        }
    }, 500);
}

/**
 * Funcion especial para restablecer el acceso a una cuenta a sus valores predeterminados. 
 * */
function restoreDefaultPass(tpoprs) {
    ajaxSwal('¿Seguro que desea restablecer la cuenta de este usuario?', '', 'warning', 'Restablecer cuenta', 'Cancelar', function () {
        var data = {
            nrousr: tpoprs === 'MDC' ? $('#nromdc-manager-mdc').val() : $('#nrompy-manager-mpy').val(),
            tpoprs: tpoprs,
            csrfToken: getToken(),
            action: 'RESTOREDEFAULTPASS'
        };

        $.ajax({
            url: 'UserManage',
            method: 'post',
            data: data,
            success: function (response) {
                endTransaction(response, 'Se ha restablecido la cuenta satisfactoriamente.', function () {}, function () {});
            },
            error: function () {
                showErrorConnectionMessage();
            }
        });
    }, function () {
        //Boton cancelar
    });

}

/*****************MENÚ***********************/
function collapse(primary) {
    $('#sidebar-wrapper').find("[id!='" + primary + "']").collapse('hide');
}

function collapse(primary, secondary) {
    $('#sidebar-wrapper').find("[id!='" + primary + "'][id!='" + secondary + "']").collapse('hide');
}


function deleteTabs(nromnx) {
    setTimeout(function () {
        $('#tab-' + nromnx).remove();
        $('#content-tab-' + nromnx).remove();
        $('#button-tab-' + nromnx).remove();
    }, 10);
    setTimeout(function () {
        //SELECCIONA EL ULTIMO TAB DISPONIBLE Y LO ABRE
        $('#tabs').find('a.principal-tab:last').addClass('active');
        $('#content-tab').find('div.principal-content:last').addClass('active');
    }, 10);
}

/*****************MENÚ***********************/

/**SWEET ALERT AJAX**/
/*
 * 
 * @param {type} title Recibe el titulo del mensaje
 * @param {type} text Recibe el cuerpo del mensaje
 * @param {type} type Recibe el tipo de mensaje PE: warning, info
 * @param {type} confirmButtonText Recibe el texto del boton de confirmar
 * @param {type} cancelButtonText Recibe el texto del boton de cancelar
 * @param {type} functionSuccess Recibe la funcion posterior a presionar el boton de confirmar
 * @param {type} functionCancel Recibe la funcion posterior a presionar el boton de cancelar
 * @returns {undefined}
 */
function ajaxSwal(title, text, type, confirmButtonText, cancelButtonText, functionSuccess, functionCancel) {
    swal({
        title: title,
        text: text,
        type: type,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }, function (isConfirm) {
        if (isConfirm) {
            setTimeout(function () {
                functionSuccess();
                swal.close();
            }, 500);
        } else {
            functionCancel();
        }
    });
}

function findGlobalTemplate(idtmp, idcmp) {
    onKeyUpWithTimeout(validarSession, 800);

    $('#' + idcmp).val('Cargando plantilla...');
    var data = {
        nrotmp: $('#' + idtmp).val(),
        action: 'FIND',
        csrfToken: getToken()
    };

    $.ajax({
        url: 'TemplateManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (template) {
            if (!jQuery.isEmptyObject(template)) {
                $('#' + idcmp).val(template.crptmp);
            } else {
                $('#' + idcmp).val('');
            }
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

function appendTemplateToTextarea(plantillaId, textId) {
    var data = {
        nrotmp: plantillaId,
        action: 'FIND',
        csrfToken: getToken()
    };

    $.ajax({
        url: 'TemplateManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (template) {
            if (!jQuery.isEmptyObject(template)) {
                var texto = $('#' + textId).val();
                if (texto !== '') {
                    texto += '\n\n' + template.crptmp;
                } else {
                    texto = template.crptmp;
                }
                $('#' + textId).val(texto);
            }
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

function uploadProfilePicture(idForm, nrousr, userType, functionAfterProcess) {

    var formData = new FormData($('#' + idForm)[0]);
    $.ajax({
        url: 'UserManage?action=UPLOADPROFILEPICTURE&nrousr=' + nrousr + '&userType=' + userType,
        method: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.includes('OK')) {
                functionAfterProcess();
            } else {
                showToast('¡Transacción abortada!', response, 'error');
            }
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });

}

function subir_archivo(idForm, idFilename, functionAfterProcess, functionOnError) {
    var formData = new FormData($('#' + idForm)[0]);
    $.ajax({
        url: 'DocumentosManage?action=SUBIRARCHIVO',
        method: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.includes('OK')) {
                $('#' + idFilename).val(response.replace('OK', ''));
                setTimeout(function () {
                    functionAfterProcess();
                }, 500);

            } else {
                showToast('¡Transacción abortada!', response, 'error');
                functionOnError();
            }
        },
        error: function () {
            showErrorConnectionMessage();
            functionOnError();
        }
    });
}

/*
 * Funcion especial para ejecutar una function en cuanto un usuario termina de escribir
 * y evitar lanzar muchas peticiones ajax al servidor.
 * @param {type} functionToExecute recibe la funcion a ejecutar en cuanto el usuario
 * termina de escribir.
 */
var tiempoEspera = '';
function onKeyUpWithTimeout(functionToExecute, tiempo = 800) {
    clearTimeout(tiempoEspera);
    tiempoEspera = setTimeout(functionToExecute, tiempo);
}

function cleanForm(formularioId) {
    $('#' + formularioId)[0].reset();
}

function lockForm(formularioId) {
    $('#' + formularioId).find('input, textarea, button, select').attr('disabled', 'true');
}

function unlockForm(formularioId) {
    $('#' + formularioId).find('input, textarea, button, select').removeAttr('disabled');
}

function lockElm(elementoId) {
    $('#' + elementoId).attr('disabled', 'true');
}

function unlockElm(elementoId) {
    $('#' + elementoId).removeAttr('disabled');
}

function lockElmByClass(elementoClass) {
    $('.' + elementoClass).attr('disabled', 'true');
}

function unlockElmByClass(elementoClass) {
    $('.' + elementoClass).removeAttr('disabled');
}

function deleteElm(elementoId) {
    $('#' + elementoId).remove();
}

function showElm(idElm) {
    $('#' + idElm).css('visibility', 'visible');
}

function hideElm(idElm) {
    $('#' + idElm).css('visibility', 'hidden');
}

function progressTable(tbodyId) {
    loader = '';
    loader += '<span id="spinner-preview">';
    loader += '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
    loader += '<span class="sr-only">Loading...</span>';
    loader += '</span>';
    $('#' + tbodyId).html('<tr class="row-bordered"><td class="tr-scroll m-2">' + loader + '</td></tr>');
}

function debloquearTabsSecundarios(clasePestanas) {
    $('.' + clasePestanas).removeClass('disabled');
}
function restaurarPestanaPrincipal(clasePestanas, clasePestanaPrincipal) {
    $('.' + clasePestanas).removeClass('active');
    $('.' + clasePestanas).addClass('disabled');
    $('.' + clasePestanaPrincipal).addClass('active');
    $('.' + clasePestanaPrincipal).removeClass('disabled');
}

function agregarItemATextArea(idInputOrigen, idTextArea) {
    var textArea = $('#' + idTextArea).val();
    if (textArea === '') {
        var texto = '- ' + $('#' + idInputOrigen).val();
    } else {
        var texto = textArea + '\n- ' + $('#' + idInputOrigen).val();
    }

    $('#' + idTextArea).val(texto);
    $('#' + idInputOrigen).val('');
}

/*
 * 
 * @param {type} criterio recibe el criterio de busqueda del diagnostico
 * @param {type} idCriterio recibe el id del input donde se va a poner el diagnostico
 * @param {type} idNrodgn recibe el id del input donde se va a poner el numero del diagnostico
 * @param {type} prompt recibe el id del div que contiene la lista de diagnosticos
 * @returns {undefined}
 */


function buscarDiagnostico(criterio, idCriterio, idNrodgn, prompt) {
    var data = {
        criterio: criterio,
        action: 'SEARCH'
    };
    $.ajax({
        url: 'DgnManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (response) {
            listarDiagnosticos(response, idCriterio, idNrodgn, prompt);
        },
        error: function () {
            showErrorConnectionMessage();
        }
    });
}

function listarDiagnosticos(diagnosticos, idCriterio, idNrodgn, prompt) {
    html = '<ul class=\"input-list\">';
    if (diagnosticos.length > 0) {
        $.each(diagnosticos, function (index, dgn) {
            html += '<li onClick="seleccionarDiagnostico(\'' + dgn.coddgn + '\',\'' + dgn.nrodgn + '\',\'' + dgn.nomdgn + '\',\'' + idCriterio + '\',\'' + idNrodgn + '\',\'' + prompt + '\')">(' + dgn.coddgn + ') ' + dgn.nomdgn + '</li>';
        });
    } else {
        $("#" + prompt).hide();
    }
    html += '</ul>';
    $('#' + prompt).show();
    $('#' + prompt).html(html);
}

//Funcion para seleccionar el diagnostico a asignar
/*
 * 
 * @param {type} coddgn codigo del diagnostico
 * @param {type} nrodgn numero del diagnostico
 * @param {type} nomdgn nombre del diagnostico
 * @param {type} idCriterio id del input donde se va a colocar el nombre del diagnostico con el codigo
 * @param {type} idNrodgn id del input donde se va a colocar el numero del diagnostico
 * @param {type} prompt id del div donde se van a cargar los diagnosticos 
 * @returns {undefined}
 */
function seleccionarDiagnostico(coddgn, nrodgn, nomdgn, idCriterio, idNrodgn, prompt) {
    $('#' + idCriterio).val('(' + coddgn + ') ' + nomdgn);
    if (idNrodgn !== '') {
        $('#' + idNrodgn).val(nrodgn);
    }
    $("#" + prompt).hide();
}

function funcionConPermisosDeUsuario(funcionAEjecutar) {

    var data = {
        csrfToken: getToken(),
        action: 'PERMISOSUSUARIO'
    };

    $.ajax({
        url: 'UserManage',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            funcionAEjecutar(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showErrorConnectionMessage();
        }
    });
}

/**
 * 
 * @param {type} idDivMotorPlantilla recibe el id del div en donde se va a cargar la lista de plantillas
 * @param {type} idElemento recibe el id del elemento en donde se va a pegar el contenido de la plantilla
 * @returns {undefined}
 */
function cargarMotorPlantillas(idDivMotorPlantilla, textId, loaderSize) {
    html = '';
    html += '<div class="col-sm-' + loaderSize + ' pl-0 pr-4 p-3">';
    html += '<div class="pnl pnl-loading-sm d-flex flex-column justify-content-center align-items-center" style="box-shadow: none !important">';
    html += '<span id="spinner-preview">';
    html += '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
    html += '<span class="sr-only">Loading...</span>';
    html += '</span>';
    html += '<p class="color-block mt-2">Cargando, por favor espere...</p>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $('#' + idDivMotorPlantilla).html(html);
    $('#' + idDivMotorPlantilla).load('views/globalViews/plantillas.jsp?textId=' + textId);
}