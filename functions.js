exports.arrayData = (data) =>{
  let arrayDataHere = new Array;
  let lines = data.split('\n');
  lines.map((element) => {
    const expressionBetween = /\((\S[^)]+)\)/;
    const answerExpressionBetween = expressionBetween.exec(element);
    if ((answerExpressionBetween != null) && (typeof (element) == 'string')) {
      const expressionStart = /^http/i.test(answerExpressionBetween[1]);
      const expretionAnywhere = /http/i.test(answerExpressionBetween[1]);
      if (expressionStart) {
        arrayDataHere.push({
          href: answerExpressionBetween[1]
        });
      } else if (expretionAnywhere) {
        const answerExpressionAnywhere = /\((\S+)/.exec(answerExpressionBetween[1]);
        arrayDataHere.push({
          href: answerExpressionAnywhere[1]
        });
      }
    }
  });
  return arrayDataHere;
}