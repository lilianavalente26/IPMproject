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
fillTaskLists();

var currentRoutine = [];
var currentPrize = [0, 0, 0, 0];
var currentLoot = [0, 0, 0, 0];

var villageName = "Aldeia";
var gold = startingGold;
var heart = startingHeart;
var str = startingIron;
var flex = startingFaith;
var lancer = 0;
var archer = 0;
var cavalry = 0;
var upgradedCastle = false;
var joinedTerritory = false;
var territoryCode = "6ad6-8220-203c-1c2e-993c";



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

    $("#select-rotina").change(function() {
        var selectedRoutine = $('#select-rotina option:selected');
        updatePrize(selectedRoutine.val());
    });

    changeVillageName();
    //ENABLE "ALDEIA" AT STARTUP
    $('#aldeia').show();
    upgradedCastle = false;

    //UPDATE RESCOURCES
    $("#gold").html(gold);
    $("#heart").html(heart);
    $("#str").html(str);
    $("#flex").html(flex);

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
            console.error("Unable to create new task");
            break;
    }
}
function addTasksToList(tasks) {
    tasks.forEach(addTaskToList);
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
    createRoutine("Rotina Básica", tasks);
}

function setupAMinhaRotina() {
    if (upgradedCastle) {
        var tasks =
            [castleTasks.get("Jumping Jacks I"), farmTasks.get("Flexões I"),
            farmTasks.get("Abdominais I"), castleTasks.get("Mountain Climbers II"),
            farmTasks.get("Flexões I"), marketTasks.get("Flamingo I"),
            marketTasks.get("Tocar Os Calcanhares I")];
        createRoutine("A Minha Rotina", tasks);
        return;
    } else
        return;
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
            $("#lanceiros-valor-selecionado").html(val);
            $(".gold-loot").html(val * lancerStats[1]);
            break;
        case 2:
            var val = parseInt($("#arqueiros-selecionados").val());
            $("#arqueiros-valor-selecionado").html(val);
            $(".flex-loot").html(val * archerStats[4]);
            break;
        default:
            $(".gold-loot").html(0);
            $(".heart-loot").html(0);
            $(".str-loot").html(0);
            $(".flex-loot").html(0);
            break;
    }
}

function checkPopup(id, goldCost, heartCost, strCost, flexCost) {
    if (gold < goldCost || heart < heartCost || str < strCost || flex < flexCost) {
        $(id).addClass("disabled");
    } else {
        $(id).removeClass("disabled");
    }
}

function upgradeTask(task, name, listOfTasks) {
    var newTask = new Task(task.level + 1, name + "I", task.building);
    listOfTasks.push(newTask);
}
function upgradeBuilding(building) {
    var listOfTasks = [];
    switch (building) {
        case Building.CASTELO:
            castleTasks.forEach((value, key) => { upgradeTask(value, key, listOfTasks) });
            break;
        case Building.MERCADO:
            marketTasks.forEach(upgradeTask);
            break;
        case Building.QUINTA:
            farmTasks.forEach(upgradeTask);
            break;
        default:
            break;
    }
    addTasksToList(listOfTasks);
}

function upgradeCastle() {
    addResource(-5000, -20, -5, -5);
    upgradeBuilding(Building.CASTELO);
    upgradedCastle = true;
    castleTasks.forEach((value, key) => { showTask(Building.CASTELO, value, key) });
    //TIRAR DAQUI:
    setupAMinhaRotina();
}
function upgradeFarm() {
    addResource(-5000, -5, -20, -5);
    upgradeBuilding(Building.QUINTA);
    farmTasks.forEach((value, key) => { showTask(Building.QUINTA, value, key) });
}
function upgradeMarket() {
    addResource(-5000, -5, -5, -20);
    upgradeBuilding(Building.MERCADO);
    marketTasks.forEach((value, key) => { showTask(Building.MERCADO, value, key) });
}

function updateTaskList() {
    var routineName = $('#select-rotina option:selected').val();
    var tasks = mapOfRoutines.get(routineName);
    var targetTable = $("#lista-de-tarefas-da-rotina-selecionada")
    for (i = 0; i < tasks.length; i++) {
        currentRoutine[i] = tasks[i];
        targetTable.append(`<tr><td>${currentRoutine[i].name}</td></tr>`);
    }
}

function updatePrize(routineName) {
    if (routineName != 0) {
        $("#escolher-rotina").attr("style", "cursor: pointer");

        currentPrize = calculateBaseRoutinePrize(routineName);

        $(".gold-prize").html(currentPrize[0]);
        $(".heart-prize").html(currentPrize[1]);
        $(".str-prize").html(currentPrize[2]);
        $(".flex-prize").html(currentPrize[3]);
    }
}

function updateDifficulty(evento) {

    switch (evento) {
        case 0:
            if ($("#dif0").is(":checked")) {
                currentPrize[0] += 100;
                $(".gold-prize").html(currentPrize[0]);
            } else {
                currentPrize[0] -= 100;
                $(".gold-prize").html(currentPrize[0]);
            }
            break;
        case 1:
            if ($("#dif1").is(":checked")) {
                currentPrize[1] += 1;
                $(".heart-prize").html(currentPrize[1]);
            } else {
                currentPrize[1] -= 1;
                $(".heart-prize").html(currentPrize[1]);
            }
            break;
        case 2:
            if ($("#dif2").is(":checked")) {
                currentPrize[2] += 1;
                $(".str-prize").html(currentPrize[2]);
            } else {
                currentPrize[2] -= 1;
                $(".str-prize").html(currentPrize[2]);
            }
            break;
        case 3:
            if ($("#dif3").is(":checked")) {
                currentPrize[3] += 1;
                $(".flex-prize").html(currentPrize[3]);
            } else {
                currentPrize[3] -= 1;
                $(".flex-prize").html(currentPrize[3]);
            }
            break;
        default:
            $(".gold-prize").html(currentPrize[0]);
            $(".heart-prize").html(currentPrize[1]);
            $(".str-prize").html(currentPrize[2]);
            $(".flex-prize").html(currentPrize[3]);
            break;
    }
}

function doRoutine() {
    addResource(currentPrize[0], currentPrize[1], currentPrize[2], currentPrize[3]);
    $('input.form-check-input').prop('checked', false);
    currentPrize[0] = 0;
    currentPrize[1] = 0;
    currentPrize[2] = 0;
    currentPrize[3] = 0;
    $('#select-rotina option[value="0"]').prop('selected', true);
}

function alertFunds(lackingFunds) {
    lackingFunds.forEach(id => {
        $(id).addClass('lack-funds');
        setTimeout(function () { $(id).removeClass('lack-funds'); }, 1000);
    });
}


function addResource(goldVal, heartVal, strVal, flexVal) {

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
            if (joinedTerritory)
                $("#territorio").show();
            else
                $("#territorio-vazio").show();
            break;
        case 4:
            $("#prep-ataque").show();
            break;
        case 5:
            $('input.form-check-input').prop('checked', false);
            updateTaskList();
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
                $("#numero-de-lanceiros").addClass('recruited');
                setTimeout(function () { $(".lanceNr").removeClass('recruited'); }, 1000);
            }
            break;
        case 1:
            if (addResource(-150, -2, -2, -2)) {
                archer++;
                $(".archeNr").html(archer);
                $("#arqueiros-selecionados").attr('max', archer);
                $("#numero-de-arqueiros").addClass('recruited');
                setTimeout(function () { $(".archeNr").removeClass('recruited'); }, 1000);
            }
            break;
    }
}

const alert = (target, message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    target.append(wrapper)
}
function startAttack() {
    if (parseInt($("#arqueiros-selecionados").val()) < 1 && parseInt($("#lanceiros-selecionados").val()) < 1) {
        alert($("#alerta-tropas-insuficientes"), 'Não pode atacar sem tropas!', 'danger');
        setTimeout(function () { $(".alert").alert('close'); }, 1000);
    } else {
        var lance = parseInt($("#lanceiros-selecionados").val());
        var arch = parseInt($("#arqueiros-selecionados").val());
        currentLoot[0] = lance * lancerStats[1] + arch * archerStats[1];
        currentLoot[1] = lance * lancerStats[2] + arch * archerStats[2];
        currentLoot[2] = lance * lancerStats[3] + arch * archerStats[3];
        currentLoot[3] = lance * lancerStats[4] + arch * archerStats[4];
        $(".gold-loot").html(currentLoot[0]);
        $(".heart-loot").html(currentLoot[1]);
        $(".str-loot").html(currentLoot[2]);
        $(".flex-loot").html(currentLoot[3]);
        const toast = new bootstrap.Toast($("#start-attack-toast"));
        toast.show();
        openBlock(0);
        startTimer(1);
    }
}

function acceptResult() {
    addResource(currentLoot[0], currentLoot[1], currentLoot[2], currentLoot[3]);
    currentLoot[0] = 0;
    currentLoot[1] = 0;
    currentLoot[2] = 0;
    currentLoot[3] = 0;
}


var endTime = 0;

function startTimer(minutes) {
    var now = new Date();
    now = (Date.parse(now) / 1000);

    if (endTime == 0) {
        endTime = now + minutes * 60;
    }
    var refreshIntervalId = setInterval(makeTimer, 1000);

    setTimeout(function () { clearInterval(refreshIntervalId); $("#clocks").html(""); $("#clocks").removeClass("bg-warning text-dark bg-opacity-50"); endTime = 0; showAttackResult() }, (minutes * 60000));
}

function showAttackResult() {
    $("#attack-finished").modal('show');
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
    $("#clocks").addClass("bg-warning text-dark bg-opacity-50");
    $("#clocks").html("Ataque retorna:<br>" + hours + ":" + minutes + ":" + seconds);
}

function showTask(building, value, key) {
    var encodedKey = key.replaceAll(" ", "-");
    switch (building) {
        case Building.CASTELO:
            if ($(`#${encodedKey}`).length < 1) {
                $(".exercicios-castelo").append(`
            <input type="radio" class="btn-check" name="pick-exercise-radio" id=${encodedKey} value=${encodedKey}
            autocomplete="off"> <label class="btn btn-outline-dark" for=${encodedKey}>${key} <img src="assets/cardio.png" width="25" height="25"> </label>`);
            }
            break;
        case Building.MERCADO:
            if ($(`#${encodedKey}`).length < 1) {
                $(".exercicios-mercado").append(`
            <input type="radio" class="btn-check" name="pick-exercise-radio" id=${encodedKey} value=${encodedKey}
            autocomplete="off"> <label class="btn btn-outline-dark" for=${encodedKey}>${key} <img src="assets/flexibilidade.png" width="25" height="25"> </label>`);
                break;
            }
        case Building.QUINTA:
            if ($(`#${encodedKey}`).length < 1) {
                $(".exercicios-quinta").append(`
            <input type="radio" class="btn-check" name="pick-exercise-radio" id=${encodedKey} value=${encodedKey}
            autocomplete="off"> <label class="btn btn-outline-dark" for=${encodedKey}>${key} <img src="assets/forca.png" width="25" height="25"> </label>`);
                break;
            }
        default:
            break;
    }
}

var numeroSequencial = 1;
var creatingRoutine = [];

function showProspectedPrize() {
    var prize = calculateProspectedRoutinePrize(creatingRoutine);
    $(".gold-prospect-prize").html(prize[0]);
    $(".heart-prospect-prize").html(prize[1]);
    $(".str-prospect-prize").html(prize[2]);
    $(".flex-prospect-prize").html(prize[3]);
}

function calculateProspectedRoutinePrize(tasks) {
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

function confirmNewRoutine() {
    var newName = $("#nomeDeRotina").val();
    if (!mapOfRoutines.has(newName)) {
        createRoutine(newName, creatingRoutine);
        $('#select-rotina').append(`<option value="${newName}">${newName}</option>`);
        $('#confirmar-nova-rotina').modal('hide');
        setTimeout(openBlock(0), 1000);
        creatingRoutine = [];
    } else {
        alert($("#alerta-nome-ja-existente"), 'Esse nome já corresponde a uma rotina!', 'danger');
    }
}


function fillTaskLists() {
    castleTasks.forEach((value, key) => { showTask(Building.CASTELO, value, key) });
    marketTasks.forEach((value, key) => { showTask(Building.MERCADO, value, key) });
    farmTasks.forEach((value, key) => { showTask(Building.QUINTA, value, key) });
}


function addExerciseToCreateRoutine() {
    var selectedElement = $("input[name='pick-exercise-radio']:checked");

    var exercicio = selectedElement.val().replaceAll("-", " ");
    var icon;
    var currentTask;
    if (selectedElement.parent().hasClass("exercicios-castelo")) {
        icon = "assets/cardio.png";
        currentTask = castleTasks.get(exercicio);
    } else if (selectedElement.parent().hasClass("exercicios-quinta")) {
        icon = "assets/forca.png";
        currentTask = farmTasks.get(exercicio);
    } else if (selectedElement.parent().hasClass("exercicios-mercado")) {
        icon = "assets/flexibilidade.png";
        currentTask = marketTasks.get(exercicio);
    } else
        return;
    creatingRoutine[numeroSequencial - 1] = currentTask;
    $("#lista-de-exercicios").append(`
        <tr>
        <td>${numeroSequencial}</td>
        <td>${exercicio}</td>
        <td><img src=${icon} width="25" height="25"></td>
        <td><button class="btn-close" type="button" aria-label="Close" onclick="removeExerciseFromCreateRoutine(this, ${numeroSequencial})"></button>
        </tr>
        <tr>
        <td colspan="4"><span id="adicionar-exercicio-button" data-bs-toggle="modal" data-bs-target="#adicionar-exercicio-modal"
        style="cursor: pointer;">
        <button class="btn btn-outline-info"
            onclick="">Adicionar tarefa</button>
    </span></td>
        </tr>`
    )

    numeroSequencial++;
}

function removeAddButton() {
    console.log($('#adicionar-exercicio-button').parent().remove())
}

function removeExerciseFromCreateRoutine(element, number) {
    numeroSequencial--;
    creatingRoutine.splice(number - 1, 1);
    console.log($(element).parent().parent().remove())
}

function generateTerritoryCode() {
    $("#generated-self-code").val(territoryCode);
}

function joinTerritory() {
    var codeEntered = $("#codigo-territorio").val();
    if (codeEntered === territoryCode) {
        joinedTerritory = true;
        setTimeout(openBlock(3), 1000);
    } else {
        alert($("#alerta-territorio-inexistente"), 'Esse território não existe!', 'danger');
    }
}

const copyToClipboard = async () => {
    try {
        const element = $(".user-select-all");
        await navigator.clipboard.writeText(element.val());
        console.log("Text copied to clipboard!");
        // Optional: Display a success message to the user
    } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        // Optional: Display an error message to the user
    }
};

function updateMusicVolume() {
    $("#volume-da-musica").html("Volume da música: " + $("#music-volume").val());
}

function changeVillageName() {
    var element = $("#nomeDaAldeia");
    if (element.val().length) {
        villageName = element.val();
    }
    $(".nome-da-aldeia").html(villageName);
    $("#nomeDaAldeia").attr("placeholder", villageName);
}

function confirmChanges() {
    changeVillageName();
    console.log("confirmed!");
}
