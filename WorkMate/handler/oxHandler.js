module.exports = function quizIndex (){
    const randomIndex = [];
    for(var i = 0; i < 10; i++) {
      randomIndex.push(Math.floor(Math.random() * 40));
    }
    return randomIndex;
}