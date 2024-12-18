const canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth * 0.5;

const height = window.innerHeight;
const percentageWidth = 0.16;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const cars = generateCars(1000);

const population = new Population(2, 2, 2, 3);
console.log(population.individuals[0].genome.links);
console.log(population.individuals[1].genome.links);
console.log(
  Population.crossover(population.individuals[0], population.individuals[1]).genome
);

const traffic = [
  new Car(
    road.getLaneCenter(1),
    -height * 0.2,
    canvas.width * percentageWidth,
    canvas.width * percentageWidth * 1.5,
    "DUMMY",
    2
  ),
  new Car(
    road.getLaneCenter(0),
    -height,
    canvas.width * percentageWidth,
    canvas.width * percentageWidth * 1.5,
    "DUMMY",
    2
  ),
  new Car(
    road.getLaneCenter(2),
    -height,
    canvas.width * percentageWidth,
    canvas.width * percentageWidth * 1.5,
    "DUMMY",
    2
  ),
  new Car(
    road.getLaneCenter(2),
    -height * 1.8,
    canvas.width * percentageWidth,
    canvas.width * percentageWidth * 1.5,
    "DUMMY",
    2
  ),
  new Car(
    road.getLaneCenter(1),
    -height * 1.8,
    canvas.width * percentageWidth,
    canvas.width * percentageWidth * 1.5,
    "DUMMY",
    2
  ),
  new Car(
    road.getLaneCenter(0),
    -height * 2.6,
    canvas.width * percentageWidth,
    canvas.width * percentageWidth * 1.5,
    "DUMMY",
    2
  ),
  new Car(
    road.getLaneCenter(1),
    -height * 2.6,
    canvas.width * percentageWidth,
    canvas.width * percentageWidth * 1.5,
    "DUMMY",
    2
  ),
  new Car(
    road.getLaneCenter(2),
    -height * 3.4,
    canvas.width * percentageWidth,
    canvas.width * percentageWidth * 1.5,
    "DUMMY",
    2
  ),
  new Car(
    road.getLaneCenter(1),
    -height * 3.4,
    canvas.width * percentageWidth,
    canvas.width * percentageWidth * 1.5,
    "DUMMY",
    2
  ),
];

let bestCar = cars[0];
if (localStorage && localStorage.getItem("BestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("BestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.01);
    }
  }
}

let time = 0;
animate();

function save() {
  localStorage.setItem("BestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("BestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    const ind = Math.floor(Math.random() * 4) + 1;
    cars.push(
      new Car(
        road.getLaneCenter(1),
        150,
        canvas.width * percentageWidth,
        canvas.width * percentageWidth * 1.5,
        "AI"
      )
    );
  }
  return cars;
}
function animate() {
  for (let i = 0; i < traffic.length; i++) traffic[i].update(road.borders, []);
  for (let i = 0; i < cars.length; i++) cars[i].update(road.borders, traffic);

  bestCar = cars.find((car) => car.y == Math.min(...cars.map((c) => c.y)));

  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -bestCar.y + canvas.height * 0.7);

  road.draw(ctx);

  for (let i = 0; i < traffic.length; i++) traffic[i].draw(ctx, "red");
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < cars.length; i++) cars[i].draw(ctx, "blue");
  ctx.globalAlpha = 1;
  bestCar.draw(ctx, "blue", true);

  ctx.restore();
  requestAnimationFrame(animate);
}
