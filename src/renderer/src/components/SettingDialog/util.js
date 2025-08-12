export const getInitialData = (data) => {
  const {
    initial_ultrasound_frame_x = 0,
    initial_ultrasound_frame_y = 0,
    initial_ultrasound_frame_width = 0,
    initial_ultrasound_frame_height = 0,
  } = data
  if (initial_ultrasound_frame_width && initial_ultrasound_frame_height) {
    return [
      {
        coor: [
          [initial_ultrasound_frame_x, initial_ultrasound_frame_y],
          [
            initial_ultrasound_frame_x + initial_ultrasound_frame_width,
            initial_ultrasound_frame_y + initial_ultrasound_frame_height,
          ],
        ],
        type: 1,
      },
    ]
  }
  return null
}

export const transformToCanvas = (type, data) => {
  const {
    ultrasound_frame_x = 0,
    ultrasound_frame_y = 0,
    ultrasound_frame_width = 0,
    ultrasound_frame_height = 0,
    patient_info_frame_x = 0,
    patient_info_frame_y = 0,
    patient_info_frame_width = 0,
    patient_info_frame_height = 0,
    position_frame_x = 0,
    position_frame_y = 0,
    position_frame_width = 0,
    position_frame_height = 0,
    initial_ultrasound_frame_x = 0,
    initial_ultrasound_frame_y = 0,
    initial_ultrasound_frame_width = 0,
    initial_ultrasound_frame_height = 0,
  } = data
  if (type === 'ultrasound') {
    if (ultrasound_frame_width && ultrasound_frame_height) {
      return [
        {
          coor: [
            [ultrasound_frame_x, ultrasound_frame_y],
            [
              ultrasound_frame_x + ultrasound_frame_width,
              ultrasound_frame_y + ultrasound_frame_height,
            ],
          ],
          type: 1,
        },
      ]
    }
  } else if (type === 'position') {
    if (position_frame_width && position_frame_height) {
      return [
        {
          coor: [
            [position_frame_x, position_frame_y],
            [position_frame_x + position_frame_width, position_frame_y + position_frame_height],
          ],
          type: 1,
        },
      ]
    }
  } else if (type === 'patient') {
    if (patient_info_frame_width && patient_info_frame_height) {
      return [
        {
          coor: [
            [patient_info_frame_x, patient_info_frame_y],
            [
              patient_info_frame_x + patient_info_frame_width,
              patient_info_frame_y + patient_info_frame_height,
            ],
          ],
          type: 1,
        },
      ]
    }
  }
  return null
}

export const transformToData = (type, data) => {
  const { coor } = data[0]
  const x = coor[0][0]
  const y = coor[0][1]
  const width = Math.abs(coor[0][0] - coor[1][0])
  const height = Math.abs(coor[0][1] - coor[1][1])

  if (type === 'ultrasound') {
    return {
      ultrasound_frame_x: x,
      ultrasound_frame_y: y,
      ultrasound_frame_width: width,
      ultrasound_frame_height: height,
    }
  } else if (type === 'position') {
    return {
      position_frame_x: x,
      position_frame_y: y,
      position_frame_width: width,
      position_frame_height: height,
    }
  } else if (type === 'patient') {
    return {
      patient_info_frame_x: x,
      patient_info_frame_y: y,
      patient_info_frame_width: width,
      patient_info_frame_height: height,
    }
  } else if (type === 'initial') {
    return {
      initail_frame_x: x,
      initail_frame_y: y,
      initail_frame_width: width,
      initail_frame_height: height,
    }
  }
}

export const resetToInitial = (data) => {
  const { coor } = data[0]
  const x = coor[0][0]
  const y = coor[0][1]
  const width = Math.abs(coor[0][0] - coor[1][0])
  const height = Math.abs(coor[0][1] - coor[1][1])
  return {
    initail_frame_x: x,
    initail_frame_y: y,
    initail_frame_width: width,
    initail_frame_height: height,
  }
}
