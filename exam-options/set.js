

//var url = "questions-db/set1.json";
var htmlTemplate = "";
var totalmarks=null,totalTime=null;
var perquestionMarks=null;
var setName=null;
/*$.ajax({
  method: "GET",
  url: url
})
  .done(function( data ) {
    populateQuestions( data );
  });*/


  (function checkcookie(){
  	if(getCookie("username").length != 0){
  		$("#user-details").removeClass("hide");
	$("#username").text(getCookie("username"));
  	}
  })();
$("#signout").off("click.signout").on("click.signout",function(){
	document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
	window.location.href ="index.html";
})
$("nav").on("click","a",function(e){
	setName = $(this).data("set");
	var authenticated = getCookie("authenticated") || "false";
	$.post( "getSet.php", { authenticated: authenticated, setname: setName},function( data ) {
	 if(data != "false"){
	 	populateQuestions(data)
	 }else{
	 	window.location.href ="index.html";
	 }
	})
	$(this).closest(".questions-set").hide();
	$("#submitAnswers").show();
})
function populateQuestions(data){
	updateCookie(data.id+"_timer",data.time);
	$("#timer_container").removeClass("hide");
	$("#user-details").removeClass("hide");
	$("#username").text(getCookie("username"));

	//var setTime = 1 *15,
      //  display = document.querySelector('#time');
    //startTimer(setTime, display);

	var questions = data.questions;
	len=questions.length;
	totalmarks = data.marks;
	totalTime=data.time;
	perquestionMarks = totalmarks/len;


	for(var i=1;i <= len; i++){
		var multiplechoice="";
		var options = questions[i-1].options;
		for(var j=0;j<options.length ; j++){
			multiplechoice += '<div class="radio"><label><input type="radio" name="optradio_'+i+'" value="'+(j+1)+'">'+options[j]+'</label></div>';
		}
		htmlTemplate = '<div class="card"> <div class="card-header" role="tab" id="headingOne"> <h5 class="mb-0"> <a data-toggle="collapse" data-parent="#accordion" href="#collapse'+i+'" aria-expanded="true" aria-controls="collapse'+i+'"> Question #'+i+' </a> </h5> </div><div id="collapse'+i+'" class="collapse" role="tabpanel" aria-labelledby="headingOne"> <div class="card-block" data-answer="'+questions[i-1].ans+'"><div class="questions-block">'+questions[i-1].text+'</div><div class="multichoice-questions">'+multiplechoice+'</div></div> </div> </div>';
		//$(htmlTemplate).find(".questions-block").innerHTML(questions[i].text);
		//$(htmlTemplate).find(".multichoice-questions").innerHTML(questions[i].options[0]);
		$("#accordion").append(htmlTemplate);
	}

}
//setInterval(updateCookie,1000);

function updateCookie(cookieName,durationInMin){
	var durationInsec = durationInMin * 60;
	setInterval(function(){
		if(getCookie(cookieName) >= 0){
			durationInsec = getCookie(cookieName) == "" ? durationInsec : getCookie(cookieName);
			if(durationInsec == 0){
				$("#submitAnswers").addClass("hide");
			}else{
				$("#submitAnswers").removeClass("hide");
			}
		}
			durationInsec = durationInsec-1;
			if(!(durationInsec < 0)){
				setCookie(cookieName,durationInsec);
			}
		//}
		var timeRem = getCookie(cookieName);
		var min = parseInt(timeRem/60);
		var sec = timeRem%60;
		min = min < 10 ? "0"+min : min;
		sec = sec < 10 ? "0"+sec : sec;
		document.querySelector('#time').textContent = min + ":" + sec; 

	},1000)
}

$("#submitAnswers").on("click",function(e){
	evaluateAnswer(e);
	$(this).hide();
})
$("#accordion").on("click",".card input[type=radio]",function(e){
	$(this).closest(".card").find(".card-header").addClass("alert-warning");
})

function evaluateAnswer(event){
	//$(event).hide();
	var wrongAnswer=0,
		correctAns=0,
		notansweredQuestions = "User didnt answered questions ",
		questionsets=$(".card-block"),
		len=questionsets.length;
	for(var i=0;i < len ; i++){
		var answer = $(".card-block").eq(i).data("answer");
		var userAns=$(".card-block").eq(i).find('input[type=radio]:checked').val();
		if(answer == userAns){
			correctAns = correctAns+1;
			$(".card-block").eq(i).closest(".card").find(".card-header").removeClass("alert-warning").addClass("alert-success");
		}else if(userAns != undefined){
			wrongAnswer = wrongAnswer+1;
			$(".card-block").eq(i).closest(".card").find(".card-header").removeClass("alert-warning").addClass("alert-danger");
		}else{
			notansweredQuestions = notansweredQuestions + (i+1) + ' ';
		}

	}
	var userTotalMarks = (correctAns*perquestionMarks) - (parseInt(wrongAnswer/4)*perquestionMarks);

	//var fullResult="correctAns "+correctAns+" wrongAnswer "+wrongAnswer+" userTotalMarks "+userTotalMarks+" notansweredQuestions "+ notansweredQuestions;
	var fullResult="correctAns "+correctAns+" wrongAnswer "+wrongAnswer+" userTotalMarks "+userTotalMarks;
	$.post( "result.php", { name: getCookie("username"), result: fullResult, time : new Date().toTimeString(), setName: setName  },function( data ) {
	  if(data == true){
	  		populateResult(correctAns,wrongAnswer,userTotalMarks);
	  }
	});


}
function populateResult(correctAns,wrongAnswer,userTotalMarks){
	$(".totalMarks").html("Number of correct Answer :"+correctAns+" Number of wrong Answer :"+wrongAnswer+" Total marks awarded "+userTotalMarks);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exmin) {
    var d = new Date();
    d.setTime(d.getTime() + (exmin*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
//test


function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds; 

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
}

/*var fiveMinutes = 60 * 5,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);*/