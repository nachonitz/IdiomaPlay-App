import React, { createContext, useEffect, useReducer, useRef, useState } from 'react';
import { authReducer, AuthState } from './AuthReducer';
import { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
// import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
// import { Notification } from 'expo-notifications';
import { colors } from '../theme/colors';
import * as Notifications from "expo-notifications";
  import * as Permissions from "expo-permissions";

type AuthContextProps =
  | {
      status: 'checking';
      logIn: (loginData: any) => void;
    }
  | {
      status: 'authenticated';
      token: string;
      logOut: () => void;
    }
  | {
      status: 'not-authenticated';
      logIn: (loginData: any) => void;
    }

const authInicialState: AuthState = {
  status: 'checking',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, authInicialState);
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState<boolean | Notification>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // checkVersionAndToken();
  }, []);

  const storeTokens = async (token: string, refreshToken: string) => {
    await AsyncStorage.setItem('token', token);
		await AsyncStorage.setItem('refreshToken', refreshToken);
		await AsyncStorage.setItem('expoPushToken', expoPushToken);
  };
  
  
  const askPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
    return true;
  };
  const scheduleNotification = async () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    let notificationId =  Notifications.scheduleNotificationAsync({
      content: {
      title: 'IdiomaPlay!',
      body: 'Completa ejercicios todos los dias para mantener el ritmo! :)'
      },
      trigger: {
      repeats: false,
      seconds: 30,
      }
      });
    console.log(notificationId);
  };

  const logIn = async () => {
    try {
      // const resp = await facimexApi.post('/user/login', {
      //   email,
      //   password,
      // });
      // // const decodingResult: e.Either<t.Errors, LoginResponse> =
      // //   LoginResponseCodec.decode(resp.data);
			// if (Constants.isDevice) {
			// 	const expoToken = await registerForPushNotificationsAsync();
			// 	await facimexApi.post(
			// 		'/user/expoPushToken',
			// 		{ expoPushToken: expoToken },
			// 		{
			// 			headers: {
			// 				Authorization: resp.data.data.session.token,
			// 			},
			// 		}
			// 	)
			// }

        scheduleNotification()
    
      
			var googleToken = ''
      dispatch({
				type: 'logIn',
        payload: {token: googleToken},
      });
			
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  const logOut = async () => {

		await AsyncStorage.removeItem('token');

    dispatch({
      type: 'logOut',
    });
  };

	

  if (state.status == 'not-authenticated') {
    return (
      <AuthContext.Provider
        value={{
          ...state,
          logIn,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  } else if (state.status == 'checking') {
    return (
      <AuthContext.Provider
        value={{
          ...state,
          logIn,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  } 
  else {
    return (
      <AuthContext.Provider
        value={{
          ...state,
          logOut,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
};