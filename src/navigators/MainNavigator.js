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
    HomeScreen,
    DriverLaundryHomeScreen,
} from '../screens'
import AppNavigator from './AppNavigator';
import { fadeIn } from 'react-navigation-transitions';

const MainNavigator = createStackNavigator(
    {
        Splash: SplashScreen,
        SignUp: SignUpScreen,
        SignIn: SignInScreen,
        // App: AppNavigator,
        Settings: SettingsScreen,
        DriverLaundryHome: DriverLaundryHomeScreen,
        // HomeDriver: HomeDriverScreen,
        Home: HomeScreen,
        Order: OrderScreen,
        // ServiceProcess: ServiceProcessScreen,
        Rating: RatingScreen,
    },
    {
        headerMode: 'none',
        transitionConfig: () => fadeIn(),
    }
);

export default MainNavigator;