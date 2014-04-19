Template.screenMain.rendered = function() {
	window.rain_acceleration = .02;
	window.rain_speed = 4;

	var doRainCanvas = function () {
		var base = this,
		canvas,
		ctx,
		drops = [],
		color = 120,
		w = $('#tscreen-canvas').width();
		h = $('#tscreen-canvas').height();
		//App initilizer
		base.init = function () {
			base.setup();
			base.loop();
		};
		//setting up html5 canvas
		base.setup = function () {
			canvas = document.getElementById('tscreen-canvas');
			canvas.width = w;
			canvas.height = h;
			ctx = canvas.getContext('2d');
		};
		//to create random umber within the range.
		base.rand = function (min, max) {
			return Math.random() * (max - min) + min;
		};
		//to calculte distance between tow coords
		base.calDistance = function (x1, y1, x2, y2) {
			return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
		};
		//The rain object
		base.Rain = function (ix, iy, ex, ey) {
			var rain = this,
			x = ix,
			y = iy,
			distanceTraveled = 0,
			angle,
			brightness,
			targetRadius = 1,
			speed = window.rain_speed,
			distanceToTarget = 0,
			spawnedLastFrame = 0,
			coords = [],
			coordinateCount = 2;
			//initilizing rain object
			rain.init = function () {
				angle = Math.atan2(ey - iy, ex - ix);
				brightness = base.rand(5, 30);
				distanceToTarget = base.calDistance(ix, iy, ex, ey);
				// populate initial coordinate collection with the current coords
				while (coordinateCount--) {
					coords.push([ix, iy]);
				}
			};
			//drawing rain drop
			rain.draw = function () {
				ctx.beginPath();
				// move to the last tracked coordinate in the set, then draw a line to the current x and y
				ctx.moveTo(coords[coords.length - 1][0], coords[coords.length - 1][1]);
				ctx.lineTo(x, y);
				ctx.lineWidth = 3;
				ctx.strokeStyle = window.rain_color;
				ctx.stroke();
				ctx.beginPath();
			};
			//updating rain drop
			rain.update = function (i) {
				coords.pop();
				coords.unshift([x, y]);
				// speed up the rain drops
				speed += window.rain_acceleration;
				// get the current velocities based on angle and speed
				var vx = Math.cos(angle) * speed,
				vy = Math.sin(angle) * speed;
				distanceTraveled = base.calDistance(ix, iy, x + vx, y + vy);

				if (distanceTraveled >= distanceToTarget) {
					drops.splice(i, 1);
				} else {
					x += vx;
					y += vy;
				}
			};
			rain.init();
		};
		base.spawnRainFrame = function() {
			if(!base.spawnedLastFrame) {
				var sx = base.rand(-200, w);
				drops.push(new base.Rain(sx, 0, sx + 200, h, color));
				base.spawnedLastFrame=4;
			}
			base.spawnedLastFrame--;
		}
		//loop animation
		base.loop = function () {
			requestAnimationFrame(base.loop);
			ctx.globalCompositeOperation = 'destination-out';
			ctx.fillStyle = 'rgba(0, 0, 0, .5)';
			ctx.fillRect(0, 0, w, h);
			ctx.globalCompositeOperation = 'lighter';
			// loop over each drops, draw it, update it
			var i = drops.length;
			while (i--) {
				drops[i].draw();
				drops[i].update(i);
			}
			base.spawnRainFrame();
		};
		base.init();
	};


	var changeRainSpeed = function(value) {
		window.rain_speed = (value/10)+1;
		window.rain_acceleration = window.rain_speed/100;
	};

	var changeRainColor = function(value) {
		window.rain_color = value;
	};


	ScreenSettings.find({_id: {$in: ['rainSpeed','rainColor']}}).observeChanges({
		changed:function(id,changed) {
			switch(id) {
				case 'rainSpeed':
					if(!!changed.value) {
						changeRainSpeed(changed.value)
					}
					break;
				case 'rainColor':
					if(!!changed.value) {
						changeRainColor(changed.value);
					}
					break;
			}
		}
	});

	changeRainSpeed(ScreenSettings.findOne("rainSpeed").value);
	changeRainColor(ScreenSettings.findOne("rainColor").value);

	doRainCanvas();
};
