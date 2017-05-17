$(function () {
    var W, H, canvas, ctx;

    var config = {
      people : {
        radius : 20,
        count : 20,
        color: "#A58D64"
      },
      food : {
        radius : 10,
        count : 20,
        color: "#67C21D"
      }
    };

    var particles = [];
    var people = [];
    var food = [];

    W = window.innerWidth * .99;
    H = window.innerHeight * .99;
    canvas = $("#canvas").get(0); //this "get(0) will pull the underlying non-jquery wrapped dom element from our selection
    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext("2d"); // settng the context to 2d rather than the 3d WEBGL
    console.log(ctx);

    //Setup particle class
    function Particle(config) {
        this.health = 400;
        this.color = "#000";
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.direction = {
            "x": -1 + Math.random() * 2,
            "y": -1 + Math.random() * 2
        };
        this.vx = 1 * Math.random() + 1;
        this.vy = 1 * Math.random() + 1;
        //this.radius = .9 * Math.random() + 1;
        this.radius = 3;
        this.move = function () {
            this.x += this.vx * this.direction.x;
            this.y += this.vy * this.direction.y;
        };
        this.changeDirection = function (axis) {
            this.direction[axis] *= -1;
        };
        this.draw = function () {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fill();
        };
        this.boundaryCheck = function () {
            if (this.x >= W) {
                this.x = W;
                this.changeDirection("x");
            } else if (this.x <= 0) {
                this.x = 0;
                this.changeDirection("x");
            }
            if (this.y >= H) {
                this.y = H;
                this.changeDirection("y");
            } else if (this.y <= 0) {
                this.y = 0;
                this.changeDirection("y");
            }
        };
    } //end particle class

    function clearCanvas() {
        ctx.clearRect(0, 0, W, H);
    } //end clear canvas

    function createParticles(conf) {
      var particles = [];
      var particleCount = conf.count || 20;
        for (var i = particleCount - 1; i >= 0; i--) {
            p = new Particle();
            p.color  = conf.color;
            p.radius = conf.radius;
            particles.push(p);
        }
      return particles;
    }

    function drawParticles(particles) {
        for (var i = 0; i < particles.length; i++) {
            p = particles[i];
            p.draw();
        }
    } //end drawParticles

    function checkOverlappingFood(x,y,r){
      var intersects = false;
      var eaten = false;
      for (var i = 0; i < food.length && !eaten; i++) {
        f = food[i];
        // calculates the intersecting circles
        if(Math.hypot(x-f.x, y-f.y) <= (r + f.radius)){
          intersects = true;
          food.splice(i, 1);
          eaten = true;
        }
      }
      return intersects;

    }
    function updatePeople() {
        for (var i = 0; i < people.length; i++) {
            p = people[i];
            if(p.health > 0) {
              p.draw()
              p.move();
              p.boundaryCheck();
              if(checkOverlappingFood(p.x,p.y,p.radius)){
                p.health += 100;
                console.log('more health');
              } else {
                p.health--;
              }
            }  else {
              people.splice(i, 1);
            }
        }
    }
    function updateFood() {
        for (var i = 0; i < food.length; i++) {
            p = food[i];
            p.draw()
            p.move();
            p.boundaryCheck();
        }
    }

    function initParticleSystem() {
        people = createParticles(config.people);
        drawParticles(people);

        food = createParticles(config.food);
        drawParticles(food);

        setInterval(function(){
          if(food.length > 2 && food.length < config.food.count){
            food = createParticles(config.food);
            drawParticles(food);
          }
        },5000)

    }

    function animateParticles(particles) {
                clearCanvas();
        updatePeople();
        updateFood();
        requestAnimationFrame(animateParticles);
    }

    initParticleSystem();
    requestAnimationFrame(animateParticles);

});
