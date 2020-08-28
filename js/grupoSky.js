var php_anam="salvarAnamneseWEB.php";
var v_s='versão 1.6';
var linkpagina = window.location.pathname;
var pagina = linkpagina.split("/").pop();
var conta_escrita=0;
var totalLaudos=0;
var fotoSeleciona='img/telalogo.png';
var logomarca='img/logo_clinica1.png';
var editor = document.getElementById("EditarFoto");
var context = editor.getContext("2d");
var cor_da_linha="#ff0000";
var xcor='vermelha';
var tamanho_da_linha=3.2;
var seta_img="img/setadireita";
var ponto_img="img/ponto"; 	
var gridImg='img/separadorCanvas.png';
var angulo=0;
var zoomimagem=0;
var conta_foto=0;
var pressiona;
var imgCheckup=0;
var temPendrive;
var tapEnabled = true;
var dragEnabled = true;
var toBack = true;
var paginaAtual=[];
var fotooriginal;
var fotomini;
var imageURI;
var odonto_mascara=false;
var exame_guiado=false;
var Offline=false;
var caminho;
var galeria_aberta=false;
var frame_atual;
var linhas=[];
var entra=1;
var idSeta=0;
var idPonto=0;
var medida=0;
var idMedida=0;
var angleInDegrees=0;
var dente=0;
  // 'http://danielalarcon.com.br/php/'AMAZON   'http://52.67.83.144/php/'
var data = new Date();
var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear();  	

$("[data-role=page]").each(function(){
		 paginaAtual.push($(this).attr('id'));
});


//$('.qua').html(paginaAtual)

var servidor='http://skycamapp.net/php/';


var tela;
var statusDom;

function processUser() {
	if(location.search==''){
			window.location.href='./main.html';
		}
	if(location.search!=''){
		var parameters = location.search.substring(1).split("&");
		var temp = parameters[0].split("=");
		CodigoSky = unescape(temp[1]);
		if (typeof parameters[1] !== "undefined") {
			var temp = parameters[1].split("=");
			CodigoSky = unescape(temp[1]);
			//alert('tipo: '+CodigoSky);
		}
		
		$('#CodigoSky').val(CodigoSky);
		startaCalendario(CodigoSky);
		buscaPacienteAgenda(CodigoSky);
		trazProfissionais(CodigoSky);
	}
}
var carregando=function(){ 
	
	$('<div id="divAvisoEspecial"  class="avisoSkyCarrega text-center" style="border-radius:20px;padding:12px;height:140px !important"><img  height="50" src="img/check.png"/><img  height="50" src="img/cam.png"/><br><span id="textoAlerta" class="text-center"><b>Aguarde, por favor...</b></span><br><br><span class="text-center" id="txtperc"></span><div id="barraAviso" class="progress" style="height:3px;margin-top:10px;"><div id="barraAtualiza" class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div></div></div>').appendTo($('body'));
	
	
}
var aviso= function(msg){
	
	$('<div id="divAlerta" style="z-index:2147483647 !important;" class="avisoSky animated zoomIn panel-body text-center"><img  height="50" src="img/check.png"/><img  height="50" src="img/cam.png"/><h4 id="textoAlerta" class="text-center"><b>'+msg+'</b></h4></div>  ').appendTo($('body'));
	
	setTimeout(function (){
		$('#divAlerta').remove();
	},3000);
	
}
var avisoEspecial= function(msg){
	
	$('<div id="divAvisoEspecial"  class="panel panel-body text-center animated fadeInDown"><h4 id="textoAlertaEspecial" class="text-center text-muted"><b>'+msg+'</b></h4></div>').appendTo($('body'));
	
}
	
var cdCam;
var atualizacao=function(){$('<div id="divEnviaCanvasServidor" style="z-index:1000000;" class="avisoSky animated zoomIn panel-body text-center"><img  height="50" src="img/check.png"/><img  height="50" src="img/cam.png"/><h4 id="textoAlerta" class="text-center"><b>Aguarde, por favor...</b><br><p class="text-center" id="txtperc"></p><div class="progress" style="height:3px;"><div id="barraAtualiza" class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div></div></h4></div>  ').appendTo($('body'));
}


function LoginCloud(){
	
	$('#btnLoginCk').html('CONSULTANDO....');
	cp_clinica=$('#cp_clinica').val().replace('.','').replace('.','').replace('.','').replace('-','');
	cSky=$('#cSky').val();
	
	if(cp_clinica=="" || cSky==""){
		aviso('Preencha os campos corretamente');
		$('#btnLoginCk').html('ENTRAR');
		return true;
	}
	
	
	var dataString='cSky='+cSky+'&cp_clinica='+cp_clinica;
	
		$.ajax({
			url: servidor+"login_dentistaweb.php",
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
					if(!data){
						aviso('Login ou senha inválidos');
						$('#btnLoginCk').html('ENTRAR').removeClass('btn-danger').addClass('btn-primary');
						return true;
					}
					for (conta = 0; conta < data.retorno.length; conta++){
						
						
						
						var array_retotno=data.retorno[conta];
						var ultimo = $(array_retotno).get(-1);	
					
					
						$('#idclinica').val(ultimo.Id_clinica); 
						$('#modalCodigo').addClass('hide');
						
						$('#logo_clinica').attr('src', ultimo.Logo_clinica);
						$('#nome_clinica').val(ultimo.Nome_clinica);
						$('#fone_clinica').val(ultimo.Fone_clinica);
						$('#endereco_clinica').val(ultimo.Endereco_clinica);
						$('#email_clinica').val(ultimo.Email_clinica);
						$('#site_clinica').val(ultimo.SiteClinica);
						$('#cep_clinica').val(ultimo.Cep_clinica);
						$('#responsavel_clinica').val(ultimo.Responsavel_clinica);
						$('#cro_clinica').val(ultimo.Cro_clinica);
						$('#cidade_clinica').val(ultimo.Cidade_clinica)
						$('#uf_clinica').val(ultimo.UF_clinica);
						$('#camera_skySerial').val(ultimo.Codigo_camera_sky);
						
						$('#caminhoLogoClinicaOffline').html(ultimo.Logo_clinica_offline)
						$('#cpf_cnpj_clinica').val(ultimo.Cpf_cnpj_clinica);
						$('.email_da_clinica').html(ultimo.Email_clinica);
						$('.nomeClinicaEmail').html(ultimo.Nome_clinica);
						$('#CodigoSky').val(ultimo.CodigoSky);
						
						
						cdCam=ultimo.plano_Usuario;
					}
					var xSrt='cdCam='+cdCam;
					lerPlano(xSrt);
					
						
						
						
			},error: function(){
				abraModalBrowser();
			}
		 });//Termina Ajax
	
}
function lerPlano(xSrt){
	$('#btnLoginCk').html('PLANOS...');
	if(cdCam=="Experimental" || cdCam=="" || cdCam==null || cdCam=="null"){
		$('#Login').slideUp(1200);
		$('#pageInicio').removeClass('hide');
		$('#ZonaHeader').removeClass('hide');
		$('#btnLoginCk').html('ENTRAR');
			
	}else if(cdCam=="EXPIRADO"){
		$('#paginaPagamento').removeClass('hide');
		$('#Login').slideUp(1200);
		return true;
	}else{
	$('#tp_pplanno').html(cdCam);
	$.ajax({
			url: servidor+"lerPlanosweb.php",
			type: "GET",
            data: xSrt,
			dataType:"JSON",
            success: function(data){
				xxx='';
				anam='';
				Visu='';
				arm='';
				cons='';
				rec='';
				pac='';
				pro='';
				sec='';
				anam='';
				avim='';
				edim='';
				comim='';
				rx='';
				emim='';
				mntl='';
				planooo='';
				
					if(data.planos[0].visualizacao=='N'){
						$('#btnVisuImg').removeAttr('onclick');
						$('#btnVisuImg').attr('title','Esta é a  Visualização das imagens :: Você não possui este serviço em seu pacote.');
						$('#btnVisuImg').find('img').css('-webkit-filter', 'grayscale(100%)');
						$('#btnVisuImg').find('img').css('-moz-filter', 'grayscale(100%)');
						$('#btnVisuImg').find('img').css('filter', 'grayscale(100%)');	
						
						$('#btnVisuLaudo').removeAttr('onclick');
						$('#btnVisuLaudo').attr('title','Esta é a  Visualização de Laudos :: Você não possui este serviço em seu pacote.');
						$('#btnVisuLaudo').find('img').css('-webkit-filter', 'grayscale(100%)');
						$('#btnVisuLaudo').find('img').css('-moz-filter', 'grayscale(100%)');
						$('#btnVisuLaudo').find('img').css('filter', 'grayscale(100%)');
						
					}
					
					
					if(data.planos[0].armazenamento=='N'){
						arm='<i class="fa fa-close text-danger text-right pull-right"></i>';	
					}
					if(data.planos[0].armazenamento=='S'){
						arm='<i class="fa fa-check text-success text-right pull-right"></i>';	
					}
					/*
					if(data.planos[conta].app_consultorio=='N'){
						cons='<i class="fa fa-close text-danger text-right pull-right"></i>';	
					}
					if(data.planos[conta].app_consultorio=='S'){
						cons='<i class="fa fa-check text-success text-right pull-right"></i>';	
					}
					
					if(data.planos[conta].app_recepcao=='N'){
						rec='<i class="fa fa-close text-danger text-right pull-right"></i>';	
					}
					if(data.planos[conta].app_recepcao=='S'){
						rec='<i class="fa fa-check text-success text-right pull-right"></i>';	
					}
					*/
					if(data.planos[0].cadastro_pacientes=='N'){
						$('#btnCadPac').removeAttr('onclick');
						$('#btnCadPac').attr('title','Este é o  Cadastro de Pacientes :: Você não possui este serviço em seu pacote.');
						$('#btnCadPac').find('img').css('-webkit-filter', 'grayscale(100%)');
						$('#btnCadPac').find('img').css('-moz-filter', 'grayscale(100%)');
						$('#btnCadPac').find('img').css('filter', 'grayscale(100%)');
						
							
					}
					if(data.planos[0].cadastro_pacientes=='S'){
						//pac='<i class="fa fa-check text-success text-right pull-right"></i>';	
					}
					
					if(data.planos[0].cadastro_profissionais=='S'){
						//pro='<i class="fa fa-check text-success  text-right pull-right"></i>';	
							
					}
					if(data.planos[0].cadastro_profissionais=='N'){
						$('#btnAdicionaProfissa').css('background','#999','opacity','0.2');
						$('#btnAdicionaProfissa').removeAttr('onclick');
						$('#btnAdicionaProfissa').attr('title','Este é o Cadastro de Profissionais :: Você não possui este serviço em seu pacote.');
							
						
					}
					
					if(data.planos[0].cadastro_secretaria=='S'){
						
					}
					if(data.planos[0].cadastro_secretaria=='N'){
						$('#btnCadastroSecre').css('background','#999','opacity','0.5');
						$('#btnCadastroSecre').removeAttr('onclick');	
						$('#btnCadastroSecre').attr('title','Este é o Cadastro de Secretária :: Você não possui este serviço em seu pacote.');
							
					}
					
					if(data.planos[0].cadastro_anamnese=='N'){
						$('#c-circle-nav__toggle').css('background-color','#000');
						$('#c-circle-nav__toggle').removeAttr('onclick');
						$('#c-circle-nav__toggle').attr('title','Este é o Cadastro de Anamnese :: Você não possui este serviço em seu pacote.');
										
					}
					if(data.planos[0].cadastro_anamnese=='S'){
							
					}
					
					if(data.planos[0].avaliacao_imagens=='N'){
						$('#btnVerficaIm').css('background','#999','opacity','0,2');
						$('#btnVerficaIm').removeAttr('onclick');
						$('#btnVerficaIm').attr('title','Esta é a Validação de Imagens :: Você não possui este serviço em seu pacote.');
							
					}
					if(data.planos[0].avaliacao_imagens=='S'){
							
					}
					
					if(data.planos[0].edicao_imagens=='N'){
						
						$('#btnEDit').removeAttr('onclick');
						$('#btnEDit').attr('title','Esta é a  Edição de Imagens :: Você não possui este serviço em seu pacote.');
						$('#btnEDit').find('img').css('-webkit-filter', 'grayscale(100%)');
						$('#btnEDit').find('img').css('-moz-filter', 'grayscale(100%)');
						$('#btnEDit').find('img').css('filter', 'grayscale(100%)');	
					}
					
					if(data.planos[0].comparar_imagens=='N'){
						$('#btnComparaIm').removeAttr('onclick');
						$('#btnComparaIm').attr('title','Esta é a  Comparação de Imagens :: Você não possui este serviço em seu pacote.');
						$('#btnComparaIm').find('img').css('-webkit-filter', 'grayscale(100%)');
						$('#btnComparaIm').find('img').css('-moz-filter', 'grayscale(100%)');
						$('#btnComparaIm').find('img').css('filter', 'grayscale(100%)');		
					}
					
					if(data.planos[0].adicionar_raiox=='N'){
						$('#btnVerRX').removeAttr('onclick');
						$('#btnVerRX').attr('title','Esta é a Galeria de Raio-X :: Você não possui este serviço em seu pacote.');
						$('#btnVerRX').find('img').css('-webkit-filter', 'grayscale(100%)');
						$('#btnVerRX').find('img').css('-moz-filter', 'grayscale(100%)');
						$('#btnVerRX').find('img').css('filter', 'grayscale(100%)');		
					}
					
					
					if(data.planos[0].imagens_email=='N'){
						$('#btnEnviaIm').removeAttr('onclick');
						$('#btnEnviaIm').attr('title','Este é o  Envio de Imagens por email :: Você não possui este serviço em seu pacote.');
						$('#btnEnviaIm').find('img').css('-webkit-filter', 'grayscale(100%)');
						$('#btnEnviaIm').find('img').css('-moz-filter', 'grayscale(100%)');
						$('#btnEnviaIm').find('img').css('filter', 'grayscale(100%)');	
					}
					
					if(data.planos[0].montagem_laudo=='N'){
						$('#botaoLaudoCheckup').removeAttr('onclick');
						$('#botaoLaudoCheckup').attr('title','Esta é Montagem de Laudos :: Você não possui este serviço em seu pacote.');
						$('#botaoLaudoCheckup').find('img').css('-webkit-filter', 'grayscale(100%)');
						$('#botaoLaudoCheckup').find('img').css('-moz-filter', 'grayscale(100%)');
						$('#botaoLaudoCheckup').find('img').css('filter', 'grayscale(100%)');	
					}
					
				
				$('#Login').slideUp(1200);
				$('#pageInicio').removeClass('hide');
				$('#ZonaHeader').removeClass('hide');
				$('#btnLoginCk').html('ENTRAR');
			},
			error: function(){
				aviso('Erro na leitura de planos');
				return true;
			}
		})
	}
}
function semplano(){
	mensagem="Esse item não faz parte do seu pacote de serviços!";
	som="erro";
	icone="alerta";
	envia_alerta(mensagem,icone,som)
}
function pageSecretaria(cSky){
	window.location.href='./agenda.html?CodigoSky='+cSky;
}
function abraModalBrowser(){
	//aviso('Verifique sua conexão');
	$('#divBrowserNavegadorAtualizaNET').modal('show');
}
var CodigoSky=$('#CodigoSky').val();
function trocaTela(){
	$('#odontoLaudoInfantil').addClass('hide');
	$('#odontoLaudoAdulto').addClass('hide');
	
	if(tela=='pagePaciente' || tela=='pageDadosConsultorio' || tela=='pageConfiguracoes' || tela=='modalPacientes' || tela=='pageAdProfissional' || tela=='pageCadastroGeral' || tela=='pageYoutube' || tela=='pageListaMusicas' || tela=='pageLogins'){
		//aviso(tela);
		fpageInicio();
	}
	if(tela=='pageCaptura'){
		//aviso(tela);
		if(galeria_aberta==true){
			fpageCapturaGaleria();
			return true;
		}else{
		fpageProntuario();
		}
	}
	if(tela=='pageProntuario' || tela=='pageListaCheckups'){
		//aviso(tela);
		fpagePaciente();
	}
	if(tela=='telaComparaFotos' || tela=='pageVisualizarLaudo'){
		//aviso(tela);
		fpageProntuario();
	}
	if(tela=='pageEditar'|| tela=='pageEntretenimento'){
		//aviso(tela);
		fpageProntuario();
	}
	if(tela=='galeriaCheckup'){
		fechaGaleria();
	}
}
function telaCHEIA(){
	toggleFullScreen(document.body);
	$('#conexaoInternet').toggleClass('fa fa-arrows-alt fa fa-compress');
}
function lerFotosBanco(){
	
	var tela_prontuario=$('#listaDeCheckups').html();
	var data = new Date();
   	var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear(); 
  




$('#listaDeCheckups').html('');
$('#galeriaCheckupLista').html('');

	var nome_paciente=$('.paciente_nome').html();
	var CodigoSky=$('#CodigoSky').val();
	
	dataString='CodigoSky='+CodigoSky+'&nome_paciente='+nome_paciente;
	dataStringImg='CodigoSky='+CodigoSky+'&nome_paciente='+nome_paciente;

		$.ajax({
			url: servidor+"lerCheckup.php",
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
						
					
						
					if(!data){
						monta_pront1='<h3 id="prontuarioSemRegistro" class="corbranca  animated fadeInRight">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;O paciente ainda não possui registros</h3>';
						$('#listaDeCheckups').append(monta_pront1);
					}else{
						
						for (conta = 0; conta < data.retorno.length; conta++){
							
							  monta_pront='<div id="listaCheckupRealizados'+data.retorno[conta].id+'" >';
							  monta_pront+='<div style="width:700px;margin-left:25px;">';
							  monta_pront+='	  <a  href="#" onclick="verMenosCarrossel('+data.retorno[conta].id+')"><img src="img/btnUpL.png" class="img-circle botoes" /></a>';
							  monta_pront+=' <a  href="#" onclick="verMaisCarrossel('+data.retorno[conta].id+')"><img src="img/btnDownR.png" class="img-circle botoes" /></a>';
							  monta_pront+=' <span class="corbranca tituloCk"><a href="#" class="btnMarcaTodas  '+data.retorno[conta].id+'"><span class="cd_ck hide">'+data.retorno[conta].id+'</span> <img src="img/check_img.png" style="height:40px;" class="img-circle"/></a> <a href="#" class="btnMarcaTodas2 '+data.retorno[conta].id+' hide"><span class="cd_ck hide">'+data.retorno[conta].id+'</span> <img src="img/check_img2.png" style="height:40px;" class="img-circle"/></a>'+data.retorno[conta].Data_imagem+'</span></div>';
							 monta_pront+=' <div class="Scroola" id="corpo'+data.retorno[conta].id+'">';		
							  monta_pront+='	<div class="scrollmenu" style="overflow-x:scroll" id="capturaCheckupListaFotos'+data.retorno[conta].Cod_checkup+'"></div>';
							  monta_pront+='</div>';
							 
							
							 monta_pront+='</div><div class="linhaespaco"></div><br>';
							 $('#listaDeCheckups').append(monta_pront);
						}
						
		
					}	
					
					$.ajax({
						url: servidor+"lerCheckupImagens.php",
						type: "GET",
						data: dataStringImg,
						dataType:"json",
						success: function(data){
							for (conta = 0; conta < data.retorno.length; conta++){
								var numerodente=data.retorno[conta].Numero_dente;
								var foto_im=data.retorno[conta].Imagem;
								if(numerodente==""){
									xclasse='hide';
									
								}else{
									xclasse='';
									
								}
								
									div_pront = $('<a href="#" class="check_foto"><span class="idCaptura hide">'+data.retorno[conta].Id_captura+'</span><span class="codigoCk hide">'+data.retorno[conta].Cod_checkup+'</span><span class="imagemEmail hide">'+data.retorno[conta].Imagem+'</span> <span class="iddafoto hide">'+data.retorno[conta].id+'</span>   <span id="doencaFoto'+data.retorno[conta].id+'" class="enfer hide">'+data.retorno[conta].Nome_enfermidade+'</span>   <span id="sessaoFoto'+data.retorno[conta].id+'" class="hide">'+data.retorno[conta].Sessoes_tratamento+'</span>  <span id="valorFoto'+data.retorno[conta].id+'" class="hide">'+data.retorno[conta].Valor_enfermidade+'</span><img src="'+foto_im+'" id="'+data.retorno[conta].id+'"  data-src-error="img/img_erro.jpg" class="fotoListaCheckup img-responsive" /><span class="numero_Dente">'+data.retorno[conta].Numero_dente+'</span><span id="Dente'+data.retorno[conta].id+'" class="numeroDente hide">'+data.retorno[conta].Numero_dente+'</span> <img src="img/temOdonto.jpg" id="temOdonto'+data.retorno[conta].Id_captura+'" class="temOdontograma  '+xclasse+'  hide" /><img src="img/temRaiox.png" id="temRaioX'+data.retorno[conta].id+'" class="temRaioX hide" /><span id="texto_prontuario'+data.retorno[conta].id+'" class="descricao">'+data.retorno[conta].Data_imagem+ '</span></a>').click(function(){ 
									$(this).find('img').toggleClass('Selecionada');
									$(this).find('span.descricao').toggleClass('Selecionada');
									$(this).find('.numeroDente').toggleClass('Selecionada');
								}).prependTo($('#capturaCheckupListaFotos'+data.retorno[conta].Cod_checkup))
								
							
							div_galeria = $('<div class="_galeria"><span class="codigoCk hide">'+data.retorno[conta].Cod_checkup+'</span> <span class="numeroDente ">'+data.retorno[conta].Numero_dente+'</span></div>').click(function(){ 
									$(this).find('img.galeria').toggleClass('Selecionada');
									$(this).find('p.album').toggleClass('Selecionada');
								}).prependTo($('#galeriaCheckupLista'));
									   
						galeriax = $("<img/>", { 
										src: data.retorno[conta].Imagem,
										id:data.retorno[conta].id,
										class:'galeria img-responsive',
											
									}).appendTo(div_galeria);
								
						texto_div = $('<p id="texto_galeria'+data.retorno[conta].id+'" class="descricao album">'+data.retorno[conta].Data_imagem+ "/" +data.retorno[conta].Nome_enfermidade+'</p>').appendTo(div_galeria);

					}//FOR
					$('img[data-src-error]').error(function() {
						var o = $(this);
						var errorSrc = o.attr('data-src-error');
			
						if (o.attr('src') != errorSrc) {
							o.attr('src', errorSrc);
						}
					});
						},
						
						complete:function(){
							
						}
					});
				
			},
			error:function(){
				salvaErro("lerPacientes.php");
			}
		 });//Termina Ajax
	

}
$('body').on('click','a.btnMarcaTodas', function(e){
   var codigo=$(this).find('.cd_ck').first().html();
   
   $('#corpo'+codigo+'>.scrollmenu').children([]).find('img').addClass('Selecionada');
   $('#corpo'+codigo+'>.scrollmenu').children([]).find('span').addClass('Selecionada');
   //$('#corpo'+codigo+'>.scrollmenu').children(['img']).toggleClass('Selecionada');
   //alert(codigo+'1')
   $('a.btnMarcaTodas.'+codigo).addClass('hide');
   $('a.btnMarcaTodas2.'+codigo).removeClass('hide');
})
$('body').on('click','a.btnMarcaTodas2', function(e){ 	
   var codigo=$(this).find('.cd_ck').first().html();
   $('#corpo'+codigo+'>.scrollmenu').children([]).find('img').removeClass('Selecionada');
   $('#corpo'+codigo+'>.scrollmenu').children([]).find('span').removeClass('Selecionada');
   $('a.btnMarcaTodas2.'+codigo).addClass('hide');
   $('a.btnMarcaTodas.'+codigo).removeClass('hide');
})	

//UPLOAD DO ARQUIVO PARA O SERVIDOR
function uploadServidor(imageURI) {

   $('#progresso').removeClass('hide');

  nome_paciente=$('#nome_paciente').val();
   var fileURL = imageURI;
   var uri = encodeURI(servidor+"uploadImagens.php");
   var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear();  	  
   paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	   
   var sequencia=conta_foto;//mexi agora
   var CodigoSky=$('#CodigoSky').val();
   var options = new FileUploadOptions();	
   options.fileKey = "file";
   options.fileName = "imagens/clinica"+CodigoSky+paciente+"_"+dia+"-"+mes+"-"+ano+"-"+sequencia+".jpg";
   options.mimeType = "image/jpg";
   var headers = {'headerParam':'headerValue'};
   options.headers = headers;
   var ft = new FileTransfer();
   
   ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var percentual = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			$('#xxxxx').css('width', percentual+'%');
			//navigator.notification.activityStart("SKYCAM CLOUD", perc +"% enviado");
		} else {
			$('#xxxxx').css('width', percentual+'%');
		}
	};
   ft.upload(fileURL, uri, onSuccess, onError, options);
   function onSuccess(r) {
	 $('#progresso').addClass('hide');
	 $('#xxxxx').css('width', '0%');
      console.log("Codigo = " + r.responseCode);
      console.log("Resposta = " + r.response);
      console.log("Enviado = " + r.bytesSent);
	 
   }

   function onError(error) {
	  $('#progresso').addClass('hide');
	 
	  salvaErro("Metodo uploadServidor "+error.code+ "--"+error.source+" Alvo "+error.target);
		
   }
	
}



function enviaImagemProServidor(){
	//alert('entrou na function enviaImagemProServidor')
   var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear();  	  
   var CodigoSky=$('#CodigoSky').val();
	nome_clinica=$('#nome_clinica').val();
paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');
nome_paciente=$('.paciente_nome').html();
nome_dentista=$('.dentista_nome').html();	
   var sequencia=conta_foto;
   var data_imagem=dia+'-'+mes+'-'+ano;
   var nomeFoto=paciente+data_imagem+'-'+conta_foto;
   doenca=$('#doencaFoto'+conta_foto).html();
   tempo_sessao =$('#sessaoFoto'+conta_foto).html();
   valor_doenca =$('#valorFoto'+conta_foto).html();
   var num=$('#Dente'+conta_foto).html();
   
	cod_checkup="ck"+paciente+dia+mes+ano;
	idpaciente=$('#idPaciente').html();    
	data_imagem=dia+'-'+mes+'-'+ano;
	nome_enfermidade='';
	sessoes_tratamento='';
	valor_enfermidade='';
    imagem=servidor+"imagens/clinica"+CodigoSky+paciente+"_"+dia+"-"+mes+"-"+ano+"-"+sequencia+".jpg";
   	imagem_offline="file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/ImagensCheckup/"+data_imagem+"/"+nomeFoto+".jpg";
    dataString='CodigoSky='+CodigoSky+'&cod_checkup='+cod_checkup+'&nome_dentista='+nome_dentista+'&idpaciente='+idpaciente+'&nome_paciente='+nome_paciente+'&imagem='+imagem+'&imagem_offline='+imagem_offline+'&data_imagem='+data_imagem+'&nome_enfermidade='+nome_enfermidade+'&sessoes_tratamento='+sessoes_tratamento+'&valor_enfermidade='+valor_enfermidade+'&numero_dente='+numero_dente+'&raiox='+raiox+'&nome_clinica='+nome_clinica;
	
	//alert(dataString)
		$.ajax({
			url: servidor+"salvaImagemCheckup.php",
			type: "GET",
            data: dataString,
			//dataType:"json",
            success: function(data){
					//alert('sssuuuucccceeeessssooooo');
			},
			error:function(){
				salvaErro("salvaImagemCheckup.php");
			}
		});
   
}





	


		
function temDoenca(){
	$('#listaEnfermidadesCheckup').removeClass('hide');
	$('#doencaCheckup').addClass('escolheDoenca');
}
$('.doencaCaptura').on('click', function() {
   $('#doencaCheckup').removeClass('escolheDoenca selectDoenca');
   $('#listaEnfermidadesCheckup').addClass('hide');
   nome_paciente=$('.paciente_nome').html();
   var id=conta_foto;
   //imagem=$('#pro'+conta_foto).attr('src');
   //Tipo da enfermidade
   var nome_enfermidade=$(this).find('h5.tipoDoenca').first().html();
   //quantidade de sessoes para a doenca
   var sessoes_tratamento =$(this).find('span.TempoSessao').first().html();
   //valor para a doenca
   var valor_enfermidade =$(this).find('span.valorDoenca').first().html();
   var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear();
	$("#doencaFoto"+conta_foto).html(nome_enfermidade);
	$("#sessaoFoto"+conta_foto).html(sessoes_tratamento);
	$("#valorFoto"+conta_foto).html(valor_enfermidade);
	data_imagem=dia+'-'+mes+'-'+ano;
	//alert(doenca+"--"+tempo_sessao+"---"+valor_doenca);
	descricao_galeria= dia+'-'+mes+'-'+ano+'-'+nome_enfermidade;
	$("#texto_galeria"+conta_foto+".descricao.album").html(descricao_galeria);
	$("#texto_prontuario"+conta_foto+".descricao").html(descricao_galeria);	
	raiox='';
	numero_dente=$('#Dente'+conta_foto+'.numeroDente').html();
	
	updateDoenca(nome_enfermidade, sessoes_tratamento, valor_enfermidade, id);
});

function fechaDoenca(){
	$('#doencaCheckup').removeClass('selectDoenca');
}

function updateDoenca(nome_enfermidade, sessoes_tratamento, valor_enfermidade, id) {
	nome_clinica=$('#nome_clinica').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','');
	
	
	dataString='nome_enfermidade='+nome_enfermidade+'&sessoes_tratamento='+sessoes_tratamento+'&valor_enfermidade='+valor_enfermidade+'&nome_clinica='+nome_clinica;
	
	
		$.ajax({
			url: servidor+"updateEnfermidade.php",
			type: "GET",
            data: dataString,
			//dataType:"json",
            success: function(data){
					//alert('sss');
			},
			error:function(){
				salvaErro("updateEnfermidade.php");
			}
		});


    db.transaction(function (tx) {

        var query = "UPDATE tabelaImagens SET Nome_enfermidade = ?, Sessoes_tratamento = ?, Valor_enfermidade = ? WHERE id = ?";

        tx.executeSql(query, [nome_enfermidade, sessoes_tratamento, valor_enfermidade, id], function(tx, res) {
            //alert("insertId: " + res.insertId);
            //alert("rowsAffected: " + res.rowsAffected);
        },
        function(tx, error) {
           aviso('UPDATE error: ' + error.message);
        });
    }, function(error) {
       aviso('transaction error: ' + error.message);
    }, function() {
       // aviso('transaction ok');
    });
}


		 
		



function atualiza(){
	var versionCode = AppVersion.build
	var updateUrl = "http://qsvideos.com.br/ft9new/version.xml";
	window.AppUpdate.checkAppUpdate(ChecaSuccess, ChecaFail, updateUrl);
}
function ChecaSuccess(){
	//alert('chamou');
}
function ChecaFail(){
	//alert('fudeu');
}

//CHECAR CONEXAO
function checarConexao() {
    var networkState = navigator.connection.type;
	var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
	
	if(states[networkState]=='Unknown connection'|| states[networkState]=='No network connection'){
		$('#conexaoInternet').removeClass('fa fa-wifi fa-2x text-right pull-right corbranca').addClass('fa fa-ban fa-2x text-right pull-right  text-danger');
		$('.semInternet').removeClass('hide');
		//setInterval(checarConexao,5000);
		$('#c-circle-nav').addClass('hide');
		Offline=true;
		
	}else{
		Offline=false;
		$('#conexaoInternet').removeClass('fa fa-ban fa-2x text-right pull-right  text-danger').addClass('fa fa-wifi fa-2x text-right pull-right corbranca');
		$('#c-circle-nav').removeClass('hide');
		$('.semInternet').addClass('hide');
		$.ajax({
			url: servidor+"checaAtualizacao.php",
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
				 if(data.retorno[0].atualizarSoftware=="S"){
					 atualiza();
				 }else{
				 }
			},error: function(){
				salvaErro('checaAtualizacao.php');
			}
		 });
		
		
		
	}
	hora();
	
	
}

function salvaErro(tipo_erro){
	
	IdMaquina=oDevice.uuid;
	nome_clinica=$('#nome_clinica').val();
	dataString='tipo_erro='+tipo_erro+'&IdMaquina='+IdMaquina+'&nome_clinica='+nome_clinica;
	
	$.ajax({
			url: servidor+"checaErro.php",
			type: "GET",
            data: dataString,
			//dataType:"json",
            success: function(data){
			}
		 });
}

function fechaComunicadoInternet(){
	$('.semInternet').remove();	
}
function conhecerPlano(){
	$('.semInternet').addClass('hide');
	$('#propagandaCloud').removeClass('hide');
}
function aderirPlano(){
	$('#propagandaCloud').addClass('hide');
	$('#home').removeClass('hide');
}
function  fechaPropaganda(){
	$('#propagandaCloud').addClass('hide');
}










/*****PAGINAS******/

function cadastroSecretaria(){
	CodigoSky=$('#CodigoSky').val();
	dataString='CodigoSky='+CodigoSky;
	
	$.ajax({
			url: servidor+"lerSecretaria.php",
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
				if(!data){
					aviso('Você ainda não cadastrou a Secretária');
					botoes='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
					botoes+='<a class="btn transparente corbranca" href="#" onclick="fsalvaSecretaria()"><i class="fa fa-2x fa-save text-left pull-left ic_rodape"></i><span style="font-size:20px">Salvar</span></a>';
					$('#botoesRodape').html(botoes);
				}else{
					botoes='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	//botoes+='<a class="btn transparente corbranca" href="#" onclick="fsalvaSecretaria()"><i class="fa fa-2x fa-save text-left pull-left ic_rodape"></i><span style="font-size:20px">Salvar</span></a>';
					$('#botoesRodape').html(botoes);
					$('#nome_secretaria').val(data.retorno[0].Nome_secretaria);
					$('#fone_secretaria').val(data.retorno[0].Fone_secretaria);
					$('#cpf_secretaria').val(data.retorno[0].Cpf_secretaria);
					$('#email_secretaria').val(data.retorno[0].Email_secretaria);
					$('#email_notificacao').val(data.retorno[0].Email_notificacao);
				}
					
			},
			error:function(){
				aviso('Erro! Repita a gravação');
			}
		});
	esconde_pag();
	$('#modalProfissionais').toggleClass('curto');
	$('.opcoesDentista1').addClass('hide');
	$('.opcoesDentista2').addClass('hide');
	$('.opcoesDentista3').addClass('hide');
	$('.opcoesDentista4').addClass('hide');
	$('.opcoesDentista5').addClass('hide');
	
	$('.botaoEsquerdoInicio').removeClass('esquerda');
	$('.botaoDireitoInicio').removeClass('esquerda');
	$('#modalBuscaPaciente').addClass('hide');
	$('#botoesListaPacientes').removeClass('hide');
	$('#modalBuscaPaciente').addClass('hide');
	$('#botoesListaPacientes').addClass('hide');
	
	$('#pageInicio').addClass('hide');
	
	
	
	$('#ZonaFooter').removeClass('hide');
	$('#pageSecretaria').removeClass('hide');


}
function fsalvaSecretaria(){
	CodigoSky=$('#CodigoSky').val();
	nome_secretaria = $('#nome_secretaria').val();
	fone_secretaria = $('#fone_secretaria').val();
	cpf_secretaria = $('#cpf_secretaria').val().replace('.','').replace('.','').replace('.','').replace('-','');
	email_secretaria = $('#email_secretaria').val();
	email_notificacao = $('#email_notificacao').val();
	if(nome_secretaria=="" || fone_secretaria=="" || cpf_secretaria=="" || email_secretaria=="" || email_notificacao=="" ){
		aviso('Preencha todos os campos');
		return true;
	}
	dataString='CodigoSky='+CodigoSky+'&nome_secretaria='+nome_secretaria+'&fone_secretaria='+fone_secretaria+'&cpf_secretaria='+cpf_secretaria+'&email_secretaria='+email_secretaria+'&email_notificacao='+email_notificacao;
	
	$.ajax({
			url: servidor+"salvaSecretaria.php",
			type: "GET",
            data: dataString,
            success: function(data){
					aviso('Dados salvos');
					fpageInicio();
			},
			error:function(){
				aviso('Erro! Repita a gravação');
			}
		});
}

function fpageInicio(){
	tela=paginaAtual[2];
	
	$('.miniatura.transp').remove();
	$(".botaoSelecionaCameraHome").addClass('hide');
	$('#home').addClass('hide');
	$('#pageCadastroInicio').addClass('hide');
	$('#pageNetFlix').addClass('hide');
	$('#pageYoutube').addClass('hide');
	$('#pageEditar').addClass('hide');
	$('#pageListaMusicas').addClass('hide');
	$('#pagePesquisa').addClass('hide');
	$('.painelDireita').addClass('hide');
	$('.painelEsquerda ').addClass('hide');
	$('#pageCaptura').addClass('hide');
	$('#pageProntuario ').addClass('hide');
	$('.btnvoltar').addClass('hide');
	$('#pageConfiguracoes').addClass('hide');
	$('.laudo ').addClass('hide');
	$('#ZonaFooter').addClass('hide');
	$('#pagePaciente').addClass('hide');
	$('#modalBuscaPaciente').addClass('hide');
	$('#modalPacientes').addClass('hide');
	$("#pageLogins").addClass("hide");
	$('#modalCheckupGuiado').addClass('hide');
	$('#botoesListaPacientes').addClass('hide');
	$('#pageDadosConsultorio').addClass('hide');
	$('#pageAdProfissional').addClass('hide');
	$('#pageCadastroGeral').addClass('hide');
	$('#pageSecretaria').addClass('hide');
	usandoPaciente=$('.paciente_nome').html();

	$('#pageInicio').removeClass('hide').addClass('ativa');
	$('#ZonaHeader').removeClass('hide');
	$('.paciente_nome').html('');
	$('.paciente-header').addClass('hide');
	
	
	
		
}



function fpageEntretenimento(){
	tela=paginaAtual[16];
	$('#pageEntretenimento').toggleClass('pracima');
}

function entretenimento_logins(){
	$('#pageEntretenimento').toggleClass('pracima');
	$('#pageProntuario').addClass('hide');
	$('#pageListaMusicas').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageProntuario()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px"> Voltar</span></a>';
	
	
	
	$('#botoesRodape').html(botoes);
	$('#pageLogins').removeClass('hide');
}
function entretenimento_youtube(){
	$('#pageEntretenimento').toggleClass('pracima');
	$('#pageProntuario').addClass('hide');
	$('#pageListaMusicas').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageProntuario()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px"> Voltar</span></a>';
	
	
	
	$('#botoesRodape').html(botoes);
	$('#pageYoutube').removeClass('hide');
}
function entretenimento_musica(){
	
	$('#pageEntretenimento').toggleClass('pracima');
	$('#pageProntuario').addClass('hide');
	$('#pageYoutube').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageProntuario()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	$('#botoesRodape').html(botoes);
	$('#pageListaMusicas').removeClass('hide');
	
}

function fpageCadastro(){
	$('#pageInicio').addClass('hide').removeClass('ativa');
	$('#pageEditar').addClass('hide');
	$('.painelDireita').addClass('hide');
	$('.painelEsquerda ').addClass('hide');
	$('#pagePesquisa').addClass('hide');
	$('#pageProntuario ').addClass('hide');
	$('#pageCaptura').addClass('hide');
	$('#pageConfiguracoes').addClass('hide');
	$('#pageCadastroInicio').removeClass('hide').addClass('ativa');	
}

function configuracao(){
	esconde_pag();
	tela=paginaAtual[5];
	$('#pageInicio').addClass('hide');
	/*
	$('#pageEditar').addClass('hide');
	$('.painelDireita').addClass('hide');
	$('.painelEsquerda ').addClass('hide');
	$('#pagePesquisa').addClass('hide');
	$('#pageProntuario ').addClass('hide');
	$('#pageCaptura').addClass('hide');
	$('#pageCadastroInicio').addClass('hide');
	
	*/
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	$('#botoesRodape').html(botoes);
	$('#ZonaFooter').removeClass('hide');
	$('#pageConfiguracoes').removeClass('hide');
}




 

function fvisualizarListaCheckups(){
	nome_paciente=$('.paciente_nome').html();

		montaLaudoPaciente(nome_paciente);
	
	$('#pageInicio').addClass('hide');
	$('#pageCadastroInicio').addClass('hide');
	$('.painelDireita').removeClass('hide');
	$('.painelEsquerda ').removeClass('hide');
	$('#pagePesquisa').addClass('hide');
	$('#pageProntuario ').addClass('hide');
	$('#pageCaptura').addClass('hide');
	$('#pagePaciente').addClass('hide');
	$('.botaoDireitoInicio.esquerda').removeClass('esquerda');
	$('.botaoEsquerdoInicio.esquerda').removeClass('esquerda');  
	$('#modalBuscaPaciente').addClass('hide');
	$('#modalPacientes').addClass('hide');
	$('#pageEditar').addClass('hide');
	$('#modalConfigCamera').modal('hide');
	$('#pageConfiguracoes').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageProntuario()"><i class="fa fa-2x fa-angle-double-left ic_rodape text-left pull-left"></i><span style="font-size:20px">Voltar</span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" id="btnLaudoImportar" onclick="importarLaudo()"><i class="fa fa-2x fa-cloud-upload text-left pull-left ic_rodape"></i><span style="font-size:20px">Importar Laudo</span></a>';
	$('#botoesRodape').html(botoes);
	$('#pageListaCheckups').removeClass('hide');
	//tela=paginaAtual[15];
	tela=paginaAtual[12];
}


function fechaCarrossel(xxx){
	$('#CarrosselCheckup'+xxx).toggleClass('hide');	
}
function verCheckup(xxx){
	$('#CarrosselCheckup'+xxx).toggleClass('hide');	
	
}


function pageEditarFotos(){	
	
	tela=paginaAtual[11];
	$('#pageInicio').addClass('hide');
	$('#pageCadastroInicio').addClass('hide');
	$('.painelDireita').removeClass('hide');
	$('.painelEsquerda ').removeClass('hide');
	$('#pagePesquisa').addClass('hide');
	$('#pageProntuario ').addClass('hide');
	$('#pageCaptura').addClass('hide');
	$('#pagePaciente').addClass('hide');
	$('.botaoDireitoInicio.esquerda').removeClass('esquerda');
	$('.botaoEsquerdoInicio.esquerda').removeClass('esquerda');  
	$('#modalBuscaPaciente').addClass('hide');
	$('#modalPacientes').addClass('hide');
	$('#modalConfigCamera').modal('hide');
	$('#pageConfiguracoes').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageProntuario()"><i class="fa fa-2x fa-angle-double-left ic_rodape text-left pull-left"></i><span style="font-size:20px">Voltar</span></a>';
	$('#botoesRodape').html(botoes);
	$('#pageEditar').removeClass('hide');
	
	if($('#EditarFoto').hasClass('girado')){
		$('#EditarFoto').removeClass('girado');
	}			
}




/*--PAGE EDITAR--*/
function fpageProntuario(){
	 $('.odontogramaInfantil').addClass('hide');
	 $('.odontogramaAdulto').addClass('hide');
	 $('.odontogramaInfantilEditar').addClass('hide');
     $('.odontogramaAdultoEditar').addClass('hide');

	$('a.btnMarcaTodas2').addClass('hide');
   	$('a.btnMarcaTodas').removeClass('hide');
	$("#imprimeLaudo").html('').addClass('hide');
	$('#modalVisualizarRaiox').modal('hide');
	$('#modalUploadLaudo').modal('hide');
	lerFotosBanco();
	$('#layerGuiado').attr('src','').addClass('hide');
	$('.carousel-indicators.mCustomScrollbar.meartlab').html('');
	
	$('.odontogramaInfantil').addClass('hide');
	$('.odontogramaAdulto').addClass('hide');
	$('.mascaraAnteseDepois').remove();
	$('#odontoLaudoInfantil').addClass('hide');
	$('#odontoLaudoAdulto').addClass('hide');
	$('.miniatura.transp').remove();
	$('#doencaCheckup').removeClass('selectDoenca');
	$('#pageInicio').addClass('hide');
	$('#canvasMontaLaudo').addClass('hide');	
	$('#skyTexto').addClass('hide');
	$('#pageCadastroInicio').addClass('hide');
	$('#telaComparaFotos').addClass('hide');
	$('.painelDireita').addClass('hide');
	$('.painelEsquerda').addClass('hide');
	$('#pagePesquisa').addClass('hide');
	$('#pageListaCheckups').addClass('hide');
	$('#pageEditar').addClass('hide');
	$('#pageCaptura').addClass('hide');
	$('#pageConfiguracoes').addClass('hide');
	$('#pageYoutube').addClass('hide');
	$('#pageListaMusicas').addClass('hide');
	$('#pageLogins').addClass('hide');
	$('#pagePaciente').addClass('hide');
	$('#modalBuscaPaciente').addClass('hide');
	$('#modalPacientes').addClass('hide');
	$('#pageVisualizarLaudo').addClass('hide');
	$('#pageEditarLaudo').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpagePaciente()"><i class="fa fa-2x fa-angle-double-left ic_rodape text-left pull-left"></i><span style="font-size:20px">Voltar</span></a>';
	$('#botoesRodape').html(botoes);
	$('#pageProntuario').removeClass('hide');
	tela=paginaAtual[12];
	var editor_pelado = document.getElementById('EditarFoto');
	var	context0_pelado=editor_pelado.getContext('2d');
	context0_pelado.clearRect(0,0, 871, 490);
	context0_pelado.restore();
	var imagem_pelado=new Image();
	imagem_pelado.width = 871;
	imagem_pelado.height = 490;
	imagem_pelado.src='img/telalogo.png';
	context0_pelado.restore();
	degrees=180 % 360;
	editor_pelado.width = 871;
	editor_pelado.height = 490;
    context0_pelado.clearRect(0,0,editor_pelado.width,editor_pelado.height);
    
	context0_pelado.translate(imagem_pelado.width/2,imagem_pelado.height/2);
   
    context0_pelado.rotate(degrees*Math.PI/180);
    context0_pelado.drawImage(imagem_pelado,-imagem_pelado.width/2,-imagem_pelado.height/2);
	zeraCanvas();
	
}

//PAGE PACIENTE
function fpagePaciente(){
	
	$('#layerGuiado').attr('src','').addClass('hide');
	$('.odontogramaInfantil').addClass('hide');
	$('.odontogramaAdulto').addClass('hide');
	$('#doencaCheckup').removeClass('selectDoenca');
	$('#pageListaCheckups').addClass('hide');
	$('#pageProntuario ').removeClass('ativa').addClass('hide');
	$('#pageVisualizarLaudo').removeClass('ativa').addClass('hide');
	$('#pageEditarLaudo').removeClass('ativa').addClass('hide');
	$('#pageInicio').removeClass('ativa').addClass('hide');   
	$('#pageCaptura').removeClass('ativa').addClass('hide');
	$('#pagePaciente').removeClass('hide').addClass('ativa');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left ic_rodape text-left pull-left"></i><span style="font-size:20px">Voltar</span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="feditarPaciente()"><i class="fa fa-2x fa-pencil text-left ic_rodape pull-left"></i><span style="font-size:20px">Editar</span></a>';
	botoes+='<a class="btn transparente corbranca hide" href="#" onclick="fexcluirPaciente()"><i class="fa fa-2x fa-trash-o text-left pull-left ic_rodape"></i><span style="font-size:20px">Excluir</span></a>';
	$('#botoesRodape').html(botoes);
	$('#ZonaFooter').removeClass('hide');
	
	tela=paginaAtual[4];
}
//PAGE CAPTURA
function fpageCaptura(){
	$('#txtMsg').html('Essa funcionalidade está presente somente no SKYBRAIN');
	$('#modalAviso').modal('show');
	return true;
	tela=paginaAtual[10];
	$('#pageInicio').removeClass('ativa').addClass('hide');
	$('#pageCadastroInicio').removeClass('ativa').addClass('hide');
	$('.painelDireita').removeClass('hide');
	$('.painelEsquerda').removeClass('hide');
	$('#galeriaCheckup').addClass('hide');
	
	$('#pageEditar').removeClass('ativa').addClass('hide');
	$('#pageConfiguracoes').removeClass('ativa').addClass('hide');
	$('#pageProntuario ').removeClass('ativa').addClass('hide');
	$('#pagePaciente').removeClass('ativa').addClass('hide');
	$('#modalBuscaPaciente').removeClass('ativa').addClass('hide');
	$('#modalPacientes').removeClass('ativa').addClass('hide');
	botoes='<a class="btn transparente corbranca hide" href="#" onclick="cameraConfiguracao()" ><i class="fa fa-2x fa-tasks text-left pull-left ic_rodape"></i><span style="font-size:20px"> Configurações</span></a>';
	botoes+='<a class="btn transparente corbranca " href="#" onclick="menuCamera()" id="btnRodapeMenuCamera"><i class="fa fa-2x fa-bullseye text-left pull-left ic_rodape"></i><span style="font-size:20px"> Menu Câmera</span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="galeria()"><i class="fa fa-2x fa-photo text-left pull-left ic_rodape"></i><span class="contaFotosCheck" style="font-size:20px"></span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="fpageProntuario()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	$('#botoesRodape').html(botoes);
	
	$('.contaFotosCheck').html(imgCheckup);	
	$('#pageCaptura').removeClass('hide').addClass('ativa');
	
	//checarConexao();
	
	
}
function cameraConfiguracao(){
	$('#configuracaoDaCamera').toggleClass('escondida');
	checarConexao();
}

function fpageCapturaGaleria(){
	tela=paginaAtual[10];
	$('#pageInicio').removeClass('ativa').addClass('hide');
	$('#pageCadastroInicio').removeClass('ativa').addClass('hide');
	$('.painelDireita').removeClass('hide');
	$('.painelEsquerda').removeClass('hide');
	$('#galeriaCheckup').addClass('hide');
	
	$('#pageEditar').removeClass('ativa').addClass('hide');
	$('#pageConfiguracoes').removeClass('ativa').addClass('hide');
	$('#pageProntuario ').removeClass('ativa').addClass('hide');
	$('#pagePaciente').removeClass('ativa').addClass('hide');
	$('#modalBuscaPaciente').removeClass('ativa').addClass('hide');
	$('#modalPacientes').removeClass('ativa').addClass('hide');
	botoes='<a class="btn transparente corbranca " href="#" onclick="cameraConfiguracao()" ><i class="fa fa-2x fa-tasks text-left pull-left ic_rodape"></i><span style="font-size:20px"> Configurações</span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="menuCamera()" id="btnRodapeMenuCamera"><i class="fa fa-2x fa-bullseye text-left pull-left ic_rodape"></i><span style="font-size:20px"> Menu Câmera</span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="galeria()"><i class="fa fa-2x fa-photo text-left pull-left ic_rodape"></i><span class="contaFotosCheck" style="font-size:20px"></span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="fpageProntuario()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	$('#botoesRodape').html(botoes);
	$('#funcoesCamera').addClass('hide');
	$('.contaFotosCheck').html(imgCheckup);	
	$('#pageCaptura').removeClass('hide').addClass('ativa');
	
	
	
}

function fpageCapturaRapida(){
	tela=paginaAtual[10];
	$('#pageInicio').removeClass('ativa').addClass('hide');
	$('#pageCadastroInicio').addClass('hide');
	$('.painelDireita').removeClass('hide');
	$('.painelEsquerda').removeClass('hide');
	$('#pagePesquisa').addClass('hide');
	$('#pageEditar').addClass('hide');
	$('#pageConfiguracoes').addClass('hide');
	$('#pageProntuario ').addClass('hide');
	$('#pagePaciente').addClass('hide');
	$('#modalBuscaPaciente').addClass('hide');
	$('#modalPacientes').addClass('hide');
	botoes='<a class="btn transparente corbranca hide" href="#" onclick="menuCamera()"  id="btnRodapeMenuCamera"><i class="fa fa-2x fa-bullseye text-left pull-left ic_rodape"></i><span style="font-size:20px"> Menu Câmera</span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="galeria()"><i class="fa fa-2x fa-photo text-left pull-left ic_rodape"></i><span class="contaFotosCheck" style="font-size:20px"></span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	
	$('#botoesRodape').html(botoes);
	$('#ZonaFooter').removeClass('hide');
	$('#pageCaptura').removeClass('hide').addClass('ativa');
	
}

//TELA DE FUNCIONALIDADES DA CAMERA

$("#funcoesCamera").on('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	
	showAlerta();
	return true;
	
})


    function entendeu() {}
    function showAlerta() {
        navigator.notification.alert(
            'Escolha uma atividade no menu central!',  
            entendeu,         
            'SKYCAM CLOUD',            
            'Ok, Entendi'                  
        );
    }

$("#btnOdontogramaImg").on('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	$('#btnOdontogramaImg').toggleClass('ativado');
	$('#btnCheckupGuiadoImg').removeClass('ativado');
	$('#btnSeparadorImg').removeClass('ativado');
	$('#funcoesCamera').addClass('hide');
	$('#btnRodapeMenuCamera').removeClass('hide');
		
	if($('#btnOdontogramaImg').hasClass('ativado')){
		odonto_mascara=true;	
		//aviso(odonto_mascara);
		return true;
	}else{
		odonto_mascara=false;
		//aviso(odonto_mascara);
	}
	
})

function errouVideo(e) {
    aviso("Erro: "+JSON.stringify(e));
}

function pegouVideo(s) {
   // aviso("Success0");
    console.dir(s[0]);
    var video_dentista = "<div class='col-xs-2'><a href='#' class='video-galeria img-responsive'><video class='img-responsive' controls muted>";
    video_dentista += "<source src='" + s[0].fullPath + "' type='video/mp4' >";
    video_dentista += "</video></a>";
	$('#galeriaCheckup').append(video_dentista);
}

$('#btnVideoCapturaImg').on('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	$('#divSeparador').addClass('hide');
	$('#gridCaptura').removeClass('hide');
	$('#funcoesCamera').addClass('hide');
	$('#btnRodapeMenuCamera').removeClass('hide');
	navigator.device.capture.captureVideo(pegouVideo, errouVideo, {limit: 1, duration:20});
	
	
});



function menuCamera(){
	//e.preventDefault();
	//e.stopPropagation();
	
	$('#btCapt').remove();
	$('#divSeparador').addClass('hide');
	$('#gridCaptura').removeClass('hide');
	$('#btnRodapeMenuCamera').addClass('hide');
	$('#funcoesCamera').removeClass('hide');
	
};

$("#btnCheckupGuiadoImg").on('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	navigator.notification.confirm(
        'Aguardando conclusão da documentação do protocolo. ', 
         function(button) { 
            if ( button == 1 ) {
		         exame_guiado=false;
            }
			if ( button == 2 ) {
		        exame_guiado=false;
            }
         },            
        'ATIVAÇÃO DE CHECK-UP PROTOCOLADO ',           
        ['FECHAR']         
    );
	
	/*
	$('#funcoesCamera').addClass('hide');
	$('#btnRodapeMenuCamera').removeClass('hide');
	$('#btnCheckupGuiadoImg').toggleClass('ativado');
	$('#btnOdontogramaImg').removeClass('ativado')
	$('#btnSeparadorImg').removeClass('ativado');
	$('#divSeparador').addClass('hide');
	$('#gridCaptura').removeClass('hide');
	if($('#btnCheckupGuiadoImg').hasClass('ativado')){
		exame_guiado=true;	
		navigator.notification.confirm(
        'A partir de agora acompanhe o lado esquerdo da tela.\n A imagem corresponde ao dente que deve ser fotografado.\n Vamos iniciar?', 
         function(button) { 
            if ( button == 1 ) {
		        montaGuia();
            }
			if ( button == 2 ) {
		        exame_guiado=false;
            }
         },            
        'ATIVAÇÃO DE CHECK-UP PROTOCOLADO ',           
        ['INICIAR EXAME','CANCELAR']         
    );
	aviso(exame_guiado);	
		
	}else{
		exame_guiado=false;
		//aviso(exame_guiado);
	}
	*/
	
	
});




function montaGuia(){
	
	idadePaciente=$('#idadePaciente').html();
			if(idadePaciente<=12){
				$('#layerGuiado').attr('src', 'img/guiadoinfantil/infantil1.png').removeClass('hide');
				dente=1;
				$('#conta_Dente').html('51');
			}else{
				$('#layerGuiado').attr('src', 'img/guiadoadulto/adulto1.png').removeClass('hide');
				dente=1;
				$('#conta_Dente').html('11');
			}
		
	
}

$("#btnSeparadorImg").on('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	$('#funcoesCamera').addClass('hide');
	$('#btnRodapeMenuCamera').removeClass('hide');
	$('#btnOdontogramaImg').removeClass('ativado')
	$('#btnCheckupGuiadoImg').removeClass('ativado');
	$('#btnSeparadorImg').toggleClass('ativado');
	$('#divSeparador').toggleClass('hide');
	$('#gridCaptura').toggleClass('hide');
	return true;
});

function sorriso_perto(){
	$('#divSeparador').addClass('hide');
	$('#btnSeparadorImg').removeClass('ativado');
	$('#divSorrisoPerto').toggleClass('hide');
	$('#btnSorrisoPertoImg').toggleClass('ativado');
}


//GALERIA DE FOTOS DO CHECKUP
function galeria(){
	galeria_aberta=true;
	tela=paginaAtual[14];
	fechaDoenca();
	
	
	botoes='<a href="#" onclick="fechaGaleria()" class="btn transparente corbranca"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Fechar</span></a>';
    botoes+='<a class="btn transparente corbranca" href="#" onclick="selecionarTodosGaleria()"><i class="fa fa-2x fa-check-square-o text-left pull-left ic_rodape"></i><span style="font-size:20px">Selecionar todos</span></a>';
    botoes+='<a class="btn transparente corbranca" href="#" onclick="excluirFotosGaleria()"><i class="fa fa-2x fa-trash text-left pull-left ic_rodape"></i><span style="font-size:20px">Excluir</span></a>';
	$('#botoesRodape').html(botoes);
	$('.miniatura.transp').addClass('hide');  
	$('#pageCaptura').addClass('hide');
	$('#galeriaCheckup').removeClass('hide');
	$('.contaFotosCheck').html($("#qdtFotosGaleria").html());
	
}

function fechaGaleria(){
	galeria_aberta=false;
	$('#galeriaCheckup').addClass('hide');
	$('.miniatura.transp').removeClass('hide'); 
	fpageCapturaGaleria();
	
	contaUnidades();
	
}


function selecionarTodosGaleria() {
	$('.galeria').toggleClass('Selecionada');
	$('a.video-galeria').toggleClass('Selecionada');
	$('p.descricao.album').toggleClass('Selecionada');
	var fotoId =$('.galeria.Selecionada').attr('id');
	var videoId=$('a.video-galeria.Selecionada').attr('id');
	var textoId=$('p.descricao.album.Selecionada').attr('id');
}
function nada(){
}
function excluirFotosGaleria(){
	var fotos_excluir = $('.galeria.Selecionada');
	var videos_excluir =$('a.video-galeria.Selecionada');
	qts_fotos=fotos_excluir.length;
	qts_videos=videos_excluir.length;
	if(fotos_excluir.length==0 && videos_excluir.length==0){
		 navigator.notification.alert(
        'Você não selecionou nada', 
         nada,            
        'EXCLUIR IMAGENS',           
        'OK, ENTENDI'         
    );	
		
	}
	 navigator.notification.confirm(
        'Deseja excluir as imagens selecionadas?', 
         function(button) { 
            if ( button == 1 ) {
		        galeriaExcluir();
            }
         },            
        'EXCLUIR IMAGENS',           
        ['SIM','NÃO']         
    );	
}
function galeriaExcluir(){
   
	var fotos_excluir = $('.galeria.Selecionada');
	var videos_excluir =$('a.video-galeria.Selecionada');
	var fotos_existentes=$('.galeria');
	var videos_existentes =$('a.video-galeria');
	var imagens_prontuario = [];
	var texto_img_prontuario =[];
	var xxxxxxx=[];
	qts_fotos_exc=fotos_excluir.length;
	qts_videos_exc=videos_excluir.length;
	
	qts_fotos_exist=fotos_existentes.length;
	qts_videos_exist=videos_existentes.length;
	total=qts_fotos_exist+qts_videos_exist;
	
	if(fotos_excluir.length==0 && videos_excluir.length==0){
			 navigator.notification.alert(
			'Você não possui dados para excluir', 
			 fechaGaleria,            
			'EXCLUIR IMAGENS',           
			'OK, ENTENDI'         
    	);	
		
		$('.contaFotosCheck').html(total);
		return true;
	}		
	
			$(".galeria.Selecionada").each(function(){
			  xxxxxxx.push($(this).attr('id'))
			  
			});
			
			$(".galeria").each(function(){
			  imagens_prontuario.push($(this).attr('src'))
			});
			
			$("p.descricao.album").each(function(){
			  texto_img_prontuario.push($(this).html())
			});
	for (conta_tela = 0; conta_tela < xxxxxxx.length; conta_tela++) { 	
		id=xxxxxxx[conta_tela];
		removeItem(id);	
	}
	

	
		$('.galeria.Selecionada').removeClass('galeria Selecionada').fadeOut(50);
		$('a.video-galeria.Selecionada').removeClass('video-galeria Selecionada').fadeOut(50);
		$('p.descricao.album.Selecionada').removeClass('descricao album Selecionada').fadeOut(50);
		
		setTimeout(function(){
		fechaGaleria();
		},2000);
		
	 
		
}


 function removeItem(id) {

    db.transaction(function (tx) {

        var query = "DELETE FROM tabelaImagens WHERE id = ?";

        tx.executeSql(query, [id], function (tx, res) {
           // aviso("removeId: " + res.insertId);
           // aviso("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
            alert('DELETE error: ' + error.message);
        });
    }, function (error) {
        alert('transaction error: ' + error.message);
    }, function () {
       // aviso('transaction ok');
		
    });
}                                             


function contaUnidades(){
	
	
nome_paciente=$('.paciente_nome').html();
db.transaction(function(transaction) {
	transaction.executeSql('SELECT * FROM tabelaImagens WHERE Nome_paciente = "'+nome_paciente+'" ', [], function (tx, results) {
		var len = results.rows.length, i;
		$("#qdtFotosGaleria").html(len);
		$('.contaFotosCheck').html(len);
		//aviso(len +" Imagens");
		}, null);
	});

	
}





//MUSICA	

function fpageListaMusicas(){
	tela=paginaAtual[12];
	$('.avisoInicial').addClass('hide');
	$('#home').addClass('hide');
	$('#pageCadastroInicio').addClass('hide');
	$('#pageNetFlix').addClass('hide');
	$('#pageYoutube').addClass('hide');
	$('#pageEditar').addClass('hide');
	$('#pagePesquisa').addClass('hide');
	$('.painelDireita').addClass('hide');
	$('#pageConfiguracoes').addClass('hide');
	$('.painelEsquerda ').addClass('hide');
	$('#pageCaptura').addClass('hide');
	$('#pageProntuario ').addClass('hide');
	//$('#btnVoltarYoutube').addClass('hide');
	$('#pageInicio').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	$('#botoesRodape').html(botoes);
	$('#ZonaFooter').removeClass('hide');
	$('#pageListaMusicas').removeClass('hide');
}

function fEditarLaudo(){
	$('.btnMarcaTodas2').addClass('hide');
   $('.btnMarcaTodas').removeClass('hide');
	$('.avisoInicial').addClass('hide');
	$('#home').addClass('hide');
	$('#pageCadastroInicio').addClass('hide');
	$('#pageNetFlix').addClass('hide');
	$('#pageYoutube').addClass('hide');
	$('#pageEditar').addClass('hide');
	$('#pagePesquisa').addClass('hide');
	$('.painelDireita').addClass('hide');
	$('#pageConfiguracoes').addClass('hide');
	$('.painelEsquerda ').addClass('hide');
	$('#pageCaptura').addClass('hide');
	$('#pageProntuario ').addClass('hide');
	//$('#btnVoltarYoutube').addClass('hide');
	$('#pageInicio').addClass('hide');
	$('#pageListaMusicas').addClass('hide');
	$('.btnvoltar ').removeClass('hide');
	$('.laudo ').removeClass('hide');
	$('#pageVisualizarLaudo').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageProntuario()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	$('#botoesRodape').html(botoes);
	$('#pageEditarLaudo').removeClass('hide');
	
}



function enviar_laudo_email(){
	var telas=$("#imprimeLaudo").children([]).children(['img']);
	var c_laudo_email=[];
	telas.each(function() {
        c_laudo_email.push($(this).attr('src'));
    });
	
	//alert("telas "+c_laudo_email);
	 
	 
	for (conta_email_laudo = 0; conta_email_laudo < c_laudo_email.length; conta_email_laudo++) { 
			pagina=c_laudo_email[conta_email_laudo];
			if(c_laudo_email[0]){
				 $('#pagina1').val(c_laudo_email[0]);
			}
			if(c_laudo_email[1]){
				$('#pagina2').val(c_laudo_email[1]);
			}
			if(c_laudo_email[2]){
				$('#pagina3').val(c_laudo_email[2]);
			}
			if(c_laudo_email[3]){
				$('#pagina4').val(c_laudo_email[3]);
			}
			if(c_laudo_email[4]){
				$('#pagina5').val(c_laudo_email[4]);
			}
			if(c_laudo_email[5]){
				$('#pagina6').val(c_laudo_email[5]);
			}
			if(c_laudo_email[6]){
				$('#pagina7').val(c_laudo_email[6]);
			}
			if(c_laudo_email[7]){
				$('#pagina8').val(c_laudo_email[7]);
			}
			if(c_laudo_email[8]){
				$('#pagina9').val(c_laudo_email[8]);
			}
			if(c_laudo_email[9]){
				$('#pagina10').val(c_laudo_email[9]);
			}
			if(c_laudo_email[10]){
				$('#pagina11').val(c_laudo_email[10]);
			}
			if(c_laudo_email[11]){
				$('#pagina12').val(c_laudo_email[11]);
			}
			if(c_laudo_email[12]){
				$('#pagina13').val(c_laudo_email[12]);
			}
			if(c_laudo_email[13]){
				$('#pagina14').val(c_laudo_email[13]);
			}
			if(c_laudo_email[14]){
				$('#pagina15').val(c_laudo_email[14]);
			}
			if(c_laudo_email[15]){
				$('#pagina16').val(c_laudo_email[15]);
			}
			if(c_laudo_email[16]){
				$('#pagina17').val(c_laudo_email[16]);
			}
			if(c_laudo_email[17]){
				$('#pagina18').val(c_laudo_email[17]);
			}
			if(c_laudo_email[18]){
				$('#pagina19').val(c_laudo_email[18]);
			}
			if(c_laudo_email[19]){
				$('#pagina20').val(c_laudo_email[19]);
			}
			
	}
	  pagina1=$('#pagina1').val();
	  pagina2=$('#pagina2').val();
	  pagina3=$('#pagina3').val();
	  pagina4=$('#pagina4').val();
	  pagina5=$('#pagina5').val();
	  pagina6=$('#pagina6').val();
	  pagina7=$('#pagina7').val();
	  pagina8=$('#pagina8').val();
	  pagina9=$('#pagina9').val();
	  pagina10=$('#pagina10').val();
	  pagina11=$('#pagina11').val();
	  pagina12=$('#pagina12').val();
	  pagina13=$('#pagina13').val();
	  pagina14=$('#pagina14').val();
	  pagina15=$('#pagina15').val();
	  pagina16=$('#pagina16').val();
	  pagina17=$('#pagina17').val();
	  pagina18=$('#pagina18').val();
	  pagina19=$('#pagina19').val();
	  pagina20=$('#pagina20').val();
	email_da_clinica=$('#email_clinica').val();
	email_paciente=$('#email_do_paciente').val();
	nome_clinica=$('#nome_clinica').val()
	
	
	dataString='nome_clinica='+nome_clinica+'&email_da_clinica='+email_da_clinica+'&email_paciente='+email_paciente+'&pagina1='+pagina1+'&pagina2='+pagina2+'&pagina3='+pagina3+'&pagina4='+pagina4+'&pagina5='+pagina5+'&pagina6='+pagina6+'&pagina7='+pagina7+'&pagina8='+pagina8+'&pagina9='+pagina9+'&pagina10='+pagina10+'&pagina11='+pagina11+'&pagina12='+pagina12+'&pagina13='+pagina13+'&pagina14='+pagina14+'&pagina15='+pagina15+'&pagina16='+pagina16+'&pagina17='+pagina17+'&pagina18='+pagina18+'&pagina19='+pagina19+'&pagina20='+pagina20;
	//alert(dataString);
	aviso("Enviando Checkup para <br>" +email_paciente);
	setTimeout(function(){
		
		aviso('Checkup enviado')
	},3900)
		jQuery.support.cors = true;
		$.ajax({
			url: "http://www.gruposky.com.br/emailLaudo.php",
			type: "GET",
			dataType : 'jsonp',
            data: dataString,
            success: function(data){
				fecharZoomLaudo()
				$('.fotoListaCheckup.Selecionada').removeClass('Selecionada');
				$('#vLaudo').html('');
				if(data.retorno == 'OK'){
					
					
				}else{
					aviso('Tivemos um problema ao enviar o email.<br>Por favor, tente novamente.<br>');
					
				}
			}
		 });//Termina Ajax
	
}
function envia_alerta(mensagem,icone,som){
	
	Notification.requestPermission(function(permission) {
		
      if (!('permission' in Notification)) {
       		 Notification.permission = permission;
      }
	 
      if (Notification.permission === 'granted') {
       		 var notification = new Notification('.:::: Consultório Cloud ::::. ', {
          		icon: "http://skycamapp.net/www/img/"+icone+".png",
          		body: mensagem
        	})
			 playSound(som);
			 
			
			
      }
    })
}	

function fVisualizarLaudo(){
	$('#modalCheckupWeb').modal('show');
	return true;
		var CodigoSky=$('#CodigoSky').val();
	
		dataString='CodigoSky='+CodigoSky;
		$.ajax({
			url: servidor+"testarInternet.php",
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
				
				if(data.retorno!=""){
					icone='alerta';
					som="";
					mensagem='Internet ok '+data.retorno.length;
					envia_alerta(mensagem,icone,som);
					
				}else{
					icone='alerta';
					som='erro';
					mensagem='Problema com seu provedor de Internet';
					envia_alerta(mensagem,icone,som);
					
					fpageProntuario();
					$('#modalErroInternet').modal('show');
				}
	
			},error: function (){
				icone='alerta';
				som='erro';
				mensagem='Problema com seu provedor de Internet';
				envia_alerta(mensagem,icone,som);
				
				fpageProntuario();
				$('#modalErroInternet').modal('show');
			}
		})
	
	var idadePaciente=$('#idadePaciente').html();
	tela=paginaAtual[10];
	var imagens_selec_visualizar_laudo = [];
	var descricao_laudo =[];
	var numDenteLaudo=[];
		//MONTA LISTA PARA VISUALIZAR 
		$(".fotoListaCheckup.Selecionada").each(function(){
		  imagens_selec_visualizar_laudo.push($(this).attr('src'))
		});
		
		$(".enfer").each(function(){
		  descricao_laudo.push($(this).html())
		});
		
		$("span.numero_Dente.Selecionada").each(function(){
		  numDenteLaudo.push($(this).text())
		});
		
		
		if(imagens_selec_visualizar_laudo==''){
			aviso('Você não selecionou nenhuma imagem');
			return true;
		}
		
	
	
		 foto_clinica_laudo=$('#logo_clinica').attr('src');
		 nome_clinica_laudo = $('#nome_clinica').val();
		 email_clinica_laudo = $('#email_clinica').val();
		 endereco_laudo = $('#endereco_clinica').val();
		 fone_clinica_laudo = $('#fone_clinica').val();
		 slogan_clinica_laudo = $('#slogan_clinica').val();
		 site_clinica_laudo= $('#site_clinica').val();
		 foto_paciente_laudo=$('#modal_img_paciente').attr('src');
		 fone_paciente_pac_laudo=$("#fone_paciente_pac").val();
		 cel_paciente_pac_laudo=$("#cel_paciente_pac").val();
	 	 end_paciente_laudo=$('#end_paciente_pac').val();
		 cep_paciente_laudo=$('#cep_paciente_pac').val();
		 email_paciente_laudo=$('#email_paciente_pac').val();
		 nome_paciente_laudo=$('#modal_nome_paciente').html();
		
		
		
		for (conta_tela = 0; conta_tela < imagens_selec_visualizar_laudo.length; conta_tela++) { 
			if(conta_tela==0 ){
					
					tela='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
					tela+='                <p class="text-left corcinza ldo"><b>'+site_clinica_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto0" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			
			if(conta_tela==6 ){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
					tela+='                <p class="text-left corcinza ldo"><b>'+site_clinica_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto1" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			
			if(conta_tela==12){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto2" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			
			if(conta_tela==18){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto3" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			if(conta_tela==24){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto4" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			
			if(conta_tela==30){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto5" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			
			if(conta_tela==36){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto6" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			
			if(conta_tela==42){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto7" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			
			if(conta_tela==48){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto8" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			if(conta_tela==54){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto9" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			
			if(conta_tela==60){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto10" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			
			if(conta_tela==66){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto11" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			if(conta_tela==72){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto12" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			if(conta_tela==78){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto13" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			if(conta_tela==84){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto14" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			if(conta_tela==90){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto15" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			if(conta_tela==96){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto16" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			if(conta_tela==102){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto17" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
			if(conta_tela==108){
					
					tela+='<div style="width:596px; height:842px;background:url(img/laudo.jpg) no-repeat;background-size:contain;padding:50px;margin-left:23%">';
                    tela+='        <div class="row">';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='                <img src="'+foto_clinica_laudo+'"   style="margin-top:4px;margin-left:8px;"  class="img-responsive"/>';
                    tela+='            </div>';
					tela+='            <div class="col-xs-10">';
					tela+='            <div class="clearfix">&nbsp;</div>';
                    tela+='            	<p class="text-left corcinza ldo" style="margin-top:5px;"><b>'+nome_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+endereco_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+fone_clinica_laudo+'</b></p>';
                    tela+='                <p class="text-left corcinza ldo"><b>'+email_clinica_laudo+'</b></p>'; 
                    tela+='            </div>';
                    tela+='        </div>';
                    tela+='        ';
                    tela+='        <div class="clearfix">&nbsp;</div>';
                    tela+='        <div class="row">    ';
                    tela+='            <div class="col-xs-2 text-right">';
                    tela+='            	<img src="'+foto_paciente_laudo+'" class="img-responsive" style="margin-top:4px;margin-left:8px;" />';
                    tela+='            </div>';
                    tela+='            <div class="col-xs-10">';
					
                    tela+='            	<p class="corescura text-left ldo" style="margin-top:5px;"><b>'+nome_paciente_laudo+', '+idadePaciente+' anos</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+end_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>CEP: '+cep_paciente_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+fone_paciente_pac_laudo+' / '+cel_paciente_pac_laudo+'</b></p>';
                    tela+='                <p class="corescura text-left ldo"><b>'+email_paciente_laudo+'</b></p>';
                    tela+='            </div>';
                    tela+='            ';
                    tela+='         </div> ';
                    tela+='         ';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         <div class="clearfix">&nbsp;</div>';
                    tela+='         ';
                    tela+='         ';
                    tela+='         <div id="editaLaudoPronto18" class="arrastaFotos ">';
                   // tela+='         	    <div class="row" id="fotosLaudoCheckup0"></div>';
                    tela+='         </div> ';
                    tela+='    </div><br>';
			}
		}
		
		$('#listaLaudosParaEditar').html(tela);	
		
		
		laudo1='';
		laudo2='';
		laudo3='';
		laudo4='';
		laudo5='';
		laudo6='';
		laudo7='';
		laudo8='';
		laudo9='';
		laudo10='';
		laudo11='';
		laudo11='';
		laudo12='';
		laudo13='';
		laudo14='';
		laudo15='';
		laudo16='';
		laudo17='';
		laudo18='';
		laudo19='';
	
		for (conta_visu = 0; conta_visu < imagens_selec_visualizar_laudo.length; conta_visu++) { 
			foto=imagens_selec_visualizar_laudo[conta_visu];
			foto_descr=descricao_laudo[conta_visu];
			if(foto_descr==null){
				foto_descr="";
			}
			
			numero=numDenteLaudo[conta_visu];
			
			if(numero=="undefined" || numero==null){
				numero="";
			}
			   if(conta_visu>=0 && conta_visu<=5){
				laudo1+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=6 && conta_visu<=11){
				laudo2+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=12 && conta_visu<=17){
				laudo3+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=18 && conta_visu<=23){
				laudo4+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=24 && conta_visu<=29){
				laudo5+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=30 && conta_visu<=35){
				laudo6+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=36 && conta_visu<=41){
				laudo7+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=42 && conta_visu<=47){
				laudo8+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=48 && conta_visu<=53){
				laudo9+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   
			   if(conta_visu>=54 && conta_visu<=59){
				laudo10+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   
			   if(conta_visu>=60 && conta_visu<=65){
				laudo11+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=66 && conta_visu<=71){
				laudo12+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=72 && conta_visu<=77){
				laudo13+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=78 && conta_visu<=83){
				laudo14+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=84 && conta_visu<=89){
				laudo15+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=90 && conta_visu<=95){
				laudo16+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=96 && conta_visu<=101){
				laudo17+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>=102 && conta_visu<=107){
				laudo18+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   if(conta_visu>108){
				laudo19+='<div href="#"  style="margin-top:-25px" class="col-xs-6 trocaLado text-center" id="'+conta_visu+'" draggable="true"><a href="#" id="botaoDente'+conta_visu+'" class="btn btn-primary raio0 btn-xs btnDente" onclick="odontogramaLaudo('+conta_visu+')" style="position:absolute;top:0;right:0;margin-right:15px;">Dente '+numero+'</a><a href="#" onClick="xxclui('+conta_visu+')" style="position:absolute;top:0;left:0;margin-left:15px;z-index:120000"  class="btn btn-danger raio0 btn-xs excluirimgLaudo hide animated zoomIn">EXCLUIR</a><img src="'+foto+'"  alt="'+numero+'"   class="montalaudo img-responsive"  onclick="editarInputLaudo('+conta_visu+')" id="'+conta_visu+'"/><input id="laudoTexto'+conta_visu+'" type="text" class="form-control input-laudo  corcinza" value="'+foto_descr+'" /> <br></div>';
			   }
			   
				
				
				
				
		}
	
	$('#editaLaudoPronto0').html(laudo1).trigger('updatelayout');
	$('#editaLaudoPronto1').html(laudo2).trigger('updatelayout');
	$('#editaLaudoPronto2').html(laudo3).trigger('updatelayout');
	$('#editaLaudoPronto3').html(laudo4).trigger('updatelayout');
	$('#editaLaudoPronto4').html(laudo5).trigger('updatelayout');
	$('#editaLaudoPronto5').html(laudo6).trigger('updatelayout');
	$('#editaLaudoPronto6').html(laudo7).trigger('updatelayout');
	$('#editaLaudoPronto7').html(laudo8).trigger('updatelayout');
	$('#editaLaudoPronto8').html(laudo9).trigger('updatelayout');
	$('#editaLaudoPronto9').html(laudo10).trigger('updatelayout');
	$('#editaLaudoPronto10').html(laudo11).trigger('updatelayout');
	$('#editaLaudoPronto11').html(laudo12).trigger('updatelayout');
	$('#editaLaudoPronto12').html(laudo13).trigger('updatelayout');
	$('#editaLaudoPronto13').html(laudo14).trigger('updatelayout');
	$('#editaLaudoPronto14').html(laudo15).trigger('updatelayout');
	$('#editaLaudoPronto15').html(laudo16).trigger('updatelayout');
	$('#editaLaudoPronto16').html(laudo17).trigger('updatelayout');
	$('#editaLaudoPronto17').html(laudo18).trigger('updatelayout');
	$('#editaLaudoPronto18').html(laudo19).trigger('updatelayout');
	
	$('.avisoInicial').addClass('hide');
	$('#home').addClass('hide');
	$('#pageCadastroInicio').addClass('hide');
	$('#pageNetFlix').addClass('hide');
	$('#pageYoutube').addClass('hide');
	$('#pageEditar').addClass('hide');
	$('#pagePesquisa').addClass('hide');
	$('.painelDireita').addClass('hide');
	$('.painelEsquerda ').addClass('hide');
	$('#pageCaptura').addClass('hide');
	$('#pageConfiguracoes').addClass('hide');
	$('#pageProntuario ').addClass('hide');
	//$('#btnVoltarYoutube').addClass('hide');
	$('#pageInicio').addClass('hide');
	$('#pageListaMusicas').addClass('hide');
	$('.btnvoltar ').removeClass('hide');
	$('.laudo ').removeClass('hide');
	$('#pageEditarLaudo').addClass('hide');
	
	
	//botoes='<a class="btn transparente corbranca" href="#" onclick="montaLaudo()"><i class="fa fa-2x fa-search text-left pull-left ic_rodape"></i><span style="font-size:20px">Imagens</span></a>';
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageProntuario()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	botoes+='<a class="btn transparente corbranca hide" href="#" onclick="enviar_laudo_email()"><i class="fa fa-2x fa-mail-forward text-left pull-left ic_rodape"></i><span style="font-size:20px">Email</span></a>';
	botoes+='<a class="btn transparente corbranca" href="#"  onclick="selecionarImagensLaudo()"><i class="fa fa-2x fa-check-square-o text-left pull-left ic_rodape"></i><span style="font-size:20px">Selecionar imagens para exclusão</span></a>';
	botoes+='<a class="btn transparente corbranca hide" href="#"  onclick="excluirImagensLaudo()"><i class="fa fa-2x fa-delete text-left pull-left ic_rodape"></i><span style="font-size:20px">Excluir imagens</span></a>';
	botoes+='<a class="btn transparente corbranca"  href="#" onclick="montaLaudo()"><i class="fa fa-2x fa-save text-left pull-left ic_rodape"></i><span style="font-size:20px">Salvar</span></a>';
	botoes+='<a class="btn transparente corbranca disabled" href="#" id="btnImprimir" onclick="imprimirLaudodeFilhodaPuta()"><i class="fa fa-2x fa-print text-left pull-left ic_rodape"></i><span style="font-size:20px">Imprimir</span></a>';
	$('#botoesRodape').html(botoes);
	
	
	$('#pageVisualizarLaudo').removeClass('hide');
	$( ".arrastaFotos" ).sortable({
	   	
	   start: function (event, ui) {
		   
           // $(ui.item).data("startindex", ui.item.index());
		   var ccc = $(ui.sortable);
		   ccc.addClass('rowmuda');
		   $(ui.item).addClass('rowmuda');
        },
        stop: function (event, ui) {
            //self.sendUpdatedIndex(ui.item);
			var ccc = $(ui.sortable);
			if(ccc.hasClass('rowmuda')){
		   		ccc.removeClass('rowmuda');
			}
			$(ui.item).removeClass('rowmuda');
			$(".arrastaFotos").sortable('refresh');
        }
   }).disableSelection();
   $('body').trigger('updatelayout');
	
	
}

function selecionarImagensLaudo(){
	//showMessage("Selecione quais imagens deseja excluir",null,"EXCLUSÃO DE IMAGENS DO LAUDO","OK");
	$('.excluirimgLaudo').toggleClass('hide');
}

function xxclui(id){
	
	$('#'+id+'.col-xs-6.trocaLado').remove();
	$(".arrastaFotos").sortable('refresh');
	$( ".arrastaFotos" ).trigger('updatelayout');
   	$('body').trigger('updatelayout');
	
}  

function editarInputLaudo(conta_visu){
	$('.idinput').html(conta_visu);
	$('#laudoTexto'+conta_visu).focus();
	$('#laudoEnfermidade').toggleClass('hide');
	
	
	
}

 $('.doencaLaudo').on('click', function(){
	 var idinput=$('.idinput').html();
	  var doenca=$(this).find('h5.tipoDoenca').first().html();
	  $('#laudoTexto'+idinput).val(doenca);
	  $('#laudoEnfermidade').addClass('hide');
	  
  })

//ODONTOGRAMA LAUDO

function odontogramaLaudo(conta_visu){
	$('.iddente').html(conta_visu);
    var idadePaciente=$('#idadePaciente').html();
	//alert(idadePaciente);
	if(idadePaciente<8 || idadePaciente==null || idadePaciente==""){
		$('#odontoLaudoInfantil').removeClass('hide');
	}else{
		$('#odontoLaudoAdulto').removeClass('hide');
	}
	
}
laudocontadorodonto=0;
 	$('a.numeroDente').on('click', function (){
		laudocontadorodonto+=1;
		var num=$(this).attr('id');
		var dente=$('.iddente').html();
		var qtd_caract=$('#botaoDente'+dente).html();
		//alert('Dente ---> '+qtd_caract.length);
		
		if(laudocontadorodonto>4 || qtd_caract.length==18){
			aviso("Marcação máxima de 4 dentes atingida!");
			return true;
		}
		$('#botaoDente'+dente).append(num+" "); 
		/*
		laudocontadorodonto+=1;
		var num=$(this).attr('id');
		var dente=$('.iddente').html();
		//$('.denteColecao').removeClass('hide');
		if(laudocontadorodonto>4){
			aviso("Marcação máxima de 4 dentes atingida!");
			return true;
		}
		$('#botaoDente'+dente).append(num+" "); 
		//$('#odontoLaudoInfantil').addClass('hide');
		//$('#odontoLaudoAdulto').addClass('hide');
		*/ 
	})

	var limparOdontoLaudo=function(){
		id_foto=$('.iddente').html();
		$('#botaoDente'+id_foto).html("Dente "); 
		laudocontadorodonto=0;
	}

function fecharOdontoLaudo(){
	
	laudocontadorodonto=0;
	
	 $('#odontoLaudoInfantil').addClass('hide');
     $('#odontoLaudoAdulto').addClass('hide');
	 
}

var trocar_odontograma_laudo = function(){
	
	if($('#odontoLaudoInfantil').hasClass('hide')){
		$('#odontoLaudoInfantil').removeClass('hide');
		$('#odontoLaudoAdulto').addClass('hide');
	}else{
		$('#odontoLaudoInfantil').addClass('hide')
		$('#odontoLaudoAdulto').removeClass('hide');
	}
}




function todas_laudo(){
	$('#fotosLaudoCheckup img.fotoListaCheckup.montalaudo').toggleClass('Selecionada');
}
function fechaLaudo(){
	$('#montaFotosProntuario').addClass('fechado');
	$('#fotosLaudoCheckup img.fotoListaCheckup.montalaudo').removeClass('Selecionada');
	montaLaudo();
}
function abreLaudo(){
	$('#montaFotosProntuario').removeClass('fechado');
}

function montaLaudo(){
	$('#divRelatorio').removeClass('hide');
}

var boto=$('#examesBotoes').children();
boto.on('click', function(){
	$(this).toggleClass('btn-default btn-success'); 
});
function fecharConclusao(){
	$("input[name='laudoExames[]']:checked").removeAttr('checked');
	$('#outrosExames').val('');
	$('#checkupControle').val('');
	$('#conclusaoLaudo').val('');
	$('#examesBotoes').children().removeClass('active btn-success').addClass('btn-default');
	$('#divRelatorio').addClass('hide');
	
}
function entendeu1(){
	$('#checkupControle').focus().val('');
}
var images = [];
var num_dente;
var $imagesDiv;
//salvarLaudo
function salvarConclusao(){
		 var data = new Date();
		 var dia  = data.getDate();
			if (dia< 10) {
				dia  = "0" + dia;
			}
		 var  mes  = data.getMonth() + 1;
			if (mes < 10) {
				mes  = "0" + mes;
			}
		 var ano = data.getFullYear();
		outrosExames=$('#outrosExames').val();
		checkupControle=$('#checkupControle').val();
		conclusaoLaudo=$('#conclusaoLaudo').val();
		
		dia_c=checkupControle.substr(0,2);
		mes_c=checkupControle.substr(3,2);
		ano_c=checkupControle.substr(6,4);
		
		
		var lista_exame = []
		$("input[name='laudoExames[]']:checked").each(function (){
			lista_exame.push(($(this).attr('id')));
		});
		if(outrosExames==""){
			outros='';
		}else{
			outros='X';
		}
		panoramica='';
		periapical='';
		halitose='';
		hemograma='';
		tomografia='';
		
		for (conta_exame = 0; conta_exame < lista_exame.length; conta_exame++) { 
		
			
			if(lista_exame[conta_exame]=="panoramica"){
				panoramica += 'X';
			}
			if(lista_exame[conta_exame]=='periapical'){
				periapical += 'X';
			}
			if(lista_exame[conta_exame]=='halitose'){
				halitose += 'X';
			}
			if(lista_exame[conta_exame]=='hemograma'){
				hemograma += 'X';
			}
			if(lista_exame[conta_exame]=='tomografia'){
				tomografia += 'X';
			}
		
		}
	
		if(checkupControle=="" || checkupControle=='00/00/0000' || checkupControle=='44/44/4444' || checkupControle=='55/55/5555'|| checkupControle=='11/11/1111' || checkupControle=='22/22/2222' || checkupControle=='33/33/3333' || checkupControle=='66/66/6666' || checkupControle=='77/77/7777' || checkupControle=='88/88/8888' || checkupControle=='99/99/9999' || checkupControle.length<10){
			aviso('Preencha a data de Check-up de controle corretamente, caso contrário não será possível gerar o Laudo')
			entendeu1();
			return true; 
			
		}
		if(dia_c==0 || dia_c>31){
			entendeu1();
			aviso('Dia inexistente')
			return true;
		
		}
		if(mes_c==0 || mes_c>12){
			entendeu1();
			aviso('Mês inexistente')
			return true;
		}
		if(ano_c==0 || ano_c<2017){
		
			entendeu1();
			aviso('Impossível agendar para o passado :/')
			return true;
		}
		/*
		if(ano_c>ano){
		
			entendeu1();
			aviso('Reagendamento Máximo = 1 Ano');
			return true;
		}
			
		*/
		
		$('#divRelatorio').addClass('hide');
		var dente_laudo=[]; 
		var imagens_monta_laudo=[];
		var descr_monta_laudo=[];
			
			//alert(doenca+"--"+tempo_sessao+"---"+valor_doenca);
		 var dataImagem_laudo= dia+'/'+mes+'/'+ano; 
		 dentista_clinica = $('.dentista_nome').html();
		 cro_dentista_clinica = $('.cro').html();
		 foto_clinica_laudo=$('#logo_clinica').attr('src');
		 nome_clinica_laudo = $('#nome_clinica').val();
		 email_clinica_laudo = $('#email_clinica').val();
		 endereco_laudo = $('#endereco_clinica').val();
		 fone_clinica_laudo = $('#fone_clinica').val();
		 slogan_clinica_laudo = $('#slogan_clinica').val();
		 site_clinica_laudo= $('#site_clinica').val();
		 foto_paciente_laudo=$('#modal_img_paciente').attr('src');
		 fone_paciente_pac_laudo=$("#fone_paciente_pac").val();
		 cel_paciente_pac_laudo=$("#cel_paciente_pac").val();
	 	 end_paciente_laudo=$('#end_paciente_pac').val();
		 cep_paciente_laudo=$('#cep_paciente_pac').val();
		 email_paciente_laudo=$('#email_paciente_pac').val();
		 nome_paciente_laudo=$('#modal_nome_paciente').html();
		 //btnDente=$('.btnDente').html();
		 criaToken();	
		
		var telaLaudo0=document.getElementById('canvasMontaLaudo0');
		var contextolaudo0=telaLaudo0.getContext('2d');
		var telaLaudo1=document.getElementById('canvasMontaLaudo1');
		var contextolaudo1=telaLaudo1.getContext('2d');
		var telaLaudo2=document.getElementById('canvasMontaLaudo2');
		var contextolaudo2=telaLaudo2.getContext('2d');
		var telaLaudo3=document.getElementById('canvasMontaLaudo3');
		var contextolaudo3=telaLaudo3.getContext('2d');
		var telaLaudo4=document.getElementById('canvasMontaLaudo4');
		var contextolaudo4=telaLaudo4.getContext('2d');
		var telaLaudo5=document.getElementById('canvasMontaLaudo5');
		var contextolaudo5=telaLaudo5.getContext('2d');
		var telaLaudo6=document.getElementById('canvasMontaLaudo6');
		var contextolaudo6=telaLaudo6.getContext('2d');
		var telaLaudo7=document.getElementById('canvasMontaLaudo7');
		var	contextolaudo7=telaLaudo7.getContext('2d');
		var telaLaudo8=document.getElementById('canvasMontaLaudo8');
		var	contextolaudo8=telaLaudo8.getContext('2d');
		var telaLaudo9=document.getElementById('canvasMontaLaudo9');
		var	contextolaudo9=telaLaudo9.getContext('2d');
		var telaLaudo10=document.getElementById('canvasMontaLaudo10');
		var contextolaudo10=telaLaudo10.getContext('2d');
		var telaLaudo11=document.getElementById('canvasMontaLaudo11');
		var contextolaudo11=telaLaudo11.getContext('2d');
		var telaLaudo12=document.getElementById('canvasMontaLaudo12');
		var contextolaudo12=telaLaudo12.getContext('2d');
		var telaLaudo13=document.getElementById('canvasMontaLaudo13');
		var contextolaudo13=telaLaudo13.getContext('2d');
		var telaLaudo14=document.getElementById('canvasMontaLaudo14');
		var contextolaudo14=telaLaudo14.getContext('2d');
		var telaLaudo15=document.getElementById('canvasMontaLaudo15');
		var contextolaudo15=telaLaudo15.getContext('2d');
		var telaLaudo16=document.getElementById('canvasMontaLaudo16');
		var	contextolaudo16=telaLaudo16.getContext('2d');
		var telaLaudo17=document.getElementById('canvasMontaLaudo17');
		var	contextolaudo17=telaLaudo17.getContext('2d');
		/*
		var telaLaudo18=document.getElementById('canvasMontaLaudo18');
		var	contextolaudo18=telaLaudo18.getContext('2d');
		var telaLaudo19=document.getElementById('canvasMontaLaudo19');
		var	contextolaudo19=telaLaudo19.getContext('2d');
		*/
		
		$(".input-laudo").each(function(){
		  descr_monta_laudo.push($(this).val())
		});
		//alert(descr_monta_laudo);
		
		$('img.montalaudo').each(function(){
			imagens_monta_laudo.push($(this).attr('src'));
			//dente_laudo.push($(this).attr('alt'));
		});
		
		
		var total_paginas=imagens_monta_laudo.length;
		$('.btnDente').each(function(){
			var dentetexto=$(this).html();
			dente_laudo.push(dentetexto.substr(dentetexto.lastIndexOf('e')+1));
			//dente_laudo.push(contadente);
		})
		//alert('Array '+dente_laudo); 
		var minhas=[]
		$('#divLaudos').children().each(function(){
			minhas.push($(this).attr('id'));
		});
		
		xxx='';
		 for (conta_visu = 0; conta_visu < minhas.length; conta_visu++) {
			xxx+='laudo'+[conta_visu];
			
			
			
		 }
		 carregando();
		 
		$('#txtperc').html("Laudo com "+total_paginas+" imagens <i class='fa fa-spinner fa-spin fa-fw text-right pull-right'></i>");
		for (conta_visu = 0; conta_visu < imagens_monta_laudo.length; conta_visu++) { 
			foto=imagens_monta_laudo[conta_visu];
			
			
			   if(conta_visu>=0 && conta_visu<=5){
				   fundo_laudo = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo0.width,
					  height :telaLaudo0.height,
					  
					  load: function() { 
						  contextolaudo0.drawImage(this, 0, 0);   
					  } 	
					});
					
					
					
			   }
			   if(conta_visu>=6 && conta_visu<=11){
				   
				   fundo_laudo1 = $("<img/>", {
					  crossorigin: "anonymous", 
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo1.width,
					  height :telaLaudo1.height,
					  
					  load: function() { 
						  contextolaudo1.drawImage(this, 0, 0);   
					  } 	
					});	
			   }
			   if(conta_visu>=12 && conta_visu<=17){
				   
				   fundo_laudo2 = $("<img/>", {
					  crossorigin: "anonymous",  
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo2.width,
					  height :telaLaudo2.height,
					  
					  load: function() { 
						  contextolaudo2.drawImage(this, 0, 0);   
					  } 	
					});	
			   }
			   if(conta_visu>=18 && conta_visu<=23){
				   fundo_laudo3 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo3.width,
					  height :telaLaudo3.height,
					  
					  load: function() { 
						  contextolaudo3.drawImage(this, 0, 0);   
					  } 	
					});	
			   }
			   if(conta_visu>=24 && conta_visu<=29){
				   fundo_laudo4 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo4.width,
					  height :telaLaudo4.height,
					  
					  load: function() { 
						  contextolaudo4.drawImage(this, 0, 0);   
					  } 	
					});	
			   }
			   if(conta_visu>=30 && conta_visu<=35){
				   fundo_laudo5 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo5.width,
					  height :telaLaudo5.height,
					  
					  load: function() { 
						  contextolaudo5.drawImage(this, 0, 0);   
					  } 	
					});		 
			   }
			   if(conta_visu>=36 && conta_visu<=41){
				   fundo_laudo6 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo6.width,
					  height :telaLaudo6.height,
					  
					  load: function() { 
						  contextolaudo6.drawImage(this, 0, 0);   
					  } 	
					});	
			   }
			   if(conta_visu>=42 && conta_visu<=47){
				   fundo_laudo7 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo7.width,
					  height :telaLaudo7.height,
					  
					  load: function() { 
						  contextolaudo7.drawImage(this, 0, 0);   
					  } 	
					});
			   }
			   if(conta_visu>=48 && conta_visu<=53){
				   fundo_laudo8 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo8.width,
					  height :telaLaudo8.height,
					  
					  load: function() { 
						  contextolaudo8.drawImage(this, 0, 0);   
					  } 	
					});
					
					 
					
			   }
			   if(conta_visu>=54 && conta_visu<=59){
				   fundo_laudo9 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo9.width,
					  height :telaLaudo9.height,
					  
					  load: function() { 
						  contextolaudo9.drawImage(this, 0, 0);   
					  } 	
					});
			   }
			   //15/10 
			   if(conta_visu>=60 && conta_visu<=65){
				   fundo_laudo10 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo10.width,
					  height :telaLaudo10.height,
					  
					  load: function() { 
						  contextolaudo10.drawImage(this, 0, 0);   
					  } 	
					});
			   }
			   if(conta_visu>=66 && conta_visu<=71){
				   fundo_laudo11 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo11.width,
					  height :telaLaudo11.height,
					  
					  load: function() { 
						  contextolaudo11.drawImage(this, 0, 0);   
					  } 	
					});
			   }
			   if(conta_visu>=72 && conta_visu<=77){
				   fundo_laudo12 = $("<img/>", { 
				      crossorigin: "anonymous", 
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo12.width,
					  height :telaLaudo12.height,
					  
					  load: function() { 
						  contextolaudo12.drawImage(this, 0, 0);   
					  } 	
					});
			   }
			   if(conta_visu>=78 && conta_visu<=83){
				   fundo_laudo13 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo13.width,
					  height :telaLaudo13.height,
					  
					  load: function() { 
						  contextolaudo13.drawImage(this, 0, 0);   
					  } 	
					});
			   }
			   if(conta_visu>=84 && conta_visu<=89){
				   fundo_laudo14 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo14.width,
					  height :telaLaudo14.height,
					  
					  load: function() { 
						  contextolaudo14.drawImage(this, 0, 0);   
					  } 	
					});
			   }
			   if(conta_visu>=90 && conta_visu<=95){
				   fundo_laudo15 = $("<img/>", {
					  crossorigin: "anonymous",  
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo15.width,
					  height :telaLaudo15.height,
					  
					  load: function() { 
						  contextolaudo15.drawImage(this, 0, 0);   
					  } 	
					});
			   }
			   if(conta_visu>=96 && conta_visu<=101){
				   fundo_laudo16 = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo16.width,
					  height :telaLaudo16.height,
					  
					  load: function() { 
						  contextolaudo16.drawImage(this, 0, 0);   
					  } 	
					});
			   }
			   if(conta_visu>=102 && conta_visu<=107){
				   fundo_laudo17 = $("<img/>", {
					  crossorigin: "anonymous",  
					  src: 'img/laudogrande.jpg', 
					  width: telaLaudo17.width,
					  height :telaLaudo17.height,
					  
					  load: function() { 
						  contextolaudo17.drawImage(this, 0, 0);   
					  } 	
					});
			   }
			   
		}
		
		
		
	laudo='';
	
				//CONCLUSAO DO LAUDO
				var Laudoconclusao=document.getElementById('canvasMontaLaudoConclusao'),
				contextoconclusao=Laudoconclusao.getContext('2d'),
				
				
				imagemconclusao = $("<img/>", { 
				      crossorigin: "anonymous",
					  src: 'img/laudogrande.jpg', 
					  width: Laudoconclusao.width,
					  height:Laudoconclusao.height,
					  
					  load: function() { 
						  contextoconclusao.drawImage(this, 0, 0);   
					  } 	
				});
				
				
				setTimeout(function(){
					//CLINICA
					logo_clinica = $("<img/>", {
						  crossorigin: "anonymous", 
						  src: foto_clinica_laudo, 
						  width: 80,
						  height :80,
						  
						  
						  load: function() { 
							  contextoconclusao.drawImage(this, 105, 90,110,110);  
						  } 	
					});
					
					//NOME DA CLINICA
					
					contextoconclusao.font = "20pt Arial";
					contextoconclusao.fillStyle = "#000";
					contextoconclusao.fillText(nome_clinica_laudo, 270, 105);
					
					
					//ENDERECO DA CLINICA
					
					
					contextoconclusao.font = "16pt Arial";
					contextoconclusao.fillStyle = "#828282";
					contextoconclusao.fillText(endereco_laudo, 270, 130);
					
					//TELEFONE DA CLINICA
					
					contextoconclusao.font = "16pt Arial";
					contextoconclusao.fillStyle = "#828282";
					contextoconclusao.fillText(fone_clinica_laudo, 270, 155);
					
					//EMAIL DA CLINICA
					
					contextoconclusao.font = "16pt Arial";
					contextoconclusao.fillStyle = "#828282";
					contextoconclusao.fillText(email_clinica_laudo, 270, 180);
					
					
					//SITE DA CLINICA
					
					contextoconclusao.font = "16pt Arial";
					contextoconclusao.fillStyle = "#828282";
					contextoconclusao.fillText(site_clinica_laudo, 270, 205);
					
					
					//DADOS DO PACIENTE
					foto_paciente = $("<img/>", {
						  crossorigin: "anonymous", 
						  src: foto_paciente_laudo, 
						  width: 80,
						  height :80,
						  
						  
						  load: function() { 
							  contextoconclusao.drawImage(this, 105, 250,110,110);  
						  } 	
					});
					
					//NOME DO PACIENTE
					 
					 contextoconclusao.font = "20pt Arial";
					 contextoconclusao.fillStyle = "#000";
					 contextoconclusao.fillText(nome_paciente_laudo, 270, 260);
					 
					 //ENDERECO DO PACIENTE
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#828282";
					 contextoconclusao.fillText(end_paciente_laudo,  270, 285);
					 
					 //CEP DO PACIENTE
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#828282";
					 contextoconclusao.fillText(cep_paciente_laudo, 270, 310);
					 
					 //FONE DO PACIENTE
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#828282";
					 contextoconclusao.fillText(fone_paciente_pac_laudo, 270, 335);
					 
					 //CELULAR DO PACIENTE
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#828282";
					 contextoconclusao.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
					 
					 
					 //EMAIL DO PACIENTE
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#828282";
					 contextoconclusao.fillText(email_paciente_laudo, 270, 360);
					 
					 //CONCLUSAO DO LAUDO
					 
					 contextoconclusao.font = "Bold 18pt Arial";
					 contextoconclusao.fillStyle = "#000";
					 contextoconclusao.fillText("Conclusão:", 160, 480);
					 
					function wrapText(contextoconclusao, conclusaoLaudo, x, y, maxWidth, lineHeight) {
						var words = conclusaoLaudo.split(' ');
						
						var line = '';
				
						for(var n = 0; n < words.length; n++) {
						  var testLine = line + words[n] + ' ';
						  var metrics = contextoconclusao.measureText(testLine);
						  var testWidth = metrics.width;
						  
						  if (testWidth > maxWidth && n > 0) {
							contextoconclusao.fillText(line, x, y);
							line = words[n] + ' ';
							
							y += lineHeight;
						  }
						  
						  else {
							line = testLine;
						  }
						}
						contextoconclusao.fillText(line, x, y);
					  }
					  
				
					  var maxWidth = 750;
					  var lineHeight = 22;
					  var x = 160;//(Laudoconclusao.width - maxWidth) / 2;
					  var y = 530;
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#333";
				  
				
					  wrapText(contextoconclusao, conclusaoLaudo, x, y, maxWidth, lineHeight);
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#333";
					 //contextoconclusao.fillText(conclusaoLaudo, 160, 530);
					 
					 
					 //EXAMES COMPLEMENTARES
					 
					 contextoconclusao.font = "Bold 18pt  Arial ";
					 contextoconclusao.fillStyle = "#000";
					 contextoconclusao.fillText("Exames Complementares:", 160, 880);
					
					//LADO ESQUERDO
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#333";
					 contextoconclusao.fillText("Raio X - Panorâmica", 210, 973);//exames_lista
					 
					 contextoconclusao.beginPath();
					 contextoconclusao.fillStyle = "#777";
					 contextoconclusao.arc(180,965,20,0,2*Math.PI);
					 contextoconclusao.stroke();
					 
					 contextoconclusao.font = "28pt Arial";
					 contextoconclusao.fillStyle = "#FBC012";
					 contextoconclusao.fillText(panoramica, 168, 978);
					 
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#333";
					 contextoconclusao.fillText("Raio X - Periapical", 210, 1053);//exames_lista
					 
					 contextoconclusao.beginPath();
					 contextoconclusao.fillStyle = "#777";
					 contextoconclusao.arc(180,1045,20,0,2*Math.PI);
					 contextoconclusao.stroke();
					 
					 contextoconclusao.font = "28pt Arial";
					 contextoconclusao.fillStyle = "#FBC012";
					 contextoconclusao.fillText(periapical, 168, 1058);
					 
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#333";
					 contextoconclusao.fillText("Halitose", 210, 1133);//exames_lista
					 
					 contextoconclusao.beginPath();
					 contextoconclusao.fillStyle = "#777";
					 contextoconclusao.arc(180,1125,20,0,2*Math.PI);
					 contextoconclusao.stroke();
					 
					 contextoconclusao.font = "28pt Arial";
					 contextoconclusao.fillStyle = "#FBC012";
					 contextoconclusao.fillText(halitose, 168, 1138);
					 
					 
					 //LADO DIREITO
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#333";
					 contextoconclusao.fillText("Hemograma", 770, 973);//exames_lista
					 
					 contextoconclusao.beginPath();
					 contextoconclusao.fillStyle = "#777";
					 contextoconclusao.arc(740,965,20,0,2*Math.PI);
					 contextoconclusao.stroke();
					 
					 contextoconclusao.font = "28pt Arial";
					 contextoconclusao.fillStyle = "#FBC012";
					 contextoconclusao.fillText(hemograma, 728, 978);
					
					 
					 
					 //Tomografia
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#333";
					 contextoconclusao.fillText("Tomografia", 770, 1053);//exames_lista
					 
					 contextoconclusao.beginPath();
					 contextoconclusao.fillStyle = "#777";
					 contextoconclusao.arc(740,1045,20,0,2*Math.PI);
					 contextoconclusao.stroke();
					 
					 contextoconclusao.font = "28pt Arial";
					 contextoconclusao.fillStyle = "#FBC012";
					 contextoconclusao.fillText(tomografia, 728, 1058);
					 
					 
					 //Outros
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#333";
					 contextoconclusao.fillText("Outros:", 770, 1133);//exames_lista
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#333";
					 contextoconclusao.fillText(outrosExames, 850, 1133);//exames_lista
					 
					
					 contextoconclusao.beginPath();
					 contextoconclusao.fillStyle = "#777";
					 contextoconclusao.arc(740,1125,20,0,2*Math.PI);
					 contextoconclusao.stroke();
					 
					 contextoconclusao.font = "28pt Arial";
					 contextoconclusao.fillStyle = "#FBC012";
					 contextoconclusao.fillText(outros, 728, 1138);
					
					
					//REAVALICAO
					 contextoconclusao.font = "Bold 18pt Arial";
					 contextoconclusao.fillStyle = "#000";
					 contextoconclusao.fillText("Próximo Check-up de controle:", 160, 1210);
					 
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#333";
					 contextoconclusao.fillText(checkupControle, 545, 1210);
					
					
					//ASSINATURA DO DENTISTA
					 contextoconclusao.beginPath();
					 contextoconclusao.moveTo(160,1255);
					 contextoconclusao.lineTo(460,1255);
					 contextoconclusao.stroke();
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#000";
					 contextoconclusao.fillText(dentista_clinica, 160, 1280);
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#000";
					 contextoconclusao.fillText("CRO:", 160, 1305);
					 
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#000";
					 contextoconclusao.fillText(cro_dentista_clinica, 220, 1305);
					 
					 
					 
					 //ASSINATURA DO PACIENTE
					 
					 contextoconclusao.beginPath();
					 contextoconclusao.moveTo(700,1255);
					 contextoconclusao.lineTo(1000,1255);
					 contextoconclusao.stroke();
					
					 contextoconclusao.font = "16pt Arial";
					 contextoconclusao.fillStyle = "#000";
					 contextoconclusao.fillText(nome_paciente_laudo, 700, 1280);
					
					
					 contextoconclusao.font = "Italic 16pt Brush Script ";
					 contextoconclusao.fillStyle = "#333";
					 contextoconclusao.fillText(slogan_clinica_laudo, 235, 1345);
					 //FOTOS DO LAUDO
							
					
					 for (conta_visu = 0; conta_visu < imagens_monta_laudo.length; conta_visu++) { 
							var foto=imagens_monta_laudo[conta_visu];
							var foto_descr=descr_monta_laudo[conta_visu];
							num_dente=dente_laudo[conta_visu];
							
							//alert(num_dente);
							
							if(conta_visu==0){
								
								foto_laudo0 = $("<img/>", { 
								        crossorigin: "anonymous",
										src: foto, 
										load: function() {
										  	 
										  contextolaudo0.drawImage(this, 105, 470,430,241); 
										  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo0.fillRect (105, 470, 40, 56);//background
										  contextolaudo0.font = "16pt Arial";
										  contextolaudo0.fillStyle = "#fff";
										  contextolaudo0.fillText('1', 119, 504); 
										
										 // alert('Ordem '+num_dente+'\n Contador'+conta_visu);
										  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo0.fillRect (375, 470, 160, 56);//background
										  contextolaudo0.font = "16pt Arial";
										  contextolaudo0.fillStyle = "#fff"; 
										  contextolaudo0.fillText(dente_laudo[0], 391, 504);
										  
										  
										} 	
										
								});	
								//alert("0  "+num_dente)
								
								
								
								
								
								contextolaudo0.font = "16pt Arial";
								contextolaudo0.fillStyle = "#000";
								contextolaudo0.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==1){
								foto_laudo1 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										 contextolaudo0.drawImage(this, 565, 470,430,241);
										  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo0.fillRect (565, 470, 40, 56);//background
										  contextolaudo0.font = "16pt Arial";
										  contextolaudo0.fillStyle = "#fff";
										  contextolaudo0.fillText('2', 579, 503);   
										  
										 	  
											  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
											  contextolaudo0.fillRect (835, 470, 160, 56);//background
											  contextolaudo0.font = "16pt Arial";
											  contextolaudo0.fillStyle = "#fff"; 
											  contextolaudo0.fillText(dente_laudo[1], 846, 503);
										 
										  
										   
										  
										  
										} 	
								});	
								
								contextolaudo0.font = "16pt Arial";
								contextolaudo0.fillStyle = "#000";
								contextolaudo0.fillText(foto_descr, 565, 735);
								//alert("1  "+num_dente);
							}
							if(conta_visu==2){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo0.drawImage(this, 105, 745,430,241); 
										  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo0.fillRect (105, 745, 40, 56);//background
										  contextolaudo0.font = "16pt Arial";
										  contextolaudo0.fillStyle = "#fff";
										  contextolaudo0.fillText('3', 119, 780);  
										  
											  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
											  contextolaudo0.fillRect (375, 745, 160, 56);//background
											  contextolaudo0.font = "16pt Arial";
											  contextolaudo0.fillStyle = "#fff"; 
											  contextolaudo0.fillText(dente_laudo[2], 391, 780); 
										  
										} 	
								});	
								contextolaudo0.font = "16pt Arial";
								contextolaudo0.fillStyle = "#000";
								contextolaudo0.fillText(foto_descr, 105, 1010);
								//alert("2  "+num_dente)
							}
							
							if(conta_visu==3){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo0.drawImage(this, 565, 745,430,241); 
										  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo0.fillRect (565, 745, 40, 56);//background
										  contextolaudo0.font = "16pt Arial";
										  contextolaudo0.fillStyle = "#fff";
										  contextolaudo0.fillText('4', 579, 780); 
										  
										  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo0.fillRect (835, 745, 160, 56);//background
										  contextolaudo0.font = "16pt Arial";
										  contextolaudo0.fillStyle = "#fff"; 
										  contextolaudo0.fillText(dente_laudo[3], 846, 780);  
										} 	
								});	
								contextolaudo0.font = "16pt Arial";
								contextolaudo0.fillStyle = "#000";
								contextolaudo0.fillText(foto_descr, 565, 1010);
								//alert("3  "+num_dente)
							}
							if(conta_visu==4){
								foto_laudo4 = $("<img/>", { 
										crossorigin: "anonymous",							
										src: foto, 
										load: function() { 
										  contextolaudo0.drawImage(this, 105, 1020,430,241);   
										  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo0.fillRect (105, 1020, 40, 56);//background
										  contextolaudo0.font = "16pt Arial";
										  contextolaudo0.fillStyle = "#fff";
										  contextolaudo0.fillText('5', 119, 1055); 
										  
										  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo0.fillRect (375, 1020, 160, 56);//background
										  contextolaudo0.font = "16pt Arial";
										  contextolaudo0.fillStyle = "#fff"; 
										  contextolaudo0.fillText(dente_laudo[4], 391, 1055);
										} 	
								});	
								contextolaudo0.font = "16pt Arial";
								contextolaudo0.fillStyle = "#000";
								contextolaudo0.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==5){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo0.drawImage(this, 565, 1020,430,241); 
										  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo0.fillRect (565, 1020, 40, 56);//background
										  contextolaudo0.font = "16pt Arial";
										  contextolaudo0.fillStyle = "#fff";
										  contextolaudo0.fillText('6', 579, 1055);
										  
										  contextolaudo0.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo0.fillRect (835, 1020, 160, 56);//background
										  contextolaudo0.font = "16pt Arial";
										  contextolaudo0.fillStyle = "#fff"; 
										  contextolaudo0.fillText(dente_laudo[5], 846, 1055);    
										} 	
								});	
								contextolaudo0.font = "16pt Arial";
								contextolaudo0.fillStyle = "#000";
								contextolaudo0.fillText(foto_descr, 565, 1285);
								
								 
							}
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								 
 src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo0.drawImage(this, 105, 90,110,110);
									  
								  } 	
							});
							contextolaudo0.font = "20pt Arial";
							contextolaudo0.fillStyle = "#000";
							contextolaudo0.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo0.font = "16pt Arial";
							contextolaudo0.fillStyle = "#828282";
							contextolaudo0.fillText(endereco_laudo, 270, 130);
							
							contextolaudo0.font = "16pt Arial";
							contextolaudo0.fillStyle = "#828282";
							contextolaudo0.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo0.font = "16pt Arial";
							contextolaudo0.fillStyle = "#828282";
							contextolaudo0.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo0.font = "16pt Arial";
							contextolaudo0.fillStyle = "#828282";
							contextolaudo0.fillText(site_clinica_laudo, 270, 205);
							
							foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo0.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							 contextolaudo0.font = "20pt Arial";
							 contextolaudo0.fillStyle = "#000";
							 contextolaudo0.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo0.font = "16pt Arial";
							 contextolaudo0.fillStyle = "#828282";
							 contextolaudo0.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo0.font = "16pt Arial";
							 contextolaudo0.fillStyle = "#828282";
							 contextolaudo0.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo0.font = "16pt Arial";
							 contextolaudo0.fillStyle = "#828282";
							 contextolaudo0.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo0.font = "16pt Arial";
							 contextolaudo0.fillStyle = "#828282";
							 contextolaudo0.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo0.font = "16pt Arial";
							 contextolaudo0.fillStyle = "#828282";
							 contextolaudo0.fillText(email_paciente_laudo, 270, 360);
							
							contextolaudo0.font = "Italic 16pt Brush Script ";
							contextolaudo0.fillStyle = "#333";
							contextolaudo0.fillText(slogan_clinica_laudo, 235, 1345);
						 //	$('#canvasMontaLaudo0').removeClass('hide');
						 //DANIEL ALARCON 27/09 
							 
					 
							
		
							
							//PROXIMA PAGINA  2 
							
							if(conta_visu==6){
								
								foto_laudo6 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo1.drawImage(this, 105, 470,430,241); 
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (105, 470, 40, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff";
										  contextolaudo1.fillText('7', 119, 504); 
										  
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (375, 470, 160, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff"; 
										  contextolaudo1.fillText(dente_laudo[6], 391, 504);
										} 	
								});	
								
								contextolaudo1.font = "16pt Arial";
								contextolaudo1.fillStyle = "#000";
								contextolaudo1.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==7){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo1.drawImage(this, 565, 470,430,241);
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (565, 470, 40, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff";
										  contextolaudo1.fillText('8', 579, 503);    
										  
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (835, 470, 160, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff"; 
										  contextolaudo1.fillText(dente_laudo[7], 846, 503);
										} 	
								});	
								
								contextolaudo1.font = "16pt Arial";
								contextolaudo1.fillStyle = "#000";
								contextolaudo1.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==8){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo1.drawImage(this, 105, 745,430,241); 
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (105, 745, 40, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff";
										  contextolaudo1.fillText('9', 119, 780);  
										  
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (375, 745, 160, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff"; 
										  contextolaudo1.fillText(dente_laudo[8], 391, 780);  
										} 	
								});	
								contextolaudo1.font = "16pt Arial";
								contextolaudo1.fillStyle = "#000";
								contextolaudo1.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==9){
								foto_laudo3 = $("<img/>", { 
			crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo1.drawImage(this, 565, 745,430,241); 
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (565, 745, 40, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff";
										  contextolaudo1.fillText('10', 579, 780); 
										  
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (835, 745, 160, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff"; 
										  contextolaudo1.fillText(dente_laudo[9], 846, 780);  
										} 	
								});	
								contextolaudo1.font = "16pt Arial";
								contextolaudo1.fillStyle = "#000";
								contextolaudo1.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==10){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo1.drawImage(this, 105, 1020,430,241);   
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (105, 1020, 40, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff";
										  contextolaudo1.fillText('11', 119, 1055); 
										  
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (375, 1020, 160, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff"; 
										  contextolaudo1.fillText(dente_laudo[10], 391, 1055);
										} 	
								});	
								contextolaudo1.font = "16pt Arial";
								contextolaudo1.fillStyle = "#000";
								contextolaudo1.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==11){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo1.drawImage(this, 565, 1020,430,241); 
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (565, 1020, 40, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff";
										  contextolaudo1.fillText('12', 579, 1055);
										  
										  contextolaudo1.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo1.fillRect (835, 1020, 160, 56);//background
										  contextolaudo1.font = "16pt Arial";
										  contextolaudo1.fillStyle = "#fff"; 
										  contextolaudo1.fillText(dente_laudo[11], 846, 1055);    
										} 	
								});	
								contextolaudo1.font = "16pt Arial";
								contextolaudo1.fillStyle = "#000";
								contextolaudo1.fillText(foto_descr, 565, 1285);
								
								 
							}
							
							
							contextolaudo1.font = "Italic 16pt Brush Script ";
							contextolaudo1.fillStyle = "#333";
							contextolaudo1.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo1.drawImage(this, 105, 90,110,110);
									  
								  } 	
							});
							
							contextolaudo1.font = "20pt Arial";
							contextolaudo1.fillStyle = "#000";
							contextolaudo1.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo1.font = "16pt Arial";
							contextolaudo1.fillStyle = "#828282";
							contextolaudo1.fillText(endereco_laudo, 270, 130);
							
							contextolaudo1.font = "16pt Arial";
							contextolaudo1.fillStyle = "#828282";
							contextolaudo1.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo1.font = "16pt Arial";
							contextolaudo1.fillStyle = "#828282";
							contextolaudo1.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo1.font = "16pt Arial";
							contextolaudo1.fillStyle = "#828282";
							contextolaudo1.fillText(site_clinica_laudo, 270, 205);
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo1.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo1.font = "20pt Arial";
							 contextolaudo1.fillStyle = "#000";
							 contextolaudo1.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo1.font = "16pt Arial";
							 contextolaudo1.fillStyle = "#828282";
							 contextolaudo1.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo1.font = "16pt Arial";
							 contextolaudo1.fillStyle = "#828282";
							 contextolaudo1.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo1.font = "16pt Arial";
							 contextolaudo1.fillStyle = "#828282";
							 contextolaudo1.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo1.font = "16pt Arial";
							 contextolaudo1.fillStyle = "#828282";
							 contextolaudo1.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo1.font = "16pt Arial";
							 contextolaudo1.fillStyle = "#828282";
							 contextolaudo1.fillText(email_paciente_laudo, 270, 360);
						 	//DANIEL ALARCON 27/09  
							//$('#canvasMontaLaudo1').removeClass('hide');
							//var pagina1=telaLaudo1.toDataURL();
							
	
							
							//PROXIMA PAGINA  3
							
							if(conta_visu==12){
								
								foto_laudo12 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo2.drawImage(this, 105, 470,430,241); 
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (105, 470, 40, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff";
										  contextolaudo2.fillText('13', 119, 504); 
										  
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (375, 470, 160, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff"; 
										  contextolaudo2.fillText(dente_laudo[12], 391, 504);
										} 	
								});	
								
								contextolaudo2.font = "16pt Arial";
								contextolaudo2.fillStyle = "#000";
								contextolaudo2.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==13){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo2.drawImage(this, 565, 470,430,241);
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (565, 470, 40, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff";
										  contextolaudo2.fillText('14', 579, 503);    
										  
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (835, 470, 160, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff"; 
										  contextolaudo2.fillText(dente_laudo[13], 846, 503);
										} 	
								});	
								
								contextolaudo2.font = "16pt Arial";
								contextolaudo2.fillStyle = "#000";
								contextolaudo2.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==14){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo2.drawImage(this, 105, 745,430,241); 
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (105, 745, 40, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff";
										  contextolaudo2.fillText('15', 119, 780);  
										  
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (375, 745, 160, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff"; 
										  contextolaudo2.fillText(dente_laudo[14], 391, 780);  
										} 	
								});	
								contextolaudo2.font = "16pt Arial";
								contextolaudo2.fillStyle = "#000";
								contextolaudo2.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==15){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo2.drawImage(this, 565, 745,430,241); 
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (565, 745, 40, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff";
										  contextolaudo2.fillText('16', 579, 780); 
										  
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (835, 745, 160, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff"; 
										  contextolaudo2.fillText(dente_laudo[15], 846, 780);  
										} 	
								});	
								contextolaudo2.font = "16pt Arial";
								contextolaudo2.fillStyle = "#000";
								contextolaudo2.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==16){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo2.drawImage(this, 105, 1020,430,241);   
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (105, 1020, 40, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff";
										  contextolaudo2.fillText('17', 119, 1055); 
										  
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (375, 1020, 160, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff"; 
										  contextolaudo2.fillText(dente_laudo[16], 391, 1055);
										} 	
								});	
								contextolaudo2.font = "16pt Arial";
								contextolaudo2.fillStyle = "#000";
								contextolaudo2.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==17){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo2.drawImage(this, 565, 1020,430,241); 
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (565, 1020, 40, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff";
										  contextolaudo2.fillText('18', 579, 1055);
										  
										  contextolaudo2.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo2.fillRect (835, 1020, 160, 56);//background
										  contextolaudo2.font = "16pt Arial";
										  contextolaudo2.fillStyle = "#fff"; 
										  contextolaudo2.fillText(dente_laudo[17], 846, 1055);    
										} 	
								});	
								contextolaudo2.font = "16pt Arial";
								contextolaudo2.fillStyle = "#000";
								contextolaudo2.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo2.font = "Italic 16pt Brush Script ";
							contextolaudo2.fillStyle = "#333";
							contextolaudo2.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo2.drawImage(this, 105, 90,110,110);
									 
								  } 	
							});
							
							contextolaudo2.font = "20pt Arial";
							contextolaudo2.fillStyle = "#000";
							contextolaudo2.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo2.font = "16pt Arial";
							contextolaudo2.fillStyle = "#828282";
							contextolaudo2.fillText(endereco_laudo, 270, 130);
							
							contextolaudo2.font = "16pt Arial";
							contextolaudo2.fillStyle = "#828282";
							contextolaudo2.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo2.font = "16pt Arial";
							contextolaudo2.fillStyle = "#828282";
							contextolaudo2.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo2.font = "16pt Arial";
							contextolaudo2.fillStyle = "#828282";
							contextolaudo2.fillText(site_clinica_laudo, 270, 205);
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo2.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo2.font = "20pt Arial";
							 contextolaudo2.fillStyle = "#000";
							 contextolaudo2.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo2.font = "16pt Arial";
							 contextolaudo2.fillStyle = "#828282";
							 contextolaudo2.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo2.font = "16pt Arial";
							 contextolaudo2.fillStyle = "#828282";
							 contextolaudo2.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo2.font = "16pt Arial";
							 contextolaudo2.fillStyle = "#828282";
							 contextolaudo2.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo2.font = "16pt Arial";
							 contextolaudo2.fillStyle = "#828282";
							 contextolaudo2.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo2.font = "16pt Arial";
							 contextolaudo2.fillStyle = "#828282";
							 contextolaudo2.fillText(email_paciente_laudo, 270, 360);
						 //DANIEL ALARCON 27/09 
						//$('#canvasMontaLaudo2').removeClass('hide');
							
							
	
	
							//PROXIMA PAGINA  4
							
							if(conta_visu==18){
								
								foto_laudo18 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo3.drawImage(this, 105, 470,430,241); 
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (105, 470, 40, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff";
										  contextolaudo3.fillText('19', 119, 504); 
										  
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (375, 470, 160, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff"; 
										  contextolaudo3.fillText(dente_laudo[18], 391, 504);
										} 	
								});	
								
								contextolaudo3.font = "16pt Arial";
								contextolaudo3.fillStyle = "#000";
								contextolaudo3.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==19){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo3.drawImage(this, 565, 470,430,241);
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (565, 470, 40, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff";
										  contextolaudo3.fillText('20', 579, 503);    
										  
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (835, 470, 160, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff"; 
										  contextolaudo3.fillText(dente_laudo[19], 846, 503);
										} 	
								});	
								
								contextolaudo3.font = "16pt Arial";
								contextolaudo3.fillStyle = "#000";
								contextolaudo3.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==20){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo3.drawImage(this, 105, 745,430,241); 
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (105, 745, 40, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff";
										  contextolaudo3.fillText('21', 119, 780);  
										  
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (375, 745, 160, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff"; 
										  contextolaudo3.fillText(dente_laudo[20], 391, 780);  
										} 	
								});	
								contextolaudo3.font = "16pt Arial";
								contextolaudo3.fillStyle = "#000";
								contextolaudo3.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==21){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo3.drawImage(this, 565, 745,430,241); 
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (565, 745, 40, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff";
										  contextolaudo3.fillText('22', 579, 780); 
										  
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (835, 745, 160, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff"; 
										  contextolaudo3.fillText(dente_laudo[21], 846, 780);  
										} 	
								});	
								contextolaudo3.font = "16pt Arial";
								contextolaudo3.fillStyle = "#000";
								contextolaudo3.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==22){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo3.drawImage(this, 105, 1020,430,241);   
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (105, 1020, 40, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff";
										  contextolaudo3.fillText('23', 119, 1055); 
										  
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (375, 1020, 160, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff"; 
										  contextolaudo3.fillText(dente_laudo[22], 391, 1055);
										} 	
								});	
								contextolaudo3.font = "16pt Arial";
								contextolaudo3.fillStyle = "#000";
								contextolaudo3.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==23){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo3.drawImage(this, 565, 1020,430,241); 
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (565, 1020, 40, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff";
										  contextolaudo3.fillText('24', 579, 1055);
										  
										  contextolaudo3.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo3.fillRect (835, 1020, 160, 56);//background
										  contextolaudo3.font = "16pt Arial";
										  contextolaudo3.fillStyle = "#fff"; 
										  contextolaudo3.fillText(dente_laudo[23], 846, 1055);    
										} 	
								});	
								contextolaudo3.font = "16pt Arial";
								contextolaudo3.fillStyle = "#000";
								contextolaudo3.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo3.font = "Italic 16pt Brush Script ";
							contextolaudo3.fillStyle = "#333";
							contextolaudo3.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  load: function() {   
									  contextolaudo3.drawImage(this, 105, 90,110,110);  
								  } 	
							});
							contextolaudo3.font = "20pt Arial";
							contextolaudo3.fillStyle = "#000";
							contextolaudo3.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo3.font = "16pt Arial";
							contextolaudo3.fillStyle = "#828282";
							contextolaudo3.fillText(endereco_laudo, 270, 130);
							
							contextolaudo3.font = "16pt Arial";
							contextolaudo3.fillStyle = "#828282";
							contextolaudo3.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo3.font = "16pt Arial";
							contextolaudo3.fillStyle = "#828282";
							contextolaudo3.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo3.font = "16pt Arial";
							contextolaudo3.fillStyle = "#828282";
							contextolaudo3.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo3.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo3.font = "20pt Arial";
							 contextolaudo3.fillStyle = "#000";
							 contextolaudo3.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo3.font = "16pt Arial";
							 contextolaudo3.fillStyle = "#828282";
							 contextolaudo3.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo3.font = "16pt Arial";
							 contextolaudo3.fillStyle = "#828282";
							 contextolaudo3.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo3.font = "16pt Arial";
							 contextolaudo3.fillStyle = "#828282";
							 contextolaudo3.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo3.font = "16pt Arial";
							 contextolaudo3.fillStyle = "#828282";
							 contextolaudo3.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo3.font = "16pt Arial";
							 contextolaudo3.fillStyle = "#828282";
							 contextolaudo3.fillText(email_paciente_laudo, 270, 360);
						 //DANIEL ALARCON 27/09 
						 //$('#canvasMontaLaudo3').removeClass('hide');
							
							
	
							
							//PROXIMA PAGINA  5
							if(conta_visu==24){
								
								foto_laudo24 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo4.drawImage(this, 105, 470,430,241); 
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (105, 470, 40, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff";
										  contextolaudo4.fillText('25', 119, 504); 
										  
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (375, 470, 160, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff"; 
										  contextolaudo4.fillText(dente_laudo[24], 391, 504);
										} 	
								});	
								
								contextolaudo4.font = "16pt Arial";
								contextolaudo4.fillStyle = "#000";
								contextolaudo4.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==25){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo4.drawImage(this, 565, 470,430,241);
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (565, 470, 40, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff";
										  contextolaudo4.fillText('26', 579, 503);    
										  
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (835, 470, 160, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff"; 
										  contextolaudo4.fillText(dente_laudo[25], 846, 503);
										} 	
								});	
								
								contextolaudo4.font = "16pt Arial";
								contextolaudo4.fillStyle = "#000";
								contextolaudo4.fillText(foto_descr, 565, 735);
								
								
							}
							if(conta_visu==26){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo4.drawImage(this, 105, 745,430,241); 
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (105, 745, 40, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff";
										  contextolaudo4.fillText('27', 119, 780);  
										  
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (375, 745, 160, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff"; 
										  contextolaudo4.fillText(dente_laudo[26], 391, 780);  
										} 	
								});	
								contextolaudo4.font = "16pt Arial";
								contextolaudo4.fillStyle = "#000";
								contextolaudo4.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==27){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo4.drawImage(this, 565, 745,430,241); 
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (565, 745, 40, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff";
										  contextolaudo4.fillText('28', 579, 780); 
										  
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (835, 745, 160, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff"; 
										  contextolaudo4.fillText(dente_laudo[27], 846, 780);  
										} 	
								});	
								contextolaudo4.font = "16pt Arial";
								contextolaudo4.fillStyle = "#000";
								contextolaudo4.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==28){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo4.drawImage(this, 105, 1020,430,241);   
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (105, 1020, 40, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff";
										  contextolaudo4.fillText('29', 119, 1055); 
										  
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (375, 1020, 160, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff"; 
										  contextolaudo4.fillText(dente_laudo[28], 391, 1055);
										} 	
								});	
								contextolaudo4.font = "16pt Arial";
								contextolaudo4.fillStyle = "#000";
								contextolaudo4.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==29){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo4.drawImage(this, 565, 1020,430,241); 
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (565, 1020, 40, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff";
										  contextolaudo4.fillText('30', 579, 1055);
										  
										  contextolaudo4.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo4.fillRect (835, 1020, 160, 56);//background
										  contextolaudo4.font = "16pt Arial";
										  contextolaudo4.fillStyle = "#fff"; 
										  contextolaudo4.fillText(dente_laudo[29], 846, 1055);    
										} 	
								});	
								contextolaudo4.font = "16pt Arial";
								contextolaudo4.fillStyle = "#000";
								contextolaudo4.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo4.font = "Italic 16pt Brush Script ";
							contextolaudo4.fillStyle = "#333";
							contextolaudo4.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80, 
								  load: function() { 	  
									  contextolaudo4.drawImage(this, 105, 90,110,110);	 
								  } 	
							});
							
							contextolaudo4.font = "20pt Arial";
							contextolaudo4.fillStyle = "#000";
							contextolaudo4.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo4.font = "16pt Arial";
							contextolaudo4.fillStyle = "#828282";
							contextolaudo4.fillText(endereco_laudo, 270, 130);
							
							contextolaudo4.font = "16pt Arial";
							contextolaudo4.fillStyle = "#828282";
							contextolaudo4.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo4.font = "16pt Arial";
							contextolaudo4.fillStyle = "#828282";
							contextolaudo4.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo4.font = "16pt Arial";
							contextolaudo4.fillStyle = "#828282";
							contextolaudo4.fillText(site_clinica_laudo, 270, 205);
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo4.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo4.font = "20pt Arial";
							 contextolaudo4.fillStyle = "#000";
							 contextolaudo4.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo4.font = "16pt Arial";
							 contextolaudo4.fillStyle = "#828282";
							 contextolaudo4.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo4.font = "16pt Arial";
							 contextolaudo4.fillStyle = "#828282";
							 contextolaudo4.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo4.font = "16pt Arial";
							 contextolaudo4.fillStyle = "#828282";
							 contextolaudo4.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo4.font = "16pt Arial";
							 contextolaudo4.fillStyle = "#828282";
							 contextolaudo4.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo4.font = "16pt Arial";
							 contextolaudo4.fillStyle = "#828282";
							 contextolaudo4.fillText(email_paciente_laudo, 270, 360);
						 //DANIEL ALARCON 27/09 
						//$('#canvasMontaLaudo4').removeClass('hide');
							
							
	
							
							//PROXIMA PAGINA 6
							
							if(conta_visu==30){
								
								foto_laudo30 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo5.drawImage(this, 105, 470,430,241); 
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (105, 470, 40, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff";
										  contextolaudo5.fillText('31', 119, 504); 
										  
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (375, 470, 160, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff"; 
										  contextolaudo5.fillText(dente_laudo[30], 391, 504);
										} 	
								});	
								
								contextolaudo5.font = "16pt Arial";
								contextolaudo5.fillStyle = "#000";
								contextolaudo5.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==31){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo5.drawImage(this, 565, 470,430,241);
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (565, 470, 40, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff";
										  contextolaudo5.fillText('32', 579, 503);    
										  
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (835, 470, 160, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff"; 
										  contextolaudo5.fillText(dente_laudo[31], 846, 503);
										} 	
								});	
								
								contextolaudo5.font = "16pt Arial";
								contextolaudo5.fillStyle = "#000";
								contextolaudo5.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==32){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo5.drawImage(this, 105, 745,430,241); 
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (105, 745, 40, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff";
										  contextolaudo5.fillText('33', 119, 780);  
										  
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (375, 745, 160, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff"; 
										  contextolaudo5.fillText(dente_laudo[32], 391, 780);  
										} 	
								});	
								contextolaudo5.font = "16pt Arial";
								contextolaudo5.fillStyle = "#000";
								contextolaudo5.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==33){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo5.drawImage(this, 565, 745,430,241); 
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (565, 745, 40, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff";
										  contextolaudo5.fillText('34', 579, 780); 
										  
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (835, 745, 160, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff"; 
										  contextolaudo5.fillText(dente_laudo[33], 846, 780);  
										} 	
								});	
								contextolaudo5.font = "16pt Arial";
								contextolaudo5.fillStyle = "#000";
								contextolaudo5.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==34){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo5.drawImage(this, 105, 1020,430,241);   
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (105, 1020, 40, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff";
										  contextolaudo5.fillText('35', 119, 1055); 
										  
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (375, 1020, 160, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff"; 
										  contextolaudo5.fillText(dente_laudo[34], 391, 1055);
										} 	
								});	
								contextolaudo5.font = "16pt Arial";
								contextolaudo5.fillStyle = "#000";
								contextolaudo5.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==35){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo5.drawImage(this, 565, 1020,430,241); 
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (565, 1020, 40, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff";
										  contextolaudo5.fillText('36', 579, 1055);
										  
										  contextolaudo5.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo5.fillRect (835, 1020, 160, 56);//background
										  contextolaudo5.font = "16pt Arial";
										  contextolaudo5.fillStyle = "#fff"; 
										  contextolaudo5.fillText(dente_laudo[35], 846, 1055);    
										} 	
								});	
								contextolaudo5.font = "16pt Arial";
								contextolaudo5.fillStyle = "#000";
								contextolaudo5.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo5.font = "Italic 16pt Brush Script ";
							contextolaudo5.fillStyle = "#333";
							contextolaudo5.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,  
								  load: function() { 	  
									  contextolaudo5.drawImage(this, 105, 90,110,110);			  
								  } 	
							});
							
							contextolaudo5.font = "20pt Arial";
							contextolaudo5.fillStyle = "#000";
							contextolaudo5.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo5.font = "16pt Arial";
							contextolaudo5.fillStyle = "#828282";
							contextolaudo5.fillText(endereco_laudo, 270, 130);
							
							contextolaudo5.font = "16pt Arial";
							contextolaudo5.fillStyle = "#828282";
							contextolaudo5.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo5.font = "16pt Arial";
							contextolaudo5.fillStyle = "#828282";
							contextolaudo5.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo5.font = "16pt Arial";
							contextolaudo5.fillStyle = "#828282";
							contextolaudo5.fillText(site_clinica_laudo, 270, 205);
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo5.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo5.font = "20pt Arial";
							 contextolaudo5.fillStyle = "#000";
							 contextolaudo5.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo5.font = "16pt Arial";
							 contextolaudo5.fillStyle = "#828282";
							 contextolaudo5.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo5.font = "16pt Arial";
							 contextolaudo5.fillStyle = "#828282";
							 contextolaudo5.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo5.font = "16pt Arial";
							 contextolaudo5.fillStyle = "#828282";
							 contextolaudo5.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo5.font = "16pt Arial";
							 contextolaudo5.fillStyle = "#828282";
							 contextolaudo5.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo5.font = "16pt Arial";
							 contextolaudo5.fillStyle = "#828282";
							 contextolaudo5.fillText(email_paciente_laudo, 270, 360);
						 //DANIEL ALARCON 27/09 
						 //$('#canvasMontaLaudo5').removeClass('hide');
							
							
	
							
							//PROXIMA PAGINA  7
							
							if(conta_visu==36){
								
								foto_laudo30 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo6.drawImage(this, 105, 470,430,241); 
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (105, 470, 40, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff";
										  contextolaudo6.fillText('37', 119, 504); 
										  
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (375, 470, 160, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff"; 
										  contextolaudo6.fillText(dente_laudo[36], 391, 504);
										} 	
								});	
								
								contextolaudo6.font = "16pt Arial";
								contextolaudo6.fillStyle = "#000";
								contextolaudo6.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==37){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo6.drawImage(this, 565, 470,430,241);
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (565, 470, 40, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff";
										  contextolaudo6.fillText('38', 579, 503);    
										  
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (835, 470, 160, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff"; 
										  contextolaudo6.fillText(dente_laudo[37], 846, 503);
										} 	
								});	
								
								contextolaudo6.font = "16pt Arial";
								contextolaudo6.fillStyle = "#000";
								contextolaudo6.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==38){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo6.drawImage(this, 105, 745,430,241); 
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (105, 745, 40, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff";
										  contextolaudo6.fillText('39', 119, 780);  
										  
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (375, 745, 160, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff"; 
										  contextolaudo6.fillText(dente_laudo[38], 391, 780);  
										} 	
								});	
								contextolaudo6.font = "16pt Arial";
								contextolaudo6.fillStyle = "#000";
								contextolaudo6.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==39){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo6.drawImage(this, 565, 745,430,241); 
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (565, 745, 40, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff";
										  contextolaudo6.fillText('40', 579, 780); 
										  
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (835, 745, 160, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff"; 
										  contextolaudo6.fillText(dente_laudo[39], 846, 780);  
										} 	
								});	
								contextolaudo6.font = "16pt Arial";
								contextolaudo6.fillStyle = "#000";
								contextolaudo6.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==40){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo6.drawImage(this, 105, 1020,430,241);   
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (105, 1020, 40, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff";
										  contextolaudo6.fillText('41', 119, 1055); 
										  
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (375, 1020, 160, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff"; 
										  contextolaudo6.fillText(dente_laudo[40], 391, 1055);
										} 	
								});	
								contextolaudo6.font = "16pt Arial";
								contextolaudo6.fillStyle = "#000";
								contextolaudo6.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==41){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo6.drawImage(this, 565, 1020,430,241); 
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (565, 1020, 40, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff";
										  contextolaudo6.fillText('42', 579, 1055);
										  
										  contextolaudo6.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo6.fillRect (835, 1020, 160, 56);//background
										  contextolaudo6.font = "16pt Arial";
										  contextolaudo6.fillStyle = "#fff"; 
										  contextolaudo6.fillText(dente_laudo[41], 846, 1055);    
										} 	
								});	
								contextolaudo6.font = "16pt Arial";
								contextolaudo6.fillStyle = "#000";
								contextolaudo6.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo6.font = "Italic 16pt Brush Script ";
							contextolaudo6.fillStyle = "#333";
							contextolaudo6.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo6.drawImage(this, 105, 90,110,110);
									  
								  } 	
							});
							
							contextolaudo6.font = "20pt Arial";
							contextolaudo6.fillStyle = "#000";
							contextolaudo6.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo6.font = "16pt Arial";
							contextolaudo6.fillStyle = "#828282";
							contextolaudo6.fillText(endereco_laudo, 270, 130);
							
							contextolaudo6.font = "16pt Arial";
							contextolaudo6.fillStyle = "#828282";
							contextolaudo6.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo6.font = "16pt Arial";
							contextolaudo6.fillStyle = "#828282";
							contextolaudo6.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo6.font = "16pt Arial";
							contextolaudo6.fillStyle = "#828282";
							contextolaudo6.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo6.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo6.font = "20pt Arial";
							 contextolaudo6.fillStyle = "#000";
							 contextolaudo6.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo6.font = "16pt Arial";
							 contextolaudo6.fillStyle = "#828282";
							 contextolaudo6.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo6.font = "16pt Arial";
							 contextolaudo6.fillStyle = "#828282";
							 contextolaudo6.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo6.font = "16pt Arial";
							 contextolaudo6.fillStyle = "#828282";
							 contextolaudo6.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo6.font = "16pt Arial";
							 contextolaudo6.fillStyle = "#828282";
							 contextolaudo6.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo6.font = "16pt Arial";
							 contextolaudo6.fillStyle = "#828282";
							 contextolaudo6.fillText(email_paciente_laudo, 270, 360);
						//DANIEL ALARCON 27/09 
						//$('#canvasMontaLaudo6').removeClass('hide');
							
	
							
							//PROXIMA PAGINA  8
							
							if(conta_visu==42){
								
								foto_laudoxx = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo7.drawImage(this, 105, 470,430,241); 
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (105, 470, 40, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff";
										  contextolaudo7.fillText('43', 119, 504); 
										  
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (375, 470, 160, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff"; 
										  contextolaudo7.fillText(dente_laudo[42], 391, 504);
										} 	
								});	
								
								contextolaudo7.font = "16pt Arial";
								contextolaudo7.fillStyle = "#000";
								contextolaudo7.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==43){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo7.drawImage(this, 565, 470,430,241);
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (565, 470, 40, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff";
										  contextolaudo7.fillText('44', 579, 503);    
										  
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (835, 470, 160, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff"; 
										  contextolaudo7.fillText(dente_laudo[43], 846, 503);
										} 	
								});	
								
								contextolaudo7.font = "16pt Arial";
								contextolaudo7.fillStyle = "#000";
								contextolaudo7.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==44){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo7.drawImage(this, 105, 745,430,241); 
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (105, 745, 40, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff";
										  contextolaudo7.fillText('45', 119, 780);  
										  
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (375, 745, 160, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff"; 
										  contextolaudo7.fillText(dente_laudo[44], 391, 780);  
										} 	
								});	
								contextolaudo7.font = "16pt Arial";
								contextolaudo7.fillStyle = "#000";
								contextolaudo7.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==45){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo7.drawImage(this, 565, 745,430,241); 
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (565, 745, 40, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff";
										  contextolaudo7.fillText('46', 579, 780); 
										  
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (835, 745, 160, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff"; 
										  contextolaudo7.fillText(dente_laudo[45], 846, 780);  
										} 	
								});	
								contextolaudo7.font = "16pt Arial";
								contextolaudo7.fillStyle = "#000";
								contextolaudo7.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==46){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo7.drawImage(this, 105, 1020,430,241);   
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (105, 1020, 40, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff";
										  contextolaudo7.fillText('47', 119, 1055); 
										  
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (375, 1020, 160, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff"; 
										  contextolaudo7.fillText(dente_laudo[46], 391, 1055);
										} 	
								});	
								contextolaudo7.font = "16pt Arial";
								contextolaudo7.fillStyle = "#000";
								contextolaudo7.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==47){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo7.drawImage(this, 565, 1020,430,241); 
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (565, 1020, 40, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff";
										  contextolaudo7.fillText('48', 579, 1055);
										  
										  contextolaudo7.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo7.fillRect (835, 1020, 160, 56);//background
										  contextolaudo7.font = "16pt Arial";
										  contextolaudo7.fillStyle = "#fff"; 
										  contextolaudo7.fillText(dente_laudo[47], 846, 1055);    
										} 	
								});	
								contextolaudo7.font = "16pt Arial";
								contextolaudo7.fillStyle = "#000";
								contextolaudo7.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo7.font = "Italic 16pt Brush Script ";
							contextolaudo7.fillStyle = "#333";
							contextolaudo7.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo7.drawImage(this, 105, 90,110,110);
									  
								  } 	
							});
							contextolaudo7.font = "20pt Arial";
							contextolaudo7.fillStyle = "#000";
							contextolaudo7.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo7.font = "16pt Arial";
							contextolaudo7.fillStyle = "#828282";
							contextolaudo7.fillText(endereco_laudo, 270, 130);
							
							contextolaudo7.font = "16pt Arial";
							contextolaudo7.fillStyle = "#828282";
							contextolaudo7.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo7.font = "16pt Arial";
							contextolaudo7.fillStyle = "#828282";
							contextolaudo7.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo7.font = "16pt Arial";
							contextolaudo7.fillStyle = "#828282";
							contextolaudo7.fillText(site_clinica_laudo, 270, 205);
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo7.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo7.font = "20pt Arial";
							 contextolaudo7.fillStyle = "#000";
							 contextolaudo7.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo7.font = "16pt Arial";
							 contextolaudo7.fillStyle = "#828282";
							 contextolaudo7.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo7.font = "16pt Arial";
							 contextolaudo7.fillStyle = "#828282";
							 contextolaudo7.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo7.font = "16pt Arial";
							 contextolaudo7.fillStyle = "#828282";
							 contextolaudo7.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo7.font = "16pt Arial";
							 contextolaudo7.fillStyle = "#828282";
							 contextolaudo7.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo7.font = "16pt Arial";
							 contextolaudo7.fillStyle = "#828282";
							 contextolaudo7.fillText(email_paciente_laudo, 270, 360);
							//$('#canvasMontaLaudo0').removeClass('hide');
						 	//DANIEL ALARCON 27/09 
							//$('#canvasMontaLaudo7').removeClass('hide');
							

							
							//PROXIMA PAGINA  9
							
							if(conta_visu==48){
								
								foto_laudo30 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo8.drawImage(this, 105, 470,430,241); 
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (105, 470, 40, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff";
										  contextolaudo8.fillText('49', 119, 504); 
										  
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (375, 470, 160, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff"; 
										  contextolaudo8.fillText(dente_laudo[48], 391, 504);
										} 	
								});	
								
								contextolaudo8.font = "16pt Arial";
								contextolaudo8.fillStyle = "#000";
								contextolaudo8.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==49){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo8.drawImage(this, 565, 470,430,241);
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (565, 470, 40, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff";
										  contextolaudo8.fillText('50', 579, 503);    
										  
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (835, 470, 160, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff"; 
										  contextolaudo8.fillText(dente_laudo[49], 846, 503);
										} 	
								});	
								
								contextolaudo8.font = "16pt Arial";
								contextolaudo8.fillStyle = "#000";
								contextolaudo8.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==50){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo8.drawImage(this, 105, 745,430,241); 
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (105, 745, 40, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff";
										  contextolaudo8.fillText('51', 119, 780);  
										  
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (375, 745, 160, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff"; 
										  contextolaudo8.fillText(dente_laudo[50], 391, 780);  
										} 	
								});	
								contextolaudo8.font = "16pt Arial";
								contextolaudo8.fillStyle = "#000";
								contextolaudo8.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==51){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo8.drawImage(this, 565, 745,430,241); 
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (565, 745, 40, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff";
										  contextolaudo8.fillText('52', 579, 780); 
										  
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (835, 745, 160, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff"; 
										  contextolaudo8.fillText(dente_laudo[51], 846, 780);  
										} 	
								});	
								contextolaudo8.font = "16pt Arial";
								contextolaudo8.fillStyle = "#000";
								contextolaudo8.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==52){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo8.drawImage(this, 105, 1020,430,241);   
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (105, 1020, 40, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff";
										  contextolaudo8.fillText('53', 119, 1055); 
										  
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (375, 1020, 160, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff"; 
										  contextolaudo8.fillText(dente_laudo[52], 391, 1055);
										} 	
								});	
								contextolaudo8.font = "16pt Arial";
								contextolaudo8.fillStyle = "#000";
								contextolaudo8.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==53){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo8.drawImage(this, 565, 1020,430,241); 
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (565, 1020, 40, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff";
										  contextolaudo8.fillText('54', 579, 1055);
										  
										  contextolaudo8.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo8.fillRect (835, 1020, 160, 56);//background
										  contextolaudo8.font = "16pt Arial";
										  contextolaudo8.fillStyle = "#fff"; 
										  contextolaudo8.fillText(dente_laudo[53], 846, 1055);    
										} 	
								});	
								contextolaudo8.font = "16pt Arial";
								contextolaudo8.fillStyle = "#000";
								contextolaudo8.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo8.font = "Italic 16pt Brush Script ";
							contextolaudo8.fillStyle = "#333";
							contextolaudo8.fillText(slogan_clinica_laudo, 235, 1345);
						
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									 
									  contextolaudo8.drawImage(this, 105, 90,110,110);
									  
								  } 	
							});
							contextolaudo8.font = "20pt Arial";
							contextolaudo8.fillStyle = "#000";
							contextolaudo8.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo8.font = "16pt Arial";
							contextolaudo8.fillStyle = "#828282";
							contextolaudo8.fillText(endereco_laudo, 270, 130);
							
							contextolaudo8.font = "16pt Arial";
							contextolaudo8.fillStyle = "#828282";
							contextolaudo8.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo8.font = "16pt Arial";
							contextolaudo8.fillStyle = "#828282";
							contextolaudo8.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo8.font = "16pt Arial";
							contextolaudo8.fillStyle = "#828282";
							contextolaudo8.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo8.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo8.font = "20pt Arial";
							 contextolaudo8.fillStyle = "#000";
							 contextolaudo8.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo8.font = "16pt Arial";
							 contextolaudo8.fillStyle = "#828282";
							 contextolaudo8.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo8.font = "16pt Arial";
							 contextolaudo8.fillStyle = "#828282";
							 contextolaudo8.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo8.font = "16pt Arial";
							 contextolaudo8.fillStyle = "#828282";
							 contextolaudo8.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo8.font = "16pt Arial";
							 contextolaudo8.fillStyle = "#828282";
							 contextolaudo8.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo8.font = "16pt Arial";
							 contextolaudo8.fillStyle = "#828282";
							 contextolaudo8.fillText(email_paciente_laudo, 270, 360);
							 
							 logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									 
									  contextolaudo8.drawImage(this, 105, 90,110,110);
									  
								  } 	
							});
							contextolaudo8.font = "20pt Arial";
							contextolaudo8.fillStyle = "#000";
							contextolaudo8.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo8.font = "16pt Arial";
							contextolaudo8.fillStyle = "#828282";
							contextolaudo8.fillText(endereco_laudo, 270, 130);
							
							contextolaudo8.font = "16pt Arial";
							contextolaudo8.fillStyle = "#828282";
							contextolaudo8.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo8.font = "16pt Arial";
							contextolaudo8.fillStyle = "#828282";
							contextolaudo8.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo8.font = "16pt Arial";
							contextolaudo8.fillStyle = "#828282";
							contextolaudo8.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo8.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo8.font = "20pt Arial";
							 contextolaudo8.fillStyle = "#000";
							 contextolaudo8.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo8.font = "16pt Arial";
							 contextolaudo8.fillStyle = "#828282";
							 contextolaudo8.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo8.font = "16pt Arial";
							 contextolaudo8.fillStyle = "#828282";
							 contextolaudo8.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo8.font = "16pt Arial";
							 contextolaudo8.fillStyle = "#828282";
							 contextolaudo8.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo8.font = "16pt Arial";
							 contextolaudo8.fillStyle = "#828282";
							 contextolaudo8.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo8.font = "16pt Arial";
							 contextolaudo8.fillStyle = "#828282";
							 contextolaudo8.fillText(email_paciente_laudo, 270, 360);
						 //DANIEL ALARCON 27/09 
							 
							//$('#canvasMontaLaudo8').removeClass('hide');
							
	
							
							//PROXIMA PAGINA  10
							
							if(conta_visu==54){
								
								foto_laudo30 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo9.drawImage(this, 105, 470,430,241); 
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (105, 470, 40, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff";
										  contextolaudo9.fillText('55', 119, 504); 
										  
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (375, 470, 160, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff"; 
										  contextolaudo9.fillText(dente_laudo[54], 391, 504);
										} 	
								});	
								
								contextolaudo9.font = "16pt Arial";
								contextolaudo9.fillStyle = "#000";
								contextolaudo9.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==55){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo9.drawImage(this, 565, 470,430,241);
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (565, 470, 40, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff";
										  contextolaudo9.fillText('56', 579, 503);    
										  
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (835, 470, 160, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff"; 
										  contextolaudo9.fillText(dente_laudo[55], 846, 503);
										} 	
								});	
								
								contextolaudo9.font = "16pt Arial";
								contextolaudo9.fillStyle = "#000";
								contextolaudo9.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==56){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo9.drawImage(this, 105, 745,430,241); 
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (105, 745, 40, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff";
										  contextolaudo9.fillText('57', 119, 780);  
										  
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (375, 745, 160, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff"; 
										  contextolaudo9.fillText(dente_laudo[56], 391, 780);  
										} 	
								});	
								contextolaudo9.font = "16pt Arial";
								contextolaudo9.fillStyle = "#000";
								contextolaudo9.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==57){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo9.drawImage(this, 565, 745,430,241); 
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (565, 745, 40, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff";
										  contextolaudo9.fillText('58', 579, 780); 
										  
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (835, 745, 160, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff"; 
										  contextolaudo9.fillText(dente_laudo[57], 846, 780);  
										} 	
								});	
								contextolaudo9.font = "16pt Arial";
								contextolaudo9.fillStyle = "#000";
								contextolaudo9.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==58){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo9.drawImage(this, 105, 1020,430,241);   
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (105, 1020, 40, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff";
										  contextolaudo9.fillText('59', 119, 1055); 
										  
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (375, 1020, 160, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff"; 
										  contextolaudo9.fillText(dente_laudo[58], 391, 1055);
										} 	
								});	
								contextolaudo9.font = "16pt Arial";
								contextolaudo9.fillStyle = "#000";
								contextolaudo9.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==59){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo9.drawImage(this, 565, 1020,430,241); 
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (565, 1020, 40, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff";
										  contextolaudo9.fillText('60', 579, 1055);
										  
										  contextolaudo9.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo9.fillRect (835, 1020, 160, 56);//background
										  contextolaudo9.font = "16pt Arial";
										  contextolaudo9.fillStyle = "#fff"; 
										  contextolaudo9.fillText(dente_laudo[59], 846, 1055);    
										} 	
								});	
								contextolaudo9.font = "16pt Arial";
								contextolaudo9.fillStyle = "#000";
								contextolaudo9.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo9.font = "Italic 16pt Brush Script ";
							contextolaudo9.fillStyle = "#333";
							contextolaudo9.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo9.drawImage(this, 105, 90,110,110);
									 
								  } 	
							});
							contextolaudo9.font = "20pt Arial";
							contextolaudo9.fillStyle = "#000";
							contextolaudo9.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo9.font = "16pt Arial";
							contextolaudo9.fillStyle = "#828282";
							contextolaudo9.fillText(endereco_laudo, 270, 130);
							
							contextolaudo9.font = "16pt Arial";
							contextolaudo9.fillStyle = "#828282";
							contextolaudo9.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo9.font = "16pt Arial";
							contextolaudo9.fillStyle = "#828282";
							contextolaudo9.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo9.font = "16pt Arial";
							contextolaudo9.fillStyle = "#828282";
							contextolaudo9.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo9.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo9.font = "20pt Arial";
							 contextolaudo9.fillStyle = "#000";
							 contextolaudo9.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo9.font = "16pt Arial";
							 contextolaudo9.fillStyle = "#828282";
							 contextolaudo9.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo9.font = "16pt Arial";
							 contextolaudo9.fillStyle = "#828282";
							 contextolaudo9.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo9.font = "16pt Arial";
							 contextolaudo9.fillStyle = "#828282";
							 contextolaudo9.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo9.font = "16pt Arial";
							 contextolaudo9.fillStyle = "#828282";
							 contextolaudo9.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo9.font = "16pt Arial";
							 contextolaudo9.fillStyle = "#828282";
							 contextolaudo9.fillText(email_paciente_laudo, 270, 360);
						//$('#canvasMontaLaudo0').removeClass('hide');
						 //DANIEL ALARCON 27/09 
							 
							//$('#canvasMontaLaudo9').removeClass('hide');
							
							if(conta_visu==60){
								
								foto_laudox = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo10.drawImage(this, 105, 470,430,241); 
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (105, 470, 40, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff";
										  contextolaudo10.fillText('61', 119, 504); 
										  
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (375, 470, 160, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff"; 
										  contextolaudo10.fillText(dente_laudo[60], 391, 504);
										} 	
								});	
								
								contextolaudo10.font = "16pt Arial";
								contextolaudo10.fillStyle = "#000";
								contextolaudo10.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==61){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo10.drawImage(this, 565, 470,430,241);
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (565, 470, 40, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff";
										  contextolaudo10.fillText('62', 579, 503);    
										  
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (835, 470, 160, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff"; 
										  contextolaudo10.fillText(dente_laudo[61], 846, 503);
										} 	
								});	
								
								contextolaudo10.font = "16pt Arial";
								contextolaudo10.fillStyle = "#000";
								contextolaudo10.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==62){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo10.drawImage(this, 105, 745,430,241); 
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (105, 745, 40, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff";
										  contextolaudo10.fillText('63', 119, 780);  
										  
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (375, 745, 160, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff"; 
										  contextolaudo10.fillText(dente_laudo[62], 391, 780);  
										} 	
								});	
								contextolaudo10.font = "16pt Arial";
								contextolaudo10.fillStyle = "#000";
								contextolaudo10.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==63){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo10.drawImage(this, 565, 745,430,241); 
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (565, 745, 40, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff";
										  contextolaudo10.fillText('64', 579, 780); 
										  
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (835, 745, 160, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff"; 
										  contextolaudo10.fillText(dente_laudo[63], 846, 780);  
										} 	
								});	
								contextolaudo10.font = "16pt Arial";
								contextolaudo10.fillStyle = "#000";
								contextolaudo10.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==64){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo10.drawImage(this, 105, 1020,430,241);   
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (105, 1020, 40, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff";
										  contextolaudo10.fillText('65', 119, 1055); 
										  
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (375, 1020, 160, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff"; 
										  contextolaudo10.fillText(dente_laudo[64], 391, 1055);
										} 	
								});	
								contextolaudo10.font = "16pt Arial";
								contextolaudo10.fillStyle = "#000";
								contextolaudo10.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==65){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo10.drawImage(this, 565, 1020,430,241); 
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (565, 1020, 40, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff";
										  contextolaudo10.fillText('66', 579, 1055);
										  
										  contextolaudo10.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo10.fillRect (835, 1020, 160, 56);//background
										  contextolaudo10.font = "16pt Arial";
										  contextolaudo10.fillStyle = "#fff"; 
										  contextolaudo10.fillText(dente_laudo[65], 846, 1055);    
										} 	
								});	
								contextolaudo10.font = "16pt Arial";
								contextolaudo10.fillStyle = "#000";
								contextolaudo10.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo10.font = "Italic 16pt Brush Script ";
							contextolaudo10.fillStyle = "#333";
							contextolaudo10.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo10.drawImage(this, 105, 90,110,110);
									 
								  } 	
							});
							contextolaudo10.font = "20pt Arial";
							contextolaudo10.fillStyle = "#000";
							contextolaudo10.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo10.font = "16pt Arial";
							contextolaudo10.fillStyle = "#828282";
							contextolaudo10.fillText(endereco_laudo, 270, 130);
							
							contextolaudo10.font = "16pt Arial";
							contextolaudo10.fillStyle = "#828282";
							contextolaudo10.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo10.font = "16pt Arial";
							contextolaudo10.fillStyle = "#828282";
							contextolaudo10.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo10.font = "16pt Arial";
							contextolaudo10.fillStyle = "#828282";
							contextolaudo10.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo10.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo10.font = "20pt Arial";
							 contextolaudo10.fillStyle = "#000";
							 contextolaudo10.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo10.font = "16pt Arial";
							 contextolaudo10.fillStyle = "#828282";
							 contextolaudo10.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo10.font = "16pt Arial";
							 contextolaudo10.fillStyle = "#828282";
							 contextolaudo10.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo10.font = "16pt Arial";
							 contextolaudo10.fillStyle = "#828282";
							 contextolaudo10.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo10.font = "16pt Arial";
							 contextolaudo10.fillStyle = "#828282";
							 contextolaudo10.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo10.font = "16pt Arial";
							 contextolaudo10.fillStyle = "#828282";
							 contextolaudo10.fillText(email_paciente_laudo, 270, 360);
							//$('#canvasMontaLaudo10').removeClass('hide');
							//DANIEL ALARCON 27/09 
							//$('#canvasMontaLaudo9').removeClass('hide');
							if(conta_visu==66){
								
								foto_laudox = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo11.drawImage(this, 105, 470,430,241); 
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (105, 470, 40, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff";
										  contextolaudo11.fillText('67', 119, 504); 
										  
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (375, 470, 160, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff"; 
										  contextolaudo11.fillText(dente_laudo[66], 391, 504);
										} 	
								});	
								
								contextolaudo11.font = "16pt Arial";
								contextolaudo11.fillStyle = "#000";
								contextolaudo11.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==67){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo11.drawImage(this, 565, 470,430,241);
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (565, 470, 40, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff";
										  contextolaudo11.fillText('68', 579, 503);    
										  
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (835, 470, 160, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff"; 
										  contextolaudo11.fillText(dente_laudo[67], 846, 503);
										} 	
								});	
								
								contextolaudo11.font = "16pt Arial";
								contextolaudo11.fillStyle = "#000";
								contextolaudo11.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==68){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo11.drawImage(this, 105, 745,430,241); 
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (105, 745, 40, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff";
										  contextolaudo11.fillText('69', 119, 780);  
										  
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (375, 745, 160, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff"; 
										  contextolaudo11.fillText(dente_laudo[68], 391, 780);  
										} 	
								});	
								contextolaudo11.font = "16pt Arial";
								contextolaudo11.fillStyle = "#000";
								contextolaudo11.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==69){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo11.drawImage(this, 565, 745,430,241); 
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (565, 745, 40, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff";
										  contextolaudo11.fillText('70', 579, 780); 
										  
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (835, 745, 160, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff"; 
										  contextolaudo11.fillText(dente_laudo[69], 846, 780);  
										} 	
								});	
								contextolaudo11.font = "16pt Arial";
								contextolaudo11.fillStyle = "#000";
								contextolaudo11.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==70){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo11.drawImage(this, 105, 1020,430,241);   
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (105, 1020, 40, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff";
										  contextolaudo11.fillText('71', 119, 1055); 
										  
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (375, 1020, 160, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff"; 
										  contextolaudo11.fillText(dente_laudo[70], 391, 1055);
										} 	
								});	
								contextolaudo11.font = "16pt Arial";
								contextolaudo11.fillStyle = "#000";
								contextolaudo11.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==71){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo11.drawImage(this, 565, 1020,430,241); 
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (565, 1020, 40, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff";
										  contextolaudo11.fillText('72', 579, 1055);
										  
										  contextolaudo11.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo11.fillRect (835, 1020, 160, 56);//background
										  contextolaudo11.font = "16pt Arial";
										  contextolaudo11.fillStyle = "#fff"; 
										  contextolaudo11.fillText(dente_laudo[71], 846, 1055);    
										} 	
								});	
								contextolaudo11.font = "16pt Arial";
								contextolaudo11.fillStyle = "#000";
								contextolaudo11.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo11.font = "Italic 16pt Brush Script ";
							contextolaudo11.fillStyle = "#333";
							contextolaudo11.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo11.drawImage(this, 105, 90,110,110);
									 
								  } 	
							});
							contextolaudo11.font = "20pt Arial";
							contextolaudo11.fillStyle = "#000";
							contextolaudo11.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo11.font = "16pt Arial";
							contextolaudo11.fillStyle = "#828282";
							contextolaudo11.fillText(endereco_laudo, 270, 130);
							
							contextolaudo11.font = "16pt Arial";
							contextolaudo11.fillStyle = "#828282";
							contextolaudo11.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo11.font = "16pt Arial";
							contextolaudo11.fillStyle = "#828282";
							contextolaudo11.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo11.font = "16pt Arial";
							contextolaudo11.fillStyle = "#828282";
							contextolaudo11.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo11.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo11.font = "20pt Arial";
							 contextolaudo11.fillStyle = "#000";
							 contextolaudo11.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo11.font = "16pt Arial";
							 contextolaudo11.fillStyle = "#828282";
							 contextolaudo11.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo11.font = "16pt Arial";
							 contextolaudo11.fillStyle = "#828282";
							 contextolaudo11.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo11.font = "16pt Arial";
							 contextolaudo11.fillStyle = "#828282";
							 contextolaudo11.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo11.font = "16pt Arial";
							 contextolaudo11.fillStyle = "#828282";
							 contextolaudo11.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo11.font = "16pt Arial";
							 contextolaudo11.fillStyle = "#828282";
							 contextolaudo11.fillText(email_paciente_laudo, 270, 360);
							//$('#canvasMontaLaudo10').removeClass('hide');
							//DANIEL ALARCON 27/09 
							//$('#canvasMontaLaudo9').removeClass('hide');
							
							if(conta_visu==72){
								
								foto_laudox = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo12.drawImage(this, 105, 470,430,241); 
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (105, 470, 40, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff";
										  contextolaudo12.fillText('73', 119, 504); 
										  
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (375, 470, 160, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff"; 
										  contextolaudo12.fillText(dente_laudo[72], 391, 504);
										} 	
								});	
								
								contextolaudo12.font = "16pt Arial";
								contextolaudo12.fillStyle = "#000";
								contextolaudo12.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==73){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo12.drawImage(this, 565, 470,430,241);
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (565, 470, 40, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff";
										  contextolaudo12.fillText('74', 579, 503);    
										  
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (835, 470, 160, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff"; 
										  contextolaudo12.fillText(dente_laudo[73], 846, 503);
										} 	
								});	
								
								contextolaudo12.font = "16pt Arial";
								contextolaudo12.fillStyle = "#000";
								contextolaudo12.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==74){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo12.drawImage(this, 105, 745,430,241); 
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (105, 745, 40, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff";
										  contextolaudo12.fillText('75', 119, 780);  
										  
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (375, 745, 160, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff"; 
										  contextolaudo12.fillText(dente_laudo[74], 391, 780);  
										} 	
								});	
								contextolaudo12.font = "16pt Arial";
								contextolaudo12.fillStyle = "#000";
								contextolaudo12.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==75){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo12.drawImage(this, 565, 745,430,241); 
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (565, 745, 40, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff";
										  contextolaudo12.fillText('76', 579, 780); 
										  
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (835, 745, 160, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff"; 
										  contextolaudo12.fillText(dente_laudo[75], 846, 780);  
										} 	
								});	
								contextolaudo12.font = "16pt Arial";
								contextolaudo12.fillStyle = "#000";
								contextolaudo12.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==76){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo12.drawImage(this, 105, 1020,430,241);   
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (105, 1020, 40, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff";
										  contextolaudo12.fillText('77', 119, 1055); 
										  
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (375, 1020, 160, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff"; 
										  contextolaudo12.fillText(dente_laudo[76], 391, 1055);
										} 	
								});	
								contextolaudo12.font = "16pt Arial";
								contextolaudo12.fillStyle = "#000";
								contextolaudo12.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==77){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo12.drawImage(this, 565, 1020,430,241); 
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (565, 1020, 40, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff";
										  contextolaudo12.fillText('78', 579, 1055);
										  
										  contextolaudo12.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo12.fillRect (835, 1020, 160, 56);//background
										  contextolaudo12.font = "16pt Arial";
										  contextolaudo12.fillStyle = "#fff"; 
										  contextolaudo12.fillText(dente_laudo[77], 846, 1055);    
										} 	
								});	
								contextolaudo12.font = "16pt Arial";
								contextolaudo12.fillStyle = "#000";
								contextolaudo12.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo12.font = "Italic 16pt Brush Script ";
							contextolaudo12.fillStyle = "#333";
							contextolaudo12.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo12.drawImage(this, 105, 90,110,110);
									 
								  } 	
							});
							contextolaudo12.font = "20pt Arial";
							contextolaudo12.fillStyle = "#000";
							contextolaudo12.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo12.font = "16pt Arial";
							contextolaudo12.fillStyle = "#828282";
							contextolaudo12.fillText(endereco_laudo, 270, 130);
							
							contextolaudo12.font = "16pt Arial";
							contextolaudo12.fillStyle = "#828282";
							contextolaudo12.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo12.font = "16pt Arial";
							contextolaudo12.fillStyle = "#828282";
							contextolaudo12.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo12.font = "16pt Arial";
							contextolaudo12.fillStyle = "#828282";
							contextolaudo12.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo12.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo12.font = "20pt Arial";
							 contextolaudo12.fillStyle = "#000";
							 contextolaudo12.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo12.font = "16pt Arial";
							 contextolaudo12.fillStyle = "#828282";
							 contextolaudo12.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo12.font = "16pt Arial";
							 contextolaudo12.fillStyle = "#828282";
							 contextolaudo12.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo12.font = "16pt Arial";
							 contextolaudo12.fillStyle = "#828282";
							 contextolaudo12.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo12.font = "16pt Arial";
							 contextolaudo12.fillStyle = "#828282";
							 contextolaudo12.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo12.font = "16pt Arial";
							 contextolaudo12.fillStyle = "#828282";
							 contextolaudo12.fillText(email_paciente_laudo, 270, 360);
							//$('#canvasMontaLaudo10').removeClass('hide');
							//DANIEL ALARCON 27/09 
							//$('#canvasMontaLaudo9').removeClass('hide');
							
							if(conta_visu==78){
								
								foto_laudox = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo13.drawImage(this, 105, 470,430,241); 
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (105, 470, 40, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff";
										  contextolaudo13.fillText('79', 119, 504); 
										  
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (375, 470, 160, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff"; 
										  contextolaudo13.fillText(dente_laudo[78], 391, 504);
										} 	
								});	
								
								contextolaudo13.font = "16pt Arial";
								contextolaudo13.fillStyle = "#000";
								contextolaudo13.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==79){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo13.drawImage(this, 565, 470,430,241);
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (565, 470, 40, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff";
										  contextolaudo13.fillText('80', 579, 503);    
										  
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (835, 470, 160, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff"; 
										  contextolaudo13.fillText(dente_laudo[79], 846, 503);
										} 	
								});	
								
								contextolaudo13.font = "16pt Arial";
								contextolaudo13.fillStyle = "#000";
								contextolaudo13.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==80){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo13.drawImage(this, 105, 745,430,241); 
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (105, 745, 40, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff";
										  contextolaudo13.fillText('81', 119, 780);  
										  
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (375, 745, 160, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff"; 
										  contextolaudo13.fillText(dente_laudo[80], 391, 780);  
										} 	
								});	
								contextolaudo13.font = "16pt Arial";
								contextolaudo13.fillStyle = "#000";
								contextolaudo13.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==81){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo13.drawImage(this, 565, 745,430,241); 
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (565, 745, 40, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff";
										  contextolaudo13.fillText('82', 579, 780); 
										  
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (835, 745, 160, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff"; 
										  contextolaudo13.fillText(dente_laudo[81], 846, 780);  
										} 	
								});	
								contextolaudo13.font = "16pt Arial";
								contextolaudo13.fillStyle = "#000";
								contextolaudo13.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==82){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo13.drawImage(this, 105, 1020,430,241);   
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (105, 1020, 40, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff";
										  contextolaudo13.fillText('83', 119, 1055); 
										  
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (375, 1020, 160, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff"; 
										  contextolaudo13.fillText(dente_laudo[82], 391, 1055);
										} 	
								});	
								contextolaudo13.font = "16pt Arial";
								contextolaudo13.fillStyle = "#000";
								contextolaudo13.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==83){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo13.drawImage(this, 565, 1020,430,241); 
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (565, 1020, 40, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff";
										  contextolaudo13.fillText('84', 579, 1055);
										  
										  contextolaudo13.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo13.fillRect (835, 1020, 160, 56);//background
										  contextolaudo13.font = "16pt Arial";
										  contextolaudo13.fillStyle = "#fff"; 
										  contextolaudo13.fillText(dente_laudo[83], 846, 1055);    
										} 	
								});	
								contextolaudo13.font = "16pt Arial";
								contextolaudo13.fillStyle = "#000";
								contextolaudo13.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo13.font = "Italic 16pt Brush Script ";
							contextolaudo13.fillStyle = "#333";
							contextolaudo13.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo13.drawImage(this, 105, 90,110,110);
									 
								  } 	
							});
							contextolaudo13.font = "20pt Arial";
							contextolaudo13.fillStyle = "#000";
							contextolaudo13.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo13.font = "16pt Arial";
							contextolaudo13.fillStyle = "#828282";
							contextolaudo13.fillText(endereco_laudo, 270, 130);
							
							contextolaudo13.font = "16pt Arial";
							contextolaudo13.fillStyle = "#828282";
							contextolaudo13.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo13.font = "16pt Arial";
							contextolaudo13.fillStyle = "#828282";
							contextolaudo13.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo13.font = "16pt Arial";
							contextolaudo13.fillStyle = "#828282";
							contextolaudo13.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo13.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo13.font = "20pt Arial";
							 contextolaudo13.fillStyle = "#000";
							 contextolaudo13.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo13.font = "16pt Arial";
							 contextolaudo13.fillStyle = "#828282";
							 contextolaudo13.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo13.font = "16pt Arial";
							 contextolaudo13.fillStyle = "#828282";
							 contextolaudo13.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo13.font = "16pt Arial";
							 contextolaudo13.fillStyle = "#828282";
							 contextolaudo13.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo13.font = "16pt Arial";
							 contextolaudo13.fillStyle = "#828282";
							 contextolaudo13.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo13.font = "16pt Arial";
							 contextolaudo13.fillStyle = "#828282";
							 contextolaudo13.fillText(email_paciente_laudo, 270, 360);
							//$('#canvasMontaLaudo10').removeClass('hide');
							//DANIEL ALARCON 27/09 
							//$('#canvasMontaLaudo9').removeClass('hide');
							
							if(conta_visu==84){
								
								foto_laudox = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo14.drawImage(this, 105, 470,430,241); 
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (105, 470, 40, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff";
										  contextolaudo14.fillText('85', 119, 504); 
										  
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (375, 470, 160, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff"; 
										  contextolaudo14.fillText(dente_laudo[84], 391, 504);
										} 	
								});	
								
								contextolaudo14.font = "16pt Arial";
								contextolaudo14.fillStyle = "#000";
								contextolaudo14.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==85){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo14.drawImage(this, 565, 470,430,241);
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (565, 470, 40, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff";
										  contextolaudo14.fillText('86', 579, 503);    
										  
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (835, 470, 160, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff"; 
										  contextolaudo14.fillText(dente_laudo[85], 846, 503);
										} 	
								});	
								
								contextolaudo14.font = "16pt Arial";
								contextolaudo14.fillStyle = "#000";
								contextolaudo14.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==86){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo14.drawImage(this, 105, 745,430,241); 
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (105, 745, 40, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff";
										  contextolaudo14.fillText('87', 119, 780);  
										  
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (375, 745, 160, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff"; 
										  contextolaudo14.fillText(dente_laudo[86], 391, 780);  
										} 	
								});	
								contextolaudo14.font = "16pt Arial";
								contextolaudo14.fillStyle = "#000";
								contextolaudo14.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==87){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo14.drawImage(this, 565, 745,430,241); 
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (565, 745, 40, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff";
										  contextolaudo14.fillText('88', 579, 780); 
										  
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (835, 745, 160, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff"; 
										  contextolaudo14.fillText(dente_laudo[87], 846, 780);  
										} 	
								});	
								contextolaudo14.font = "16pt Arial";
								contextolaudo14.fillStyle = "#000";
								contextolaudo14.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==88){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo14.drawImage(this, 105, 1020,430,241);   
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (105, 1020, 40, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff";
										  contextolaudo14.fillText('89', 119, 1055); 
										  
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (375, 1020, 160, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff"; 
										  contextolaudo14.fillText(dente_laudo[88], 391, 1055);
										} 	
								});	
								contextolaudo14.font = "16pt Arial";
								contextolaudo14.fillStyle = "#000";
								contextolaudo14.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==89){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo14.drawImage(this, 565, 1020,430,241); 
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (565, 1020, 40, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff";
										  contextolaudo14.fillText('90', 579, 1055);
										  
										  contextolaudo14.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo14.fillRect (835, 1020, 160, 56);//background
										  contextolaudo14.font = "16pt Arial";
										  contextolaudo14.fillStyle = "#fff"; 
										  contextolaudo14.fillText(dente_laudo[89], 846, 1055);    
										} 	
								});	
								contextolaudo14.font = "16pt Arial";
								contextolaudo14.fillStyle = "#000";
								contextolaudo14.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo14.font = "Italic 16pt Brush Script ";
							contextolaudo14.fillStyle = "#333";
							contextolaudo14.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo14.drawImage(this, 105, 90,110,110);
									 
								  } 	
							});
							contextolaudo14.font = "20pt Arial";
							contextolaudo14.fillStyle = "#000";
							contextolaudo14.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo14.font = "16pt Arial";
							contextolaudo14.fillStyle = "#828282";
							contextolaudo14.fillText(endereco_laudo, 270, 130);
							
							contextolaudo14.font = "16pt Arial";
							contextolaudo14.fillStyle = "#828282";
							contextolaudo14.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo14.font = "16pt Arial";
							contextolaudo14.fillStyle = "#828282";
							contextolaudo14.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo14.font = "16pt Arial";
							contextolaudo14.fillStyle = "#828282";
							contextolaudo14.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo14.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							 contextolaudo14.font = "20pt Arial";
							 contextolaudo14.fillStyle = "#000";
							 contextolaudo14.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo14.font = "16pt Arial";
							 contextolaudo14.fillStyle = "#828282";
							 contextolaudo14.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo14.font = "16pt Arial";
							 contextolaudo14.fillStyle = "#828282";
							 contextolaudo14.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo14.font = "16pt Arial";
							 contextolaudo14.fillStyle = "#828282";
							 contextolaudo14.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo14.font = "16pt Arial";
							 contextolaudo14.fillStyle = "#828282";
							 contextolaudo14.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo14.font = "16pt Arial";
							 contextolaudo14.fillStyle = "#828282";
							 contextolaudo14.fillText(email_paciente_laudo, 270, 360);
							
							
							//LAUDO 15
							if(conta_visu==90){
								
								foto_laudox = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo15.drawImage(this, 105, 470,430,241); 
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (105, 470, 40, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff";
										  contextolaudo15.fillText('91', 119, 504); 
										  
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (375, 470, 160, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff"; 
										  contextolaudo15.fillText(dente_laudo[90], 391, 504);
										} 	
								});	
								
								contextolaudo15.font = "16pt Arial";
								contextolaudo15.fillStyle = "#000";
								contextolaudo15.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==91){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo15.drawImage(this, 565, 470,430,241);
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (565, 470, 40, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff";
										  contextolaudo15.fillText('92', 579, 503);    
										  
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (835, 470, 160, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff"; 
										  contextolaudo15.fillText(dente_laudo[91], 846, 503);
										} 	
								});	
								
								contextolaudo15.font = "16pt Arial";
								contextolaudo15.fillStyle = "#000";
								contextolaudo15.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==92){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo15.drawImage(this, 105, 745,430,241); 
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (105, 745, 40, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff";
										  contextolaudo15.fillText('93', 119, 780);  
										  
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (375, 745, 160, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff"; 
										  contextolaudo15.fillText(dente_laudo[92], 391, 780);  
										} 	
								});	
								contextolaudo15.font = "16pt Arial";
								contextolaudo15.fillStyle = "#000";
								contextolaudo15.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==93){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo15.drawImage(this, 565, 745,430,241); 
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (565, 745, 40, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff";
										  contextolaudo15.fillText('94', 579, 780); 
										  
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (835, 745, 160, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff"; 
										  contextolaudo15.fillText(dente_laudo[93], 846, 780);  
										} 	
								});	
								contextolaudo15.font = "16pt Arial";
								contextolaudo15.fillStyle = "#000";
								contextolaudo15.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==94){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo15.drawImage(this, 105, 1020,430,241);   
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (105, 1020, 40, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff";
										  contextolaudo15.fillText('95', 119, 1055); 
										  
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (375, 1020, 160, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff"; 
										  contextolaudo15.fillText(dente_laudo[94], 391, 1055);
										} 	
								});	
								contextolaudo15.font = "16pt Arial";
								contextolaudo15.fillStyle = "#000";
								contextolaudo15.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==95){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo15.drawImage(this, 565, 1020,430,241); 
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (565, 1020, 40, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff";
										  contextolaudo15.fillText('96', 579, 1055);
										  
										  contextolaudo15.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo15.fillRect (835, 1020, 160, 56);//background
										  contextolaudo15.font = "16pt Arial";
										  contextolaudo15.fillStyle = "#fff"; 
										  contextolaudo15.fillText(dente_laudo[95], 846, 1055);    
										} 	
								});	
								contextolaudo15.font = "16pt Arial";
								contextolaudo15.fillStyle = "#000";
								contextolaudo15.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo15.font = "Italic 16pt Brush Script ";
							contextolaudo15.fillStyle = "#333";
							contextolaudo15.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo15.drawImage(this, 105, 90,110,110);
									 
								  } 	
							});
							contextolaudo15.font = "20pt Arial";
							contextolaudo15.fillStyle = "#000";
							contextolaudo15.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo15.font = "16pt Arial";
							contextolaudo15.fillStyle = "#828282";
							contextolaudo15.fillText(endereco_laudo, 270, 130);
							
							contextolaudo15.font = "16pt Arial";
							contextolaudo15.fillStyle = "#828282";
							contextolaudo15.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo15.font = "16pt Arial";
							contextolaudo15.fillStyle = "#828282";
							contextolaudo15.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo15.font = "16pt Arial";
							contextolaudo15.fillStyle = "#828282";
							contextolaudo15.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo15.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo15.font = "20pt Arial";
							 contextolaudo15.fillStyle = "#000";
							 contextolaudo15.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo15.font = "16pt Arial";
							 contextolaudo15.fillStyle = "#828282";
							 contextolaudo15.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo15.font = "16pt Arial";
							 contextolaudo15.fillStyle = "#828282";
							 contextolaudo15.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo15.font = "16pt Arial";
							 contextolaudo15.fillStyle = "#828282";
							 contextolaudo15.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo15.font = "16pt Arial";
							 contextolaudo15.fillStyle = "#828282";
							 contextolaudo15.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo15.font = "16pt Arial";
							 contextolaudo15.fillStyle = "#828282";
							 contextolaudo15.fillText(email_paciente_laudo, 270, 360);
							
							if(conta_visu==96){
								
								foto_laudox = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo16.drawImage(this, 105, 470,430,241); 
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (105, 470, 40, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff";
										  contextolaudo16.fillText('97', 119, 504); 
										  
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (375, 470, 160, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff"; 
										  contextolaudo16.fillText(dente_laudo[96], 391, 504);
										} 	
								});	
								
								contextolaudo16.font = "16pt Arial";
								contextolaudo16.fillStyle = "#000";
								contextolaudo16.fillText(foto_descr, 105, 735);
								
								
							}
							if(conta_visu==97){
								foto_laudo_7 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo16.drawImage(this, 565, 470,430,241);
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (565, 470, 40, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff";
										  contextolaudo16.fillText('98', 579, 503);    
										  
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (835, 470, 160, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff"; 
										  contextolaudo16.fillText(dente_laudo[97], 846, 503);
										} 	
								});	
								
								contextolaudo16.font = "16pt Arial";
								contextolaudo16.fillStyle = "#000";
								contextolaudo16.fillText(foto_descr, 565, 735);
							}
							if(conta_visu==98){
								foto_laudo2 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo16.drawImage(this, 105, 745,430,241); 
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (105, 745, 40, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff";
										  contextolaudo16.fillText('99', 119, 780);  
										  
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (375, 745, 160, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff"; 
										  contextolaudo16.fillText(dente_laudo[98], 391, 780);  
										} 	
								});	
								contextolaudo16.font = "16pt Arial";
								contextolaudo16.fillStyle = "#000";
								contextolaudo16.fillText(foto_descr, 105, 1010);
							}
							
							if(conta_visu==99){
								foto_laudo3 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo16.drawImage(this, 565, 745,430,241); 
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (565, 745, 40, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff";
										  contextolaudo16.fillText('100', 579, 780); 
										  
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (835, 745, 160, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff"; 
										  contextolaudo16.fillText(dente_laudo[99], 846, 780);  
										} 	
								});	
								contextolaudo16.font = "16pt Arial";
								contextolaudo16.fillStyle = "#000";
								contextolaudo16.fillText(foto_descr, 565, 1010);
							}
							if(conta_visu==100){
								foto_laudo4 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo16.drawImage(this, 105, 1020,430,241);   
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (105, 1020, 40, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff";
										  contextolaudo16.fillText('101', 119, 1055); 
										  
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (375, 1020, 160, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff"; 
										  contextolaudo16.fillText(dente_laudo[100], 391, 1055);
										} 	
								});	
								contextolaudo16.font = "16pt Arial";
								contextolaudo16.fillStyle = "#000";
								contextolaudo16.fillText(foto_descr, 105, 1285);
							}
							
							if(conta_visu==101){
								foto_laudo5 = $("<img/>", { 
	crossorigin: "anonymous",							src: foto, 
										load: function() { 
										  contextolaudo16.drawImage(this, 565, 1020,430,241); 
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (565, 1020, 40, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff";
										  contextolaudo16.fillText('102', 579, 1055);
										  
										  contextolaudo16.fillStyle = "rgba(0, 0, 0 , 0.4)";//cor do preenchimento
										  contextolaudo16.fillRect (835, 1020, 160, 56);//background
										  contextolaudo16.font = "16pt Arial";
										  contextolaudo16.fillStyle = "#fff"; 
										  contextolaudo16.fillText(dente_laudo[101], 846, 1055);    
										} 	
								});	
								contextolaudo16.font = "16pt Arial";
								contextolaudo16.fillStyle = "#000";
								contextolaudo16.fillText(foto_descr, 565, 1285);
								
								 
							}
							contextolaudo16.font = "Italic 16pt Brush Script ";
							contextolaudo16.fillStyle = "#333";
							contextolaudo16.fillText(slogan_clinica_laudo, 235, 1345);
							
							logo_clinica = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_clinica_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  
									  contextolaudo16.drawImage(this, 105, 90,110,110);
									 
								  } 	
							});
							contextolaudo16.font = "20pt Arial";
							contextolaudo16.fillStyle = "#000";
							contextolaudo16.fillText(nome_clinica_laudo, 270, 105);
							
							contextolaudo16.font = "16pt Arial";
							contextolaudo16.fillStyle = "#828282";
							contextolaudo16.fillText(endereco_laudo, 270, 130);
							
							contextolaudo16.font = "16pt Arial";
							contextolaudo16.fillStyle = "#828282";
							contextolaudo16.fillText(fone_clinica_laudo, 270, 155);
							
							contextolaudo16.font = "16pt Arial";
							contextolaudo16.fillStyle = "#828282";
							contextolaudo16.fillText(email_clinica_laudo, 270, 180);
							
							contextolaudo16.font = "16pt Arial";
							contextolaudo16.fillStyle = "#828282";
							contextolaudo16.fillText(site_clinica_laudo, 270, 205);
							
							
							 foto_paciente = $("<img/>", { 
crossorigin: "anonymous",								  src: foto_paciente_laudo, 
								  width: 80,
								  height :80,
								  
								  
								  load: function() { 
									  contextolaudo16.drawImage(this, 105, 250,110,110);
								  } 	
							});
							
							contextolaudo16.font = "20pt Arial";
							 contextolaudo16.fillStyle = "#000";
							 contextolaudo16.fillText(nome_paciente_laudo, 270, 260);
		
							 contextolaudo16.font = "16pt Arial";
							 contextolaudo16.fillStyle = "#828282";
							 contextolaudo16.fillText(end_paciente_laudo, 270, 285);
		
							 contextolaudo16.font = "16pt Arial";
							 contextolaudo16.fillStyle = "#828282";
							 contextolaudo16.fillText(cep_paciente_laudo,  270, 310);
		
							 contextolaudo16.font = "16pt Arial";
							 contextolaudo16.fillStyle = "#828282";
							 contextolaudo16.fillText(fone_paciente_pac_laudo, 270, 335);
		
							 contextolaudo16.font = "16pt Arial";
							 contextolaudo16.fillStyle = "#828282";
							 contextolaudo16.fillText("/ "+cel_paciente_pac_laudo, 430, 335);
		
							 contextolaudo16.font = "16pt Arial";
							 contextolaudo16.fillStyle = "#828282";
							 contextolaudo16.fillText(email_paciente_laudo, 270, 360);
							
							
							
						}	
								
				
				    
				setTimeout(function(){
							
							var paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ',''); 
							var dentista=$('.dentista_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ',''); 
							var data = new Date();
							 var dia  = data.getDate();
								  if (dia< 10) {
									  dia  = "0" + dia;
								  }
							var mes  = data.getMonth() + 1;
								  if (mes < 10) {
									  mes  = "0" + mes;
								  }
							var ano = data.getFullYear(); 
							var somaPagina=0;  
							//carregando();
							if(imagens_monta_laudo.length<=6){
								totalLaudos=2;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1='';
								 pagina2='';
								 pagina3='';
								 pagina4='';		 
								 pagina5=''; 
								 pagina6='';
								 pagina7='';
								 pagina8=''; 
								 pagina9='';
								 pagina10='';
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 mlConclusao=Laudoconclusao.toDataURL();	
								
								 imagem_laudo1xx= $('<img src="'+pagina0+'" class=" img-responsive"/>').appendTo($('#imprimeLaudo')); 
								 conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'"  class=" img-responsive" crossorigin/></p>').appendTo($('#imprimeLaudo'));
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  //crossOrigin: true,
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								  
								 setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
									
								 },400);
								  
								 
							}
							if(imagens_monta_laudo.length>6 && imagens_monta_laudo.length<=12){	
							totalLaudos=3; 
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2='';
								 pagina3='';
								 pagina4='';		 
								 pagina5=''; 
								 pagina6='';
								 pagina7='';
								 pagina8=''; 
								 pagina9='';
								 pagina10='';
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 mlConclusao=Laudoconclusao.toDataURL();
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 img_l1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudoFile')); 
								 img_l2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudoFile'));
								 img_lpagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudoFile'));
								  setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								    photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
									
								 },400);
							}
							if(imagens_monta_laudo.length>12 && imagens_monta_laudo.length<=18){
								
								totalLaudos=4;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3='';
								 pagina4='';		 
								 pagina5=''; 
								 pagina6='';
								 pagina7='';
								 pagina8=''; 
								 pagina9='';
								 pagina10='';
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 mlConclusao=Laudoconclusao.toDataURL();
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  },
									  success: function(){
										  
									  },error: function(){
										   aviso('tela 3 erro')
									  }
									});
									},400);
								 
								  setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
									
								 },400);
								 
							}
							if(imagens_monta_laudo.length>18 && imagens_monta_laudo.length<=24){
								totalLaudos=5;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL();
								 pagina4='';		 
								 pagina5=''; 
								 pagina6='';
								 pagina7='';
								 pagina8=''; 
								 pagina9='';
								 pagina10='';
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								  mlConclusao=Laudoconclusao.toDataURL();
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3; 
								  conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
							 setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
									
								 },400);
								 
								   
							}
							if(imagens_monta_laudo.length>24 && imagens_monta_laudo.length<=30){	
								 totalLaudos=6;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();
								 pagina5=''; 
								 pagina6='';
								 pagina7='';
								 pagina8=''; 
								 pagina9='';
								 pagina10='';
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 mlConclusao=Laudoconclusao.toDataURL();
								 
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  
								  setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									
								
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
									  
							}
							if(imagens_monta_laudo.length>30 && imagens_monta_laudo.length<=36){
								totalLaudos=7;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL(); 
								 pagina6='';
								 pagina7='';
								 pagina8=''; 
								 pagina9='';
								 pagina10='';
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 mlConclusao=Laudoconclusao.toDataURL();
								 
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  
								  setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
										
							}
							if(imagens_monta_laudo.length>36 && imagens_monta_laudo.length<=42){
								totalLaudos=8;
								pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7='';
								 pagina8=''; 
								 pagina9='';
								 pagina10='';
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 mlConclusao=Laudoconclusao.toDataURL();
								 
								 
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								 conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  
								  setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
										
							}
							if(imagens_monta_laudo.length>42 && imagens_monta_laudo.length<=48){
								 totalLaudos=9;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7=telaLaudo7.toDataURL();
								 pagina8=''; 
								 pagina9='';
								 pagina10='';
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 mlConclusao=Laudoconclusao.toDataURL();
								 
								 
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								  imagem_laudo8xx=$('<p style="page-break-before: always"><img src="'+pagina7+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina7; 
								  
								  conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								    
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
										 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo7 = pagina7;
							  		nome7=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb7.php',
									  data: {
										photo7: photo7,
										nome7:nome7
									  }
									});
								 },400);
										
										  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
										 
							}
							if(imagens_monta_laudo.length>48 && imagens_monta_laudo.length<=54){
								 totalLaudos=10;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7=telaLaudo7.toDataURL();	 
								 pagina8=telaLaudo8.toDataURL();
								 
								 pagina9='';
								 pagina10='';
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 mlConclusao=Laudoconclusao.toDataURL();
								 
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								  imagem_laudo8xx=$('<p style="page-break-before: always"><img src="'+pagina7+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina7; 
								 imagem_laudo9xx=$('<p style="page-break-before: always"><img src="'+pagina8+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina8; 
								 conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
										 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo7 = pagina7;
							  		nome7=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb7.php',
									  data: {
										photo7: photo7,
										nome7:nome7
									  }
									});
								 },400);
										
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo8 = pagina8;
							  		nome8=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb8.php',
									  data: {
										photo8: photo8,
										nome8:nome8
									  }
									});
								 },400);
										
										  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
										
										  
										   
										  
							}
							if(imagens_monta_laudo.length>54 && imagens_monta_laudo.length<=60){
								 totalLaudos=11;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7=telaLaudo7.toDataURL();	 
								 pagina8=telaLaudo8.toDataURL();	 
								 pagina9=telaLaudo9.toDataURL();
								 pagina10='';
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 mlConclusao=Laudoconclusao.toDataURL();
								 
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								  imagem_laudo8xx=$('<p style="page-break-before: always"><img src="'+pagina7+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina7; 
								 imagem_laudo9xx=$('<p style="page-break-before: always"><img src="'+pagina8+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina8; 
								  imagem_laudo10xx=$('<p style="page-break-before: always"><img src="'+pagina9+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina9;
								  
								  conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
										 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo7 = pagina7;
							  		nome7=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb7.php',
									  data: {
										photo7: photo7,
										nome7:nome7
									  }
									});
								 },400);
										
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo8 = pagina8;
							  		nome8=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb8.php',
									  data: {
										photo8: photo8,
										nome8:nome8
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo9 = pagina9;
							  		nome9=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb9.php',
									  data: {
										photo9: photo9,
										nome9:nome9
									  }
									});
								 },400);
										
										  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
											
							}
							
							if(imagens_monta_laudo.length>60 && imagens_monta_laudo.length<=65){
								 totalLaudos=12;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7=telaLaudo7.toDataURL();	 
								 pagina8=telaLaudo8.toDataURL();	 
								 pagina9=telaLaudo9.toDataURL();
								 pagina10=telaLaudo10.toDataURL();
								 mlConclusao=Laudoconclusao.toDataURL();
								 pagina11='';		 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								  imagem_laudo8xx=$('<p style="page-break-before: always"><img src="'+pagina7+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina7; 
								 imagem_laudo9xx=$('<p style="page-break-before: always"><img src="'+pagina8+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina8; 
								  imagem_laudo10xx=$('<p style="page-break-before: always"><img src="'+pagina9+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina9;
								  imagem_laudo11xx=$('<p style="page-break-before: always"><img src="'+pagina10+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  
								   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
										 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo7 = pagina7;
							  		nome7=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb7.php',
									  data: {
										photo7: photo7,
										nome7:nome7
									  }
									});
								 },400);
										
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo8 = pagina8;
							  		nome8=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb8.php',
									  data: {
										photo8: photo8,
										nome8:nome8
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo9 = pagina9;
							  		nome9=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb9.php',
									  data: {
										photo9: photo9,
										nome9:nome9
									  }
									});
								 },400);
										
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo10 = pagina10;
							  		nome10=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb10.php',
									  data: {
										photo10: photo10,
										nome10:nome10
									  }
									});
								 },400);
										
										  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
											 
							}
							
							if(imagens_monta_laudo.length>66 && imagens_monta_laudo.length<=71){
								 totalLaudos=13;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7=telaLaudo7.toDataURL();	 
								 pagina8=telaLaudo8.toDataURL();	 
								 pagina9=telaLaudo9.toDataURL();
								 pagina10=telaLaudo10.toDataURL();
								 pagina11=telaLaudo11.toDataURL();	
								  mlConclusao=Laudoconclusao.toDataURL();	 
								 pagina12=''; 
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								  imagem_laudo8xx=$('<p style="page-break-before: always"><img src="'+pagina7+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina7; 
								 imagem_laudo9xx=$('<p style="page-break-before: always"><img src="'+pagina8+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina8; 
								  imagem_laudo10xx=$('<p style="page-break-before: always"><img src="'+pagina9+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina9;
								  imagem_laudo11xx=$('<p style="page-break-before: always"><img src="'+pagina10+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo12xx=$('<p style="page-break-before: always"><img src="'+pagina11+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  
								  conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								   
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
										 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo7 = pagina7;
							  		nome7=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb7.php',
									  data: {
										photo7: photo7,
										nome7:nome7
									  }
									});
								 },400);
										
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo8 = pagina8;
							  		nome8=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb8.php',
									  data: {
										photo8: photo8,
										nome8:nome8
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo9 = pagina9;
							  		nome9=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb9.php',
									  data: {
										photo9: photo9,
										nome9:nome9
									  }
									});
								 },400);
										
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo10 = pagina10;
							  		nome10=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb10.php',
									  data: {
										photo10: photo10,
										nome10:nome10
									  }
									});
								 },400);
									
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo11 = pagina11;
							  	  nome11=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb11.php',
									  data: {
										photo11: photo11,
										nome11:nome11
									  }
									});
								 },400);
										
										  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
											  
							}
							
							if(imagens_monta_laudo.length>72 && imagens_monta_laudo.length<=77){
								 totalLaudos=14;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7=telaLaudo7.toDataURL();	 
								 pagina8=telaLaudo8.toDataURL();	 
								 pagina9=telaLaudo9.toDataURL();
								 pagina10=telaLaudo10.toDataURL();
								 pagina11=telaLaudo11.toDataURL();		 
								 pagina12=telaLaudo12.toDataURL(); 
								  mlConclusao=Laudoconclusao.toDataURL();
								 pagina13='';
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								  imagem_laudo8xx=$('<p style="page-break-before: always"><img src="'+pagina7+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina7; 
								 imagem_laudo9xx=$('<p style="page-break-before: always"><img src="'+pagina8+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina8; 
								  imagem_laudo10xx=$('<p style="page-break-before: always"><img src="'+pagina9+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina9;
								  imagem_laudo11xx=$('<p style="page-break-before: always"><img src="'+pagina10+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo12xx=$('<p style="page-break-before: always"><img src="'+pagina11+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo13xx=$('<p style="page-break-before: always"><img src="'+pagina12+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								   
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
										 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo7 = pagina7;
							  		nome7=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb7.php',
									  data: {
										photo7: photo7,
										nome7:nome7
									  }
									});
								 },400);
										
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo8 = pagina8;
							  		nome8=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb8.php',
									  data: {
										photo8: photo8,
										nome8:nome8
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo9 = pagina9;
							  		nome9=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb9.php',
									  data: {
										photo9: photo9,
										nome9:nome9
									  }
									});
								 },400);
										
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo10 = pagina10;
							  		nome10=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb10.php',
									  data: {
										photo10: photo10,
										nome10:nome10
									  }
									});
								 },400);
									
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo11 = pagina11;
							  	  nome11=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb11.php',
									  data: {
										photo11: photo11,
										nome11:nome11
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo12 = pagina12;
							  		nome12=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb12.php',
									  data: {
										photo12: photo12,
										nome12:nome12
									  }
									});
								 },400);
										
										  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
												
							}
							
							if(imagens_monta_laudo.length>78 && imagens_monta_laudo.length<=83){
								 totalLaudos=15;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7=telaLaudo7.toDataURL();	 
								 pagina8=telaLaudo8.toDataURL();	 
								 pagina9=telaLaudo9.toDataURL();
								 pagina10=telaLaudo10.toDataURL();
								 pagina11=telaLaudo11.toDataURL();		 
								 pagina12=telaLaudo12.toDataURL(); 
								 pagina13=telaLaudo13.toDataURL();
								 mlConclusao=Laudoconclusao.toDataURL(); 
								 pagina14='';
								 pagina15=''; 
								 pagina16='';
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								  imagem_laudo8xx=$('<p style="page-break-before: always"><img src="'+pagina7+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina7; 
								 imagem_laudo9xx=$('<p style="page-break-before: always"><img src="'+pagina8+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina8; 
								  imagem_laudo10xx=$('<p style="page-break-before: always"><img src="'+pagina9+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina9;
								  imagem_laudo11xx=$('<p style="page-break-before: always"><img src="'+pagina10+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo12xx=$('<p style="page-break-before: always"><img src="'+pagina11+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo13xx=$('<p style="page-break-before: always"><img src="'+pagina12+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo14xx=$('<p style="page-break-before: always"><img src="'+pagina13+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
										 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo7 = pagina7;
							  		nome7=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb7.php',
									  data: {
										photo7: photo7,
										nome7:nome7
									  }
									});
								 },400);
										
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo8 = pagina8;
							  		nome8=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb8.php',
									  data: {
										photo8: photo8,
										nome8:nome8
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo9 = pagina9;
							  		nome9=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb9.php',
									  data: {
										photo9: photo9,
										nome9:nome9
									  }
									});
								 },400);
										
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo10 = pagina10;
							  		nome10=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb10.php',
									  data: {
										photo10: photo10,
										nome10:nome10
									  }
									});
								 },400);
									
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo11 = pagina11;
							  	  nome11=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb11.php',
									  data: {
										photo11: photo11,
										nome11:nome11
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo12 = pagina12;
							  		nome12=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb12.php',
									  data: {
										photo12: photo12,
										nome12:nome12
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo13 = pagina13;
							  		nome13=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb13.php',
									  data: {
										photo13: photo13,
										nome13:nome13
									  }
									});
								 },400);
										
										  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
												
							}
							
							if(imagens_monta_laudo.length>84 && imagens_monta_laudo.length<=89){
								 totalLaudos=16;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7=telaLaudo7.toDataURL();	 
								 pagina8=telaLaudo8.toDataURL();	 
								 pagina9=telaLaudo9.toDataURL();
								 pagina10=telaLaudo10.toDataURL();
								 pagina11=telaLaudo11.toDataURL();		 
								 pagina12=telaLaudo12.toDataURL(); 
								 pagina13=telaLaudo13.toDataURL();
								 pagina14=telaLaudo14.toDataURL();
								 mlConclusao=Laudoconclusao.toDataURL();
								 pagina15=''; 
								 pagina16='';
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								  imagem_laudo8xx=$('<p style="page-break-before: always"><img src="'+pagina7+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina7; 
								 imagem_laudo9xx=$('<p style="page-break-before: always"><img src="'+pagina8+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina8; 
								  imagem_laudo10xx=$('<p style="page-break-before: always"><img src="'+pagina9+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina9;
								  imagem_laudo11xx=$('<p style="page-break-before: always"><img src="'+pagina10+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo12xx=$('<p style="page-break-before: always"><img src="'+pagina11+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo13xx=$('<p style="page-break-before: always"><img src="'+pagina12+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo14xx=$('<p style="page-break-before: always"><img src="'+pagina13+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo15xx=$('<p style="page-break-before: always"><img src="'+pagina14+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								    
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
										 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo7 = pagina7;
							  		nome7=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb7.php',
									  data: {
										photo7: photo7,
										nome7:nome7
									  }
									});
								 },400);
										
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo8 = pagina8;
							  		nome8=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb8.php',
									  data: {
										photo8: photo8,
										nome8:nome8
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo9 = pagina9;
							  		nome9=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb9.php',
									  data: {
										photo9: photo9,
										nome9:nome9
									  }
									});
								 },400);
										
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo10 = pagina10;
							  		nome10=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb10.php',
									  data: {
										photo10: photo10,
										nome10:nome10
									  }
									});
								 },400);
									
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo11 = pagina11;
							  	  nome11=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb11.php',
									  data: {
										photo11: photo11,
										nome11:nome11
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo12 = pagina12;
							  		nome12=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb12.php',
									  data: {
										photo12: photo12,
										nome12:nome12
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo13 = pagina13;
							  		nome13=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb13.php',
									  data: {
										photo13: photo13,
										nome13:nome13
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo14 = pagina14;
							  		nome14=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb14.php',
									  data: {
										photo14: photo14,
										nome14:nome14
									  }
									});
								 },400);
										
										  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
												
							}
							
							if(imagens_monta_laudo.length>90 && imagens_monta_laudo.length<=95){
								 totalLaudos=17;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7=telaLaudo7.toDataURL();	 
								 pagina8=telaLaudo8.toDataURL();	 
								 pagina9=telaLaudo9.toDataURL();
								 pagina10=telaLaudo10.toDataURL();
								 pagina11=telaLaudo11.toDataURL();		 
								 pagina12=telaLaudo12.toDataURL(); 
								 pagina13=telaLaudo13.toDataURL();
								 pagina14=telaLaudo14.toDataURL();
								 pagina15=telaLaudo15.toDataURL();
								 mlConclusao=Laudoconclusao.toDataURL();
								 pagina16='';
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								  imagem_laudo8xx=$('<p style="page-break-before: always"><img src="'+pagina7+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina7; 
								 imagem_laudo9xx=$('<p style="page-break-before: always"><img src="'+pagina8+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina8; 
								  imagem_laudo10xx=$('<p style="page-break-before: always"><img src="'+pagina9+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina9;
								  imagem_laudo11xx=$('<p style="page-break-before: always"><img src="'+pagina10+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo12xx=$('<p style="page-break-before: always"><img src="'+pagina11+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo13xx=$('<p style="page-break-before: always"><img src="'+pagina12+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo14xx=$('<p style="page-break-before: always"><img src="'+pagina13+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo15xx=$('<p style="page-break-before: always"><img src="'+pagina14+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo16xx=$('<p style="page-break-before: always"><img src="'+pagina15+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								    
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
										 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo7 = pagina7;
							  		nome7=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb7.php',
									  data: {
										photo7: photo7,
										nome7:nome7
									  }
									});
								 },400);
										
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo8 = pagina8;
							  		nome8=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb8.php',
									  data: {
										photo8: photo8,
										nome8:nome8
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo9 = pagina9;
							  		nome9=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb9.php',
									  data: {
										photo9: photo9,
										nome9:nome9
									  }
									});
								 },400);
										
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo10 = pagina10;
							  		nome10=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb10.php',
									  data: {
										photo10: photo10,
										nome10:nome10
									  }
									});
								 },400);
									
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo11 = pagina11;
							  	  nome11=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb11.php',
									  data: {
										photo11: photo11,
										nome11:nome11
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo12 = pagina12;
							  		nome12=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb12.php',
									  data: {
										photo12: photo12,
										nome12:nome12
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo13 = pagina13;
							  		nome13=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb13.php',
									  data: {
										photo13: photo13,
										nome13:nome13
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo14 = pagina14;
							  		nome14=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb14.php',
									  data: {
										photo14: photo14,
										nome14:nome14
									  }
									});
								 },400);
										
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo15 = pagina15;
							  		nome15=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb15.php',
									  data: {
										photo15: photo15,
										nome15:nome15
									  }
									});
								 },400);
										
										  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
												
							}
							
							if(imagens_monta_laudo.length>96 && imagens_monta_laudo.length<=101){
								 totalLaudos=18;
								 pagina0=telaLaudo0.toDataURL();
								 pagina1=telaLaudo1.toDataURL();
								 pagina2=telaLaudo2.toDataURL();
								 pagina3=telaLaudo3.toDataURL(); 
								 pagina4=telaLaudo4.toDataURL();		 
								 pagina5=telaLaudo5.toDataURL();	 
								 pagina6=telaLaudo6.toDataURL();
								 pagina7=telaLaudo7.toDataURL();	 
								 pagina8=telaLaudo8.toDataURL();	 
								 pagina9=telaLaudo9.toDataURL();
								 pagina10=telaLaudo10.toDataURL();
								 pagina11=telaLaudo11.toDataURL();		 
								 pagina12=telaLaudo12.toDataURL(); 
								 pagina13=telaLaudo13.toDataURL();
								 pagina14=telaLaudo14.toDataURL();
								 pagina15=telaLaudo15.toDataURL();
								 pagina16=telaLaudo16.toDataURL();
								 mlConclusao=Laudoconclusao.toDataURL();
								 imagem_laudo1xx= $('<p style="page-break-before: always"><img src="'+pagina0+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo')); 
								 imagem_laudo2xx=$('<p style="page-break-before: always"><img src="'+pagina1+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 imagem_laudo3xx=$('<p style="page-break-before: always"><img src="'+pagina2+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));

								  imagem_laudo4xx=$('<p style="page-break-before: always"><img src="'+pagina3+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina3;
								 imagem_laudo5xx=$('<p style="page-break-before: always"><img src="'+pagina4+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina4;
								 imagem_laudo6xx=$('<p style="page-break-before: always"><img src="'+pagina5+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina5;
								 imagem_laudo7xx=$('<p style="page-break-before: always"><img src="'+pagina6+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina6; 
								  imagem_laudo8xx=$('<p style="page-break-before: always"><img src="'+pagina7+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina7; 
								 imagem_laudo9xx=$('<p style="page-break-before: always"><img src="'+pagina8+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina8; 
								  imagem_laudo10xx=$('<p style="page-break-before: always"><img src="'+pagina9+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina9;
								  imagem_laudo11xx=$('<p style="page-break-before: always"><img src="'+pagina10+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo12xx=$('<p style="page-break-before: always"><img src="'+pagina11+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo13xx=$('<p style="page-break-before: always"><img src="'+pagina12+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo14xx=$('<p style="page-break-before: always"><img src="'+pagina13+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo15xx=$('<p style="page-break-before: always"><img src="'+pagina14+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo16xx=$('<p style="page-break-before: always"><img src="'+pagina15+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  imagem_laudo17xx=$('<p style="page-break-before: always"><img src="'+pagina16+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));//pagina10;
								  conlusao_laudopagxx=$('<p style="page-break-before: always"><img src="'+mlConclusao+'" class=" img-responsive"/></p>').appendTo($('#imprimeLaudo'));
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo0 = pagina0;
							  		nome0=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb0.php',
									  data: {
										photo0: photo0,
										nome0: nome0
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								   gravaFotoUrl(total_paginas,somaPagina);
								   photo1 = pagina1;
							  		nome1=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb1.php',
									  data: {
										photo1: photo1,
										nome1: nome1
									  }
									});
								 },400);
								  setTimeout(function(){  somaPagina+=1;
gravaFotoUrl(total_paginas,somaPagina);								    photo2 = pagina2;
							  		nome2=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb2.php',
									  data: {
										photo2: photo2,
										nome2: nome2
									  }
									});
									},400);
								  
								   setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo3 = pagina3;
							  		nome3=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb3.php',
									  data: {
										photo3: photo3,
										nome3: nome3
									  }
									});
								 },400);
								 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo4 = pagina4;
							  		nome4=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb4.php',
									  data: {
										photo4: photo4,
										nome4:nome4
									  }
									});
								 },400);
									 
									   
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo5 = pagina5;
							  		nome5=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb5.php',
									  data: {
										photo5: photo5,
										nome5:nome5
									  }
									});
								 },400);
									  
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo6 = pagina6;
							  		nome6=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb6.php',
									  data: {
										photo6: photo6,
										nome6:nome6
									  }
									});
								 },400);
										
										 
								setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo7 = pagina7;
							  		nome7=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb7.php',
									  data: {
										photo7: photo7,
										nome7:nome7
									  }
									});
								 },400);
										
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo8 = pagina8;
							  		nome8=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb8.php',
									  data: {
										photo8: photo8,
										nome8:nome8
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo9 = pagina9;
							  		nome9=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb9.php',
									  data: {
										photo9: photo9,
										nome9:nome9
									  }
									});
								 },400);
										
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo10 = pagina10;
							  		nome10=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb10.php',
									  data: {
										photo10: photo10,
										nome10:nome10
									  }
									});
								 },400);
									
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo11 = pagina11;
							  	  nome11=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb11.php',
									  data: {
										photo11: photo11,
										nome11:nome11
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo12 = pagina12;
							  		nome12=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb12.php',
									  data: {
										photo12: photo12,
										nome12:nome12
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo13 = pagina13;
							  		nome13=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb13.php',
									  data: {
										photo13: photo13,
										nome13:nome13
									  }
									});
								 },400);
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo14 = pagina14;
							  		nome14=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb14.php',
									  data: {
										photo14: photo14,
										nome14:nome14
									  }
									});
								 },400);
										
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo15 = pagina15;
							  		nome15=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb15.php',
									  data: {
										photo15: photo15,
										nome15:nome15
									  }
									});
								 },400);
								 
								 setTimeout(function(){  somaPagina+=1;
								  gravaFotoUrl(total_paginas,somaPagina);
								  photo16 = pagina16;
							  		nome16=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWeb16.php',
									  data: {
										photo16: photo16,
										nome16:nome16
									  }
									});
								 },400);
										
										  
								setTimeout(function(){  somaPagina+=1;
								    gravaFotoUrl(total_paginas,somaPagina);
									conclusao = mlConclusao;
							  		tela=paciente+dentista+dia+'_'+ somaPagina;
									$.ajax({
									  method: 'POST',
									  url: servidor+'uploadLaudoWebConclusao.php',
									  data: {
										conclusao: conclusao,
										tela: tela
									  },
									  
									  complete: function() {  
											$('#divAvisoEspecial').remove();
											aviso('Laudo enviado ao servidor');
											
											console.log("LAUDO NO SERVIDOR."); 
										},
										progress: function(evt) {
											if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										},
										progressUpload: function(evt) {
										  if (evt.lengthComputable) {
												var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
												$('#barraAtualiza').css('width', percentual+'%');
												$('#txtperc').html(percentual+'%');
											}
											else {
												$('#barraAtualiza').css('width', '0%');
												$('#txtperc').html('0%');
											}
										}
									});
								 },400);
													
							}
								 
							
								 
								
						},700);
							 
				},600);
				
				$('#canvasMontaLaudoConclusao').addClass('hide');
				$("input[name='laudoExames[]']:checked").removeAttr('checked');
				$('#outrosExames').val('');
				$('#checkupControle').val('');
				$('#conclusaoLaudo').val('');
				$('#examesBotoes').children().removeClass('active btn-success').addClass('btn-default');
				
				
				
				
				
				
}

var Laudoseq;

function gravaFotoUrl(total_paginas, somaPagina){
	   
	
	
	var paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ',''); 
	var dentista=$('.dentista_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');  
	var data = new Date();
	 var dia  = data.getDate();
		  if (dia< 10) {
			  dia  = "0" + dia;
		  }
	var mes  = data.getMonth() + 1;
		  if (mes < 10) {
			  mes  = "0" + mes;
		  }
	var ano = data.getFullYear();	
	
	var data_laudo=dia+'-'+mes+'-'+ano;
	
	
	
		folderpath = "file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/Laudos/Laudo-"+data_laudo+"/";
		
		 filename = "paginaLaudo_web_"+somaPagina+".png";
		
		CodigoSky=$('#CodigoSky').val();
		xcdgo=$('#Codigo_Laudo_N').html();
	 cod_token_laudo=$('#Codigo_Laudo_N').html();	
	 data_laudo=dia+'-'+mes+'-'+ano;	  
	 quant_imagens=total_paginas;
	 codigo_laudo=paciente+dentista+xcdgo;
	 
	 imagem_laudo=servidor+'laudo/'+paciente+dentista+dia+'_'+ somaPagina+".png";
	 nome_paciente=$('.paciente_nome').html();
	 imagem_laudo_offline=folderpath+filename;
				

		               
			
		dataString='data_laudo='+data_laudo+'&quant_imagens='+quant_imagens+'&codigo_laudo='+codigo_laudo+'&nome_paciente='+nome_paciente+'&imagem_laudo='+imagem_laudo+'&imagem_laudo_offline='+imagem_laudo_offline+'&CodigoSky='+CodigoSky;
		
		$.ajax({
			url: servidor+"SalvaLaudo.php",
			type: "GET",
			data: dataString,
			success: function(data){
				$("#btnImprimir").removeClass("disabled");
				$('#textoCorrente').html('<b>'+somaPagina+'  no servidor</b>');
				
				if(somaPagina==totalLaudos){
					$('#divAvisoEspecial').remove();
					aviso('Laudo salvo!');
				}
			},
			error:function(){
				salvaErro("SalvaLaudo.php");
			}
		});
			
						
	
		
}
	



function onConfirmA(){
	
	 sobeTudo()
	
}
function onConfirm() {
						
}


var totalImagens;



////PACIENTE

function fadicionarPaciente(){
	troca_foto('MASC');
	$('#fotoPaciente').attr('src','img/pac1.png');
	$('.buying-selling.pacientehomem').addClass('active');
	$('.buying-selling.pacientemulher').removeClass('active');
	tela=paginaAtual[9];
	$('#pageInicio').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="salvar_novo_paciente()"><i class="fa fa-2x fa-save text-left pull-left ic_rodape"></i><span style="font-size:20px">Salvar</span></a>';
	
	$('.botaoEsquerdoInicio').removeClass('esquerda');
	$('.botaoDireitoInicio').removeClass('esquerda');
	$('#modalBuscaPaciente').addClass('hide');
	$('#botoesListaPacientes').addClass('hide');
	$('#botoesRodape').html(botoes);
	$('#ZonaFooter').removeClass('hide');
	$('#modalPacientes').removeClass('hide');
	
	
}

function lerPacientesServidor(){
	
	nome_clinica=$('#nome_clinica').val();
	dataString='nome_clinica='+nome_clinica;
	atualizacao();
		$.ajax({
			url: servidor+"lerPacientes.php",
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
					if(data.retorno!="null"){
					total='';
					andamento='';
					
					
						for (conta = 0; conta < data.retorno.length; conta++){
							var total=data.retorno.length;
							var andamento=[conta];
							var perc = Math.floor(  andamento  / total * 100);
							 
							$('#barraAtualiza').css('width', perc+'%');
							$('#txtperc').html(perc+'% dos pacientes baixados')
							
							id=data.retorno[conta].IdPaciente;
							nome_paciente=data.retorno[conta].Nome_paciente;
							fone_paciente=data.retorno[conta].Fone_paciente;
							celular_paciente=data.retorno[conta].Celular_paciente;
							idade_paciente=data.retorno[conta].Idade_paciente;
							cpf_paciente=data.retorno[conta].Cpf_paciente
							rg_paciente=data.retorno[conta].Rg_paciente
							endereco_paciente=data.retorno[conta].Endereco_paciente;
							cep_paciente=data.retorno[conta].Cep_paciente
							email_paciente=data.retorno[conta].Email_paciente
							sexo_paciente=data.retorno[conta].Sexo_paciente;
							imagem_paciente=servidor+'pacientes/'+data.retorno[conta].Nome_paciente+'.jpg';	
							
							nuvemBancoPacientes(nome_paciente, fone_paciente, celular_paciente, idade_paciente, cpf_paciente, rg_paciente, endereco_paciente, cep_paciente, email_paciente, sexo_paciente, imagem_paciente);
							
							if(perc>55){
								$('#divAlerta.avisoSky').remove();
							}
						}
						
						
					}else{
						//alert('Erro show :(');
					}	
			},
			error:function(){
				salvaErro("lerPacientes.php");
			}
		 });//Termina Ajax
	

}

function nuvemBancoPacientes(nome_paciente, fone_paciente, celular_paciente, idade_paciente, cpf_paciente, rg_paciente, endereco_paciente, cep_paciente, email_paciente, sexo_paciente, imagem_paciente){
	
	db.transaction(function(transaction) {
		var executeQuery = "INSERT INTO tabela_Pacientes (Nome_paciente, Fone_paciente, Celular_paciente, Idade_paciente, Cpf_paciente, Rg_paciente, Endereco_paciente, Cep_paciente, Email_paciente, Sexo_paciente, Imagem_paciente) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
		
			transaction.executeSql(executeQuery, 
			[nome_paciente, fone_paciente, celular_paciente, idade_paciente, cpf_paciente, rg_paciente, endereco_paciente, cep_paciente, email_paciente, sexo_paciente, imagem_paciente]
			, function(tx, result) {
				//aviso('Paciente adicionado à lista da clínica');	
			},
			function(error){
				alert('Fudeu' +error);
			});
	});
}

function salvar_novo_paciente(){
	 npac=$('#lista_paciente').children('li').length;
	 idpaciente=npac+=1;
	 nome_paciente=$('#nome_paciente').val();
	 paciente=$('#nome_paciente').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');
	 fone_paciente=$('#fone_paciente').val();//.replace("(","").replace(")","").replace("-","");
	 celular_paciente=$('#celular_paciente').val();
	 nasc_paciente=$('#nasc_paciente').val();//.replace("/","").replace("/","");
	 idade_paciente=$('#idadedoPaciente').val();
	 cpf_paciente=$('#cpf_paciente').val();//.replace(".","").replace(".","").replace(".","").replace("-","");
	 rg_paciente=$('#rg_paciente').val();
	 endereco_paciente=$('#endereco_paciente').val();
	 cep_paciente=$('#cep_paciente').val();//.replace("-","");
	 email_paciente=$('#email_paciente').val();
	  sexo_paciente=$('#sexo_paciente_foto').html();
	 imagem_paciente=$('#caminhoFotoPaciente').html(); 
	 
	 if(imagem_paciente=='' && sexo_paciente=='masc'){
		 imagem_paciente='http://skycamapp.net/www/img/pac1.png';
	 }
	 
	if(imagem_paciente=='' && sexo_paciente=='fem'){
		 imagem_paciente='http://skycamapp.net/www/img/pac2.png';
	 } 

	 imagem_paciente_offline=$('#caminhoFotoPacienteOffline').html();
	 if(imagem_paciente_offline==''){
	 	imagem_paciente_offline="file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/"+paciente+dia+mes+ano+"_criado_na_web.jpg";
	 }
	 nome_clinica=$('#nome_clinica').val();
	 CodigoSky=$('#CodigoSky').val();
	 codigo_clinica_paciente=$('#codigo_clinica_paciente').val();
	
	if(nome_paciente==''){
		aviso('O nome do paciente é obrigatório');
		$('#nome_paciente').focus();
		return true;
	}
	if(fone_paciente==''){
		aviso('O telefone é obrigatório');
		$('#fone_paciente').focus();
		return true;
	}
	if(nasc_paciente==''){
		aviso('A data de nascimento é obrigatório');
		$('#nasc_paciente').focus();
		return true;
	}
	if(email_paciente==''){
		aviso('O email é obrigatório');
		$('#email_paciente').focus();
		return true;
	}
	
		dataString='nome_paciente='+nome_paciente+'&fone_paciente='+fone_paciente+'&celular_paciente='+celular_paciente+'&idade_paciente='+idade_paciente+'&nasc_paciente='+nasc_paciente+'&cpf_paciente='+cpf_paciente+'&rg_paciente='+rg_paciente+'&endereco_paciente='+endereco_paciente+'&cep_paciente='+cep_paciente+'&email_paciente='+email_paciente+'&sexo_paciente='+sexo_paciente+'&nome_clinica='+nome_clinica+'&imagem_paciente='+imagem_paciente+'&imagem_paciente_offline='+imagem_paciente_offline+'&CodigoSky='+CodigoSky+'&codigo_clinica_paciente='+codigo_clinica_paciente;
		
		
		$.ajax({
			url: servidor+"salvaPacientesWEB.php",
			type: "GET",
            data: dataString,
            success: function(data){
				aviso('Paciente Salvo...');
				$('#nome_paciente').val('');
				 $('#fone_paciente').val('');//.replace("(","").replace(")","").replace("-","");
				 $('#celular_paciente').val('');
				 $('#nasc_paciente').val('');//.replace("/","").replace("/","");
				 $('#idadedoPaciente').val('');
				 $('#cpf_paciente').val('');//.replace(".","").replace(".","").replace(".","").replace("-","");
				 $('#rg_paciente').val('');
				 $('#endereco_paciente').val('');
				 $('#cep_paciente').val('');//.replace("-","");
				 $('#email_paciente').val('');
				 $('#sexo_paciente_foto').html('');
				 $('#caminhoFotoPaciente').html(''); 
				 $('#codigo_clinica_paciente').val(''); 
			},error:function(){
				salvaErro("salvaPacientesWeb.php");
			}
		 });//Termina Ajax
		 
	
	


}
function montaListaDePacientesMenu(){
	
	db.transaction(function(transaction) {
		transaction.executeSql('SELECT * FROM tabela_Pacientes', [], function (tx, results) {
			var len = results.rows.length, i;
			if(len==0){
				$('#lista_paciente').html('');
				//aviso("Você não possui Pacientes cadastrados");
				xxxx='<li id="pacienteVazio" class="list-group-item musica raio0">';
				xxxx+='<h4 class="nome text-muted">Nenhum paciente cadastrado</h4>';
				xxxx+='</li>';
				$('#lista_paciente').append(xxxx);
				$("#rowDent").append(len);
				
		
			}else{
				$('#pacienteVazio').remove();
				$('#lista_paciente').html('');
				$("#rowCount").append(len);
				for (i = 0; i < len; i++){
						new_paciente='<li id="'+results.rows.item(i).id+'" class="list-group-item li_paciente">';
						new_paciente+='	<div class="col-xs-2 text-left">';
						new_paciente+='		<img src="'+results.rows.item(i).Imagem_paciente+'" width="40"  height="40" class=" img-circle" />';
						new_paciente+='	</div>';
						new_paciente+='	<div class="col-xs-10 yyy">';
						new_paciente+='		<h4 class="nome text-muted">'+results.rows.item(i).Nome_paciente+'</h4>';
						new_paciente+='		<span class="email_paciente hide">'+results.rows.item(i).Email_paciente+'</span><span class="fone_paciente hide">'+results.rows.item(i).Fone_paciente+'</span><span class="celular_paciente hide">'+results.rows.item(i).Celular_paciente+'</span><span class="idadePaciente hide">'+results.rows.item(i).Idade_paciente+'</span> <span class="rg_paciente hide">'+results.rows.item(i).Rg_paciente+'</span><span class="cpf_paciente hide">'+results.rows.item(i).Cpf_paciente+'</span><span class="endereco_paciente hide">'+results.rows.item(i).Endereco_paciente+'</span><span class="cep_paciente hide">'+results.rows.item(i).Cep_paciente+'</span>';
						new_paciente+='	</div>';
						new_paciente+='	<div class="clearfix"></div>';
						new_paciente+='</li>';
						$("#lista_paciente").append(new_paciente);
						$('#idPaciente').html(results.rows.item(i).id);
						$("#email_do_paciente").val(results.rows.item(i).Email_paciente);
				}
			}
			 
			
		}, null);
	});
   
}


$('#lista_paciente-search').keyup(function () {
    var value = this.value;
    $('#lista_paciente li.li_paciente').each(function () {
        if ($(this).text().search(value) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});
$('#lista_dentista-search').keyup(function () {
    var value = this.value;
    $('#lista_dentista li.dentista').each(function () {
        if ($(this).text().search(value) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});
$('#busca_enfermidade').keyup(function () {
    var value = this.value;
    $('#enfermidadeLaudo a.doencaLaudo').each(function () {
        if ($(this).text().search(value) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});
function nada2(){
	$('#nasc_paciente').val('').focus();
	$('#idadedoPaciente').val('').addClass('hide');
	$('#divIdade').removeClass('hide');
	}
function monta_idade(){
	  var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear(); 
	 nasc_paciente=$('#nasc_paciente').val();//.replace("/","").replace("/","");
	 dia_aniversario=nasc_paciente.substr(0,2);
	 mes_aniversario=nasc_paciente.substr(3,2);
	 ano_aniversario=nasc_paciente.substr(6,4);
	idade(ano_aniversario, mes_aniversario, dia_aniversario); 
	if(dia_aniversario==0 || dia_aniversario>31){
			nada2();
			aviso('Dia inexistente');
			return true;	
		}else if(mes_aniversario==0 || mes_aniversario>12){
			nada2();
			aviso('Mês inexistente');
			return true;
			
		}else if(ano_aniversario==0 || ano_aniversario==ano || ano_aniversario>ano){
			nada2();
			aviso('Data inexistente');
			return true;
		}
	$('#idadedoPaciente').val(idade(ano_aniversario, mes_aniversario, dia_aniversario)).removeClass('hide');
	$('#divIdade').removeClass('hide');
	//alert(idade(ano_aniversario, mes_aniversario, dia_aniversario));
}


function idade(ano_aniversario, mes_aniversario, dia_aniversario) {

	
    var d = new Date,
        ano_atual = d.getFullYear(),
        mes_atual = d.getMonth() + 1,
        dia_atual = d.getDate(),

        ano_aniversario = +ano_aniversario,
        mes_aniversario = +mes_aniversario,
        dia_aniversario = +dia_aniversario,

        quantos_anos = ano_atual - ano_aniversario;

    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
        quantos_anos--;
    }

    return quantos_anos < 0 ? 0 : quantos_anos;
	
}


function fexcluirPaciente(){
	
	
	id=$('#idPaciente').html();
	
	dataString='id='+id;
		
	
		$.ajax({
			url: servidor+"deletaPacientes.php",
			type: "GET",
            data: dataString,
            success: function(data){
				aviso('Paciente excluído');
				fpageInicio();	
			},error:function(){
				salvaErro("excluiPacientesWeb.php");
			}
		 });//Termina Ajax
	 

   
}




function fbuscarPaciente(){
	$('#listaCheckupHistorico').html('');
	$('#paginaMontaLaudosDiv').html('');
	//$('#imprimeLaudo').html('');
	
	esconde_pag();
	
	dentista_nome=$('.dentista_nome').html();
	
	if(dentista_nome==""){
		aviso('É necessário selecionar um profissional');
		return true;
	}
	if(Offline==true){
		montaListaDePacientesMenu();
	}else{
		lerPacientes()
	}
	$('.botaoEsquerdoInicio').toggleClass('esquerda');
	$('.botaoDireitoInicio').toggleClass('esquerda');
	$('#modalBuscaPaciente').toggleClass('hide');
	$('#botoesListaPacientes').toggleClass('hide');	
		
}

function fecharBuscaPaciente(){
	$('#modalBuscaPaciente').addClass('hide');
	$('#botoesListaPacientes').addClass('hide');
}


function nada1(){
	$('#nasc_paciente_pac').val('').focus();
}

function feditarPaciente(){
	//$('#popoverEndereco').popover('show');
	$('.form-control.input-lg.input-paciente').toggleClass('leitura');
	$('#end_paciente_pac').focus();
	$('#salvarAlteracoesPac').toggleClass('hide');
	$('#dadosPessoaisPaciente').toggleClass('subido');
}
function montaIdade2(){
	  var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear(); 
	 nasc_paciente=$('#nasc_paciente_pac').val();//.replace("/","").replace("/","");
	 dia_aniversario=nasc_paciente.substr(0,2);
	 mes_aniversario=nasc_paciente.substr(3,2);
	 ano_aniversario=nasc_paciente.substr(6,4);
	idade2(ano_aniversario, mes_aniversario, dia_aniversario);
	if(dia_aniversario==0 || dia_aniversario>31){
			nada1();
			aviso('Dia inexistente');
			return true;	
		}else if(mes_aniversario==0 || mes_aniversario>12){
			nada1();
			aviso('Mês inexistente');
			return true;
			
		}else if(ano_aniversario==0 || ano_aniversario==ano || ano_aniversario>ano){
			nada1();
			aviso('Data inexistente');
			return true;
		}
	
	$('#idadePaciente').html(idade(ano_aniversario, mes_aniversario, dia_aniversario));
}

function idade2(ano_aniversario, mes_aniversario, dia_aniversario) {

	
    var d = new Date,
        ano_atual = d.getFullYear(),
        mes_atual = d.getMonth() + 1,
        dia_atual = d.getDate(),

        ano_aniversario = +ano_aniversario,
        mes_aniversario = +mes_aniversario,
        dia_aniversario = +dia_aniversario,

        quantos_anos = ano_atual - ano_aniversario;

    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
        quantos_anos--;
    }

    return quantos_anos < 0 ? 0 : quantos_anos;
	
}
function salvarAlteracoesPaciente(){
	
	nome_paciente=$('#modal_nome_paciente').html();
	nasc_paciente=$('#nasc_paciente_pac').val();
	endereco_paciente=$('#end_paciente_pac').val();
	cep_paciente=$('#cep_paciente_pac').val();
	cpf_paciente=$('#cpf_paciente_pac').val();
	idade_paciente=$('#idadePaciente').html();
	rg_paciente=$('#rg_paciente_pac').val();
	fone_paciente=$('#fone_paciente_pac').val();
	celular_paciente=$('#cel_paciente_pac').val();
	email_paciente=$('#email_paciente_pac').val();
	sexo_paciente=$('#sexo_paciente_foto').html();
	imagem_paciente=$('#modal_img_paciente').attr('src');
	id=$('#idPaciente').html();
	
	dataString='id='+id+'&nome_paciente='+nome_paciente+'&fone_paciente='+fone_paciente+'&celular_paciente='+celular_paciente+'&idade_paciente='+idade_paciente+'&nasc_paciente='+nasc_paciente+'&cpf_paciente='+cpf_paciente+'&rg_paciente='+rg_paciente+'&endereco_paciente='+endereco_paciente+'&cep_paciente='+cep_paciente+'&email_paciente='+email_paciente;
		
		
		$.ajax({
			url: servidor+"alteraPacientesWEB.php",
			type: "GET",
            data: dataString,
			dataType:"JSON",
            success: function(data){
				
					$('#txtMsgAlteracao').html(data.retorno+ ' foi atualizado!<br> Seu SkyBrain será notificado sobre a mudança');
					$('#modalAlteracao').modal('show');
				 
					$('#resposta').html('');
					$('#nasc_paciente_pac').popover('destroy');
					$('#end_paciente_pac').popover('destroy');
					$('#cep_paciente_pac').popover('destroy');    
					$('#cpf_paciente_pac').popover('destroy');     
					$('#rg_paciente_pac').popover('destroy');   
					$('#fone_paciente_pac').popover('destroy');   
					$('#cel_paciente_pac').popover('destroy');  
					$('#email_paciente_pac').popover('destroy');
					$('.form-control.input-lg.input-paciente').toggleClass('leitura');
					$('#salvarAlteracoesPac').addClass('hide');
					$('#dadosPessoaisPaciente').removeClass('subido');
				
				
			},error:function(){
				salvaErro("editaPacientesWeb.php");
			}
		 });//Termina Ajax
	/*
	db.transaction(function(transaction) {
	 var executeQuery = " UPDATE tabela_Pacientes SET Nome_paciente=?, Fone_paciente=?, Celular_paciente=?, Idade_paciente=?, Cpf_paciente=?, Rg_paciente=?, Endereco_paciente=?, Cep_paciente=?, Email_paciente=? , Sexo_paciente=?, Imagem_paciente=?  WHERE id=?";
	 transaction.executeSql(executeQuery, [ nome_paciente, fone_paciente, celular_paciente, idade_paciente, cpf_paciente, rg_paciente, endereco_paciente, cep_paciente, email_paciente, sexo_paciente, imagem_paciente, id],
	 //Successo
	 function(tx, result) {
		
		 $('#resposta').html('Alterações salvas!');
	  },
	 //Erro
	 function(error){aviso('F...');});
	 });

	
	setTimeout(function(){
		$('#resposta').html('');
		$('.form-control.input-lg.input-paciente').toggleClass('leitura');
	    $('#salvarAlteracoesPac').toggleClass('hide');
		$('#dadosPessoaisPaciente').removeClass('subido');
	},500);
	*/	
}


function fconfigCamera(){
	$('#modalConfigCamera').modal('show');
}
function fselecionarEspecialista(){
	$('.avisoInicial').addClass('hide');
	$('.opcoesD').toggleClass('hide');
	
}

function fbuscarDentista(){
	
		lerDentistas();
	
	$('#modalProfissionais').toggleClass('curto');
	$('.opcoesDentista1').toggleClass('hide');
	$('.opcoesDentista2').toggleClass('hide');
	$('.opcoesDentista3').toggleClass('hide');
	$('.opcoesDentista4').toggleClass('hide');
	$('.opcoesDentista5').toggleClass('hide');
	$('.botaoEsquerdoInicio').removeClass('esquerda');
	$('.botaoDireitoInicio').removeClass('esquerda');
	$('#modalBuscaPaciente').removeClass('hide');
	$('#botoesListaPacientes').removeClass('hide');
	$('#modalBuscaPaciente').addClass('hide');
	$('#botoesListaPacientes').addClass('hide');
	esconde_pag();
}


//DADOS DA CLINICA
function dados_consultorio(){
	tela=paginaAtual[3];
	fbuscarDentista();
	clinica=$('#nome_clinica').val();
	
	$('#pageInicio').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	if(clinica==""){
		botoes+='<a class="btn transparente corbranca" href="#" onclick="salvar_dados_consultorio()"><i class="fa fa-2x fa-save text-left pull-left ic_rodape"></i><span style="font-size:20px">Salvar</span></a>';
	}else{
		botoes+='<a class="btn transparente corbranca" href="#" onclick="salvar_dados_consultorio2()"><i class="fa fa-2x fa-save text-left pull-left ic_rodape"></i><span style="font-size:20px">Alterar</span></a>';
	}
	$('#botoesRodape').html(botoes);
	$('#ZonaFooter').removeClass('hide');
	$('#pageDadosConsultorio').removeClass('hide');
}



function salvar_dados_consultorio(){
	n_o_m_e=$('#nome_clinica').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','');
	idclinica=$('#idclinica').val();
	logo_clinica=$('#caminhoLogoClinica').html();
	logo_clinica_offline="file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+n_o_m_e+"/"+n_o_m_e+".jpg";
	nome_clinica=$('#nome_clinica').val();
	fone_clinica=$('#fone_clinica').val();
	endereco_clinica=$('#endereco_clinica').val();
	cidade_clinica=$('#cidade_clinica').val();
	uf_clinica=$('#uf_clinica').val();
	email_clinica=$('#email_clinica').val();
	site_clinica=$('#site_clinica').val();
	slogan_clinica=$('#slogan_clinica').val();
	responsavel_clinica=$('#responsavel_clinica').val();
	cro_clinica=$('#cro_clinica').val();
	cpf_cnpj_clinica=$('#cpf_cnpj_clinica').val();
	camera_skySerial=$('#camera_skySerial').val();
	Codigosky=$('#CodigoSky').val();
    Ncodigosky='';
	IdMaquina=oDevice.uuid;
	atualizarSoftware ='N';
	cep_clinica=$('#cep_clinica').val();
	if(nome_clinica=="" || responsavel_clinica=="" || cpf_cnpj_clinica=="" || camera_skySerial==""){
		
		aviso('Os campos em destaque são obrigatórios para o funcionamento do equipamento.');
		$('#nome_clinica').addClass('fudeu animated shake');
		$('#responsavel_clinica').addClass('fudeu animated shake');
		$('#cro_clinica').addClass('fudeu animated shake');
		$('#cpf_cnpj_clinica').addClass('fudeu animated shake');
		$('#camera_skySerial').addClass('fudeu animated shake');
		return true;
	}
	 aviso('Salvando...');   
	
	dataString='idclinica='+idclinica+'&logo_clinica='+logo_clinica+'&logo_clinica_offline='+logo_clinica_offline+'&nome_clinica='+nome_clinica+'&fone_clinica='+fone_clinica+'&email_clinica='+email_clinica+'&endereco_clinica='+endereco_clinica+'&cep_clinica='+cep_clinica+'&cidade_clinica='+cidade_clinica+'&uf_clinica='+uf_clinica+'&responsavel_clinica='+responsavel_clinica+'&cro_clinica='+cro_clinica+'&cpf_cnpj_clinica='+cpf_cnpj_clinica+'&site_clinica='+site_clinica+'&slogan_clinica='+slogan_clinica+'&camera_skySerial='+camera_skySerial+'&Codigosky='+Codigosky+'&atualizarSoftware='+atualizarSoftware;

		Stringdados='nome_clinica='+nome_clinica+'&camera_skySerial='+camera_skySerial;
		
		$.ajax({
			url: servidor+"salvaClinica2.php",
			type: "GET",
            data: dataString,
			//dataType:"json",
			async:false,
            success: function(data){
					  
			},error:function(){
				salvaErro("salvaClinica.php");
			}
		 });//Termina Ajax
		 
		  $.ajax({
			url: servidor+"lerCodigo.php",
			type: "GET",
			data: Stringdados,
			dataType:"json",
			success: function(data){
				
				anotaCodigoSky(data.retorno[0].CodigoSky);
				$('#CodigoSky').val(data.retorno[0].CodigoSky);
				setTimeout(function(){
					Ncodigosky=$('#CodigoSky').val();
					updateClinica(Ncodigosky,cpf_cnpj_clinica);
				},400);
			},error:function(){
				salvaErro("lerCodigo.php");
			}
	   })
	
	
}

function anotaCodigoSky(cdg) {
  navigator.notification.beep(1);	
   var message = "Anote o código abaixo!\n\n\n **********       "+cdg+"       **********\n\n\n Com ele você poderá acessar todas as funcionalidades e aplicações desenvolvidas por nossa equipe, além de fornecer atualizações constantes.\n\ *** Sem retirar seu equipamento do consultório!";
   var title = "CÓDIGO SKY MULTI-PRODUTOS";
   var buttonName = "OK, JÁ ANOTEI";
	
   navigator.notification.alert(message, alertCallback, title, buttonName);

   function alertCallback() {
      fpageInicio();
   }
	
}
function updateClinica(Ncodigosky,cpf_cnpj_clinica) {
    db.transaction(function (tx) {

        var query = "UPDATE Dentista_app SET CodigoSky = ? WHERE Cpf_cnpj_clinica = ?";

        tx.executeSql(query, [Ncodigosky, cpf_cnpj_clinica], function(tx, res) {
            //alert("insertId: " + res.insertId);
           //alert("rowsAffected: " + res.rowsAffected);
        },
        function(tx, error) {
           aviso('UPDATE error: ' + error.message);
        });
    }, function(error) {
       aviso('transaction error: ' + error.message);
    }, function() {
        //aviso('ok');
    });
}

function montaDadosClinica(){
	db.transaction(function(transaction) {
		transaction.executeSql('SELECT * FROM Dentista_app', [], function (tx, results) {
			
			if(results.rows.length==0){
				if($('#nome_clinica').val()==""){
					
					$('#modalCodigo').modal('show');
					dados_consultorio();
					$('#divAvisoEspecial').remove();
				}
			}
			if(results.rows.length>=1) {
				
					$('#logo_clinica').attr('src', results.rows.item(0).Logo_clinica_offline);
					$('#nome_clinica').val(results.rows.item(0).Nome_clinica);
					$('#fone_clinica').val(results.rows.item(0).Fone_clinica);
					$('#endereco_clinica').val(results.rows.item(0).Endereco_clinica);
					$('#email_clinica').val(results.rows.item(0).Email_clinica);
					$('#site_clinica').val(results.rows.item(0).Site_clinica);
					$('#slogan_clinica').val(results.rows.item(0).Slogan_clinica);
					$('#responsavel_clinica').val(results.rows.item(0).Responsavel_clinica);
					$('#cro_clinica').val(results.rows.item(0).Cro_clinica);
					$('#cidade_clinica').val(results.rows.item(0).Cidade_clinica)
					$('#uf_clinica').val(results.rows.item(0).UF_clinica);
					$('#camera_skySerial').val(results.rows.item(0).Codigo_camera_sky);
					$('#cpf_cnpj_clinica').val(results.rows.item(0).Cpf_cnpj_clinica);
					$('.email_da_clinica').html(results.rows.item(0).Email_clinica);
					$('.nomeClinicaEmail').html(results.rows.item(0).Nome_clinica);
					$('#CodigoSky').val(results.rows.item(0).CodigoSky);
					$('#divAvisoEspecial').remove();
					//lerDentistas();	
					//lerPacientes(); 
				CodigoSky=$('#CodigoSky').val();
				dataString='CodigoSky='+CodigoSky;
				$.ajax({
					url: servidor+"checaAtualizacao.php",
					type: "GET",
					data: dataString,
					dataType:"json",
					success: function(data){
						 if(data.retorno[0].atualizarSoftware!="N"){
							 atualiza();
						 }else{
						 }
					},error: function(){
						salvaErro('checaAtualizacao.php');
					}
				 });
				
    		}
		}, null);
		
		
	});
    
}

function verificarCodigoSky(){
	$('#botaoVerificaCodigoSky').html('Aguarde... <i class="fa fa-spinner fa-spin fa-fw text-right pull-right"></i>')
	codigoMultiProduto=$('#codigoMultiProduto').val();
	codigodados='codigoMultiProduto='+codigoMultiProduto;
	$('#CodigoSky').val(codigoMultiProduto);	
		$.ajax({
			url: servidor+"verificaCodigo.php",
			type: "GET",
            data: codigodados,
			dataType:"json",
			//async:false,
			
            success: function(data){
				if(data.retorno!=null){
					 navigator.notification.beep(1);
					$('#modalCodigo').modal('hide');
					$('#idclinica').val(data.retorno[0].Id_clinica); 
					$('#logo_clinica').attr('src', data.retorno[0].Logo_clinica);
					$('#nome_clinica').val(data.retorno[0].Nome_clinica);
					$('#fone_clinica').val(data.retorno[0].Fone_clinica);
					$('#endereco_clinica').val(data.retorno[0].Endereco_clinica);
					$('#email_clinica').val(data.retorno[0].Email_clinica);
					$('#site_clinica').val(data.retorno[0].Site_clinica);
					$('#slogan_clinica').val(data.retorno[0].Slogan_clinica);
					$('#responsavel_clinica').val(data.retorno[0].Responsavel_clinica);
					$('#cro_clinica').val(data.retorno[0].Cro_clinica);
					$('#cidade_clinica').val(data.retorno[0].Cidade_clinica)
					$('#uf_clinica').val(data.retorno[0].UF_clinica);
					$('#camera_skySerial').val(data.retorno[0].Codigo_camera_sky);
					$('#cpf_cnpj_clinica').val(data.retorno[0].Cpf_cnpj_clinica);
					$('.email_da_clinica').html(data.retorno[0].Email_clinica);
					$('.nomeClinicaEmail').html(data.retorno[0].Nome_clinica);
					$('#CodigoSky').val(data.retorno[0].CodigoSky);
					botoes='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	
					botoes+='<a class="btn transparente corbranca" href="#" onclick="salvar_dados_consultorio2()"><i class="fa fa-2x fa-save text-left pull-left ic_rodape"></i><span style="font-size:20px">Salvar </span></a>';
			
					$('#botoesRodape').html(botoes);
				}if(!data){
					$('#botaoVerificaCodigoSky').html('Não encontramos... <i class="fa fa-2x fa-exclamation-triangle text-right pull-right"></i>')
					//$('#modalCodigo').modal('hide');
				}
					  
			},error:function(){
				salvaErro("verificaCodigo.php");
			}
		 });//Termina Ajax
	
}
function salvar_dados_consultorio2(){
	
	idclinica=$('#idclinica').val();
	logo_clinica=$('#caminhoLogoClinica').html();
	n_o_m_e=$('#nome_clinica').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','');
	logo_clinica_offline="file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+n_o_m_e+"/"+n_o_m_e+".jpg";
	
	nome_clinica=$('#nome_clinica').val();
	fone_clinica=$('#fone_clinica').val();
	endereco_clinica=$('#endereco_clinica').val();
	cidade_clinica=$('#cidade_clinica').val();
	uf_clinica=$('#uf_clinica').val();
	email_clinica=$('#email_clinica').val();
	site_clinica=$('#site_clinica').val();
	slogan_clinica=$('#slogan_clinica').val();
	responsavel_clinica=$('#responsavel_clinica').val();
	cro_clinica=$('#cro_clinica').val();
	cpf_cnpj_clinica=$('#cpf_cnpj_clinica').val();
	camera_skySerial=$('#camera_skySerial').val();
    Codigosky=$('#CodigoSky').val();
	IdMaquina='';
	cep_clinica=$('#cep_clinica').val();
	if(nome_clinica=="" || responsavel_clinica=="" || cpf_cnpj_clinica=="" || camera_skySerial==""){
		
		aviso('Os campos em destaque são obrigatórios para o funcionamento do equipamento.');
		$('#nome_clinica').addClass('fudeu animated shake');
		$('#responsavel_clinica').addClass('fudeu animated shake');
		$('#cro_clinica').addClass('fudeu animated shake');
		$('#cpf_cnpj_clinica').addClass('fudeu animated shake');
		$('#camera_skySerial').addClass('fudeu animated shake');
		return true;
	}
	 aviso('Salvando...');   
	
	dataString='idclinica='+idclinica+'&logo_clinica='+logo_clinica+'&logo_clinica_offline='+logo_clinica_offline+'&nome_clinica='+nome_clinica+'&fone_clinica='+fone_clinica+'&email_clinica='+email_clinica+'&endereco_clinica='+endereco_clinica+'&cep_clinica='+cep_clinica+'&cidade_clinica='+cidade_clinica+'&uf_clinica='+uf_clinica+'&responsavel_clinica='+responsavel_clinica+'&cro_clinica='+cro_clinica+'&cpf_cnpj_clinica='+cpf_cnpj_clinica+'&site_clinica='+site_clinica+'&slogan_clinica='+slogan_clinica+'&camera_skySerial='+camera_skySerial+'&Codigosky='+Codigosky;

		
		$.ajax({
			url: servidor+"salvaClinica2.php",
			type: "GET",
            data: dataString,
			//dataType:"json",
			async:false,
            success: function(data){
				aviso('Dados salvos');  
			},error:function(){
				salvaErro("salvaClinica2.php");
			}
		 });//Termina Ajax
		 
		 
	
	//GRAVA NO BANCO
	db.transaction(function(transaction) {
	var executeQuery = "INSERT INTO Dentista_app (Cro_clinica,SiteClinica,SloganClinica,Responsavel_clinica, Cpf_cnpj_clinica,Nome_clinica,  Fone_clinica, Email_clinica,Endereco_clinica,Cidade_clinica, UF_clinica,  CodigoSky, Codigo_camera_sky, Logo_clinica,  Logo_clinica_offline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	transaction.executeSql(executeQuery, 
			[cro_clinica, site_clinica, slogan_clinica, responsavel_clinica, cpf_cnpj_clinica, nome_clinica, fone_clinica, email_clinica,endereco_clinica, cidade_clinica, uf_clinica, Codigosky, camera_skySerial, logo_clinica, logo_clinica_offline]
			, function(tx, result) {
				aviso('Dados da clínica salvos');
				$('#nome_clinica').removeClass('fudeu animated shake');
				$('#responsavel_clinica').removeClass('fudeu animated shake');
				$('#cro_clinica').removeClass('fudeu animated shake');
				$('#cpf_cnpj_clinica').removeClass('fudeu animated shake');
				$('#camera_skySerial').removeClass('fudeu animated shake');
			
				setTimeout(function(){
					montaDadosClinica();
				},500);
				
			},
			function(error){
				alert('Fudeu' +error);
	});
});
}

//ADICIONAR PROFISSIONAIS
function adicionar_profissional(){
	troca_foto_dentista('MASC');
	$('.buying-selling.dentistahomem').addClass('active');
	$('.buying-selling.dentistamulher').removeClass('active');
	tela=paginaAtual[8];
	fbuscarDentista();
	$('#pageInicio').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="salvar_novo_dentista()"><i class="fa fa-2x fa-save text-left pull-left ic_rodape"></i><span style="font-size:20px">Salvar</span></a>';
	$('#botoesRodape').html(botoes);
	$('#ZonaFooter').removeClass('hide');
	$('#pageAdProfissional').removeClass('hide');
}

function salvar_novo_dentista(){
	CodigoSky=$('#CodigoSky').val();
	nome_clinica=$('#nome_clinica').val();
	nome_dentista=$('#nome_dentista').val();
	nome=$('#nome_dentista').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');
	fone_dentista=$('#fone_dentista').val();
	cro_dentista=$('#cro_dentista').val();
	email_dentista=$('#email_dentista').val();
   sexo_dentista=$('#SexOdEnTistA').val();
   imagem_dentista=$('#caminhoFotoDentista').html();
   imagem_dentista_offline=$('#caminhoFotoDentista').html();
   estaNoSkyBrain='N';
	if(nome_dentista==''){
		aviso('O nome do profissional é obrigatório');
		$('#nome_dentista').focus();
		return true;
	}
	if(cro_dentista==''){
		aviso('O CRO é obrigatório');
		$('#cro_dentista').focus();
		return true;
	}
	if(imagem_dentista=='' && sexo_dentista=='masc'){
		imagem_dentista="http://skycamapp.net/www/img/Doctor.png";
	}
	if(imagem_dentista=='' && sexo_dentista=='fem'){
		imagem_dentista="http://skycamapp.net/www/img/dentistaB.png";
	}
	if(imagem_dentista_offline=='' && sexo_dentista=='masc'){
		imagem_dentista_offline="file:///storage/emulated/0/Android/data/br.com.skydanielmaster/DR_"+nome+"/"+nome+dia+mes+ano+"_criado_na_web.jpg";
	}
	if(imagem_dentista_offline=='' && sexo_dentista=='fem'){
		imagem_dentista_offline="file:///storage/emulated/0/Android/data/br.com.skydanielmaster/DR_"+nome+"/"+nome+dia+mes+ano+"_criado_na_web.jpg";
	}
	
	
	dataString='nome_dentista='+nome_dentista+'&fone_dentista='+fone_dentista+'&cro_dentista='+cro_dentista+'&email_dentista='+email_dentista+'&nome_clinica='+nome_clinica+'&imagem_dentista='+imagem_dentista+'&imagem_dentista_offline='+imagem_dentista_offline+'&CodigoSky='+CodigoSky;
		
	
		$.ajax({
			url: servidor+"salvaDentistasWEB.php",
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
				if(data.retorno=='Gravou'){
				 aviso('Dados salvos');
				 $("#sexo_d").removeAttr("checked");
				$('#fotoCadstroDentista').attr('src','img/Doctor.png');
				$('#nome_dentista').val('');
				$('#fone_dentista').val('');
				$('#cro_dentista').val('');
				$('#email_dentista').val('');
				$('#inscricao').val('');
				} 
			}
			,error:function(){
				salvaErro("salvaDentistasWeb.php");
				aviso('Por favor, repita a operação.');
			}
				
			
		 });//Termina Ajax
	
}
//LER DENTISTA
function montaDentistasMenu(){
	db.transaction(function(transaction) {
		transaction.executeSql('SELECT * FROM tabela_Dentistas', [], function (tx, results) {
			
			var len = results.rows.length, i;
			if(len==0){
				$('#lista_dentista').html('');
				xxxx='<li id="dentistaVazio" class="list-group-item musica raio0">';
				xxxx+='<h4 class="nome text-muted">Nenhum profissional cadastrado</h4>';
				xxxx+='</li>';
				$('#lista_dentista').append(xxxx);
				$("#rowDent").append(len);
	
			}else{
				$('#dentistaVazio').remove();
				$('#lista_dentista').html('');
				for (i = 0; i < len; i++){
						new_dentista='<li id="'+results.rows.item(i).id+'" class="list-group-item dentista">';
						new_dentista+='	<div class="col-xs-2 text-left">';
						new_dentista+='		<img src="'+results.rows.item(i).Imagem_dentista+'" width="40"  height="40" class=" img-circle" />';
						new_dentista+='	</div>';
						new_dentista+='	<div class="col-xs-10 xxx">';
						new_dentista+='		<h4 class="nome text-muted">'+results.rows.item(i).Nome_dentista+'</h4>';
						new_dentista+='		<span class="cro hide">'+results.rows.item(i).Cro_dentista+'</span>';
						new_dentista+='	</div>';
						new_dentista+='	<div class="clearfix"></div>';
						new_dentista+='</li>';
					$("#lista_dentista").append(new_dentista);
					
				}
			}
			
		}, null);
	});
    
}
//***ONLINE

$('body').on('click','li.dentistaAvaliacao', function(e) {

	var id =     $(this).attr('id'); 
    var imagem = $(this).find('img').attr('src'); 
	var nome_dentista = $(this).find('.nome').first().html();
	$('#dentistaAnalisado').html('Imagens realizadas por: <b>'+nome_dentista+'</b>');
	CodigoSky=$('#CodigoSky').val();
	string='CodigoSky='+CodigoSky+'&nome_dentista='+nome_dentista;
	$('#listaDoDentistaFotos').html('')
	$.ajax({
			url: servidor+"lerCheckupImagensDentistas.php",
			type: "GET",
            data: string,
			dataType:"json",
            success: function(data){
				if(!data){
					xxxx='<li id="imgemVazio" class="list-group-item musica raio0">';
					xxxx+='<h4 class="nome text-muted">Nenhum imagem registrada</h4>';
					xxxx+='</li>';
					$('#listaDoDentistaFotos').html(xxxx);	
				}else{
					
					for (conta = 0; conta < data.retorno.length; conta++){
						
						
						new_imagem='<div  class="col-xs-4">';
					
						new_imagem+='		<img id="im'+data.retorno[conta].id+'" src="'+data.retorno[conta].Imagem+'" class=" img-responsive" />';
						new_imagem+='	<img id="banido'+data.retorno[conta].id+'"  src="img/banido.png" style="position:absolute;top:50%;margin-top:-60px;left:50%;margin-left:-50px;" class="hide">	';
						new_imagem+='	<img id="aprovado'+data.retorno[conta].id+'"  src="img/aprovada.png" style="position:absolute;top:50%;margin-top:-60px;left:50%;margin-left:-50px;" class="hide">	';
						new_imagem+='			<h4 class="corbranca"><i class="fa fa-calendar"></i>  '+data.retorno[conta].Data_imagem+' <a href="#" id="btnFodetudo'+data.retorno[conta].id+'" class="btn  btn-default text-right pull-right" onclick="verImagemGrandeparaAvaliar('+data.retorno[conta].id+')"><i class="fa fa-search"></i></a></h4>';
						
						new_imagem+='</div>';
						$("#listaDoDentistaFotos").append(new_imagem);
						
						
						
				}
				
				}	  
			},error:function(){
				salvaErro("lerCheckupImagensDentistas.php");
			}
		 });//Termina Ajax
	
	
})
function negativa(n){ 
	var r = confirm("Tem certeza que deseja negativar a imagem "+n+"? \n Esse processo não terá mais volta, ok?");
    if (r == true) {
        fecharValidacao();
		$('#banido'+n).removeClass('hide');
		$('#btnFodetudo'+n).html('Imagem reprovada').addClass('disabled btn-danger');
    } else {
        
    }
}
function ativa(n){
	var r = confirm("A imagem "+n+"? será aprovada !\n Esse processo não terá mais volta, ok?");
    if (r == true) {
        fecharValidacao();
		$('#aprovado'+n).removeClass('hide');
		$('#btnFodetudo'+n).html('Imagem aprovada').addClass('disabled btn-success');
    } else {
        
    }  
}
function verImagemGrandeparaAvaliar(idfoto){
	negem='<br><br><br><br><a href="#" class="btn transparente botoes" onclick="negativa('+idfoto+')"><img src="img/fudeu.png" class="img-responsive img-circle" />Refazer</a><br><br><br><br>';
	negem+='<a href="#" class="btn  transparente botoes" onclick="ativa('+idfoto+')"><img src="img/foda.png" class="img-responsive img-circle" />Aprovada</a>';
	$("#btnFodeDentista").append(negem);
	$('#im'+idfoto).clone().css({'margin':'auto'}).appendTo($('#ift'));	//$("#imgZoomValidacao").attr('src',srcfoto);
	$('#pageValidarImagem').removeClass('hide');
}
function fecharValidacao(){
	$("#btnFodeDentista").html('');
	$('#ift').html('');
	//$("#imgZoomValidacao").attr('src','');
	$('#pageValidarImagem').addClass('hide');
}

function fecharVerificaImagens(){
	$("#listadedentistas").html('');
	$('#pageVerificaImagens').addClass('hide');
	$('#pageAnuncio').addClass('hide');
}


function IdContaDentista(){
	
	
	CodigoSky=$('#CodigoSky').val();
	codigodados='CodigoSky='+CodigoSky;

		$.ajax({
			url: servidor+"lerDentistas.php",
			type: "GET",
            data: codigodados,
			dataType:"json",
            success: function(data){
				if(!data){
				}else{
					if(data.retorno.length>0){
						$('#txtMsg').html('O Profissional já existe ne base de dados');
						$('#modalAviso').modal('show');
						$('#nome_dentista').val('').focus();
						return true;
					}
				}
			},error:function(){
			}
		})
    
}
function checaNOMEdentista(){
	nome=$('#nome_dentista').val();
	
	CodigoSky=$('#CodigoSky').val();
	codigodados='CodigoSky='+CodigoSky+'&nome='+nome;

		$.ajax({
			url: servidor+"lerDentistasClone.php",
			type: "GET",
            data: codigodados,
			dataType:"json",
            success: function(data){
					if(!data){
						aviso('Agora você já pode buscar sua fotografia');
    					$('a.botaoDentistaFoto').removeClass('animated fadeInRight disabled').addClass('animated wooble');
					}else{
						$('#txtMsg').html('O Profissional já existe ne base de dados');
						$('#modalAviso').modal('show');
						$('#nome_dentista').val('').focus();
						$('a.botaoDentistaFoto').addClass('animated fadeInRight disabled').removeClass('animated wooble');
						return true;
					}
				
			},error:function(){
				$('#txtMsg').html('Falha de conexão! <br> Repita a operação');
				$('#modalAviso').modal('show');
			}
		})
    
}
function checaNOMEpaciente(){
	var nome=$('#nome_paciente').val();
	CodigoSky=$('#CodigoSky').val();
	codigodadosPAC='CodigoSky='+CodigoSky+'&nome='+nome;

		$.ajax({
			url: servidor+"lerPacientesClone.php",
			type: "GET",
            data: codigodadosPAC,
			dataType:"json",
            success: function(data){
					if(!data){
						aviso('Agora você já pode buscar a fotografia do Paciente '+nome);
    					$('#btnCameraCadastro').removeClass('animated fadeInRight disabled').addClass('animated wooble');
					}else{
						$('#txtMsg').html('O Paciente já existe ne base de dados');
						$('#modalAviso').modal('show');
						$('#nome_paciente').val('').focus();
						$('#btnCameraCadastro').addClass('animated fadeInRight disabled').removeClass('animated wooble');
						return true;
					}
					
			},error:function(){
				$('#txtMsg').html('Falha de conexão! <br> Repita a operação');
				$('#modalAviso').modal('show');
			}
		})
	
    
}

function verificaImagens(){
	
CodigoSky=$('#CodigoSky').val();
codigodados='CodigoSky='+CodigoSky;
$('#listadedentistas').html('');
		$.ajax({
			url: servidor+"lerDentistas.php",
			type: "GET",
            data: codigodados,
			dataType:"json",
            success: function(data){
				if(!data){
					xxxx='<li id="dentistaVazio" class="list-group-item musica raio0">';
					xxxx+='<h4 class="nome text-muted">Nenhum profissional cadastrado</h4>';
					xxxx+='</li>';
					$('#lista_dentista').html(xxxx);	
				}else{
					
					for (conta = 0; conta < data.retorno.length; conta++){
						new_dentista='<li id="'+data.retorno[conta].IdDentista+'" class="list-group-item dentistaAvaliacao">';
						new_dentista+='	<div class="col-xs-2 text-left">';
						new_dentista+='		<img src="'+data.retorno[conta].ImagemDentista+'" width="40"  height="40" class=" img-circle" />';
						new_dentista+='	</div>';
						new_dentista+='	<div class="col-xs-10 xxx">';
						new_dentista+='		<h4 class="nome text-muted">'+data.retorno[conta].Nome_dentista+'</h4>';
						new_dentista+='		<span class="cro hide">'+data.retorno[conta].Cro_dentista+'</span>';
						new_dentista+='	</div>';
						new_dentista+='	<div class="clearfix"></div>';
						new_dentista+='</li>';
						$("#listadedentistas").append(new_dentista);
				}
				$('#modalProfissionais').toggleClass('curto');
				$('.opcoesDentista1').addClass('hide');
				$('.opcoesDentista2').addClass('hide');
				$('.opcoesDentista3').addClass('hide');
				$('.opcoesDentista4').addClass('hide');
				$('.opcoesDentista5').toggleClass('hide');
				$('#pageVerificaImagens').removeClass('hide');
				setTimeout(function(){
					$('#pageAnuncio').removeClass('hide');
				},3000)
				}	  
			},error:function(){
				salvaErro("lerDentistas.php");
			}
		 });//Termina Ajax
	
}
//LER DENTISTAS ONLINE =====
function lerDentistas(){
CodigoSky=$('#CodigoSky').val();
codigodados='CodigoSky='+CodigoSky;
$('#lista_dentista').html('');
		$.ajax({
			url: servidor+"lerDentistas.php",
			type: "GET",
            data: codigodados,
			dataType:"json",
            success: function(data){
				if(!data){
					xxxx='<li id="dentistaVazio" class="list-group-item musica raio0">';
					xxxx+='<h4 class="nome text-muted">Nenhum profissional cadastrado</h4>';
					xxxx+='</li>';
					$('#lista_dentista').html(xxxx);	
				}else{
					
					for (conta = 0; conta < data.retorno.length; conta++){
						new_dentista='<li id="'+data.retorno[conta].IdDentista+'" class="list-group-item dentista">';
						new_dentista+='	<div class="col-xs-2 text-left">';
						new_dentista+='		<img src="'+data.retorno[conta].ImagemDentista+'" width="40"  height="40" class=" img-circle" />';
						new_dentista+='	</div>';
						new_dentista+='	<div class="col-xs-10 xxx">';
						new_dentista+='		<h4 class="nome text-muted">'+data.retorno[conta].Nome_dentista+'</h4>';
						new_dentista+='		<span class="cro hide">'+data.retorno[conta].Cro_dentista+'</span>';
						new_dentista+='	</div>';
						new_dentista+='	<div class="clearfix"></div>';
						new_dentista+='</li>';
						$("#lista_dentista").append(new_dentista);
				}
				
				
				}	  
			},error:function(){
				salvaErro("lerDentistas.php");
			}
		 });//Termina Ajax
}
//**LER PACIENTES ONLINE
function lerPacientes(){
	CodigoSky=$('#CodigoSky').val();
	dataString='CodigoSky='+CodigoSky;
	
	$('#lista_paciente').html('');
		$.ajax({
			url: servidor+"lerPacientes.php",
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
					if(!data){
						xxxx='<li id="pacienteVazio" class="list-group-item musica raio0">';
						xxxx+='<h4 class="nome text-muted">Nenhum paciente cadastrado</h4>';
						xxxx+='</li>';
						$('#lista_paciente').html(xxxx);
					}else{
						
						for (conta = 0; conta < data.retorno.length; conta++){
							
							id=data.retorno[conta].IdPaciente;
							nome_paciente=data.retorno[conta].Nome_paciente;
							fone_paciente=data.retorno[conta].Fone_paciente;
							celular_paciente=data.retorno[conta].Celular_paciente;
							idade_paciente=data.retorno[conta].Idade_paciente;
							cpf_paciente=data.retorno[conta].Cpf_paciente
							rg_paciente=data.retorno[conta].Rg_paciente
							endereco_paciente=data.retorno[conta].Endereco_paciente;
							cep_paciente=data.retorno[conta].Cep_paciente
							email_paciente=data.retorno[conta].Email_paciente
							sexo_paciente=data.retorno[conta].Sexo_paciente;
							imagem_paciente=data.retorno[conta].ImagemPaciente;	
							data_nasc=data.retorno[conta].Nasc_paciente;
							
							new_paciente='<li id="'+id+'" class="list-group-item li_paciente">';
							new_paciente+='	<div class="col-xs-2 text-left">';
							new_paciente+='		<img src="'+imagem_paciente+'" width="40"  height="40" class=" img-circle" />';
							new_paciente+='	</div>';
							new_paciente+='	<div class="col-xs-10 yyy">';
							new_paciente+='		<h4 class="nome text-muted truncado">'+nome_paciente+'</h4>';
							new_paciente+='		<span class="email_paciente hide">'+email_paciente+'</span><span class="fone_paciente hide">'+fone_paciente+'</span><span class="celular_paciente hide">'+celular_paciente+'</span><span class="idadePaciente hide">'+idade_paciente+'</span> <span class="rg_paciente hide">'+rg_paciente+'</span><span class="cpf_paciente hide">'+cpf_paciente+'</span><span class="endereco_paciente hide">'+endereco_paciente+'</span><span class="cep_paciente hide">'+cep_paciente+'</span><span class="nasc_pacienteP hide">'+data_nasc+'</span>';
							new_paciente+='	</div>';
							new_paciente+='	<div class="clearfix"></div>';
							new_paciente+='</li>';
							$("#lista_paciente").append(new_paciente);
							
						}
						
						
					}	
			},
			error:function(){
				salvaErro("lerPacientes.php");
			}
		 });//Termina Ajax
	

}

//CADASTRO DE ENFERMIDADES
function cadastros_geral(){
	$.ajax({
			url: servidor+"lerEnfermidades.php",
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
				 $('#enfermidadesSelecionadas').html('');
						for (conta = 0; conta < data.retorno.length; conta++){
							
						monta_enf='<li href="#" id="li_enfermidade'+data.retorno[conta].id+'" class="list-group-item botaoPaciente listaEnfermidades" onclick="editar_enfermidades('+data.retorno[conta].id+')"  >';
						monta_enf+='<div class="row">';
						monta_enf+='               	<div class="col-xs-10">';
						monta_enf+='                       <h4 > '+data.retorno[conta].Nome_enfermidade+'</h4>';
						monta_enf+='                    </div>   ';
						monta_enf+='<div class="col-xs-2"><a href="#" onclick="deleta_enfermidade('+data.retorno[conta].id+')"><img src="img/fech.png" class="img-responsive botoes"/></a></div>';
						monta_enf+='                  <div class="col-xs-6">';     
						monta_enf+='                       <input type="text" id="valorEditar'+data.retorno[conta].id+'" placeholder="R$0,00" value="'+data.retorno[conta].Valor_enfermidade+'"  class="form-control input-lg  hide animated fadeIn" />';
						monta_enf+='                  </div>';
						monta_enf+='                  <div class="col-xs-6">';     
						monta_enf+='                       <input type="text" id="sessoesEditar'+data.retorno[conta].id+'" placeholder="Qtd Sessões" value="'+data.retorno[conta].Sessoes_tratamento+'"  class="form-control input-lg sessoesDefaultSistema hide animated fadeIn" />';
						monta_enf+='                  </div>     ';
						monta_enf+='  </div>	';
						monta_enf+='</li>';
						$("#enfermidadesSelecionadas").append(monta_enf);
						}
						
						
					}
			
			
			,error:function(){
				salvaErro("lerEnfermidade.php");
				//aviso('Por favor, repita a operação.');
			}
				
			
		 });//Termina Ajax
	tela=paginaAtual[9];
	fbuscarDentista();
	conteudo=$('#enfermidadesSelecionadas').html();
	if(conteudo==''){
		$('#enfermidadesSelecionadas').append("<li id='naopossui' class='list-group-item botaoPaciente'><h4>Você não possui enfermidades cadastradas</h4></li>");
	}
	$('#pageInicio').addClass('hide');
	botoes='<a class="btn transparente corbranca" href="#" onclick="fpageInicio()"><i class="fa fa-2x fa-angle-double-left text-left pull-left ic_rodape"></i><span style="font-size:20px">Voltar</span></a>';
	
	//botoes+='<a class="btn transparente corbranca" href="#" onclick="salvar_lista_enfermidades()"><i class="fa fa-2x fa-save text-left pull-left ic_rodape"></i><span style="font-size:20px">Salvar</span></a>';
	$('#botoesRodape').html(botoes);
	$('#ZonaFooter').removeClass('hide');
	$('#pageCadastroGeral').removeClass('hide');
}
function salvar_lista_enfermidades(){
	aviso('Lista de enfermidades atualizada e salva');
}
function adicionar_nova_enfermidade() {
    $('#blocoAdicionaEnfermidade').removeClass('hide');
	$('#nome_enfermidade').focus();
};


$('#btnFechaEnfermidade').click(function(e) {
    $('#blocoAdicionaEnfermidade').addClass('hide');
	$('#nome_enfermidade').val('');
	$('#valor_enfermidade').val('').addClass('hide');
	$('#sessoes_tratamento').val('').addClass('hide');
});



function adiciona_enfermidade() {
	var valor=$('#enfermidadesSelecionadas').children().length;
	
		valor++;
		valor_enfermidade=$('#valor_enfermidade').val();
		nome_enfermidade=$('#nome_enfermidade').val();
		sessoes_tratamento=$('#sessoes_tratamento').val();
		CodigoSky=$('#CodigoSky').val();
		if(nome_enfermidade==''){
			aviso('Preencha o campo corretamente');
			$('#nome_enfermidade').focus()
			return true;
		}
		
		
		if(valor_enfermidade==''){
			aviso('Insira um valor para a enfermidade')
			$('#valor_enfermidade').removeClass('hide').focus();
			$('#valor_enfermidade').focus();
			$('#sessoes_tratamento').removeClass('hide');
			return true;
		}
		if(nome_enfermidade!='' && valor_enfermidade!=""){
			$('#naopossui').remove();
			
			dataString='nome_enfermidade='+nome_enfermidade+'&valor_enfermidade='+valor_enfermidade+'&sessoes_tratamento='+sessoes_tratamento+'&CodigoSky='+CodigoSky;
		aviso('Salvando...');
		
		$.ajax({
			url: servidor+"salvaEnfermidade.php",
			type: "GET",
            data: dataString,
            success: function(data){
				 
			}
			,error:function(){
				salvaErro("salvaEnfermidade.php");
				//aviso('Por favor, repita a operação.');
			}
				
			
		 });//Termina Ajax
			
			setTimeout(function(){
				montaDoenca();
				$('#nome_enfermidade').val('');
				$('#valor_enfermidade').val('');
				$('#sessoes_tratamento').val('');
			},2000);
			
			
			
		}	
    }
function montaDoenca(){
			db.transaction(function(transaction) {
				transaction.executeSql('SELECT * FROM tabelaEnfermidade', [], function (tx, results) {
					
					var len = results.rows.length, i;
					
					$("#rowCount").append(len);
					//$('#enfermidadesSelecionadas').html('');
					for (i = 0; i < len; i++){
						
						monta_enf='<li href="#" id="li_enfermidade'+results.rows.item(i).id+'" class="list-group-item botaoPaciente listaEnfermidades" onclick="editar_enfermidades('+results.rows.item(i).id+')"  >';
						monta_enf+='<div class="row">';
						monta_enf+='               	<div class="col-xs-10">';
						monta_enf+='                       <h4 > '+results.rows.item(i).Nome_enfermidade+'</h4>';
						monta_enf+='                    </div>   ';
						monta_enf+='<div class="col-xs-2"><a href="#" onclick="deleta_enfermidade('+results.rows.item(i).id+')"><img src="img/fech.png" class="img-responsive botoes"/></a></div>';
						monta_enf+='                  <div class="col-xs-6">';     
						monta_enf+='                       <input type="text" id="valorEditar'+results.rows.item(i).id+'" placeholder="R$0,00" value="'+results.rows.item(i).Valor_enfermidade+'"  class="form-control input-lg  hide animated fadeIn" />';
						monta_enf+='                  </div>';
						monta_enf+='                  <div class="col-xs-6">';     
						monta_enf+='                       <input type="text" id="sessoesEditar'+results.rows.item(i).id+'" placeholder="Qtd Sessões" value="'+results.rows.item(i).Sessoes_tratamento+'"  class="form-control input-lg sessoesDefaultSistema hide animated fadeIn" />';
						monta_enf+='                  </div>     ';
						monta_enf+='  </div>	';
						monta_enf+='</li>';
						
						
						
					}
					$('#enfermidadesSelecionadas').prepend(monta_enf);
				}, null);
			});
			
		}	

function editar_enfermidades(id){

   $('#li_enfermidade'+id);
   $('#valorEditar'+id).toggleClass('hide').focus();
   $('#sessoesEditar'+id).toggleClass('hide').blur(function(e) {
    	$('#valorEditar'+id).toggleClass('hide');
		$(this).toggleClass('hide');
   });
}

function deleta_enfermidade(x){
	linha=$('#enfermidadesSelecionadas').children().length;
	id=x;
	if(linha==1){
		texto='<li class="list-group-item botaoPaciente listaEnfermidades"><h4>Você não possui enfermidades cadastradas</h4></li>'; 
		$('#enfermidadesSelecionadas').append(texto);
	}
	$('#li_enfermidade'+x).fadeOut(500);
	//EXCLUI DO BANCO
	db.transaction(function (tx) {

        var query = "DELETE FROM tabelaEnfermidade WHERE id = ?";

        tx.executeSql(query, [id], function (tx, res) {
          // alert("removeId: " + res.insertId);
          // alert("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
            alert('DELETE error: ' + error.message);
        });
    }, function (error) {
        alert('transaction error: ' + error.message);
    }, function () {
		aviso('Enfermidade Deletada');
       //// aviso('transaction ok');
		
    });
	
}
	
function selecionarTodasEnfermidades(){
	$('#lista_enferm.list-group').children([]).clone().removeClass('active').addClass('todasadcionadas').appendTo($('#enfermidadesSelecionadas'));
	$('#naopossui').remove();
	$('#lista_enferm.list-group').children([]).attr('disabled');
	
}
function observacao_paciente(){
	$('#ObservacoesPaciente').toggleClass('encolhido');
	$('#bola').toggleClass('hide');
	
}
function fechaObservacoes(){
	$('#ObservacoesPaciente').toggleClass('encolhido');
	$('#bola').toggleClass('hide');
}

function fadicionarVideos(){
	$('#modalVideos').modal('show');
}
function configurarAnamnese(){
	
	
	botoes='<a class="btn transparente corbranca" href="#" onclick="fechaCadastroANAMNESE()"><i class="fa fa-2x fa-angle-double-left ic_rodape text-left pull-left"></i><span style="font-size:20px">Voltar</span></a>';
	botoes+='<a class="btn transparente corbranca" href="#" onclick="fadicionarVideos()"><i class="fa fa-2x fa-video-camera text-left ic_rodape pull-left"></i><span style="font-size:20px">Adicionar Vídeos</span></a>';
	botoes+='<a class="btn transparente corbranca" id="btnANAMNESE" href="#" onclick="fsalvaAnamnese()"><i class="fa fa-2x fa-floppy-o text-left pull-left ic_rodape"></i><span style="font-size:20px">Salvar Anamnese</span></a>';
	$('#botoesRodape').html(botoes);
	CodigoSky=$('#CodigoSky').val();
	dataString='CodigoSky='+CodigoSky;
		$.ajax({
			url: servidor+"lerAnamneseAPP_recepcao.php",
			type: "GET",
            data: dataString,
			dataType: "JSON",
            success: function(data){
				if(!data){
					php_anam="salvarAnamneseWEB.php";
					$('#btnANAMNESE').html('<i class="fa fa-2x fa-floppy-o text-left pull-left ic_rodape"></i><span style="font-size:20px">Salvar Anamnese</span>');
					
				}else{
					php_anam="atualizarAnamneseWEB.php";
					$('#pergunta1').val(data.retorno[0].Pergunta1);
					$('#pergunta2').val(data.retorno[0].Pergunta2);
					$('#pergunta3').val(data.retorno[0].Pergunta3);
					$('#pergunta4').val(data.retorno[0].Pergunta4);
					$('#pergunta5').val(data.retorno[0].Pergunta5);
					$('#pergunta6').val(data.retorno[0].Pergunta6);
					$('#pergunta7').val(data.retorno[0].Pergunta7);
					$('#pergunta8').val(data.retorno[0].Pergunta8);
					$('#pergunta9').val(data.retorno[0].Pergunta9);
					$('#pergunta10').val(data.retorno[0].Pergunta10);
					$('#pergunta11').val(data.retorno[0].Pergunta11);
					$('#pergunta12').val(data.retorno[0].Pergunta12);
					$('#pergunta13').val(data.retorno[0].Pergunta13);
					$('#pergunta14').val(data.retorno[0].Pergunta14);
					$('#pergunta15').val(data.retorno[0].Pergunta15);
					$('#pergunta16').val(data.retorno[0].Pergunta16);
					$('#pergunta17').val(data.retorno[0].Pergunta17);
					$('#pergunta18').val(data.retorno[0].Pergunta18);
					$('#pergunta19').val(data.retorno[0].Pergunta19);
					$('#pergunta20').val(data.retorno[0].Pergunta20);
					var arquivo1=data.retorno[0].Linkvideo1;
					var arquivo2=data.retorno[0].Linkvideo2;
					var arquivo3=data.retorno[0].Linkvideo3;
					
					var v1_ = arquivo1.substr(arquivo1.lastIndexOf('/')+1);
					var v2_ = arquivo2.substr(arquivo2.lastIndexOf('/')+1);
					var v3_ = arquivo3.substr(arquivo3.lastIndexOf('/')+1);	
					
					L1	=	'http://www.youtube.com/embed/'+v1_;
					L2	=	'http://www.youtube.com/embed/'+v2_;
					L3	=	'http://www.youtube.com/embed/'+v3_;
					$('#linkvideo1').val(L1);
					$('#linkvideo2').val(L2);
					$('#linkvideo3').val(L3);
					$('#btnANAMNESE').html('<i class="fa fa-2x fa-floppy-o text-left pull-left ic_rodape"></i><span style="font-size:20px">Alterar Anamnese</span>');
				}
				
			},
			error:function(){
				salvaErro("salvaComaparacao");
			}
		});
	
	$('#ZonaFooter').removeClass('hide');
	$('#cadastroANAMNESE').removeClass('hide');
}
function fechaAnuncio(){
	
	$('#pageAnuncio').addClass('hide');
}
function saiANAMNESE(){
	$('#botoesRodape').html('');
	$('#ZonaFooter').addClass('hide');
	$('#cadastroANAMNESE').addClass('hide');
}
function fechaCadastroANAMNESE(){
	//if (confirm('Deseja sair da página ?') == true) {
        saiANAMNESE();
	//}
}
function salvarVideos(){
	linkvideo1=$('#linkvideo1').val();
	linkvideo2=$('#linkvideo2').val();
	linkvideo3=$('#linkvideo3').val();
	if(linkvideo1=="" || linkvideo2=="" || linkvideo3==""){
		$('#txtMsg').html(':::: Sugestão :::: <br>Insira vídeos sobre a sua Clínica ou sobre a importância do ChecKup Preventivo Digital');
		$('#modalAviso').modal('show');
		return true;
		
	}else{
		$('#modalVideos').modal('hide');
	}
}
function fsalvaAnamnese(){
	pergunta1=$('#pergunta1').val();
	pergunta2=$('#pergunta2').val();
	pergunta3=$('#pergunta3').val();
	pergunta4=$('#pergunta4').val();
	pergunta5=$('#pergunta5').val();
	pergunta6=$('#pergunta6').val();
	pergunta7=$('#pergunta7').val();
	pergunta8=$('#pergunta8').val();
	pergunta9=$('#pergunta9').val();
	pergunta10=$('#pergunta10').val();
	pergunta11=$('#pergunta11').val();
	pergunta12=$('#pergunta12').val();
	pergunta13=$('#pergunta13').val();
	pergunta14=$('#pergunta14').val();
	pergunta15=$('#pergunta15').val();
	pergunta16=$('#pergunta16').val();
	pergunta17=$('#pergunta17').val();
	pergunta18=$('#pergunta18').val();
	pergunta19=$('#pergunta19').val();
	pergunta20=$('#pergunta20').val();
	link_1=$('#linkvideo1').val();
	link_2=$('#linkvideo2').val();
	link_3=$('#linkvideo3').val();
	link1=link_1.substr(link_1.lastIndexOf('=')+1);
	link1EM=link_1.substr(link_1.lastIndexOf('embed/')+1);
	if(link1===true){linkvideo1='http://www.youtube.com/embed/'+link1;}
	if(link1EM===true){linkvideo1='http://www.youtube.com/embed/'+link1EM;}
		
		
	link2=link_2.substr(link_2.lastIndexOf('=')+1);
	
	link3=link_3.substr(link_3.lastIndexOf('=')+1);
	
	
	CodigoSky=$('#CodigoSky').val();
	if(pergunta1=="" || pergunta2=="" || pergunta3=="" || pergunta4=="" || pergunta5==""){
		alert('É necessário ao menos 5 perguntas, ok?');
		return true
	}
	if(linkvideo1=="" || linkvideo2=="" || linkvideo3==""){
		$('#modalVideos').modal('show');
		return true
	}
	if(link1){
		linkvideo1='http://www.youtube.com/embed/'+link1;
	}else{
		linkvideo1=link_1;
	}
	if(link2){
		linkvideo2='http://www.youtube.com/embed/'+link2;
	}else{
		linkvideo2=link_2;
	}
	if(link3){
		linkvideo3='http://www.youtube.com/embed/'+link3;
	}else{
		linkvideo3=link_3;
	}
		
	
	
	
	dataString='pergunta1='+pergunta1+'&pergunta2='+pergunta2+'&pergunta3='+pergunta3+'&pergunta4='+pergunta4+'&pergunta5='+pergunta5+'&pergunta6='+pergunta6+'&pergunta7='+pergunta7+'&pergunta8='+pergunta8+'&pergunta9='+pergunta9+'&pergunta10='+pergunta10+'&pergunta11='+pergunta11+'&pergunta12='+pergunta12+'&pergunta13='+pergunta13+'&pergunta14='+pergunta14+'&pergunta15='+pergunta15+'&pergunta16='+pergunta16+'&pergunta17='+pergunta17+'&pergunta18='+pergunta18+'&pergunta19='+pergunta19+'&pergunta20='+pergunta20+'&linkvideo1='+linkvideo1+'&linkvideo2='+linkvideo2+'&linkvideo3='+linkvideo3+'&CodigoSky='+CodigoSky;
	
		$.ajax({
			url: servidor+php_anam,
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
				$('#txtMsg').html('::::Status '+data.retorno+'::::<br>Anamnese preparada e pronta para download<br>Basta abrir o Aplicativo SkyCam Recepção');
				$('#modalAviso').modal('show');
				
									
			},
			error:function(){
				salvaErro("salvaComaparacao");
			}
		});
	
}
function anamnese_paciente(){
////ANAMNESE @2017	
	
	CodigoSky=$('#CodigoSky').val();
	nome_paciente=$('.paciente_nome').html();
	dataString='CodigoSky='+CodigoSky+'&nome_paciente='+nome_paciente;
	
	$('#listaAnamnese').html('');
	$("#imprimeAnamnese").html('');
		$.ajax({
			url: servidor+"lerAnamnese.php",
			type: "GET",
            data: dataString,
			dataType:"JSON",
            success: function(data){
				
				
					if(!data){
						
						$('#listaAnamnese').html('');
						$("#imprimeAnamnese").html('');
						$('#txtMsgAlteracao').html(nome_paciente+ ' não possui anamnese em nossos registros!');
						$('#modalAlteracao').modal('show');
						return true;
					}else{
						for (conta = 0; conta < data.retorno.length; conta++){
							anam=data.retorno[conta].Impressao;
							if(anam==''){
						
								$('#listaAnamnese').html('');
								$("#imprimeAnamnese").html('');
								$('#txtMsgAlteracao').html(nome_paciente+ ' não possui anamnese em novo formato!');
								$('#modalAlteracao').modal('show');
								return true;
							}
							monta_anmnese='<img src="'+data.retorno[conta].Impressao+'" class="img-responsive"/>';
							monta_anmnese_imprimir='<img src="'+data.retorno[conta].Impressao+'" class="img-responsive"/>';
							monta_anmnese_imprimir+='<span style="page-break-after: always !important;"></span>';
							/*
							fto_clinica=$('#logo_clinica').attr('src');
							monta_anmnese='			<h4><b>1) Sua Gengiva sangra?</b></h4>';
							monta_anmnese+='            <h5>Resposta:'+data.retorno[conta].Pergunta1+'</h5>';
							monta_anmnese+='         ';
							monta_anmnese+='            ';
							monta_anmnese+='            <h4><b>2)Qual a frequência na escovação?</b></h4>';
							monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta2+'</h5>';
							monta_anmnese+='            ';
							monta_anmnese+='            <h4><b>3) Usa fio dental?</b></h4>';
							monta_anmnese+='            <h5>Resposta:'+data.retorno[conta].Pergunta3+'</h5>';
							monta_anmnese+='           ';
							monta_anmnese+='            ';
							monta_anmnese+='            <h4><b>4) Algum problema de saúde?</b></h4>';
							monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta4+'</h4>';
							monta_anmnese+='            ';
							if(data.retorno[conta].Qual_pergunta4!=""){
								monta_anmnese+='            <h4><b>4 a) Qual?</b></h4>';
								monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Qual_pergunta4+'</h4>';
							}
							monta_anmnese+='            <h4><b>5) Está tomando algum tipo de medicamento?</b></h4>';
							monta_anmnese+='            <h5>Resposta:'+data.retorno[conta].Pergunta5+'</h5>';
							monta_anmnese+='            ';
							monta_anmnese+='            <h4><b>6) Você possui alguma Alergia?</b></h4>';
							monta_anmnese+='            <h5>Resposta:'+data.retorno[conta].Pergunta6+'</h5>';
									   
							monta_anmnese+='            <h4><b>7) Você Fuma?</b></h4>';
							monta_anmnese+='            <h5>Resposta:'+data.retorno[conta].Pergunta7+'</h5>';
							monta_anmnese+='            ';
							monta_anmnese+='            <h4><b>8) Quando foi sua última visita ao dentista?</b></h4>';
							monta_anmnese+='            <h5>Resposta:'+data.retorno[conta].Pergunta8+'</h5>';
							monta_anmnese+='            ';
							monta_anmnese+='            <h4><b>9) Qual o motivo?</b></h4>';
							monta_anmnese+='            <h5>Resposta:'+data.retorno[conta].Pergunta9+' </h5>';
							monta_anmnese+='            ';
							monta_anmnese+='            <h4><b>10) Qual sua frequência ao dentista?</b></h4>';
							monta_anmnese+='            <h5>Resposta:'+data.retorno[conta].Pergunta10+' </h5>';
							monta_anmnese+='            ';
							monta_anmnese+='            <h4><b>11) Usa algum enxaguatório bucal?</b></h4>';
							monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta11+'</h5>';
							monta_anmnese+='             ';
						
							monta_anmnese+='             <h4><b>12) Usa qual creme dental?</b></h4>';
							monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta12+'</h5>';
							monta_anmnese+='             ';
							monta_anmnese+='             <h4><b>13) Dentes sensíveis?</b></h4>';
							monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta13+'</h5>';
							monta_anmnese+='             ';
							monta_anmnese+='             <h4><b>14) Dentes sensíveis?</b></h4>';
							monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta14+'</h5>';
							monta_anmnese+='             ';
							monta_anmnese+='             <h4><b>16) Toma Anticoncepcional?</b></h4>';
							monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta15+'</h5>';
							monta_anmnese+='             ';
							monta_anmnese+='             <h4><b>17) Está Grávida?</b></h4>';
							monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta16+'</h5>';
							monta_anmnese+='             ';
							if(data.retorno[conta].Pergunta17!=""){
								monta_anmnese+='            <h4><b>17 a) Quantos meses??</b></h4>';
								monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta17+'</h4>';
							}
							
							monta_anmnese+='             ';
							monta_anmnese+='             <h4><b>18) Conhece o CHECK-UP PREVENTIVO DIGITAL?</b></h4>';
							monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta18+'</h5>';
							monta_anmnese+='             ';
							if(data.retorno[conta].Pergunta19!=""){
								monta_anmnese+='             <h4><b>19) Já fez?</b></h4>';
								monta_anmnese+='             <h5>Resposta:'+data.retorno[conta].Pergunta19+'</h5>';
							}
							
							//monta_anmnese_imprimir+='<p style="page-break-before: always"></p>';
							monta_anmnese_imprimir+='			<img src="'+fto_clinica+'"  style="float:left;height:50px"/>';
							monta_anmnese_imprimir+='			<br><br><p><b>Paciente:</b>'+data.retorno[conta].Nome_paciente+'</p>';
							monta_anmnese_imprimir+='			<p><b>1) Sua Gengiva sangra?</b></p>';
							monta_anmnese_imprimir+='            <h6>Resposta: '+data.retorno[conta].Pergunta1+'</h6>';
							monta_anmnese_imprimir+='         ';
							monta_anmnese_imprimir+='            ';
							monta_anmnese_imprimir+='            <p><b>2)Qual a frequência na escovação?</b></p>';
							monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta2+'</h6>';
							monta_anmnese_imprimir+='            ';
							monta_anmnese_imprimir+='            <p><b>3) Usa fio dental?</b></p>';
							monta_anmnese_imprimir+='            <h6>Resposta: '+data.retorno[conta].Pergunta3+'</h6>';
							monta_anmnese_imprimir+='           ';
							monta_anmnese_imprimir+='            ';
							monta_anmnese_imprimir+='            <p><b>4) Algum problema de saúde?</b></p>';
							monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta4+'</p>';
							monta_anmnese_imprimir+='            ';
							if(data.retorno[conta].Qual_pergunta4!=""){
								monta_anmnese_imprimir+='            <p><b>4 a) Qual?</b></p>';
								monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Qual_pergunta4+'</p>';
							}
							monta_anmnese_imprimir+='            <p><b>5) Está tomando algum tipo de medicamento?</b></p>';
							monta_anmnese_imprimir+='            <h6>Resposta: '+data.retorno[conta].Pergunta5+'</h6>';
							monta_anmnese_imprimir+='            ';
							monta_anmnese_imprimir+='            <p><b>6) Você possui alguma Alergia?</b></p>';
							monta_anmnese_imprimir+='            <h6>Resposta: '+data.retorno[conta].Pergunta6+'</h6>';
									   
							monta_anmnese_imprimir+='            <p><b>7) Você Fuma?</b></p>';
							monta_anmnese_imprimir+='            <h6>Resposta: '+data.retorno[conta].Pergunta7+'</h6>';
							monta_anmnese_imprimir+='            ';
							monta_anmnese_imprimir+='            <p><b>8) Quando foi sua última visita ao dentista?</b></p>';
							monta_anmnese_imprimir+='            <h6>Resposta: '+data.retorno[conta].Pergunta8+'</h6>';
							monta_anmnese_imprimir+='            ';
							monta_anmnese_imprimir+='            <p><b>9) Qual o motivo?</b></p>';
							monta_anmnese_imprimir+='            <h6>Resposta: '+data.retorno[conta].Pergunta9+' </h6>';
							monta_anmnese_imprimir+='            ';
							monta_anmnese_imprimir+='            <p><b>10) Qual sua frequência ao dentista?</b></p>';
							monta_anmnese_imprimir+='            <h6>Resposta: '+data.retorno[conta].Pergunta10+' </h6>';
							monta_anmnese_imprimir+='            ';
							monta_anmnese_imprimir+='            <p><b>11) Usa algum enxaguatório bucal?</b></p>';
							monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta11+'</h6>';
							monta_anmnese_imprimir+='             ';
						
							monta_anmnese_imprimir+='             <p><b>12) Usa qual creme dental?</b></p>';
							monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta12+'</h6>';
							monta_anmnese_imprimir+='             ';
							monta_anmnese_imprimir+='             <p><b>13) Dentes sensíveis?</b></p>';
							monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta13+'</h6>';
							monta_anmnese_imprimir+='             ';
							monta_anmnese_imprimir+='             <p><b>14) Dentes sensíveis?</b></p>';
							monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta14+'</h6>';
							monta_anmnese_imprimir+='             ';
							monta_anmnese_imprimir+='             <p><b>16) Toma Anticoncepcional?</b></p>';
							monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta15+'</h6>';
							monta_anmnese_imprimir+='             ';
							monta_anmnese_imprimir+='             <p><b>17) Está Grávida?</b></p>';
							monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta16+'</h6>';
							monta_anmnese_imprimir+='             ';
							if(data.retorno[conta].Pergunta17!=""){
								monta_anmnese_imprimir+='            <p><b>17 a) Quantos meses??</b></p>';
								monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta17+'</p>';
							}
							
							monta_anmnese_imprimir+='             ';
							monta_anmnese_imprimir+='             <p><b>18) Conhece o CHECK-UP PREVENTIVO DIGITAL?</b></p>';
							monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta18+'</h6>';
							monta_anmnese_imprimir+='             ';
							if(data.retorno[conta].Pergunta19!=""){
								monta_anmnese_imprimir+='             <p><b>19) Já fez?</b></p>';
								monta_anmnese_imprimir+='             <h6>Resposta: '+data.retorno[conta].Pergunta19+'</h6>';
							}
							monta_anmnese_imprimir+='<p style="page-break-after: always"></p>';
							*/
						}
						$("#listaAnamnese").append(monta_anmnese);
						$("#imprimeAnamnese").append(monta_anmnese_imprimir);
						$("#btnImpAnam").removeClass('hide');
						$('#anamensePaciente').toggleClass('fechado');
						$('#botaoPaci').css('left','70%');
						$('#funcoesTelaPaciente ').css('right','30%');
						$('#pacienteH1 ').css('left','70%');
						$('#modal_img_paciente').css('left','70%');
						$('#dadosPessoaisPaciente ').addClass('hide');
					}	
			},error:function(){
				salvaErro("lerAnamneseWEB.php");
				//aviso('Por favor, repita a operação.');
			}
		 });//Termina Ajax
	
	
	
	
	
	
}
function fechaAnamnese(){
	$('#anamensePaciente  ').toggleClass('fechado');
	$('#botaoPaci').css('left','50%');
	$('#funcoesTelaPaciente ').css('right','50%');
	$('#pacienteH1 ').css('left','50%');
	$('#modal_img_paciente').css('left','50%');
	$('#dadosPessoaisPaciente ').removeClass('hide');
}



function montaLaudoPaciente(nome_paciente){
	$("#listaCheckupHistorico").html('');
	dataString='nome_paciente='+nome_paciente;
	if(!Offline){
		$.ajax({
				url: servidor+"lerLaudo.php",
				type: "GET",
				data: dataString,
				dataType:"json",
				success: function(data){
					
					if(!data){
						$("#listaCheckupHistorico").append('<h2 class="corbranca animated fadeInRight"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      O paciente não possui laudo</h2>');
					}else{
					
						for(laudo=0;laudo<data.retorno.length;laudo++){
							xxx=data.retorno[laudo].Codigo_Laudo;
							qtdimg=data.retorno[laudo].Quant_imagens;
							
							if(qtdimg<=40 || qtdimg<='40'){
								cor='bagde-danger';
							}else{
								cor='bagde-default';
							}
							telinha='<div  class="col-xs-2"><p></p><a href="#" class="botaoverLaudo text-center"><span class="codigoVerLaudo hide">'+xxx+'</span><img src="img/pastinha.png" class="img-responsive sombraForte animated fadeInDown"/></a><p class="corbranca text-center">'+data.retorno[laudo].Data_Laudo+' <span class="badge '+cor+' pull-right" >'+data.retorno[laudo].Quant_imagens+' imagens</span></p></div>';
							$("#listaCheckupHistorico").append(telinha);
							
						}
	
					}
					
					
				},
				error:function(){
					salvaErro("SalvaVisualizaLaudo2.php");
				}
			});
	}else{
	//nome_paciente=$('.paciente_nome').html();
	db.transaction(function(transaction) {
				transaction.executeSql('SELECT id, Imagem_laudo, Codigo_Laudo, Data_Laudo FROM tabelaLaudo  WHERE Nome_paciente = "'+nome_paciente+'" GROUP BY Codigo_Laudo', [], function (tx, results) {
					//$("#listaCheckupHistorico").html('');
					var len = results.rows.length, i;
					
					
					if(len==0){
						$("#listaCheckupHistorico").append('<h2 class="corbranca animated fadeInRight"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      O paciente não possui laudo</h2>');
					}else{
					
						for(i=0;i<len;i++){
							xxx=results.rows.item(i).Codigo_Laudo;
							qtdimg=results.rows.item(i).Quant_imagens;
							if(qtdimg<=40 || qtdimg<='40'){
								cor='bagde-danger';
							}else{
								cor='bagde-default';
							}
							telinha='<div class="col-xs-3"><a href="#" onclick="ver_checkup_laudo('+results.rows.item(i).Codigo_Laudo+')" class="text-center"><img src="img/pastinha.png" class="img-responsive"/></a><p class="corbranca text-center">'+results.rows.item(i).Data_Laudo+'   <span class="badge '+cor+' pull-right" >'+results.rows.item(i).Quant_imagens+' imagens</span></p></div>';
							$("#listaCheckupHistorico").append(telinha);
							
							
						}
						
					}
				})
				
	})
	
	}
}
function fecharZoomLaudo(){
	$("#vLaudo").html('');
	$('#imprimeLaudo2').html('').addClass('hide');
	$("#visualizarLaudoTela").addClass('hide');
}

$('body').on('click','a.botaoverLaudo',function(){
	
var	codigo_Laudo=$(this).find('.codigoVerLaudo').first().html();
	 nome_paciente=$('.paciente_nome').html();
	dataString='nome_paciente='+nome_paciente+'&codigo_Laudo='+codigo_Laudo;
	
	
	if(!Offline){
		$.ajax({
				url: servidor+"lerLaudo2.php",
				type: "GET",
				data: dataString,
				dataType:"json",
				success: function(data){
					$('#imprimeLaudo').html('');
					for(laudo=0;laudo<data.retorno.length;laudo++){
							impr='<img src="'+data.retorno[laudo].Imagem_laudo+'" class="imgLaudoImprime img-responsive"/>';
							telinha='<a href="#"  class="text-center"><img src="'+data.retorno[laudo].Imagem_laudo+'" class="img-responsive sombraForte animated fadeInDown"/></a>';
							$("#vLaudo").append(telinha);
							$('#imprimeLaudo2').append(impr);
							
					}
					
					$("#visualizarLaudoTela").removeClass('hide');
					
					
					
				},
				error:function(){
					salvaErro("VerLaudo.php");
				}
			});
	}else{
		db.transaction(function(transaction) {
				transaction.executeSql('SELECT Imagem_laudo FROM tabelaLaudo  WHERE Nome_paciente = "'+nome_paciente+'"  AND Codigo_Laudo="'+codigo_Laudo+'"', [], function (tx, results) {
					$('#imprimeLaudo').html('');
					var len = results.rows.length, i;
					lista='';
						for (i = 0; i < len; i++){
						telinha='<a href="#"  class="text-center"><img src="'+results.rows.item(i).Imagem_laudo+'" class="img-responsive sombraForte animated fadeInDown"/></a>';
						impr=' <p style="page-break-before: always"><img src="'+results.rows.item(i).Imagem_laudo+'" class="img-responsive sombraForte animated fadeInDown"/></p>';
							$("#vLaudo").append(telinha);
							$('#imprimeLaudo').append(impr);
					}
					$("#visualizarLaudoTela").removeClass('hide');
								
						
						
						
				}, null);
				
			});
	}
});
function VeraMerdadoRaiox(){
	
	var nome_paciente=$('.paciente_nome').html();//.replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','');
	var CodigoSky=$('#CodigoSky').val();
	if(!Offline){
	dataString='CodigoSky='+CodigoSky+'&nome_paciente='+nome_paciente;
	$('#modalVisualizarRaiox').modal('show');
	$('#telaRaiox').html('');
		$.ajax({
			url: servidor+"lerRaiox.php",
			type: "GET",
            data: dataString,
			dataType:"json",
            success: function(data){
					if(!data){
						aviso("O paciente não possui RaioX");
						return true;
					}else{

						for (conta = 0; conta < data.retorno.length; conta++){
							
							  imgRaiox='<div class="col-xs-4"><a href="#" class="btn transparente imagemRaioX"><img src="'+data.retorno[conta].Raiox_online+'" class="img-responsive imagemRaioX"/><h4 class="corbranca text-center">'+data.retorno[conta].Data_raiox+'</h4></a></div>';
							$('#telaRaiox').append(imgRaiox);
						}
						
							
					}
					$('#modalVisualizarRaiox').modal('show'); 
			}
		})
	}else{
		db.transaction(function(transaction) {
		transaction.executeSql('SELECT Raiox_offline, Data_raiox  INTO  Raiox  WHERE Nome_paciente = "'+nome_paciente+'" AND CodigoSky = "'+CodigoSky+'" ', [],
		 function (tx, results) {
					$("#telaRaiox").html('');
					var len = results.rows.length, i;
					
					if(len==0){
						$("#telaRaiox").append('<h2 class="corbranca animated fadeInRight"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      O paciente não possui RaioX</h2>');
					}else{
					
						for(i=0;i<len;i++){
							
							
							  imgRaiox='<div class="col-xs-4"><a href="#" class="btn transparente imagemRaioX"><img src="'+results.rows.item(i).Raiox_offline+'" class="img-responsive  imagemRaioX"/><h4 class="corbranca text-center">'+results.rows.item(i).Data_raiox+'</h4></a></div>';
							$('#telaRaiox').append(imgRaiox);
						}
							
						
					}
		 }, null);
				
		});
	}
		
	
		
}

	
	function troca_foto(foto_cadastro){
		
		
		
		if(foto_cadastro=="MASC"){
			
			sexo='img/pac1.png';
			$('#sexo_paciente_foto').html('masc');
			$('#fotoPaciente').attr('src',sexo);
		}else{
				
				sexo='img/pac2.png';
				$('#sexo_paciente_foto').html('fem');
				$('#fotoPaciente').attr('src',sexo);
		}
	}
	
	function troca_foto_dentista(foto_cadastro){
		
		if(foto_cadastro=="MASC"){
			
			sexo='img/Doctor.png';
			$('#fotoCadstroDentista').attr('src',sexo);
			$('#SexOdEnTistA').html('masc')
		}else{
				
				sexo='img/dentistaB.png';
				$('#fotoCadstroDentista').attr('src',sexo);
				$('#SexOdEnTistA').html('fem')
		}
	}
	
	





/*
$(function() {
	
   	
   
	
	
   $( "#editaLaudoPronto1" ).sortable({
	   start: function (event, ui) {
           // $(ui.item).data("startindex", ui.item.index());
		   var ccc = $(ui.sortable);
		   ccc.addClass('rowmuda');
		   $(ui.item).addClass('rowmuda');
        },
        stop: function (event, ui) {
            //self.sendUpdatedIndex(ui.item);
			var ccc = $(ui.sortable);
			if(ccc.hasClass('rowmuda')){
		   		ccc.removeClass('rowmuda');
			}
			$(ui.item).removeClass('rowmuda')
        }
   });
   $( "#editaLaudoPronto1" ).disableSelection();
   $('body').trigger('updatelayout');
	
   $( "#editaLaudoPronto2" ).sortable({
	   start: function (event, ui) {
           // $(ui.item).data("startindex", ui.item.index());
		   var ccc = $(ui.sortable);
		   ccc.addClass('rowmuda');
		   $(ui.item).addClass('rowmuda');
        },
        stop: function (event, ui) {
            //self.sendUpdatedIndex(ui.item);
			var ccc = $(ui.sortable);
			if(ccc.hasClass('rowmuda')){
		   		ccc.removeClass('rowmuda');
			}
			$(ui.item).removeClass('rowmuda')
        }
   });
   $( "#editaLaudoPronto2" ).disableSelection();
   $('body').trigger('updatelayout');
	
	
   $( "#editaLaudoPronto3" ).sortable({
	   start: function (event, ui) {
           // $(ui.item).data("startindex", ui.item.index());
		   var ccc = $(ui.sortable);
		   ccc.addClass('rowmuda');
		   $(ui.item).addClass('rowmuda');
        },
        stop: function (event, ui) {
            //self.sendUpdatedIndex(ui.item);
			var ccc = $(ui.sortable);
			if(ccc.hasClass('rowmuda')){
		   		ccc.removeClass('rowmuda');
			}
			$(ui.item).removeClass('rowmuda')
        }
   });
   $( "#editaLaudoPronto3" ).disableSelection();
   $('body').trigger('updatelayout');
	
	
	
	$( "#editaLaudoPronto4" ).sortable({
	   start: function (event, ui) {
           // $(ui.item).data("startindex", ui.item.index());
		   var ccc = $(ui.sortable);
		   ccc.addClass('rowmuda');
		   $(ui.item).addClass('rowmuda');
        },
        stop: function (event, ui) {
            //self.sendUpdatedIndex(ui.item);
			var ccc = $(ui.sortable);
			if(ccc.hasClass('rowmuda')){
		   		ccc.removeClass('rowmuda');
			}
			$(ui.item).removeClass('rowmuda')
        }
   });
   $( "#editaLaudoPronto4" ).disableSelection();
	$('body').trigger('updatelayout');

});

*/










(function( $ ) {

    $.support.touch = typeof Touch === 'object';

    if (!$.support.touch) {
	
        return;
    }

    var proto =  $.ui.mouse.prototype,
    _mouseInit = proto._mouseInit;

    $.extend( proto, {
        _mouseInit: function() {
            this.element
            .bind( "touchstart." + this.widgetName, $.proxy( this, "_touchStart" ) );
            _mouseInit.apply( this, arguments );
        },

        _touchStart: function( event ) {
            if ( event.originalEvent.targetTouches.length != 1 ) {
                return false;
            }

            this.element
            .bind( "touchmove." + this.widgetName, $.proxy( this, "_touchMove" ) )
            .bind( "touchend." + this.widgetName, $.proxy( this, "_touchEnd" ) );

            this._modifyEvent( event );

            $( document ).trigger($.Event("mouseup")); //reset mouseHandled flag in ui.mouse
            this._mouseDown( event );

            return false;           
        },

        _touchMove: function( event ) {
            this._modifyEvent( event );
            this._mouseMove( event );   
        },

        _touchEnd: function( event ) {
            this.element
            .unbind( "touchmove." + this.widgetName )
            .unbind( "touchend." + this.widgetName );
            this._mouseUp( event ); 
        },

        _modifyEvent: function( event ) {
            event.which = 1;
            var target = event.originalEvent.targetTouches[0];
            event.pageX = target.clientX;
            event.pageY = target.clientY;
        }

    });
	


})( jQuery );

//MANUTENÇÂO SKY








		
		


function playSound(xxx){   
     document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="'+xxx+'.mp3" type="audio/mpeg" /></audio>';
}
				

/*PAGINA CONFIGURACOES*/
$("#Sonteclado").on("click", function(){
		somApp=$("#Sonteclado").is(":checked");
		if(somApp) {
			
			$('#somApp').html("Ativado");
			playSound('aviso');
			
			var toques = $('body');
			toques.on('click','a','li', function(e) {
				playSound('clique');
				
			});
			
		} else {
			$("#Sonteclado").removeAttr("checked");
			$('#somApp').html("Desativado");
			var toques = $('body');
			toques.on('click','a','li', function(e) {
				playSound('');
				
			});
			
		}
}); 
	
			 
				
	
	
	$("#Ajusteteclado").on("click", function(){
		teclaApp = $("#Ajusteteclado").is(":checked");
		
		if(teclaApp) {
			
			$('#tecladoApp').html("Ativado");
			$('.botaoDireitoInicio').focusin(function(e) {
				playSound('clique');
				$('#imgBotaoDireito').addClass('elementoAtivo');
				setTimeout(function(){
					$('#imgBotaoDireito').removeClass('elementoAtivo');
				},500);
				fbuscarPaciente();
			});
			
			$('.botaoDireitoInicio').focusout(function(e) {
				$('#imgBotaoDireito').removeClass('elementoAtivo');
				//fecharBuscaPaciente();
			});
			
			$('#c-circle-nav').focusin(function(e) {
				fecharBuscaPaciente();
                esconde_pag();
            });
			$('#c-circle-nav').focusout(function(e) {
				playSound('clique');
                esconde_pag();
            });
		} else {
			$("#Ajusteteclado").removeAttr("checked");
			$('#tecladoApp').html("Desativado");
			
			
		}
	}); 
	
	
	
	$("#temaLight").on("click", function(){
		$('#temaSoft').removeAttr('checked');
		$('#temaHard').removeAttr('checked');
		$('.pagina').css('background','-webkit-linear-gradient(top, #383838 0%,#858585 100%)','background','linear-gradient(to bottom, #383838 0%,#858585 100%)');
			
	});
	
	
	$("#temaSoft").on("click", function(){
		$('#temaLight').removeAttr('checked');
		$('#temaHard').removeAttr('checked');
		$('.pagina').css('background','-webkit-linear-gradient(top,  #364d4f 0%,#616140 60%,#a17c27 100%)','background','linear-gradient(to bottom,  #364d4f 0%,#616140 60%,#a17c27 100%)');
		
	});
	$("#temaHard").on("click", function(){
		$('#temaSoft').removeAttr('checked');
		$('#temaLight').removeAttr('checked');
		$('.pagina').css('background','-webkit-linear-gradient(top, #245d6b 0%,#2a6c78 100%)','background','linear-gradient(to bottom, #245d6b 0%,#2a6c78 100%)');	
    });


/*ODONTOGRAMA*/

 odontograma = function(){
	var idadePaciente=$('#idadePaciente').html();
	if(idadePaciente<12 || idadePaciente==null || idadePaciente==""){
		$('.odontogramaInfantil').removeClass('hide');
	}else{
		$('.odontogramaAdulto').removeClass('hide');
	}
}

function escolheDente(dente) {
	ultima=conta_foto-1;
    $('.odontogramaInfantil').addClass('hide');
	$('.odontogramaAdulto').addClass('hide');
	aviso('Dente número:  '+dente);
	$('#Dente'+conta_foto+'.numeroDente').html(dente);
	$("#temOdonto"+conta_foto).removeClass('hide'); 
	
	var id=conta_foto;
	numero_dente=$('#Dente'+conta_foto+'.numeroDente').html();
	updateDente(numero_dente, id);
}

function updateDente(numero_dente, id) {
    db.transaction(function (tx) {

        var query = "UPDATE tabelaImagens SET Numero_dente = ? WHERE id = ?";

        tx.executeSql(query, [numero_dente, id], function(tx, res) {
           // alert("insertId: " + res.insertId);
           // alert("rowsAffected: " + res.rowsAffected);
        },
        function(tx, error) {
           aviso('UPDATE error: ' + error.message);
        });
    }, function(error) {
       aviso('transaction error: ' + error.message);
    }, function() {
       // aviso('ok');
    });
}
var odontogramaEditar = function(){

	var idadePaciente=$('#idadePaciente').html();
	if(idadePaciente<12 || idadePaciente==null || idadePaciente==""){
		$('.odontogramaInfantilEditar').removeClass('hide');
	}else{
		$('.odontogramaAdultoEditar').removeClass('hide');
	}
}
function escolheDenteEditar(dente) {
	$('.denteColecao').append(dente+" ")
	$('#conta_Dente').html(dente);
	//$("#temOdonto"+conta_foto).removeClass('hide'); 
	
	id_captura=$('#fotosCapturadasTela').html();
	numero_dente=$('.denteColecao').html();
	//updateDente(numero_dente, id_captura);
	//alert(numero_dente)
}
function fecharOdontoEditar(){
	nome_paciente=$('.paciente_nome').html();
	 $('.odontogramaInfantilEditar').addClass('hide');
     $('.odontogramaAdultoEditar').addClass('hide');
	 id=$('#idImagemEditar').val();
	 id_captura=$('#fotosCapturadasTela').html();
	
	numero_dente=$('.denteColecao').html();
	updateDenteEditar(numero_dente,id_captura, id);
}
function updateDenteEditar(numero_dente, id_captura, id) {
	
	dataString='numero_dente='+numero_dente+'&id_captura='+id_captura;
	$.ajax({
			url: servidor+"updateDente.php",
			type: "GET",
            data: dataString,
			//dataType:"json",
            success: function(data){
				
		   		aviso("Marcação realizada\n Imagem com a numeração "+numero_dente);
				$('.denteColecao').html('');
			},
			error:function(){aviso("Instabilidade na inetrnet...");}
	})
}



/*BARRAS DE ROLAGEM*/

	
	function listaProntuarioBaixo(){
		$("#listaDeCheckups").animate( { scrollTop: '+=460' }, 600);
	}
	
	function listaProntuarioCima(){
		$("#listaDeCheckups").animate( { scrollTop: '-=460' }, 600);
	}
	function listaRaioxBaixo(){
		$("#telaRaiox").animate( { scrollTop: '+=460' }, 600);
	}
	
	function listaRaioxCima(){
		$("#telaRaiox").animate( { scrollTop: '-=460' }, 600);
	}
	function listaRLaudoBaixo(){
		$("#telaLaudoxX").animate( { scrollTop: '+=460' }, 600);
	}
	
	function listaRLaudoCima(){
		$("#telaLaudoxX").animate( { scrollTop: '-=460' }, 600);
	}
	function lista_pacientes_down(){
		$("#LP").animate( { scrollTop: '+=150' }, 600);
	}
	
	function lista_pacientes_up(){
		$("#LP").animate( { scrollTop: '-=150' }, 600);
	}
	
	
	function lista_fotos_capturadas_down(){
		$("#fotosCapturadasTela").animate( { scrollTop: '+=460' }, 600);
	}
	
	function lista_fotos_capturadas_up(){
		$("#fotosCapturadasTela").animate( { scrollTop: '-=460' }, 600);
	}
	
	
	function lista_enfermidades_down(){
		$("#listaEnfermidadesDefault").animate( { scrollTop: '+=150' }, 600);
	}
	
	function lista_enfermidades_up(){
		$("#listaEnfermidadesDefault").animate( { scrollTop: '-=150' }, 600);
	}
	
	
	function lista_enfermidades_selecionadas_down(){
		$("#enfermidadesSelecionadas").animate( { scrollTop: '+=150' }, 600);
	}
	
	function lista_enfermidades_selecionadas_up(){
		$("#enfermidadesSelecionadas").animate( { scrollTop: '-=150' }, 600);
	}
	
	function verMaisCarrossel(x){
		
		//setTimeout(function(){
		//	aviso('1');
		$('#corpo'+x).children('div.scrollmenu').animate( { scrollLeft: '+=650' }, 600);
		///},100);
		/*
		setTimeout(function(){
			aviso('2')
		$('#corpo'+x).find('div.scrollmenu').animate( { scrollLeft: '+=450' }, 600);
		},5000);
		setTimeout(function(){
		$('#corpo'+x).children([]).css( 'margin-left', '+=450px');aviso('aaa')},10000);
		*/
	}
	function verMenosCarrossel(x){
		$('#corpo'+x).children('div.scrollmenu').animate( { scrollLeft:'-=650' }, 600);
	}
	function verMaisCarrosselcx(x){
		$('#carrossel'+x).children('.scrollmenu').animate( { scrollLeft: '+=560' }, 600);
		
		
	}
	function verMenosCarrosselcx(x){alert(x);
		$('#carrossel'+x).children('div .scrollmenu').animate( { scrollLeft: '-=460' }, 600);
	}
	
	function menosFotosEditar(){
		$('#fotosCapturadas').animate( { scrollLeft: '-=360' }, 500);
	}
	function maisFotosEditar(){
		$('#fotosCapturadas').animate( { scrollLeft: '+=360' }, 500);
	}
var xs=0;
function salvaComparacao(){
	$('#CanvaSComparacao').removeClass('hide');
	 ComparaCanvas  = document.getElementById('CanvaSComparacao');
	 ctxC = ComparaCanvas.getContext("2d");
	 criaToken();
	
	var xcomparada=ComparaCanvas.toDataURL();

		if (confirm('Deseja salvar as imagens no formato comparação?') == true) {
        xvai(xcomparada);
		} 
	
	
}
function xvai(xcomparada){
   carregando();
	//$('#CanvaSComparacao').removeClass('hide');
	xs+=1;

    doenca=$('#doencaFoto'+conta_foto).html();
    	 
    tempo_sessao =$('#sessaoFoto'+conta_foto).html();
    valor_doenca =$('#valorFoto'+conta_foto).html();
   	var num=$('#Dente'+conta_foto+'.numeroDente').html();
	nome_enfermidade='';
	sessoes_tratamento='';
	valor_enfermidade='';
	if(num==null){
		numero_dente='';
	}else{
		numero_dente=num;
	}
	raiox='n';
	
	//GRAVCAO NO PENDRIVE
	var paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ',''); 
	var data = new Date();
	 var dia  = data.getDate();
	  if (dia< 10) {
		  dia  = "0" + dia;
	  }
	 var mes  = data.getMonth() + 1;
	  if (mes < 10) {
		  mes  = "0" + mes;
	  }
	  nome_clinica=$('#nome_clinica').val();
	  var	xcgx=$('#Codigo_Laudo_N').html();
	  var n_m=xcgx.substr(0,4);
	  id_captura=n_m;
		var ano = data.getFullYear();	
		var data_imagem=dia+'-'+mes+'-'+ano;
		idpaciente=$('#idPaciente').html(); 
		var nomeFoto=paciente+'_Comparadas'+xs+'_';
		var folderpath = "file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/ImagensCheckup/"+data_imagem+"/";
		var filepath = 	nomeFoto+data_imagem+"_comparadas_"+xcgx+xs+".png";
		imagem_offline=folderpath+filepath;
		 nome_paciente=$('.paciente_nome').html();
		 nome_dentista=$('.dentista_nome').html();
		 cod_checkup="ck"+paciente+dia+mes+ano;
		 //cod_checkup=$('#codCheckupImagemEditar').val();
		 CodigoSky=$('#CodigoSky').val() ;
		
	     imagem=servidor+"imagens/clinica"+paciente+xcgx+".png";
		
		nomeX="clinica"+paciente+xcgx;
				$.ajax({
				  method: 'POST',
				  url: servidor+'uploadComparadas.php',
				  data: {
					xcomparada: xcomparada,
					nomeX:nomeX
				  },
				  complete: function() {  
						$('#divAvisoEspecial').remove();
						aviso('Imagem comparada salva');
						setTimeout(function(){
							fpageProntuario();
						},1500);
						console.log("LAUDO NO SERVIDOR."); 
					},
					progress: function(evt) {
						if (evt.lengthComputable) {
							var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
							$('#barraAtualiza').css('width', percentual+'%');
							$('#txtperc').html(percentual+'%');
						}
						else {
							$('#barraAtualiza').css('width', '0%');
							$('#txtperc').html('0%');
						}
					},
					progressUpload: function(evt) {
					  if (evt.lengthComputable) {
							var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
							$('#barraAtualiza').css('width', percentual+'%');
							$('#txtperc').html(percentual+'%');
						}
						else {
							$('#barraAtualiza').css('width', '0%');
							$('#txtperc').html('0%');
						}
					}
			  	
			});		
    
		   
		// http://52.67.83.144/php/imagens/clinicaA5CD6Fmarcelo_03-11-2016-editada2.png

   	 // aviso("SKYCAM CLOUD <br> Aguarde a gravação da imagem...");
      
	  
	  dataString='id_captura='+id_captura+'&CodigoSky='+CodigoSky+'&cod_checkup='+cod_checkup+'&nome_dentista='+nome_dentista+'&idpaciente='+idpaciente+'&nome_paciente='+nome_paciente+'&imagem='+imagem+'&imagem_offline='+imagem_offline+'&data_imagem='+data_imagem+'&nome_enfermidade='+nome_enfermidade+'&sessoes_tratamento='+sessoes_tratamento+'&valor_enfermidade='+valor_enfermidade+'&numero_dente='+numero_dente+'&raiox='+raiox+'&nome_clinica='+nome_clinica;
	
		$.ajax({
			url: servidor+"salvaImagemCheckupWEB.php",
			type: "GET",
            data: dataString,
			async:false,
            success: function(data){
				
					$('#CanvaSComparacao').addClass('hide');
									
			},
			error:function(){
				salvaErro("salvaComaparacao");
			}
		});
		    	

	

	
}

	 
/*PAGE EDITAR*/

var _sg=false;
(function($){  

				

	imagem = $("<img/>", { 
			src: fotoSeleciona, 
			width: editor.width,
			height :editor.height,
			
			load: function() { 
				context.drawImage(this, 0, 0);   
			} 	
	}) 
	
	
	funcoes = { 
				cinza: function() { 
						frame_atual='cinzax';
						idCamada='cinzax';
						
						 imgData = context.getImageData(0, 0, editor.width, editor.height);
						 
						 pxData = imgData.data; 
						 length = pxData.length; 
									
									for(var x = 0; x < length; x+=4) { 
									
										var r = pxData[x], 
											g = pxData[x + 1], 
											b = pxData[x + 2], 
											grey = r * .3 + g * .59 + b * .11; 
										pxData[x] = grey; 
										pxData[x + 1] = grey; 
										pxData[x + 2] = grey;                                
									}                        
								
								context.putImageData(imgData, 0, 0); 
								linhas.push(idCamada);    
					},
					
					sepia: function() {
						frame_atual='sepiax';
						idCamada='sepiax';
						ssss = document.getElementById("EditarFoto");
						context = ssss.getContext("2d");
							imgData = context.getImageData(0, 0, ssss.width, ssss.height), 
							pxData = imgData.data, 
							length = pxData.length; 
							
							for(var x = 0; x < length; x+=4) { 
							
								var r = pxData[x], 
									g = pxData[x + 1], 
									b = pxData[x + 2], 
								sepiaR = r * .393 + g * .769 + b * .189, 
								sepiaG = r * .349 + g * .686 + b * .168, 
								sepiaB = r * .272 + g * .534 + b * .131; 
								pxData[x] = sepiaR; 
								pxData[x + 1] = sepiaG; 
								pxData[x + 2] = sepiaB;                              
							} 
										  
							
							context.putImageData(imgData, 0, 0);  
							linhas.push(idCamada);                       
					},
				
				
				apagar: function(){
					$("#voltar").addClass('usando');
					$("#salvar").removeClass('usando');
					$("#circulo").removeClass('usando');
					$("#desenhar").removeClass('usando');
					$("#ponto").removeClass('usando');
					$("#separagrid").removeClass('usando');	
					$("#seta_direita").removeClass('usando');
					$("#mais").removeClass('usando');
					$("#menos").removeClass('usando');
					$("#lupa").removeClass('usando');
					$("#girarL").removeClass('usando');
					$("#riscar").removeClass('usando');
					$("#girarR").removeClass('usando');	
					$("#escrever").removeClass('usando');
					$("#zoom").removeClass('usando');
					$('.mascaraAnteseDepois').remove();	
					$('#skyTexto').addClass('hide');
					$('#divSetas').addClass('hide');
					$('#divApagar').removeClass('hide');
					$('#divCores').addClass('hide');
					$('#divCirculos').addClass('hide');
					apaga=function(ferramenta){
						
						$('#divApagar').addClass('hide');
						
						if(ferramenta=="seta"){
							var setaDir = document.getElementById('SetaDireita0');
							var ctx2 = setaDir.getContext('2d');
							
							var setaDir1 = document.getElementById('SetaDireita1');
							var ctseta1=setaDir1.getContext('2d');
							
							var setaDir2 = document.getElementById('SetaDireita2');
							var ctseta2=setaDir2.getContext('2d');
							
							var setaDir3 = document.getElementById('SetaDireita3');
							var ctseta3=setaDir3.getContext('2d');
							
							var setaDir4 = document.getElementById('SetaDireita4');
							var ctseta4=setaDir4.getContext('2d');
							
							var setaDir5 = document.getElementById('SetaDireita5');
							var ctseta5=setaDir5.getContext('2d');

							ctx2.clearRect(0, 0, setaDir.width, setaDir.height);
							ctseta1.clearRect(0,0,setaDir1.width, setaDir1.height);
							ctseta2.clearRect(0,0,setaDir2.width, setaDir2.height);
							ctseta3.clearRect(0,0,setaDir3.width, setaDir3.height);
							ctseta4.clearRect(0,0,setaDir4.width, setaDir4.height);
							ctseta5.clearRect(0,0,setaDir5.width, setaDir5.height);
				idSeta=0;
	
						}
						if(ferramenta=="ponto"){
							var pon = document.getElementById('canvasPonto0');

							var ctx3 = pon.getContext('2d');
							
							
							pnt1 = document.getElementById('canvasPonto1');
							ctpnt1=pnt1.getContext('2d');
							
							pnt2 = document.getElementById('canvasPonto2');
							ctpnt2=pnt2.getContext('2d');
							
							pnt3 = document.getElementById('canvasPonto3');
							ctpnt3=pnt3.getContext('2d');
							
							pnt4 = document.getElementById('canvasPonto4');
							ctpnt4=pnt4.getContext('2d');
							
							pnt5 = document.getElementById('canvasPonto5');
							ctpnt5=pnt5.getContext('2d');
						idPonto=0;	
							ctx3.clearRect(0,0,pon.width, pon.height);
							ctpnt1.clearRect(0,0,pnt1.width, pnt1.height);
							ctpnt2.clearRect(0,0,pnt2.width, pnt2.height);
							ctpnt3.clearRect(0,0,pnt3.width, pnt3.height);
							ctpnt4.clearRect(0,0,pnt4.width, pnt4.height);
							ctpnt5.clearRect(0,0,pnt5.width, pnt5.height);
						}
						if(ferramenta=="desenho"){
							var editor1 = document.getElementById('canvasDesenho');
							var context = editor1.getContext('2d');
							context.clearRect(0,0,editor1.width, editor1.height);
						}
						if(ferramenta=="texto"){
							var escreverCanvas = document.getElementById('canvasEscrever0');
							var contexto = escreverCanvas.getContext('2d');
							contexto.clearRect(0,0,escreverCanvas.width, escreverCanvas.height);
							
							var escreverCanvas1 = document.getElementById('canvasEscrever1');
							var contexto1 = escreverCanvas1.getContext('2d');
							contexto1.clearRect(0,0,escreverCanvas1.width, escreverCanvas1.height);
							
							var escreverCanvas2 = document.getElementById('canvasEscrever2');
							var contexto2 = escreverCanvas2.getContext('2d');
							contexto2.clearRect(0,0,escreverCanvas2.width, escreverCanvas2.height);
							
							var escreverCanvas3 = document.getElementById('canvasEscrever3');
							var contexto3 = escreverCanvas3.getContext('2d');
							contexto3.clearRect(0,0,escreverCanvas3.width, escreverCanvas3.height);
							
							var escreverCanvas4 = document.getElementById('canvasEscrever4');
							var contexto4 = escreverCanvas4.getContext('2d');
							contexto4.clearRect(0,0,escreverCanvas4.width, escreverCanvas4.height);
							
							var escreverCanvas5 = document.getElementById('canvasEscrever5');
							var contexto5 = escreverCanvas5.getContext('2d');
							contexto5.clearRect(0,0,escreverCanvas5.width, escreverCanvas5.height);
							conta_escrita=0;
						}
						if(ferramenta=="regua"){
							
							 var regua = document.getElementById('canvasRiscar0');
							 var ctregua=regua.getContext('2d');
							 ctregua.clearRect(0,0,regua.width, regua.height);
							 
							 var regua1 = document.getElementById('canvasRiscar1');
							 var ctregua1=regua1.getContext('2d');
							 ctregua1.clearRect(0,0,regua1.width, regua1.height);
							  
							 var regua2 = document.getElementById('canvasRiscar2');
							 var ctregua2=regua2.getContext('2d');
							 ctregua2.clearRect(0,0,regua2.width, regua2.height);
							  
							 var regua3 = document.getElementById('canvasRiscar3');
							 var ctregua3=regua3.getContext('2d');
							 ctregua3.clearRect(0,0,regua3.width, regua3.height);
							  
							 var regua4 = document.getElementById('canvasRiscar4');
							 var ctregua4=regua4.getContext('2d');
							 ctregua4.clearRect(0,0,regua4.width, regua4.height);
							  
							 var regua5 = document.getElementById('canvasRiscar5');
							 var ctregua6=regua6.getContext('2d');
							 ctregua5.clearRect(0,0,regua5.width, regua5.height);
							  
							 var regua6 = document.getElementById('canvasRiscar6');
							 var ctregua6=regua6.getContext('2d');
							 ctregua6.clearRect(0,0,regua6.width, regua6.height);
							 
						}
						
					}
					
					
					  
				},
				cores: function(){
					$("#salvar").removeClass('usando');
					$("#voltar").removeClass('usando');
					$("#circulo").removeClass('usando');
					$("#desenhar").removeClass('usando');
					$("#ponto").removeClass('usando');
					$("#separagrid").removeClass('usando');	
					$("#seta_direita").removeClass('usando');
					$("#mais").removeClass('usando');
					$("#menos").removeClass('usando');
					$("#riscar").removeClass('usando');
					$("#lupa").removeClass('usando');
					$("#girarL").removeClass('usando');
					$("#girarR").removeClass('usando');	
					$("#escrever").removeClass('usando');
					$("#zoom").removeClass('usando');
					$("#cores").addClass('usando');
					$('#skyTexto').addClass('hide');	
					$('#divSetas').addClass('hide');
					$('#divCirculos').addClass('hide');
					$('#divApagar').addClass('hide');
					$('#divCores').removeClass('hide');
				    cor=function(cc, tipocor){
						cor_da_linha=cc;
						xcor=tipocor;
						context.strokeStyle = cor_da_linha;
						//$('#divCores').toggleClass('hide');
						$("#cores").removeClass('usando');
						$('#divCores').addClass('hide');
					}
					
				},
				
				seta_direita: function(){
					
					if(idSeta>5){
						aviso('Limite de setas atinigido');
						
						return true;
								
					}
					frame_atual='set';
					idCamada='SetaDireita'+idSeta;
					$('#canvasPonto0').css('z-index','1').removeClass('atividade');
					$('#canvasPonto1').css('z-index','1').removeClass('atividade');
					$('#canvasPonto2').css('z-index','1').removeClass('atividade');
					$('#canvasPonto3').css('z-index','1').removeClass('atividade');
					$('#canvasPonto4').css('z-index','1').removeClass('atividade');
					$('#canvasPonto5').css('z-index','1').removeClass('atividade');
					$('#canvasTexto').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar0').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar1').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar2').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar3').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar4').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar5').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar6').css('z-index','1').removeClass('atividade');
					$('#canvasDesenho').css('z-index','1').removeClass('atividade');
					$('#SetaEsquerda').css('z-index','1').removeClass('atividade');
					$('#'+idCamada).css('z-index','2').addClass('atividade');
					$('#canvasEscrever0').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever1').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever2').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever3').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever4').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever5').css('z-index','1').removeClass('atividade');
					$('#SalvarImagem').css('z-index','1').removeClass('atividade');
					$('#EditarFoto').css('z-index','0');
					$("#zoom").removeClass('usando');
					$("#salvar").removeClass('usando');
					$("#voltar").removeClass('usando');
					$("#circulo").removeClass('usando');
					$("#desenhar").removeClass('usando');
					$("#riscar").removeClass('usando');
					$("#ponto").removeClass('usando');
					$("#cores").removeClass('usando');
					$("#separagrid").removeClass('usando');	
					$("#seta_direita").addClass('usando');
					$("#mais").removeClass('usando');
					$("#menos").removeClass('usando');
					$("#lupa").removeClass('usando');
					$("#girarL").removeClass('usando');
					$("#girarR").removeClass('usando');	
					$("#escrever").removeClass('usando');
					$('.mascaraAnteseDepois').remove();	
					$('#skyTexto').addClass('hide');	
					$('#divApagar').addClass('hide');
					$('#divCirculos').addClass('hide');
					$('#divCores').removeClass('hide');
					$('#divSetas').removeClass('hide');
					cor=function(cc, tipocor){
						
						cor_da_linha=cc;
						xcor=tipocor;
						context.strokeStyle = cor_da_linha;
						//$('#divCores').toggleClass('hide');
						$("#cores").removeClass('usando');
						$('#divCores').addClass('hide');
					}
					
					var setaDir = document.getElementById(idCamada);
					seta=function(im){
						seta_img=im+xcor+'.png';
						img.src = seta_img;
						$('#divSetas').addClass('hide');
					}
				
					var contexto='ctx'+idSeta
					 contexto = setaDir.getContext('2d');
					var mouse = {x:0, y:0};
					var img = new Image();
					img.src = seta_img;// "img/setaesquerda.png";
					 
					
					setaDir.onclick=function(event) {
						
						mouse.x = event.offsetX ? event.offsetX : event.layerX;
						mouse.y = event.offsetY ? event.offsetY : event.layerY;
						contexto.clearRect(0, 0, setaDir.width, setaDir.height);
						contexto.drawImage(img, mouse.x - img.width  / 2,  mouse.y - img.height / 2,img.width, img.height);	
					};
					linhas.push(idCamada);
					idSeta++;
					
				},
				
				separagrid: function(){
					
					frame_atual='grid';
					
					
					idCamada='SetaEsquerda';
					
					
					$('#'+idCamada).css('z-index','2').addClass('atividade');
					$('#canvasPonto'+idPonto).css('z-index','1').removeClass('atividade');
					$('#canvasTexto').css('z-index','1').removeClass('atividade');
					$('#canvasDesenho').css('z-index','1').removeClass('atividade');
					$('#SetaDireita0').css('z-index','1').removeClass('atividade');
					$('#SetaDireita1').css('z-index','1').removeClass('atividade');
					$('#SetaDireita2').css('z-index','1').removeClass('atividade');
					$('#SetaDireita3').css('z-index','1').removeClass('atividade');
					$('#SetaDireita4').css('z-index','1').removeClass('atividade');
					$('#SetaDireita5').css('z-index','1').removeClass('atividade');
					$('#canvasPonto0').css('z-index','1').removeClass('atividade');
					$('#canvasPonto1').css('z-index','1').removeClass('atividade');
					$('#canvasPonto2').css('z-index','1').removeClass('atividade');
					$('#canvasPonto3').css('z-index','1').removeClass('atividade');
					$('#canvasPonto4').css('z-index','1').removeClass('atividade');
					$('#canvasPonto5').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar0').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar1').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar2').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar3').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar4').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar5').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar6').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever0').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever1').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever2').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever3').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever4').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever5').css('z-index','1').removeClass('atividade');
					$('#SalvarImagem').css('z-index','1').removeClass('atividade');
					$('#EditarFoto').css('z-index','0');
					$("#zoom").removeClass('usando');
					$("#salvar").removeClass('usando');
					$("#circulo").removeClass('usando');
					$("#desenhar").removeClass('usando');
					$("#voltar").removeClass('usando');
					$("#cores").removeClass('usando');
					$("#ponto").removeClass('usando');
					$("#separagrid").addClass('usando');	
					$("#riscar").removeClass('usando');
					$("#seta_direita").removeClass('usando');
					$("#mais").removeClass('usando');
					$("#menos").removeClass('usando');
					$('.mascaraAnteseDepois').remove();	
					$("#lupa").removeClass('usando');
					$("#girarL").removeClass('usando');
					$("#girarR").removeClass('usando');	
					$("#escrever").removeClass('usando');
					$('#skyTexto').addClass('hide');	
					$('#divApagar').addClass('hide');
					$('#divCirculos').addClass('hide');
					$('#divCores').addClass('hide');
					$('#divSetas').addClass('hide');
					if(entra==1){
					var grid= document.getElementById(idCamada),
					 cgrid = grid.getContext('2d'),      
						  image = $("<img/>", { 
							  src: gridImg, 
							  load: function() { 
								  cgrid.drawImage(this, 0, 0);//,edicao.width, edicao.height));   
							  } 
					}) 
					
				
					}
					if(entra==2){
						limpaGrid= document.getElementById(idCamada),
					    contextGrid = limpaGrid.getContext('2d'),
						contextGrid.clearRect(0, 0, limpaGrid.width, limpaGrid.height);
						$("#separagrid").removeClass('usando');	
						
					}
					entra++;
					if(entra==3){
						entra=1;
					}
				     
					linhas.push(idCamada);
					
					 
				},
				ponto: function(){
					if(idPonto>5){
						aviso('Limite de círculos atinigido');
						
						return true;
								
					}
					frame_atual='pont';
					idCamada='canvasPonto'+idPonto;
					
					
					$('#'+idCamada).css('z-index','2').addClass('atividade');
					$('#canvasTexto').css('z-index','1').removeClass('atividade');
					$('#canvasDesenho').css('z-index','1').removeClass('atividade');
					$('#SetaDireita0').css('z-index','1').removeClass('atividade');
					$('#SetaDireita1').css('z-index','1').removeClass('atividade');
					$('#SetaDireita2').css('z-index','1').removeClass('atividade');
					$('#SetaDireita3').css('z-index','1').removeClass('atividade');
					$('#SetaDireita4').css('z-index','1').removeClass('atividade');
					$('#SetaDireita5').css('z-index','1').removeClass('atividade');
					$('#SetaEsquerda').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar0').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar1').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar2').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar3').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar4').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar5').css('z-index','1').removeClass('atividade');
					$('#canvasRiscar6').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever0').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever1').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever2').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever3').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever4').css('z-index','1').removeClass('atividade');
					$('#canvasEscrever5').css('z-index','1').removeClass('atividade');
					$('#SalvarImagem').css('z-index','1').removeClass('atividade');
					$('#EditarFoto').css('z-index','0');
					$("#zoom").removeClass('usando');
					$("#salvar").removeClass('usando');
					$("#ponto").addClass('usando');
					$("#cores").removeClass('usando');
					$("#riscar").removeClass('usando');
					$("#circulo").removeClass('usando');
					$("#desenhar").removeClass('usando');
					$("#separagrid").removeClass('usando');	
					$("#seta_direita").removeClass('usando');
					$("#voltar").removeClass('usando');
					$("#mais").removeClass('usando');
					$("#menos").removeClass('usando');
					$('.mascaraAnteseDepois').remove();	
					$("#lupa").removeClass('usando');
					$("#girarL").removeClass('usando');
					$("#girarR").removeClass('usando');	
					$("#escrever").removeClass('usando');
					$('#divApagar').addClass('hide');	
					$('#skyTexto').addClass('hide');	
					$('#divCores').removeClass('hide');
					$('#divCirculos').removeClass('hide');
					cor=function(cc, tipocor){
						cor_da_linha=cc;
						xcor=tipocor;
						context.strokeStyle = cor_da_linha;
						//$('#divCores').toggleClass('hide');
						$("#cores").removeClass('usando');
						$('#divCores').addClass('hide');
					}
					
					pnt=function(im){
						ponto_img=im+xcor+'.png';
						
						img.src = ponto_img;	
						$('#divCirculos').addClass('hide');
						
						
					}
					var pon = document.getElementById(idCamada);
					var pppp='ctx'+idPonto;
					 pppp = pon.getContext('2d');
					var mouse = {x:0, y:0};
					var img = new Image();
					img.src = ponto_img;
					
					
					
					pon.onclick=function(event) {
						mouse.x = event.offsetX ? event.offsetX : event.layerX;
						mouse.y = event.offsetY ? event.offsetY : event.layerY;
						pppp.clearRect(0, 0, pon.width, pon.height);
						pppp.drawImage(img, mouse.x - img.width  / 2,  mouse.y - img.height / 2,img.width, img.height);
						
					};
					linhas.push(idCamada);
					idPonto++;
					
					
					
					
					
					 
							
 						
				},
				
				
				desenhar:function(){

					frame_atual='desen';
					idCamada='canvasDesenho';
							
							$('#'+idCamada).css('z-index','2').addClass('atividade');
							$('#SetaDireita0').css('z-index','1').removeClass('atividade');
							$('#SetaDireita1').css('z-index','1').removeClass('atividade');
							$('#SetaDireita2').css('z-index','1').removeClass('atividade');
							$('#SetaDireita3').css('z-index','1').removeClass('atividade');
							$('#SetaDireita4').css('z-index','1').removeClass('atividade');
							$('#SetaDireita5').css('z-index','1').removeClass('atividade');
							$('#canvasPonto0').css('z-index','1').removeClass('atividade');
							$('#canvasPonto1').css('z-index','1').removeClass('atividade');
							$('#canvasPonto2').css('z-index','1').removeClass('atividade');
							$('#canvasPonto3').css('z-index','1').removeClass('atividade');
							$('#canvasPonto4').css('z-index','1').removeClass('atividade');
							$('#canvasPonto5').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar0').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar1').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar2').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar3').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar4').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar5').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar6').css('z-index','1').removeClass('atividade');
							$('#SetaEsquerda').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever0').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever1').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever2').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever3').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever4').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever5').css('z-index','1').removeClass('atividade');
							$('#canvasTexto').css('z-index','1').removeClass('atividade');
							$('#SalvarImagem').css('z-index','1').removeClass('atividade');
							$('#EditarFoto').css('z-index','0');
							$("#zoom").removeClass('usando');
							$("#salvar").removeClass('usando');
							$("#desenhar").addClass('usando');
							$("#circulo").removeClass('usando');
							$("#riscar").removeClass('usando');
							$("#ponto").removeClass('usando');
							$("#separagrid").removeClass('usando');	
							$("#seta_direita").removeClass('usando');
							$("#mais").removeClass('usando');
							$("#cores").removeClass('usando');
							$("#menos").removeClass('usando');
							$("#voltar").removeClass('usando');
							$('.mascaraAnteseDepois').remove();	
							$("#lupa").removeClass('usando');
							$("#girarL").removeClass('usando');
							$("#girarR").removeClass('usando');	
							$("#escrever").removeClass('usando');	
							$('#skyTexto').addClass('hide');
							$('#divApagar').addClass('hide');
							$('#divCores').removeClass('hide');
							$('#divSetas').addClass('hide');
							$('#divCirculos').addClass('hide');
							cor=function(cc, tipocor){
								
								cor_da_linha=cc;
								xcor=tipocor;
								context.strokeStyle = cor_da_linha;
								//$('#divCores').toggleClass('hide');
								$("#cores").removeClass('usando');
								$('#divCores').addClass('hide');
							}
				            var editor1 = document.getElementById(idCamada);
							var context = editor1.getContext('2d');
							var disableSave = true;
							var pixels = [];
							var cpixels = [];
							var xyLast = {};
							var xyAddLast = {};
							var calculate = false;
							 cor=function(cc, tipocor){
								cor_da_linha=cc;
								xcor=tipocor;
								context.strokeStyle = cor_da_linha;
								$('#divCores').addClass('hide');
								$("#cores").removeClass('usando');
							}
							context.strokeStyle = cor_da_linha;
							context.lineWidth = tamanho_da_linha;
							context.lineCap = "round";
						
							
								function remove_event_listeners() {
									//alert(chave);
									
										editor1.removeEventListener('mousemove', on_mousemove, false);
										editor1.removeEventListener('mouseup', on_mouseup, false);
										editor1.removeEventListener('touchmove', on_mousemove, false);
										editor1.removeEventListener('touchend', on_mouseup, false);
							
										document.body.removeEventListener('mouseup', on_mouseup, false);
										document.body.removeEventListener('touchend', on_mouseup, false);
										
										
										  
									
								}
						
								function get_board_coords(e) {
									var x, y;
						
									if (e.changedTouches && e.changedTouches[0]) {
										var offsety = editor.offsetTop || 0;
										var offsetx = editor.offsetLeft || 0;
						
										x = e.changedTouches[0].pageX - offsetx;
										y = e.changedTouches[0].pageY - offsety;
									} else if (e.layerX || 0 == e.layerX) {
										x = e.layerX;
										y = e.layerY;
									} else if (e.offsetX || 0 == e.offsetX) {
										x = e.offsetX;
										y = e.offsetY;
									}
						
									return {
										x : x,
										y : y
									};
								};
						
								function on_mousedown(e) {
									e.preventDefault();
									e.stopPropagation();
						
									editor1.addEventListener('mousemove', on_mousemove, false);
									editor1.addEventListener('mouseup', on_mouseup, false);
									editor1.addEventListener('touchmove', on_mousemove, false);
									editor1.addEventListener('touchend', on_mouseup, false);
						
									document.body.addEventListener('mouseup', on_mouseup, false);
									document.body.addEventListener('touchend', on_mouseup, false);
						
									empty = false;
									var xy = get_board_coords(e);
									context.beginPath();
									pixels.push('moveStart');
									context.moveTo(xy.x, xy.y);
									pixels.push(xy.x, xy.y);
									xyLast = xy;
									
									
								};
						
								function on_mousemove(e, finish) {
									e.preventDefault();
									e.stopPropagation();
									
									var xy = get_board_coords(e);
									var xyAdd = {
										x : (xyLast.x + xy.x) / 2,
										y : (xyLast.y + xy.y) / 2
									};
						
									if (calculate) {
										var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
										var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
										pixels.push(xLast, yLast);
									} else {
										calculate = true;
									}
						
									context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
									pixels.push(xyAdd.x, xyAdd.y);
									context.stroke();
									context.beginPath();
									context.moveTo(xyAdd.x, xyAdd.y);
									xyAddLast = xyAdd;
									xyLast = xy;
									
									
						
								};
						
								function on_mouseup(e) {
									
									remove_event_listeners();
									disableSave = false;
									context.stroke();
									pixels.push('e');
									calculate = false;
									
									
								};
						
							
							linhas.push(idCamada);
							editor1.addEventListener('mousedown', on_mousedown, false);
							editor1.addEventListener('touchstart', on_mousedown, false);
					
					
 				},  
				
				
				
				desfazer: function(){
					$('#divCores').addClass('hide');
					$('#divSetas').addClass('hide');
					$('#divCirculos').addClass('hide');	
					$('#divApagar').addClass('hide');
					atual=linhas.pop();
					
					if(atual=='canvasEscrever5'){
						conta_escrita=5;
					}
					if(atual=='canvasEscrever4'){
						conta_escrita=4;
					}
					if(atual=='canvasEscrever3'){
						conta_escrita=3;
					}
					if(atual=='canvasEscrever2'){
						conta_escrita=2;
					}
					if(atual=='canvasEscrever1'){
						conta_escrita=1;
					}
					if(atual=='canvasEscrever0'){
						conta_escrita=0;
					}
					if(atual=='canvasPonto5'){
						idPonto=5;
					}
					if(atual=='canvasPonto4'){
						idPonto=4;
					}
					if(atual=='canvasPonto3'){
						idPonto=3;
					}
					if(atual=='canvasPonto2'){
						idPonto=2;
					}
					if(atual=='canvasPonto1'){
						idPonto=1;
					}
					if(atual=='canvasPonto0'){
						idPonto=0;
					}
					if(atual=='SetaDireita5'){
						idSeta=5;
					}
					if(atual=='SetaDireita4'){
						idSeta=4;
					}
					if(atual=='SetaDireita3'){
						idSeta=3;
					}
					if(atual=='SetaDireita2'){
						idSeta=2;
					}
					if(atual=='SetaDireita1'){
						idSeta=1;
					}
					if(atual=='SetaDireita0'){
						idSeta=0;
					}
					if(atual==null || atual=='undefined' ){
						
						aviso('Você não tem mais como voltar');
						
					}
					if(atual=='comparar' || atual=='sepiax' || atual=='cinzax'){
						editor = document.getElementById('EditarFoto');
						cteditor=editor.getContext('2d');
						cteditor.clearRect(0,0, 871, 490);
						cteditor.restore();
						image=new Image();
						image.width=editor.width;
						image.height=editor.height;
						image.src=fotoSeleciona;
						cteditor.restore();
						degrees=0 % 360;
						
						editor.width = 871;
						editor.height = 490;
						
						cteditor.clearRect(0,0,editor.width,editor.height);
						
						cteditor.translate(image.width/2,image.height/2);
					   
						cteditor.rotate(degrees*Math.PI/180);
						cteditor.drawImage(image,-image.width/2,-image.height/2, 871, 490);
					/*	editor = document.getElementById('EditarFoto');
					cteditor=editor.getContext('2d');
						image = $("<img/>", { 
							src: fotoSeleciona, 
							width: editor.width,
							height :editor.height,
							
							load: function() { 
								cteditor.drawImage(this, 0, 0);   
							} 	
						})*/ 
					}
					$('#'+atual).css('z-index','1').addClass('atividade');
					var apaga = document.getElementById(atual);
					var ctx2 = apaga.getContext('2d');
						ctx2.clearRect(0, 0, apaga.width, apaga.height);
						
							
				},
				
				
					
					riscar: function(){
						frame_atual='risc';
						idCamada='canvasRiscar'+idMedida;
							
							$('#'+idCamada).css('z-index','2').addClass('atividade');
							$('#canvasDesenho').css('z-index','1').removeClass('atividade');
							$('#SetaDireita0').css('z-index','1').removeClass('atividade');
							$('#SetaDireita1').css('z-index','1').removeClass('atividade');
							$('#SetaDireita2').css('z-index','1').removeClass('atividade');
							$('#SetaDireita3').css('z-index','1').removeClass('atividade');
							$('#SetaDireita4').css('z-index','1').removeClass('atividade');
							$('#SetaDireita5').css('z-index','1').removeClass('atividade');
							$('#canvasPonto0').css('z-index','1').removeClass('atividade');
							$('#canvasPonto1').css('z-index','1').removeClass('atividade');
							$('#canvasPonto2').css('z-index','1').removeClass('atividade');
							$('#canvasPonto3').css('z-index','1').removeClass('atividade');
							$('#canvasPonto4').css('z-index','1').removeClass('atividade');
							$('#canvasPonto5').css('z-index','1').removeClass('atividade');
							$('#SetaEsquerda').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever0').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever1').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever2').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever3').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever4').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever5').css('z-index','1').removeClass('atividade');
							$('#canvasTexto').css('z-index','1').removeClass('atividade');
							$('#SalvarImagem').css('z-index','1').removeClass('atividade');
							$('#EditarFoto').css('z-index','0');
							$("#zoom").removeClass('usando');
							$("#salvar").removeClass('usando');
							$("#desenhar").removeClass('usando');
							$("#riscar").addClass('usando');
							$("#circulo").removeClass('usando');
							$("#ponto").removeClass('usando');
							$("#separagrid").removeClass('usando');	
							$("#seta_direita").removeClass('usando');
							$("#mais").removeClass('usando');
							$("#cores").removeClass('usando');
							$("#menos").removeClass('usando');
							$("#voltar").removeClass('usando');
							$('.mascaraAnteseDepois').remove();	
							$("#lupa").removeClass('usando');
							$("#girarL").removeClass('usando');
							$("#girarR").removeClass('usando');	
							$("#escrever").removeClass('usando');	
							$('#skyTexto').addClass('hide');
							$('#divApagar').addClass('hide');
							$('#divCores').addClass('hide');
							$('#divSetas').addClass('hide');
							$('#divCirculos').addClass('hide');
							if(idMedida>6){
								//window.plugins.toast.show('Limite atinigido', 'short', 'center', function(a){}, function(b){alert('toast error: ' + b)})
							aviso("Limite  atinigido");
								
								idMedida=0;
								mouse.x=0;
								mouse.y=0;
								return true;
							}
				            var editor1 = document.getElementById(idCamada);
							var context='context'+idMedida
							 context = editor1.getContext('2d');
							var tp=[];
							var ini=[];
							cor=function(cc){
								cor_da_linha=cc;
								context.strokeStyle = cor_da_linha;
								$('#divCores').toggleClass('hide');
								$("#cores").removeClass('usando');
							}
							
							context.strokeStyle = cor_da_linha;
							context.lineWidth = 1.2;
							context.lineCap = "round";
							var fim;
							var inicio;
							var anterior=1;
							var mouse = {x:0, y:0};
							var img = new Image();
							img.src = 'img/baixotriangulo.png';
							
							
							editor1.mousedown=function(event) {
								mouse.x = event.offsetX ? event.offsetX : event.layerX;
								mouse.y = event.offsetY ? event.offsetY : event.layerY;
								context.moveTo(mouse.x,mouse.y);
							    context.stroke();
							};
							editor1.onmousemove=function(event){
								mouse.x = event.offsetX ? event.offsetX : event.layerX;
								mouse.y = event.offsetY ? event.offsetY : event.layerY;
								ini.push(mouse.x,mouse.y)
								inicio=ini.pop();	
							}
							editor1.onmouseup=function(event) {
						
								mouse.x = event.offsetX ? event.offsetX : event.layerX;
								mouse.y = event.offsetY ? event.offsetY : event.layerY;
								tp.push(mouse.x,mouse.y);
								fim=tp.pop();
								
							   
							   		
							   context.drawImage(img, mouse.x - img.width  / 2,  mouse.y - img.height / 2,img.width, img.height);
							   context.lineTo(mouse.x,mouse.y);
							   
							   if(medida==1){
								   
								   context.stroke();
								   context.font = "16pt Arial";
								   context.fillStyle = "#f8f8f8";
								   context.fillText(fim	,mouse.x-12 ,mouse.y+30);
								   
									$("#riscar").removeClass('usando').addClass('animated bounce');
									setTimeout(function(){
										$("#riscar").removeClass('animated bounce');
									},2000);
									
							   }
							   medida++;
							   if(medida>1){
								   	idMedida++;
									anterior=idMedida-1;
									medida=0;
									$('#canvasRiscar'+anterior).css('z-index','1').removeClass('atividade');
									$('#canvasRiscar'+idMedida).css('z-index','2').removeClass('atividade');
										
									return true;
							   }
								
								
							   
							};
							linhas.push(idCamada);
							
							
					},
					
					
				
				
				
				lupa: function(){
					idCamada='comparar';
					
					$("#salvar").removeClass('usando');
					$("#circulo").removeClass('usando');
					$("#desenhar").removeClass('usando');
					$("#ponto").removeClass('usando');
					$("#separagrid").removeClass('usando');	
					$("#seta_direita").removeClass('usando');
					$("#mais").removeClass('usando');
					$("#voltar").removeClass('usando');
					$("#zoom").removeClass('usando');
					$("#cores").removeClass('usando');
					$("#menos").removeClass('usando');
					$("#lupa").addClass('usando');
					$("#girarL").removeClass('usando');
					$("#girarR").removeClass('usando');	
					$("#escrever").removeClass('usando');
					$('#skyTexto').addClass('hide');	
					$('#divCores').addClass('hide');
					$('#divSetas').addClass('hide');
					$('#divCirculos').addClass('hide');
					$('#divApagar').addClass('hide');
					var escolheImagem = $("<div>").addClass('mascaraAnteseDepois animated fadeIn').appendTo("body");    
					monta_compara='<a href="#" onclick="lado_a()" class="btnMascaraLadoa hvr-sweep-to-bottom"><h3 class="text-center">Encaixar imagem nesse lado</h3><br><div class="text-center"><img src="img/mao1.png"/></div></a>'; 
					monta_compara+='<a href="#" onclick="lado_b()" class="btnMascaraLadob hvr-sweep-to-bottom"><h3 class="text-center">Encaixar imagem nesse lado</h3><br><div class="text-center"><img src="img/mao2.png"/></div></a>';   
					$('.mascaraAnteseDepois').append(monta_compara); 
					              
					
					 lado_b =function(){
							//aviso('Arraste a imagem que deseja comparar');
							//window.plugins.toast.show('Arraste a imagem que deseja comparar', 'short', 'center', function(a){}, function(b){alert('toast error: ' + b)})
							$('.mascaraAnteseDepois').remove();	
							$( ".arrasta" ).draggable({
								cursor: "move",
								helper: "clone",
								 drag: function( event, ui ){
									//$( this ).addClass( "imagemComparacao" );
									$( "#EditarFoto" ).addClass( "imagemComparacao" );
										
								 }
							});
							$("#EditarFoto").droppable({
							  accept: '.arrasta',	
							  drop: function( event, ui ) {
								  
								  var ccc = $(ui.draggable);
								  xxx=$(ui.draggable).find('img').attr('src');
								  var imagemPredominante1 = new Image();	
								  imagemPredominante1.src = xxx;
	  								
															
								  imagemPredominante1.onload = function(){
									  var sourceX = 435.5;
										var sourceY = 0;
										var sourceWidth = 435.5;
										var sourceHeight = 490;
										var destWidth = sourceWidth;
										var destHeight = sourceHeight;
										var destX = 435.5;
										var destY = 0;
										context.drawImage(imagemPredominante1,sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);   
									} 	
						  
								  
								  $( "#EditarFoto" ).removeClass( "imagemComparacao" );		
							  }
							});
							
					}//EESCOLHE LADO
					lado_a =function(){
							
							//window.plugins.toast.show('Arraste a imagem que deseja comparar', 'short', 'center', function(a){}, function(b){alert('toast error: ' + b)})
							$('.mascaraAnteseDepois').remove();	
							
							$( ".arrasta" ).draggable({
								cursor: "move",
								helper: "clone",
								 drag: function( event, ui ){
									//$( this ).addClass( "imagemComparacao" );
									$( "#EditarFoto" ).addClass( "imagemComparacao" );
										
								 }
							});
							$("#EditarFoto").droppable({
							  accept: '.arrasta',	
							  drop: function( event, ui ) {
							  
							 
							  var editor = document.getElementById('EditarFoto');
      						  var context = editor.getContext('2d');
      						  var imagemPredominante = new Image();	 
							  var ccc = $(ui.draggable);
							  xxx=$(ui.draggable).find('img').attr('src');
								  
								imagemPredominante.onload = function(){
									    var sourceX = 0;
										var sourceY = 0;
										var sourceWidth = 435.5;
										var sourceHeight = 490;
										var destWidth = sourceWidth;
										var destHeight = sourceHeight;
										var destX = editor.width / 2 - destWidth;
										var destY = 0;
									  context.drawImage(imagemPredominante,sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
									
								  }
								    
								imagemPredominante.src = xxx;	
								   
								 
								  
								
								  $( "#EditarFoto" ).removeClass( "imagemComparacao" );		
							  }
							});
							
					}//EESCOLHE LADO
					linhas.push(idCamada);
					
				},
				
				
						girarL2: function() {
							
							$("#salvar").removeClass('usando'); 
							$("#circulo").removeClass('usando');
							$("#desenhar").removeClass('usando');
							$("#ponto").removeClass('usando');
							$("#zoom").removeClass('usando');
							$("#separagrid").removeClass('usando');	
							$("#seta_direita").removeClass('usando');
							$("#mais").removeClass('usando');
							$("#voltar").removeClass('usando');
							$('.mascaraAnteseDepois').remove();	
							$("#cores").removeClass('usando');
							$("#riscar").removeClass('usando');
							$("#menos").removeClass('usando');
							$("#lupa").removeClass('usando');
							$("#girarL").addClass('usando');
							$("#girarR").removeClass('usando');	
							$("#escrever").removeClass('usando');
							$('#divApagar').addClass('hide');	
							$('#skyTexto').addClass('hide');
							$('#divCores').addClass('hide');
							$('#divSetas').addClass('hide');
							$('#divCirculos').addClass('hide');
								
							angulo+=180;
						/*
							var conf = { 
								x: 0, 
								y: editor.height, 
								r: 90 * Math.PI / 180 
							}; 
							tools.rotate(conf);
							
						*/	 $('#EditarFoto').toggleClass('girado');
							//$('#EditarFoto').css({transform: 'rotate(' + angulo + 'deg)'});
							/*
							$('#canvasTexto').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasDesenho').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita0').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita1').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita2').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita3').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita4').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita5').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto0').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto1').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto2').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto3').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto4').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto5').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar0').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar1').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar2').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar3').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar4').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar5').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar6').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaEsquerda').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaEsquerda').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasEscrever').css({transform: 'rotate(' + angulo + 'deg)'});
							*/
							
						}, 
						girarR: function() {
							$("#salvar").removeClass('usando');
							$("#circulo").removeClass('usando');
							$("#desenhar").removeClass('usando');
							$("#ponto").removeClass('usando');
							$("#riscar").removeClass('usando');
							$("#separagrid").removeClass('usando');	
							$("#seta_direita").removeClass('usando');
							$("#mais").removeClass('usando');
							$("#voltar").removeClass('usando');
							$("#cores").removeClass('usando');
							$('.mascaraAnteseDepois').remove();	
							$("#menos").removeClass('usando');
							$("#lupa").removeClass('usando');
							$("#girarL").removeClass('usando');
							$("#girarR").addClass('usando');	
							$("#escrever").removeClass('usando');
							$('#divApagar').addClass('hide');
							$('#skyTexto').addClass('hide');
							$('#divCores').addClass('hide');
							$('#divSetas').addClass('hide');
							$('#divCirculos').addClass('hide');	

							angulo-=180; 
								/*
									var conf = { 
										x: editor.width, 
										y: 0, 
										r: -90 * Math.PI / 180 
									}; 
									tools.rotate(conf); 
								*/	
							$('#EditarFoto').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasTexto').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasDesenho').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita0').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita1').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita2').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita3').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita4').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaDireita5').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto0').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto1').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto2').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto3').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto4').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasPonto5').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar0').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar1').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar2').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar3').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar4').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar5').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasRiscar6').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaEsquerda').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#SetaEsquerda').css({transform: 'rotate(' + angulo + 'deg)'});
							$('#canvasEscrever').css({transform: 'rotate(' + angulo + 'deg)'});
									
						},
					
						escrever: function(){
							if(conta_escrita==0){
								alert("1)Selecione a cor do texto;\n2) Digite o texto no campo;\n3) Pressione a tecla enter;\n4) Ajuste o texto digitado clicando na tela até encontrar a posição adequada.");
							}
							frame_atual='escrev';
							idCamada='canvasEscrever'+conta_escrita;
							
							$('#'+idCamada).css('z-index','2').addClass('atividade');	 
							$('#SetaDireita0').css('z-index','1').removeClass('atividade');
							$('#SetaDireita1').css('z-index','1').removeClass('atividade');
							$('#SetaDireita2').css('z-index','1').removeClass('atividade');
							$('#SetaDireita3').css('z-index','1').removeClass('atividade');
							$('#SetaDireita4').css('z-index','1').removeClass('atividade');
							$('#SetaDireita5').css('z-index','1').removeClass('atividade');
							$('#canvasPonto0').css('z-index','1').removeClass('atividade');
							$('#canvasPonto1').css('z-index','1').removeClass('atividade');
							$('#canvasPonto2').css('z-index','1').removeClass('atividade');
							$('#canvasPonto3').css('z-index','1').removeClass('atividade');
							$('#canvasPonto4').css('z-index','1').removeClass('atividade');
							$('#canvasPonto5').css('z-index','1').removeClass('atividade');
							$('#canvasTexto').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar0').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar1').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar2').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar3').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar4').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar5').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar6').css('z-index','1').removeClass('atividade');
							$('#canvasDesenho').css('z-index','1').removeClass('atividade');
							$('#SetaEsquerda').css('z-index','1').removeClass('atividade');
							
							$('#SalvarImagem').css('z-index','1').removeClass('atividade');
							$("#salvar").removeClass('usando');
							$('#EditarFoto').css('z-index','0');
							$("#zoom").removeClass('usando');
							$("#circulo").removeClass('usando');
							$("#desenhar").removeClass('usando');
							$("#ponto").removeClass('usando');
							$("#voltar").removeClass('usando');
							$("#separagrid").removeClass('usando');	
							$("#seta_direita").removeClass('usando');
							$('.mascaraAnteseDepois').remove();	
							$("#mais").removeClass('usando');
							$("#cores").removeClass('usando');
							$("#menos").removeClass('usando');
							$("#lupa").removeClass('usando');
							$("#girarL").removeClass('usando');
							$("#riscar").removeClass('usando');
							$("#girarR").removeClass('usando');	
							$("#escrever").addClass('usando');
							$('#divCores').removeClass('hide');
							$('#divApagar').addClass('hide');
							$('#divSetas').addClass('hide');
							$('#divCirculos').addClass('hide');
							 cor=function(cc, tipocor){
								cor_da_linha=cc;
								xcor=tipocor;
								context.strokeStyle = cor_da_linha;
								//$('#divCores').toggleClass('hide');
								$("#cores").removeClass('usando');
								$('#divCores').addClass('hide');
							}
							var escreverCanvas = document.getElementById(idCamada);
							var contextoEscrever='contexto'+conta_escrita
							 contextoEscrever = escreverCanvas.getContext('2d');
							
							var coords = $(escreverCanvas).offset();
							var vvv = document.getElementById("skyTexto").value;	
							var mouse = {x:0, y:0};
							var texto_escrito='';
							var img = new Image();
							//img.src = seta_img;// "img/setaesquerda.png";
							$('#skyTexto').removeClass('hide').val('').focus();		
							if(conta_escrita>5){
								//aviso('Limite de texto atinigido');
								//window.plugins.toast.show('Limite de texto atinigido', 'short', 'center', function(a){}, function(b){alert('toast error: ' + b)})
							aviso("Limite de texto atinigido");
								conta_escrita=0;
								mouse.x=0;
								mouse.y=0;
								return true;
							}		

								escreverCanvas.onclick=function(event) {
										
										mouse.x = event.offsetX ? event.offsetX : event.layerX;
										mouse.y = event.offsetY ? event.offsetY : event.layerY;
										contextoEscrever.clearRect(0, 0, escreverCanvas.width, escreverCanvas.height);
										//contexto.drawImage(img, mouse.x - img.width  / 2,  mouse.y - img.height / 2,img.width, img.height);
										contextoEscrever.font = "20pt Arial";
										contextoEscrever.fillStyle = cor_da_linha;
										contextoEscrever.fillText(texto_escrito, mouse.x, mouse.y);
										
										//aviso('Contador '+conta_escrita+' <br> '+vvv);
								
								}				
								$('#skyTexto').on( "keypress", function(event) {
									
									  if (event.which == 13 && !event.shiftKey) {
										  // mx=coords.left-250;
										  // mt=coords.top+200;
										   vvv = document.getElementById("skyTexto").value;
										   texto_escrito=vvv;
										  // contextoEscrever.font = "22pt Arial";
										  // contextoEscrever.fillStyle = cor_da_linha;
										  // contextoEscrever.fillText(vvv, mx, mt);
										   $(this).addClass('hide');
										    
										     
									  }
								});	
								 
								
								 linhas.push(idCamada);
								 conta_escrita++;
							
							
								 
						},
						zoom: function(){
							
							$('#EditarFoto').css('z-index','4').addClass('usando');
							$('#SetaDireita0').css('z-index','1').removeClass('atividade');
							$('#SetaDireita1').css('z-index','1').removeClass('atividade');
							$('#SetaDireita2').css('z-index','1').removeClass('atividade');
							$('#SetaDireita3').css('z-index','1').removeClass('atividade');
							$('#SetaDireita4').css('z-index','1').removeClass('atividade');
							$('#SetaDireita5').css('z-index','1').removeClass('atividade');
							$('#canvasPonto0').css('z-index','1').removeClass('atividade');
							$('#canvasPonto1').css('z-index','1').removeClass('atividade');
							$('#canvasPonto2').css('z-index','1').removeClass('atividade');
							$('#canvasPonto3').css('z-index','1').removeClass('atividade');
							$('#canvasPonto4').css('z-index','1').removeClass('atividade');
							$('#canvasPonto5').css('z-index','1').removeClass('atividade');
							$('#canvasTexto').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar0').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar1').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar2').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar3').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar4').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar5').css('z-index','1').removeClass('atividade');
							$('#canvasRiscar6').css('z-index','1').removeClass('atividade');
							$('#canvasDesenho').css('z-index','1').removeClass('atividade');
							$('#SetaEsquerda').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever0').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever1').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever2').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever3').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever4').css('z-index','1').removeClass('atividade');
							$('#canvasEscrever5').css('z-index','1').removeClass('atividade');
							$('#SalvarImagem').css('z-index','1').removeClass('atividade');
							$("#salvar").removeClass('usando');
							$("#circulo").removeClass('usando');
							$("#desenhar").removeClass('usando');
							$("#ponto").removeClass('usando');
							$("#voltar").removeClass('usando');
							$("#separagrid").removeClass('usando');	
							$("#seta_direita").removeClass('usando');
							$('.mascaraAnteseDepois').remove();	
							$("#mais").removeClass('usando');
							$("#cores").removeClass('usando');
							$("#menos").removeClass('usando');
							$("#lupa").removeClass('usando');
							$("#girarL").removeClass('usando');
							$("#riscar").removeClass('usando');
							$("#girarR").removeClass('usando');	
							$("#escrever").removeClass('usando');
							$("#zoom").addClass('usando');
							$('#divCores').addClass('hide');
							$('#divApagar').addClass('hide');
							$('#divSetas').addClass('hide');
							$('#divCirculos').addClass('hide');
							editor = document.getElementById("EditarFoto");
							context = editor.getContext("2d");
							zoom = document.getElementById("canvasZoom");
						    zoomCtx = zoom.getContext("2d");
							
						    var img = new Image();
							img.src = fotoSeleciona;
							img.onload=vai;
							
														
							var vai=function(){
									 //alert();
									context.drawImage(img,0,0);
									
								}
							
							editor.addEventListener("mousemove", function(e){
								console.log(e);
								zoomCtx.fillStyle = "white";
								//zoomCtx.clearRect(0,0, zoom.width, zoom.height);
								//zoomCtx.fillStyle = "transparent";
								zoomCtx.fillRect(0,0, zoom.width, zoom.height);
								zoomCtx.drawImage(editor, e.x, e.y, -217.5, -122.5, 0,0, 435.5, 245);
								console.log(zoom.style);
								zoom.style.top = e.pageY + -122.5 + "px"
								zoom.style.left = e.pageX +10 + "px"
								zoom.style.display = "block";
								
							});
							
							editor.addEventListener("mouseout", function(){
								zoom.style.display = "none";								
							});
						},
						
				
				}
				$(".ferramenta_edicao").children().click(function(e) { 
					e.preventDefault(); 
					funcoes[this.id].call(this); 
					
					
					
				});
				
			})(jQuery);
	
function toggleFullScreen(elem) {
   
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
function criaToken(){
	var size = 8;//Gera o prompt que pergunta o tamanho do ID e armazena na variável
		var randomized = Math.ceil(Math.random() * Math.pow(10,size));//Cria um número aleatório do tamanho definido em size.
		var digito = Math.ceil(Math.log(randomized));//Cria o dígito verificador inicial
		while(digito > 10){//Pega o digito inicial e vai refinando até ele ficar menor que dez
			digito = Math.ceil(Math.log(digito));
		}
		var id = randomized ;//Cria a ID + '-' + digito
		$('#Codigo_Laudo_N').html(id);
	
	
	//alert($('#Codigo_Laudo_N').html());
}

function salvarImagem() { 

criaToken();	

$('#SetaDireita0').css('z-index','1').removeClass('atividade');
$('#SetaDireita1').css('z-index','1').removeClass('atividade');
$('#SetaDireita2').css('z-index','1').removeClass('atividade');
$('#SetaDireita3').css('z-index','1').removeClass('atividade');
$('#SetaDireita4').css('z-index','1').removeClass('atividade');
$('#SetaDireita5').css('z-index','1').removeClass('atividade');
$('#canvasPonto0').css('z-index','1').removeClass('atividade');
$('#canvasPonto1').css('z-index','1').removeClass('atividade');
$('#canvasPonto2').css('z-index','1').removeClass('atividade');
$('#canvasPonto3').css('z-index','1').removeClass('atividade');
$('#canvasPonto4').css('z-index','1').removeClass('atividade');
$('#canvasPonto5').css('z-index','1').removeClass('atividade');
$('#canvasTexto').css('z-index','1').removeClass('atividade');
$('#canvasRiscar0').css('z-index','1').removeClass('atividade');
$('#canvasRiscar1').css('z-index','1').removeClass('atividade');
$('#canvasRiscar2').css('z-index','1').removeClass('atividade');
$('#canvasRiscar3').css('z-index','1').removeClass('atividade');
$('#canvasRiscar4').css('z-index','1').removeClass('atividade');
$('#canvasRiscar5').css('z-index','1').removeClass('atividade');
$('#canvasRiscar6').css('z-index','1').removeClass('atividade');
$('#canvasTexto').css('z-index','1').removeClass('atividade');
$('#canvasDesenho').css('z-index','1').removeClass('atividade');
$('#SetaDireita').css('z-index','1').removeClass('atividade');
$('#SetaEsquerda').css('z-index','1').removeClass('atividade');
$('#canvasEscrever0').css('z-index','1').removeClass('atividade');
$('#canvasEscrever1').css('z-index','1').removeClass('atividade');
$('#canvasEscrever2').css('z-index','1').removeClass('atividade');
$('#canvasEscrever3').css('z-index','1').removeClass('atividade');
$('#canvasEscrever4').css('z-index','1').removeClass('atividade');
$('#canvasEscrever5').css('z-index','1').removeClass('atividade');
$('#EditarFoto').css('z-index','0');
$("#zoom").removeClass('usando');
$('#SalvarImagem').css('z-index','2').addClass('atividade').removeClass('hide');
$('.mascaraAnteseDepois').remove();	
$('#skyTexto').addClass('hide');
$('#divCores').addClass('hide');
$('#divSetas').addClass('hide');
$('#divApagar').addClass('hide');
$('#divCirculos').addClass('hide');
$("#circulo").removeClass('usando');
$("#riscar").removeClass('usando');
$("#desenhar").removeClass('usando');
$("#ponto").removeClass('usando');
$("#voltar").removeClass('usando');
$("#separagrid").removeClass('usando');	
$("#seta_direita").removeClass('usando');
$("#mais").removeClass('usando');
$("#menos").removeClass('usando');
$("#lupa").removeClass('usando');
$("#girarL").removeClass('usando');
$("#girarR").removeClass('usando');	
$("#escrever").removeClass('usando');
$("#salvar").addClass('usando');
nome_clinica = $('#nome_clinica').val();
  editor = document.getElementById('EditarFoto');
  setaDir = document.getElementById('SetaDireita0');
  setaDir1 = document.getElementById('SetaDireita1');
  setaDir2 = document.getElementById('SetaDireita2');
  setaDir3 = document.getElementById('SetaDireita3');
  setaDir4 = document.getElementById('SetaDireita4');
  setaDir5 = document.getElementById('SetaDireita5');
  
   regua = document.getElementById('canvasRiscar0');
  regua1 = document.getElementById('canvasRiscar1');
  regua2 = document.getElementById('canvasRiscar2');
  regua3 = document.getElementById('canvasRiscar3');
  regua4 = document.getElementById('canvasRiscar4');
  regua5 = document.getElementById('canvasRiscar5');
  regua6 = document.getElementById('canvasRiscar6');
  
  grid= document.getElementById('SetaEsquerda');
  pnt = document.getElementById('canvasPonto0');
  pnt1 = document.getElementById('canvasPonto1');
  pnt2 = document.getElementById('canvasPonto2');
  pnt3 = document.getElementById('canvasPonto3');
  pnt4 = document.getElementById('canvasPonto4');
  pnt5 = document.getElementById('canvasPonto5');	
  editor1 = document.getElementById('canvasDesenho');
  escreverCanvas0 = document.getElementById('canvasEscrever0');
  escreverCanvas1 = document.getElementById('canvasEscrever1');
  escreverCanvas2 = document.getElementById('canvasEscrever2');
  escreverCanvas3 = document.getElementById('canvasEscrever3');
  escreverCanvas4 = document.getElementById('canvasEscrever4');
  escreverCanvas5 = document.getElementById('canvasEscrever5');
  salvarCanvas = document.getElementById('SalvarImagem');
  contexto = salvarCanvas.getContext('2d');
  coords = $(salvarCanvas).offset();
  
  contexto.drawImage(editor, 0, 0);
  contexto.drawImage(setaDir, 0, 0);
  contexto.drawImage(setaDir1, 0, 0);
  contexto.drawImage(setaDir2, 0, 0);
  contexto.drawImage(setaDir3, 0, 0);
  contexto.drawImage(setaDir4, 0, 0);
  contexto.drawImage(setaDir5, 0, 0);
  contexto.drawImage(regua, 0, 0);
  contexto.drawImage(regua1, 0, 0);
  contexto.drawImage(regua2, 0, 0);
  contexto.drawImage(regua3, 0, 0);
  contexto.drawImage(regua4, 0, 0);
  contexto.drawImage(regua5, 0, 0);
  contexto.drawImage(regua6, 0, 0);
  contexto.drawImage(grid, 0, 0); 
  contexto.drawImage(pnt, 0, 0);
  contexto.drawImage(pnt1, 0, 0);
  contexto.drawImage(pnt2, 0, 0);
  contexto.drawImage(pnt3, 0, 0);
  contexto.drawImage(pnt4, 0, 0);
  contexto.drawImage(pnt5, 0, 0);
  contexto.drawImage(escreverCanvas0, 0, 0);
 contexto.drawImage(escreverCanvas1, 0, 0);
 contexto.drawImage(escreverCanvas2, 0, 0);
 contexto.drawImage(escreverCanvas3, 0, 0);
 contexto.drawImage(escreverCanvas4, 0, 0);
 contexto.drawImage(escreverCanvas5, 0, 0);
  contexto.drawImage(editor1, 0, 0);
  
 idPonto=0;idSeta=0;conta_escrita=0;
  
  mx=coords.left-380;
  mt=coords.top+420;
  
  contexto.font = "12pt Arial";
  contexto.fillStyle = "#f8f8f8";
  contexto.fillText(nome_clinica, mx, mt);
 
 // contexto.drawImage(imagem, 0, 0);
  contexto.drawImage(salvarCanvas, 0, 0);
  
  $("#salvar").removeClass('usando');	
 geraidEditado();
	  
	   
  var  simagem=salvarCanvas.toDataURL();
 
 
  
 
 	
 
    		
	   if (confirm('Deseja salvar a imagem selecionada?') == true) {
        salvarImgEditada(simagem);
		} 
  	
	  
	  function salvarImgEditada(simagem){
		$("#salvar").removeClass('usando');
		editadaProPendriveCaraio(simagem);	
		
						
	  };
	  
	  
}


function geraidEditado(){
		var tamanho = 11;
		var maluco = Math.ceil(Math.random() * Math.pow(10,tamanho));//Cria um número aleatório do tamanho definido em tamanho.
		var digito = Math.ceil(Math.log(maluco));//Cria o dígito verificador inicial
		while(digito > 10){//Pega o digito inicial e vai refinando até ele ficar menor que dez
			digito = Math.ceil(Math.log(digito));
		}
		var ideditada_cadastro = maluco;//Cria a ID
		$('#geradorIdEditado').val(ideditada_cadastro);
}	
	
	

//var ImagemCaminho="file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/ImagensCheckup/"+data_imagem+"/"+nomeFoto+".jpg";
var sequen=0;
function editadaProPendriveCaraio(simagem){
	carregando();
	sequen+=1;		
    doenca=$('#doencaFoto'+conta_foto).html();
   //quantidade de sessoes para a doenca
    tempo_sessao =$('#sessaoFoto'+conta_foto).html();
   //valor para a doenca
    valor_doenca =$('#valorFoto'+conta_foto).html();
   	var num=$('#Dente'+conta_foto+'.numeroDente').html();
	nome_enfermidade='';
	sessoes_tratamento='';
	valor_enfermidade='';
	if(num==null){
		numero_dente='';
	}else{
		numero_dente=num;
	}
	raiox='n';
	
	//GRAVCAO NO PENDRIVE
	var paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ',''); 
	var data = new Date();
	 var dia  = data.getDate();
	  if (dia< 10) {
		  dia  = "0" + dia;
	  }
	 var mes  = data.getMonth() + 1;
	  if (mes < 10) {
		  mes  = "0" + mes;
	  }
	  
		var ano = data.getFullYear();	
		var data_imagem=dia+'-'+mes+'-'+ano;
		var tic=$('#Codigo_Laudo_N').html();
		var ticCdg=tic.substr(0,4);
		idpaciente=$('#idPaciente').html(); 
		var nomeFoto=paciente+'-Editada'+sequen+'-';
		var folderpath = "file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/ImagensCheckup/"+data_imagem+"/";
		var filepath = 	nomeFoto+data_imagem+"_"+sequen+tic+".png";
		imagem_offline=folderpath+filepath;
		 nome_paciente=$('.paciente_nome').html();
		 nome_dentista=$('.dentista_nome').html();
		 cod_checkup="ck"+paciente+dia+mes+ano;
		 id_captura=$('#geradorIdEditado').val();
		 CodigoSky=$('#CodigoSky').val() ;
		 nome="clinica"+CodigoSky+paciente+"_"+dia+"-"+mes+"-"+ano+"-editada-"+tic;
	     imagem=servidor+"imagens/clinica"+CodigoSky+paciente+"_"+dia+"-"+mes+"-"+ano+"-editada-"+tic+".png";
		 var photo = simagem;                
			$.ajax({
			  method: 'POST',
			  url: servidor+'uploadEditada.php',
			  data: {
				photo: photo,
				nome:nome
			  },
			  complete: function() {  
					$('#divAvisoEspecial').remove();
					aviso('Imagem editada salva');
					//limpa_MONTA();
					zeraCanvas();
					if($('#EditarFoto').hasClass('girado')){
						$('#EditarFoto').removeClass('girado');
					}
					//console.log("LAUDO NO SERVIDOR."); 
				},
				progress: function(evt) {
					if (evt.lengthComputable) {
						var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
						$('#barraAtualiza').css('width', percentual+'%');
						$('#txtperc').html(percentual+'%');
					}
					else {
						$('#barraAtualiza').css('width', '0%');
						$('#txtperc').html('0%');
					}
				},
				progressUpload: function(evt) {
				  if (evt.lengthComputable) {
						var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
						$('#barraAtualiza').css('width', percentual+'%');
						$('#txtperc').html(percentual+'%');
					}
					else {
						$('#barraAtualiza').css('width', '0%');
						$('#txtperc').html('0%');
					}
				}
			});
		// http://52.67.83.144/php/imagens/clinicaA5CD6Fmarcelo_03-11-2016-editada2.png

   	  //aviso("SKYCAM CLOUD <br> Aguarde a gravação da imagem...");
      
	  
	  dataString='id_captura='+id_captura+'&CodigoSky='+CodigoSky+'&cod_checkup='+cod_checkup+'&nome_dentista='+nome_dentista+'&idpaciente='+idpaciente+'&nome_paciente='+nome_paciente+'&imagem='+imagem+'&imagem_offline='+imagem_offline+'&data_imagem='+data_imagem+'&nome_enfermidade='+nome_enfermidade+'&sessoes_tratamento='+sessoes_tratamento+'&valor_enfermidade='+valor_enfermidade+'&numero_dente='+numero_dente+'&raiox='+raiox+'&nome_clinica='+nome_clinica;
	 
	
		$.ajax({
			url: servidor+"salvaImagemCheckupWEB.php",
			type: "GET",
            data: dataString,
			async:false,
            success: function(data){
				//zeraCanvas();
				
				
			},
			error:function(){
				salvaErro("salvaImagemCheckup  editadaProPendriveCaraio");
			}
		});
			
		
	}
	





 
function zeraCanvas(){
	
	//$('#SalvarImagem').css('z-index','1').removeClass('atividade').addClass('hide');
	$('#SalvarImagem').css('z-index','1').removeClass('atividade').addClass('hide');
	
	
	
	setaDir = document.getElementById('SetaDireita0');
	ctseta=setaDir.getContext('2d');
	
	setaDir1 = document.getElementById('SetaDireita1');
	ctseta1=setaDir1.getContext('2d');
	
	setaDir2 = document.getElementById('SetaDireita2');
	ctseta2=setaDir2.getContext('2d');
	
	setaDir3 = document.getElementById('SetaDireita3');
	ctseta3=setaDir3.getContext('2d');
	
	setaDir4 = document.getElementById('SetaDireita4');
	ctseta4=setaDir4.getContext('2d');
	
	setaDir5 = document.getElementById('SetaDireita5');
	ctseta5=setaDir5.getContext('2d');
	
	 regua = document.getElementById('canvasRiscar0');
	 ctregua=regua.getContext('2d');
	 
	  regua1 = document.getElementById('canvasRiscar1');
	  ctregua1=regua1.getContext('2d');
	  
	  regua2 = document.getElementById('canvasRiscar2');
	  ctregua2=regua2.getContext('2d');
	  
	  regua3 = document.getElementById('canvasRiscar3');
	  ctregua3=regua3.getContext('2d');
	  
	  regua4 = document.getElementById('canvasRiscar4');
	  ctregua4=regua4.getContext('2d');
	  
	  regua5 = document.getElementById('canvasRiscar5');
	  ctregua5=regua5.getContext('2d');
	  
	  regua6 = document.getElementById('canvasRiscar6');
	  ctregua6=regua6.getContext('2d');
	
	grid= document.getElementById('SetaEsquerda');
	ctgrid=grid.getContext('2d');
	
	pnt = document.getElementById('canvasPonto0');
	ctpnt=pnt.getContext('2d');
	
	pnt1 = document.getElementById('canvasPonto1');
	ctpnt1=pnt1.getContext('2d');
	
	pnt2 = document.getElementById('canvasPonto2');
	ctpnt2=pnt2.getContext('2d');
	
	pnt3 = document.getElementById('canvasPonto3');
	ctpnt3=pnt3.getContext('2d');
	
	pnt4 = document.getElementById('canvasPonto4');
	ctpnt4=pnt4.getContext('2d');
	
	pnt5 = document.getElementById('canvasPonto5');
	ctpnt5=pnt5.getContext('2d');
	
	editor1 = document.getElementById('canvasDesenho');
	cteditor1=editor1.getContext('2d');
	
	
	
	 escreverCanvas0 = document.getElementById('canvasEscrever0');
	 contexto0 = escreverCanvas0.getContext('2d');
	
	
	 escreverCanvas1 = document.getElementById('canvasEscrever1');
	 contexto1 = escreverCanvas1.getContext('2d');
	
	
	 escreverCanvas2 = document.getElementById('canvasEscrever2');
	 contexto2 = escreverCanvas2.getContext('2d');
	
	
	 escreverCanvas3 = document.getElementById('canvasEscrever3');
	 contexto3 = escreverCanvas3.getContext('2d');
	
	
	 escreverCanvas4 = document.getElementById('canvasEscrever4');
	 contexto4 = escreverCanvas4.getContext('2d');
	
	
	 escreverCanvas5 = document.getElementById('canvasEscrever5');
	 contexto5 = escreverCanvas5.getContext('2d');
	 
	
	
	//var apagarTELA = document.getElementById('SalvarImagem');
	//var contextoTELA = apagarTELA.getContext('2d');
	//contextoTELA.clearRect(0, 0, apagarTELA.width, apagarTELA.height);
	
	var salvarCanvas = document.getElementById('SalvarImagem');
	var contextoSalvarImagem = salvarCanvas.getContext('2d');
	contextoSalvarImagem.clearRect(0, 0, salvarCanvas.width, salvarCanvas.height);
	//cteditor.clearRect(0,0,editor.width, editor.height);
	
	contexto0.clearRect(0,0,escreverCanvas0.width, escreverCanvas0.height);
	contexto1.clearRect(0,0,escreverCanvas1.width, escreverCanvas1.height);
	contexto2.clearRect(0,0,escreverCanvas2.width, escreverCanvas2.height);
	contexto3.clearRect(0,0,escreverCanvas3.width, escreverCanvas3.height);
	contexto4.clearRect(0,0,escreverCanvas4.width, escreverCanvas4.height);
	contexto5.clearRect(0,0,escreverCanvas5.width, escreverCanvas5.height);
	
	ctseta.clearRect(0,0,setaDir.width, setaDir.height);
	ctseta1.clearRect(0,0,setaDir1.width, setaDir1.height);
	ctseta2.clearRect(0,0,setaDir2.width, setaDir2.height);
	ctseta3.clearRect(0,0,setaDir3.width, setaDir3.height);
	ctseta4.clearRect(0,0,setaDir4.width, setaDir4.height);
	ctseta5.clearRect(0,0,setaDir5.width, setaDir5.height);
	
	ctregua.clearRect(0,0,regua.width, regua.height);
	ctregua1.clearRect(0,0,regua1.width, regua1.height);
	ctregua2.clearRect(0,0,regua2.width, regua2.height);
	ctregua3.clearRect(0,0,regua3.width, regua3.height);
	ctregua4.clearRect(0,0,regua4.width, regua4.height);
	ctregua5.clearRect(0,0,regua5.width, regua5.height);
	ctregua6.clearRect(0,0,regua6.width, regua6.height);
	
	//ctescrever.clearRect(0,0,escreverCanvas.width, escreverCanvas.height);
	ctgrid.clearRect(0,0,grid.width, grid.height);
	ctpnt.clearRect(0,0,pnt.width, pnt.height);
	ctpnt1.clearRect(0,0,pnt1.width, pnt1.height);
	ctpnt2.clearRect(0,0,pnt2.width, pnt2.height);
	ctpnt3.clearRect(0,0,pnt3.width, pnt3.height);
	ctpnt4.clearRect(0,0,pnt4.width, pnt4.height);
	ctpnt5.clearRect(0,0,pnt5.width, pnt5.height);
	cteditor1.clearRect(0,0,editor1.width, editor1.height);
	
	
	
	var editorMaster2 = document.getElementById('EditarFoto');
	var	context_opa2=editorMaster2.getContext('2d');
	context_opa2.clearRect(0,0, 871, 490);
	context_opa2.restore();
	var imagemm2=new Image();
	imagemm2.width = 871;
	imagemm2.height = 490;
	
	imagemm2.src='img/telalogo.png';
	
	degrees=0;
	
	editorMaster2.width = 871;
	editorMaster2.height = 490;
    
    context_opa2.clearRect(0,0,editorMaster2.width,editorMaster2.height);
    
	context_opa2.translate(imagemm2.width/2,imagemm2.height/2);
   
    context_opa2.rotate(degrees*Math.PI/180);
    context_opa2.drawImage(imagemm2,-imagemm2.width/2,-imagemm2.height/2);
	
	
}



//ESPECIAL FOTO NA HORA







function onSuccessO(imageURI) {
    console.log("Camera cleanup .")
	 $('#fotoPaciente').attr('src',imageURI).css("-webkit-filter" , "grayscale('100'%)");
	uploadFotoPacienteServidor(imageURI);	
}

function onFailO(message) {
    salvaErro("fotoDoPacientenaMaquina");
}	

//UPLOAD DO ARQUIVO PARA O SERVIDOR
function uploadFotoPacienteServidor(imageURI) {
  $('#progresso').removeClass('hide');

  
   var fileURL = imageURI;
   var uri = encodeURI(servidor+"uploadPacientes.php");
   var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear();  	  
   paciente=$('#nome_paciente').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	   

   $('#caminhoFotoPaciente').html(servidor+"pacientes/"+paciente+dia+mes+ano+".jpg");
   var options = new FileUploadOptions();	
   options.fileKey = "file";
   options.fileName = paciente+dia+mes+ano+".jpg";//fileURL.substr(fileURL.lastIndexOf('/')+1);
   options.mimeType = "image/jpg";
   var headers = {'headerParam':'headerValue'};
   options.headers = headers;
   var ft = new FileTransfer();
   
   ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var percentual = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			$('#xxxxx').css('width', percentual+'%');
		} else {
			$('#xxxxx').css('width', percentual+'%');
		}
	};
   ft.upload(fileURL, uri, onSuccess, onError, options);
   function onSuccess(r) {
	 $('#progresso').addClass('hide');
	 $('#xxxxx').css('width', '0%');
      console.log("Codigo = " + r.responseCode);
      console.log("Resposta = " + r.response);
      console.log("Enviado = " + r.bytesSent);
   }

   function onError(error) {
	  $('#progresso').addClass('hide');
	  salvaErro("Metodo uploadFotoPacienteServidor ::: "+error.code);		
   }
	
}












function cameraDentista() {
	 navigator.camera.getPicture(onSuccessD, onFailD, {
			   quality: 50,
			   allowEdit: true,
               targetWidth: 300,
			   targetHeight: 300,
			   destinationType: Camera.DestinationType.FILE_URI,
			   sourceType: Camera.PictureSourceType.CAMERA,    
     });
}
function onSuccessD(imageURI) {
	$('#fotoCadstroDentista').attr('src',imageURI).css("-webkit-filter" , "grayscale('100'%)");	
	uploadFotoDentistaServidor(imageURI);	
}

function onFailD(message) {
    salvaErro("fotoDoDentistaMaquina");
}	

//UPLOAD DO ARQUIVO PARA O SERVIDOR
function uploadFotoDentistaServidor(imageURI) {
  $('#progresso').removeClass('hide');
   var fileURL = imageURI;
   var uri = encodeURI(servidor+"uploadDentistas.php");
   var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear();  	  
   dentista=$('#nome_dentista').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	   
  
//storage/udisk0/skydb  
   $('#caminhoFotoDentista').html(servidor+"dentistas/"+dentista+".jpg");
   var options = new FileUploadOptions();	
   options.fileKey = "file";
   options.fileName = dentista+".jpg";//fileURL.substr(fileURL.lastIndexOf('/')+1);
   options.mimeType = "image/jpg";
   var headers = {'headerParam':'headerValue'};
   options.headers = headers;
   var ft = new FileTransfer();
   
   ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var percentual = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			$('#xxxxx').css('width', percentual+'%');
			//navigator.notification.activityStart("SKYCAM CLOUD", perc +"% enviado");
		} else {
			$('#xxxxx').css('width', percentual+'%');
		}
	};
   ft.upload(fileURL, uri, onSuccess, onError, options);
   function onSuccess(r) {
	 $('#progresso').addClass('hide');
	 $('#xxxxx').css('width', '0%');
      console.log("Codigo = " + r.responseCode);
      console.log("Resposta = " + r.response);
      console.log("Enviado = " + r.bytesSent);
   }

   function onError(error) {
	  $('#progresso').addClass('hide');
	  salvaErro("Metodo uploadFotoDentistaServidor ::: "+error.code);
			
   }
	
}



function buscarFotoClinica(source) {
      navigator.camera.getPicture(logoClinicaSucesso, falhou, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
}

 function logoClinicaSucesso(imageURI) {
      $('#logo_clinica').attr('src', imageURI);
	  uploadLogoClinica(imageURI);
 }
    
     
function falhou(message) {
       salvaErro("FotoClinicaMaquina");
}
	
function uploadLogoClinica(imageURI) {
   $('#progresso').removeClass('hide');
   var fileURL = imageURI;
   var uri = encodeURI(servidor+"uploadClinica.php");
   var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear();  	  
   nome_clinica=$('#nome_clinica').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	   
   
//storage/udisk0/skydb  
   
   var options = new FileUploadOptions();	
   options.fileKey = "file";
   options.fileName = nome_clinica+"_"+dia+"-"+mes+"-"+ano+".jpg";//fileURL.substr(fileURL.lastIndexOf('/')+1);
   options.mimeType = "image/jpg";
   var headers = {'headerParam':'headerValue'};
   options.headers = headers;
   var ft = new FileTransfer();
   $('#caminhoLogoClinica').html(servidor+"clinica/"+nome_clinica+"_"+dia+"-"+mes+"-"+ano+".jpg");
   ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			$('#xxxxx').css('width', perc+'%');
			//navigator.notification.activityStart("SKYCAM CLOUD", perc +"% enviado");
		} else {
			$('#xxxxx').css('width', perc+'%');
		}
	};
   ft.upload(fileURL, uri, onSuccess, onError, options);
   function onSuccess(r) {
	 $('#progresso').addClass('hide');
	 $('#xxxxx').css('width', '0%');
      console.log("Codigo = " + r.responseCode);
      console.log("Resposta = " + r.response);
      console.log("Enviado = " + r.bytesSent);
	  
   }

   function onError(error) {
	  $('#progresso').addClass('hide');
       salvaErro("Metodo uploadLogoClinica ::: "+error.code);
   }
	
}
	
function apareceBotaoLogoClinica()	{
	$('#btnBuscaLogoClinica').removeClass('animated fadeInRight disabled').addClass('animated wooble');
}

/////IMPORTAR RAIOX
function fecharZoom(){
	$('#imgZoom').attr('src','');
	$('#zoomRaiox').addClass('hide');
	
}
function ver_o_raiox(){
	var r_x=[];
	$(".btn.imagemRaioX.Selecionada").children('img').each(function(){
		 r_x.push($(this).attr('src'));
	});

	if(r_x.length==0){
		aviso('Selecione uma imagem');
		return true;
	}
	if(r_x.length>0 && r_x.length<2){
		$('#imgZoom').attr('src',r_x);
		$('#zoomRaiox').removeClass('hide');
	}
	if(r_x.length>1){
		aviso('Você só pode visualizar uma imagem por vez');
		return true;
	}
}
function enviar_raiox_email(){
	var r_ox=[];
	$(".btn.imagemRaioX.Selecionada").children('img').each(function(){
		 r_ox.push($(this).attr('src'));
	});

	if(r_ox.length==0){
		aviso('Selecione uma imagem');
		return true;
	}
	
	
}

$('body').on('click','.btn.imagemRaioX', function(){
	wdc=$('btn.imagemRaioX img');
	$(this).toggleClass('Selecionada');
	
});

function importarRaiox(source) {
      navigator.camera.getPicture(raioxSucesso, raioxfalhou, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
}

 function raioxSucesso(imageURI) {
   uploadRaioX(imageURI);
   var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear();
      imgRaiox='<div class="col-xs-4"><a href="#" class="btn transparente imagemRaioX"><img src="'+imageURI+'" class="img-responsive"/><h4 class="corbranca text-center">'+dia+'-'+mes+'-'+ano+'</h4></a></div>';
      $('#telaRaiox').prepend(imgRaiox);
	 
	  
 }
    
     
function raioxfalhou(message) {
       salvaErro("importarRaiox");
}
	
function uploadRaioX(imageURI) {
   $('#progresso').removeClass('hide');
   
   
   var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear(); 
    	
   paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	   
   data_raiox=+dia+"-"+mes+"-"+ano;
   CodigoSky=$("#CodigoSky").val();   
    $('#caminhoFotoRaiox').html(servidor+"raioX/"+CodigoSky+paciente+data_raiox+".jpg");
	raiox_online=$('#caminhoFotoRaiox').html();
	raiox_offline = "file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/Raio-X/"+data_raiox+"/";
	nomeRaiox=paciente+data_raiox+".jpg";
	nome_paciente=$('.paciente_nome').html();
	var fileURL = imageURI;
   var uri = encodeURI(servidor+"uploadRaiox.php");	
		 
   var options = new FileUploadOptions();	
   options.fileKey = "file";
   options.fileName = CodigoSky+paciente+data_raiox+".jpg";//fileURL.substr(fileURL.lastIndexOf('/')+1);
   options.mimeType = "image/jpg";
   var headers = {'headerParam':'headerValue'};
   options.headers = headers;
   var ft = new FileTransfer();
  
   ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			$('#xxxxx').css('width', perc+'%');
			//navigator.notification.activityStart("SKYCAM CLOUD", perc +"% enviado");
		} else {
			$('#xxxxx').css('width', perc+'%');
		}
	};
   ft.upload(fileURL, uri, onSuccessxxx, onErrorxxx, options);
   function onSuccessxxx(r) {
	 $('#progresso').addClass('hide');
	 $('#xxxxx').css('width', '0%');
      //console.log("Codigo = " + r.responseCode);
      //console.log("Resposta = " + r.response);
      alert("Enviado =>"+r.responseCode+ "---"+ r.response);
	  
   }

   function onErrorxxx(error) {
	  $('#progresso').addClass('hide');
       salvaErro("Metodo uploadRaiox ::: "+error.code);
   }
	dataString='CodigoSky='+CodigoSky+'&nome_paciente='+nome_paciente+'&data_raiox='+data_raiox+'&raiox_online='+raiox_online+'&raiox_offline='+raiox_offline;	
	
		window.resolveLocalFileSystemURL("file:///storage/emulated/0/Android/data/br.com.skydanielmaster/", function(fileSystem) {
			   fileSystem.getDirectory(paciente, {create: true, exclusive: false},function(dirEntry) {
						dirEntry.getDirectory("Raio-X", {create: true, exclusive: false}, function(diaedicao) {
							diaedicao.getDirectory(data_raiox, {create: true, exclusive: false}, function(diaedicaoY) {
								vamoProPendriveRaioX();
							}, function(error) {
								console.log("Nao criou a pasta");
							});
						}, function(error) {
							console.log("Nao criou a pasta");
						});
			
			   }, function (error) {
				  alert('gravacaoRaioX '+ error.code);
			   });			
		}, function (error) {
		   alert('gravacaoRaioX '+error.code);
		});
		
		function vamoProPendriveRaioX(){
			var fail = function(err) { alert("Insira o pendrive :)"+err) }
				window.resolveLocalFileSystemURI(imageURI, function(file) {
				   window.resolveLocalFileSystemURI("file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/Raio-X/"+data_raiox+"/", function(destination) {
							 file.copyTo(destination, nomeRaiox);
							 //salvarRaioXNoBanco(ImagemCaminho);
							 
				   },fail)
				},fail);
		} 
		
		db.transaction(function(transaction) {
		var executeQuery = "INSERT INTO  Raiox (CodigoSky, Nome_paciente, Data_raiox, Raiox_online,  Raiox_offline) VALUES (?,?,?,?,?)";
			transaction.executeSql(executeQuery, [CodigoSky, nome_paciente, data_raiox, raiox_online,raiox_offline]
			, function(tx, result) {
				
			 $.ajax({
				url: servidor+'salvaRaiox.php',
				type: "GET",
				dataType : 'json',
				data: dataString,
				success: function(data){
					//alert(data.retorno)
				},error:function(){
					salvaErro("salvaRaiox.php");
					
				}
			 });//Termina Ajax 
		 
		
		},
		function(error){
		alert('hum...raiox');
		});
	});
	
   
	
}
var LaudoXseq=0;

//IMPORTAR LAUDO
function importarLaudo(){$("#modalUploadLaudo").modal('show');}
function importarLaudoX(source) {
      navigator.camera.getPicture(laudoSucesso, laudofalhou, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
}

 function laudoSucesso(imageURI) {
	
  $("#listaCheckupHistorico").html('');
   uploadLaudoImportadoX(imageURI);
   var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear();
      imgLaudo='<div class="col-xs-2"><a href="#" class="btn transparente"><p></p><img src="'+imageURI+'" class="img-responsive"/><p class="corbranca text-center">'+dia+'-'+mes+'-'+ano+'  </p></a></div>';
      
	 $("#listaCheckupHistorico").append(imgLaudo);
	  
 }
    
     
function laudofalhou(message) {
       salvaErro("importarRaiox "+message);
}
	
function uploadLaudoImportadoX(imageURI) {
   $('#progresso').removeClass('hide');
   LaudoXseq+=1; 
   
  var paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ',''); 

 var CodigoSky=$('#CodigoSky').val();
var data = new Date();
 var dia  = data.getDate();
	  if (dia< 10) {
		  dia  = "0" + dia;
	  }
var mes  = data.getMonth() + 1;
	  if (mes < 10) {
		  mes  = "0" + mes;
	  }
var ano = data.getFullYear();	

var data_laudo=dia+'-'+mes+'-'+ano;
	window.resolveLocalFileSystemURL("file:///storage/emulated/0/Android/data/br.com.skydanielmaster/", function(fileSystem) {
		   fileSystem.getDirectory(paciente, {create: true, exclusive: false},function(dirEntry) {
					dirEntry.getDirectory("Laudos", {create: true, exclusive: false}, function(data_laudoX) {
						data_laudoX.getDirectory("Laudo-Importado-"+data_laudo+"", {create: true, exclusive: false}, function(data_laudoY) {
							montaRestoLaudoImporta();
						}, function(error) {
							console.log("Nao criou a pasta");
						});
					}, function(error) {
						console.log("Nao criou a pasta");
					});
		
		   }, function (error) {
			  alert('gravacaoImagemLaudo '+ error.code);
		   });			
	}, function (error) {
	   alert('gravacaoImagemLaudo '+error.code);
	});
	
	
	 montaRestoLaudoImporta=function(){	
		
		quant_imagens='imp';
		
		var folderpath = "file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/Laudos/Laudo-"+data_laudo+"/";
		var filename = "paginaLaudo_importado_"+LaudoXseq+".png";
		var codigo_laudo=paciente+"importado"+dia;
		var imagem_laudo=servidor+"laudo/Importado"+paciente+dia+'_'+LaudoXseq+".png";
		var nome_paciente=$('.paciente_nome').html();
		imagem_laudo_offline=folderpath+filename;
		dataString='data_laudo='+data_laudo+'&quant_imagens='+quant_imagens+'&codigo_laudo='+codigo_laudo+'&nome_paciente='+nome_paciente+'&imagem_laudo='+imagem_laudo+'&imagem_laudo_offline='+imagem_laudo_offline+'&CodigoSky='+CodigoSky;
		
			var fail = function(err) { alert("Insira o pendrive :)"+err) }
				window.resolveLocalFileSystemURI(imageURI, function(file) {
				   window.resolveLocalFileSystemURI("file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/Laudos/Laudo-Importado-"+data_laudo+"/", function(destination) {
							 file.moveTo(destination, filename);
							 
							 
				   },fail)
				},fail);
		
		db.transaction(function(transaction) {
				var executeQuery = "INSERT INTO tabelaLaudo (Data_Laudo, Quant_imagens, Codigo_Laudo,  Nome_paciente,  Imagem_laudo,  Imagem_laudo_offline) VALUES (?,?,?,?,?,?)";
				transaction.executeSql(executeQuery, [data_laudo, quant_imagens, codigo_laudo, nome_paciente,imagem_laudo, imagem_laudo_offline]
				, function(tx, result) {
					if(Offline==true){
						
						navigator.notification.activityStop();	
					}else{
							$.ajax({
								url: servidor+"SalvaLaudo.php",
								type: "GET",
								data: dataString,
								async:false,
								//dataType:"json",
								success: function(data){
									aviso('salvo');
									
								},
								error:function(){
									salvaErro("SalvaLaudo.php");
								}
							});
							navigator.notification.activityStop();	
							
							
					}
				  },
				  function(error){
					  navigator.notification.activityStop();	
					  alert('F....----banco laudo' +error);
				  
				  });
			});
	
		
			
   var fileURL = imageURI;
   var uri = encodeURI(servidor+"uploadLaudo.php");
   var data = new Date();
   var dia  = data.getDate();
	if (dia< 10) {
		dia  = "0" + dia;
	}
   var mes  = data.getMonth() + 1;
	if (mes < 10) {
		mes  = "0" + mes;
	}
   var ano = data.getFullYear();  
   	  
   paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	 
   dentista=$('.dentista_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	   
  
  
   var options = new FileUploadOptions();	
   options.fileKey = "file";
   options.fileName = "Importado"+paciente+dia+'_'+LaudoXseq+".png";
   options.mimeType = "image/png";
   var headers = {'headerParam':'headerValue'};
   options.headers = headers;
   var ft = new FileTransfer();
   
   ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			  var percentual = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			  $('#xxxxx').css('width', percentual+'%');
			  
		  } else {
			  $('#xxxxx').css('width', '0%');
			 
		  }
	};
   ft.upload(fileURL, uri, onSuccess, onError, options);
   function onSuccess(r) {
	  
	 $('#progresso').addClass('hide');
	 $('#xxxxx').css('width', '0%');
     
	 /*
	  
	*/
	  
   }

   function onError(error) {
	  aviso('Repita a operação'); 
	  $('#progresso').addClass('hide');
	 
	  salvaErro("Metodo Laudo ImportaUploadServidor "+error.code);
		
   }	
						
		
		
		
	}
}
///FIM DO GRAVAR IMAGEM
 
$(function () {
	var editor=document.getElementById("EditarFoto");
    var context=editor.getContext("2d");
	   
	var image=new Image();
		
    

    $("#girarL").click(function(){ 
		$("#zoom").removeClass('usando');
		$("#salvar").removeClass('usando');
		$("#voltar").removeClass('usando');
		$("#circulo").removeClass('usando');
		$("#desenhar").removeClass('usando');
		$("#riscar").removeClass('usando');
		$("#ponto").removeClass('usando');
		$("#cores").removeClass('usando');
		$("#separagrid").removeClass('usando');	
		$("#seta_direita").removeClass('usando');
		$("#mais").removeClass('usando');
		$("#menos").removeClass('usando');
		$("#lupa").removeClass('usando');
		$("#girarL").addClass('usando');
		$("#girarR").removeClass('usando');	
		$("#escrever").removeClass('usando');
		image.src=$('#_src_imagem').val();
			angleInDegrees+=180 % 360;
			drawRotated(angleInDegrees);
    });

    var drawRotated=function(degrees){
		editor.width = 871;
		editor.height = 490;
		image.width = 871;
		image.height = 490;
		context.clearRect(0,0,871,490);
		context.translate(image.width/2,image.height/2);
		context.rotate(degrees*Math.PI/180);
		context.drawImage(image,-image.width/2,-image.height/2, 871, 490);
	}
$('#conclusaoLaudo').on('keyup',function(e){
	qts=$('#conclusaoLaudo').val();
	if(qts.length==750 || qts.length>750){
		alert("Número máximo de caracteres atingido");
		return true;
	}
})  
$('#outrosExames').on('keyup',function(e){
	qts=$('#outrosExames').val();
	if(qts.length==13 || qts.length>13){
		alert("Número máximo de caracteres atingido");
		return true;
	}
})  

$('#cro_dentista').on('focus',function(e){
	$('#inscricao').val('');
	$('#_CRO_N').html('');
	$('#inscricaoCRO').addClass('hide');
	$('#inscricaoCRO').addClass('hide');
	$('#estadoCRO').removeClass('hide');
	$('#salvaCRO').addClass('hide');
	$('#modalCRO').modal('show');
})
$('.estadoCRO').on('click',function(e){
	var id=$(this).attr('id');
	$('#estadoCRO').addClass('hide');
	$('#categoriaCRO').removeClass('hide');
	$('#_CRO_N').append(id+'-')
})
$('.categoriaCRO').on('click',function(e){
	var id=$(this).attr('id');
	$('#categoriaCRO').addClass('hide');
	$('#inscricaoCRO').removeClass('hide');
	$('#_CRO_N').append(id+'-')
})
$('#inscricao').on('keyup',function(e){
	var bbbbbb=$(this).val()
	if(bbbbbb.length>2){
		$('#salvaCRO').removeClass('hide');
	}
})
$('#BtnsalvaCRO').on('click',function(e){
	num=$('#inscricao').val();
	if(num==""){
		alert('Informe o número de inscrição junto ao CRO');
		return true;
	}
	$('#_CRO_N').append(num);
	totaol_digitos=$('#_CRO_N').html();
	$('#cro_dentista').val(totaol_digitos)
	$('#inscricaoCRO').addClass('hide');
	$('#estadoCRO').removeClass('hide');
	$('#salvaCRO').addClass('hide');
})  
	
$('#end_paciente_pac').on('focus',function(e){
	$('#end_paciente_pac').popover({'placement':'top','content':'ENDEREÇO', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#end_paciente_pac').on('focusout',function(e){
	$('#end_paciente_pac').popover('destroy');
})

$('#nasc_paciente_pac').on('focus',function(e){
	$('#nasc_paciente_pac').popover({'placement':'top','content':'DATA DE NASCIMENTO', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#nasc_paciente_pac').on('focusout',function(e){
	$('#nasc_paciente_pac').popover('destroy');
})

$('#cep_paciente_pac').on('focus',function(e){
	$('#cep_paciente_pac').popover({'placement':'top','content':'CEP', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#cep_paciente_pac').on('focusout',function(e){
	$('#cep_paciente_pac').popover('destroy');
})

$('#cpf_paciente_pac').on('focus',function(e){
	$('#cpf_paciente_pac').popover({'placement':'top','content':'CPF', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#cpf_paciente_pac').on('focusout',function(e){
	$('#cpf_paciente_pac').popover('destroy');
})

$('#rg_paciente_pac').on('focus',function(e){
	$('#rg_paciente_pac').popover({'placement':'top','content':'RG', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#rg_paciente_pac').on('focusout',function(e){
	$('#rg_paciente_pac').popover('destroy');
})
$('#fone_paciente_pac').on('focus',function(e){
	$('#fone_paciente_pac').popover({'placement':'top','content':'FONE FIXO', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#fone_paciente_pac').on('focusout',function(e){
	$('#fone_paciente_pac').popover('destroy');
})
$('#cel_paciente_pac').on('focus',function(e){
	$('#cel_paciente_pac').popover({'placement':'top','content':'CELULAR', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#cel_paciente_pac').on('focusout',function(e){
	$('#cel_paciente_pac').popover('destroy');
})
$('#email_paciente_pac').on('focus',function(e){
	$('#email_paciente_pac').popover({'placement':'top','content':'EMAIL', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#email_paciente_pac').on('focusout',function(e){
	$('#email_paciente_pac').popover('destroy');
})

$('#nome_clinica').on('click',function(e){
	$('#nome_clinica').popover({'placement':'top','content':'Não é permitido a inserção de caracteres especiais!', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#nome_clinica').on('focusout',function(e){
	$('#nome_clinica').popover('destroy');
})

$('#nome_paciente').on('click',function(e){
	$('#nome_paciente').popover({'placement':'top','content':'Não é permitido a inserção de caracteres especiais!', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#nome_paciente').on('focusout',function(e){
	$('#nome_paciente').popover('destroy');
})


$('#nome_dentista').on('click',function(e){
	$('#nome_dentista').popover({'placement':'top','content':'Não é permitido a inserção de caracteres especiais!', 'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'}).popover('show');

})
$('#nome_dentista').on('focusout',function(e){
	$('#nome_dentista').popover('destroy');
})	
	
$("body").bind("ajaxSend", function(e, xhr, settings){
   //enviado
}).bind("ajaxComplete", function(e, xhr, settings){
   //Completo
   $('img').error(function(){
       $(this).attr('src', './img_erro.jpg');
   })
}).bind("ajaxError", function(e, xhr, settings, thrownError){
    
});	
    var maisum=0;
    var form;
	
    $('#file').change(function (event) {
		 criaToken();
		readRaiox(this);
		maisum+=1;
	  carregando(); 
	   var data = new Date();
	   var dia  = data.getDate();
		if (dia< 10) {
			dia  = "0" + dia;
		}
	   var mes  = data.getMonth() + 1;
		if (mes < 10) {
			mes  = "0" + mes;
		}
	   var ano = data.getFullYear(); 
	   var tic=$('#Codigo_Laudo_N').html();	
	   paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	   
	   data_raiox=+dia+"-"+mes+"-"+ano;
	   CodigoSky=$("#CodigoSky").val();   
		$('#caminhoFotoRaiox').html(servidor+"raioX/raioxImportado"+CodigoSky+paciente+maisum+data_raiox+".jpg");
		
		nomeRaiox	=paciente+data_raiox+maisum+tic+".jpg";
		raiox_online  =servidor+"raioX/raioxImportado"+CodigoSky+paciente+data_raiox+maisum+tic+".jpg"
		raiox_offline = "file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/Raio-X/"+data_raiox+"/"+nomeRaiox;
		
		
		
		nome_paciente=$('.paciente_nome').html();
	    xxx=CodigoSky+paciente+data_raiox+maisum+tic;
		dataString='CodigoSky='+CodigoSky+'&nome_paciente='+nome_paciente+'&data_raiox='+data_raiox+'&raiox_online='+raiox_online+'&raiox_offline='+raiox_offline;	
        form = new FormData();
        form.append('file', event.target.files[0]); // para apenas 1 arquivo
		form.append('raioxImportado', xxx);
		
		
		
		
		
		$('#telaRaiox').append('<div class="col-xs-4"><a href="#" class="btn transparente imagemRaioX"><img src="" id="previewRaiox'+maisum+'" class="img-responsive"/><h4 class="corbranca text-center">'+data_raiox+'</h4></a></div> ');
		
		
		
		$.ajax({
            url: servidor+"uploadRaioxWeb.php", // Url do lado server que vai receber o arquivo
            data: form,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
			   	
			   aviso('Imagem enviada');	
			   $('#divAvisoEspecial').remove();
            },
			error:function(){
   				alert('Erro ao fazer o Upload');
  			}
        });
		
		$.ajax({
				url: servidor+'salvaRaiox.php',
				type: "GET",
				dataType : 'json',
				data: dataString,
				success: function(data){
					//alert(data.retorno)
				},error:function(){
					salvaErro("salvaRaioxImportadoWeb.php");
					
				}
			 });//Termina Ajax 
			 
		function readRaiox(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();
		
				reader.onload = function (e) {
					$('#previewRaiox'+maisum).attr('src', e.target.result);
				}
		
				reader.readAsDataURL(input.files[0]);
			}
		}
			 
			 
			 
			 
    });
	
	
	//////////IMPORTAR LAUDOS
	
	var sform;
	$('#fileLaudo').change(function (event) {
	   readURL(this);
	   maisum+=1;
	   
	   
	   carregando(); 
	   
	   var data = new Date();
	   var dia  = data.getDate();
		if (dia< 10) {
			dia  = "0" + dia;
		}
	   var mes  = data.getMonth() + 1;
		if (mes < 10) {
			mes  = "0" + mes;
		}
	   var ano = data.getFullYear(); 
			
	   paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	   
	   data_laudo=+dia+"-"+mes+"-"+ano;
	   quant_imagens='';
	   CodigoSky=$("#CodigoSky").val(); 
	   codigo_laudo=paciente+"importado"+dia;
	   imagem_laudo=servidor+"laudo/laudoImportado"+CodigoSky+paciente+dia+'_'+maisum+".jpg";
	   nome_paciente=$('.paciente_nome').html();
	   imagem_laudo_offline='';
	   nome_paciente=$('.paciente_nome').html();
	   yyy=CodigoSky+paciente+dia+'_'+maisum;
	   $('#telaLaudoxX').append('<div class="col-xs-4"><img src="" id="xupaLaudo'+maisum+'" class="img-responsive"/><h4 class="corbranca text-center">'+data_laudo+'</h4></div> ');
	   sform = new FormData();
       sform.append('file', event.target.files[0]); // para apenas 1 arquivo
	   sform.append('laudoImportado', yyy);	
	   $.ajax({
            url: servidor+"laudoImportado.php", // Url do lado server que vai receber o arquivo
            data: sform,
            processData: false,
            contentType: false,
            type: 'POST',
            complete: function() {  
				$('#divAvisoEspecial').remove();
				aviso('Imagem enviada');
			   	
				console.log("LAUDO NO SERVIDOR."); 
			},
			progress: function(evt) {
				if (evt.lengthComputable) {
					var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
					$('#barraAtualiza').css('width', percentual+'%');
					$('#txtperc').html(percentual+'%');
				}
				else {
					$('#barraAtualiza').css('width', '0%');
					$('#txtperc').html('0%');
				}
			},
			progressUpload: function(evt) {
			  if (evt.lengthComputable) {
					var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
					$('#barraAtualiza').css('width', percentual+'%');
					$('#txtperc').html(percentual+'%');
				}
				else {
					$('#barraAtualiza').css('width', '0%');
					$('#txtperc').html('0%');
				}
			},
			error:function(){
   				alert('Erro ao fazer o Upload');
  			}
        });	
               
         
	   dataStringX='data_laudo='+data_laudo+'&quant_imagens='+quant_imagens+'&codigo_laudo='+codigo_laudo+'&nome_paciente='+nome_paciente+'&imagem_laudo='+imagem_laudo+'&imagem_laudo_offline='+imagem_laudo_offline+'&CodigoSky='+CodigoSky;  
		
		
		
		
		$.ajax({
			url: servidor+'SalvaLaudo.php',
			type: "GET",
			dataType : 'json',
			data: dataStringX,
			success: function(data){
				
			},error:function(){
				salvaErro("SalvaLaudoImportadoWeb.php");
				
			}
		 });//Termina Ajax 
		
				
		
		
		
		function readURL(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();
		
				reader.onload = function (e) {
					$('#xupaLaudo'+maisum).attr('src', e.target.result);
				}
		
				reader.readAsDataURL(input.files[0]);
			}
		}

		
    });
	
	
	
	
	
	//////////IMPORTAR LOGOMARCA
	var cdgsky=$('#CodigoSky').val();
	var clinicaform;
	$('#fileLogoClinica').change(function (event) {
	   readURLClinica(this);
	   
	   
	   
	   carregando(); 
	   var cdgsky=$('#CodigoSky').val();
	   var data = new Date();
	   var dia  = data.getDate();
		if (dia< 10) {
			dia  = "0" + dia;
		}
	   var mes  = data.getMonth() + 1;
		if (mes < 10) {
			mes  = "0" + mes;
		}
	   var ano = data.getFullYear(); 
			
	   nome_clinica=$('#nome_clinica').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','');
	   var loclinica="http://skycamapp.net/php/clinica/clinica"+nome_clinica+"_"+dia+"-"+mes+"-"+ano+".jpg";
	   $('#caminhoLogoClinica').html(loclinica);  
	   $('#caminhoLogoClinicaOffline').html("file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+nome_clinica+"/"+nome_clinica+dia+"-"+mes+"-"+ano+".jpg");       
	   xxxcaminho='logo_clinica='+loclinica+'&cdgsky='+cdgsky; 
	   ccc=nome_clinica+"_"+dia+"-"+mes+"-"+ano;
	   
	   clinicaform = new FormData();
       clinicaform.append('file', event.target.files[0]); // para apenas 1 arquivo
	   clinicaform.append('clinica', ccc);
	   
	   xxxxcccc='logo_clinica='+loclinica+'&cdgsky='+cdgsky;
		
	   	
	   $.ajax({
            url: servidor+"logoClinicaWeb.php", // Url do lado server que vai receber o arquivo
            data: clinicaform,
            processData: false,
            contentType: false,
            type: 'POST',
            complete: function() {  
				$('#divAvisoEspecial').remove();
				aviso('Imagem enviada');
			   	montaServ(xxxxcccc);
				console.log("LAUDO NO SERVIDOR."); 
			},
			progress: function(evt) {
				if (evt.lengthComputable) {
					var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
					$('#barraAtualiza').css('width', percentual+'%');
					$('#txtperc').html(percentual+'%');
				}
				else {
					$('#barraAtualiza').css('width', '0%');
					$('#txtperc').html('0%');
				}
			},
			progressUpload: function(evt) {
			  if (evt.lengthComputable) {
					var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
					$('#barraAtualiza').css('width', percentual+'%');
					$('#txtperc').html(percentual+'%');
				}
				else {
					$('#barraAtualiza').css('width', '0%');
					$('#txtperc').html('0%');
				}
			},
			error:function(){
   				alert('Erro ao fazer o Upload');
  			}
        });	
	
	
	 	
	 
		
		
	
		
		
      montaServ=function(xxxxcccc){
		 
		$.ajax({
			url: servidor+'salvaLogoClinicaWeb.php',
			type: "GET",
			dataType : 'json',
			data: xxxxcccc,
			success: function(data){
				if(data.retorno=="foi"){
				 aviso('Enviada e salva no servidor');	
				 $('#divAvisoEspecial').remove();
				}
			},error:function(){
				salvaErro("salvaLogoClinicaWeb.php");
				
			}
		 });//Termina Ajax
	  }
	   
		
		
		function readURLClinica(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();
		
				reader.onload = function (e) {
					$('#logo_clinica').attr('src', e.target.result);
				}
		
				reader.readAsDataURL(input.files[0]);
			}
		}

		
    });
	
	
	
	
	
	//////////IMPORTAR FOTO DENTISTA
	var cdgsky=$('#CodigoSky').val();
	var dform;
	$('#fileFotoDentista').change(function (event) {
	   readURLDentista(this);
	   
	   
	   
	   carregando(); 
	   
	   var data = new Date();
	   var dia  = data.getDate();
		if (dia< 10) {
			dia  = "0" + dia;
		}
	   var mes  = data.getMonth() + 1;
		if (mes < 10) {
			mes  = "0" + mes;
		}
	   var ano = data.getFullYear(); 
			
	   dentista=$('#nome_dentista').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	   
  
       $('#caminhoFotoDentista').html(servidor+"dentistas/dentistas"+dentista+dia+mes+ano+".jpg");
	   $('#caminhoFotoDentistaOffline').html("file:///storage/emulated/0/Android/data/br.com.skydanielmaster/DR_"+dentista+"/"+dentista+dia+mes+ano+".jpg");
	  
	   ccc=dentista+dia+mes+ano;
	   
	   dform = new FormData();
       dform.append('file', event.target.files[0]); // para apenas 1 arquivo
	   dform.append('dentistas', ccc);
	   
	   
		
	   	
	   $.ajax({
            url: servidor+"fotoDentistaWeb.php", // Url do lado server que vai receber o arquivo
            data: dform,
            processData: false,
            contentType: false,
            type: 'POST',
            complete: function() {  
				$('#divAvisoEspecial').remove();
				aviso('Imagem enviada');
			   	
				console.log("LAUDO NO SERVIDOR."); 
			},
			progress: function(evt) {
				if (evt.lengthComputable) {
					var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
					$('#barraAtualiza').css('width', percentual+'%');
					$('#txtperc').html(percentual+'%');
				}
				else {
					$('#barraAtualiza').css('width', '0%');
					$('#txtperc').html('0%');
				}
			},
			progressUpload: function(evt) {
			  if (evt.lengthComputable) {
					var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
					$('#barraAtualiza').css('width', percentual+'%');
					$('#txtperc').html(percentual+'%');
				}
				else {
					$('#barraAtualiza').css('width', '0%');
					$('#txtperc').html('0%');
				}
			},
			error:function(){
   				alert('Erro ao fazer o Upload');
  			}
        });	
     
		function readURLDentista(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();
		
				reader.onload = function (e) {
					$('#fotoCadstroDentista').attr('src', e.target.result);
				}
		
				reader.readAsDataURL(input.files[0]);
			}
		}

		
    });
	
	
	
	
	
	
	//////////IMPORTAR FOTO PACIENTE
	var cdgsky=$('#CodigoSky').val();
	var pform;
	$('#fileFotoPaciente').change(function (event) {
	   readURLPaciente(this);
	   
	   
	   
	   carregando(); 
	   
	   var data = new Date();
	   var dia  = data.getDate();
		if (dia< 10) {
			dia  = "0" + dia;
		}
	   var mes  = data.getMonth() + 1;
		if (mes < 10) {
			mes  = "0" + mes;
		}
	   var ano = data.getFullYear(); 
			
	   paciente=$('#nome_paciente').val().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	   

   		$('#caminhoFotoPaciente').html(servidor+"pacientes/pacientes"+paciente+dia+mes+ano+".jpg");
	    $('#caminhoFotoPacienteOffline').html("file:///storage/emulated/0/Android/data/br.com.skydanielmaster/"+paciente+"/"+paciente+dia+mes+ano+".jpg");
	  
	   ppp=paciente+dia+mes+ano;
	   
	   pform = new FormData();
       pform.append('file', event.target.files[0]); // para apenas 1 arquivo
	   pform.append('pacientes', ppp);
	   
	   
		
	   	
	   $.ajax({
            url: servidor+"fotoPacienteWeb.php", // Url do lado server que vai receber o arquivo
            data: pform,
            processData: false,
            contentType: false,
            type: 'POST',
            complete: function() {  
				$('#divAvisoEspecial').remove();
				aviso('Imagem enviada');
			   	
				console.log("LAUDO NO SERVIDOR."); 
			},
			progress: function(evt) {
				if (evt.lengthComputable) {
					var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
					$('#barraAtualiza').css('width', percentual+'%');
					$('#txtperc').html(percentual+'%');
				}
				else {
					$('#barraAtualiza').css('width', '0%');
					$('#txtperc').html('0%');
				}
			},
			progressUpload: function(evt) {
			  if (evt.lengthComputable) {
					var percentual= parseInt( (evt.loaded / evt.total * 100), 10);
					$('#barraAtualiza').css('width', percentual+'%');
					$('#txtperc').html(percentual+'%');
				}
				else {
					$('#barraAtualiza').css('width', '0%');
					$('#txtperc').html('0%');
				}
			},
			error:function(){
   				alert('Erro ao fazer o Upload');
  			}
        });	
     
		function readURLPaciente(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();
		
				reader.onload = function (e) {
					$('#fotoPaciente').attr('src', e.target.result);
				}
		
				reader.readAsDataURL(input.files[0]);
			}
		}

		
    });
	
	
	
	
	
	
});
function imprimirAnamnese(){
	aviso('Aguarde...');
		$("#imprimeAnamnese").removeClass('hide');
        
        $("#imprimeAnamnese.printableArea").printThis();
};
function imprimirAnamneseSecretaria(){
	
		$("#imprimeAnamnese").removeClass('hide');
        
        $("#imprimeAnamnese.printableArea").printThis();
};

function imprimirLaudodeFilhodaPuta(){
	aviso('Aguarde...');
		$("#imprimeLaudo").removeClass('hide');
		$("#imprimeLaudo.printableArea").printThis();
       
};
	
function imprimirLaudo2(){
	aviso('Aguarde a impressão...');
	$("#imprimeLaudo2").removeClass('hide');
	$("#imprimeLaudo2.printableArea").printThis();
	
};

function fotografaPacientex(){
	nome_paciente=$('.paciente_nome').html().replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[íì]/g,'i').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u').replace(/[ç]/g,'c').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','');	  
	$('<div class="fotoAviso pt-page-scaleUpCenter"><svg class="scarrega" width="280px" height="280px" viewBox="0 0 52 52"><circle class="path" cx="26px" cy="26px" r="20px" fill="none" stroke-width="4px"></circle></svg><br><br><h3 class="text-center" style="margin-top:-165px;">AGUARDE...</h3></div>').appendTo('body');
	id=$('#idPaciente').html();
	
	dataString='id='+id;
	 $.ajax({
		  url: servidor+'trocaFoto.php',
		  type: "GET",
		  dataType : 'json',
		  data: dataString,
		  success: function(data){
			  	
					
				   var imagem=data.retorno[0].ImagemPaciente;
				   var imagem_offline=data.retorno[0].ImagemPacienteOffline;
				   
					$('#modal_img_paciente').attr('src',data.retorno[0].ImagemPaciente);
					$('.paciente-header').attr('src',data.retorno[0].ImagemPaciente);
					$('.fotoAviso').remove();
//alert(imagem)		
					
					
		  },
		  error:function(){
			  salvaErro("trocaFoto.php");
			  $('.fotoAviso').remove();
			  
		  }
	   });//Termina Ajax 
	
	
}
(function addXhrProgressEvent($) {
    var originalXhr = $.ajaxSettings.xhr;
    $.ajaxSetup({
        xhr: function() {
            var req = originalXhr(), that = this;
            if (req) {
                if (typeof req.addEventListener == "function" && that.progress !== undefined) {
                    req.addEventListener("progress", function(evt) {
                        that.progress(evt);
                    }, false);
                }
                if (typeof req.upload == "object" && that.progressUpload !== undefined) {
                    req.upload.addEventListener("progress", function(evt) {
                        that.progressUpload(evt);
                    }, false);
                }
            }
            return req;
        }
    });
})(jQuery);
/*
var url_atual = window.location.href;
url = url_atual.split("/")
var lp=url[2];
var x_seg='https://skycamapp.net/www/main.html';
	
if(url_atual=='http://skycamapp.net' || 
	url_atual=='http://skycamapp.net/www/main.html' || 
	url_atual=='http://www.skycamapp.net' || 
	url_atual=='http://www.skycamapp.net/www/main.html'){
	window.location.href='https://skycamapp.net/www/main.html';
}
*/
