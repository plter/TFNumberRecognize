(function () {

    let canvas = document.querySelector("canvas");
    let numPreview = document.querySelector("#num-preview");
    let IMAGE_WIDTH = 28, IMAGE_HEIGHT = 28;

    /**
     *
     * @type {CanvasRenderingContext2D | null}
     */
    let context2d = canvas.getContext("2d");

    let numPreviewContext2d = numPreview.getContext("2d");


    function canvas_mouseMoveHandler(e) {
        context2d.lineTo(e.x, e.y);
        context2d.stroke();
    }

    function canvas_mouseUpHandler() {
        canvas.onmousemove = null;
        canvas.onmouseup = null;
    }

    function canvas_mouseDownHandler(e) {
        canvas.onmousemove = canvas_mouseMoveHandler;
        canvas.onmouseup = canvas_mouseUpHandler;

        context2d.beginPath();
        context2d.lineWidth = 20;
        context2d.lineCap = "round";
        context2d.lineJoin = "round";
        context2d.moveTo(e.x, e.y);
    }

    function clearCanvas() {
        context2d.clearRect(0, 0, canvas.width, canvas.height);
    }

    function getPhotoDataArray() {
        numPreviewContext2d.fillStyle = "#ffffff";
        numPreviewContext2d.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        numPreviewContext2d.drawImage(canvas, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

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

    function recognizeNumber() {
        let photoDataArray = getPhotoDataArray();

        $.post("/recognize", {
            data: JSON.stringify({
                    photo_data: photoDataArray
                }
            )
        }).done(result => {
            $("#result").html(`识别结果：${result}`);
        });
    }

    function train() {
        let targetNum = $("#target-num").val();
        if (!targetNum) {
            alert("请输入关联数字");
            return;
        }
        let photoDataArray = getPhotoDataArray();

        $("#result").html(`正在通信...`);
        $.post("/train", {
            data: JSON.stringify({
                    photo_data: photoDataArray,
                    num: parseInt(targetNum)
                }
            )
        }).done(result => {
            $("#result").html(`结果：${result}`);
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