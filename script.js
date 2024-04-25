var gold = 5000;
var heart = 25;
var str = 6;
var flex = 5;
var lance = 0;
var arche = 0;

// TODO: PADRONIZAR OS VALORES DAS COISAS TODAS NO JAVASCRIPT. O HTML DEVE SER PREENCHIDO SÓ COM ISTO EM TODAS AS OCASIOES.
// TODO: criar mainblock para lista de tarefas
// TODO: criar mainblock para nova rotina
// TODO: criar popup para atacar / trocar no territorio
// TODO: criar popus e/ou animacoes de concretização de um ataque e de uma rotina.
// TODO: criar temporizador no mainblock da aldeia com tempo até o ataque terminar.
// TODO: mecanicas do combate (low prio)
// TODO: juntar a um território
// TODO: Alterar o nome da aldeia?
// TODO: Criar um Help button (?) que corresse uma animação de um tutorial (mas com placeholder apenas).

$(document).ready(function () {

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


    //CODE GOES HERE

    //ENABLE "ALDEIA" AT STARTUP
    $('#aldeia').show();

    //UPDATE RESCOURCES
    $("#gold").html(gold);
    $("#heart").html(heart);
    $("#str").html(str);
    $("#flex").html(flex);

    $(".lanceNr").html(lance)
    $(".archeNr").html(arche)

    $("#lanceiros-selecionados").attr('max', lance);
    $("#arqueiros-selecionados").attr('max', arche);

});

function updateLoot(tropa) {

    switch (tropa) {
        case 1:
            var val = parseInt($("#lanceiros-selecionados").val());
            $("#gold-loot").html(val * 20);
            break;
        case 2:
            var val = parseInt($("#arqueiros-selecionados").val());
            $("#flex-loot").html(val * 1);
            break;
        default:
            $("#gold-loot").html(0);
            $("#heart-loot").html(0);
            $("#str-loot").html(0);
            $("#flex-loot").html(0);
            break;
    }
}

function checkPopup(id) {
    if (gold < 5000 || heart < 20 || str < 5 || flex < 5) {
        $(id).addClass("disabled");
    } else {
        $(id).removeClass("disabled");
    }
}

function updatePrize(evento) {
    switch (evento) {
        case 1:
            $("#gold-prize").html(1200);
            $("#heart-prize").html(2);
            $("#str-prize").html(2);
            $("#flex-prize").html(2);
            break;
        case 2:
            $("#gold-prize").html(1850);
            $("#heart-prize").html(3);
            $("#str-prize").html(3);
            $("#flex-prize").html(2);
            break;
        default:
            $("#gold-prize").html(0);
            $("#heart-prize").html(0);
            $("#str-prize").html(0);
            $("flex-prize").html(0);
            break;
    }
}

function updateDifficulty(evento) {
    var gold = parseInt($("#gold-prize").html());
    var cardio = parseInt($("#heart-prize").html());
    var str = parseInt($("#str-prize").html());
    var flex = parseInt($("#flex-prize").html());
    switch (evento) {
        case 1:
            if ($("#dif1").is(":checked")) {
                $("#gold-total-prize").html(gold + 100);
            } else {
                $("#gold-total-prize").html(gold);
            }
            break;
        case 2:
            if ($("#dif2").is(":checked")) {
                $("#heart-total-prize").html(cardio + 1);
            } else {
                $("#heart-total-prize").html(cardio);
            }
            break;
        case 3:
            if ($("#dif3").is(":checked")) {
                $("#str-total-prize").html(str + 1);
            } else {
                $("#str-total-prize").html(str);
            }
            break;
        case 4:
            if ($("#dif4").is(":checked")) {
                $("#flex-total-prize").html(flex + 1);
            } else {
                $("#flex-total-prize").html(flex);
            }
            break;
        default:
            $("#gold-total-prize").html(gold);
            $("#heart-total-prize").html(heart);
            $("#str-total-prize").html(str);
            $("#flex-total-prize").html(flex);
            break;
    }
}

function doRoutine() {
    var gold = parseInt($("#gold-total-prize").html());
    var cardio = parseInt($("#heart-total-prize").html());
    var str = parseInt($("#str-total-prize").html());
    var flex = parseInt($("#flex-total-prize").html());
    addResource(gold, cardio, str, flex);
    openBlock(0);
}

function alertFunds(lackingFunds) {
    lackingFunds.forEach(id => {
        $(id).addClass('lack-funds');
        setTimeout(function () { $(id).removeClass('lack-funds'); }, 1000);
    });

}

function addResource(goldVal, heartVal, strVal, flexVal) {

    // $("label").removeClass('lack-funds');
    if (gold + goldVal < 0 || heart + heartVal < 0 || str + strVal < 0 || flex + flexVal < 0) {

        var variables = []

        if (gold + goldVal < 0) variables.push('#gold')
        if (heart + heartVal < 0) variables.push('#heart')
        if (str + strVal < 0) variables.push('#str')
        if (flex + flexVal < 0) variables.push('#flex')

        alertFunds(variables)
        return false;
    }

    gold += goldVal;
    heart += heartVal;
    str += strVal;
    flex += flexVal;

    //UPDATE RESCOURCES
    $("#gold").html(gold);
    $("#heart").html(heart);
    $("#str").html(str);
    $("#flex").html(flex);
    $("#desenvolver-castelo-popup").modal('hide');
    return true;
}

function openBlock(blockValue) {

    $("#quick-start-icon").show();
    $(".mainBlock").hide();
    switch (blockValue) {
        case 0:
            $("#aldeia").show();
            break;
        case 1:
            $("#centro").show();
            $("#quick-start-icon").hide();
            break;
        case 2:
            $("#castelo").show();
            break;
        case 3:
            $("#territorio").show();
            break;
        case 4:
            $("#prep-ataque").show();
            break;
        case 5:
            $("#iniciar-rotina").show();
            $("#quick-start-icon").hide();
            break;
        default:
            $("#aldeia").show();
            break;
    }
}
function addTroop(troopNr) {
    switch (troopNr) {
        case 0:
            if (addResource(-100, -2, -1, 0)) {
                lance++;
                $(".lanceNr").html(lance);
                $("#lanceiros-selecionados").attr('max', lance);

            }
            break;
        case 1:
            if (addResource(-150, -2, -2, -2)) {
                arche++;
                $(".archeNr").html(arche);
                $("#arqueiros-selecionados").attr('max', arche);
            }
            break;
    }
}
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}
function startAttack() {
    if (parseInt($("#arqueiros-selecionados").val()) < 1 && parseInt($("#lanceiros-selecionados").val()) < 1) {
        alert('Não pode atacar sem tropas!', 'danger');
        setTimeout(function () { $(".alert").alert('close'); }, 1000);
    } else {
        openBlock(0);
    }
}

function addElement() {
    $("#troopTable").append(`
        <tr>
        <td><button onclick="addResource(-150, -2, -2, -2); addTroop(1);">Arqueiro <span class="archeNr"></span></button></td>
        <td><img src="assets/ouro.png" width="25" height="25">150</td>
        <td><img src="assets/cardio.png" width="25" height="25">2</td>
        <td><img src="assets/forca.png" width="25" height="25">2</td>
        <td><img src="assets/flexibilidade.png" width="25" height="25">2</td>
        <td><button onclick="removeElement(this)";
        </tr>`
    );
}

function removeElement(element) {
    console.log($(element).parent().parent().remove())

}