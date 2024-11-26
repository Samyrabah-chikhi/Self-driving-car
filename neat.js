class NeuroneGene {
  constructor(id, type) {
    this.innovation = id;
    this.type = type;
  }
}
class LinkGene {
  static combinations = [];
  constructor(inputNode, outputNode) {
    this.inputNode = inputNode;
    this.outputNode = outputNode;
    this.weight = Math.random() * 2 - 1;
    this.enabled = true;

    const index = combinations.findIndex(
      (arr) =>
        JSON.stringify(arr) === JSON.stringify([inputNode.id, outputNode.id])
    );
    if (index !== -1) {
      this.innovation = index;
    } else {
      combinations.push([inputNode.id, outputNode.id]);
      this.innovation = combinations.length - 1;
    }
  }
  static isEqual(link1, link2) {
    return link1.innovation == link2.innovation;
    return (
      link1.inputNode.innovation == link2.inputNode.innovation &&
      link1.outputNode.innovation == link2.outputNode.innovation
    );
  }
}

class Genome {
  static count = 0;
  constructor(numInputs, numOutputs) {
    this.id = count;
    this.numInputs = numInputs;
    this.numOutputs = numOutputs;
    this.neurones = [];
    this.links = [];
  }
}

class Population {}
