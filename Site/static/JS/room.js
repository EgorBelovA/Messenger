const controller = new AbortController();
const signal = controller.signal;





function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";

/*    document.querySelector(".attachments").scrollIntoView({
        top: document.querySelector(".tab"),
    });*/
}

document.querySelectorAll(".tablinks")[0].click();


function notifyMe() {
    var notification = new Notification ("Все еще работаешь?", {
        tag : "ache-mail",
        body : "Пора сделать паузу и отдохнуть",
        icon : "https://itproger.com/img/notify.png"
    });
}

function notifSet() {
    if (!("Notification" in window))
        alert ("Ваш браузер не поддерживает уведомления.");
    else if (Notification.permission === "granted")
        setTimeout(notifyMe, 2000);
    else if (Notification.permission !== "denied") {
        Notification.requestPermission (function (permission) {
            if (!('permission' in Notification))
                Notification.permission = permission;
            if (permission === "granted")
                setTimeout(notifyMe, 2000);
        });
    }
}

function close_audio_div_func(){
    document.querySelector(".audio_title_div").setAttribute("style", "display: none");
    document.querySelector(".hidden_audio").pause();
    play_check = 1;
}

function go_home_page_func(){
        room = 0;
        document.querySelector("#room_id").value = room;
        window.location.hash = room;
        document.querySelector("#name").value = "";
        load_check = 1;
        load_photo_check = 0;

        document.querySelector(".search_field").focus();


        $("#display").empty();


//        document.querySelector("#select_chat_to_start").style.display = "inline-block";


//        document.querySelector(".send_div").style.display = "none";
//        document.querySelector("#opponent_title_name").style.display = "none";
        adapt();
}

prev_audio_link = "";



function audio_play(index) {
    link = audio_files[index];
    console.log("READ", index);

    lastIndexOf_ = (link.lastIndexOf('_') == -1 ? link.lastIndexOf('.'):link.lastIndexOf('_'))
    file_name = link.slice(link.indexOf('media')+6, lastIndexOf_);
    file_new_name = decodeURIComponent(file_name.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
    file_type_from_name = link.slice(link.lastIndexOf('.'));
    complete_file_name = file_new_name + file_type_from_name;

    if(link != prev_audio_link){


        prev_audio_link = link;
        (async () => {

            const controller_audio = new AbortController();
            const signal_audio = controller_audio.signal;
            link_fetch = await fetch(link, {
                method: 'get',
                signal: signal_audio,
            })
            .catch(function(err) {
                console.log("ERROR");
            });

            link_audio = URL.createObjectURL(await link_fetch.blob());

            document.querySelector(".audio_title_div").setAttribute("style", "display: unset");


                    $("#file_name_title_div").empty();
                    document.querySelector("#file_name_title_div").append(complete_file_name);
                    document.querySelector(".hidden_audio").src = link_audio;

                document.querySelector(".hidden_audio").play();
                play_check = 0;

audio_interval = setInterval(function slider_move() {
//    console.log(document.querySelector("#audio-slider").value)
    document.querySelector("#audio-slider").value = document.querySelector(".hidden_audio").currentTime / document.querySelector(".hidden_audio").duration * 1000000;
    if(document.querySelector(".hidden_audio").currentTime == document.querySelector(".hidden_audio").duration && index != 0){
        audio_play(index-1);
        console.log(index);
        document.querySelector(".hidden_audio").currentTime = 0;
        clearInterval(audio_interval);
        console.log(document.querySelector(".hidden_audio").currentTime, document.querySelector(".hidden_audio").duration)
    }
}, 25);


        })()

    }

        else{
            if(!document.querySelector(".hidden_audio").paused){
                document.querySelector(".hidden_audio").pause();
                clearInterval(audio_interval);
            }
//            else{
//                document.querySelector(".hidden_audio").play();
//                audio_interval = setInterval(function slider_move() {
//                    document.querySelector("#audio-slider").value = document.querySelector(".hidden_audio").currentTime / document.querySelector(".hidden_audio").duration * 1000000;
//                    if(document.querySelector(".hidden_audio").currentTime == document.querySelector(".hidden_audio").duration && index != 0){
//                        clearInterval(audio_interval);
//
//                        audio_play(--index);
//                    }
//                }, 25);
//            }
        }

}

function seek(){
    document.querySelector(".hidden_audio").currentTime = document.querySelector("#audio-slider").value*document.querySelector(".hidden_audio").duration/1000000;
}





timer_touch_contextMenu = setTimeout('',0);

$(document).on('touchstart', function(e) {
    document.querySelector("body").classList.add("selection");
    console.log("STARTED")
    var x = e.originalEvent.touches[0].pageX;
    var y = e.originalEvent.touches[0].pageY;

    timer_touch_contextMenu = setTimeout(function(){

        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.style.display = "unset";

    }, 500);
});



document.addEventListener('touchend', (e) => {
    clearTimeout(timer_touch_contextMenu);
    document.querySelector("body").classList.remove("selection");
    console.log("ENDED")
    document.querySelector("body").oncontextmenu = function(e){
        e.preventDefault();
    }
});


const contextMenu = document.querySelector(".wrapper"),
shareMenu = contextMenu.querySelector(".share-menu");
copy = contextMenu.querySelector(".uil uil-copy");



document.addEventListener("click", () => {
    contextMenu.style.display = "none";
});





function getSelectionText() {
  var text = "";
  var activeEl = document.activeElement;
  var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  if (
    (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
    (typeof activeEl.selectionStart == "number")
  ) {
    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
  } else if (window.getSelection) {
    text = window.getSelection().toString();
  }
  document.execCommand("copy");

  return text;
}

var saveText = function() {
  var selectionText = getSelectionText();
  document.getElementById("sel").innerHTML = selectionText;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(JSON.stringify({
    note: selectionText
  }));
}


function txtdecode(Incode, passCode)
{
	var b52 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var maxPC = 0;
	for(var i=0; i<passCode.length; i++) maxPC += passCode.charCodeAt(i);
	maxPCmod = maxPC;
	ifPC = 0;
	var Incode = Incode.match(/\d+\w/g);
	var rexcode = "";
	var numPC = 0;
	for(var i=0; i<Incode.length; i++)
	{
		if(numPC == passCode.length) numPC = 0;
		if(maxPCmod < 1) maxPCmod = maxPC+ifPC;
		ifPC += maxPCmod % passCode.charCodeAt(numPC);
		var iscode = maxPCmod % passCode.charCodeAt(numPC);
		var nCode = (parseInt(Incode[i])*52)+parseInt(b52.indexOf(Incode[i].substr(-1)));
		maxPCmod -= passCode.charCodeAt(numPC);
		numPC++;
		rexcode += String.fromCharCode(nCode-iscode);
	}

/*	return rexcode.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/ /g, " ").replace(/\r\n|\r|\n/g,"<br />").replace(/(https?\:\/\/|www\.)([а-яА-Я\d\w#!:.?+=&%@!\-\/]+)/gi, function(url)
	{
		return '<a target="_blank" href="'+ (( url.match('^https?:\/\/') )?url:'http://' + url) +'">'+ url +'</a>';
	});*/
	return rexcode;
}


function txtencode(Incode, passCode)
{
	var b52 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var maxPC = ifPC = 0;
	for(var i=0; i<passCode.length; i++) maxPC += passCode.charCodeAt(i);
	maxPCmod = maxPC;
	var rexcode = "";
	var numPC = 0;
	for(var i=0; i<Incode.length; i++)
	{
		if(numPC == passCode.length) numPC = 0;
		if(maxPCmod < 1) maxPCmod = maxPC+ifPC;
		ifPC += maxPCmod % passCode.charCodeAt(numPC);
		var iscode = maxPCmod % passCode.charCodeAt(numPC);
		var nCode = (Incode.charCodeAt(i)+iscode);
		maxPCmod -= passCode.charCodeAt(numPC);
		numPC++;
		rexcode += parseInt(nCode / 52) + b52.charAt(parseInt(nCode % 52));
	}
	return rexcode;
}


window.onload = function() {

    room = document.getElementById("room").value;
    play_check = 1;
    load_check = 1;
    load_photo_check = 0;
    check_redirect = 1;
    sender_ajax = xhr = new XMLHttpRequest();
    first_unread_height = 0;
    all_photos_and_videos = [];
    all_messages_dives = [];
    block_date_dict = [];
    chatSocket = [];
    files_url = [];
    audio_files = [];
    send_allowed = true;
    all_messages = [];
    auto_scroll = true;
    unread_messages = new Set();
    chatSocket_user = null;
    forcibly_close_the_socket = false;



$.ajax({
    type: 'GET',
    url: '/get_general_info',
    success: function(data) {
        document.querySelector("#username").value = data.user[0].id;
        document.querySelector("#username_id").value = data.user[0].id;

console.log(data)

        if(data.user[0].image == ""){
            avatar = document.createElement("div");
            name = data.user[0].username;
            if(name != null)
                var letter = (name.substr(0, 1)).toUpperCase();
            else
                var letter = "";
            avatar.innerHTML = letter;

            if(name.lastIndexOf(' ') != -1){
                var letter_2 = (name.substr(name.lastIndexOf(' ')+1, 1)).toUpperCase();
                avatar.innerHTML += letter_2;
            }

            var backgroundColor = stringToColor(name);
            avatar.style.backgroundColor = backgroundColor;
            avatar.setAttribute('style', 'background: linear-gradient(0deg, ' + pSBC(-0.6, backgroundColor) + ' 0%, ' + pSBC(-0.4, backgroundColor) + ' 35%, ' + backgroundColor + ' 100%);');
            avatar.setAttribute('id', 'user-info-avatar_settings_menu');
        }
        else{
            avatar = document.createElement("img");
            avatar.src = "//" + window.location.host + "/media/" + data.user[0].image.slice(6);
            avatar.setAttribute('id', 'avatar_profile_settings_menu');
        }

    document.querySelector("#user_avatar_settings_menu_image").appendChild(avatar);
    document.querySelector("#username_settings_menu").textContent = data.user[0].username;

        document.querySelector("#user_settings_div").textContent = data.user[0].username;
        document.querySelector("#user_settings_email_div").textContent = data.user[0].email;

        document.querySelector("#user_settings_image_div").appendChild(avatar.cloneNode(true));

        function connect_user() {

        let url_user = `ws://${window.location.host}/socket-server/user/${document.querySelector("#username_id").value}/`;
        chatSocket_user = new WebSocket(url_user);

        chatSocket_user.onopen = function() {
        };


        chatSocket_user.onmessage = function(e){
            let data = JSON.parse(e.data)
            if(data.type == "create_new_room"){
                    var chat_counter = 0;
                    chat = [data.room];
                    console.log(chat)
                    for(item in chat){

                        var users_list = document.createElement("form");
                        var avatar = document.createElement("div");
                        avatar.setAttribute('class', 'user-info-avatar');
                        var opponent_ind = 0;


                        if(chat[item].room_type == 'G' || chat[item].room_type == 'C'){
                            if(chat[item].image != null){
                                avatar = document.createElement("img");
                                avatar.src = "//" + window.location.host + "/media/" + chat[item].image.slice(12);
                                avatar.setAttribute('class', 'avatar_profile');
                            }
                            opponent = chat[item].name;
                        }


                        if(chat[item].room_type == 'D'){
                            if(chat[item].users[0].id == document.querySelector("#username_id").value)
                                opponent_ind = 1
                            else
                                opponent_ind = 0

                            opponent = chat[item].users[opponent_ind].username;


                            if(chat[item].users[opponent_ind].image != null){
                                avatar = document.createElement("img");
                                avatar.src = "//" + window.location.host + "/media/" + chat[item].users[opponent_ind].image.slice(12);
                                avatar.setAttribute('class', 'avatar_profile');
                            }

                        }

                        var user_contact_id = document.createElement("input");
                        var user_contact_name = document.createElement("div");

                        var last_message = document.createElement("div");
                        var username_and_last_message = document.createElement("div");
                        var csrf =document.createElement('input');
                        var csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
                        var unread_counter = document.createElement("div");



                        last_message.setAttribute("class", "room_last_message");



                        csrf.setAttribute('type','hidden');
                        csrf.setAttribute('name','csrfmiddlewaretoken');
                        csrf.setAttribute("value", csrfToken);
                        csrf.setAttribute('style', 'display: none');


                        if(chat[item].users[opponent_ind].image == null && chat[item].image == null){
                            if(chat[item].room_type == "D")
                                name = chat[item].users[opponent_ind].username;
                            if(chat[item].room_type == "G" || chat[item].room_type == "C")
                                name = chat[item].name;

                            if(name != null)
                                var letter = (name.substr(0, 1)).toUpperCase();
                            else
                                var letter = "";
                            avatar.innerHTML = letter;

                            if(name.lastIndexOf(' ') != -1){
                                var letter_2 = (name.substr(name.lastIndexOf(' ')+1, 1)).toUpperCase();
                                avatar.innerHTML += letter_2;
                            }

                            var backgroundColor = stringToColor(name);
                            avatar.style.backgroundColor = backgroundColor;
                            avatar.setAttribute('style', 'background: linear-gradient(0deg, ' + pSBC(-0.6, backgroundColor) + ' 0%, ' + pSBC(-0.4, backgroundColor) + ' 35%, ' + backgroundColor + ' 100%);');

                        }


                        user_contact_id.value = chat[item].id;
                        user_contact_id.setAttribute('type', 'hidden');
                        user_contact_id.setAttribute('name', 'chats');
                        user_contact_id.setAttribute('style', 'display: none');


                        users_list.setAttribute('method', 'POST');
                        users_list.setAttribute('class', 'users_full_form');
                        users_list.setAttribute('name', 'form-submit-users');


                        user_contact_name.textContent = opponent;
                        user_contact_name.setAttribute('class', 'users');


                        username_and_last_message.appendChild(user_contact_name);
                        username_and_last_message.appendChild(last_message);



                        users_list.appendChild(avatar);
                        users_list.appendChild(csrf);
                        users_list.appendChild(user_contact_id);
                        users_list.appendChild(username_and_last_message);

                        document.querySelector(".users_search").prepend(users_list);


                        console.log(document.querySelector(".users_search"), users_list)



                        room_list[user_contact_id.value] = users_list;
                        list = document.querySelector('.users_search');

                        users_list_contact = users_list.cloneNode(true);

                        create_new_group_choose = document.createElement("div");
                        create_new_group_choose.setAttribute("class", "create_new_group_choose");
                        create_new_group_choose_check = document.createElement("input");
                        create_new_group_choose_check.type = "checkbox";
                        create_new_group_choose.appendChild(create_new_group_choose_check);


                        users_list_contact.prepend(create_new_group_choose);
                        document.querySelector(".all_my_contacts").append(users_list_contact);





                        users_list.onmousedown = function(event) {
                            event.preventDefault();

                            if(room != this.getElementsByTagName("input")[1].value){
//                                document.querySelector("#select_chat_to_start").style.display = "none";
                                block_date_dict = [];
                                sender_ajax.abort();
                                document.querySelector("#room_id").value = this.getElementsByTagName("input")[1].value;
                                document.querySelector("#name").value = this.querySelector('.users').textContent;
                                document.querySelectorAll(".users_full_form").forEach(function(e){ e.classList.remove("active")});
                                this.classList.add("active");
                                window.location.hash = document.querySelector("#room_id").value;
                                room = document.querySelector("#room_id").value;


                                check_redirect = 0;
                                load_check = 1;
                                load_photo_check = 0;
                                $("#display").empty();
                                $("#attachment_videos").empty();
                                $("#attachment_photos").empty();
                                $("#attachment_files").empty();
                                $("#attachment_music").empty();
                                $("#attachment_links").empty();
                                sender();
                                adapt();
                                check_new_mes = "";
                                avatar_attachments = this.firstChild.cloneNode(true);
                                console.log(avatar_attachments)


                                avatar_attachments_username = document.createElement("div");
                                avatar_attachments_username.setAttribute("id", "avatar_attachments_username");

                                opponent_username_attachment = document.createElement("div");
                                opponent_username_attachment.textContent = document.querySelector("#name").value;
                                opponent_username_attachment.setAttribute("id", "avatar_attachments_username")
                                avatar_attachments_username.appendChild(opponent_username_attachment);

                                $("#opponent_photo_avatar").empty();
                                document.querySelector("#opponent_photo_avatar").appendChild(avatar_attachments_username);
                                document.querySelector("#opponent_photo_avatar").appendChild(avatar_attachments);
                                if(avatar_attachments.classList.contains("user-info-avatar"))
                                    avatar_attachments.setAttribute("class", "user-info-avatar_attachments");
                                if(avatar_attachments.classList.contains("avatar_profile")){
                                    avatar_attachments.setAttribute("class", "avatar_profile_attachments");
                                    shadow = document.createElement("div");
                                    shadow.setAttribute("id", "attachment_avatar_shadow");
                                    document.querySelector("#opponent_photo_avatar").appendChild(shadow);
                                }

                            }
                            else
                                document.querySelector("#display").scrollTo({
                                    top: document.querySelector("#display").scrollHeight,
                                    behavior: "smooth",
                                });


                        }

//                        if(chat[item].users[0].id == document.querySelector("#username_id").value){
//                            window.location.hash = chat[item].users[0].id;
                            $(users_list).mousedown();
//                        }


                        if(list.getElementsByTagName('form')[chat_counter] != undefined)




//                                chatSocket[user_contact_id.value] = new WebSocket(url);

//                                chatSocket[user_contact_id.value].onclose = function(e){
//
//                                        number_of_room = this.url.slice(this.url.indexOf("socket-server")+14, this.url.lastIndexOf("/"));
////                                        this = "new WebSocket(this.url)";
////                                        let url = `ws://${window.location.host}/socket-server/${number_of_room}/`;
////                                        e = new WebSocket(url);
//
//
//                                }




                                connect_socket(user_contact_id.value);

                        ++chat_counter;
                    }

            }
if(data.type == "search_users"){
    document.querySelectorAll(".users_full_form.search").forEach(function(e){
        e.remove();
    })

    search_new_user = JSON.parse(JSON.parse(e.data).search);
    console.log(search_new_user)

                    var chat_counter = 0;
                    chat = search_new_user;
                    for(item in chat){
                        if(chat[item].id != document.querySelector("#username_id").value){

                            var users_list = document.createElement("form");
                            var avatar = document.createElement("div");
                            avatar.setAttribute('class', 'user-info-avatar');
                            var opponent_ind = 0;


                            if(chat[item].image != ""){
                                avatar = document.createElement("img");
                                avatar.src = "//" + window.location.host + "/media/" + chat[item].image.slice(12);
                                avatar.setAttribute('class', 'avatar_profile');
                            }
                            opponent = chat[item].username;




                            var user_contact_id = document.createElement("input");
                            var user_contact_name = document.createElement("div");

                            var last_message = document.createElement("div");
                            var username_and_last_message = document.createElement("div");
                            var csrf =document.createElement('input');
                            var csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
                            var unread_counter = document.createElement("div");






    //                        unread_messages_counter = 0;
    //                        for(viewed in response.all_chats[item].room){
    //                            if(!response.all_chats[item].room[viewed].viewed.includes(response.my_user) && response.all_chats[item].room[viewed].user != response.my_user)
    //                                ++unread_messages_counter;
    //                        }








    //                        for(all_messages_list = response.messages.length-1; all_messages_list >= 0; --all_messages_list){
    //                            if(response.messages[all_messages_list].room == response.all_chats[item].id){
    //                                if(response.messages[all_messages_list].value != "") last_message.innerHTML = txtdecode(response.messages[all_messages_list].value, "1234");
    //                                break;
    //                            }
    //                        }

                            last_message.setAttribute("class", "room_last_message");






                            csrf.setAttribute('type','hidden');
                            csrf.setAttribute('name','csrfmiddlewaretoken');
                            csrf.setAttribute("value", csrfToken);
                            csrf.setAttribute('style', 'display: none');


                            if(chat[item].image == ""){
                                name = chat[item].username;

                                if(name != null)
                                    var letter = (name.substr(0, 1)).toUpperCase();
                                else
                                    var letter = "";
                                avatar.innerHTML = letter;

                                if(name.lastIndexOf(' ') != -1){
                                    var letter_2 = (name.substr(name.lastIndexOf(' ')+1, 1)).toUpperCase();
                                    avatar.innerHTML += letter_2;
                                }

                                var backgroundColor = stringToColor(name);
                                avatar.style.backgroundColor = backgroundColor;
                                avatar.setAttribute('style', 'background: linear-gradient(0deg, ' + pSBC(-0.6, backgroundColor) + ' 0%, ' + pSBC(-0.4, backgroundColor) + ' 35%, ' + backgroundColor + ' 100%);');

                            }


                            user_contact_id.value = chat[item].id;
                            user_contact_id.setAttribute('type', 'hidden');
                            user_contact_id.setAttribute('name', 'users');
                            user_contact_id.setAttribute('style', 'display: none');


                            users_list.setAttribute('method', 'POST');
                            users_list.setAttribute('class', 'users_full_form search');
                            users_list.setAttribute('name', 'form-submit-users');


                            user_contact_name.textContent = opponent;
                            user_contact_name.setAttribute('class', 'users');


                            username_and_last_message.appendChild(user_contact_name);
                            username_and_last_message.appendChild(last_message);


    //                        unread_counter.textContent = unread_messages_counter;
    //                        unread_counter.setAttribute("class", "rooms_list_unread_counter");


                            users_list.appendChild(avatar);
                            users_list.appendChild(csrf);
                            users_list.appendChild(user_contact_id);
                            users_list.appendChild(username_and_last_message);
    //                        users_list.appendChild(unread_counter);
                            document.querySelector(".users_search").append(users_list);



                            room_list[user_contact_id.value] = users_list;
                            list = document.querySelector('.users_search');



                            console.log(room_list)





                            users_list.onmousedown = function(event) {
                document.querySelector(".search_field").value = "";
                document.documentElement.style.setProperty('--rooms_display', `flex`);
                document.querySelectorAll(".users_full_form.search").forEach(function(e){
                    e.remove();
                })

    formData = new FormData(this);
    //formData.append("room_type", "D");
    //formData.append("contacts_id", JSON.stringify([chat[item].id, document.querySelector("#username_id").value]));

    $.ajax({
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        url: '/checkview_users',
        data: formData,
        success: function(response){
            create_new_group_list_contacts = [chat[item].id, document.querySelector("#username_id").value]
            for(contact = 0; contact < create_new_group_list_contacts.length; ++contact){

                    (async () => {
                        const contact_ = contact;
                        url_contact = `ws://${window.location.host}/socket-server/user/${create_new_group_list_contacts[contact]}/`;
                        console.log("url_contact:", contact_);
                        chatSocket_contact = new WebSocket(await url_contact);

                        chatSocket_contact.onopen = function(){
                            this.send(JSON.stringify({
                                'type': "create_new_room",
                                'room_id': response.id,
                            }))
                            forcibly_close_the_socket = true;
                            this.close();
                        }
                    })()

            }
        }
    });
                                event.preventDefault();
                                if(room != this.getElementsByTagName("input")[1].value){
    //                                document.querySelector("#select_chat_to_start").style.display = "none";
    //                                document.querySelector(".send_div").style.display = "none";
                                    block_date_dict = [];
                                    sender_ajax.abort();
                                    document.querySelector("#room_id").value = this.getElementsByTagName("input")[1].value;
                                    document.querySelector("#name").value = this.querySelector('.users').textContent;
                                    document.querySelectorAll(".users_full_form").forEach(function(e){ e.classList.remove("active")});
                                    this.classList.add("active");
                                    window.location.hash = document.querySelector("#room_id").value;
                                    room = document.querySelector("#room_id").value;


                                    check_redirect = 0;
                                    load_check = 1;
                                    load_photo_check = 0;
                                    $("#display").empty();
                                    $("#attachment_videos").empty();
                                    $("#attachment_photos").empty();
                                    $("#attachment_files").empty();
                                    $("#attachment_music").empty();
                                    $("#attachment_links").empty();
                                    adapt();
                                    check_new_mes = "";
                                    avatar_attachments = this.firstChild.cloneNode(true);
                                    console.log(avatar_attachments)


                                    avatar_attachments_username = document.createElement("div");
                                    avatar_attachments_username.setAttribute("id", "avatar_attachments_username");

                                    opponent_username_attachment = document.createElement("div");
                                    opponent_username_attachment.textContent = document.querySelector("#name").value;
                                    opponent_username_attachment.setAttribute("id", "avatar_attachments_username")
                                    avatar_attachments_username.appendChild(opponent_username_attachment);

                                    $("#opponent_photo_avatar").empty();
                                    document.querySelector("#opponent_photo_avatar").appendChild(avatar_attachments_username);
                                    document.querySelector("#opponent_photo_avatar").appendChild(avatar_attachments);
                                    if(avatar_attachments.classList.contains("user-info-avatar"))
                                        avatar_attachments.setAttribute("class", "user-info-avatar_attachments");
                                    if(avatar_attachments.classList.contains("avatar_profile")){
                                        avatar_attachments.setAttribute("class", "avatar_profile_attachments");
                                        shadow = document.createElement("div");
                                        shadow.setAttribute("id", "attachment_avatar_shadow");
                                        document.querySelector("#opponent_photo_avatar").appendChild(shadow);
                                    }

                                }
                                else
                                    document.querySelector("#display").scrollTo({
                                        top: document.querySelector("#display").scrollHeight,
                                        behavior: "smooth",
                                    });


                            }

    //                        if(user_contact_id.value == window.location.hash.slice(1)) $(list.getElementsByTagName('form')[chat_counter]).mousedown();


                            if(list.getElementsByTagName('form')[chat_counter] != undefined)




    //                                chatSocket[user_contact_id.value] = new WebSocket(url);

    //                                chatSocket[user_contact_id.value].onclose = function(e){
    //
    //                                        number_of_room = this.url.slice(this.url.indexOf("socket-server")+14, this.url.lastIndexOf("/"));
    ////                                        this = "new WebSocket(this.url)";
    ////                                        let url = `ws://${window.location.host}/socket-server/${number_of_room}/`;
    ////                                        e = new WebSocket(url);
    //
    //
    //                                }




                                    connect_socket(user_contact_id.value);

                            ++chat_counter;
                        }

        }
    }
}



                                  chatSocket_user.onclose = function(e) {
                                    console.log('Socket is closed. Reconnect will be attempted in 0.1 second.', e.reason);
                                    setTimeout(function() {
                                      connect_user();
                                    }, 100);
                                  };

                                  chatSocket_user.onerror = function(err) {
                                    console.error('Socket encountered error: ', err.message, 'Closing socket');
                                    chatSocket_user.close();
                                  };
                                }

                                connect_user();

    },
});


    if(document.querySelector("#room_id").value == 0){
//        document.querySelector("#opponent_title_name").setAttribute('style','display: none');
//        document.querySelector(".send_div").setAttribute('style','display: none');
//        if(window.screen.availWidth <= 576) document.querySelector(".main_chat_window").setAttribute('style','display: none');
    }
    else{
        document.querySelector("#opponent_title_name").setAttribute('style','display: flex');
        document.querySelector(".send_div").setAttribute('style','display: flex');
        if(window.screen.availWidth <= 576){
            document.querySelector(".choose_list").setAttribute('style','display: none');
            document.querySelector(".main_chat_window").setAttribute('style','width: 99vw');
        }
    }

//document.querySelector("#select_chat_to_start").style.opacity = 1;



function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function connect_socket(number_of_room = 0) {
    let url = `ws://${window.location.host}/socket-server/${number_of_room}/`;
    chatSocket[number_of_room] = new WebSocket(url);

  chatSocket[number_of_room].onopen = function() {
  };

  chatSocket[number_of_room].onmessage = function(e) {
    let data = JSON.parse(e.data);
    if(data.type == 'chat_message'){
        if(data.data.value != "") room_list[data.room_id].querySelector(".room_last_message").textContent = txtdecode(data.data.value,"1234");
        if(room == data.room_id){

                messages = data.data;

				var this_date = new Date();
				block_date = document.createElement("div");



//					if (this_date.getMonth() + 1 != response.messages[key].date.slice(5, 7) && (key == 0 || (key > 0 && response.messages[key].date.slice(5, 7) != response.messages[key - 1].date.slice(5, 7)))) {
//						new_month_check = 1;
//						block_month = document.createElement("div");
//						block_month.innerHTML = months[month];
//						block_month.setAttribute("id", "block_date");
//					} else new_month_check = 0;
					let temp = document.createElement('div');
					let all_files = "";
					var check_transfer = 0;
					var mes = '';
					var file_new_name = '';
					mes = messages.value;
					mes_value = messages.value;

                    if(mes != "") mes = txtdecode(mes,"1234");
//					mes = urlify(mes);
//					mes = "<xmp>" + mes + "</xmp>";
					counter_img = 0;
					var user_file = "";
					var user_file_additional = "";
					var xhr = new XMLHttpRequest();


                    files_message = messages.file;
//                    if(messages.file[0] != undefined) console.log(files_message, files_message.length)
					for (var files_key = files_message.length-1; files_key >= 0; --files_key) {

                            lastIndexOf_ = (files_message[files_key].file.lastIndexOf('_') == -1 ? files_message[files_key].file.lastIndexOf('.'):files_message[files_key].file.lastIndexOf('_'))
                            file_name = (files_message[files_key].file.slice(files_message[files_key].file.indexOf('media')+6, lastIndexOf_));
                            // file_new_name = decodeURIComponent(file_name.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
                            file_new_name = "";
                            file_type_from_name = files_message[files_key].file.slice(files_message[files_key].file.lastIndexOf('.'));


//                            file_url = "//" + window.location.host + files_message[files_key].file;
//                            xhr.open('GET', file_url, true);
//                            xhr.responseType = 'blob';
//                            xhr.onload = function(e) {
//                                var blob = this.response;
//                                user_file_additional = window.URL.createObjectURL(blob);
////                                console.log(user_file_additional)
//                            }
//                            xhr.send();



                                if (files_message[files_key].file != "False") {
                                    user_file = "//" + window.location.host + files_message[files_key].file.slice(6);
                                    let attach_file = document.createElement('span');
                                    var file_type = files_message[files_key].file.split('.').pop().toLowerCase();
                                    if (file_type == "jpg" || file_type == "png" || file_type == "jpeg" || file_type == "jpg") {
                                        var img = document.createElement("img");
                                        img.src = user_file;
                                        img.setAttribute('class', 'mes_img lazy');
                                        ++counter_img;

                                        var attachment_photo = img;
                                        attachment_photo = document.createElement("img");
                                        attachment_photo.src = user_file;

                                        user_file_pres = "<img class='mes_img lazy' loading='lazy' src=\"" + user_file + "\">";

                                        attachment_photo.setAttribute('class', 'mes_img attachment_photo lazy');

                                        attach_file.innerHTML = "<img class='attachment_photo mes_img lazy' src=\"" + user_file + "\">";
                                        $("#attachment_photos").prepend(attachment_photo);
                                        all_photos_and_videos.push(user_file);


//                                        if (new_month_check) $("#attachment_photos").prepend(block_month);
                                    }
                                    else if (file_type == "mp3" || file_type == "ogg") {
                                        user_file_pres = document.createElement("div");
                                        user_file_pres.innerHTML = "123123123123";


                                        user_file_pres.setAttribute("onclick", "audio_play(\"" + user_file + "\"");
                                        temp.appendChild(user_file_pres);


//                                        user_file_pres = "<div onclick='audio_play(\"" + user_file + "\" ,\""+ file_new_name + file_type_from_name + "\");'>" + file_new_name + file_type_from_name + "</div><a download=\"" + file_new_name + file_type_from_name + "\" target='_blank' href=\"" + user_file_additional + "\">X</a>";

                                        attach_file.innerHTML = "<audio loading='eager' controls><source type='audio/mpeg' src=\"" + user_file + "\"></audio>";
                                        attachment_music.prepend(attach_file);

                                        if (new_month_check) $("#user_file_pres").prepend(block_month);
                                    }
                                    else if (file_type == "mp4" || file_type == "mov") {
                                        ++counter_img;
                                        user_file_pres = "<video loading='lazy' class='mes_img' controls><source type='video/mp4' src=\"" + user_file + "\"></video>";
                                        attach_file.innerHTML = "<video loading='lazy' class='attachment_photo' controls><source type='video/mp4' src=\"" + user_file + "\"></video>";

                                        var vd = document.createElement("video");
                                        vd.src = user_file;

//                                        vd.onloadeddata  = function(){
//                                            document.querySelector(".room_body").scrollTo({
//                                                top: document.querySelector(".room_body").scrollHeight,
//                                            });
//                                        }

                                        attachment_videos.prepend(attach_file);

                                        all_photos_and_videos.push(user_file);

//                                        if (new_month_check) $("#attachment_videos").prepend(block_month);



                                    }
                                    else {
                                        user_file_pres = "<a id='user_link' download=\"" + file_new_name + "\" target='_blank' href=\"" + user_file + "\">Link to the file</a>";
                                        attach_file.innerHTML = "<a target='_blank' href=\"" + user_file + "\">Link to the file</a>";
                                        attachment_files.prepend(attach_file);
                                        if (new_month_check) $("#attachment_files").prepend(block_month);
                                    }
                                    temp.innerHTML = "<span>" + user_file_pres + "</span>" + temp.innerHTML;
                                    all_files += user_file_pres;


                                }

					}

                        if(messages.user == document.querySelector("#username_id").value)
                            if(messages.viewed == true)
                                viewed = "<img id='viewed_check' src=\"//" + window.location.host + "/static/Images/dialogs_received@3x.png\">";
                            else
                                viewed = "<img id='viewed_check' src=\"//" + window.location.host + "/static/Images/dialogs_sent@3x.png\">";
                        else viewed = "";

                            liked = document.createElement("image");
                            liked.src = window.location.host + "/static/Images/like_emoji.png";

                            if(messages.liked == false) liked = "<img id='liked_check'  loading='lazy' src=\"//" + window.location.host + "/static/Images/like_emoji.png\"><img id='stellar_particles' loading='lazy' src=\"//" + window.location.host + "/static/Images/stellar_particles.gif\">";
                            if(messages.liked == true) liked = "<img id='liked_check'  loading='lazy' width='30px' style='display: unset' src=\"//" + window.location.host + "/static/Images/like_emoji.png\"><img id='stellar_particles' loading='lazy' src=\"//" + window.location.host + "/static/Images/stellar_particles.gif\">";


                            temp.setAttribute("class",  'message_div');
                            temp.setAttribute("value", messages.id);
                            if (messages.user != document.querySelector("#username_id").value) {

                                temp.innerHTML += "<div class='message'><span>" + mes + "</span><span id='viewed_span'>" + viewed + "</span><span class='time-left'>" + messages.date.slice(11, 16) + "</span><span id='reaction_span'>" + liked + "</span></div>";
                            }
                            else{
                                temp.innerHTML += "<div class='message darker'><span>" + mes + "</span><span id='viewed_span'>" + viewed + "</span><span class='time-left'>" + messages.date.slice(11, 16) + "</span><span id='reaction_span'>" + liked + "</span></div>";
                            }
                            if(mes == '' && temp.querySelector('.mes_img') != null){
                                temp.querySelector('.message').setAttribute("style", "position: absolute; padding: 0; bottom: 5px; right: 0px; background: rgba(20,20,20, 0.7); border-radius: 30px; padding: 3px; opacity: 0; transition: opacity 0.2s;")
                                temp.querySelector('.time-left').setAttribute("style", "color: white; font-size: 14px; margin: 0;");
                                temp.querySelector('#reaction_span').setAttribute("style", "margin: 0 5px 0 0;");
                                temp.querySelector('#viewed_span').setAttribute("style", "margin: 0 0 0 5px;");

                                temp.onmouseover = function(){
                                    temp.querySelector('.message').style.opacity = "1";
                                }
                                temp.onmouseout = function(){
                                    temp.querySelector('.message').style.opacity = "0";
                                }

                            }



//                            var files_num = -1;
//                            for (var files_key in files_message) {
//                                    var file_type = files_message[files_key].file.split('.').pop();
//                                    if (user_file != "" && (file_type == "jpg" || file_type == "png" || file_type == "jpeg" || file_type == "jpg" || file_type == "mp4" || file_type == "mov")) {
//                                        ++files_num;
//                                        var modal = document.getElementById('myModal');
//                                        img_comment = document.getElementById('img_comment');
//                                        var modalImg = document.getElementById("img01");
//                                        var captionText = document.getElementById("caption");
//                                        temp.getElementsByClassName('mes_img')[files_num].onmousedown = attachment_photo.onclick = function() {
//                                            modal.style.display = "block";
//                                            modalImg.src = this.src;
//                                            document.querySelector("#media_display").style.display = "block";
////                                            console.log(temp.querySelector(".message").getElementsByTagName("span")[0].textContent)
//                                            if (temp.querySelector(".message").getElementsByTagName("span")[0].textContent == undefined)
//                                                captionText.innerHTML = "";
//                                            else
//                                                captionText.innerHTML = temp.querySelector(".message").getElementsByTagName("span")[0].textContent;
//                                        }
//
//                                    }
//                            }

                            temp.querySelector('.message').setAttribute("value", messages.user);
                            setTimeout(function(){temp.querySelector('.message').classList.add('active');}, 0);




                            temp_full = document.createElement("div");
                            temp_full.setAttribute("class", "temp_full");

                            let vw = window.innerWidth;
                            if(vw <= 768){
                                temp_full.style.direction = "rtl";
                                if (messages.user != document.querySelector("#username_id").value){
                                    temp_full.style.direction = "ltr";
                                }
                            }


                            temp_full.appendChild(temp);
//                            console.log(all_photos_and_videos)


                            if(counter_img % 2 != 0 && counter_img > 2)
                                temp.querySelector(".mes_img").style.width = "432px";
                            if(counter_img % 2 != 0 && counter_img > 2 && window.innerWidth <= 768)
                                temp.querySelector(".mes_img").style.width = "90vw";

                            if(load_check)
                                $("#display").prepend(temp_full);
                            else
                                $("#display").append(temp_full);

                            all_messages_dives.push(temp_full);
//                            console.log(all_messages_dives);


                            temp_full.addEventListener("contextmenu", e => {
                                var tooltip = document.getElementById("myTooltip");
                                var selectionText = getSelectionText();
                                if(selectionText.length > 10) selectionText = selectionText.slice(0,10);
                                tooltip.innerHTML = "Copied: " + selectionText + "...";
                                e.preventDefault();
                                let x = e.pageX, y = e.pageY,
                                winWidth = window.innerWidth,
                                winHeight = window.innerHeight,
                                cmWidth = contextMenu.offsetWidth,
                                cmHeight = contextMenu.offsetHeight;

                                contextMenu.style.left = `${x}px`;
                                contextMenu.style.top = `${y}px`;
                                contextMenu.style.display = "unset";


                                window.addEventListener("mousemove", (e) => {
                                    if(e.clientY - contextMenu.offsetTop - contextMenu.offsetHeight > 50
                                    || e.clientY - contextMenu.offsetTop < -50
                                    || e.clientX - contextMenu.offsetLeft - contextMenu.offsetWidth > 50
                                    || e.clientX - contextMenu.offsetLeft < -50)
                                        contextMenu.style.display = "none";
                                })
                            });

function check_viewed(){
    chatSocket[room].send(JSON.stringify({
        'message_id': [temp.getAttribute('value')],
        'type': "message_viewed",
        'room_id': room,
        'contacts_id': document.querySelector("#username_id").value,
    }));

    temp_full.removeEventListener("mouseover", check_viewed);

}

                        if(messages.user != document.querySelector("#username_id").value){
                            if(!messages.viewed.includes(parseInt(document.querySelector("#username_id").value))){
                                unread_messages.add(temp_full);
                                temp_full.addEventListener("mouseover", check_viewed);
                            }
                        }

/*                            temp_full.onmousedown = function(){
                                all_messages_dives[20].scrollIntoView({
                                    behavior: "smooth",
                                    block: "end",
                                    inline: "nearest",
                                })
                                all_messages_dives[20].classList.add("active");
                                setTimeout(function(){all_messages_dives[20].classList.remove("active");},500);
                            }*/

                            if(counter_img % 2 != 0)
                                temp.querySelector(".mes_img").style.width = "432px";
                            if(counter_img % 2 != 0 && window.innerWidth <= 768)
                                temp.querySelector(".mes_img").style.width = "100vw";


                            all_messages[temp.getAttribute('value')] = temp_full;
                            temp.ondblclick = function(){
                                chatSocket[room].send(JSON.stringify({
                                    'message_id': temp.getAttribute('value'),
                                    'type': "message_reaction",
                                    'room_id': room,
                                }));
/*                                $.ajax({
                                    cache: false,
                                    type: 'POST',
                                    url: '/message_reaction',
                                    data: { csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(), reaction: "heart", message_id: temp.getAttribute('value')},
                                });*/
                            }

                            temp.setAttribute("id", "last_message");

//                            if (key == 0 || (key > 0 && messages.date.slice(0, 10) != response.messages.date.slice(0, 10))) {
//                                month = response.messages[key].date.slice(5, 7) - 1;
//                                block_date.setAttribute("id", "block_date");
//                                block_date.innerHTML = (months[month] + ' ' + (response.messages[key].date.slice(8, 10) - 0));
//                                $("#display").prepend(block_date);
//                                block_date_dict.push(block_date);
//                            }



                            if(document.querySelector("#block_date") != null) document.querySelector("#block_date").onclick = function(){
                                document.querySelector(".calendar_div").style.display = "block";
                                document.querySelector('#myModal').style.display = "block";
                            };





                            if(auto_scroll){
                                document.querySelector(".room_body").scrollTo({
                                    top: document.querySelector(".room_body").scrollHeight,
                                    behavior: "smooth",
                                });
                            }



				    document.querySelector(".scroll_down").addEventListener("click", function(event){
				        event.preventDefault();
				        auto_scroll = true;
                        document.querySelector(".room_body").scrollTo({
                            behavior: "smooth",
                            top: document.querySelector(".room_body").scrollHeight,
                        });
				    })


                                        }
                                    }
                                    if(data.type == 'message_reaction'){
                                        mes_reaction(data.message_id);
                                    }
                                    if(data.type == 'message_viewed'){
                                        mes_viewed(data.message_id);
                                    }


                                  };

                                  chatSocket[number_of_room].onclose = function(e) {
                                    number_of_room = this.url.slice(this.url.indexOf("socket-server")+14, this.url.lastIndexOf("/"))
                                    setTimeout(function() {
                                      connect_socket(number_of_room);
                                    }, 100);
                                  };

                                  chatSocket[number_of_room].onerror = function(err) {
                                    chatSocket[number_of_room].close();
                                  };
                                }


$(document).ready(getContacts);

        function getContacts(){
            $.ajax({
                type: 'GET',
                url: "/getContacts/",
                success: function(response){
                    getContacts_response(response);
                },
            });
        }


function getContacts_response(response) {
                    var contacts_counter = 0;
                    my_user = response.my_user;
                    for(contact in response.all_chats){
                        if(response.all_chats[contact].users[0].id == my_user)
                            contact_user = response.all_chats[contact].users[1];
                        else
                            contact_user = response.all_chats[contact].users[0];

                            var users_list = document.createElement("div");
                            var user_contact_id = document.createElement("input");
                            var user_contact_name = document.createElement("div");

                            if(contact_user.image != null){
                                var avatar = document.createElement("img");
                                avatar.setAttribute('class', 'avatar_profile');
                            }
                            else{
                                var avatar = document.createElement("div");
                                avatar.setAttribute('class', 'user-info-avatar');
                            }

                            if(contact_user.image != null)
                                avatar.src = "//" + window.location.host + contact_user.image.slice(6);
                            else{
                                var name = contact_user.username;
                                var letter = (name.substr(0, 1)).toUpperCase();
                                avatar.innerHTML = letter;
                                if(name.indexOf(' ') != -1){
                                    var letter_2 = (name.substr(name.indexOf(' ')+1, 1)).toUpperCase();
                                    avatar.innerHTML += letter_2;
                                }

                                var backgroundColor = stringToColor(name);
                                avatar.style.backgroundColor = backgroundColor;
                                avatar.setAttribute('style', 'background: linear-gradient(0deg, ' + pSBC(-0.6, backgroundColor) + ' 0%, ' + pSBC(-0.4, backgroundColor) + ' 35%, ' + backgroundColor + ' 100%);');

                            }


                            user_contact_id.value = contact_user.id;
                            user_contact_id.setAttribute('type', 'hidden');
                            user_contact_id.setAttribute('name', 'users');
                            user_contact_id.setAttribute('style', 'display: none');

                            users_list.setAttribute('method', 'POST');
                            users_list.setAttribute('action', 'checkview_users');
                            users_list.setAttribute('class', 'users_full_form');
                            users_list.setAttribute('name', 'form-submit-users')

                            user_contact_name.innerHTML = contact_user.username;
                            user_contact_name.setAttribute('class', 'users');

                            users_list.appendChild(avatar);
                            users_list.appendChild(user_contact_id);
                            users_list.appendChild(user_contact_name);


                            create_new_group_choose = document.createElement("div");
                            create_new_group_choose.setAttribute("class", "create_new_group_choose");
                            create_new_group_choose_check = document.createElement("input");
                            create_new_group_choose_check.type = "checkbox";
                            create_new_group_choose.appendChild(create_new_group_choose_check);


                            users_list.prepend(create_new_group_choose);
                            document.querySelector(".all_my_contacts").append(users_list);
                            list_create_group = document.querySelector('.all_my_contacts');








                        users_list.onclick = function(event) {
                            this.querySelector(".create_new_group_choose").getElementsByTagName("input")[0].checked = true;
//                            event.preventDefault();
//                            if(room != this.getElementsByTagName("input")[1].value){
//
//                                sender_ajax.abort();
//                                document.querySelector("#room_id").value = this.getElementsByTagName("input")[1].value;
//                                document.querySelector("#name").value = this.querySelector('.users').textContent;
//                                document.querySelectorAll(".users_full_form").forEach(function(e){ e.classList.remove("active")});
//                                this.classList.add("active");
//                                window.location.hash = document.querySelector("#room_id").value;
//                                room = document.querySelector("#room_id").value;
//                                if(typeof chatSocket_current != "undefined"){
//                                    chatSocket_current.close();
//                                }
//                                let url = `ws://${window.location.host}/socket-server/${room}/`;
//                                chatSocket_current = new WebSocket(url);
//
//
//                                chatSocket_current.onmessage = function(e){
//                                    let data = JSON.parse(e.data)
//                                    if(data.type == 'chat_message'){
//                                        sender();
//                                        console.log(data);
//                                        room_list[data.room_id].querySelector(".room_last_message").textContent = txtdecode(data.message_text,"1234");
//                                    }
////                                    if(data.type == 'message_viewed'){
////                                        mes_viewed(data.message_id);
////                                    }
////                                    if(data.type == 'message_reaction'){
////                                        mes_reaction(data.message_id);
////                                    }
//                                }
//
//
//                                check_redirect = 0;
//                                load_check = 1;
//                                load_photo_check = 0;
//                                $("#display").empty();
//                                $("#attachment_videos").empty();
//                                $("#attachment_photos").empty();
//                                $("#attachment_files").empty();
//                                $("#attachment_music").empty();
//                                $("#attachment_links").empty();
//                                sender();
//                                adapt();
//                                check_new_mes = "";
//                            }


                        }



                            ++contacts_counter;
                    }

                }

/*window.onbeforeunload = function(){

}*/


        function getUsers(substring){
            chatSocket_user.send(JSON.stringify({
                'type': "search_users",
                'search_substring': substring,
            }));
        }

        room_list = [];
        $(document).ready(getRooms);
        function getRooms(){
            $.ajax({
                type: 'GET',
                url: "/getChats/",
                success: function(response) {
                    $(".users_search").empty();
                    var chat_counter = 0;
                    chat = response.all_chats;
                    console.log(response)
                    for(item in chat){

                        var users_list = document.createElement("form");
                        var avatar = document.createElement("div");
                        avatar.setAttribute('class', 'user-info-avatar');
                        var opponent_ind = 0;


                        if(chat[item].room_type == 'G' || chat[item].room_type == 'C'){
                            if(chat[item].image != null){
                                avatar = document.createElement("img");
                                avatar.src = "//" + window.location.host + "/media/" + chat[item].image.slice(12);
                                avatar.setAttribute('class', 'avatar_profile');
                            }
                            opponent = chat[item].name;
                        }


                        if(chat[item].room_type == 'D'){
                            if(chat[item].users[0].id == response.my_user)
                                opponent_ind = 1
                            else
                                opponent_ind = 0

                            opponent = chat[item].users[opponent_ind].username;


                            if(chat[item].users[opponent_ind].image != null){
                                avatar = document.createElement("img");
                                avatar.src = "//" + window.location.host + "/media/" + chat[item].users[opponent_ind].image.slice(12);
                                avatar.setAttribute('class', 'avatar_profile');
                            }

                        }

                        var user_contact_id = document.createElement("input");
                        var user_contact_name = document.createElement("div");

                        var last_message = document.createElement("div");
                        var username_and_last_message = document.createElement("div");
                        var csrf =document.createElement('input');
                        var csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
                        var unread_counter = document.createElement("div");






//                        unread_messages_counter = 0;
//                        for(viewed in response.all_chats[item].room){
//                            if(!response.all_chats[item].room[viewed].viewed.includes(response.my_user) && response.all_chats[item].room[viewed].user != response.my_user)
//                                ++unread_messages_counter;
//                        }








//                        for(all_messages_list = response.messages.length-1; all_messages_list >= 0; --all_messages_list){
//                            if(response.messages[all_messages_list].room == response.all_chats[item].id){
//                                if(response.messages[all_messages_list].value != "") last_message.innerHTML = txtdecode(response.messages[all_messages_list].value, "1234");
//                                break;
//                            }
//                        }

                        last_message.setAttribute("class", "room_last_message");






                        csrf.setAttribute('type','hidden');
                        csrf.setAttribute('name','csrfmiddlewaretoken');
                        csrf.setAttribute("value", csrfToken);
                        csrf.setAttribute('style', 'display: none');


                        if(chat[item].users[opponent_ind].image == null && chat[item].image == null){
                            if(chat[item].room_type == "D")
                                name = chat[item].users[opponent_ind].username;
                            if(chat[item].room_type == "G" || chat[item].room_type == "C")
                                name = chat[item].name;

                            if(name != null)
                                var letter = (name.substr(0, 1)).toUpperCase();
                            else
                                var letter = "";
                            avatar.innerHTML = letter;

                            if(name.lastIndexOf(' ') != -1){
                                var letter_2 = (name.substr(name.lastIndexOf(' ')+1, 1)).toUpperCase();
                                avatar.innerHTML += letter_2;
                            }

                            var backgroundColor = stringToColor(name);
                            avatar.style.backgroundColor = backgroundColor;
                            avatar.setAttribute('style', 'background: linear-gradient(0deg, ' + pSBC(-0.6, backgroundColor) + ' 0%, ' + pSBC(-0.4, backgroundColor) + ' 35%, ' + backgroundColor + ' 100%);');

                        }


                        user_contact_id.value = chat[item].id;
                        user_contact_id.setAttribute('type', 'hidden');
                        user_contact_id.setAttribute('name', 'chats');
                        user_contact_id.setAttribute('style', 'display: none');


                        users_list.setAttribute('method', 'POST');
                        users_list.setAttribute('class', 'users_full_form');
                        users_list.setAttribute('name', 'form-submit-users');


                        user_contact_name.textContent = opponent;
                        user_contact_name.setAttribute('class', 'users');


                        username_and_last_message.appendChild(user_contact_name);
                        username_and_last_message.appendChild(last_message);


//                        unread_counter.textContent = unread_messages_counter;
//                        unread_counter.setAttribute("class", "rooms_list_unread_counter");


                        users_list.appendChild(avatar);
                        users_list.appendChild(csrf);
                        users_list.appendChild(user_contact_id);
                        users_list.appendChild(username_and_last_message);
//                        users_list.appendChild(unread_counter);
                        document.querySelector(".users_search").append(users_list);



                        room_list[user_contact_id.value] = users_list;
                        list = document.querySelector('.users_search');









                        users_list.onmousedown = function(event) {
                            event.preventDefault();
                            if(room != this.getElementsByTagName("input")[1].value){
//                                document.querySelector("#select_chat_to_start").style.display = "none";
                                block_date_dict = [];
                                sender_ajax.abort();
                                document.querySelector("#room_id").value = this.getElementsByTagName("input")[1].value;
                                document.querySelector("#name").value = this.querySelector('.users').textContent;
                                document.querySelectorAll(".users_full_form").forEach(function(e){ e.classList.remove("active")});
                                this.classList.add("active");
                                window.location.hash = document.querySelector("#room_id").value;
                                room = document.querySelector("#room_id").value;


                                check_redirect = 0;
                                load_check = 1;
                                load_photo_check = 0;
                                $("#display").empty();
                                $("#attachment_videos").empty();
                                $("#attachment_photos").empty();
                                $("#attachment_files").empty();
                                $("#attachment_music").empty();
                                $("#attachment_links").empty();
                                sender();
                                adapt();
                                check_new_mes = "";
                                avatar_attachments = this.firstChild.cloneNode(true);
                                console.log(avatar_attachments)


                                avatar_attachments_username = document.createElement("div");
                                avatar_attachments_username.setAttribute("id", "avatar_attachments_username");

                                opponent_username_attachment = document.createElement("div");
                                opponent_username_attachment.textContent = document.querySelector("#name").value;
                                opponent_username_attachment.setAttribute("id", "avatar_attachments_username")
                                avatar_attachments_username.appendChild(opponent_username_attachment);

                                $("#opponent_photo_avatar").empty();
                                document.querySelector("#opponent_photo_avatar").appendChild(avatar_attachments_username);
                                document.querySelector("#opponent_photo_avatar").appendChild(avatar_attachments);
                                if(avatar_attachments.classList.contains("user-info-avatar"))
                                    avatar_attachments.setAttribute("class", "user-info-avatar_attachments");
                                if(avatar_attachments.classList.contains("avatar_profile")){
                                    avatar_attachments.setAttribute("class", "avatar_profile_attachments");
                                    shadow = document.createElement("div");
                                    shadow.setAttribute("id", "attachment_avatar_shadow");
                                    document.querySelector("#opponent_photo_avatar").appendChild(shadow);
                                }

                            }
                            else
                                document.querySelector("#display").scrollTo({
                                    top: document.querySelector("#display").scrollHeight,
                                    behavior: "smooth",
                                });


                        }

                        if(user_contact_id.value == window.location.hash.slice(1)) $(list.getElementsByTagName('form')[chat_counter]).mousedown();


                        if(list.getElementsByTagName('form')[chat_counter] != undefined)




//                                chatSocket[user_contact_id.value] = new WebSocket(url);

//                                chatSocket[user_contact_id.value].onclose = function(e){
//
//                                        number_of_room = this.url.slice(this.url.indexOf("socket-server")+14, this.url.lastIndexOf("/"));
////                                        this = "new WebSocket(this.url)";
////                                        let url = `ws://${window.location.host}/socket-server/${number_of_room}/`;
////                                        e = new WebSocket(url);
//
//
//                                }




                                connect_socket(user_contact_id.value);

                        ++chat_counter;
                    }

                },
            });
        }


    window.onhashchange = function(e){
        if(window.location.hash.slice(1) != "0"){
            $(room_list[window.location.hash.slice(1)]).mousedown();
        }
    }









    check_new_mes = "";


/*	setInterval(function check_mes_update(){
		$.ajax({
			type: 'GET',
			url: "/getMessages/" + window.location.hash.slice(1),
			success: function(response) {
				if(response.messages[response.messages.length-1].id != check_new_mes){
				    sender();
				    check_new_mes = response.messages[response.messages.length-1].id;
                }
			},
		});
	}, 1000);*/




function mes_viewed(mes_viewed_id){
    for(counter = 0; counter < mes_viewed_id.length; ++counter){
        if(document.querySelector("#username_id").value == all_messages[mes_viewed_id[counter]].querySelector('.message').getAttribute("value")){
            all_messages[mes_viewed_id[counter]].querySelector('#viewed_check').src = "//" + window.location.host + "/static/Images/dialogs_received@3x.png";
            unread_messages.delete(all_messages[mes_viewed_id[counter]]);
        }
    }
}





function mes_reaction(mes_react_id){
    if(all_messages[mes_react_id].querySelector('#liked_check').style.display == ''){
        console.log(all_messages[mes_react_id].querySelector('#liked_check'))
        all_messages[mes_react_id].querySelector('#liked_check').style.display = 'unset';
        all_messages[mes_react_id].querySelector('#stellar_particles').style.display = 'unset';
        setTimeout(function(){ all_messages[mes_react_id].querySelector('#stellar_particles').style.display = 'none';}, 1500);
    }
    else{
        all_messages[mes_react_id].querySelector('#liked_check').style.display = '';
        all_messages[mes_react_id].querySelector('#stellar_particles').style.display = '';
    }
}





check_mes_update = 0;
check_mes_update_file = 0;





const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


function sender() {
    ajax_url_sender = "/GetMessages/" + room + "/";

    sender_ajax = $.ajax({
        type: 'GET',
        url: ajax_url_sender,
        success: function (response) {
            message_initialization(response);
        },
    });
}



//document.querySelector(".main_chat_window").appendChild(document.querySelector("#select_chat_to_start"));


messages_response = null;
scroll_more = 0;

function message_initialization(response){
            document.querySelector("#opponent_title_name").style.display = "flex";
            document.querySelector(".send_div").style.display = "flex";
			all_messages_dives = [];
            console.log(response);
            last_read = null;

            messages_response = response;
            messages = response.messages;


				var this_date = new Date();
                files_counter = -1;
                audio_array_index = 0;
				check_mes_update = messages.length - scroll_more;
//				check_mes_update_file = files_message.length;
				mes_amount = check_mes_update;


				if (mes_amount - scroll_more < 25){
				    mes_amount = 25;
				    scroll_more = 0;
				}

				console.log(check_mes_update - 1, mes_amount - 25)

//				for (var key = check_mes_update - 1; key >= mes_amount - 25; --key) {
                for (var key = messages.length - 1; key >= 0; --key) {
                    block_date = document.createElement("div");

					if (this_date.getMonth() + 1 != response.messages[key].date.slice(5, 7) && (key == 0 || (key > 0 && response.messages[key].date.slice(5, 7) != response.messages[key - 1].date.slice(5, 7)))) {
						new_month_check = 1;
						block_month = document.createElement("div");
						block_month.innerHTML = months[month];
						block_month.setAttribute("id", "block_date");
					}
					else new_month_check = 0;
					let temp = document.createElement('div');
					let all_files = "";
					var len = response.messages[key].value.length;
					var check_transfer = 0;
					var mes = '';
					var file_new_name = '';
					mes = response.messages[key].value;
					mes_value = response.messages[key].value;

                    if(mes != "") mes = txtdecode(mes,"1234");
//					mes = urlify(mes);
//					mes = "<xmp>" + mes + "</xmp>";
					counter_img = 0;
					var user_file = "";
					var user_file_additional = "";
					var xhr = new XMLHttpRequest();


                    files_message = messages[key].file;
//                    if(messages[key].file[0] != undefined) console.log(files_message, files_message.length)
					for (var files_key = files_message.length-1; files_key >= 0; --files_key) {

                            lastIndexOf_ = (files_message[files_key].file.lastIndexOf('_') == -1 ? files_message[files_key].file.lastIndexOf('.'):files_message[files_key].file.lastIndexOf('_'))
                            file_name = (files_message[files_key].file.slice(files_message[files_key].file.indexOf('media')+12, lastIndexOf_));
                            file_new_name = decodeURIComponent(file_name.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
                            file_type_from_name = files_message[files_key].file.slice(files_message[files_key].file.lastIndexOf('.'));






                                if (files_message[files_key].file != "False") {
                                    user_file = "//" + window.location.host + files_message[files_key].file.slice(6);


                                    user_file_pres = document.createElement("div");
                                    let attach_file = document.createElement('span');
                                    var file_type = files_message[files_key].file.split('.').pop().toLowerCase();

                                    if (file_type == "jpg" || file_type == "png" || file_type == "jpeg") {
                                        ++files_counter;
                                        (async () => {
                                            const files_cnt = files_counter;
                                            var img = document.createElement("img");
                                            img.setAttribute('class', 'mes_img lazy');
                                            img.setAttribute("loading", "lazy");
                                            user_file_pres = img;

                                            attachment_photo = document.createElement("img");
                                            attachment_photo.setAttribute('class', 'mes_img attachment_photo lazy');
                                            $("#attachment_photos").append(attachment_photo);

                                            const z = await fetch(user_file, {
                                                method: 'get',
                                                signal: signal,
                                            })
                                            .catch(function(err) {
                                                console.error(` Err: ${err}`);
                                            });
                                            const url = URL.createObjectURL(await z.blob());
                                            if(document.querySelector("#display").querySelectorAll(".mes_img")[document.querySelector("#display").querySelectorAll(".mes_img").length-files_cnt-1] != undefined){
                                                document.querySelector("#display").querySelectorAll(".mes_img")[document.querySelector("#display").querySelectorAll(".mes_img").length-files_cnt-1].src = url;
                                                document.querySelector("#attachment_photos").querySelectorAll(".attachment_photo")[files_cnt].src = url;


                                                var modal = document.getElementById('myModal');
                                                img_comment = document.getElementById('img_comment');
                                                var modalImg = document.getElementById("img01");
                                                var captionText = document.getElementById("caption");
                                                document.querySelector("#attachment_photos").querySelectorAll(".attachment_photo")[document.querySelector("#attachment_photos").querySelectorAll(".attachment_photo").length-files_cnt-1].onmousedown = document.querySelector("#display").querySelectorAll(".mes_img")[document.querySelector("#display").querySelectorAll(".mes_img").length-files_cnt-1].onmousedown = function() {
                                                    modal.style.display = "block";
                                                    modalImg.src = this.src;
                                                    document.querySelector("#media_display").style.display = "block";
                                                    if (temp.querySelector(".message").getElementsByTagName("span")[0].textContent == undefined)
                                                        captionText.innerHTML = "";
                                                    else
                                                        captionText.innerHTML = temp.querySelector(".message").getElementsByTagName("span")[0].textContent;
                                                }

                                            }

                                        })()

                                        ++counter_img;


                                        all_photos_and_videos.push(user_file);


                                        if (new_month_check) $("#attachment_photos").prepend(block_month);
                                    }
                                    else if (file_type == "mp3" || file_type == "ogg" || file_type == "wav") {


                                        user_file_pres.innerHTML = file_new_name;

                                        audio_files.push(user_file);
                                        audio_array_index = audio_files.length-1;

                                        user_file_pres.setAttribute("onclick", "audio_play(\"" + audio_array_index + "\" ,\""+ file_new_name + file_type_from_name + "\");");

                                        user_file_pres.setAttribute("class", "audio_message_div");


//                                        user_file_pres = "<div onclick='audio_play(\"" + user_file + "\" ,\""+ file_new_name + file_type_from_name + "\");'>" + file_new_name + file_type_from_name + "</div><a download=\"" + file_new_name + file_type_from_name + "\" target='_blank' href=\"" + user_file_additional + "\">X</a>";

//                                        attach_file.innerHTML = "<audio loading='eager' controls><source type='audio/mpeg' src=\"" + user_file + "\"></audio>";
                                        attachment_music.prepend(attach_file);

                                        if (new_month_check) $("#user_file_pres").prepend(block_month);
                                    }
                                    else if (file_type == "mp4" || file_type == "mov" || file_type == "MOV") {
                                        ++counter_img;
//                                        user_file_pres = "<video loading='lazy' class='mes_img' controls><source type='video/mp4' src=\"" + user_file + "\"></video>";

                                        var vd = document.createElement("video");
                                        vd.setAttribute("controls", "");
                                        vd.setAttribute("class", "mes_img");
                                        sr = document.createElement("source");
                                        sr.setAttribute("type", "video/mp4");
                                        sr.src = user_file;
                                        vd.appendChild(sr);
                                        user_file_pres.appendChild(vd);
                                        attach_file.innerHTML = "<video loading='lazy' class='attachment_photo' controls><source type='video/mp4' src=\"" + user_file + "\"></video>";



//                                        vd.onloadeddata  = function(){
//                                            document.querySelector(".room_body").scrollTo({
//                                                top: document.querySelector(".room_body").scrollHeight,
//                                            });
//                                        }

                                        attachment_videos.prepend(attach_file);

                                        all_photos_and_videos.push(user_file);

                                        if (new_month_check) $("#attachment_videos").prepend(block_month);



                                    }
                                    else {
//                                        user_file_pres = "<a id='user_link' download=\"" + file_new_name + "\" target='_blank' href=\"" + user_file + "\">Link to the file</a>";
                                        attach_file.innerHTML = "<a target='_blank' href=\"" + user_file + "\">Link to the file</a>";
                                        attachment_files.prepend(attach_file);
                                        if (new_month_check) $("#attachment_files").prepend(block_month);
                                    }

                                    user_file_pres_span = document.createElement("span");
                                    user_file_pres_span.appendChild(user_file_pres);
                                    temp.insertAdjacentElement("afterbegin", user_file_pres_span);
                                    all_files += user_file_pres;

                                }

					}

                        viewed = document.createElement("img");
                        viewed.setAttribute("id", "viewed_check");
                        if(response.messages[key].user == document.querySelector("#username_id").value){
                            if(response.messages[key].viewed.length){
                                viewed.src = "//" + window.location.host + "/static/Images/dialogs_received@3x.png";
                            }
                            else
                                viewed.src = "//" + window.location.host + "/static/Images/dialogs_sent@3x.png";
                        }
                        else
                            viewed.style.display = "none";


                            liked_div = document.createElement("div");

                            liked = document.createElement("img");
                            liked.src = "//" + window.location.host + "/static/Images/like_emoji.png";
                            liked.setAttribute("id", "liked_check");


                            stellar_particles = document.createElement("img");
                            stellar_particles.setAttribute("id", "stellar_particles");
                            stellar_particles.src = "//" + window.location.host + "/static/Images/stellar_particles.gif";

                            if(response.messages[key].liked == true) liked.style.display = "unset";


                            temp.setAttribute("class",  'message_div');
                            temp.setAttribute("value", response.messages[key].id);

                            liked_div.appendChild(liked);
                            liked_div.appendChild(stellar_particles);

                            message_div_temp = document.createElement("div");
                            message_div_temp.classList.add("message");

                            mes_span = document.createElement("span");
                            mes_span.textContent = mes;

                            viewed_span = document.createElement("span");
                            viewed_span.setAttribute("id", "viewed_span");
                            viewed_span.appendChild(viewed);


                            time_left = document.createElement("span");
                            time_left.classList.add("time-left");
                            time_left.textContent = response.messages[key].date.slice(11, 16);


                            reaction_span = document.createElement("span");
                            reaction_span.setAttribute("id", "reaction_span");
                            reaction_span.appendChild(liked_div);

                            message_div_temp.appendChild(mes_span);
                            message_div_temp.appendChild(viewed_span);
                            message_div_temp.appendChild(time_left);
                            message_div_temp.appendChild(reaction_span);

                            temp.appendChild(message_div_temp);

                            if (response.messages[key].user != document.querySelector("#username_id").value) {
                            }
                            else{
                                message_div_temp.classList.add("darker");
                            }
                            if(mes == '' && temp.querySelector('.mes_img') != null){
                                temp.querySelector('.message').setAttribute("style", "position: absolute; padding: 0; bottom: 5px; right: 0px; background: rgba(20,20,20, 0.7); border-radius: 30px; padding: 3px; opacity: 0; transition: opacity 0.2s;")
                                temp.querySelector('.time-left').setAttribute("style", "color: white; font-size: 14px; margin: 0;");
                                temp.querySelector('#reaction_span').setAttribute("style", "margin: 0 5px 0 0;");
                                temp.querySelector('#viewed_span').setAttribute("style", "margin: 0 0 0 5px;");

                                temp.onmouseover = function(){
                                    temp.querySelector('.message').style.opacity = "1";
                                }
                                temp.onmouseout = function(){
                                    temp.querySelector('.message').style.opacity = "0";
                                }

                            }



                            var files_num = -1;
                            for (var files_key in files_message) {
                                if (files_message[files_key].mes_id == response.messages[key].id) {
                                    var file_type = files_message[files_key].file.split('.').pop().toLowerCase();
                                    if (user_file != "" && (file_type == "jpg" || file_type == "png" || file_type == "jpeg" || file_type == "jpg" || file_type == "mp4" || file_type == "mov")) {
                                        ++files_num;
                                        var modal = document.getElementById('myModal');
                                        img_comment = document.getElementById('img_comment');
                                        var modalImg = document.getElementById("img01");
                                        var captionText = document.getElementById("caption");
                                        temp.getElementsByClassName('mes_img')[files_num].onmousedown = attachment_photo.onmousedown = function() {
                                            modal.style.display = "block";
                                            modalImg.src = this.src;
                                            document.querySelector("#media_display").style.display = "block";
//                                            console.log(temp.querySelector(".message").getElementsByTagName("span")[0].textContent)
                                            if (temp.querySelector(".message").getElementsByTagName("span")[0].textContent == undefined)
                                                captionText.innerHTML = "";
                                            else
                                                captionText.innerHTML = temp.querySelector(".message").getElementsByTagName("span")[0].textContent;
                                        }

                                    }
                                }
                            }

                            temp.querySelector('.message').setAttribute("value", response.messages[key].user);
                            setTimeout(function(){temp.querySelector('.message').classList.add('active');}, 0);




                            temp_full = document.createElement("div");
                            temp_full.setAttribute("class", "temp_full");

                            let vw = window.innerWidth;
                            if(vw <= 768){
                                if (response.messages[key].user != document.querySelector("#username_id").value){
                                    temp_full.style.direction = "ltr";
                                }
                                else
                                    temp_full.style.direction = "rtl";
                            }


                            temp_full.appendChild(temp);

                            if(counter_img % 2 != 0)
                                temp.querySelector(".mes_img").style.width = "432px";
                            if(counter_img % 2 != 0 && window.innerWidth <= 768)
                                temp.querySelector(".mes_img").style.width = "90vw";


                            $("#display").prepend(temp_full);


                            all_messages_dives.push(temp_full);



                            temp_full.addEventListener("contextmenu", e => {
                                var tooltip = document.getElementById("myTooltip");
                                var selectionText = getSelectionText();
                                if(selectionText.length > 10) selectionText = selectionText.slice(0,10);
                                tooltip.innerHTML = "Copied: " + selectionText + "...";
                                e.preventDefault();
                                let x = e.pageX, y = e.pageY,
                                winWidth = window.innerWidth,
                                winHeight = window.innerHeight,
                                cmWidth = contextMenu.offsetWidth,
                                cmHeight = contextMenu.offsetHeight;

                                contextMenu.style.left = `${x}px`;
                                contextMenu.style.top = `${y}px`;
                                contextMenu.style.display = "unset";


                                window.addEventListener("mousemove", (e) => {
                                    if(e.clientY - contextMenu.offsetTop - contextMenu.offsetHeight > 50
                                    || e.clientY - contextMenu.offsetTop < -50
                                    || e.clientX - contextMenu.offsetLeft - contextMenu.offsetWidth > 50
                                    || e.clientX - contextMenu.offsetLeft < -50)
                                        contextMenu.style.display = "none";
                                })
                            });



/*                            temp_full.onmousedown = function(){
                                all_messages_dives[20].scrollIntoView({
                                    behavior: "smooth",
                                    block: "end",
                                    inline: "nearest",
                                })
                                all_messages_dives[20].classList.add("active");
                                setTimeout(function(){all_messages_dives[20].classList.remove("active");},500);
                            }*/

function check_viewed(event){
    chatSocket[room].send(JSON.stringify({
        'message_id': [temp.getAttribute('value')],
        'type': "message_viewed",
        'room_id': room,
        'contacts_id': document.querySelector("#username_id").value,
    }));

    temp_full.removeEventListener("mouseover", check_viewed);
}

                        if(response.messages[key].user != document.querySelector("#username_id").value){
                            if(!response.messages[key].viewed.includes(parseInt(document.querySelector("#username_id").value))){
                                last_read = temp_full;
                                unread_messages.add(temp_full);
                                temp_full.addEventListener("mouseover", check_viewed);
                            }
                        }


//                            document.querySelector("#display").addEventListener('scroll', function() {
////                                if(Visible(temp) && response.messages[key].viewed == false && response.messages[key].user != document.querySelector("#username_id").value) {
//                                    console.clear();
//                                    console.log(temp);
////                                    chatSocket_current.send(JSON.stringify({
////                                        'message_id': temp.getAttribute('value'),
////                                        'type': "message_viewed",
////                                        'room_id': room,
////                                        'message_text': '',
////                                    }));
////                                }
//                            });

                            all_messages[temp.getAttribute('value')] = temp_full;
                            temp.ondblclick = function(){
                                chatSocket[room].send(JSON.stringify({
                                    'message_id': temp.getAttribute('value'),
                                    'type': "message_reaction",
                                    'room_id': room,
                                }));
                            }

                            if(key == check_mes_update-1) temp.setAttribute("id", "last_message");

                            if (key == 0 || (key > 0 && response.messages[key].date.slice(0, 10) != response.messages[key - 1].date.slice(0, 10))) {
                                month = response.messages[key].date.slice(5, 7) - 1;
                                block_date.setAttribute("id", "block_date");
                                block_date.innerHTML = (months[month] + ' ' + (response.messages[key].date.slice(8, 10) - 0));
                                $("#display").prepend(block_date);
                                block_date_dict[response.messages[key].date.slice(0, 10)] = temp_full;
                            }



                            if(document.querySelector("#block_date") != null) document.querySelector("#block_date").onclick = function(){
                                document.querySelector(".calendar_div").style.display = "block";
                                document.querySelector('#myModal').style.display = "block";
                            };



				}




                        if(load_check){
                            if(last_read != null)
                                last_read.scrollIntoView({
                                    block: "end",
                                    inline: "nearest",
                                });
                            else
                                document.querySelector("#display").scrollTo({
                                    top: document.querySelector("#display").scrollHeight,
                                });
                        }



                    if(load_check)
                        load_check = 0;
}



scroll_appear = false;
document.querySelector(".scroll_down").onclick = function(){
    scroll_appear = true;
    auto_scroll = true;
    viewed_check_messages = new Set();
    unread_messages.forEach(function(event){
        if(event.querySelector(".message").getAttribute("value") != document.querySelector("#username_id").value){
            viewed_check_messages.add(event.querySelector(".message_div").getAttribute("value"));
        }
    })

    viewed_check_messages = Array.from(viewed_check_messages);

    chatSocket[room].send(JSON.stringify({
        'message_id': viewed_check_messages,
        'type': "message_viewed",
        'room_id': room,
        'contacts_id': document.querySelector("#username_id").value,
    }));

}



    document.querySelector(".scroll_down").addEventListener("click", function(event){
        event.preventDefault();
        document.querySelector("#display").scrollTo({
            behavior: "smooth",
            top: document.querySelector("#display").scrollHeight,
        });
    })






selected_messages = new Set();
select_message_onclick_allowed = false;
delete_message_select_check = false;
prev_div = "";
first_message_div_selected = "";



document.querySelector("#uil-select").onclick = function(){
        document.querySelector("#display").addEventListener("click", select_messages_touch);
        select_prepare_contexxtMenu();
};


function select_prepare_contexxtMenu(){
        document.querySelectorAll(".message_div").forEach(function(event){
            event.classList.add("selected_prepare");
        })

        document.querySelectorAll(".temp_full").forEach(function(event){
            select_check = document.createElement("input");
            select_check.type = "checkbox";
            select_check.addEventListener("click", function(event){
                event.preventDefault();
            });
            select_check.setAttribute("class", "message_select_check");
            event.prepend(select_check);
        })

}




function select_messages_touch(event){


    evnt = event.target.closest(".temp_full");

    if(evnt != null){




        if(evnt.classList.contains("temp_full") && !evnt.classList.contains("selected")){
            evnt.classList.add("selected");
            evnt.querySelector(".message_select_check").checked = true;
            selected_messages.add(evnt.querySelector(".message_div").getAttribute("value"));
        }
        else if(evnt.classList.contains("selected")){
            evnt.classList.remove("selected");
            selected_messages.delete(evnt.querySelector(".message_div").getAttribute("value"));
            evnt.querySelector(".message_select_check").checked = false;
            if(selected_messages.size == 0){
                document.querySelector("#display").removeEventListener("click", select_messages_touch);

                window.getSelection().removeAllRanges();
                document.querySelectorAll(".temp_full").forEach(function(event){
                    event.removeChild(event.querySelector(".message_select_check"));
                })

                document.querySelectorAll(".message_div").forEach(function(event){
                    event.classList.remove("selected_prepare");
                })
            }
        }
    }
}




document.querySelector("#display").onmousedown = function(e){
    if(e.which == 1){
        if(e.target.classList.contains("temp_full") || (e.target.closest(".temp_full") && select_message_onclick_allowed)){
            if(e.target.classList.contains("selected"))
                delete_message_select_check = true;
            else
                delete_message_select_check = false;

            if(!delete_message_select_check)
                first_message_div_selected = e.target;
            prev_div = e.target;
            if(select_message_onclick_allowed) select_messages(event, false);
            document.querySelector("#display").addEventListener("mousemove", select_messages);

            window.addEventListener("keydown", selected_messages_escape);
        }
    }
}

document.querySelector("#display").onmouseup = function(e){
    document.querySelector("#display").removeEventListener("mousemove", select_messages);
    first_message_div_selected = "";
}


                            prev_scroll_height = 0;
                            document.querySelector("#display").addEventListener('scroll', function() {
                                if(document.querySelector(".room_body").clientHeight + document.querySelector(".room_body").scrollTop == document.querySelector(".room_body").scrollHeight) scroll_appear = false;
                                if(!scroll_appear && document.querySelector(".room_body").scrollHeight - document.querySelector(".room_body").scrollTop > document.querySelector(".room_body").clientHeight*2){
                                    if(!document.querySelector(".scroll_down").classList.contains("active")){
                                        document.querySelector(".scroll_down").classList.add("active");
                                        console.log("SCROLLED");
                                        scroll_more += 25;
                                        auto_scroll = false;
                                        // if(check_mes_update - scroll_more > 0)
                                            // message_initialization(messages_response);
                                    }
                                }
                                else if(document.querySelector(".scroll_down").classList.contains("active")){
                                    document.querySelector(".scroll_down").classList.remove("active");
                                }
/*                                if(document.querySelector(".room_body").scrollTop < document.querySelector(".room_body").scrollHeight*0.1){
                                    load_check = 0;
                                    check_mes_update += 25;
                                    mes_amount += 25;
                                    sender();
                                }*/
                            });


function select_messages(event, click_check = true){



    evnt = event.target.closest(".temp_full");

    if(evnt != null && (first_message_div_selected != evnt || select_message_onclick_allowed)){

if(!select_message_onclick_allowed){

        document.querySelectorAll(".message_div").forEach(function(event){
            event.classList.add("selected_prepare");
        })

        document.querySelectorAll(".temp_full").forEach(function(event){
            select_check = document.createElement("input");
            select_check.class = "select_checkbox";
            select_check.type = "checkbox";
//            select_check.disabled = true;
            select_check.addEventListener("click", function(event){
                event.preventDefault();
            });
            select_check.setAttribute("class", "message_select_check");
            event.insertBefore(select_check, event.firstChild);
        })
}
        select_message_onclick_allowed = true;
        if(!delete_message_select_check && (evnt != prev_div || click_check == false) && evnt.classList.contains("temp_full") && !evnt.classList.contains("selected")){
            if(prev_div == first_message_div_selected){
                prev_div.classList.add("selected");
                prev_div.querySelector(".message_select_check").checked = true;
                selected_messages.add(prev_div.querySelector(".message_div").getAttribute("value"));
                first_message_div_selected = "";
            }
            prev_div = event.target;
            evnt.classList.add("selected");
            evnt.querySelector(".message_select_check").checked = true;
            selected_messages.add(evnt.querySelector(".message_div").getAttribute("value"));
        }
        else if(delete_message_select_check && evnt.classList.contains("selected") && (evnt != prev_div || click_check == false)){
            evnt.classList.remove("selected");
            prev_div = "";
            selected_messages.delete(evnt.querySelector(".message_div").getAttribute("value"));
            evnt.querySelector(".message_select_check").checked = false;
            if(selected_messages.size == 0){
                select_message_onclick_allowed = false;
                document.querySelector("#display").removeEventListener("mousemove", select_messages);
                first_message_div_selected = "";
                window.getSelection().removeAllRanges();
                document.querySelectorAll(".temp_full").forEach(function(event){
                    event.removeChild(event.querySelector(".message_select_check"));
                })

                document.querySelectorAll(".message_div").forEach(function(event){
                    event.classList.remove("selected_prepare");
                })
            }
        }
    }
}

function selected_messages_escape(event){
    if(event.keyCode == 27){
            select_message_onclick_allowed = false;
            document.querySelectorAll(".temp_full").forEach(function(event){
                event.classList.remove("selected");
                event.removeChild(event.querySelector(".message_select_check"));
            })
            document.querySelectorAll(".message_div").forEach(function(event){
                event.classList.remove("selected_prepare");
            })
            selected_messages.clear();
            window.removeEventListener("keydown", selected_messages_escape);
            document.querySelector("#display").removeEventListener("mousemove", select_messages);
    }
}

window.addEventListener("keydown", function(event){
    if(event.keyCode == 27 && !selected_messages.size && window.location.hash.slice(1) != 0){
        go_home_page_func();
    }
});


//document.querySelector("#display").onmouseup = function(){
//    window.removeEventListener("mousemove", select_messages);
//}
//
//selectMessageDiv = function(event){
//    window.addEventListener("mousemove", (e) => {
//        console.log(e.pageX, e.pageY);
//    })
//}



    shadow_degree = 0;

	document.querySelector("#shadow_degree_chat").oninput = function(e){
	    shadow_degree = document.querySelector("#shadow_degree_chat").value*3.6;
	    document.querySelector(".room_div").style.setProperty('--shadow_degree', `${shadow_degree}deg`);
	}

	document.querySelector("#shadow_degree_chat").onchange = function(e){
        setCookie("room_BG_shadow", this.value*3.6, 7);
	}

//	document.querySelector("#chat_background_image").oninput = function(e){
//
//	    file = this.files[0]
//        var reader  = new FileReader();
//
//        reader.onloadend = function () {
//            document.querySelector(".room_div").style.backgroundImage  = "url(" + reader.result + ")";
//        }
//
//        if (file) {
//            reader.readAsDataURL(file);
//        }
//	}

create_new_group_list_contacts = [];
document.querySelector("#creation_group_NEXT_GROUPNAME").onclick = function(event){
    document.querySelector(".all_my_contacts").style.display = "unset";
    document.querySelector("#create_new_group_room").prepend(document.querySelector(".all_my_contacts"));
    document.querySelector("#create_new_group_room").style.height = "500px";
    document.querySelector("#creation_group_CREATE_CANCEL_div").style.display = "flex";
    document.querySelector("#creation_group_GIVE_A_NAME").style.display = "none";
    document.querySelector("#creation_group_NEXT_CANCEL_div_GROUPNAME").style.display = "none";

}

document.querySelector("#creation_group_CREATE").onclick = function(event){
    document.querySelector("#create_new_group_room").style.height = "200px";
    create_new_group_list_contacts = [];
    document.querySelector(".all_my_contacts").querySelectorAll(".users_full_form").forEach(function(event){
        if(event.querySelector(".create_new_group_choose").getElementsByTagName("input")[0].checked){
            create_new_group_list_contacts.push(event.getElementsByTagName("input")[1].getAttribute("value"));
        }
    })
    create_new_group_list_contacts.push(document.querySelector("#username_id").value);


    formData = new FormData();
    formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());
    formData.append("room_avatar", document.querySelector("#input_room_avatar").files[0]);
    formData.append("contacts_id", JSON.stringify(create_new_group_list_contacts));
    formData.append("room_name", document.querySelector("#creation_group_GIVE_A_NAME_input").value);
    formData.append("room_type", "G");
    $.ajax({
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        url: '/save_room_avatar',
        data: formData,
        success: function(response){
            for(contact = 0; contact < create_new_group_list_contacts.length; ++contact){

                    (async () => {
                        const contact_ = contact;
                        url_contact = `ws://${window.location.host}/socket-server/user/${create_new_group_list_contacts[contact]}/`;
                        console.log("url_contact:", contact_);
                        chatSocket_contact = new WebSocket(await url_contact);

                        chatSocket_contact.onopen = function(){
                            this.send(JSON.stringify({
                                'type': "create_new_room",
                                'room_id': response.id,
                            }))
                            this.close();
                        }
                    })()

            }
        }
    });






}


document.querySelector("#create_new_group").onmousedown = function(event){

}

/*//    document.querySelector(".room_div").style.cssText += "filter: blur(1px)";*/

	function urlify(text) {
		var link = /(https?:\/\/[^\s]+)/g;
		var user = /@[^\s]+/g
		var email = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
		var urlRegex = new RegExp(link.source + "|" + user.source + "|" + email.source);
		return text.replace(urlRegex, function(url) {
        <!--                        attach_file.innerHTML = '<a id="link_in_mes" target="_blank" href="' + url + '">' + url + '</a>';-->
        <!--                        attachment_links.prepend(attach_file);-->
			if (email.test(url)) return '</xmp><a id="link_in_mes" target="_blank" href="mailto:' + url + '">' + url + '</a><xmp>';
			if (link.test(url)) return '<a id="link_in_mes" target="_blank" href="' + url + '">' + url + '</a>';
		})
	}
//	var all_audio = document.getElementsByTagName("audio");
//	var index = 0;
//	for (i = 0; i < all_audio.length; i++) {
//		all_audio[i].id = i;
//		all_audio[i].onended = function() {
//			index = parseInt(this.id) + 1;
//			if (index == all_audio.length) index = 0;
//			all_audio[index].play();
//		}
//	}
	$(function() {
		$("audio").on("play", function() {
			$("audio").not(this).each(function(index, audio) {
				audio.pause();
			});
		});
	});




$("textarea").on("input", function () {
    this.style.height = 0;
    this.style.height = (this.scrollHeight+8) + "px";
});



	if(window.screen.availWidth >= 576) {
        $(".textarea").keypress(function(e) {
            if (e.which == 13 && !e.shiftKey) {
                e.preventDefault();
                this.style.height = 28 + "px";
//                document.querySelector(".scroll_down").style.bottom = 60 + "px";
                if($(".textarea").val().replace(/\s/g, '').length && send_allowed)
                    $(this).closest("form").submit();
            }
        });
	}

        function isEmpty(str) {
          if (str.trim() == '')
            return true;
          return false;
        }


        document.querySelector("#myModal").onmousedown = function(e) {
            this.style.display = "none";
        }

        document.querySelector("#media_display").onmousedown = function(e) {
            this.style.display = "none";
            document.querySelector("#myModal").style.display = "none";
        }

	document.querySelector(".input_submit").onclick = function(){
	    if($(".textarea").is(':focus'))
            $(".textarea").focus();
	    if(!isEmpty(document.querySelector(".textarea").value) || document.querySelector("#file").files.length)
	        $(this).closest("form").submit();
	    document.querySelector(".textarea").style.height = 28 + "px";
	    document.querySelector(".textarea").value = "";
	}


	$(document).on('submit', '#post-form', function(e) {
		e.preventDefault();
        let message = txtencode(e.target.message.value, "1234")

        loading_sign = document.createElement("div");
        loading_sign_image = document.createElement("img");
        loading_sign_image.classList.add("loading_sign_image");
        loading_sign_image.src = "//" + window.location.host + "/static/Images/loading_sign.gif";
        loading_sign.appendChild(loading_sign_image);
        if(!document.querySelector(".send_div").querySelector(".loading_sign_image"))
            document.querySelector(".send_div").append(loading_sign);
        send_allowed = false;

        const formData = new FormData(this);
//        user_files = document.createElement("file");
/*        user_files.setAttribute("multiple");*/

/*        for(file in document.querySelector('#file').files)
            user_files.files += (renameFile(document.querySelector('#file').files[file], "YES"));
//            document.querySelector('#file').files[file] = "YES";

        console.log("BAL", user_files);
//        formData.set('file', )*/
//        console.log(document.querySelector('#file').files);
        formData.append("message", message);

		$.ajax({
			type: 'POST',
			url: '/send',
			cache: false,
			contentType: false,
			processData: false,
			data: formData,
			success: function(data) {
			    auto_scroll = true;
			    load_photo_check = 1;
                if(document.querySelector(".send_div").querySelector(".loading_sign_image"))
			        document.querySelector(".send_div").querySelector(".loading_sign_image").remove();

                if(chatSocket[room].readyState) {
                    chatSocket[room].send(JSON.stringify({
                        'type': "chat_message",
                        'room_id': room,
                        'message_text': message,
                    }))

                    chatSocket[room].addEventListener("message", function(){
                        send_allowed = true;
                    })

                    viewed_check_messages = new Set();
                    unread_messages.forEach(function(event){
                        if(event.querySelector(".message").getAttribute("value") != document.querySelector("#username_id").value){
                            viewed_check_messages.add(event.querySelector(".message_div").getAttribute("value"));
                        }
                    })

                    if(viewed_check_messages.length){
                        viewed_check_messages = Array.from(viewed_check_messages);

                        chatSocket[room].send(JSON.stringify({
                            'message_id': viewed_check_messages,
                            'type': "message_viewed",
                            'room_id': room,
                            'contacts_id': document.querySelector("#username_id").value,
                        }));
                    }
                }

			},
		});
		document.querySelector('.textarea').value = '';
		document.querySelector('#file').value = '';
	});


function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}


document.querySelector("#input_attach").onclick = function(){
    document.querySelector("#file").click();
}


document.onpaste = function(pasteEvent) {
    var item = pasteEvent.clipboardData.items[0];

    if (item.type.indexOf("image") === 0)
    {
        var blob = item.getAsFile();

        var reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById("copied_image").src = event.target.result;
        };

        reader.readAsDataURL(blob);
    }
}

    document.addEventListener("keydown", function(e){
    if(document.activeElement == document.body && (e.which != 17 && e.which != 67))
            $(".textarea").focus();
    }, true)


          function getCookie(name) {
              var cookieValue = null;
              if(document.cookie && document.cookie != '') {
                  var cookies = document.cookie.split(';');
                  for(var i = 0; i < cookies.length; i++) {
                      var cookie = jQuery.trim(cookies[i]);
                      if(cookie.substring(0, name.length + 1) == (name + '=')) {
                          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                          break;
                      }
                  }
              }
              return cookieValue;
          }

//          $.ajaxSetup({
//              global: true,
//              beforeSend: function(xhr, settings) {
//                  if(!(/^http:.*//*.test(settings.url) || /^https:.*/.test(settings.url))) {
//                      xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
//                      xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded; charset=UTF-8');
//                  }
//              },
//              timeout: 8000
//          });




            var stringToColor = function stringToColor(str) {
                var hash = 5;
                var color = '#';
                var i;
                var value;
                var strLength;

                if(!str) {
                    return color + '333333';
                }

                strLength = str.length;

                for (i = 0; i < strLength; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                }

                for (i = 0; i < 3; i++) {
                    value = (hash >> (i * 8)) & 0xFF;
                    color += ('00' + value.toString(16)).substr(-2);
                }

                return color;
            };

		document.querySelector("#avatar_profile_set_save").onmousedown = function save_profile_avatar(){
		    formData = new FormData();
		    formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());
		    formData.append("user_avatar", document.querySelector("#input_user_avatar").files[0]);
            $.ajax({
                cache: false,
                contentType: false,
			    processData: false,
                type: 'POST',
                url: '/save_profile_avatar',
                data: formData,
            });
        }
















        const pSBC=(p,c0,c1,l)=>{
            let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
            if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
            if(!this.pSBCr)this.pSBCr=(d)=>{
                let n=d.length,x={};
                if(n>9){
                    [r,g,b,a]=d=d.split(","),n=d.length;
                    if(n<3||n>4)return null;
                    x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
                }else{
                    if(n==8||n==6||n<4)return null;
                    if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
                    d=i(d.slice(1),16);
                    if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
                    else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
                }return x};
            h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
            if(!f||!t)return null;
            if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
            else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
            a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
            if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
            else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
        }

document.documentElement.style.setProperty('--rooms_display', `flex`);

        document.querySelector(".search_field").oninput = function() {
            if($(".search_field").val().replace(/\s/g, '').length){
//                document.querySelector(".users_search").setAttribute("style", "display: flex");
                if(chatSocket_user != null && chatSocket_user.readyState) {
                    document.documentElement.style.setProperty('--rooms_display', `none`);
                    getUsers(document.querySelector(".search_field").value);
                }
            }
            else{
                document.documentElement.style.setProperty('--rooms_display', `flex`);
                document.querySelectorAll(".users_full_form.search").forEach(function(e){
                    e.remove();
                })
            }
        };

        document.querySelector(".search_cross").onmousedown = function() {
            document.querySelector(".search_field").value = '';
        };



        document.getElementById('file').addEventListener('change', function(e) {
            if (e.target.files[0]) {
                $(".textarea").focus();
            }
        });


        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        window.addEventListener('resize', () => {
          let vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        });


        window.addEventListener('resize', () => {
            adapt();
        });

        $(document).ready(adapt);



        document.querySelector("#color_chat_change").addEventListener('input', function(e){
            var room_BG_color_hex = document.querySelector("#color_chat_change").value;
            document.documentElement.style.setProperty('--input_submit_color', `${room_BG_color_hex}`);
            document.documentElement.style.setProperty('--dark_mode_color', `${room_BG_color_hex}`);
            document.documentElement.style.setProperty('--slider_shadow_degree', `${room_BG_color_hex}`);
            document.documentElement.style.setProperty('--slider_shadow_degree_bubble', `${pSBC(0.5, room_BG_color_hex)}`);
            document.querySelector(".room_div").setAttribute('style', '--myColor1: ' + pSBC(-0.6, room_BG_color_hex) + '; --myColor2: ' + pSBC(-0.4, room_BG_color_hex) + '; --myColor3: ' + room_BG_color_hex + ';')
/*            document.querySelector(".darker").style.cssText = "background: red;";
            console.log(document.querySelector(".darker").style.cssText)
            for(el in document.querySelectorAll(".darker"))
                document.querySelectorAll(".darker")[el].style.background = room_BG_color_hex;
/*            document.querySelector(".message").setAttribute("style", "background: blue;");*/
        });

        document.querySelector("#color_chat_change").addEventListener('change', function(e){
            setCookie("room_BG_color_hex", this.value, 7);
//            document.querySelector(".room_div").setAttribute('style', '--myColor1: ' + pSBC(-0.6, room_BG_color_hex) + '; --myColor2: ' + pSBC(-0.4, room_BG_color_hex) + '; --myColor3: ' + room_BG_color_hex + ';')
        });

        function hex2a(hexx) {
            var hex = hexx.toString();
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str;
        }

        function unicodeToChar(text) {
           return text.replace(/\\u[\dA-F]{4}/gi,
                  function (match) {
                       return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
                  });
        }

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}

const syntheticEvent = new WheelEvent("syntheticWheel", {
  deltaY: 4,
  deltaMode: 0,
});

document.querySelector(".tab").addEventListener("wheel", (evt) => {
    evt.preventDefault();
    document.querySelector(".tab").scrollLeft += (Math.sign(evt.deltaY)*20);
});



document.querySelector("#dark_mode").onmousedown = function(){
    if(getCookie("theme_mode") == "L")
        setCookie("theme_mode", "D", 7);
    else if(getCookie("theme_mode") == "D")
        setCookie("theme_mode", "L", 7);
    set_theme();
}



document.getElementById("dark_mode_check").addEventListener("click", function(event){
    event.preventDefault();
});


if(getCookie("theme_mode") == null)
    setCookie("theme_mode", "D", 1);

$(document).ready(set_theme);


function set_theme(theme_mode){
    var message_color = "#FFF";
    var main_color = "#000";
    var darker_ = "#FFF";
    var attachment_tabs = "#EEE";
    if(getCookie("theme_mode") == "L"){
        document.documentElement.style.setProperty('--message_color', `${message_color}`);
        document.documentElement.style.setProperty('--message_font_color', `${main_color}`);
        document.documentElement.style.setProperty('--darker_', `${darker_}`);
        document.documentElement.style.setProperty('--user_font_color', `${main_color}`);
        document.documentElement.style.setProperty('--textarea_font', `${main_color}`);
        document.documentElement.style.setProperty('--attachment_tabs', `${attachment_tabs}`);
        document.documentElement.style.setProperty('--attachment_tabs_font', `${main_color}`);
        document.querySelector(".settings").setAttribute("style", "background: #EEE;");
        document.querySelector("body").setAttribute("style", "background-color: #FFF;");
        document.querySelector("#opponent_title_name").setAttribute("style", "background-color: #FFF;");
        document.querySelector("#name").setAttribute("style", "color: #000;");
        document.querySelector(".send_div").setAttribute("style", "background-color: #FFF;");
        document.querySelector(".users_search").setAttribute("style", "background-color: #FFF;");
        document.querySelector(".search_div").setAttribute("style", "background-color: #FFF;");
        document.querySelector(".search_field").setAttribute("style", "background-color: #EEE; color: #000;");
        document.querySelector(".attachments").setAttribute("style", "background-color: #FFF;");
        document.querySelector(".settings_menu").setAttribute("style", "background-color: #FFF;");
        document.querySelector(".scroll_down").setAttribute("style", "background: #EEE;");
        document.querySelector("#dark_mode_check").checked = false;


    }
    else if(getCookie("theme_mode") == "D"){
        message_color = "rgba(41,49,51)";
        main_color = "#FFF";
        darker_ = "#414352";
        attachment_tabs = "##1E1E1E";
        document.documentElement.style.setProperty('--message_color', `${message_color}`);
        document.documentElement.style.setProperty('--message_font_color', `${main_color}`);
        document.documentElement.style.setProperty('--darker_', `${darker_}`);
        document.documentElement.style.setProperty('--user_font_color', `${main_color}`);
        document.documentElement.style.setProperty('--textarea_font', `${main_color}`);
        document.documentElement.style.setProperty('--attachment_tabs', `${attachment_tabs}`);
        document.documentElement.style.setProperty('--attachment_tabs_font', `${main_color}`);
        document.querySelector(".settings").setAttribute("style", "background: #222;");
        document.querySelector("body").setAttribute("style", "background-color: #0f0f0f;");
        document.querySelector("#opponent_title_name").setAttribute("style", "background-color: #1E1E1E;");
        document.querySelector("#name").setAttribute("style", "color: white;");
        document.querySelector(".send_div").setAttribute("style", "background-color: #1E1E1E;");
        document.querySelector(".users_search").setAttribute("style", "background-color: #1E1E1E;");
        document.querySelector(".search_div").setAttribute("style", "background-color: #1E1E1E;");
        document.querySelector(".search_field").setAttribute("style", "background-color: rgba(41,49,51);");
        document.querySelector(".attachments").setAttribute("style", "background-color: rgba(30,30,30);");
        document.querySelector(".settings_menu").setAttribute("style", "background-color: rgba(30,30,30);");
        document.querySelector(".scroll_down").setAttribute("style", "background: rgb(25,25,25);");
        document.querySelector("#dark_mode_check").checked = true;
    }

}




shadow_degree = getCookie("room_BG_shadow");
document.querySelector("#color_chat_change").value = room_BG_color_hex = getCookie("room_BG_color_hex");
document.querySelector("#shadow_degree_chat").value = shadow_degree/3.6;
setTimeout(function(){document.querySelector(".room_div").style.setProperty('--shadow_degree', `${shadow_degree}deg`);},0)
document.documentElement.style.setProperty('--slider_shadow_degree', `${room_BG_color_hex}`);
document.documentElement.style.setProperty('--slider_shadow_degree_bubble', `${pSBC(0.5, room_BG_color_hex)}`);
document.documentElement.style.setProperty('--input_submit_color', `${room_BG_color_hex}`);
document.documentElement.style.setProperty('--dark_mode_color', `${room_BG_color_hex}`);
document.querySelector(".room_div").setAttribute('style', '--myColor1: ' + pSBC(-0.6, room_BG_color_hex) + '; --myColor2: ' + pSBC(-0.4, room_BG_color_hex) + '; --myColor3: ' + room_BG_color_hex + ';')



click = true;

$(".dropbtn").click(function() {
    document.querySelector('.settings_menu').classList.add('active');
});




document.querySelector('#opponent_title_name').addEventListener('click', (e) => {
    if(e.target != document.querySelector(".go_home_page")){
        document.querySelector('.attachments').classList.add('active');
        document.querySelector('.close-menu').classList.add('close-menu-active');
        document.querySelector('.send_div_class').classList.add('active');
        document.querySelector('.room_body').classList.add('active');
        document.querySelector('#opponent_title_name').classList.add('active');
    }
})

document.querySelector('.close-menu').addEventListener('click', (e) => {
    document.querySelector('.attachments').classList.remove('active');
    document.querySelector('.close-menu').classList.remove('close-menu-active')
    document.querySelector('.send_div_class').classList.remove('active');
    document.querySelector('.room_body').classList.remove('active');
    document.querySelector('#opponent_title_name').classList.remove('active');
})



$(document).on('mousedown', function(e) {
    if(!$(e.target).closest(".settings_menu").length && e.target != document.querySelector(".dropbtn")){
        document.querySelector('.settings_menu').classList.remove('active');
    }

    if(!$(e.target).closest(".settings").length){
        document.querySelector('.settings').classList.remove('active');
        document.querySelector('.settings').style.display = "none";
    }

    if(!$(e.target).closest("#create_new_group_room").length){
        document.querySelector('#create_new_group_room').classList.remove('active');
        document.querySelector('#create_new_group_room').style.display = "none";
    }

    if(!$(e.target).closest("#create_new_channel_room").length){
        document.querySelector('#create_new_channel_room').classList.remove('active');
        document.querySelector('#create_new_channel_room').style.display = "none";
    }

    if(!$(e.target).closest(".calendar_div").length){
        document.querySelector(".calendar_div").style.display = "none";
    }

    if(!e.target.classList.contains("mes_img")){
        document.querySelector("#media_display").style.display = "none";
    }

    e.stopPropagation();
});


$("#settings").click(function() {
    document.querySelector('.settings_menu').classList.remove('active');
    document.querySelector("#img01").removeAttribute("src");
    document.querySelector('#myModal').style.display = "block";
    document.querySelector('.settings').classList.add("active");
    document.querySelector('.settings').style.display = "block";
});

$("#create_new_group").click(function() {
    document.querySelector('.settings_menu').classList.remove('active');
    document.querySelector("#img01").removeAttribute("src");
    document.querySelector('#myModal').style.display = "block";
    document.querySelector('#create_new_group_room').classList.add("active");
    document.querySelector('#create_new_group_room').style.display = "block";
});

$("#create_new_channel").click(function() {
    document.querySelector('.settings_menu').classList.remove('active');
    document.querySelector("#img01").removeAttribute("src");
    document.querySelector('#myModal').style.display = "block";
    document.querySelector('#create_new_channel_room').classList.add("active");
    document.querySelector('#create_new_channel_room').style.display = "block";
});





const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();




/*const months_ = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];*/

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;

    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
    daysTag.querySelectorAll("li:not(.inactive)").forEach(function(e){
        e.onclick = function(){
            current_date = document.querySelector(".current-date");
            year = current_date.textContent.slice(current_date.textContent.lastIndexOf(" ")+1)
            month = (months.indexOf(current_date.textContent.slice(0, current_date.textContent.lastIndexOf(" ")))+1).toString();
            month = (month.length == 2 ? month:"0"+month);
            day = (e.textContent.length == 2 ? e.textContent:"0"+e.textContent);
            final_date = year + "-" + month + "-" + day;
            block_to_scroll = block_date_dict[final_date];

            if(block_to_scroll == undefined){
                keys = Object.keys(block_date_dict);
                for(date = keys.length - 1; date >= 0; --date){
                    if(keys[date] > final_date){
                        block_to_scroll = block_date_dict[keys[date]];
                        break;
                    }
                }
            }

            block_to_scroll.scrollIntoView({
                behavior: "smooth",
                block: 'center',
                inline: 'center',
            })
            block_to_scroll.classList.add("active");
            setTimeout(function(){block_to_scroll.classList.remove("active");},500);

            document.querySelector(".calendar_div").style.display = "none";
            document.querySelector("#myModal").style.display = "none";
        }
    })

}
renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});






    document.addEventListener("DOMContentLoaded", function() {
      var lazyloadImages = document.querySelectorAll("img.lazy");
      var lazyloadThrottleTimeout;

      function lazyload () {
        if(lazyloadThrottleTimeout) {
          clearTimeout(lazyloadThrottleTimeout);
        }

        lazyloadThrottleTimeout = setTimeout(function() {
            var scrollTop = window.pageYOffset;
            lazyloadImages.forEach(function(img) {
                if(img.offsetTop < (window.innerHeight + scrollTop)) {
                  img.src = img.dataset.src;
                  img.classList.remove('lazy');
                }
            });
            if(lazyloadImages.length == 0) {
              document.removeEventListener("scroll", lazyload);
              window.removeEventListener("resize", lazyload);
              window.removeEventListener("orientationChange", lazyload);
            }
        }, 20);
      }

      document.addEventListener("scroll", lazyload);
      window.addEventListener("resize", lazyload);
      window.addEventListener("orientationChange", lazyload);
    });




}

//    function _(el) {
//      return document.getElementById(el);
//    }
//
//    function uploadFile() {
//      var file = _("file").files[0];
//      // alert(file.name+" | "+file.size+" | "+file.type);
//      var formdata = new FormData();
//      formdata.append("file", file);
//      formdata.append('csrfmiddlewaretoken', document.getElementsByName('csrfmiddlewaretoken')[0].value);
//      var ajax = new XMLHttpRequest();
//      ajax.upload.addEventListener("progress", progressHandler, false);
//      ajax.addEventListener("load", completeHandler, false);
//      ajax.addEventListener("error", errorHandler, false);
//      ajax.addEventListener("abort", abortHandler, false);
//      ajax.open("POST", "/send");
//      ajax.send(formdata);
//    }
//
//    function progressHandler(event) {
//      _("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
//      var percent = (event.loaded / event.total) * 100;
//      _("progressBar").value = Math.round(percent);
//      _("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
//    }
//
//    function completeHandler(event) {
//      _("status").innerHTML = event.target.responseText;
//      _("progressBar").value = 0; //wil clear progress bar after successful upload
//    }
//
//    function errorHandler(event) {
//      _("status").innerHTML = "Upload Failed";
//    }
//
//    function abortHandler(event) {
//      _("status").innerHTML = "Upload Aborted";
//    }


        function adapt(){
            document.querySelector(".room_body").scrollTo({
                top: document.querySelector(".room_body").scrollTop,
                behavior: "smooth",
            });

            let vw = window.innerWidth;
            allow = window.innerWidth - 400;
            if(vw <= 1700){
                document.querySelector(".main_chat_window").setAttribute("style","width: " + allow + "px;");
//                document.querySelector(".choose_list").setAttribute("style","max-width: 18vw;");
//                document.querySelector(".choose_list").setAttribute("style","min-width: 18vw;");
            }
            if(vw <= 768){
/*                document.querySelector('.temp_full').style.direction = "rtl";*/
                document.querySelector(".go_home_page").setAttribute("style","display: unset;");
                document.querySelector("#name").style.textIndent = "0px";
                document.querySelector(".main_chat_window").setAttribute("style","width: 100vw;");
                if(document.querySelector("#room_id").value != 0){
                    document.querySelector(".choose_list").setAttribute("style","display: none;");
                }
                else{
                    document.querySelector(".choose_list").setAttribute("style","display: flex;");
                    document.querySelector(".main_chat_window").setAttribute("style","display: none");
                }
            }
            if(vw > 768){
                document.querySelector(".go_home_page").setAttribute("style","display: none;");
                document.querySelector(".main_chat_window").setAttribute("style","width: " + allow + "px;");
                document.querySelector(".choose_list").setAttribute("style","display: flex;");
            }
            if(vw > 1700){
                document.querySelector(".main_chat_window").setAttribute("style","width: 1200;");
                document.querySelector(".choose_list").setAttribute("style","max-width: 400;");
                document.querySelector(".choose_list").setAttribute("style","min-width: 400;");
            }
        }





jQuery(function($) {

  $(document).on("mousedown", ".users_full_form", function(e) {

    var $self = $(this);

    if($self.is(".btn-disabled")) {
      return;
    }
    if($self.closest(".users_full_form")) {
      e.stopPropagation();
    }

    var initPos = $self.css("position"),
        offs = $self.offset(),
        x = e.pageX - offs.left,
        y = e.pageY - offs.top,
        dia = Math.min(this.offsetHeight, this.offsetWidth, 100), // start diameter
        $ripple = $('<div/>', {class:"ripple", appendTo:$self});

    if(!initPos || initPos==="static") {
      $self.css({position:"relative"});
    }

    $('<div/>', {
      class : "rippleWave",
      css : {
        background: $self.data("ripple"),
        width: dia,
        height: dia,
        left: x - (dia/2),
        top: y - (dia/2),
      },
      appendTo : $ripple,
      one : {
        animationend : function(){
          $ripple.remove();
        }
      }
    });
  });

});



