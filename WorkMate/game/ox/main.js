let target = document.querySelector("#dynamic");

// 출력할 문자열을 선택.
function randomString()
{
    let stringArr = ["Game Over"]; // 출력할 문자열들의 목록
    let selectString = stringArr[Math.floor(Math.random() * stringArr.length)]; // 문자열 배열의 길이 미만의 난수를 만듬.
    let selectStringArr = selectString.split(""); // 선택한 문자열을 한글자씩 나눠 배열 형태로 저장.

    return selectStringArr; // 한글자씩 저장한 배열을 리턴.
}

// 타이핑 리셋
function resetTyping()
{
    target.textContent = ""; // #dynamic 속성을 가진 p 태그의 내용을 없앰.
    dynamic(randomString()); // dynamic 함수를 실행.
}

// 한글자씩 텍스트 출력 함수
function dynamic(randomArr)
{
    if (randomArr.length > 0)
    {
        target.textContent += randomArr.shift(); // 배열의 가장 첫번째 요소를 빼와서 p 태그 안에 넣는다. console.log(randomArr)로 확인해보면, 배열의 크기는 줄어든다.
        setTimeout(function(){
            dynamic(randomArr);
        }, 80); // 재귀함수의 형태이다. 0.08초마다 함수를 다시 불러와서 배열의 길이가 0이 될 때까지 실행한다.
    }
    else // 배열이 줄어들다가 길이가 0이 되면, 3초 뒤에 문자열을 초기화.
    {
        setTimeout(resetTyping, 3000);
    }
}
dynamic(randomString());

// 커서 깜빡임 효과
function blink()
{
    target.classList.toggle("active"); // 불러온 p 태그의 클래스 목록에 active를 넣음. (이미 active 클래스가 들어가있다면 지움. 그래서 토글임)
}
setInterval(blink, 500); // 0.5 초에 한번씩 실행.