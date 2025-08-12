import { defineConfig } from 'unocss'
import { presetWind3, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [presetWind3(), presetAttributify()],
  rules: []
})
