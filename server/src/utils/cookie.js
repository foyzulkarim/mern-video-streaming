

const setCookie = async (res, cookieName, cookieValue, options) => {
  res.cookie(cookieName, cookieValue, options)
}

const removeCookie = async (res, cookieName) => {
  res.clearCookie(cookieName)
}

module.exports ={
    setCookie,
    removeCookie
}