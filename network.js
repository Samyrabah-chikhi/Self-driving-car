class NeuralNetwork {
  constructor(neuronesCounts) {
    this.levels = [];
    for (let i = 0; i < neuronesCounts.length - 1; i++) {
      if (neuronesCounts[i] != 0 && neuronesCounts[i + 1] != 0)
        this.levels.push(new Level(neuronesCounts[i], neuronesCounts[i + 1]));
    }
  }
  static feedForward(givenInputs, network) {
    let output = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      output = Level.feedForward(output, network.levels[i]);
    }
    return output;
  }

  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

class Level {
  constructor(inputCount, outputCount, links = []) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < this.inputs.length; i++) {
      this.weights[i] = new Array(outputCount);
    }
    if (links.length === 0) Level.#randomize(this);
    else this.#translateGene(links);
  }
  #translateGene(links) {}
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.weights[i] = new Array(level.outputs.length);
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }
      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}

class GraphNetwork {
  constructor(genome) {
    this.nbrInput = genome.nbrInput;
    this.nbrOutput = genome.nbrOutput;
    this.nodes = genome.nodes;
    this.links = genome.links;
  }
  test() {
    // Works
    console.log("Topology: ", this.#TopologySorting());
    console.log("output: ", this.#output(this.nodes));
    console.log("feedforward: ", this.feedForward([1, 1]));
  }
  feedForward(inputs = []) {
    const order = this.#TopologySorting();
    const len = order.length;
    //initialize inputs
    for (let i = 0; i < len; i++) {
      if (i < inputs.length) {
        order[i].sum = inputs[i];
      } else {
        order[i].sum = 0;
      }
    }
    console.log("Sums: ", this.nodes);
    //feed forward algorithm
    for (let i = 0; i < len; i++) {
      let node = order[i];
      const linksNode = this.#getAllLinks(this.links, node);
      node.sum += node.biase;
      if (node.type == TYPES.INPUT) {
        node.sum = relu(node.sum);
      } else {
        node.sum = sigmoid(node.sum);
      }
      linksNode.forEach((link) => {
        if (link.enabled) {
          const sum = node.sum * link.weight;
          order.find((e) => e.id == link.to.id).sum += sum;
          
        }
      });
    }
    return this.#output(order)
  }
  #calculate_sum(link, node) {}
  #output(nodes) {
    const outputs = [...nodes].filter(
      (node) => node.type === TYPES.OUTPUT
    );
    return outputs;
  }
  #TopologySorting() {
    let sorted = [];
    const len = this.nodes.length;
    let links = [...this.links];
    let nodes = [];
    let i = 0;
    while (i < len && sorted.length < this.nodes.length) {
      const node = this.nodes[i];
      const startNode = this.#StartingNode(links, node);
      if (startNode && !nodes.includes(node.id)) {
        sorted.push(node);
        nodes.push(node.id);
        links = this.#deleteAllLinks(links, node);
      }
      i++;
      if (i == len) i = 0;
    }
    return sorted;
  }
  #getAllLinks(links, node) {
    return links.filter((link) => link.from.id == node.id);
  }
  #deleteAllLinks(links, node) {
    return links.filter((link) => link.from.id !== node.id);
  }
  #StartingNode(links, node) {
    for (let j = 0; j < links.length; j++) {
      if (links[j].to.id == node.id && links[j].enabled == true) {
        return false;
      }
    }
    return true;
  }
}
