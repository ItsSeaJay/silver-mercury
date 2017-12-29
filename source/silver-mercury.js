
document.body.onload = function () {
  game.start();
}

var game = {
  title: "Silver Mercury",
  node: document.getElementById("silver-mercury"),
  states: {
    paused: 0,
    playing: 1
  },
  state: 1,
  start: function () {
    game.node.parentNode.appendChild(canvas.node);
    canvas.node.width = canvas.width;
    canvas.node.height = canvas.height;
    canvas.node.style.border = "1px solid gray";
    canvas.node.style.backgroundColor = colours.white;

    input.handle();

    window.requestAnimationFrame(game.update);
    window.requestAnimationFrame(game.draw);
  },
  update: function () {
    switch (game.state) {
      case game.states.paused:

        break;
      case game.states.playing:
        player.update();

        if (input.keydown("p")) {
          game.state = game.states.paused;
        }
        break;
    }

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
  black: "#000000",
  white: "#FFFFFF"
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
  },
  keydown: function (key) {
    document.addEventListener('keydown', function (event) {
      if (event.key == key) {
        return true;
      } else {
        return false;
      }
    });
  }
};

var Maths = {
  clamp: function (value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  },
  rotation: function (value) {
    return {
      x: Math.sin(Maths.radians(value)),
      y: Math.cos(Maths.radians(value))
    };
  },
  degrees: function (radians) {
    return radians * (180 / Math.PI);
  },
  radians: function (degrees) {
    return degrees * (Math.PI / 180);
  },
  lerp: function (start, destination, speed) {
    return start + speed * (destination - start);
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
    attack: 3,
    current: 4
  },
  velocity: {
    x: 0,
    y: 0
  },
  gun: {
    bullets: [],
    barrels: 1, // How many shots are fired at once
    reload: 8, // How many frames needed to reload
    cooldown: 0
  },
  health: {
    maximum: 100,
    current: 100,
    decay: 0.1
  },
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
    player.gun.cooldown = Math.max(player.gun.cooldown - 1, 0);

    if (input.keyboard[" "] && player.gun.cooldown == 0) {
      for (var barrel = 0; barrel < player.gun.barrels; barrel++) {
        var bullet = {
          position: {
            x: player.position.x + 8,
            y: player.position.y + 16,
          },
          width: 16,
          height: 16,
          // In degrees, where 0 is straight down
          direction: 180 + (Math.random() * 1 - 0.5),
          velocity: 16
        }

        // Shoot the bullet and player.gun.reload
        player.gun.bullets.push(bullet);
        player.gun.cooldown = player.gun.reload;
      }
    }

    // Bullets
    // Here, the game iterates backwards as to not break the for loop
    for (var bullet = player.gun.bullets.length - 1; bullet >= 0; bullet--) {
      // Movement
      var velocity = {
        x: Maths.rotation(player.gun.bullets[bullet].direction).x * player.gun.bullets[bullet].velocity,
        y: Maths.rotation(player.gun.bullets[bullet].direction).y * player.gun.bullets[bullet].velocity
      }

      player.gun.bullets[bullet].position.x += velocity.x;
      player.gun.bullets[bullet].position.y += velocity.y;

      // Remove invisible bullets from the array
      if (player.gun.bullets[bullet].position.y < 0) {
        player.gun.bullets.splice(bullet, 1);
      }
    }

    // Braking
    if (input.keyboard[" "]) {
      player.speed.current = player.speed.attack;
    } else {
      player.speed.current = player.speed.normal;
    }

    // Health
    // Decay
    player.health.current -= player.health.decay;

    // Clamp
    player.health.current = Maths.clamp(player.health.current, 0, player.health.maximum);
  },
  draw: function () {
    // Health
    var radius = (player.health.current / player.health.maximum) * canvas.height;
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
    for (bullet of player.gun.bullets) {
      canvas.context.fillRect(
        bullet.position.x,
        bullet.position.y,
        bullet.width,
        bullet.height
      );
    }

    // Score
    canvas.context.font = "32px 'Roboto', sans-serif";
    canvas.context.fillText(player.score, 32, canvas.height - 36);
  }
};

var enemies = {
  straight: {
    
  }
}
