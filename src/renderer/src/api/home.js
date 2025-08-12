import request from '@renderer/utils/request'

export const getCoordinates = () => request.get('/frame-coordinates')

export const setCoordinates = (data) => request.post('/frame-coordinates', data)
