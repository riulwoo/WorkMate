function Ship() {
    this.pos = createVector(width / 2, height - 40); // 우주선의 위치// 화면의 x축 중앙, y축의 아래부터 시작하는 x,y 좌표 벡터.
    this.r = 20; // 우주선의 크기
    this.heading = 0; // 우주선의 현재 머리 위치. (rotate된 정도.)
    this.rotation = 0; // 우주선의 머리가 위치한 각도.
    this.vel = createVector(0, 0); // 우주선의 속도.
    this.isBoosting = false; // 지금 우주선이 발진을 하고 있는가?
    this.Score = 0;
    this.isImmune = true; // 지금 우주선은 무적 상태인가?
    // 처음 생성될때 무적 시간을 준다. 이유는, 게임이 시작되자마자 바로 장애물에 닿아 4점을 잃는 불상사를 미연에 방지하기 위함이다.
    this.immuneCount = 201; // 지금 우주선이 얼마나 무적 상태에 있었는지 나타내는 변수.
    // 201로 초기화해서 시작 무적 3초를 주도록 한다.
  
    this.boosting = function(b) {
      this.isBoosting = b;
    }
  
    // 우주선의 상태를 갱신하는 메서드.
    this.update = function() {
      if (this.isBoosting) {
        this.boost();
      }
      this.pos.add(this.vel);
      this.vel.mult(0.99);
    }
  
    this.boost = function() {
      var force = p5.Vector.fromAngle(this.heading);
      force.mult(0.1);
      this.vel.add(force);
    }
  
    this.render = function() {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.heading + PI / 2);
      if (this.isImmune) // 우주선이 무적 상태라면
      {
        fill(158,158,158); // 약간 밝은 회색으로 우주선을 렌더링한다.
      }
      else 
      {
        fill(255); // 무적 상태가 아니라면 흰색.
      }
      
      triangle(-this.r, this.r, this.r, this.r, 0, -this.r); // x1, y1, x2, y2, x3, y3
      pop();
    }
  
    this.edges = function() {
      if (this.pos.x > width) {
        this.pos.x = width;
      } else if (this.pos.x < 0) {
        this.pos.x = 0;
      }
      if (this.pos.y > height) {
        this.pos.y = height;
      } else if (this.pos.y < 0) {
        this.pos.y = 0;
      }
    }
  
    this.hits = function(gate) // 골인 지점과 닿았을 때 실행되는 메서드.
    {
      var d = dist(this.pos.x, this.pos.y, gate.pos.x, gate.pos.y);
      if (d < gate.r)
      {
        ship.Score += 1;
        return true;
      }
      else
      {
        return false;
      }
    }

    this.hits_asteroid = function(asteroid) { // 장애물과 충돌 했을 때 실행되는 메서드
      var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
      if (d < this.r + asteroid.r)
      {
        return true;
      }
      else
      {
        return false;
      }
    }

    this.switchImmune = function() {
      if (this.isImmune)
      {
        this.immuneCount = 0;
        
        this.isImmune = false;
      }
      else
      {
        // 무적 및 부활 상태가 될때, 원위치에서 부활.
        this.pos.x = width / 2;
        this.pos.y = height - 40;
        this.heading = 0;
        this.vel.set(0, 0); // 전진할 방향의 Vector값을 0,0으로 초기화시킴.
        // 이러면 전진을 하지 않는 상태로 부활함.
        this.isBoosting = false;

        this.isImmune = true;
      }
    }

    this.setRotation = function(a) {
      this.rotation = a;
    }
  
    this.turn = function() {
      this.heading += this.rotation;
    }
  
  }