(function () {

    let canvas = document.querySelector("canvas");
    let canvasJq = $(canvas);
    let numPreview = document.querySelector("#num-preview");
    let IMAGE_WIDTH = 28, IMAGE_HEIGHT = 28;
    let trainStatusDiv = $("#train-status");
    let recognizeResultDiv = $("#result");

    /**
     *
     * @type {CanvasRenderingContext2D | null}
     */
    let context2d = canvas.getContext("2d");

    let numPreviewContext2d = numPreview.getContext("2d");


    function canvas_mouseMoveHandler(e) {
        let jqOffset = canvasJq.offset();
        let x = e.pageX - jqOffset.left;
        let y = e.pageY - jqOffset.top;
        context2d.lineTo(x, y);
        context2d.stroke();
    }

    function showPreviewPhoto() {
        numPreviewContext2d.fillStyle = "#ffffff";
        numPreviewContext2d.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        numPreviewContext2d.drawImage(canvas, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
    }

    function canvas_mouseUpHandler() {
        canvas.onmousemove = null;
        canvas.onmouseup = null;

        showPreviewPhoto();
    }

    function canvas_mouseDownHandler(e) {
        canvas.onmousemove = canvas_mouseMoveHandler;
        canvas.onmouseup = canvas_mouseUpHandler;

        context2d.beginPath();
        context2d.lineWidth = 20;
        context2d.lineCap = "round";
        context2d.lineJoin = "round";

        let jqOffset = canvasJq.offset();
        let x = e.pageX - jqOffset.left;
        let y = e.pageY - jqOffset.top;
        context2d.moveTo(x, y);
    }

    function clearCanvas() {
        context2d.clearRect(0, 0, canvas.width, canvas.height);
        showPreviewPhoto();
    }

    function getPhotoDataArray() {
        let photoData = numPreviewContext2d.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        let photoDataArray = [];
        for (let i = 0; i < photoData.data.length; i += 4) {
            let r = photoData.data[i];
            let g = photoData.data[i + 1];
            let b = photoData.data[i + 2];
            let color = Math.round((r + g + b) / 3);
            photoDataArray.push(color);
        }
        return photoDataArray;
    }

    function buildRecognizeResultView(result) {
        recognizeResultDiv.empty();
        recognizeResultDiv.append(`<div>识别结果：${result.result}</div>`);
        recognizeResultDiv.append("<table class='table-bordered'><tbody></tbody></table>");
        let tBody = recognizeResultDiv.find("tbody");

        result.prediction.forEach((value, index) => {
            $("<tr></tr>").appendTo(tBody).append(`<td>${index}</td>`).append(`<td>${value}</td>`);
        });
    }

    function recognizeNumber() {
        let photoDataArray = getPhotoDataArray();

        $("#result").html(`正在通信...`);
        $.post("/recognize", {
            data: JSON.stringify({
                    photo_data: photoDataArray
                }
            )
        }).done(result => {
            if (typeof result === 'string') {
                result = JSON.parse(result);
            }
            buildRecognizeResultView(result);
        });
    }

    function train() {
        let targetNum = $("#target-num").val();
        if (!targetNum) {
            trainStatusDiv.html('<span style="color: red;">请输入关联数字</span>');
            return;
        }
        let photoDataArray = getPhotoDataArray();

        trainStatusDiv.html(`正在通信...`);

        $.post("/train", {
            data: JSON.stringify({
                    photo_data: photoDataArray,
                    num: parseInt(targetNum)
                }
            )
        }).done(result => {
            trainStatusDiv.html(`结果：${result}`);
        });
    }

    function addListeners() {
        canvas.onmousedown = canvas_mouseDownHandler;
        $("#btn-clear").click(clearCanvas);
        $("#btn-train").click(train);
        $("#btn-recognize").click(recognizeNumber);
    }

    function main() {
        addListeners();
    }

    main();
})();