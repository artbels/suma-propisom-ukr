/**
 * Convert number to sum string ukrainian 
 * @ artbels
 * artbels@gmail.com
 * 2016
 * ver 0.0.1
 *
 * forked from http://javascript.ru/forum/misc/40642-summa-propisyu.html
 *
 */

;(function () {
  var SumPropis = this.SumPropis = function (number) {

    if (number === undefined) return
    if (number === '') return

    if (typeof number == 'string') {
      number = number.replace(/[^\d\.,]/g, '')

      var countCommas = number.split(/,/).length - 1
      if ((countCommas == 1) && !/\./.test(number)) {
        number = number.replace(/,/, '.')
      }

      number = number.replace(/,/g, '')
    }

    if (typeof number == 'number') number = number.toString()

    var decimal = '00'
    var decimalMatch = number.match(/\.(\d+)/)
    if (decimalMatch) decimal = decimalMatch[1]

    if (decimal.length > 2) {
      var temp = decimal.slice(0, 2) + '.' + decimal.slice(2)
      decimal = Math.round(Number(temp)).toFixed(0)
    }

    var integer = number.replace(/\.\d*$/, '')

    var currency = {
      nom: 'гривень',
      one: 'гривня',
      twoFour: 'гривні'
    }

    var currencyDecimals = {
      nom: 'копійок',
      one: 'копійка',
      twoFour: 'копійки'
    }

    if (integer === '0') {
      return 'нуль ' + currency.nom + ' ' + decimal + ' ' + currencyDecimals[getForm(decimal)]
    }

    var oneNine = {
      1: {
        fem: 'одна',
        male: 'один'
      },
      2: {
        fem: 'дві',
        male: 'двa'
      },
      3: 'три',
      4: 'чотири',
      5: "п'ять",
      6: 'шість',
      7: 'сім',
      8: 'вісім',
      9: "дев'ять"
    }

    var eleven2nineteen = {
      11: 'одинадцять',
      12: 'дванадцять',
      13: 'тринадцять',
      14: 'чотирнадцять',
      15: "п'ятнадцять",
      16: 'шістнадцять',
      17: 'сімнадцять',
      18: 'вісімнадцять',
      19: "дев'ятнадцять"
    }

    var ten2ninety = {
      10: 'десять',
      20: 'двадцять',
      30: 'тридцять',
      40: 'сорок',
      50: "п'ятдесят",
      60: 'шістдесят',
      70: 'сімдесят',
      80: 'вісімдесят',
      90: "дев'яносто"
    }

    var hundreds = {
      100: 'сто',
      200: 'двісті',
      300: 'триста',
      400: 'чотириста',
      500: "п'ятсот",
      600: 'шістсот',
      700: 'сімсот',
      800: 'вісімсот',
      900: "дев'ятсот"
    }

    var thousands = {
      1000: {
        nom: 'тисяч',
        one: 'тисяча',
        twoFour: 'тисячі'
      },
      1000000: {
        nom: 'мільйонів',
        one: 'мільйон',
        twoFour: 'мільйона'
      },
      1000000000: {
        nom: 'мільярдів',
        one: 'мільярд',
        twoFour: 'мільярда'
      },
    // continue if needed
    }

    var digitGroups = []

    var digitGroupsLen = Math.ceil(integer.length / 3)

    for (var i = 0; i < digitGroupsLen; i++) {
      var lastThree = integer.match(/\d{1,3}$/)
      digitGroups.unshift(lastThree[0])
      integer = integer.replace(/\d{1,3}$/, '')
    }

    return workGroupArr(digitGroups)

    /**
     * Functions
     */

    function getForm (str) {
      if (str.length >= 2) {
        var lastTwo = str.slice(-2)

        if ((lastTwo >= '11') && (lastTwo <= '14')) {
          return 'nom'
        }
      }

      var last = str.slice(-1)

      if (last == '1') {
        return 'one'
      }

      if ((last >= '2') && (last <= '4')) {
        return 'twoFour'
      }

      return 'nom'
    }

    function workGroup (str, gender) {
      var len = Number(str).toString().length

      var wordArr = []

      var last = Number(str.slice(-1))

      if (len == 3) {
        wordArr.push(hundreds[Number(str.slice(0, 1) + '00')])
      }

      if (len >= 2) {
        var lastTwo = str.slice(-2)

        if (lastTwo == '10') {
          wordArr.push(ten2ninety[10])
        } else if ((lastTwo >= '11') && (lastTwo <= '19')) {
          wordArr.push(eleven2nineteen[lastTwo])
        } else if (lastTwo >= '20') {
          wordArr.push(ten2ninety[Number(lastTwo.slice(0, 1) + '0')])

          if ([1, 2].indexOf(last) != -1) {
            wordArr.push(oneNine[last][gender])
          } else if (last >= '3') {
            wordArr.push(oneNine[last])
          }
        }
      } else if (len === 1) {

        if ([1, 2].indexOf(last) != -1) {
          wordArr.push(oneNine[last][gender])
        } else if (last >= 3) {
          wordArr.push(oneNine[last])
        }
      }

      return wordArr.join(' ')
    }

    function workGroupArr (arr) {
      var finalArr = []
      var len = arr.length


      for (var i = 0; i < len; i++) {
        var group = arr[i]
        var groupNum = len - i
        var gender = (groupNum <= 2) ? 'fem' : 'male'
        var form = getForm(group)

        var tempStr = workGroup(group, gender)
        if(tempStr) {
          finalArr.push(tempStr)
        
          if(groupNum >= 2) {
            var thousIndex = Math.pow(1000, (groupNum - 1))
            finalArr.push(thousands[thousIndex][form])
          }     
        }

        if (groupNum == 1) {
            finalArr.push(currency[form])
        }  
      }

      finalArr.push(decimal)
      finalArr.push(currencyDecimals[getForm(decimal)])

      return finalArr.join(' ').trim()
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SumPropis
  }
})()
