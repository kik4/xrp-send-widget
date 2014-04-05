xrp_send_widget = new Object();

xrp_send_widget.set = function(setting) {

	var link = document.createElement('link');
	link.href = 'https://rawgithub.com/kikkikkikkik/xrp-send-widget/gh-pages/xrp-send-widget.css';
	link.rel = 'stylesheet';
	link.type = 'text/css';
	var h = document.getElementsByTagName('head')[0];
	h.appendChild(link);

	var currentScript = (function(e) {
		if (e.nodeName.toLowerCase() == 'script')
			return e;
		return arguments.callee(e.lastChild)
	})(document);

	link.onload = function() {
		var wid = document.createElement('div');
		wid.className = 'xrp_send_widget';
		currentScript.parentNode.replaceChild(wid,currentScript);
		var but = document.createElement('a');
		but.className = 'xrp_send_widget_button';
		but.innerHTML = 'Tip XRP';
		but.target = '_blank';
		but.href = "https://ripple.com//send?to=" + setting.to + "&amount=" + setting.amount + "&dt=" + setting.dt;
		but.title = "To:" + setting.to;
		wid.appendChild(but);
		var bal = document.createElement('div');
		bal.className = 'xrp_send_widget_balloon';
		wid.appendChild(bal);

		var host = "wss:s1.ripple.com:443";
		try {
			var socket = new WebSocket(host);

			var message = '{"command": "account_tx","account": "' + setting.to + '","ledger_index_min": -1,"ledger_index_max": -1}';

			socket.onopen = function(openEvent) {
				if (document.getElementById("server_status"))
					document.getElementById("server_status").innerHTML = "Opened";
				socket.send(message);
			};

			socket.onmessage = function(messageEvent) {
				if (document.getElementById("server_status"))
					document.getElementById("server_status").innerHTML = "Messaged";
				var data = eval("(" + messageEvent.data + ")");
				if (data["status"] != "success") {
					socket.send(message);
					return;
				}
				var icount = 0;
				var iamount = 0;
				data["result"]["transactions"].forEach(function(element) {
					if (element["tx"]["DestinationTag"] == setting.dt && element["tx"]["Destination"] == setting.to) {
						icount += 1;
						iamount += parseInt(element["tx"]["Amount"]);
					}
				});
				bal.innerHTML = xrp_send_widget.drops2xrp(iamount) + "XRP / " + icount;
				bal.style.visibility = "visible";
				socket.close();
			};

			socket.onclose = function(closeEvent) {
				if (document.getElementById("server_status"))
					document.getElementById("server_status").innerHTML = "Closed";
			}

			socket.onerror = function(errorEvent) {
				if (document.getElementById("server_status"))
					document.getElementById("server_status").innerHTML = "Error";
			}
		} catch (exception) {
			if (document.getElementById("server_status"))
				document.getElementById("server_status").innerHTML = "Excepted";
		}
	}
}

xrp_send_widget.drops2xrp = function(drops) {
	return drops / 1000000;
}
