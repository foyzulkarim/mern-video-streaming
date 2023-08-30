

const setCookie = async (res, cookieName, cookieValue, options) => {
  res.cookie(cookieName, cookieValue, options)
}

module.exports ={
    setCookie
}