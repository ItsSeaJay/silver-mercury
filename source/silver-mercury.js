
document.body.onload = function () {
  game.start();
}

var game = {
  title: "Silver Mercury",
  node: document.getElementById("silver-mercury"),
  states: {
    paused: 0,
    playing: 1,
    over: 2
  },
  state: 1,
  time: { // Measured in 1/60th second intervals
    elapsed: 0
  },
  start: function () {
    game.node.parentNode.appendChild(canvas.node);
    canvas.node.width = canvas.width;
    canvas.node.height = canvas.height;
    canvas.node.style.border = "1px solid gray";
    canvas.node.style.backgroundColor = canvas.colours.white;

    input.handle();
    opponent.start();

    window.requestAnimationFrame(game.update);
    window.requestAnimationFrame(game.draw);
  },
  update: function () {
    if (game.time.elapsed < Maths.limit) {
      game.time.elapsed += 1 / 60;
    } else {
      game.time.elapsed = 0;
      alert("You waited four million years. Congratulations.");
    }

    switch (game.state) {
      case game.states.paused:

        break;
      case game.states.playing:
        player.update();
        opponent.update();
        break;
      case game.states.over:

        break;
    }

    window.requestAnimationFrame(game.update);
  },
  draw: function () {
    canvas.clear();

    switch (game.state) {
      case game.states.paused:

        break;
      case game.states.playing:
        player.draw();
        opponent.draw();
        break;
      case game.states.over:
        canvas.context.fillStyle = canvas.colours.black;
        canvas.context.font = "32px 'Roboto', sans-serif";
        canvas.context.textAlign = "center";
        canvas.context.fillText("Game Over", (canvas.width / 2), canvas.height / 2);
        canvas.context.fillText("Please Refresh", (canvas.width / 2), canvas.height / 2 + 32);
        break;
    }

    window.requestAnimationFrame(game.draw);
  }
};

var canvas = {
  node: document.createElement("canvas"),
  width: 360,
  height: 640,
  colours: {
    red: "#AC3232",
    black: "#000000",
    white: "#FFFFFF"
  },
  get context () {
    return canvas.node.getContext("2d");
  },
  clear: function () {
    canvas.context.clearRect(0, 0, canvas.width, canvas.height);
  }
};

var input = {
  keyboard: [],
  handle: function () {
    // Key Down
    document.addEventListener("keydown", function(event) {
        input.keyboard[event.key] = true;

        if (event.key != "r" && event.key != "F5" && event.key != "F12") {
          event.preventDefault();
        }
    });

    // Key Press
    document.addEventListener("keypress", function (event) {

      if (event.key != "r" && event.key != "F5" && event.key != "F12") {
        event.preventDefault();
      }
    });

    // Key Up
    document.addEventListener("keyup", function(event) {
        input.keyboard[event.key] = false;

        if (event.key != "r" && event.key != "F5" && event.key != "F12") {
          event.preventDefault();
        }
    });
  }
};

var Maths = {
  limit: 9007199254740991, // Highest possible integer storable in Javascript
  clamp: function (value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  },
  rotation: function (degrees) {
    return {
      x: Math.sin(Maths.radians(degrees)),
      y: Math.cos(Maths.radians(degrees))
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

var collision = {
  check: {
    rectangle: function (a, b, offset) {
      return !(
        ((a.position.y + a.height + offset) < (b.position.y)) ||
        (a.position.y + offset > (b.position.y + b.height)) ||
        ((a.position.x + a.width + offset) < b.position.x) ||
        (a.position.x + offset > (b.position.x + b.width))
      );
    }
  }
}

var player = {
  position: {
    x: canvas.width / 2,
    y: canvas.height / 2,
  },
  width: 32,
  height: 32,
  radius: {
    maximum: canvas.width / 3,
    current: 0 // Set later on
  },
  speed: {
    normal: 5,
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
    reload: 4, // How many frames needed to reload
    cooldown: 0
  },
  health: {
    maximum: 100,
    current: 10,
    decay: 1,
    regeneration: 0.1
  },
  score: 0,
  colour: canvas.colours.black,
  update: function () {
    // Score
    player.score += 1 / 60;

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

    // Clamp position in view
    player.position.x = Maths.clamp(
      player.position.x,
      0,
      canvas.width,
    );
    player.position.y = Maths.clamp(
      player.position.y,
      0,
      canvas.height,
    );

    // Shooting
    player.gun.cooldown = Math.max(player.gun.cooldown - 1, 0);

    if (input.keyboard[" "] && player.gun.cooldown == 0) {
      for (var barrel = 0; barrel < player.gun.barrels; barrel++) {
        var bullet = {
          position: {
            x: player.position.x - 8,
            y: player.position.y,
          },
          width: 16,
          height: 16,
          // In degrees, where 0 is straight down
          direction: 180 + (Math.random() * 1 - 0.5),
          velocity: 16
        }

        // Lose health for shooting
        player.health.current -= player.health.decay

        // Shoot the bullet and reload
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
    // Regeneration
    player.health.current += player.health.regeneration;

    // Clamp
    player.health.current = Maths.clamp(player.health.current, 0, player.health.maximum);

    // Growth/Shrinking
    player.radius.current = (player.health.current / player.health.maximum) * (player.radius.maximum);
    player.width = player.radius.current;
    player.height = player.radius.current;

    // Collision Detection
    if (opponent.enemies.length > 0) {
      for (var enemy = opponent.enemies.length - 1; enemy >= 0; enemy--) {
        if (collision.check.rectangle(player, opponent.enemies[enemy], -player.width)) {
          player.health.current--;
        }
      };
    }

    // Death
    if (player.health.current == 0) {
      game.state = game.states.over;
    }
  },
  draw: function () {
    // NOTE: Draw method renders the furthest away object first
    // Ship
    canvas.context.fillStyle = player.colour;
    canvas.context.beginPath();
    canvas.context.arc(
      player.position.x,
      player.position.y,
      player.radius.current,
      0,
      2 * Math.PI // Circumfrence
    );
    canvas.context.fill();
    // Hitbox
    canvas.context.fillStyle = canvas.colours.white
    canvas.context.fillRect(
      player.position.x - (player.width / 2),
      player.position.y - (player.height / 2),
      player.width,
      player.height
    );

    // Bullets
    for (bullet of player.gun.bullets) {
      canvas.context.fillStyle = canvas.colours.black
      canvas.context.fillRect(
        bullet.position.x,
        bullet.position.y,
        bullet.width,
        bullet.height
      );
    }

    // Score
    var date = new Date(null);
    date.setSeconds(player.score);
    var seconds = date.toISOString().substr(11, 8);

    canvas.context.fillStyle = canvas.colours.red;
    canvas.context.font = "32px 'Roboto', sans-serif";
    canvas.context.textAlign = "center";
    canvas.context.fillText(seconds, (canvas.width / 2), canvas.height - 32);
  }
};

var opponent = {
  enemies: [],
  enemy: {
    asteroid: {
      position: {
        x: 0,
        y: 0
      },
      width: 64,
      height: 64,
      spawn: function (x, y) {
        opponent.enemy.asteroid.position.x = x;
        opponent.enemy.asteroid.position.y = y;

        opponent.enemies.push(opponent.enemy.asteroid);
      },
      update: function () {
        opponent.enemy.asteroid.position.y++;

        if (opponent.enemy.asteroid.position.y > canvas.height) {
          opponent.enemy.asteroid.position.y = -opponent.enemy.asteroid.height;
        }
      },
      draw: function () {
        canvas.context.fillStyle = canvas.colours.red;
        canvas.context.fillRect(
          opponent.enemy.asteroid.position.x,
          opponent.enemy.asteroid.position.y,
          opponent.enemy.asteroid.width,
          opponent.enemy.asteroid.height
        );
      }
    }
  },
  start: function () {
    opponent.enemy.asteroid.spawn(Math.random() * (canvas.width), 0);
  },
  update: function () {
    // Iterates backwards for easy removal from array
    if (opponent.enemies.length > 0) {
      for (var enemy = opponent.enemies.length - 1; enemy >= 0; enemy--) {
        opponent.enemies[enemy].update();
      };
    }
  },
  draw: function () {
    // Iterates backwards for easy removal from array
    if (opponent.enemies.length > 0) {
      for (var enemy = opponent.enemies.length - 1; enemy >= 0; enemy--) {
        opponent.enemies[enemy].draw()
      };
    }
  }
};

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ["ms", "moz", "webkit", "o"];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"]
                                   || window[vendors[x] + "CancelRequestAnimationFrame"];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
