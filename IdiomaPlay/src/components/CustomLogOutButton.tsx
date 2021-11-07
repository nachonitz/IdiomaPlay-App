import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

interface Props {
  white?: boolean
}

export const CustomLogOutButton = ({white}: Props) => {
  const context = useContext(AuthContext)
  const navigation = useNavigation()
  
  return (
    <TouchableOpacity
      onPress={() => {context.status == 'authenticated' && context.logOut()}}
      activeOpacity={0.6}
    >
      <Icon name='log-out-outline' size={40} color={'white'}/>
    </TouchableOpacity>
  )
}
