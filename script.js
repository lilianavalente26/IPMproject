const startingGold = 5000;
const startingHeart = 25;
const startingIron = 6;
const startingFaith = 5;

const baseGoldBonus = 100;
const baseHeartBonus = 1;
const baseIronBonus = 1;
const baseFaithBonus = 1;

const LevelOneGoldPrize = 200;
const LevelOneHeartPrize = 1;
const LevelOneIronPrize = 1;
const LevelOneFaithPrize = 1;

const LevelTwoGoldPrize = 450;

const lancerStats = [200, 20, 0, 0, 0];
const archerStats = [150, 0, 0, 0, 1];
const cavalryStats = [300, 100, 1, 1, 1];

/**
 * Enum for buildings in village.
 * @readonly
 * @enum {{name: string, resource: string}}
 */
const Building = Object.freeze({
    CASTELO: { name: "castelo", resource: "heart" },
    CENTRO: { name: "centro", resource: "gold" },
    QUINTA: { name: "quinta", resource: "str" },
    MERCADO: { name: "mercado", resource: "flex" }
});

class Task {
    constructor(level, name, building) {
        this.level = level;
        this.name = name;
        this.building = building;
    }
}

const castleTasks = new Map();
const farmTasks = new Map();
const marketTasks = new Map();
setupStartingTasks();

const mapOfRoutines = new Map();
setupBasicRoutine();

var currentRoutine = [];
var currentPrize = [0, 0, 0, 0];

var gold = startingGold;
var heart = startingHeart;
var str = startingIron;
var flex = startingFaith;
var lancer = 0;
var archer = 0;
var cavalry = 0;

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

    //ENABLE "ALDEIA" AT STARTUP
    $('#aldeia').show();

    //UPDATE RESCOURCES
    $("#gold").html(gold);
    $("#heart").html(heart);
    $("#str").html(str);
    $("#flex").html(flex);

    console.log()

    $(".lanceNr").html(lancer)
    $(".archeNr").html(archer)

    $("#lanceiros-selecionados").attr('max', lancer);
    $("#arqueiros-selecionados").attr('max', archer);

});

function addTaskToList(task) {
    switch (task.building) {
        case Building.CASTELO:
            castleTasks.set(task.name, task);
            break;
        case Building.MERCADO:
            marketTasks.set(task.name, task);
            break;
        case Building.QUINTA:
            farmTasks.set(task.name, task);
            break;
        default:
            console.log("Unable to create new task");
            break;
    }
}

function createRoutine(name, tasks) {
    var list = [];
    tasks.forEach(task => list.push(task));
    mapOfRoutines.set(name, list);
}

function setupStartingTasks() {
    var task1 = new Task(1, "Jumping Jacks I", Building.CASTELO);
    var task2 = new Task(1, "Mountain Climbers I", Building.CASTELO);
    var task3 = new Task(1, "Flamingo I", Building.MERCADO);
    var task4 = new Task(1, "Tocar Os Calcanhares I", Building.MERCADO);
    var task5 = new Task(1, "Flexões I", Building.QUINTA);
    var task6 = new Task(1, "Abdominais I", Building.QUINTA);
    addTaskToList(task1);
    addTaskToList(task2);
    addTaskToList(task3);
    addTaskToList(task4);
    addTaskToList(task5);
    addTaskToList(task6);
}

function setupBasicRoutine() {
    var tasks =
        [castleTasks.get("Jumping Jacks I"), farmTasks.get("Flexões I"),
        farmTasks.get("Abdominais I"), castleTasks.get("Mountain Climbers I"),
        marketTasks.get("Flamingo I"), marketTasks.get("Tocar Os Calcanhares I")];
    createRoutine("Rotina Basica", tasks);
}

function calculateBaseRoutinePrize(routineName) {
    var tasks = mapOfRoutines.get(routineName);
    var g = 0;
    var h = 0;
    var s = 0;
    var f = 0;
    for (i = 0; i < tasks.length; i++) {
        g += (tasks[i].level * 200);
        h += (tasks[i].building == Building.CASTELO) ? tasks[i].level : 0;
        s += (tasks[i].building == Building.QUINTA) ? tasks[i].level : 0;
        f += (tasks[i].building == Building.MERCADO) ? tasks[i].level : 0;
    }
    return [g, h, s, f];
}


function updateLoot(tropa) {

    switch (tropa) {
        case 1:
            var val = parseInt($("#lanceiros-selecionados").val());
            $("#gold-loot").html(val * lancerStats[1]);
            $("#heart-loot").html(val * lancerStats[2]);
            $("#str-loot").html(val * lancerStats[3]);
            $("#flex-loot").html(val * lancerStats[4]);
            break;
        case 2:
            var val = parseInt($("#arqueiros-selecionados").val());
            $("#gold-loot").html(val * archerStats[1]);
            $("#heart-loot").html(val * archerStats[2]);
            $("#str-loot").html(val * archerStats[3]);
            $("#flex-loot").html(val * archerStats[4]);
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
            currentPrize = calculateBaseRoutinePrize("Rotina Basica");

            $("#gold-prize").html(currentPrize[0]);
            $("#heart-prize").html(currentPrize[1]);
            $("#str-prize").html(currentPrize[2]);
            $("#flex-prize").html(currentPrize[3]);
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
        case 6:
            $("#criar-rotina").show();
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
                lancer++;
                $(".lanceNr").html(lancer);
                $("#lanceiros-selecionados").attr('max', lancer);
                const toast = new bootstrap.Toast($("#lanceiro-recrutado-toast"));
                toast.show()
            }
            break;
        case 1:
            if (addResource(-150, -2, -2, -2)) {
                archer++;
                $(".archeNr").html(archer);
                $("#arqueiros-selecionados").attr('max', archer);
                const toast = new bootstrap.Toast($("#arqueiro-recrutado-toast"));
                toast.show()
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
        const toast = new bootstrap.Toast($("#start-attack-toast"));
        toast.show()
        openBlock(0);
    }
}


var endTime = 0;

function startTimer(minutes) {
    var now = new Date();
    now = (Date.parse(now) / 1000);

    if (endTime == 0) {
        endTime = now + minutes * 60;
    }
    var refreshIntervalId = setInterval(makeTimer, 1000);

    setTimeout(function () {clearInterval(refreshIntervalId);$("#clocks").html(""); endTime=0;}, (minutes * 60000));

}

function makeTimer() {
    var now = new Date();
    now = (Date.parse(now) / 1000);

    var timeLeft = endTime - now;

    var days = Math.floor(timeLeft / 86400);
    var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
    var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
    var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));
    if (hours < "10") { hours = "0" + hours; }
    if (minutes < "10") { minutes = "0" + minutes; }
    if (seconds < "10") { seconds = "0" + seconds; }

    $("#clocks").html("Ataque em curso: " + hours + ":" + minutes + ":" + seconds);
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