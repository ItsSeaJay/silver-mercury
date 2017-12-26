
document.body.onload = function () {
  game.start();
}

var game = {
  node: document.getElementById("silver-mercury"),
  canvas: {
    node: document.createElement("canvas"),
    width: 360,
    height: 640,
    context: 
  },
  start: function() {
    // Setup canvas
    this.node.parentNode.appendChild(this.canvas.node);

    this.canvas.node.width = this.canvas.width;
    this.canvas.node.height = this.canvas.height;

    this.canvas.node.style.border = "1px solid gray";

    this.update();
  },
  update: function() {
    // TODO:
  }
};
