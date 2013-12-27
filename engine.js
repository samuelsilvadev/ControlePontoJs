function getTable()
{
	var search = document.getElementsByTagName("tbody");
	return search[0];
}

function iterarTabela()
{
	var tabela = getTable();
	var linhas = tabela.rows;
	var registros = [];
	for(var i =0;i< linhas.length;i++){
		var registro = {};
		registro.data = linhas[i].cells[0].innerText.trim();
		registro.batidas = linhas[i].cells[2].innerText.trim();
		if(!registro.batidas)
			continue;
		var r = calcular(registro.batidas);
		registro.horasTrabalhadas = r.horasT;
		registro.horaSugerida = r.horaSg;
		if(registro.horaSugerida != null)
		{
			linhas[i].cells[6].innerText = "Horas Trabalhadas:"+r.horasT+" Saida sugerida:"+r.horaSg;
		}
		registros.push(registro);
	}
	return registros;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function calcular(batidas)
{
    var retorno = {};
	retorno.horaSg = null;
	if(batidas === null || batidas === "")
	{
		retorno.horasT = "00:00";
		return retorno;
	}
		
	var horas = batidas.split(",");
	var entrada = true;
	var total = 0;
	var ultimaHora = converterParaMinutos(horas[horas.length - 1]);
	for(i=0;i< horas.length ; i++)
	{
		var totalMinutos = converterParaMinutos(horas[i]);
		if(entrada)
			totalMinutos *= -1;
		entrada = !entrada;
		total += totalMinutos;
	}
	
	if(total <= 0)
	{
		retorno.horasT = "00:00";
		return retorno;
	}
	else 
	{
		retorno.horasT = converterParaHoras(total);
		if(total == 540)
		{
			retorno.horaSg = retorno.horasT;
		}
		else
		{
			var diferenca;
			if(total < 540)
			{
				diferenca = 540 - total;
				retorno.horaSg = converterParaHoras(ultimaHora + diferenca);
			} 
			else
			{
				diferenca = total - 540;
				retorno.horaSg = converterParaHoras(ultimaHora - diferenca);
			}
		}
		return retorno;
	}
}
function converterParaMinutos(tempo)
{
	var t = tempo.split(":");
	return parseInt(t[1]) + parseInt(t[0]) * 60;
}
	
function converterParaHoras(tempo)
{
	tempo = parseInt(tempo);
	var min,hs;
	min = tempo % 60;
	tempo -= min;
	hs = tempo / 60;
	return hs+":"+pad(min,2);
}

function testeClick()
{
	console.log("funcionou ??");
}

chrome.contextMenus.create(
{
	"title": "Calcular Horarios", 
	"contexts":["all"],
	"onclick": iterarTabela
});




