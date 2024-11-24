class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.3;
    this.maxSpeed = 4;
    this.friction = 0.05;

    this.angle = 0;

    this.sensor = new Sensor(this,10);
    this.controls = new Controls();
  }

  update() {
    this.#move();
    this.sensor.update();
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

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(-this.angle);
    context.beginPath();
    context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.fill();
    context.restore();

    this.sensor.draw(context);
  }
}
