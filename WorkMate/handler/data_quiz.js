let question = ['하루는 25시간이다?', // Q1 false
                'WorkMate는 Unity Engine로 만들어졌다?', // Q2 false
                '달팽이도 이빨이 있다?', // Q3 true
                '물고기도 기침을 한다?', // Q4 true
                '감자는 뿌리가 아니고 줄기다?', // Q5 true
                '환갑은 61세를 부르는 말이다?', // Q6 true
                '대한민국에서 두 번째로 큰 섬은 거제도이다?', // Q7 true
                '홍길동은 실존 인물이 아니다?', // Q8 false
                '수은의 원소기호는 H9이다?', // Q9 false
                '1 + 2 + 998 + 3 = 1005 이다?', // Q10 false
                '노르웨이의 수도는 오슬로이다?', // Q11 true
                '칠레의 수도는 푸에르토몬트이다?', // Q12 false
                '셰익스피어 희곡 햄릿의 주인공인 햄릿은 네덜란드 사람이다?', // Q13 false
                '여의도 국회의사당을 둘러싸고 있는 돌기둥의 수는 모두 24개이다?', // Q14 true
                '병아리도 배꼽이 있다?', // Q15 true
                '로댕의 생각하는 사람 동상은 오른손으로 턱을 받치고 있다?', // Q16 true
                '사람의 목뼈는 5개이다?', // Q17 false
                '닭도 왼발잡이, 오른발잡이가 있다?', // Q18 true
                '남극에도 우편번호가 있다?', // Q19 false
                '개의 발에도 땀이 난다?', // Q20 false
                '국악의 장단 중 가장 빠른 장단은 굿거리 장단이다?', // Q21 false
                '남자와 여자의 목소리 중 더 멀리서도 들리는것은 여자의 목소리이다?', // Q22 true
                '로미오와 줄리엣은 처음 만난 날 키스를 했다?', // Q23 true
                '머리를 자주 감으면 머리카락이 빠진다?', // Q24 false
                '뱀은 뒤로 갈 수 있다?', // Q25 false
                '세계 최초로 일기예보를 시작한 나라는 영국이다?', // Q26 false
                '손톱은 피부가 변해서 만들어진 것이다?', // Q27 true
                '개미의 하루 평균 노동시간은 6시간이다?', // Q28 true
                '비행기의 출발 시간은 탑승 문이 완전히 닫히는 시간이다?', // Q29 false
                '조선시대에는 예비군이 있었다?', // Q30 true
                '남극이 북극보다 최저기온이 더 낮다?', // Q31 true
                '캔 커피는 의무적으로 카페인 함량 표기를 해야한다?', // Q32 true
                '세계 최초의 신용카드는 아메리칸 익스프레스이다?', // Q33 false
                '계란은 어린 닭이 낳은 것일 수록 그 크기가 크다?', // Q34 false
                '2 + 2 X 2 = 8이다?', // Q35 false
                '손흥민의 포지션은 미드필더이다?', // Q36 false
                '대한민국 최초의 라면은 삼양라면이다?', // Q37 true
                '북두칠성은 시계의 반대 방향으로 회전한다?', // Q38 true
                '대한민국 육군의 복무 기간은 21개월이다?', // Q39 false
                '1부터 100까지 더한 숫자는 5050이다?', // Q40 true
            ];
let question_answer = [
                    false, false, true, true, true, true, true, false, false, false, // 1~10
                    true, false, false, true, true, true, false, true, false, false, // 11~20
                    false,true, true, false, false, false, true, true, false, true, // 21~30
                    true, true, false, false, false, false, true, true, false, true // 31~40
                ];

module.exports = {
  question,
  question_answer
};