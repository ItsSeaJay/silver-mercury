
document.body.onload = function () {
  game.start();
}

var x = 0;

var game = {
  node: document.getElementById("silver-mercury"),
  canvas: {
    node: document.createElement("canvas"),
    width: 360,
    height: 640,
    get context () {
      return this.node.getContext("2d");
    },
    clear: function () {
      this.context.clearRect(0, 0, this.width, this.height);
    }
  },
  start: function () {
    this.node.parentNode.appendChild(this.canvas.node);
    game.canvas.node.width = game.canvas.width;
    game.canvas.node.height = game.canvas.height;
    game.canvas.node.style.border = "1px solid gray";

    // Start game loop
    window.requestAnimationFrame(game.update);
    window.requestAnimationFrame(game.draw);
  },
  update: function () {
    x++;

    if (x > game.canvas.width) {
      x = -64;
    }

    window.requestAnimationFrame(game.update);
  },
  draw: function () {
    game.canvas.clear();

    game.canvas.context.font = "16px Georgia";
    game.canvas.context.strokeText("Hello World", x, game.canvas.width / 2);

    window.requestAnimationFrame(game.draw);
  }
};
