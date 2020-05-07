import axios from 'axios';


export function getToken() {
  var user_token = eval('(' + window.sessionStorage.getItem("user_token") + ')')
  var now = new Date()
  if (new Date(user_token['expirationDate']) < now) {
      throw "Token has been expired";
  }
  return user_token['value']
}


export function getBrickHeaders() {
  var headers = {
      "Authorization": "bearer " + getToken()
  }
  return headers
}

