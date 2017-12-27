
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

    player.draw();

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

        if (event.key != "r" && event.key != "F5") {
          event.preventDefault();
        }
    });

    document.addEventListener('keyup', function(event) {
        input.keyboard[event.key] = false;

        if (event.key != "r" && event.key != "F5") {
          event.preventDefault();
        }
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
  speed: {
    normal: 4,
    attack: 2,
    current: 4
  },
  velocity: {
    x: 0,
    y: 0
  },
  bullets: [],
  reload: 8,
  cooldown: 0,
  update: function () {
    // Movement
    // Vertical
    if (input.keyboard["ArrowUp"] || input.keyboard["w"]) {
      player.velocity.y = -player.speed.current;
    } else if (input.keyboard["ArrowDown"] || input.keyboard["s"]) {
      player.velocity.y = player.speed.current;
    } else {
      player.velocity.y = 0;
    }

    // Horizontal
    if (input.keyboard["ArrowLeft"] || input.keyboard["a"]) {
      player.velocity.x = -player.speed.current;
    } else if (input.keyboard["ArrowRight"] || input.keyboard["d"]) {
      player.velocity.x = player.speed.current;
    } else {
      player.velocity.x = 0;
    }

    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;

    // Clamp position
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

    // Shooting
    player.cooldown = Math.max(player.cooldown - 1, 0);

    if (input.keyboard[" "] && player.cooldown == 0) {
      var bullet = {
        position: {
          x: player.position.x + 8,
          y: player.position.y + 16,
        },
        width: 16,
        height: 16,
        velocity: {
          x: Math.random() * 2 - 1,
          y: -32
        }
      }

      player.bullets.push(bullet);
      console.log(player.bullets);

      player.cooldown = player.reload;
    }

    // Bullets
    for (bullet of player.bullets) {
      bullet.position.x += bullet.velocity.x;
      bullet.position.y += bullet.velocity.y;
    }

    // Braking
    if (input.keyboard[" "]) {
      player.speed.current = player.speed.attack;
    } else {
      player.speed.current = player.speed.normal;
    }
  },
  draw: function () {
    canvas.context.fillStyle = "#000000";
    canvas.context.fillRect(
      player.position.x,
      player.position.y,
      player.width,
      player.height
    );

    for (bullet of player.bullets) {
      canvas.context.fillRect(
        bullet.position.x,
        bullet.position.y,
        bullet.width,
        bullet.height
      );
    }
  }
};
