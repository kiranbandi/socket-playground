$(function() {

    var dataStore = {},
        selected = -1,
        currentID;

    for (var i = 0; i < 20; i++) {
        $("#boxContainer").append('<div id="id-' + i + '" class="innerBox"></div>')
    }

    var socket = io.connect('http://localhost:8080/');

    socket.on('broad', function(data) {
        dataStore = data;
        updateClientList(dataStore);
        updateSelections(selected, dataStore);
    });

    socket.on('new_join', function(response) {
        currentID = response.id;
        $('#myID').text(currentID);
        dataStore = response.data;
        updateClientList(dataStore);
        updateSelections(selected, dataStore);
    });

    $('#boxContainer').click(function(e) {
        if (e.target.className.indexOf('innerBox') > -1) {
            $("#" + event.target.id).toggleClass('selected');

            var list = [];
            $('.selected').each(function(index, value) {
                list.push(value.id.slice(3));
            })
            socket.emit('messages', { 'data': list });
        }
    });


    $('#phantomList').click(function(e) {
        if (e.target.className.indexOf('listElement') > -1 && e.target.id != currentID) {
            selected = e.target.id;
            updateSelections(selected, dataStore);
        }
    });


});


function updateClientList(dataStore) {
    $("#phantomList").empty();
    Object.keys(dataStore).map(function(value, index) {
        $("#phantomList").append('<li class="listElement" id=' + value + ' >' + value + '</li>')
    })
}

function updateSelections(selected, dataStore) {
    if (selected != -1) {
        $('.active').removeClass('active');
        $('.anchor').removeClass('anchor');

        $('#' + selected).addClass('anchor');
        dataStore[selected].map(function(value, index) {
            $("#id-" + value).addClass('active');
        })
    }
}