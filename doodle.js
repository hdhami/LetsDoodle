(function(pubnub, channel) {
    var isActive = false;
    var plots = [];
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

        var x = e.offsetX ;
        var y = e.offsetY ;

        plots.push({
            x: x,
            y: y
        });
        //debugger
        drawOnCanvas(plots);
    }


    function drawOnCanvas(plots) {
        ctx.beginPath();
        ctx.moveTo(plots[0].x, plots[0].y);

        for (var i = 1; i < plots.length; i++) {
            ctx.lineTo(plots[i].x, plots[i].y);
        }
        ctx.stroke();
    }
    /*mouse move end*/

    /*mouse up start*/

    function endDraw(e) {
        isActive = false;
        pubnub.publish({
            channel: channel,
            message: {
                plots: plots
            }
        });
        plots = [];
    }

    /*mouse up end*/


    /*draw from stream*/

    function drawFromStream(message) {
        //debugger
        if (!message) return;

        ctx.beginPath();
        drawOnCanvas(message.plots);
    }
    pubnub.subscribe({
        channel: channel,
        callback: drawFromStream
    });
    /*************/

})(pubnub, channel);
