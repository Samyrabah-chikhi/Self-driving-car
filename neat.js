const TYPES = Object.freeze({
  INPUT: -1,
  HIDDEN: 0,
  OUTPUT: 1,
});

class Node {
  constructor(id, type = TYPES.HIDDEN) {
    this.id = id;
    this.type = type;
    this.biase = 0 //Math.random() * 2 - 4;
    this.sum = 0
  }
}

class Link {
  static links = [];
  constructor(from, to, weight = 1, enabled = true, innovation = 0) {
    this.from = from;
    this.to = to;
    this.innovation = innovation;
    this.weight = weight;
    this.enabled = enabled;

    const sorted = [from.id, to.id].sort();
    const index = Link.links.findIndex(
      (arr) => Array.isArray(arr) && arr.join() === sorted.join()
    );
    if (index === -1) {
      this.innovation = Link.links.length;
      Link.links.push(sorted);
    } else {
      this.innovation = index;
    }
  }
  static compare(link, from, to) {
    return link.from.id == from.id && link.to.id == to.id;
  }
}

class Gene {
  constructor(nbrInput, nbrOutput, nbrLinks = 1) {
    this.nbrInput = nbrInput;
    this.nbrOutput = nbrOutput;
    this.nodes = [];
    this.links = [];

    this.#InitNodes(nbrInput, TYPES.INPUT);
    this.#InitNodes(nbrOutput, TYPES.OUTPUT);
    //create one random link
    this.#InitLinks(nbrInput, nbrOutput, nbrLinks);
  }
  #InitNodes(nbrInput, type) {
    for (let i = 0; i < nbrInput; i++) {
      let newNode = new Node(this.nodes.length, type);
      this.nodes.push(newNode);
    }
  }
  #InitLinks(nbrInput, nbrOutput, nbrLinks) {
    for (let i = 0; i < nbrLinks; i++) {
      const input = this.nodes[Math.floor(Math.random() * nbrInput)];
      const output =
        this.nodes[Math.floor(Math.random() * nbrOutput) + nbrInput];
      let exists = false;
      for (let j = 0; j < this.links.length; j++) {
        if (Link.compare(this.links[j], input, output)) {
          exists = true;
          break;
        }
      }
      if (!exists) this.addLink(input, output);
    }
  }
  addLink(node1, node2) {
    const exists = this.links.find((link) => link.from.id == node1.id && link.to.id == node2.id )
    if(exists)
      return;
    const weight = Math.random() * 8 - 4;
    const link = new Link(node1, node2, weight);
    this.links.push(link);
  }
  mutate() {
    let rate = Math.random();
    if (rate < 0.1) this.mutateWeight();
    rate = Math.random();
    if (rate < 0.05) this.mutateDisableLink();
    rate = Math.random();
    if (rate < 0.05) this.mutateAddLink();
    rate = Math.random();
    if (rate < 0.05) this.mutateAddNode();
  }
  mutateWeight() {
    const weight = Math.random() * 8 - 4;
    const index = Math.floor(Math.random() * this.links.length);
    let link = this.links[index];
    link.weight = weight;
    this.links[index] = link;
  }
  mutateDisableLink() {
    const index = Math.floor(Math.random() * this.links.length);
    let link = this.links[index];
    link.enabled = false;
    this.links[index] = link;
  }
  mutateAddLink() {
    const node1 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    const node2 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    //mutation fails in those 3 conditions
    if (node1 == node2) return;
    if (node1.type == TYPES.OUTPUT && node2.type == TYPES.OUTPUT) return;
    if (node1.type == TYPES.INPUT && node2.type == TYPES.INPUT) return;
    // To not link backwards
    let reverse = false;
    if (node1.type == TYPES.OUTPUT) reverse = true;
    if (node1.type == TYPES.HIDDEN && node2.type == TYPES.INPUT) reverse = true;

    this.addLink(reverse ? node2 : node1, reverse ? node1 : node2);
  }
  mutateAddNode() {
    const index = Math.floor(Math.random() * this.links.length);
    let link = this.links[index];
    link.enabled = false;
    this.links[index] = link;

    const newNode = new Node(this.nodes.length, TYPES.HIDDEN);
    this.nodes.push(newNode);

    this.links.push(new Link(link.from, newNode, 1, true));
    this.links.push(new Link(newNode, link.to, link.weight, true));
  }
}

class Individual {
  constructor(nbrInput, nbrOutput, nbrLinks = 1) {
    this.genome = new Gene(nbrInput, nbrOutput, 2);
    //We need a directed acyclic graph for the neural network
    this.brain = new GraphNetwork(this.genome);
    this.fitness;
  }
  update(y) {
    this.fitness = -y;
  }
}

class Population {
  constructor(nbrPopulation, nbrInput, nbrOutput,nbrLinks = 1) {
    this.individuals = []
    for(let i = 0 ; i < nbrPopulation ; i++ ){
      this.individuals.push(new Individual(nbrInput,nbrOutput,nbrLinks))
    }
  }

  evaluate(){
    this.individuals.sort((a, b) => b.fitness - a.fitness);
  }

  reproduce(){
    const best = Math.floor(this.individuals.length*0.2);
    let newPopulation = this.individuals.slice(0,best);
    const len = this.individuals.length - best;
    for( let i = 0 ; i < len ; i++){
      const individual = this.individuals[Math.floor(this.individuals.length*0.5)]
      newPopulation.push(individual.mutate())
    }
    this.individuals = newPopulation
  }

}
