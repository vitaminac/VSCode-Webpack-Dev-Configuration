const DPlayer = require("DPlayer");

exports.load = function () {
    function dplayer1() {
        window.dp1 = new DPlayer({
            container: document.getElementById('dplayer1'),
            video: {
                url: 'https://pan.prprpr.me/?/dplayer/hikarunara.mp4',
                pic: 'https://moeplayer.b0.upaiyun.com/dplayer/hikarunara.png',
                thumbnails: 'https://moeplayer.b0.upaiyun.com/dplayer/hikarunara_thumbnails.jpg'
            },
            danmaku: {
                id: '9E2E3368B56CDBB4',
                api: 'https://api.prprpr.me/dplayer3/'
            }
        });
    }

    dplayer1();
}