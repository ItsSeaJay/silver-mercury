
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

    input.handle();

    window.requestAnimationFrame(game.update);
    window.requestAnimationFrame(game.draw);
  },
  update: function () {
    player.update();

    window.requestAnimationFrame(game.update);
  },
  draw: function () {
    canvas.clear();

    canvas.context.fillStyle = "#000000";
    canvas.context.fillRect(player.position.x, player.position.y, player.width, player.height);

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

var input = {
  keyboard: [],
  handle: function () {
    document.addEventListener('keydown', function(event) {
        input.keyboard[event.key] = true;

        event.preventDefault();
    });

    document.addEventListener('keyup', function(event) {
        input.keyboard[event.key] = false;

        event.preventDefault();
    });
  }
};

var Maths = {
  clamp: function (value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }
};

var player = {
  position: {
    x: canvas.width / 2,
    y: canvas.height / 2,
  },
  width: 32,
  height: 32,
  speed: 3,
  velocity: {
    x: 0,
    y: 0
  },
  update: function () {
    // Movement
    // Vertical
    if (input.keyboard["ArrowUp"] || input.keyboard["w"]) {
      player.velocity.y = -player.speed;
    } else if (input.keyboard["ArrowDown"] || input.keyboard["s"]) {
      player.velocity.y = player.speed;
    } else {
      player.velocity.y = 0;
    }

    // Horizontal
    if (input.keyboard["ArrowLeft"] || input.keyboard["a"]) {
      player.velocity.x = -player.speed;
    } else if (input.keyboard["ArrowRight"] || input.keyboard["d"]) {
      player.velocity.x = player.speed;
    } else {
      player.velocity.x = 0;
    }

    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;

    player.position.x = Maths.clamp(
      player.position.x,
      0,
      canvas.width - player.width,
    );
    player.position.y = Maths.clamp(
      player.position.y,
      0,
      canvas.height - player.height,
    );
  }
};
