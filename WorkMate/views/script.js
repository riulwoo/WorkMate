var Matchbtn = document.getElementById("matchStart"); //매칭하기 버튼
        var cancelbtn = document.getElementById("matchcancel"); //방나가기 / 매치 나가기 버튼
        var Croombtn = document.getElementById("createroom"); //방만들기 버튼 
        var Jroombtn = document.getElementById("joinroom"); //방 입장 버튼
        var start = document.getElementById("start"); //게임 시작 버튼
        var nicktxt = document.getElementById("nick");
        var roomid = '';
        var a = 1;
  
        function PlayerBall(id){ //자신이 서버랑 주고받을 정보들
            this.id = id;
            this.color = "#FF00FF";
            this.x = 1024/2;
            this.y = 768/2;
            this.nick = "player";
            this.score = 0;
        }
        
        var userpool  = [];
        var userinfo = {};
        var myId;
        var socket = io();
        Matchbtn.addEventListener("click", match);
        Croombtn.addEventListener("click", function () {
          console.log("create room 눌림 " + myId + userinfo[myId]);
          socket.emit('createroom', {
            id : "hi", 
            roomid : roomid, 
            nick : nickname,
          }); 
        })
        Jroombtn.addEventListener('click', function () {
          console.log('join room 눌림');
          socket.emit('joinroom', {
            id : myId,  
            nick : nickname
          }); 
        })
        start.addEventListener("click", function () {
          socket.emit('startgame', myId);
        })

          
        cancelbtn.addEventListener("click",function () {
          socket.emit("matchcancel", myId);
          console.log('나가기 눌림');
        })
        function joinUser(id,color,x,y){
            let player = new PlayerBall(id);
            player.color = color;
            player.x = x;
            player.y = y;

            userpool.push(player);
            userinfo[id] = player;

            return player;
        }

        function leaveUser(id){
            for(var i = 0 ; i < userpool.length; i++){
                if(userpool[i].id == id){
                    userpool.splice(i,1);
                    break;
                }
            }
            delete userinfo[id];
        }
        socket.on('matchfail', function(data) {
           alert('다시 시도해주세요 찐따련아');
        })
        socket.on('user_id', function(data){
            myId = data;
        })

        socket.on('matchsuccess', function() {
          var ajaxOption = {
                url : "/gamebase",
                async : true,
                type : "GET",
                dataType : "html",
                cache : false
          };
          
          $.ajax(ajaxOption).success(function(url){
            // Contents 영역 삭제
            $('#main').children().remove();
            // Contents 영역 교체
            $('#main').html(url);
          });
        })
        socket.on('gamestart', function() {
          var ajaxOption = {
                url : "/gamebase",
                async : true,
                type : "GET",
                dataType : "html",
                cache : false
          };
          
          $.ajax(ajaxOption).success(function(url){
            // Contents 영역 삭제
            $('#main').children().remove();
            // Contents 영역 교체
            $('#main').html(url);
          });
        })

  
        socket.on('update_state', function(data){ // setinterval 마다 발생
            updateState(data.id, data.x, data.y);
        })

        function match(e) {
          let player = userinfo[myId];        // 자신의 정보불러옴
          let nickname = "nickname " + a;
          roomid  =
          (new Date().getTime() + Math.random()).toString(36).substring(2,7);
          
          socket.emit("matchStart", {
            id : myId,
            roomid : roomid,
            nick : nickname, 
            score : 0
          });
          console.log("매치 시작 보냈다?");
          // 데이터 넣고 서버에 스타트메시지
          // gif로 로딩중이미지 띄움
          // gif띄우는건 css속성 가져와서 destroy하면 될듯
          /*setTimeout(()=>{
            // gif 없앤다
            socket.emit('matchtimeover', myId);    
            // 15초후 서버에 타임오버 메시지
            }, 1500)*/
          }
        