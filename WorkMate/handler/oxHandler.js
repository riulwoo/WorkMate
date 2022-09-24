module.exports = function quizIndex () {
    const randomIndex = [];

    for(var i = 0; i < 5; i++) {
      randomIndex.push(Math.floor(Math.random() * 39 - i));
    }
    return randomIndex;
}