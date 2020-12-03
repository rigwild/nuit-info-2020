// @ts-check

import store from './store'

export const API_PREFIX = process.env.VUE_APP_API_PREFIX

/**
 * Make a call to the API. Extracts the `data` property if call was successful.
 * @param {string} route API endpoint
 * @param {object} options Fetch options object
 * @param {boolean} setContentTypeJson Fetch options object
 * @returns {Promise<object>} The API's response
 */
export const API_CALL = async (route, options = {}, setContentTypeJson = true) => {
  if (!options.headers) options.headers = {}

  // Set JSON Content-Type
  if (setContentTypeJson) options.headers['Content-Type'] = 'application/json'

  // Set login token if available
  const token = store.state.token
  if (token) options.headers.authorization = `Bearer ${token}`

  // Do the actual request
  return fetch(`${API_PREFIX}${route}`, options)
    .then(async res => {
      // Add the JSON output to the HTTP response instance
      res.json = await res.json()
      return res
    })
    .then(res => {
      // @ts-ignore
      if (!res.ok) throw new Error(`${res.json.message}${res.json.data ? ' ' + res.json.data : ''}`)
      // @ts-ignore
      return res.json.data
    })
}

export const shortenApiCall = (route, body, method = body ? 'POST' : 'GET') =>
  API_CALL(route, {
    method,
    body: body ? JSON.stringify(body) : undefined
  })

export const shortenApiCallFormData = (route, bodyObject, method = 'POST') => {
  const formData = new FormData()
  Object.keys(bodyObject).forEach(key => formData.append(key, bodyObject[key]))
  return API_CALL(
    route,
    {
      method,
      body: formData
    },
    false
  )
}

const twoDigits = serializable => serializable.toString().padStart(2, '0')

/**
 * Transform a date object to a human-readable date format
 * `2019-12-31`
 * @param {Date} date Date to format
 * @returns {string} formated date
 */
export const toHumanDate = date =>
  `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`

/**
 * Transform a date object to a human-readable datetime format
 * `2019-12-31 - 24:60:60`
 * @param {Date} date Date to format
 * @returns {string} formated datetime
 */
export const toHumanDateTime = date =>
  `${toHumanDate(date)} - ${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}:${twoDigits(date.getSeconds())}`

/**
 * Get a date's week number
 *
 * @param {Date}_date Date to parse
 * @see https://stackoverflow.com/a/34323944
 * @returns {number} Week number
 */
export const getDateWeek = _date => {
  const date = new Date(_date)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}

/**
 * Remove accents from a string
 * @param {string} str String to format
 * @returns {string} formatted string
 */
export const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
