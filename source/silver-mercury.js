
document.body.onload = function () {
  game.start();
}

var game = {
  node: document.getElementById("silver-mercury"),
  start: function () {
    this.node.parentNode.appendChild(canvas.node);
    canvas.node.width = canvas.width;
    canvas.node.height = canvas.height;
    canvas.node.style.border = "1px solid gray";

    // Start game loop
    window.requestAnimationFrame(game.update);
    window.requestAnimationFrame(game.draw);
  },
  update: function () {
    // handleInput
    document.addEventListener("keypress", function (event) {
      if (event.defaultPrevented) {
        return;
      }

      switch (event.key) {
        case "ArrowUp":
          player.y -= player.speed;
          break;
        case "ArrowDown":
          player.y += player.speed;
          break;
        case "ArrowLeft":
          player.x -= player.speed;
          break;
        case "ArrowRight":
          player.x += player.speed;
          break;
        default:
          return;
      }

      event.preventDefault();
    },
    true);

    window.requestAnimationFrame(game.update);
  },
  draw: function () {
    canvas.clear();

    canvas.context.fillStyle = "#000000";
    canvas.context.fillRect(player.x, player.y, player.width, player.height);

    window.requestAnimationFrame(game.draw);
  }
};

var canvas = {
  node: document.createElement("canvas"),
  width: 360,
  height: 640,
  get context () {
    return this.node.getContext("2d");
  },
  clear: function () {
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

var player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 32,
  height: 32,
  speed: 4
};
