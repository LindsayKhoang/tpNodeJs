(function() {
    "use strict";
    $(() => {
        let roomName, userName, content;
        let refreshChat = function() {
            content = document.getElementById('input').value;

            $.ajax({
                url: `/room/${roomName}/messages`,
                data: {
                    message: 'test',
                    content: content,
                },
                method: 'post',
            }).done(function(data) {
                handleAjaxNewMessages(data);
                console.log(content);
            }).fail(function() {
                alert('erreur');
            }).always(() => {
                $(this).removeAttr('disabled');
            });
        };
        let handleAjaxNewMessages = function(data) {
            if (typeof(data.message) !== "undefined") {
                alert(`Error: ${data.message}`);
            } else if (Array.isArray(data.result)) {
                /* ok array = array of chat messages */
                let $messages = $('#messages');
                for (let chat of data.result) {
                    $messages.append(
                        `${chat.date}: ${chat.username}: ${chat.content}<br>\n`
                    );
                }
            } else { /* ? not an array ? */
                alert(`Error: we got an unexpected response.`);
            }
        };
        let createRoomButton = function(name) {
            return $('<button />')
                .data('room-name', name)
                .html(`Join room: ${name}`)
                .click(function() {
                    roomName = $(this).data('room-name');
                    userName = $(this).parent().find('input').val();
                    $('#rooms').slideUp();
                    $('#room-chat').slideUp(1000, function() {
                        $.ajax({
                            url: `/room/${roomName}/join`,
                            data: { username: userName, },
                            method: 'post',
                        }).done(function(data) {
                            $('#messages').empty();
                            let element = document.createElement("input");
                            element.setAttribute("type", "text");
                            element.setAttribute("id", "input");
                            element.setAttribute('placeholder', 'content');
                            let foo = document.getElementById("room-chat");

                            //Append the element in page (in span).
                            foo.appendChild(element);

                            $('body').append(
                                $('<button />')
                                    .html('Send')
                                    .attr('type', 'button')
                                    .click(function() {
                                        refreshChat();
                                    }));

                            handleAjaxNewMessages(data);
                            $('#room-chat').slideDown(1000);
                        }).fail(function() {
                            alert('erreur');
                        }).always(() => {
                            $(this).removeAttr('disabled');
                        });
                    });
                });
        };
        $('body').append(
            $('<button />')
                .html('Get rooms')
                .attr('type', 'button')
                .click(function() {
                    $(this).attr('disabled', 'disabled');
                    $.ajax({
                        url: "/rooms",
                        method: 'get',
                    }).done(function(data) {
                        if (typeof(data.message) !== "undefined") {
                            alert(`Error: ${data.message}`);
                        } else if (Array.isArray(data.result)) {
                            /* ok array = array of the rooms */
                            let $rooms = $('#rooms').empty().hide();
                            /* add input for the user name: */
                            $rooms.append(
                                $('<input />')
                                    .attr('name', 'username')
                                    .attr('placeholder', 'my username')
                            );
                            for (let room_name of data.result) {
                                $rooms.append(createRoomButton(room_name));
                            }
                            $rooms.slideDown(1000);
                        } else { /* ? not an array ? */
                            alert(`Error: we got an unexpected response.`);
                        }
                    }).fail(function() {
                        alert('erreur');
                    }).always(() => {
                        $(this).removeAttr('disabled');
                    });
                })
        );
    })
})();
