function newItem(n)
{
    this.radius = 20;
    this.x = Math.floor(Math.random() * ((WIDTH - this.radius) - this.radius) + this.radius);
    this.y = Math.floor(Math.random() * ((HEIGHT - this.radius) - this.radius) + this.radius);
    this.type = n;

    // item type
    // 1 : 특수 장애물 생성
    // 2 : 먹으면 기절
    // 3 : 사용시 방향키가 반대로 변함
}