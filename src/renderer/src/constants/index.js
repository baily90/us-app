export const bodyPartMap = {
  1: 'Thyroid',
  2: 'CarotidArtery',
}
export const bodySectionMap = {
  10: 'Isthmus\nLongitudinal',
  11: 'Right Lobe\nTransverse',
  12: 'Right Lobe\nLongitudinal',
  13: 'Left Lobe\nTransverse',
  14: 'Left Lobe\nLongitudinal',
  20: 'Proximal\nLongitudinal',
  21: 'IMT',
  22: 'Proximal\nTransverse',
  23: 'Mid\nLongitudinal',
  24: 'Mid\nTransverse',
  25: 'Distal\nLongitudinal',
  26: 'IMT',
  27: 'Distal\nTransverse',
}

export const tipsMap = {
  1: {
    10: 'Angulate probe 5–10° toward head/tail.', // 峡部提示文案
    11: 'Slowly rock the probe to the left or right by 5–15°', // 右侧横切提示文案
    12: 'Slowly rock the probe to the left or right by 5–10°', // 右侧纵切提示文案
    13: 'Slowly rock the probe to the left or right by 5–15°', // 左侧横切提示文案
    14: 'Slowly rock the probe to the left or right by 5–10°', // 左侧纵切提示文案
  },
  2: {
    20: '1. Slide 1–2 cm cephalad along vessel. \n2. Lift/press tail, capture image, then C&PW acquisition. ', // 近心端纵切提示文案
    21: 'Measure intimal thickening.', // 内膜测量
    22: 'Tilt tail slightly occipital. ', // 近心端横切提示文案
    23: '1. Slide 1–2 cm cephalad along vessel. \n2. Lift/press tail, capture image, then C&PW acquisition. ', // 中端纵切提示文案
    24: 'Tilt tail slightly occipital. ', // 中端横切提示文案
    25: '1. Slide 1–2 cm cephalad along vessel. \n2. Press tail, capture image, then C&PW acquisition. ', // 远心端纵切CCA/分叉提示文案
    26: 'Measure intimal thickening.', // 内膜测量
    27: 'Tilt tail slightly occipital. ', // 远心端横切CCA/分叉提示文案
  },
}
