<!doctype html>
<html lang="pt-br">

<head>
<title>MENSAGEM</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<style type="text/css">

.panel{

	
margin-right: 3px;
}

.button {
    background-color: #4CAF50;
    border: none;
    color: white;
	margin-right: 30%;   
	margin-left: 30%;
    text-decoration: none;
    display: block;
    font-size: 16px;
    cursor: pointer;
	width:30%;
    height:40px;
	margin-top: 5px;
	 
}
input[type=text]{
		width:100%;
		margin-top:5px;
		
	}


.chat_wrapper {
	width: 70%;
	height:472px;
	margin-right: auto;
	margin-left: auto;
	background: #3B5998;
	border: 1px solid #999999;
	padding: 10px;
	font: 14px 'lucida grande',tahoma,verdana,arial,sans-serif;
}
.chat_wrapper .message_box {
	background: #F7F7F7;
	height:350px;
		overflow: auto;
	padding: 10px 10px 20px 10px;
	border: 1px solid #999999;
}
.chat_wrapper  input{
	padding: 2px 2px 2px 5px;
}
.system_msg{color: #BDBDBD;font-style: italic;}
.user_name{font-weight:bold;}
.user_message{color: #88B6E0;}

@media only screen and (max-width: 720px) {
    /* For mobile phones: */
    .chat_wrapper {
        width: 95%;
	height: 40%;
	}
    

	.button{ width:100%;
	margin-right:auto;   
	margin-left:auto;
	height:40px;}
	
	
	
	
	
				
}

</style>
</head>
<body>	
<?php 
$cores = array('007AFF','FF7000','FF7000','15E25F','CFC700','CFC700','CF1100','CF00BE','F00');
$user_colour = array_rand($cores);
?>


<script src="jquery-3.1.1.js"></script>


<script language="javascript" type="text/javascript">  
$(document).ready(function(){
	
    function wsURL(path) {
        var protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
        var url = protocol + location.host;
        if(location.hostname === 'localhost') {
            url += '/' + location.pathname.split('/')[1]; 
        }
        return url + path;
    }
    
    
    
    $('#message_box').append("<div class='system_error'>"+wsURL('/chat/ws/')+"</div>");
    
    $('#message_box').append("<div class='system_error'>Conectando...</div>");
    
    
    
	var wsUri = wsURL('/chat/ws/'); 	
	websocket = new WebSocket(wsUri); 
	
	websocket.onopen = function(ev) {  
		$('#message_box').append("<div class='system_msg'>Connectado!</div>"); 
	}

	$('#send-btn').click(function(){ 	
		var mymessage = $('#message').val(); 
		var myname = $('#name').val(); 
		
		if(myname == ""){ 
			alert("Informe o seu nome!");
			return;
		}
		if(mymessage == ""){ 
			alert("Escreva a sua mensagem!");
			return;
		}
		document.getElementById("name").style.visibility = "hidden";
		
		var objDiv = document.getElementById("message_box");
		objDiv.scrollTop = objDiv.scrollHeight;
		//prepare json data
		var msg = {
		message: mymessage,
		name: myname,
		color : '<?php echo $colours[$user_colour]; ?>'
		};
		
		websocket.send(JSON.stringify(msg));
	});
	
	
	websocket.onmessage = function(ev) {
        
        
		var msg = JSON.parse(ev.data); 
		var type = msg.type; 
		var umsg = msg.message; 
		var uname = msg.name; 
		var ucolor = msg.color; 

		if(type == 'usermsg') 
		{
			$('#message_box').append("<div><span class='user_name' style='color:#"+ucolor+"'>"+uname+"</span> : <span class='user_message'>"+umsg+"</span></div>");
		}
		if(type == 'system')
		{
			$('#message_box').append("<div class='system_msg'>"+umsg+"</div>");
		}
		
		$('#message').val(''); //reset text
		
		var objDiv = document.getElementById("message_box");
		objDiv.scrollTop = objDiv.scrollHeight;
	};
	
	websocket.onerror	= function(ev){  
        if(ev.data===undefined){
            ev.data = '<b>FUDEUUUUUUUUUUUUUU</b> =/';
        }  
        $('#message_box').append("<div class='system_error' style='color:#ff0000'>Ocorreu um erro -> "+ev.data+"</div>");
    }; 
	websocket.onclose 	= function(ev){$('#message_box').append("<div class='system_msg'><b>:(</b> Conexão fechada</div>");};
    
    
    
});




</script>
<div class="chat_wrapper">
<div class="message_box" id="message_box"></div>
<div class="panel">
<input type="text" name="name" id="name" placeholder="Seu nome" maxlength="15" />

<input type="text" name="message" id="message" placeholder="Mensagem" maxlength="80" 
onkeydown = "if (event.keyCode == 13)document.getElementById('send-btn').click()"  />





</div>

<button id="send-btn" class=button>ENVIAR MSG</button>

</div>

</body>
</html>