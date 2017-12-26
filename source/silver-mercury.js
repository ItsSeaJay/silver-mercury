
document.body.onload = function () {
  game.start();
}

var game = {
  node: document.getElementById("silver-mercury"),
  canvas: {
    node: document.createElement("canvas"),
    width: 360,
    height: 640,
    get context () {
      return this.node.getContext("2d");
    }
  },
  start: function () {
    this.node.parentNode.appendChild(this.canvas.node);
    game.canvas.node.width = this.canvas.width;
    game.canvas.node.height = this.canvas.height;
    game.canvas.node.style.border = "1px solid gray";

    window.requestAnimationFrame(game.update);
    window.requestAnimationFrame(game.draw);
  },
  update: function () {
    x++;

    window.requestAnimationFrame(game.update);
  },
  draw: function () {
    game.canvas.context.moveTo(0,0);
    game.canvas.context.lineTo(200, 100);
    game.canvas.context.stroke();

    window.requestAnimationFrame(game.draw);
  }
};
