import { createStackNavigator } from 'react-navigation'

import {
    SplashScreen,
    SignInScreen,
    SignUpScreen,
    OrderScreen,
    ServiceProcessScreen,
    RatingScreen,
    SettingsScreen,
    HomeDriverScreen,
} from '../screens'
import AppNavigator from './AppNavigator';
import { fadeIn } from 'react-navigation-transitions';

const MainNavigator = createStackNavigator(
    {
        Splash: SplashScreen,
        Settings: SettingsScreen,
        HomeDriver: HomeDriverScreen,
        SignUp: SignUpScreen,
        SignIn: SignInScreen,
        App: AppNavigator,
        Order: OrderScreen,
        ServiceProcess: ServiceProcessScreen,
        Rating: RatingScreen,
    },
    {
        headerMode: 'none',
        transitionConfig: () => fadeIn(),
    }
);

export default MainNavigator;