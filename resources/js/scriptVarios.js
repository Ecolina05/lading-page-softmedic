/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * Función para animar los desplazamientos entre anclas o etiquetas 'a'
 */
$(function () {
    // $('a[href^="#"]').on('click', function (event) {
    //     var anchor = $(this.getAttribute('href'));
    //     if (anchor.length) {
    //         event.preventDefault();
    //         $('html, body').stop().animate({
    //             scrollTop: anchor.offset().top
    //         }, 1200);
    //     }
    // });

    $('.carousel-control').on('click', function (event) {
        $('html, body').stop();
    });

    $('#tabAgendar').on('click', function (event) {
        $('html, body').stop();
    });

    $('#tabConsultar').on('click', function (event) {
        $('html, body').stop();
    });
});

/*
 * Función para cambiar de color la barra superior al hacer scroll
 */
$(window).scroll(function () {
    if ($("#navGlobal").offset().top > 60) {
        $("#navGlobal").addClass("navbar-scroll");
        $("#btnUp").addClass("animated bounceInRight d-block");
    } else {
        $("#navGlobal").removeClass("navbar-scroll");
        $("#btnUp").removeClass("d-block");
    }
});

//Tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
$('[data-toggle="tooltip"]').click(function () {
    $('[data-toggle="tooltip"]').tooltip("hide");

});
