
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
};

var colours = {
  red: "#AC3232",
  black: "#000000"
};

var input = {
  keyboard: [],
  handle: function () {
    document.addEventListener('keydown', function(event) {
        input.keyboard[event.key] = true;

        if (event.key != "r" && event.key != "F5" && event.key != "F12") {
          event.preventDefault();
        }
    });

    document.addEventListener('keyup', function(event) {
        input.keyboard[event.key] = false;

        if (event.key != "r" && event.key != "F5" && event.key != "F12") {
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
  health: 100,
  score: 0,
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
        direction: 360,
        velocity: {
          x: Math.random() * 2 - 1,
          y: -32
        }
      }

      // Shoot the bullet and reload
      player.bullets.push(bullet);
      player.cooldown = player.reload;
    }

    // Bullets
    // Here, the game iterates backwards as to not break the for loop
    for (var bullet = player.bullets.length - 1; bullet >= 0; bullet--) {
      // Movement
      player.bullets[bullet].position.x += player.bullets[bullet].velocity.x;
      player.bullets[bullet].position.y += player.bullets[bullet].velocity.y;

      // Remove invisible bullets from the array
      if (player.bullets[bullet].position.y < 0) {
        player.bullets.splice(bullet, 1);
      }
    }

    // Braking
    if (input.keyboard[" "]) {
      player.speed.current = player.speed.attack;
    } else {
      player.speed.current = player.speed.normal;
    }
  },
  draw: function () {
    // Health
    var radius = (player.health / player.health) * canvas.height;
    canvas.context.fillStyle = colours.red;
    canvas.context.beginPath();
    canvas.context.arc(
      player.position.x + (player.width / 2),
      player.position.y + (player.width / 2),
      radius,
      0,
      2 * Math.PI // Circumfrence
    );
    canvas.context.fill();

    // Ship
    canvas.context.fillStyle = colours.black;
    canvas.context.fillRect(
      player.position.x,
      player.position.y,
      player.width,
      player.height
    );

    // Bullets
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
