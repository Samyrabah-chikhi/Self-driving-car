class Car {
  constructor(x, y, width, height, type, maxSpeed = 3.5) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.3;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;

    this.angle = 0;

    this.useBrain = type == "AI";

    this.damaged = false;
    if (type != "DUMMY") {
      this.sensor = new Sensor(this, 15);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 20,10, 4]);
    }
    this.controls = new Controls(type);
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygons = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map((e) =>
        e == null ? 0 : 1 - e.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }
  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polyIntersects(this.polygons, roadBorders[i])) return true;
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polyIntersects(this.polygons, traffic[i].polygons)) return true;
    }
    return false;
  }
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  #move() {
    //Moving forward and reverse
    if (this.controls.forward) {
      this.speed -= this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed += this.acceleration;
    }
    //Caping the speed
    if (this.speed > this.maxSpeed / 2) {
      this.speed = this.maxSpeed / 2;
    }

    if (this.speed < -this.maxSpeed) {
      this.speed = -this.maxSpeed;
    }
    //Adding friction to stop the car
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    //To stop the car completly
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    // Change angle
    if (this.controls.left) {
      this.angle += 0.03;
    }
    if (this.controls.right) {
      this.angle -= 0.03;
    }
    // calculate final position
    this.x += Math.sin(this.angle) * this.speed;
    this.y += Math.cos(this.angle) * this.speed;
  }

  draw(context, color,drawSensor=false) {
    if (this.damaged) {
      context.fillStyle = "gray";
    } else {
      context.fillStyle = color;
    }
    context.beginPath();
    context.moveTo(this.polygons[0].x, this.polygons[0].y);
    for (let i = 1; i < this.polygons.length; i++) {
      context.lineTo(this.polygons[i].x, this.polygons[i].y);
    }
    context.fill();
    if (this.sensor && drawSensor) {
      this.sensor.draw(context);
    }
  }
}
