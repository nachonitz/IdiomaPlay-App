import React from 'react'

export const TypeToInstruction = (type: string) => {
  
    if(type.localeCompare('complete') === 0)
      return 'Completa la frase con la opción correcta'
      
    if(type.localeCompare('translate_old_to_new') === 0)
      return 'Traduzca la frase'
      
    if(type.localeCompare('translate_new_to_old') === 0)
      return 'Traduzca la frase'

  return type
}
