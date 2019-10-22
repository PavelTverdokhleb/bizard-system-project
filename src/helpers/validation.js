export const required = value => (value || typeof value === 'number' ? undefined : 'Required');

export const minLength = min => value =>
    value && value.length < min ? `Must be more than ${min} characters` : undefined

export const minAmount = min => value =>
    value && value < min ? `Field must be greater than ${min}` : undefined

export const number = value =>
    value && isNaN(Number(value)) ? 'Must be a number' : undefined

export const integerNumber = value =>
    value && !Number.isInteger(Number(value)) ? 'Enter only integer number' : undefined

export const minValue = min => value =>
    value && value < min ? `Must be at least ${min}` : undefined

export const maxValue = max => value =>
    value && value > max ? `Must be less than ${max} or equal` : undefined

export const percents = value =>
    value && value < 0 || value && value > 100 ? 'Number between 0 and 100' : undefined

export const symbolsAfterDot = value =>
    value && !/^[+-]?([0-9]*[.])?[0-9]{1,3}$/i.test(value)
        ? 'Only 3 symbols after dot'
        : undefined

export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Invalid email'
        : undefined

export const phoneNumber = value =>
    value && !/^([0-9])$/i.test(value)
        ? 'Invalid phone number'
        : undefined

export const checked = value =>
    value && value
        ? 'Must be checked'
        : undefined

export const equal = val => value =>
    value !== val
        ? 'Must be equal'
        : undefined

export const isUrlValid = value =>
    value.match(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) == null
        ? 'Enter a valid URL'
        : undefined