window.onload = function() {
	onloadfunc();
}
function onloadfunc() {
	var host = "wss:s1.ripple.com:443";
	try {
		socket = new WebSocket(host);

		var tip_xrp_button = document.getElementById("tip_xrp_button");
		var dst_account = tip_xrp_button.dataset.to;
		var def_amount = tip_xrp_button.dataset.amount;
		var dst_tag = tip_xrp_button.dataset.dt;

		tip_xrp_button.href = "https://ripple.com//send?to=" + dst_account + "&amount=" + def_amount + "&dt=" + dst_tag;

		socket.onopen = function(openEvent) {
			document.getElementById("serverStatus").innerHTML = 'Status: Opened';
			socket.send('{"command": "account_tx","account": "' + dst_account + '","ledger_index_min": -1,"ledger_index_max": -1}');
		};

		socket.onerror = function(errorEvent) {
			document.getElementById("serverStatus").innerHTML = 'Status: Error';
		};

		socket.onclose = function(closeEvent) {
			document.getElementById("serverStatus").innerHTML = 'Status: Closed';
		};

		socket.onmessage = function(messageEvent) {
			document.getElementById("serverStatus").innerHTML = 'Status: Messaged';
			var data = eval("(" + messageEvent.data + ")");
			var icount = 0;
			var iamount = 0;
			data["result"]["transactions"].forEach(function(element) {
				if (element["tx"]["DestinationTag"] == dst_tag && element["tx"]["Destination"] == dst_account) {
					icount += 1;
					iamount += parseInt(element["tx"]["Amount"]);
				}
			});
			document.getElementById("count").innerHTML = icount;
			document.getElementById("amount").innerHTML = drops2xrp(iamount) + "XRP";
			document.getElementById("amount_box").innerHTML = drops2xrp(iamount) + "XRP";
			document.getElementById("amount_box").style.visibility = "visible";
			socket.close();
		};

	} catch (exception) {
		if (window.console)
			console.log(exception);
	}
}

function drops2xrp(drops) {
	return drops / 1000000;
}