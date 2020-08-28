/* 
	* jQuery Centralize
	* Autor: Lucas Peperaio
	* URL: http://projetos.lucaspeperaio.com.br/plugin-jquery-centralize/
	* Versão: 1.0
	* 27/11/2011 
*/
(function($){
	$.fn.centralize = function(param,callback){
		$obj = $(this); //cache this
		
		//clear margin and reajust document height
		$obj.css("position","absolute");
		m = ["top","left","button","right"];
		for(i=0;i<4;i++){
			x = parseInt($obj.css("margin-"+m[i]));
			if(x > 0){
				$obj.css("margin-"+m[i],"0px");
			}
		}
		
		p = {
			doch		:	parseInt($(document).height()),
			largura		:	parseInt($obj.width()),
			altura		:	parseInt($obj.height()),
			ptop		:	parseInt($obj.css("padding-top")),
			pright		:	parseInt($obj.css("padding-right")),
			pbottom		:	parseInt($obj.css("padding-bottom")),
			pleft		:	parseInt($obj.css("padding-left")),
			btop		:	parseInt($obj.css("border-top-width")),
			bright		:	parseInt($obj.css("border-right-width")),
			bbottom		:	parseInt($obj.css("border-bottom-width")),
			bleft		:	parseInt($obj.css("border-left-width"))
		};
		
		largura = (p.largura+p.pleft+p.pright+p.bright+p.bleft)/2;
		altura = p.altura+p.ptop+p.pbottom+p.btop+p.bbottom;
		
		_top = "50%";
		_mtop = "-"+(altura/2)+"px";

		//(outerHeigh()-heightObj)/2 = margin-top
		if(typeof param !== "undefined" && param.align === "document" && p.doch > $(window).height()){
			_top = (p.doch - altura)/2+"px";
			_mtop = "";
		}
		
		$obj.css({
			"position":"absolute",
			"left":"50%",
			"top":_top,
			"margin-top":_mtop,
			"margin-left":"-"+largura+"px"
		});
		
		if(typeof callback == 'function'){callback.call(this);}
		else if(typeof param == "function"){param.call(this);}
	};
})(jQuery);