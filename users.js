(function() {
  window.API = {};

  var signInForm = document.getElementById('signin_user_form');
  var signUpForm = document.getElementById('sign_up_user_form');
  var userScore = document.querySelector('.score-user tbody');
  var signUpBtn = document.getElementById('sign_up_btn');
  var userInfoName = document.getElementById('user_info_name');
  var logout = document.getElementById('logout');
  var userInfo = document.querySelector('.user-info');
  window.userInfoScore = document.getElementById('user_info_score');

  if (getCookie("username")) {
    userInfoName.innerHTML = getCookie("username");
    userInfoScore.innerHTML = getCookie("score");
    document.body.className = "login";
  } else {
    document.body.className = "";
  }

  // получаем данные (пользователей) сразу при загрузке страницы и выводим их
  ajax('read', null, function(res) {
    res = JSON.parse(res);
    var i, tr, td, value; 

    for (i = 0; i <= res.length; i++) {
      tr = document.createElement('TR');

      for (var key in res[i]) {
        if (key == 'password') continue;

        td = document.createElement('TD');
        value = document.createTextNode(res[i][key]);

        td.appendChild(value);
        tr.appendChild(td);
      };

      userScore.appendChild(tr);
    };
  });

  // onsubmit для обеих форм - зарегистрироваться/войти
  [signInForm, signUpForm].forEach(function(el) {
    el.addEventListener('submit', function(e) {
      e.preventDefault();

      var data = {
        name: this.userName.value,
        password: this.userPass.value,
        formType: this.formType.value, // на сервере определяется форма по этому типу - регистрация это или вход. 
        score: 0
      }

      // отправляем пользователя и получаем ответ
      ajax('create', data, function(res) {
        res = JSON.parse(res);
        console.log(res);

        if (res.status) {
          if (res.status == "success") { // если есть такой пользователь в "базе"
            document.cookie = "username=" + res.data.name;
            document.cookie = "score=" + res.data.score; // записать юзера в куки
            userInfoName.innerHTML = res.data.name;
            userInfoScore.innerHTML = res.data.score;
            document.body.className = "login";
            return alert(res.message);
          } else {
            return alert(res.message);
          }
        }
      });
    }, false);
  })

  logout.addEventListener('click', function(e) {
    e.preventDefault();
    document.cookie = "username=";
    document.body.className = "";
  }, false)

  // onclick - меняет формы зарегистрироваться/войти
  signUpBtn.addEventListener('click', function() {
    if (signUpForm.className == "hide") {
      signUpForm.className = "";
      signInForm.className = "hide";
      this.innerHTML = "Уже есть аккаунт?"
    } else {
      signUpForm.className = "hide";
      signInForm.className = "";
      this.innerHTML = "Создать аккаунт?"
    }
  }, false);

  API.updateScore = function(score) {
    var data = {
      name: getCookie("username"),
      score: score
    };

    ajax('update', data, function(res) {
      console.log(res);
    });
  };

  function ajax(reqType, data, callback) {
    var parsedString = '';

    if (data) {
      for (var key in data) {
        parsedString += key + '=' + data[key] + '&';
      }
      parsedString = parsedString.slice(0, -1);
    }

    reqType = reqType ? '?reqType=' + reqType + (data ? '&' : '') : '';

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        callback(xhr.responseText);
      }
    }
    xhr.open('GET', 'server.php' + reqType + parsedString, true);
    xhr.send();
  }

  function getCookie(c_name) {
    var i,x,y,ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g,"");
      if (x == c_name) {
          return unescape(y);
      }
    }
  }

  window.getCookie = getCookie;
  window.ajax = ajax;
})();
