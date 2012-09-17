var email   = require("emailjs/email");

var mail_server  = email.server.connect({
   user:    "kashjds", 
   password:"kashjds4765", 
   host:    "smtp.gmail.com", 
   ssl:     true
});

var html_message_nou_usuari = "<style>@font-face {font-family: 'Ubuntu';font-style: normal;font-weight: 400;src: local('Ubuntu'), url(http://themes.googleusercontent.com/static/fonts/ubuntu/v4/_xyN3apAT_yRRDeqB3sPRg.woff) format('woff');}</style>"+
			"<table width='540' border='0' align='center' cellpadding='0' cellspacing='0' style=\"font-family: 'Ubuntu','helvetica-neue',Helvetica,Arial,sans-serif;\">"+
				"<tbody>"+
					"<tr>"+
						"<td colspan='3' valign='top' background='http://www.debolets.cat/img/fons_missatge_debolets.jpg' style='padding:130px 30px 0 63px'>"+
							"<font color='#343434'><strong>Les teves dades de compte</strong></font>"+
							"<font size='-1' color='#666666'>"+
								"<p>Entra a l'aplicació de deBolets amb aquestes dades per a poder sincronitzar les caceres o publicar-les.</p>"+
								"<br>"+
								"<font size='-1'>"+
									"<p style='background-color:#EBEBEB; padding: 10px 15px; width: 300px';>"+
										"<b>Nom:</b> David Mayo"+
										"<br>"+
										"<b>Usuari (email):</b> davidmayoz@gmail.com"+
										"<br>"+
										"<b>Password:</b> lakdauiochoancdlcn"+
									"</p>"+
								"</font>"+
								"<br><br>"+
								"<font size='1.5em' color='#343434'>"+
									"<b>L'equip de deBolets.<br><a href='mailto:contact@debolets.cat'>contact@debolets.cat</a></b>"+
								"</font>"+
							"</font>"+
						"</td>"+
						"<td width='1'><img src='http://www.debolets.cat/img/spacer.gif' width='1' height='418'></td>"+
					"</tr>"+
					"<tr>"+
						"<td colspan='4'><img src='http://www.debolets.cat/img/spacer.gif' width='1' height='50'></td>"+
					"</tr>"+
					"<tr>"+
						"<td bgcolor='#EBEBEB' style='padding:0 0 0 10px'>"+
							"<font size='-2' color='#666666'>"+
								"<a href='http://www.debolets.cat' style='text-decoration:none;color:#666666' target='_blank'><strong>deBolets</strong></a>"+
							"</font><br>"+
							"<font size='-2' color='#343434'>"+
								"Powered by <a href='http://www.dariomadrid.cat' style='text-decoration:none;color:#666666' target='_blank'>Metzina</a> | 2012. All rights reserved."+
							"</font>"+
						"</td>"+
						"<td align='right' valign='middle' bgcolor='#EBEBEB'>"+
							"<font size='-2' color='#666666'>"+
								"<strong>Follow us on:&nbsp;</strong>"+
							"</font>"+
						"</td>"+
						"<td align='right' valign='middle' bgcolor='#EBEBEB'>"+
							"<a href='http://twitter.com/fstudio64' target='_blank'>"+
								"<img src='http://www.debolets.cat/img/twitter.png' border='0'>"+
							"</a>"+
							"&nbsp;&nbsp;"+
							"<a href='http://www.facebook.com/pages/Foto-Studio-64/107250222626646' target='_blank'>"+
								"<img src='http://www.debolets.cat/img/facebook.png' border='0' style='padding-right: 5px;padding-top: 5px;'>"+
							"</a>"+
							"<br>"+
						"</td>"+
						"<td>"+
							"<img src='http://www.debolets.cat/img/spacer.gif' width='1' height='44'>"+
						"</td>"+
					"</tr>"+
					"<tr>"+
						"<td width='290'><img src='http://www.debolets.cat/img/spacer.gif' width='1' height='1'></td>"+
						"<td width='148'><img src='http://www.debolets.cat/img/spacer.gif' width='1' height='1'></td>"+
						"<td width='101'><img src='http://www.debolets.cat/img/spacer.gif' width='1' height='1'></td>"+
						"<td width='1'><img src='http://www.debolets.cat/img/spacer.gif' width='1' height='1'></td>"+
					"</tr>"+
				"</tbody>"+
			"</table>";

exports.send_mail_nou_usuari = function(nom,password,email) {
	console.log("[User] Email nou usuari a: "+nom+" <"+email+">");
	
	var message_nou_usuari = {
		text:    "i hope this works", 
		from:    "DeBolets App <no-reply@debolets.cat>", 
		to:      nom+"<"+email+">",
		subject: "Benvingut a deBolets!",
		attachment: 
		[
			{
				data: html_message_nou_usuari,
				alternative:true
			}
   		]
	};
	
	mail_server.send(message_nou_usuari, function(err, message_nou_usuari) { if (err==null) console.log("mail_ok"); else console.log(err); });
}
