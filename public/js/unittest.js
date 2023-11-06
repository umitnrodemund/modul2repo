
var _unittest_count=0;
var _unittest_assert_count=0;
var _unittests = [];
var _unittest_current="undefined";

function unittest_add(name,func){
    _unittests.push([name,func]);
}

// add unittests here

unittest_add("unittest_test",function(){
    unittest_assertEqual(1,1);
});
unittest_add("turn_on",function(){
    if(isOn){turnOnOff();} // turn off if in on state
    unittest_assertEqual(isOn,false);
    turnOnOff();
    unittest_assertEqual(isOn,true);
});

unittest_add("plus_button",function(){
    let t = temperature;
    document.getElementById('plus-button').click();
    unittest_assertEqual(temperature,t+1,"plus button did not increase temperature");
    temperature=t;
});
unittest_add("minus_button",function(){
    let t = temperature;
    document.getElementById('minus-button').click();
    unittest_assertEqual(temperature,t-1,"plus button did not decrease temperature");
    temperature=t;
});
unittest_add("mode_button",function(){
    let m=mode;
    document.getElementById('mode-button').click();
    unittest_assertNotEqual(m,mode,"mode change button did not change mode");
    mode=m;
});

unittest_add("level_button",function(){
    let l=level;
    document.getElementById('level-button').click();
    unittest_assertNotEqual(l,level,"level button did not change level");
    level=l
});


unittest_add("api_celsius_to_ fahrenheit",async function(){
    response=await _test_api("/api/fromCelsiusToFahrenheit",{"temperature":18})
    .then((data) => {
        // Handle the JSON response data
        unittest_assertEqual(data.status,200,"api did not respond with status 200","_api_responding");
        return data;
    })
    .catch((error) => {
        // Handle any errors that occur during the request or parsing
        console.error('Error:', error);
    });	
    data=await response.json();
    unittest_assertEqual(data.result,32.4,"api call did not return correct result");
});
unittest_add("api_fahrenheit_to_celsius",async function(){
    response=await _test_api("/api/fromFahrheitToCelsius",{"temperature":32.4})
    .then((data) => {
        // Handle the JSON response data
        unittest_assertEqual(data.status,200,"api did not respond with status 200","_api_responding");
        return data;
    })
    .catch((error) => {
        // Handle any errors that occur during the request or parsing
        console.error('Error:', error);
    });	
    data=await response.json();
    unittest_assertEqual(data.result,18,"api call did not return correct result");
});


function unittest_start(){
    // run each _unittest
    console.log("Unittests registered: "+_unittests.length);
    console.log("Starting...");
    for (var i = 0; i < _unittests.length; i++) {
        _unittest_count++;
        _unittest_current=_unittests[i][0];
        _unittest_assert_count=0;
        _unittests[i][1]();
    }
}
function unittest_assertTrue(a, failure_message=undefined,name="") {
    return unittest_assertEqual(a,true,failure_message,name);
}

function unittest_assertEqual(a, b, failure_message=undefined,name="") {
    if (a != b) {
        if(failure_message != undefined){
            _unittest_msg(false,failure_message + " ["+a+", "+b+"]",name);
        }else{
            _unittest_msg(false,"Expected " + a + " to equal to "+b,name);
        }
    }else{
        _unittest_msg(true,"",name);
    }
    _unittest_assert_count++;
}
function unittest_assertNotEqual(a, b, failure_message=undefined,name="") {
    if (a == b) {
        if(failure_message != undefined){
            _unittest_msg(false,failure_message+ " ["+a+", "+b+"]",name);
        }else{
            _unittest_msg(false,"Expected " + a + " to be not equal to "+b,name);
        }
    }else{
        _unittest_msg(true,"",name);
    }
    _unittest_assert_count++;
}



function _unittest_msg(success,errmsg="",name="") {
    if(name.length>0){
        name=" "+name;
    }else{
        name = " " +_unittest_current+"_"+_unittest_assert_count.toString().padStart(4, '0');
    }
    if(success){
        console.log("(TEST ["+name+"]) [OK] ");
    }else{
        console.log("(TEST ["+name+"]) [ERROR] "+errmsg);
    }
}

async function _test_api(apiUrl,data){
    const headers = {
        'Content-Type': 'application/json', // Specify the content type as JSON
    };
    const requestOptions = {
        method: 'POST',           // Use the POST method
        cache: "no-cache",        // Do not cache the response
        headers,                  // Pass the headers
        body: JSON.stringify(data), // Convert the data object to JSON and send it in the request body
      };
      // Make the POST request using fetch
      return fetch(apiUrl, requestOptions);
}
