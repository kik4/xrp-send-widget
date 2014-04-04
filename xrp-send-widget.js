
  var host = "wss:s1.ripple.com:443";
  try {
    socket = new WebSocket(host);
    socket.onopen = function (openEvent) {
       document.getElementById("serverStatus").innerHTML = 
          'Status: Opened';
 socket.send('{"command": "account_tx","account": "rfSSHTYGrQDZigrvvXyia2j6PCvAZADDD1","ledger_index_min": -1,"ledger_index_max": -1}');
    };

 socket.onerror = function (errorEvent) {
    document.getElementById("serverStatus").innerHTML = 
      'Status: Error';
    };

 socket.onclose = function (closeEvent) {
    document.getElementById("serverStatus").innerHTML = 
      'Status: Closed';
    };

 socket.onmessage = function (messageEvent) {
    document.getElementById("serverStatus").innerHTML = 
      'Status: Messaged';
    var data = eval("("+messageEvent.data+")");
    var icount = 0;
    var iamount = 0;
    data["result"]["transactions"].forEach(function(element){
     if(element["tx"]["DestinationTag"] == 265 && element["tx"]["Destination"] == "rfSSHTYGrQDZigrvvXyia2j6PCvAZADDD1")
     {
      icount += 1;
      iamount += parseInt(element["tx"]["Amount"]);
     }
      });
    document.getElementById("count").innerHTML = icount;
    document.getElementById("amount").innerHTML = drops2xrp(iamount) + "XRP";
    socket.close();
   };

}catch (exception) { if (window.console) console.log(exception); }

function drops2xrp(drops)
{
    return drops / 1000000;
}