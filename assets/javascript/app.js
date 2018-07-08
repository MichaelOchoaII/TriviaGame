$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  var trivia = {
    // trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',
    // questions options and answers data
    questions: {
      q1: 'Who is the best actor?',
      q2: 'What is a home remedy for diarrhea',
      q3: '1*1?',
      q4: 'What year is it?',
      q5: "What state is Phoenix in?",
      q6: 'Yoda',
      q7: "Best band?"
    },
    options: {
      q1: ['nicolas cage', 'samuel l jackson', 'leonardo dicaprio', 'bruce willis'],
      q2: ['bean burrito', 'bananas', 'coffee', 'candy'],
      q3: ['1', '0', '-1', '2'],
      q4: ['1999', '2018', '2081', '6'],
      q5: ['Arizona','California','Utah','New Mexico'],
      q6: ['back to the future','star wars','star trek','alien'],
      q7: ['the beatles', 'led zeppelin', 'metallica','nickelback']
    },
    answers: {
      q1: 'nicolas cage',
      q2: 'bananas',
      q3: '1',
      q4: '2018',
      q5: 'Arizona',
      q6: 'star wars',
      q7: 'nickelback'
    },
    pictures: {
      q1: '<img src="https://cdn1.thr.com/sites/default/files/imagecache/portrait_300x450/2011/06/nicolas_cage_2011_a_p.jpg" />',
      q2: '<img src="https://images-na.ssl-images-amazon.com/images/I/71gI-IUNUkL._SY355_.jpg" />',
      q3: '<img src=""/>',
      q4: '<img src=""/>',
      q5: '<img src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arizona.svg"/>',
      q6: '<img src="https://assets.saatchiart.com/saatchi/185894/art/3678383/2748268-AQXFCLTV-7.jpg"/>',
      q7: '<img src="https://cps-static.rovicorp.com/3/JPG_400/MI0003/458/MI0003458556.jpg?partner=allrovi.com"/>'
    },
    // trivia methods
    // method to initialize game
    startGame: function(){
      // restarting game results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // show game section
      $('#game').show();
      
      //  empty last results
      $('#results').html('');
      
      // show timer
      $('#timer').text(trivia.timer);
      
      // remove start button
      $('#start').hide();
  
      $('#remaining-time').show();
      
      // ask first question
      trivia.nextQuestion();
      
    },
    // method to loop through and display questions and options 
    nextQuestion : function(){
      
      // set timer to 20 seconds each question
      trivia.timer = 10;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      // to prevent timer speed up
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      // gets all the questions then indexes the current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // an array of all the user options for the current question
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
      // creates all the trivia guess options in the html
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning : function(){
      // if timer still has time left and there are still questions left to ask
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // the time has run out and increment unanswered, run result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Out of time! The answer is '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      // if all the questions have been shown end the game, show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3>Hell Yeah!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>play again?</p>');
        
        // hide game sction
        $('#game').hide();
        $('#question').hide();
        ;
        
        // show start button to begin a new game
        $('#start').show();
      }
      
    },
    // method to evaluate the option clicked
    guessChecker : function() {
      
      // timer ID for gameResult setTimeout
      var resultId;
      
      // the answer to the current question being asked
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // turn button green for correct
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Good.</h3>');
      }
      // else the user picked the wrong option, increment incorrect
      else{
        // turn button clicked red for incorrect
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 3000);
        $('#results').html('<h3>You Suck! the right answer is '+ currentAnswer +'</h3>');
        $('#pictures').prepend('<div>' + Object.values(trivia.pictures)[trivia.currentSet] + '</div>');
      }
      
    },
    // method to remove previous question results and options
    guessResult : function(){
      
      // increment to next question set
      trivia.currentSet++;
      
      // remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      $('#pictures div').remove();
      
      // begin next question
      trivia.nextQuestion();
       
    }
  
  }