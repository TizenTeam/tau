//This sample is inspired from http://hakim.se/experiments/html5/origami/
(function () {
    var page = document.getElementById("page"),
        halfOfWidth = window.innerWidth / 2,
        halfOfHeight = window.innerHeight / 2,
        size = Math.round(Math.max(halfOfWidth, halfOfHeight) / 7),
        objects = [], layouts,
        index = 0,
        N = 16,
        timer,
        content,
        autoRotationDuration = 3000, duration = 1000,
        t = tau.animation.target;

    function sample() {
        layouts = [
            // Small spiral flower
            function () {
                objects.forEach(function (object, i) {
                    object.dom.style.webkitTransformOrigin = 'left top';
                    var radius = 0.001,
                        x = Math.sin(i / N * Math.PI * 2) * radius,
                        y = Math.cos(i / N * Math.PI * 2) * radius,
                        a = (Math.atan2(y, x) * 180 / Math.PI),
                        angle = (a < 0.0001) && (a >= 0) ? 0 : a;
                    object.tween({ translateX: x * size + (halfOfWidth / 1.2), translateY: y * size + (halfOfHeight / 1.8), rotateZ: angle },
                        {duration: duration, ease: 'elasticOut'});
                });
            },
            // Large circular flower (rotation fold)
            function () {
                objects.forEach(function (object, i) {
                    var radius = 2,
                        x = Math.sin(i / N * Math.PI * 2) * radius,
                        y = Math.cos(i / N * Math.PI * 2) * radius,
                        a = (Math.atan2(y, x) * 180 / Math.PI),
                        angle = (a < 0.0001) && (a >= 0) ? 0 : a;
                    object.tween({ translateX: x * size + (halfOfWidth / 1.2), translateY: y * size + (halfOfHeight / 1.8), rotateZ: angle},
                        {duration: 700, ease: 'elasticOut'});
                });
            },
            // Large circular flower (center fold)
            function () {
                objects.forEach(function (object, i) {
                    var radius = 2,
                        x = Math.sin(i / N * Math.PI * 2) * radius,
                        y = Math.cos(i / N * Math.PI * 2) * radius,
                        a = (Math.atan2(y, x) * 180 / Math.PI - 45),
                        angle = (a < 0.0001) && (a >= 0) ? 0 : a;
                    object.tween({ translateX: x * size + (halfOfWidth / 1.2), translateY: y * size + (halfOfHeight / 1.8), rotateZ: angle},
                        {duration: (Math.min(0.5 + i / N, 1) * duration), ease: 'elasticOut'});
                });
            },
            // Large circular flower (center fold, two step)
            function () {
                objects.forEach(function (object, i) {
                    var radius = 2,
                        x = Math.sin(i / N * Math.PI * 2) * radius * (i % 2 === 1 ? 2 : 1),
                        y = Math.cos(i / N * Math.PI * 2) * radius * (i % 2 === 1 ? 2 : 1),
                        a = (Math.atan2(y, x) * 180 / Math.PI - 45),
                        angle = (a < 0.0001) && (a >= 0) ? 0 : a,
                        boxSize = 0.9 * (1 + (i % 2));
                    object.tween({ translateX: x * size + (halfOfWidth / 1.2), translateY: y * size + (halfOfHeight / 1.8), rotateZ: angle, scaleX: boxSize, scaleY: boxSize},
                        {duration: duration, ease: 'elasticOut'});
                });
            },
            // Strip
            function () {
                objects.forEach(function (object, i) {
                    var x = ( N - (i * 2.5) ) - ( N / 4 ) ,
                        y = -0.5,
                        angle = 0,
                        boxSize = 2.5;
                    object.tween({ translateX: x * size + (halfOfWidth / 1.2), translateY: y * size + (halfOfHeight / 1.8) - (size * 0.7), rotateZ: angle, scaleX: boxSize, scaleY: boxSize},
                        {duration: 800, ease: 'easeInOut'});
                });
            },
            // Spiral
            function () {
                objects.forEach(function (object, i) {
                    var radius = Math.max(i / (N * 0.75), 0.4),
                        x = Math.sin(i / N * Math.PI * 2) * radius * 0.12 * (i + 1),
                        y = Math.cos(i / N * Math.PI * 2) * radius * 0.12 * (i + 1),
                        a = (Math.atan2(y, x) * 180 / Math.PI /*- (2*i)*/),
                        angle = (a < 0.0001) && (a >= 0) ? 0 : a,
                        boxSize = radius * radius * 1.5;
                    object.tween({ translateX: x * size + (halfOfWidth / 1.2) + (size), translateY: y * size + (halfOfHeight / 1.8), rotateZ: angle, scaleX: boxSize, scaleY: boxSize},
                        {duration: (Math.min(0.5 + ( ( N - i ) / N ), 1) * duration), ease: 'cubicInOut'});
                });
            },
            // Grid
            function () {
                objects.forEach(function (object, i) {
                    var x = ( i % 4 ) - 2,
                        y = Math.floor(i / 4) - 2,
                        angle = 0,
                        boxSize = 1.2;
                    object.tween({ translateX: x * size * 1.2 + (halfOfWidth / 1.2), translateY: y * size * 1.2 + (halfOfHeight / 1.8), rotateZ: angle, scaleX: boxSize, scaleY: boxSize},
                        {duration: (Math.min(0.5 + i / N, 1) * duration), ease: 'elasticOut'});
                });
            }
        ];

        for (var i = 0; i < N; i++) {
            var box = new ClipObject();
            box.basicAnimation(i);
        }

        layoutChange(index, true);

        function ClipObject() {
            this.box = document.createElement('div');
            this.clipBox = document.createElement('div');
            this.colorA = new HSL().randomize();
            this.colorB = new HSL().randomize();

            this.box = createDiv(size);
            this.box.style.webkitTransformOrigin = 'left top';
            this.box.style.background = this.colorA.toString();

            this.clipBox = createDiv(size);
            this.clipBox.style.background = this.colorB.toString();

            this.shadowA = createDiv(size);
            this.shadowB = createDiv(size);
            this.shadowC = createDiv(size);

            this.clipBox.appendChild(this.shadowA);
            this.box.appendChild(this.shadowB);
            this.box.appendChild(this.shadowC);
            this.box.appendChild(this.clipBox);

            content = document.getElementById('content');

            content.appendChild(this.box);

            this.object = t(this.box);
            this.object.set({translateX: (halfOfWidth / 1.2) - size, translateY: (halfOfHeight / 1.8) - size});
            objects.push(this.object);

            this.basicAnimation = function (index) {
                var self = this;

                t(this.clipBox).tween(
                    {webkitClipPath: ['polygon(100% 0, 100% 100%, 0 100%, 0 0)', 'polygon(100% 0, 100% 100%, 0 100%, 100% 100%)']},
                    {
                        duration: duration * 2,
                        loop: 100000,
                        delay: (N - index) * 10,
                        onUpdate: function (tween) {
                            var progress = tween.progress;
                            self.colorA.l = 30 + ( progress * 20 );
                            self.colorB.l = 20 + ( (1 - progress) * 30 );
                            self.box.style.background = self.colorA.toString();
                            self.clipBox.style.background = self.colorB.toString();

                            self.shadowA.style.background = 'linear-gradient(to bottom right, rgba(0, 0, 0, 0), rgba(0, 0, 0,' + 0.1 * progress + '))';
                            self.shadowB.style.background = 'linear-gradient(to bottom right, rgba(0, 0, 0, 0), rgba(0, 0, 0,' + (0.5 - Math.abs(0.5 - progress)) * 0.2 + '))';
                            self.shadowC.style.background = 'linear-gradient(to bottom right, rgba(0, 0, 0, ' + (1 - progress) * 0.7 + '), rgba(0, 0, 0, 0))';
                        },
                        onComplete: function () {
                            var temp = self.colorB;

                            self.colorB = self.colorA;
                            self.colorA = temp.randomize();
                        }
                    }
                );
            };

            function createDiv(size) {
                var div = document.createElement('div');
                div.style.width = size + 'px';
                div.style.height = size + 'px';
                div.style.position = 'absolute';
                div.style.zIndex = 1;

                return div;
            }
        }

        function HSL(h, s, l) {
            this.h = h || 0;
            this.s = s || 100;
            this.l = l || 50;

            this.randomize = function () {
                this.h = ~~(Math.random() * 360);
                this.s = ~~(30 + Math.random() * 50);
                this.l = 50;

                return this;
            };

            this.toString = function () {
                return 'hsl(' + this.h + ',' + this.s + '%,' + this.l + '%)'
            };
        }

        function layoutChange(i, isAutoLayout) {
            index = ( i < 0 ? layouts.length - Math.abs(i) : i ) % layouts.length;
            layouts[index]();
            if (isAutoLayout === true) {
                timer = window.setTimeout(function () {
                    layoutChange(++i, true);
                }, autoRotationDuration);
            } else {
                window.clearTimeout(timer);
            }
        }

        document.body.addEventListener('click', function () {
            for (var i = 0, len = objects.length; i < len; i++) {
                objects[i].stop();
            }
            layoutChange(index + 1, false);
        });
    }

    page.addEventListener("pageshow", function (ev) {
        sample();
    });

    page.addEventListener("pagehide", function (ev) {
        for (var i = 0, len = objects.length; i < len; i++) {
            objects[i].stop();
        }
    });
}());
