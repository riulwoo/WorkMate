// 캐릭터 움직임 모션 이미지
let moveasset = [
  [
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/down.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/down2.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/down.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/down1.png",
  ], //아래
  [
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/left1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/left.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/left1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/left.png",
  ], //왼쪽
  [
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/up1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/up.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/up2.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/up.png",
  ], //위
  [
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/right1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/right.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/right1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/right.png",
  ], //오른
  [
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/leftdown1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/leftdown.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/leftdown1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/leftdown.png",
  ], //왼아래
  [
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/leftup1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/leftup.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/leftup2.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/leftup.png",
  ], //왼위
  [
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/rightdown1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/rightdown.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/rightdown1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/rightdown.png",
  ], //오른아래
  [
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/rightup1.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/rightup.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/moveasset/rightup2.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/rightup.png",
  ], //오른위
];

// 게임 배경 이미지
let bgImage =
  "url('https://workmate.s3.ap-northeast-2.amazonaws.com/bg_game.png')";

// 게임 로딩 이미지
let ox_loading =
  "url('https://workmate.s3.ap-northeast-2.amazonaws.com/ox_loading.gif')";
let flip_loading =
  "url('https://workmate.s3.ap-northeast-2.amazonaws.com/flip_loading.gif')";
let surv_loading =
  "url('https://workmate.s3.ap-northeast-2.amazonaws.com/surviv_loading.gif')";

// 게임 맵 이미지
let ox_map = new Image();
ox_map.src = "https://workmate.s3.ap-northeast-2.amazonaws.com/ox_map.png";

let flip_map = new Image();
flip_map.src = "https://workmate.s3.ap-northeast-2.amazonaws.com/flip_map.png";

let surv_map = new Image();
surv_map.src =
  "https://workmate.s3.ap-northeast-2.amazonaws.com/surviv_map.png";
