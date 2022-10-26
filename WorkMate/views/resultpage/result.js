// sortedScore = 유저의 id, score, nick
// name / score 클래스의 innerText에 넣기
let names = document.querySelectorAll('.name');
let scores = document.querySelectorAll('.score');

for(let i = 0; i < sortedScore.length; i++)
{
  names[i].innerText = sortedScore[i].nick;
  scores[i].innerText = sortedScore[i].score;
}

document.getElementById('first').innerText = sortedScore[0].nick;
document.getElementById('second').innerText = sortedScore[1].nick;
document.getElementById('third').innerText = sortedScore[2].nick;
