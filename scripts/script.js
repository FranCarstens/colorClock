// ### BASIC SCRIPT OUTLINE

// * Get the current time
// * Each second loop through .time spans and write:
//     * hour digit 1 to span .time.u1
//     * hour digit 2 to span .time.u2
//     * min digit 1 to span .time.u3
//     * min digit 2 to span .time.u4
//     * sec digit 1 to span .time.u5
//     * sec digit 2 to span .time.u6
// * Convert time to hex and replace each second
//     * R > Hours: hour + random floor between (255/24) converted to base 16
//     * G > Minutes: minute + random floor between (255/60) converted to base 16
//     * B > Seconds: minute + random floor between (255/60) converted to base 16
//     * hour char 1 to span .class.u1
//     * hour char 2 to span .class.u2
//     * min char 1 to span .class.u3
//     * min char 2 to span .class.u4
//     * sec char 1 to span .class.u5
//     * sec char 2 to span .class.u6
// * Each second grow #minute_line width and increase opacity by (100%/60) - 1.67% 


// CLOCK FUNCTIONS
var     clockContainer = document.querySelector('#clock'),
        colorContainer = document.querySelector('#color'),
        radialContainer = document.querySelector('#radial_gradient'),
        nightContainer = document.querySelector('#night'),
        dayContainer = document.querySelector('#day_night'),
        minuteLine =  document.querySelector('#minute_line')

var leadingZeros = function() {
    return
}

var now = function() {
    var currentTime = new Date()
    return currentTime
}

var getTime = function(time) {
    var thisTime = time
    var hours = ( ("0" + thisTime.getHours()).slice(-2) ).split(""),
        mins = ( ("0" + thisTime.getMinutes()).slice(-2) ).split(""),
        secs = ( ("0" + thisTime.getSeconds()).slice(-2) ).split("")
    return (timeArray = hours.concat(":",mins,":",secs))
}
var getColor = function(time) {
    var thisColor = time
    var red =   ( ("0" + (thisColor.getHours().toString(16))  ).slice(-2)).split(""),
        green = ( ("0" + (thisColor.getMinutes().toString(16)) ) .slice(-2)).split(""),
        blue =  ( ("0" + (thisColor.getSeconds().toString(16))  ).slice(-2)).split("")
    
    return (colorArray = red.concat(":",green,":",blue))
}
var getHEX = function(time) {
    var hexColor = time
    var red =   ("0" + ( (hexColor.getHours()*10 ).toString(16))  ).slice(-2),
        green = ("0" + ( (hexColor.getMinutes()*4 ).toString(16)) ) .slice(-2)
        blue =  ("0" + ( (hexColor.getSeconds()*4 ).toString(16))  ).slice(-2)
    return (hexValue = red + green + blue)
}
var getHEXL = function(time) {
    var hexColor = time
    var red =   ("0" + ( (60+hexColor.getHours()*10 ).toString(16))  ).slice(-2),
        green = ("0" + ( (60+hexColor.getMinutes()*4 ).toString(16)) ) .slice(-2)
        blue =  ("0" + ( (60+hexColor.getSeconds()*4 ).toString(16))  ).slice(-2)
    return (hexValue = red + green + blue)

}

var getTimeColorObject = function() {
    var thisTime = now()
    timeColorObject = {
        time: getTime(thisTime),
        color: getColor(thisTime),
        hex: getHEX(thisTime),
        hexComp: getHEXL(thisTime)
    }
    return(timeColorObject)
}

var moveMinuteLine = function() {
    var ticking = now()
    var sec = ticking.getSeconds() * 1000
    var milli = ticking.getMilliseconds()
    var secondHand = ticking.getSeconds()*1000 + ticking.getMilliseconds()
    minuteLine.style["width"] = (secondHand/60000)*100 + "%"
}

var writeTime = function() {
    var dateObject = getTimeColorObject()
    var thisTime = dateObject["time"]
    for ( var i = 0; i < clockContainer.children.length; i++ ) {
        clockContainer.children[i].innerHTML = thisTime[i]
    }
}

var writeColor = function() {
    var dateObject = getTimeColorObject()
    var thisColor = dateObject["color"]
    for ( var i = 0; i < colorContainer.children.length; i++ ) {
        colorContainer.children[i].innerHTML = thisColor[i]
    }
}

var writeBackground = function() {
    var hexString = getTimeColorObject()
    var thisHEX = hexString["hex"]
    var thisHEXL = hexString["hexComp"]
    radialContainer.style.backgroundImage = 'radial-gradient(circle,#' + thisHEXL + ',#' + thisHEX + ')'
}

// DAYNIGHT FUNCTION

var sunIcon = document.querySelector("#sun"),
    moonIcon = document.querySelector("#moon")

var calcCurrentSeconds = function() {
    // 12 hours = 43200 and 24 hours = 86400
    // 6am = 15600
    // 6pm = 64800
    // maxTime 86399 (at 23:59:59) (sun 50% -90%, moon 50% 90%)
    // 21600 = 100%
    // travel bottom 0 to 90% and back (circle to -90% over 24 hours)
    // travel right to left 0 to 100%
    var currentTime = now()
    var hours = currentTime.getHours()*3600,
        mins = currentTime.getMinutes()*60,
        secs = currentTime.getSeconds(),
        totalSeconds = hours + mins + secs
    return totalSeconds
}

var calcSunPosition = function() {
    var sunTime = calcCurrentSeconds(),
        bottomPos = 0,
        leftPos = 0
    // Midnight to Noon
    if ( 43200 >= sunTime && sunTime >= 0) { 
        bottomPos = ((-21600 + sunTime)/21600)*100*.8 + "%"
        if ( sunTime < 21600 ) {
            leftPos = ((sunTime+21600)/43200)*100 + "%"
        }
        else {
            leftPos = (2 - ((sunTime+21600)/43200))*100 + "%"
        }
    }
    // Noon to Midnight
    else {
        bottomPos = ((21600-(sunTime-43200))/21600)*100*.8 + "%"
        if ( sunTime < 64800 ) {
            leftPos = (2 - ((sunTime+21600)/43200))*100 + "%"
        }
        else {
            leftPos = ((64800-sunTime)*-1)/43200*100 + "%"
        }
    }
    return [bottomPos,leftPos]
}
var calcMoonPosition = function() {
    var moonTime = calcCurrentSeconds(),
        bottomPos = 0,
        leftPos = 0
    // Midnight to Noon
    if ( 43200 >= moonTime && moonTime >= 0) {
        bottomPos = ((21600 - moonTime)/21600)*100*.8 + "%"
        if ( moonTime < 21600 ) {
            leftPos = 100 - ((moonTime+21600)/43200)*100 + "%"
        }
        else {
            leftPos = -100 + (2 - ((moonTime+21600)/43200))*100 + "%"
        }
    }
    // Noon to Midnight
    else {
        bottomPos = ((-21600+(moonTime-43200))/21600)*100*.8 + "%"
        if ( moonTime < 64800 ) {
            leftPos = 100 - (2 - ((moonTime+21600)/43200))*100 + "%"
        }
        else {
            leftPos = 100 - ((64800-moonTime)*-1)/43200*100 + "%"
        }
    }
    return [bottomPos,leftPos]
}

var calcAstroBackground = function() {
    var dayTime = calcCurrentSeconds(),
        opacity = 0
    
    // Sunrise
    if ( 19800 <= dayTime && dayTime <= 23400 ) {
        opacity = (dayTime - 19800)/3600
        console.log("sunrise",dayTime,opacity)
    }
    // Sunset
    else if (63000 <= dayTime && dayTime <= 66600 ) {
        opacity = 1 - ((dayTime - 63000)/3600)
        console.log("sunset",dayTime,opacity)
    }
    // Day
    else if ( 23400 < dayTime && dayTime < 63000) {
        opacity = 1
        console.log("day",dayTime,opacity)
    }
    // Night    
    else if ( dayTime < 19800 || dayTime > 66600 ) {
        opacity = 0
        console.log("night",dayTime,opacity)
    }
    else opacity = NaN
    
    return opacity

    
}

var setAstroPosition = function() {
    var sunPosition = calcSunPosition()
    var moonPosition = calcMoonPosition()
    var dayOpacity = calcAstroBackground()
    sunIcon.style.bottom = sunPosition[0]
    sunIcon.style.left = sunPosition[1]

    moonIcon.style.bottom = moonPosition[0]
    moonIcon.style.left = moonPosition[1]
    nightContainer.style.backgroundImage = 'linear-gradient(rgba(53, 109, 204,' + dayOpacity + '),rgba(80, 121, 189,' + dayOpacity + '), rgba(129, 160, 212,' + dayOpacity + '), rgba(255,255,255,' + dayOpacity + '))'
}






// START CLOCKS

var runClock = function() {
    writeTime()
    writeColor()
    writeBackground()

}

setInterval(setAstroPosition,1000)
setInterval(runClock,1000)
setInterval(moveMinuteLine,100)

// STYLES SWITCHER

document.querySelector("#radial_btn").addEventListener('click',function(){
    docBody = document.querySelector('body')
    docBody.className = "radial"
})
document.querySelector("#airport_btn").addEventListener('click',function(){
    docBody = document.querySelector('body')
    docBody.className = "airport"
})
document.querySelector("#daynight_btn").addEventListener('click',function(){
    docBody = document.querySelector('body')
    docBody.className = "daynight"
})