import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  white?: boolean
}

export const CustomBackArrow = ({white}: Props) => {

  const navigation = useNavigation()
  
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      activeOpacity={0.6}
    >
      <Icon name='chevron-back-outline' size={30} color={white? 'white': 'black'}/>
    </TouchableOpacity>
  )
}
