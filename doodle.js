(function() {
    var canvas = document.getElementById('letsDoodle');
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = '2';
    canvas.addEventListener('mousedown', startDraw, false);
    canvas.addEventListener('mousemove', draw, false);
    canvas.addEventListener('mouseup', endDraw, false);



    var isActive = false;
    var plots = [];

    function draw(e) {
        if (!isActive) return;

        var x = e.offsetX || e.layerX - canvas.offsetLeft;
        var y = e.offsetY || e.layerY - canvas.offsetTop;

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

    function startDraw(e) {
        isActive = true;
    }

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

})()
