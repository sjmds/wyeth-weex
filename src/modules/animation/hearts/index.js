import BubbleHearts from './bubble-hearts'

// Images resource
const assets = [
    require('./img/like01.png'),
    require('./img/like02.png'),
    require('./img/like03.png')
];

const random = {
    uniform: function (min, max) {
        return min + (max - min) * Math.random();
    },
    uniformDiscrete: function (i, j) {
        return i + Math.floor((j - i + 1) * random.uniform(0, 1));
    },
};

const stage = new BubbleHearts();
const canvas = stage.canvas;

export default {
    init: function (parentNode, style, width, height) {
        assets.forEach(function (src, index) {
            assets[index] = new Promise(function (resolve) {
                var img = new Image;
                img.onload = resolve.bind(null, img);
                img.src = src;
            });
        });

        // Images preload
        Promise.all(assets).then(function (images) {
            canvas.className = "hearts"
            canvas.width = width || 200;
            canvas.height = height || 400;
            canvas.style = style;
            parentNode.appendChild(canvas);

            // Bubble animation as default
            // setInterval(function () {
            //     stage.bubble(images[random.uniformDiscrete(0, images.length - 1)]);
            // }, 700);
        });
    },
    click: function () {
        Promise.all(assets).then(function (images) {

            stage.bubble(images[random.uniformDiscrete(0, images.length - 1)]);


            // Bubble animation as custom
            // let image = images[random.uniformDiscrete(0, images.length - 1)];
            // stage.bubble(image, 3000, function (lifespan) {
            //     // You got its lifespan, and from 1 to 0
            //     if (lifespan >= 0) {
            //         stage.context.drawImage(
            //             image,
            //             (canvas.width - image.width),
            //             // lifespan control its positionY, so that it will look like fly up
            //             (canvas.height - image.height) * lifespan,
            //             image.width,
            //             image.height
            //         );
            //     } else {
            //         // Return true to free the memory
            //         return true;
            //     }
            // });
        });
    }
}

