class Road {
  constructor(x, width, laneCount = 4) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 10000000;
    this.top = -infinity;
    this.bottom = infinity;
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  draw(context) {
    // define the lines
    context.lineWidth = 5;
    context.strokeStyle = "white";

    for (let i = 0; i <= this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      if (i > 0 && i < this.laneCount) {
        context.setLineDash([20, 20]);
      } else {
        context.setLineDash([]);
      }

      context.beginPath();
      context.moveTo(x, this.top);
      context.lineTo(x, this.bottom);
      context.stroke();
    }
  }
}
