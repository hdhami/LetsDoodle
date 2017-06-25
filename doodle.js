(function(WebSocket) {
    
    var data = {};
    var userId;
    var connection = new WebSocket('ws://localhost:'+window.wsServerPort);

    connection.onopen = function() {
        // connection is opened and ready to use
        userId = 'user' + Math.floor((Math.random() * 100));
        data[userId] = [];
        
    };

    connection.onerror = function(error) {        
    };

    connection.onmessage = function(message) {
        //decode json received from server
        var resp;
        try {
            resp = JSON.parse(message.data);
        } catch (e) {
            console.log('invalid json');
            return;
        }
        if (!message) return;
        ctx.beginPath();
        drawOnCanvas(resp);
    }
    connection.onclose = function(message) {
       connection.close();
    }

    var isActive = false;
    var canvas = document.getElementById('letsDoodle');
    /*setting for canvas*/
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    /*event binding on canvas node*/
    canvas.addEventListener('mousedown', startDraw, false);
    canvas.addEventListener('mousemove', draw, false);
    canvas.addEventListener('mouseup', endDraw, false);

    /*mousedown start*/
    function startDraw(e) {
        isActive = true;
    }
    /*mouse down end*/

    /*mouse move start*/

    function draw(e) {
        if (!isActive) return;

        var x = e.offsetX;
        var y = e.offsetY;

        data[userId].push({
            x: x,
            y: y
        });
        
        drawOnCanvas(data);
        // send the data to server
        connection.send(JSON.stringify({
            'userId': userId,
            'userData': data[userId]
        }));
    }


    function drawOnCanvas(usersData) {
        ctx.beginPath();
        for (var key in usersData) {
            var plots = usersData[key];
            ctx.moveTo(plots[0].x, plots[0].y);
            for (var i = 1; i < plots.length; i++) {
                ctx.lineTo(plots[i].x, plots[i].y);
            }
            ctx.stroke();  
        }
              
    }
    /*mouse move end*/

    /*mouse up start*/

    function endDraw(e) {
        isActive = false;
        data[userId] = [];
    }

    /*mouse up end*/

})(window.WebSocket||window.MozWebSocket);
