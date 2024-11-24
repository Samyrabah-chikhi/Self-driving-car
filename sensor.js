class Sensor {
  constructor(car, rayCount = 3) {
    this.car = car;
    this.rayCount = rayCount;
    this.rayLength = 100;
    this.raySpeard = Math.PI / 4;

    this.rays = [];
  }

  update() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.raySpeard / 2,
        -this.raySpeard / 2,
        i / (this.rayCount - 1)
      ) + this.car.angle;
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  draw(context) {
    for (let i = 0; i < this.rayCount; i++) {
      context.beginPath();

      context.lineWidth = 2;
      context.strokeStyle = "yellow";

      context.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      context.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      context.stroke();
    }
  }
}
