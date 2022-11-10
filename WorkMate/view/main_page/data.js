// 캐릭터 움직임 모션 이미지
let moveasset = [
  [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451716855582750/dd_17.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451715794411560/gg_17.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451716520017940/h_18.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451716855582750/dd_17.png",
  ], //아래
  [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451526304137217/gg_12.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451526694223902/h_12.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451527017172992/dd_12.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451527461765121/ff_12.png",
  ], //왼쪽
  [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451442615197716/ff_05.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451443055607838/gg_05.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451443529560134/h_05.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451443999326228/dd_05.png",
  ], //위
  [
    "https://cdn.discordapp.com/attachments/980090904394219562/1035900756055830570/unknown.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1035900909617696818/h_12.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1035900933642657832/unknown.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1035900946980552805/h_12.png",
  ], //오른
  [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451629089751120/ff_17.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451629450481664/gg_16.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451629777621082/h_17.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451630155120680/dd_16.png",
  ], //왼아래
  [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451379939717130/dd_03.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451380354945055/ff_03.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451380728246362/gg_03.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451381126709258/h_03.png",
  ], //왼위
  [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451865224884234/gg_18.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451865572999279/h_19.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451865933713429/dd_18.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451866286047272/ff_19.png",
  ], //오른아래
  [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451493651496972/ff_07.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451494075125800/gg_07.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451494498734151/h_07.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451494926569512/dd_07.png",
  ], //오른위
];

// 게임 배경 이미지
let bgImage =
  "url('https://media.discordapp.net/attachments/980090904394219562/1039145710551040030/logo.png')";

// 게임 로딩 이미지
let ox_loading =
  "url('https://media.discordapp.net/attachments/980090904394219562/1040310345148944425/OX.gif?width=1395&height=676')";
let flip_loading =
  "url('https://media.discordapp.net/attachments/980090904394219562/1040310345845194762/2eb05ba7899cfc30.gif?width=1395&height=676')";
let surv_loading =
  "url('https://media.discordapp.net/attachments/980090904394219562/1040310345509642281/04d8188d12317b6b.gif?width=1395&height=676')";


// 게임 맵 이미지
let ox_map = new Image();
ox_map.src =
  "https://cdn.discordapp.com/attachments/914865394643271762/1037997369935020062/map-export.png";

let flip_map = new Image();
flip_map.src =
  "https://cdn.discordapp.com/attachments/914865394643271762/1037997369477836800/map.png";

let surv_map = new Image();
surv_map.src =
  "https://cdn.discordapp.com/attachments/914865394643271762/1037997369935020062/map-export.png";
